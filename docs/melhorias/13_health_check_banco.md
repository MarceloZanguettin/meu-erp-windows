# Melhoria 13 — Observabilidade: Health Check Real do Banco de Dados

**Categoria**: Observabilidade  
**Prioridade**: 🟢 Baixo  
**Esforço estimado**: 30 minutos  
**Risco se ignorado**: Load balancers e orquestradores (Docker, Kubernetes) não conseguem detectar quando o backend está operacional mas sem banco

---

## Problema

O endpoint de status atual sempre retorna 200, independentemente do estado do banco de dados:

```python
# backend/controllers/sistema_controller.py (ATUAL — PROBLEMA)
from fastapi import APIRouter
router = APIRouter()

@router.get("/api/status")
def status():
    return {"status": "online"}   # ← Sempre 200, mesmo com banco offline
```

### Consequências

1. **Docker healthcheck**: `depends_on: condition: service_healthy` não funciona corretamente — o container "parece" saudável quando o banco está offline
2. **Load balancer**: Não remove a instância doente do pool de servidores
3. **Kubernetes liveness probe**: Não reinicia o pod quando o banco cai
4. **Monitoramento**: Alertas não disparam quando o banco fica indisponível

---

## Solução — Health Check com verificação real

### Passo 1 — Atualizar `backend/controllers/sistema_controller.py`

```python
# backend/controllers/sistema_controller.py (PROPOSTO)
import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

router = APIRouter()


@router.get("/api/status")
def status():
    """Retorna apenas se o serviço está rodando (sem verificar dependências)."""
    return {
        "status": "online",
        "servico": "ERP API",
        "versao": "1.0.0"
    }


@router.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    """
    Health check completo — verifica todas as dependências.
    Usado por: Docker healthcheck, load balancers, Kubernetes probes.
    
    Retorna 200 se tudo OK.
    Retorna 503 se alguma dependência estiver indisponível.
    """
    resultados = {
        "status": "healthy",
        "timestamp": time.time(),
        "checks": {}
    }
    
    # ─── Verificar banco de dados ──────────────────────────────────────
    inicio_db = time.perf_counter()
    try:
        db.execute(text("SELECT 1"))
        tempo_db_ms = round((time.perf_counter() - inicio_db) * 1000, 2)
        resultados["checks"]["database"] = {
            "status": "healthy",
            "latencia_ms": tempo_db_ms
        }
    except Exception as e:
        resultados["status"] = "unhealthy"
        resultados["checks"]["database"] = {
            "status": "unhealthy",
            "erro": str(e)
        }
    
    # ─── Verificar Redis (se configurado) ─────────────────────────────
    try:
        import os
        if os.getenv("REDIS_URL"):
            from core.redis_client import get_redis
            inicio_redis = time.perf_counter()
            r = get_redis()
            r.ping()
            tempo_redis_ms = round((time.perf_counter() - inicio_redis) * 1000, 2)
            resultados["checks"]["redis"] = {
                "status": "healthy",
                "latencia_ms": tempo_redis_ms
            }
    except Exception as e:
        resultados["status"] = "degraded"  # Redis é opcional — apenas "degradado"
        resultados["checks"]["redis"] = {
            "status": "unhealthy",
            "erro": str(e)
        }
    
    # Retornar 503 se alguma dependência crítica falhou
    if resultados["status"] == "unhealthy":
        raise HTTPException(
            status_code=503,
            detail=resultados
        )
    
    return resultados


@router.get("/api/ready")
def readiness_check(db: Session = Depends(get_db)):
    """
    Readiness check — verifica se o serviço está pronto para receber tráfego.
    Diferente do liveness: pode retornar 503 temporariamente (ex: durante migrations).
    """
    try:
        # Verifica se as tabelas principais existem
        db.execute(text("SELECT COUNT(*) FROM usuarios LIMIT 1"))
        return {"ready": True}
    except Exception:
        raise HTTPException(
            status_code=503,
            detail={"ready": False, "motivo": "Banco indisponível ou schema não inicializado"}
        )
```

### Passo 2 — Integrar com Docker Compose

```yaml
# docker-compose.yml (atualizar serviço backend)
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8050/api/health"]
      interval: 30s        # Verifica a cada 30s
      timeout: 10s         # Timeout de 10s para a resposta
      retries: 3           # 3 falhas consecutivas = unhealthy
      start_period: 60s    # Aguarda 60s antes de começar (tempo para migrations)
```

### Passo 3 — Integrar com Kubernetes (quando aplicável)

```yaml
# kubernetes/deployment.yaml (referência futura)
containers:
  - name: erp-backend
    image: erp-backend:latest
    
    # Liveness: Se falhar, reinicia o pod
    livenessProbe:
      httpGet:
        path: /api/status     # Endpoint simples (sem banco)
        port: 8050
      initialDelaySeconds: 30
      periodSeconds: 10
      failureThreshold: 3
    
    # Readiness: Se falhar, remove do load balancer (sem reiniciar)
    readinessProbe:
      httpGet:
        path: /api/health     # Endpoint completo (com banco)
        port: 8050
      initialDelaySeconds: 20
      periodSeconds: 15
      failureThreshold: 2
```

---

## Exemplo de respostas

### Tudo saudável (200)

```json
{
  "status": "healthy",
  "timestamp": 1751490000.123,
  "checks": {
    "database": {
      "status": "healthy",
      "latencia_ms": 3.2
    },
    "redis": {
      "status": "healthy",
      "latencia_ms": 0.8
    }
  }
}
```

### Banco offline (503)

```json
{
  "status": "unhealthy",
  "timestamp": 1751490000.456,
  "checks": {
    "database": {
      "status": "unhealthy",
      "erro": "could not connect to server: Connection refused"
    }
  }
}
```

### Redis offline mas banco OK (200 — degradado)

```json
{
  "status": "degraded",
  "timestamp": 1751490000.789,
  "checks": {
    "database": {
      "status": "healthy",
      "latencia_ms": 2.1
    },
    "redis": {
      "status": "unhealthy",
      "erro": "Connection refused to localhost:6379"
    }
  }
}
```

---

## Testar manualmente

```bash
# Health check completo
curl http://localhost:8050/api/health | python -m json.tool

# Status simples (sem banco)
curl http://localhost:8050/api/status

# Simular banco offline e verificar resposta
# Parar PostgreSQL e chamar /api/health → deve retornar 503
```

---

## Benefícios

- Docker `depends_on: condition: service_healthy` funciona corretamente
- Load balancers removem instâncias doentes automaticamente
- Latência do banco visível a cada check (detecta degradação gradual)
- Distinção entre `healthy`, `degraded` e `unhealthy` para alertas granulares
- Base para integração com Prometheus/Grafana via métricas de health
