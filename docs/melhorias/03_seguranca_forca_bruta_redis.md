# Melhoria 03 — Segurança: Proteção contra Força Bruta com Redis

**Categoria**: Segurança  
**Prioridade**: 🔴 Crítico  
**Esforço estimado**: 2 horas  
**Risco se ignorado**: Em produção com múltiplos workers ou reinicializações, o bloqueio de IPs se perde e ataques de força bruta resetam automaticamente

---

## Problema

O sistema de proteção contra força bruta em `backend/core/security.py` armazena tentativas de login em um dicionário Python em memória:

```python
# backend/core/security.py (ATUAL — PROBLEMA)
_tentativas_login: dict[str, list[datetime]] = {}  # ← Memória do processo
_bloqueios: dict[str, datetime] = {}               # ← Memória do processo

def registrar_falha(ip: str) -> None:
    agora = datetime.utcnow()
    _tentativas_login.setdefault(ip, [])
    # Filtra apenas tentativas dos últimos 5 minutos
    _tentativas_login[ip] = [
        t for t in _tentativas_login[ip]
        if (agora - t).seconds < 300
    ]
    _tentativas_login[ip].append(agora)
    if len(_tentativas_login[ip]) >= MAX_TENTATIVAS:
        _bloqueios[ip] = agora + timedelta(seconds=BLOQUEIO_SEGUNDOS)
```

### Por que isso é problemático

1. **Reinicialização do processo**: Se o servidor reiniciar (update, crash, etc.), todos os bloqueios são perdidos. Um atacante pode forçar uma reinicialização para zerar o contador
2. **Múltiplos workers**: Se uvicorn rodar com `--workers 4`, cada worker tem seu próprio dicionário. Um atacante pode fazer 5 tentativas em cada worker = 20 tentativas sem ser bloqueado
3. **Horizontal scaling**: Se o sistema escalar para múltiplas máquinas, o bloqueio não é compartilhado entre instâncias

---

## Solução

### Arquitetura proposta

Substituir os dicionários em memória por Redis, que é um store compartilhado persistente:

```
[Requisição de Login]
        ↓
[FastAPI Worker 1 ou 2 ou N]
        ↓
[Redis — estado compartilhado]
  key: "login_bloqueio:192.168.1.100"  TTL: 900s
  key: "login_tentativas:192.168.1.100" TTL: 300s
```

### Passo 1 — Instalar dependências

```bash
# Ativar venv
source venv/Scripts/activate  # Windows

# Instalar redis-py
pip install redis[hiredis]

# Adicionar ao requirements.txt (ver melhoria 06)
redis[hiredis]==5.0.8
```

### Passo 2 — Configurar Redis

**Desenvolvimento**: Instalar Redis localmente

```bash
# Windows — via WSL2
wsl --install
# Dentro do WSL:
sudo apt-get install redis-server
sudo service redis-server start

# Ou via Docker (se tiver Docker instalado)
docker run -d --name redis-erp -p 6379:6379 redis:7-alpine
```

**Verificar se está rodando**:
```bash
redis-cli ping
# Saída esperada: PONG
```

Adicionar ao `backend/.env.example`:
```bash
# URL de conexão com Redis
# Desenvolvimento: redis://localhost:6379/0
# Produção: redis://usuario:senha@redis-host:6379/0
REDIS_URL=redis://localhost:6379/0
```

### Passo 3 — Criar `backend/core/redis_client.py`

```python
# backend/core/redis_client.py
import os
import redis
from typing import Optional

_client: Optional[redis.Redis] = None

def get_redis() -> redis.Redis:
    global _client
    if _client is None:
        url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        _client = redis.from_url(url, decode_responses=True)
    return _client
```

### Passo 4 — Reescrever `backend/core/security.py`

