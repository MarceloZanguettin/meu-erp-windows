# Melhoria 11 — Correção: Numeração de Documentos Thread-Safe

**Categoria**: Correção de Bug  
**Prioridade**: 🟢 Baixo  
**Esforço estimado**: 1 hora  
**Risco se ignorado**: Em condições de concorrência, dois documentos podem receber o mesmo número (ex: dois SC-0001)

---

## Problema

A geração de números de documentos (SC-0001, PC-0001, ORC-0001, PV-0001) usa uma abordagem que é vulnerável a condições de corrida (race conditions):

```python
# backend/controllers/compras_controller.py (ATUAL — PROBLEMA)
@router.post("/solicitacoes")
def criar_solicitacao(dados: SolicitacaoCompraCreate, db: Session = Depends(get_db)):
    # Busca o maior número atual e incrementa
    ultima = db.query(SolicitacaoCompra).order_by(
        SolicitacaoCompra.id.desc()
    ).first()
    
    proximo_num = (ultima.id + 1) if ultima else 1
    numero = f"SC-{proximo_num:04d}"  # ← Não é atômico!
    
    nova = SolicitacaoCompra(numero=numero, ...)
    db.add(nova)
    db.commit()
```

### Cenário de falha (race condition)

```
Request A                    Request B
──────────                   ──────────
query MAX(id) = 5            
                             query MAX(id) = 5
numero = "SC-0006"           
                             numero = "SC-0006"  ← MESMO NÚMERO!
INSERT SC-0006               
                             INSERT SC-0006  ← Duplicata!
```

Quando dois usuários criam uma solicitação ao mesmo tempo, ambos leem `MAX(id) = 5` antes de qualquer um fazer o INSERT, resultando em dois documentos `SC-0006`.

---

## Solução — SEQUENCE do PostgreSQL

### Opção A (Recomendada) — Usar SEQUENCE nativa do PostgreSQL

O PostgreSQL tem suporte nativo a sequences, que são atômicas por design: mesmo com milhares de requests simultâneos, cada um recebe um número único.

#### Passo 1 — Criar as sequences via migration Alembic

```python
# alembic/versions/XXXX_criar_sequences_documentos.py
from alembic import op

def upgrade():
    # Sequences para cada tipo de documento
    op.execute("CREATE SEQUENCE IF NOT EXISTS seq_solicitacao_compra START 1 INCREMENT 1")
    op.execute("CREATE SEQUENCE IF NOT EXISTS seq_pedido_compra START 1 INCREMENT 1")
    op.execute("CREATE SEQUENCE IF NOT EXISTS seq_orcamento START 1 INCREMENT 1")
    op.execute("CREATE SEQUENCE IF NOT EXISTS seq_pedido_venda START 1 INCREMENT 1")
    
    # Iniciar a partir do maior ID atual (se já há dados)
    op.execute("""
        SELECT setval('seq_solicitacao_compra', 
               GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM solicitacoes_compra)))
    """)
    op.execute("""
        SELECT setval('seq_pedido_compra',
               GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM pedidos_compra)))
    """)
    op.execute("""
        SELECT setval('seq_orcamento',
               GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM orcamentos)))
    """)
    op.execute("""
        SELECT setval('seq_pedido_venda',
               GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM pedidos_venda)))
    """)

def downgrade():
    op.execute("DROP SEQUENCE IF EXISTS seq_solicitacao_compra")
    op.execute("DROP SEQUENCE IF EXISTS seq_pedido_compra")
    op.execute("DROP SEQUENCE IF EXISTS seq_orcamento")
    op.execute("DROP SEQUENCE IF EXISTS seq_pedido_venda")
```

#### Passo 2 — Criar helper para gerar números

```python
# backend/core/numeracao.py (NOVO ARQUIVO)
from sqlalchemy.orm import Session
from sqlalchemy import text

# Mapeamento: tipo → nome da sequence
SEQUENCES = {
    "SC": "seq_solicitacao_compra",
    "PC": "seq_pedido_compra",
    "ORC": "seq_orcamento",
    "PV": "seq_pedido_venda",
}

def proximo_numero(prefixo: str, db: Session) -> str:
    """
    Gera o próximo número de documento usando SEQUENCE do PostgreSQL.
    Atômico e thread-safe: nunca gera duplicatas mesmo com concorrência.
    
    Exemplo: proximo_numero("SC", db) → "SC-0042"
    """
    sequence = SEQUENCES.get(prefixo)
    if not sequence:
        raise ValueError(f"Prefixo desconhecido: {prefixo}")
    
    result = db.execute(text(f"SELECT nextval('{sequence}')"))
    numero_int = result.scalar()
    
    return f"{prefixo}-{numero_int:04d}"
```

