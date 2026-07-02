# Melhoria 10 — Performance: Paginação nas Listagens da API

**Categoria**: Performance  
**Prioridade**: 🟢 Baixo  
**Esforço estimado**: 1 hora  
**Risco se ignorado**: Com crescimento de dados, GETs retornam milhares de registros, causando lentidão e travamentos

---

## Problema

Todos os endpoints GET do projeto retornam a listagem completa de registros sem limite:

```python
# backend/controllers/financeiro_controller.py (ATUAL — PROBLEMA)
@router.get("/contas-pagar")
def listar_contas_pagar(
    empresa_id: Optional[int] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ContaPagar)
    # ...filtros...
    return query.all()   # ← Retorna TODOS os registros
```

```python
# backend/controllers/cadastro_controller.py (ATUAL — PROBLEMA)
@router.get("/clientes")
def listar_clientes(busca: str = "", db: Session = Depends(get_db)):
    query = db.query(ClienteCompleto)
    if busca:
        query = query.filter(ClienteCompleto.nome.ilike(f"%{busca}%"))
    return query.all()  # ← Pode retornar centenas de clientes
```

### Dados atuais (após seed)

- `ConatasReceber`: ~2000+ registros
- `ContasPagar`: ~1500+ registros

Com 1 ano de operação real: 10.000+ registros em cada tabela. Um GET sem paginação causará:
- Timeout de request no frontend
- Alto consumo de memória no backend
- Lentidão de renderização na tabela React

---

## Solução — Paginação com offset/limit e metadados

### Modelo de resposta paginada

```python
# backend/schemas/paginacao.py (NOVO ARQUIVO)
from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")

class PaginaResponse(BaseModel, Generic[T]):
    """Wrapper padrão para respostas paginadas."""
    items: List[T]
    total: int           # Total de registros (para calcular páginas)
    pagina: int          # Página atual (começa em 1)
    por_pagina: int      # Registros por página
    paginas: int         # Total de páginas

    @classmethod
    def criar(cls, items: List[T], total: int, pagina: int, por_pagina: int):
        import math
        return cls(
            items=items,
            total=total,
            pagina=pagina,
            por_pagina=por_pagina,
            paginas=math.ceil(total / por_pagina) if total > 0 else 1,
        )
```

### Passo 1 — Atualizar endpoints financeiros

```python
# backend/controllers/financeiro_controller.py (PROPOSTO)
from schemas.paginacao import PaginaResponse
from schemas.financeiro import ContaPagarOut

@router.get("/contas-pagar", response_model=PaginaResponse[ContaPagarOut])
def listar_contas_pagar(
    # Filtros existentes
    empresa_id: Optional[int] = None,
    conta_bancaria_id: Optional[int] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    status: Optional[str] = None,
    # Paginação
    pagina: int = Query(default=1, ge=1, description="Número da página"),
    por_pagina: int = Query(default=50, ge=1, le=200, description="Registros por página"),
    db: Session = Depends(get_db)
):
    query = db.query(ContaPagar)
    
    # Filtros existentes
    if empresa_id:
        query = query.filter(ContaPagar.empresa_id == empresa_id)
    if conta_bancaria_id:
        query = query.filter(ContaPagar.conta_bancaria_id == conta_bancaria_id)
    if data_inicio:
        query = query.filter(ContaPagar.data_vencimento >= data_inicio)
    if data_fim:
        query = query.filter(ContaPagar.data_vencimento <= data_fim)
    if status:
        query = query.filter(ContaPagar.status == status)
    
    # Ordenação padrão por vencimento
    query = query.order_by(ContaPagar.data_vencimento)
    
    # Contagem total (para metadados)
    total = query.count()
    
    # Aplicar paginação
    offset = (pagina - 1) * por_pagina
    items = query.offset(offset).limit(por_pagina).all()
    
    return PaginaResponse.criar(items, total, pagina, por_pagina)
```

### Passo 2 — Helper reutilizável para paginação

