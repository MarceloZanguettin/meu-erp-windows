from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ClienteEmpresa
from schemas import cliente_empresa

router = APIRouter(prefix="/clientes-empresa", tags=["Vínculo Cliente-Empresa GENUS (Cadastros)"])


def _get_ou_404(db: Session, id: int) -> ClienteEmpresa:
    obj = db.query(ClienteEmpresa).filter(ClienteEmpresa.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Vínculo cliente-empresa (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[cliente_empresa.ClienteEmpresaOut])
def listar_clientes_empresa(
    cliente_id: Optional[int] = Query(None),
    cod_cadastro: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ClienteEmpresa)
    if cliente_id:
        q = q.filter(ClienteEmpresa.cliente_id == cliente_id)
    if cod_cadastro:
        q = q.filter(ClienteEmpresa.cod_cadastro == cod_cadastro)
    if cod_empresa:
        q = q.filter(ClienteEmpresa.cod_empresa == cod_empresa)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (ClienteEmpresa.cod_cadastro == valor_busca)
                | (ClienteEmpresa.cod_empresa == valor_busca)
            )
    return q.order_by(ClienteEmpresa.id.desc()).all()


@router.get("/{id}", response_model=cliente_empresa.ClienteEmpresaOut)
def buscar_cliente_empresa(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cliente_empresa.ClienteEmpresaOut)
def criar_cliente_empresa(dados: cliente_empresa.ClienteEmpresaCreate, db: Session = Depends(get_db)):
    obj = ClienteEmpresa(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cliente_empresa.ClienteEmpresaOut)
def atualizar_cliente_empresa(id: int, dados: cliente_empresa.ClienteEmpresaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cliente_empresa(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Vínculo cliente-empresa (GENUS) deletado com sucesso"}
