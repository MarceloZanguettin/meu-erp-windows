# Melhoria 09 — Observabilidade: Logging Estruturado

**Categoria**: Observabilidade  
**Prioridade**: 🟡 Médio  
**Esforço estimado**: 1 hora  
**Risco se ignorado**: Erros em produção são impossíveis de auditar ou correlacionar com requests específicos

---

## Problema

O backend não possui logging estruturado. Os únicos outputs são prints coloridos no terminal via `start.py` e mensagens padrão do uvicorn:

```python
# backend/main.py (ATUAL — ausência de logging)
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    # Sem log de startup, sem log de erros, sem rastreamento de requests
```

```python
# backend/core/security.py (ATUAL)
def registrar_falha(ip: str) -> None:
    # Sem log quando um IP é bloqueado por força bruta
    _tentativas_login[ip].append(agora)
    if len(_tentativas_login[ip]) >= MAX_TENTATIVAS:
        _bloqueios[ip] = agora + timedelta(seconds=BLOQUEIO_SEGUNDOS)
        # ← Nenhum alerta de segurança aqui
```

### Consequências em produção

1. Um erro 500 acontece — não há como saber qual request causou, qual usuário estava logado, ou o stack trace completo
2. Um IP está fazendo 100 tentativas de login — não há alerta
3. O banco de dados ficou offline por 2 minutos — não há registro do evento
4. Tempo de resposta de um endpoint aumentou 10x — invisível

---

## Solução — Logging estruturado com middleware de request

### Arquitetura

```
[Request]
    ↓
[Middleware de logging]
    ↓ Registra: método, rota, IP, duração, status, user
[Controller]
    ↓
[Serviço/Repository]
    ↓ Log de erros com contexto
[Response]
    ↓
[Middleware de logging] — finaliza o log com status e duração
```

### Passo 1 — Criar `backend/core/logging_config.py`

```python
# backend/core/logging_config.py
import logging
import sys
import json
from datetime import datetime, timezone


class JSONFormatter(logging.Formatter):
    """Formata logs como JSON para facilitar parsing por aggregators (Datadog, Loki, etc.)."""
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Incluir campos extras se existirem (adicionados via extra={})
        extras = ["request_id", "method", "path", "status_code", "duration_ms",
                  "user", "ip", "error_type"]
        for field in extras:
            if hasattr(record, field):
                log_entry[field] = getattr(record, field)
        
        # Incluir stack trace em erros
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_entry, ensure_ascii=False)


def configurar_logging() -> None:
    """Configura logging da aplicação. Chamar uma vez no startup."""
    
    # Remover handlers padrão
    root = logging.getLogger()
    root.handlers.clear()
    
    # Handler para stdout
    handler = logging.StreamHandler(sys.stdout)
    
    # Em desenvolvimento: formato legível
    # Em produção: JSON (detectado pela variável de ambiente)
    import os
    if os.getenv("LOG_FORMAT", "text") == "json":
        handler.setFormatter(JSONFormatter())
    else:
        handler.setFormatter(logging.Formatter(
            "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        ))
    
    # Nível de log configurável
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    root.setLevel(getattr(logging, level, logging.INFO))
    root.addHandler(handler)
    
    # Reduzir verbosidade de libs terceiras
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
```

### Passo 2 — Criar middleware de request em `backend/core/request_logging.py`

```python
# backend/core/request_logging.py
import time
import uuid
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("erp.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Loga cada request com: método, rota, IP, duração, status HTTP."""
    
    # Rotas que não precisam ser logadas (reduz ruído)
    ROTAS_SILENCIOSAS = {"/api/status", "/api/health"}
    
    async def dispatch(self, request: Request, call_next) -> Response:
        # Gerar ID único para correlacionar logs do mesmo request
        request_id = str(uuid.uuid4())[:8]
        
        # Extrair IP real (considera proxies reversos)
        ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
        
        inicio = time.perf_counter()
        
        try:
            response = await call_next(request)
            duracao_ms = round((time.perf_counter() - inicio) * 1000, 2)
            
            # Não logar rotas silenciosas
            if request.url.path not in self.ROTAS_SILENCIOSAS:
                nivel = logging.WARNING if response.status_code >= 400 else logging.INFO
                logger.log(
                    nivel,
                    f"{request.method} {request.url.path} → {response.status_code} ({duracao_ms}ms)",
                    extra={
                        "request_id": request_id,
                        "method": request.method,
                        "path": request.url.path,
                        "status_code": response.status_code,
                        "duration_ms": duracao_ms,
                        "ip": ip,
                    }
                )
            
            # Propagar request_id na resposta (facilita debugging)
            response.headers["X-Request-ID"] = request_id
            return response
            
        except Exception as exc:
            duracao_ms = round((time.perf_counter() - inicio) * 1000, 2)
            logger.error(
                f"Exceção não tratada: {request.method} {request.url.path}",
                exc_info=exc,
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "duration_ms": duracao_ms,
                    "ip": ip,
                    "error_type": type(exc).__name__,
                }
            )
            raise
```