```python
# backend/core/paginacao.py (NOVO ARQUIVO)
from typing import TypeVar, Type, Optional
from sqlalchemy.orm import Session, Query
from sqlalchemy import Column
from schemas.paginacao import PaginaResponse

T = TypeVar("T")


def paginar(
    query: Query,
    pagina: int,
    por_pagina: int,
    ordem: Optional[Column] = None
) -> tuple[list, int]:
    """Aplica paginação a uma query SQLAlchemy. Retorna (items, total)."""
    if ordem is not None:
        query = query.order_by(ordem)
    
    total = query.count()
    offset = (pagina - 1) * por_pagina
    items = query.offset(offset).limit(por_pagina).all()
    
    return items, total
```

Uso nos controllers:
```python
from core.paginacao import paginar

# ...dentro do endpoint...
items, total = paginar(query, pagina, por_pagina, ordem=ContaPagar.data_vencimento)
return PaginaResponse.criar(items, total, pagina, por_pagina)
```

### Passo 3 — Atualizar frontend para consumir paginação

```javascript
// frontend/src/components/FinanceiroAgrupadoWindow/services/financeiroService.js (PROPOSTO)

export async function buscarContasPagar({
  empresaId,
  dataInicio,
  dataFim,
  status,
  pagina = 1,
  porPagina = 50,
} = {}) {
  const params = new URLSearchParams();
  if (empresaId) params.append("empresa_id", empresaId);
  if (dataInicio) params.append("data_inicio", dataInicio);
  if (dataFim) params.append("data_fim", dataFim);
  if (status) params.append("status", status);
  params.append("pagina", pagina);
  params.append("por_pagina", porPagina);

  const response = await api.get(`/financeiro/contas-pagar?${params}`);
  return response.data; // { items: [...], total, pagina, por_pagina, paginas }
}
```

```javascript
// Exemplo de hook com paginação
// frontend/src/components/FinanceiroAgrupadoWindow/hooks/useFinanceiroData.js

const [pagina, setPagina] = useState(1);
const [totalPaginas, setTotalPaginas] = useState(1);

const carregarDados = useCallback(async () => {
  const resultado = await buscarContasPagar({ ...filtros, pagina });
  setContasPagar(resultado.items);
  setTotalPaginas(resultado.paginas);
  setTotal(resultado.total);
}, [filtros, pagina]);
```

---

## Alternativa — Scroll infinito (já implementado parcialmente)

O projeto já tem `useScrollInfinito.js` em FinanceiroAgrupadoWindow. Para integrar com a paginação da API:

```javascript
// frontend/src/components/FinanceiroAgrupadoWindow/hooks/useScrollInfinito.js
// Adaptar para carregar mais dados quando o usuário rolar até o fim da lista

const carregarMais = useCallback(async () => {
  if (pagina >= totalPaginas || carregando) return;
  
  const proxPagina = pagina + 1;
  const resultado = await buscarContasPagar({ ...filtros, pagina: proxPagina });
  
  setContasPagar(prev => [...prev, ...resultado.items]);  // Acumula em vez de substituir
  setPagina(proxPagina);
}, [pagina, totalPaginas, filtros, carregando]);
```

---

## Exemplo de resposta paginada

```json
{
  "items": [
    {
      "id": 1,
      "descricao": "Aluguel Janeiro",
      "valor": 1500.00,
      "data_vencimento": "2026-01-10",
      "status": "pago"
    }
  ],
  "total": 1547,
  "pagina": 1,
  "por_pagina": 50,
  "paginas": 31
}
```

---

## Endpoints prioritários para paginação

| Endpoint | Registros atuais | Prioridade |
|---------|-----------------|-----------|
| `GET /financeiro/contas-pagar` | ~1500+ | Alta |
| `GET /financeiro/contas-receber` | ~2000+ | Alta |
| `GET /estoque/movimentos` | Cresce rápido | Alta |
| `GET /cadastros/clientes` | Moderado | Média |
| `GET /vendas/orcamentos` | Moderado | Média |
| `GET /vendas/pedidos` | Moderado | Média |
| `GET /compras/pedidos` | Moderado | Média |

---

## Benefícios

- Tempo de resposta estável independente do volume de dados
- Menor consumo de memória no backend
- Renderização mais rápida no frontend
- Scroll infinito funciona corretamente com carregamento incremental
- Consultas SQL mais eficientes com `LIMIT` e `OFFSET`
