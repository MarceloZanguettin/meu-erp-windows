from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import NotaXmlEntrada
from schemas import nota_xml_entrada

router = APIRouter(prefix="/notas-xml-entrada", tags=["XML de NF-e recebida GENUS (Fiscal)"])


def _get_ou_404(db: Session, id: int) -> NotaXmlEntrada:
    obj = db.query(NotaXmlEntrada).filter(NotaXmlEntrada.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="XML de NF-e de entrada (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[nota_xml_entrada.NotaXmlEntradaOut])
def listar_notas_xml_entrada(
    entrada_id: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(NotaXmlEntrada)
    if entrada_id:
        q = q.filter(NotaXmlEntrada.entrada_id == entrada_id)
    if cod_empresa:
        q = q.filter(NotaXmlEntrada.cod_empresa == cod_empresa)
    if cod_fornecedor:
        q = q.filter(NotaXmlEntrada.cod_fornecedor == cod_fornecedor)
    if busca:
        q = q.filter(NotaXmlEntrada.chave_nfe.ilike(f"%{busca}%"))
    return q.order_by(NotaXmlEntrada.id.desc()).all()


@router.get("/{id}", response_model=nota_xml_entrada.NotaXmlEntradaOut)
def buscar_nota_xml_entrada(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=nota_xml_entrada.NotaXmlEntradaOut)
def criar_nota_xml_entrada(dados: nota_xml_entrada.NotaXmlEntradaCreate, db: Session = Depends(get_db)):
    obj = NotaXmlEntrada(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=nota_xml_entrada.NotaXmlEntradaOut)
def atualizar_nota_xml_entrada(id: int, dados: nota_xml_entrada.NotaXmlEntradaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_nota_xml_entrada(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "XML de NF-e de entrada (GENUS) deletado com sucesso"}
