import base64

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoFoto
from schemas import produto_foto

router = APIRouter(prefix="/produto-fotos", tags=["Fotos de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoFoto:
    obj = db.query(ProdutoFoto).filter(ProdutoFoto.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Foto de produto não encontrada")
    return obj


def _to_out(obj: ProdutoFoto) -> produto_foto.ProdutoFotoOut:
    """Converte o BLOB binário (bytes) armazenado em `foto` para base64,
    já que a API trafega JSON. Nenhum dado de imagem é interpretado ou
    convertido além disso — só encode/decode de transporte."""
    return produto_foto.ProdutoFotoOut(
        id=obj.id,
        produto_id=obj.produto_id,
        cod_produto=obj.cod_produto,
        foto=base64.b64encode(obj.foto).decode("ascii") if obj.foto else None,
    )


def _foto_bytes(foto_b64: Optional[str]) -> Optional[bytes]:
    if not foto_b64:
        return None
    return base64.b64decode(foto_b64)


@router.get("", response_model=list[produto_foto.ProdutoFotoOut])
def listar_produto_fotos(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoFoto)
    if produto_id:
        q = q.filter(ProdutoFoto.produto_id == produto_id)
    if busca:
        q = q.filter(ProdutoFoto.cod_produto.ilike(f"%{busca}%"))
    itens = q.order_by(ProdutoFoto.id).all()
    return [_to_out(item) for item in itens]


@router.get("/{id}", response_model=produto_foto.ProdutoFotoOut)
def buscar_produto_foto(id: int, db: Session = Depends(get_db)):
    return _to_out(_get_ou_404(db, id))


@router.post("", response_model=produto_foto.ProdutoFotoOut)
def criar_produto_foto(dados: produto_foto.ProdutoFotoCreate, db: Session = Depends(get_db)):
    payload = dados.dict()
    payload["foto"] = _foto_bytes(payload.get("foto"))
    obj = ProdutoFoto(**payload)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return _to_out(obj)


@router.put("/{id}", response_model=produto_foto.ProdutoFotoOut)
def atualizar_produto_foto(id: int, dados: produto_foto.ProdutoFotoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        if campo == "foto":
            valor = _foto_bytes(valor)
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return _to_out(obj)


@router.delete("/{id}")
def deletar_produto_foto(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Foto de produto deletada com sucesso"}
