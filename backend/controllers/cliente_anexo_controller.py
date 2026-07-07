import base64

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ClienteAnexo
from schemas import cliente_anexo

router = APIRouter(prefix="/clientes-anexos", tags=["Anexos de Cliente GENUS (Cadastros)"])


def _get_ou_404(db: Session, id: int) -> ClienteAnexo:
    obj = db.query(ClienteAnexo).filter(ClienteAnexo.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Anexo de cliente (GENUS) não encontrado")
    return obj


def _to_out(obj: ClienteAnexo) -> cliente_anexo.ClienteAnexoOut:
    """Converte o BLOB binário (bytes) armazenado em `anexo` para base64,
    já que a API trafega JSON. Nenhum dado de anexo é interpretado ou
    convertido além disso — só encode/decode de transporte."""
    return cliente_anexo.ClienteAnexoOut(
        id=obj.id,
        cliente_id=obj.cliente_id,
        codigo=obj.codigo,
        cod_cliente=obj.cod_cliente,
        descricao=obj.descricao,
        anexo=base64.b64encode(obj.anexo).decode("ascii") if obj.anexo else None,
        tipo=obj.tipo,
        cod_orcamento=obj.cod_orcamento,
    )


def _anexo_bytes(anexo_b64: Optional[str]) -> Optional[bytes]:
    if not anexo_b64:
        return None
    return base64.b64decode(anexo_b64)


@router.get("", response_model=list[cliente_anexo.ClienteAnexoOut])
def listar_clientes_anexo(
    cliente_id: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ClienteAnexo)
    if cliente_id:
        q = q.filter(ClienteAnexo.cliente_id == cliente_id)
    if cod_cliente:
        q = q.filter(ClienteAnexo.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(
            (ClienteAnexo.descricao.ilike(f"%{busca}%"))
            | (ClienteAnexo.tipo.ilike(f"%{busca}%"))
        )
    itens = q.order_by(ClienteAnexo.id.desc()).all()
    return [_to_out(item) for item in itens]


@router.get("/{id}", response_model=cliente_anexo.ClienteAnexoOut)
def buscar_cliente_anexo(id: int, db: Session = Depends(get_db)):
    return _to_out(_get_ou_404(db, id))


@router.post("", response_model=cliente_anexo.ClienteAnexoOut)
def criar_cliente_anexo(dados: cliente_anexo.ClienteAnexoCreate, db: Session = Depends(get_db)):
    payload = dados.dict()
    payload["anexo"] = _anexo_bytes(payload.get("anexo"))
    obj = ClienteAnexo(**payload)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return _to_out(obj)


@router.put("/{id}", response_model=cliente_anexo.ClienteAnexoOut)
def atualizar_cliente_anexo(id: int, dados: cliente_anexo.ClienteAnexoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        if campo == "anexo":
            valor = _anexo_bytes(valor)
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return _to_out(obj)


@router.delete("/{id}")
def deletar_cliente_anexo(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Anexo de cliente (GENUS) deletado com sucesso"}
