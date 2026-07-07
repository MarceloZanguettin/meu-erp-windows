from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import NotaXml
from schemas import nota_xml

router = APIRouter(prefix="/notas-xml", tags=["XML de NF-e emitida GENUS (Fiscal)"])


def _get_ou_404(db: Session, id: int) -> NotaXml:
    obj = db.query(NotaXml).filter(NotaXml.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="XML de NF-e (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[nota_xml.NotaXmlOut])
def listar_notas_xml(
    saida_id: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(NotaXml)
    if saida_id:
        q = q.filter(NotaXml.saida_id == saida_id)
    if cod_empresa:
        q = q.filter(NotaXml.cod_empresa == cod_empresa)
    if cod_saida:
        q = q.filter(NotaXml.cod_saida == cod_saida)
    if busca:
        q = q.filter(NotaXml.chave_nfe.ilike(f"%{busca}%"))
    return q.order_by(NotaXml.id.desc()).all()


@router.get("/{id}", response_model=nota_xml.NotaXmlOut)
def buscar_nota_xml(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=nota_xml.NotaXmlOut)
def criar_nota_xml(dados: nota_xml.NotaXmlCreate, db: Session = Depends(get_db)):
    obj = NotaXml(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=nota_xml.NotaXmlOut)
def atualizar_nota_xml(id: int, dados: nota_xml.NotaXmlUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_nota_xml(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "XML de NF-e (GENUS) deletado com sucesso"}