### Passo 3 — Adicionar loggers nos serviços críticos

```python
# backend/core/security.py (com logging)
import logging

logger = logging.getLogger("erp.security")

def registrar_falha(ip: str) -> None:
    # ...lógica atual...
    if len(_tentativas_login[ip]) >= MAX_TENTATIVAS:
        _bloqueios[ip] = agora + timedelta(seconds=BLOQUEIO_SEGUNDOS)
        logger.warning(
            f"IP bloqueado por força bruta: {ip} ({MAX_TENTATIVAS} tentativas em 5min)",
            extra={"ip": ip, "event": "brute_force_blocked"}
        )

def esta_bloqueado(ip: str) -> bool:
    bloqueado = ip in _bloqueios and datetime.utcnow() < _bloqueios[ip]
    if bloqueado:
        logger.info(f"Tentativa bloqueada de IP: {ip}", extra={"ip": ip})
    return bloqueado
```

```python
# backend/core/error_handler.py (com logging)
import logging

logger = logging.getLogger("erp.errors")

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(
        f"Erro interno: {type(exc).__name__}: {exc}",
        exc_info=exc,
        extra={"path": request.url.path, "method": request.method}
    )
    return JSONResponse(status_code=500, content={"detail": "Erro interno do servidor"})
```

### Passo 4 — Atualizar `backend/main.py`

```python
# backend/main.py (com logging configurado)
from core.logging_config import configurar_logging
from core.request_logging import RequestLoggingMiddleware
import logging

# Primeira coisa no startup — antes de qualquer outro import de log
configurar_logging()
logger = logging.getLogger("erp.startup")

app = FastAPI(title="ERP", version="1.0.0")

# Middleware de logging antes do CORS (para logar tudo)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(CORSMiddleware, ...)

@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Banco de dados conectado e tabelas criadas")
    except Exception as e:
        logger.critical(f"✗ Falha ao conectar ao banco: {e}", exc_info=e)
        raise
```

### Passo 5 — Adicionar variáveis ao `.env.example`

```bash
# Configuração de logging
# text: formato legível (desenvolvimento)
# json: formato JSON estruturado (produção)
LOG_FORMAT=text

# Nível de log: DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL=INFO
```

---

## Exemplo de saída em desenvolvimento (texto)

```
2026-07-02 14:23:15 | INFO     | erp.startup  | ✓ Banco de dados conectado
2026-07-02 14:23:22 | INFO     | erp.request  | POST /api/login → 200 (45.2ms)
2026-07-02 14:23:25 | INFO     | erp.request  | GET /financeiro/contas-pagar → 200 (12.1ms)
2026-07-02 14:23:30 | WARNING  | erp.security | IP bloqueado por força bruta: 192.168.1.50
2026-07-02 14:23:31 | WARNING  | erp.request  | POST /api/login → 429 (1.2ms)
2026-07-02 14:23:45 | ERROR    | erp.errors   | Erro interno: KeyError: 'empresa_id'
```

## Exemplo de saída em produção (JSON)

```json
{"timestamp":"2026-07-02T14:23:15Z","level":"INFO","logger":"erp.startup","message":"✓ Banco de dados conectado"}
{"timestamp":"2026-07-02T14:23:22Z","level":"INFO","logger":"erp.request","message":"POST /api/login → 200","method":"POST","path":"/api/login","status_code":200,"duration_ms":45.2,"ip":"192.168.1.100","request_id":"a3f8c2d1"}
{"timestamp":"2026-07-02T14:23:30Z","level":"WARNING","logger":"erp.security","message":"IP bloqueado por força bruta","ip":"192.168.1.50","event":"brute_force_blocked"}
```

---

## Integração com ferramentas externas

```bash
# Exportar logs para arquivo
docker compose logs -f backend > erp.log 2>&1

# Filtrar apenas erros
docker compose logs backend | python -c "
import sys, json
for line in sys.stdin:
    try:
        log = json.loads(line)
        if log['level'] in ['ERROR', 'CRITICAL']:
            print(line.strip())
    except: pass
"

# Integração futura com Loki/Grafana, Datadog, ou Seq
# Os logs JSON são ingeridos diretamente por essas ferramentas
```

---

## Benefícios

- Rastreamento de requests por ID correlacionado
- Alertas de segurança (bloqueio de força bruta) visíveis
- Diagnóstico de erros com stack trace completo
- Logs JSON prontos para ingestão em Loki, Datadog, Splunk
- Tempo de resposta de cada endpoint monitorado
- Nível de log ajustável sem reiniciar (via variável de ambiente)
