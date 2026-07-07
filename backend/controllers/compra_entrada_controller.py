from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CompraEntrada
from schemas import compra_entrada

router = APIRouter(prefix="/compras-entrada", tags=["Vínculo Compra-Entrada GENUS (Compras)"])


def _get_ou_404(db: Session, id: int) -> CompraEntrada:
    obj = db.query(CompraEntrada).filter(CompraEntrada.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Vínculo compra-entrada (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[compra_entrada.CompraEntradaOut])
def listar_compras_entrada(
    entrada_id: Optional[int] = Query(None),
    compra_id: Optional[int] = Query(None),
    cod_compras: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CompraEntrada)
    if entrada_id:
        q = q.filter(CompraEntrada.entrada_id == entrada_id)
    if compra_id:
        q = q.filter(CompraEntrada.compra_id == compra_id)
    if cod_compras:
        q = q.filter(CompraEntrada.cod_compras == cod_compras)
    if cod_fornecedor:
        q = q.filter(CompraEntrada.cod_fornecedor == cod_fornecedor)
    if cod_empresa:
        q = q.filter(CompraEntrada.cod_empresa == cod_empresa)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (CompraEntrada.cod_compras == valor_busca)
                | (CompraEntrada.doc == valor_busca)
            )
        else:
            q = q.filter(
                (CompraEntrada.serie.ilike(f"%{busca}%"))
                | (CompraEntrada.tipo_doc.ilike(f"%{busca}%"))
            )
    return q.order_by(CompraEntrada.id.desc()).all()


@router.get("/{id}", response_model=compra_entrada.CompraEntradaOut)
def buscar_compra_entrada(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=compra_entrada.CompraEntradaOut)
def criar_compra_entrada(dados: compra_entrada.CompraEntradaCreate, db: Session = Depends(get_db)):
    obj = CompraEntrada(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=compra_entrada.CompraEntradaOut)
def atualizar_compra_entrada(id: int, dados: compra_entrada.CompraEntradaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_compra_entrada(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Vínculo compra-entrada (GENUS) deletado com sucesso"}