#### Passo 3 — Atualizar os controllers

```python
# backend/controllers/compras_controller.py (PROPOSTO)
from core.numeracao import proximo_numero

@router.post("/solicitacoes")
def criar_solicitacao(
    dados: SolicitacaoCompraCreate,
    db: Session = Depends(get_db)
):
    numero = proximo_numero("SC", db)   # ← Atômico, thread-safe
    
    nova = SolicitacaoCompra(
        numero=numero,
        data=dados.data,
        # ... demais campos
    )
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova


@router.post("/pedidos")
def criar_pedido_compra(
    dados: PedidoCompraCreate,
    db: Session = Depends(get_db)
):
    numero = proximo_numero("PC", db)   # ← Thread-safe
    # ...
```

```python
# backend/controllers/vendas_controller.py (PROPOSTO)
from core.numeracao import proximo_numero

@router.post("/orcamentos")
def criar_orcamento(dados: OrcamentoCreate, db: Session = Depends(get_db)):
    numero = proximo_numero("ORC", db)  # ← Thread-safe
    # ...

@router.post("/pedidos")
def criar_pedido_venda(dados: PedidoVendaCreate, db: Session = Depends(get_db)):
    numero = proximo_numero("PV", db)   # ← Thread-safe
    # ...
```

---

### Opção B — UNIQUE CONSTRAINT com retry (alternativa mais simples)

Se não quiser criar sequences, adicionar `UNIQUE` na coluna `numero` e tratar a exceção:

```python
# backend/models/tabelas.py (modificação)
class SolicitacaoCompra(Base):
    __tablename__ = "solicitacoes_compra"
    numero = Column(String(20), unique=True, nullable=False)  # ← UNIQUE
    # ...
```

```python
# backend/controllers/compras_controller.py (com retry)
from sqlalchemy.exc import IntegrityError
import time

MAX_RETRIES = 3

@router.post("/solicitacoes")
def criar_solicitacao(dados: SolicitacaoCompraCreate, db: Session = Depends(get_db)):
    for tentativa in range(MAX_RETRIES):
        ultima = db.query(SolicitacaoCompra).order_by(
            SolicitacaoCompra.id.desc()
        ).first()
        proximo_num = (ultima.id + 1) if ultima else 1
        numero = f"SC-{proximo_num:04d}"
        
        try:
            nova = SolicitacaoCompra(numero=numero, ...)
            db.add(nova)
            db.commit()
            return nova
        except IntegrityError:
            db.rollback()
            if tentativa == MAX_RETRIES - 1:
                raise HTTPException(500, "Conflito de numeração, tente novamente")
            # Aguardar brevemente e tentar novamente
            time.sleep(0.01 * (tentativa + 1))
```

**Nota**: A Opção A (SEQUENCE) é preferível porque nunca falha. A Opção B ainda pode falhar em alta concorrência ou gerar buracos na sequência (ex: SC-0001, SC-0003, sem SC-0002).

---

## Verificação após implementação

```bash
# Testar concorrência com múltiplos requests simultâneos
# Instalar httpie + parallel
for i in {1..10}; do
  curl -X POST http://localhost:8050/compras/solicitacoes \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"data":"2026-07-02","itens":[{"descricao":"Item","quantidade":1,"unidade":"UN"}]}' &
done
wait

# Verificar que não há duplicatas
# Todos os 10 documentos devem ter números únicos: SC-0001 até SC-0010
curl http://localhost:8050/compras/solicitacoes -H "Authorization: Bearer $TOKEN" | \
  python -c "import sys,json; docs=json.load(sys.stdin); print([d['numero'] for d in docs])"
```

---

## Benefícios

- Zero risco de documentos com numeração duplicada
- Funciona corretamente com múltiplos workers (`uvicorn --workers 4`)
- SEQUENCE do PostgreSQL é garantida pelo próprio banco
- Sem overhead de retry ou locking pessimista
- Histórico contínuo e auditável de documentos emitidos
