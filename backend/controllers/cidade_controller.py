from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Cidade
from schemas import cidade as cidade_schema

# Tabela mestre de Cidades do GENUS (GENUS.CIDADE) — módulo Sistema/Config,
# referenciada por várias outras tabelas apenas como código bruto de cidade
# (`cod_cidade`/variantes: Empresa.cod_cidade, CadastroPessoa.cod_cidade,
# ClienteCompleto.cob_cod_cidade, Orcamento.cli_cod_cidade), uso residual;
# ver docstring do model `Cidade` em models/tabelas.py.
router = APIRouter(prefix="/cidades", tags=["Cidades (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Cidade:
    obj = db.query(Cidade).filter(Cidade.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Cidade não encontrada")
    return obj


@router.get("", response_model=list[cidade_schema.CidadeOut])
def listar_cidades(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Cidade)
    if busca:
        condicoes = [
            Cidade.nome.ilike(f"%{busca}%"),
            Cidade.cod_estado.ilike(f"%{busca}%"),
            Cidade.ibge.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(Cidade.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Cidade.id).all()


@router.get("/{id}", response_model=cidade_schema.CidadeOut)
def buscar_cidade(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cidade_schema.CidadeOut)
def criar_cidade(dados: cidade_schema.CidadeCreate, db: Session = Depends(get_db)):
    obj = Cidade(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cidade_schema.CidadeOut)
def atualizar_cidade(id: int, dados: cidade_schema.CidadeUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cidade(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Cidade deletada com sucesso"}