```python
# backend/core/security.py (PROPOSTO — apenas as funções de força bruta)
import os
from .redis_client import get_redis

MAX_TENTATIVAS = 5
JANELA_SEGUNDOS = 300    # 5 minutos
BLOQUEIO_SEGUNDOS = 900  # 15 minutos

def esta_bloqueado(ip: str) -> bool:
    """Verifica se o IP está bloqueado no Redis."""
    r = get_redis()
    return r.exists(f"login_bloqueio:{ip}") == 1

def registrar_falha(ip: str) -> None:
    """Registra uma tentativa falha. Bloqueia se atingir o limite."""
    r = get_redis()
    chave_tentativas = f"login_tentativas:{ip}"
    
    # Incrementa contador com TTL de 5 minutos
    pipe = r.pipeline()
    pipe.incr(chave_tentativas)
    pipe.expire(chave_tentativas, JANELA_SEGUNDOS)
    resultados = pipe.execute()
    
    total_tentativas = resultados[0]
    
    if total_tentativas >= MAX_TENTATIVAS:
        # Criar chave de bloqueio com TTL de 15 minutos
        r.setex(f"login_bloqueio:{ip}", BLOQUEIO_SEGUNDOS, "bloqueado")
        r.delete(chave_tentativas)  # Limpar contador

def limpar_tentativas(ip: str) -> None:
    """Limpa tentativas após login bem-sucedido."""
    r = get_redis()
    r.delete(f"login_tentativas:{ip}")
    r.delete(f"login_bloqueio:{ip}")
```

### Passo 5 — Fallback quando Redis não está disponível

Para não derrubar o sistema se o Redis ficar offline:

```python
# backend/core/security.py (com fallback)
import logging
from .redis_client import get_redis

logger = logging.getLogger(__name__)

# Fallback em memória (apenas quando Redis está offline)
_fallback_bloqueios: dict = {}

def esta_bloqueado(ip: str) -> bool:
    try:
        r = get_redis()
        return r.exists(f"login_bloqueio:{ip}") == 1
    except Exception as e:
        logger.warning(f"Redis indisponível, usando fallback em memória: {e}")
        return ip in _fallback_bloqueios

def registrar_falha(ip: str) -> None:
    try:
        r = get_redis()
        chave = f"login_tentativas:{ip}"
        total = r.incr(chave)
        r.expire(chave, JANELA_SEGUNDOS)
        if total >= MAX_TENTATIVAS:
            r.setex(f"login_bloqueio:{ip}", BLOQUEIO_SEGUNDOS, "1")
            r.delete(chave)
    except Exception as e:
        logger.warning(f"Redis indisponível: {e}")
        # Fallback: bloquear diretamente na memória
        _fallback_bloqueios[ip] = True
```

---

## Estrutura de chaves Redis

```
login_tentativas:{ip}   → contador (int)    TTL: 300s (5 min)
login_bloqueio:{ip}     → "bloqueado"       TTL: 900s (15 min)
```

Inspecionar via redis-cli:
```bash
# Ver todas as chaves de login
redis-cli KEYS "login_*"

# Ver detalhes de um IP específico
redis-cli GET "login_tentativas:192.168.1.100"
redis-cli TTL "login_bloqueio:192.168.1.100"

# Desbloquear manualmente um IP
redis-cli DEL "login_bloqueio:192.168.1.100"
```

---

## Verificação após implementação

```bash
# 1. Confirmar que Redis está rodando
redis-cli ping
# PONG

# 2. Testar 5 logins errados seguidos
for i in {1..6}; do
  curl -X POST http://localhost:8050/api/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"senha-errada"}'
  echo ""
done
# 6ª tentativa deve retornar 429 (Too Many Requests)

# 3. Reiniciar o backend e confirmar que o bloqueio persiste
# Ctrl+C no backend, reiniciar, testar o mesmo IP
# Deve ainda estar bloqueado (está no Redis, não na memória)
```

---

## Benefícios

- Bloqueio persiste entre reinicializações do servidor
- Funciona corretamente com múltiplos workers (`--workers 4`)
- Pronto para horizontal scaling
- Chaves com TTL nativo — sem vazamento de memória
- Redis-cli permite administração manual dos bloqueios
