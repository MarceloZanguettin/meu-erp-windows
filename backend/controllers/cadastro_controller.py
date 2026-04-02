from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import (
    UnidadeMedida, GrupoProduto, FormaPagamento, PlanoConta,
    CentroCusto, Deposito, ClienteCompleto, Fornecedor, Transportadora,
    Representante, Funcionario, PerfilAcesso,
)
from schemas import cadastro

router = APIRouter(prefix="/cadastros", tags=["Cadastros"])


def _get_ou_404(db: Session, model, id: int):
    obj = db.query(model).filter(model.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return obj


# ── Unidades de Medida ────────────────────────────────────────────────────────

@router.get("/unidades-medida", response_model=list[cadastro.UnidadeMedidaOut])
def listar_unidades(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(UnidadeMedida)
    if busca:
        q = q.filter(UnidadeMedida.descricao.ilike(f"%{busca}%"))
    return q.order_by(UnidadeMedida.sigla).all()


@router.post("/unidades-medida", response_model=cadastro.UnidadeMedidaOut)
def criar_unidade(dados: cadastro.UnidadeMedidaCreate, db: Session = Depends(get_db)):
    obj = UnidadeMedida(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/unidades-medida/{id}", response_model=cadastro.UnidadeMedidaOut)
def atualizar_unidade(id: int, dados: cadastro.UnidadeMedidaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, UnidadeMedida, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/unidades-medida/{id}")
def deletar_unidade(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, UnidadeMedida, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Grupos de Produto ─────────────────────────────────────────────────────────

@router.get("/grupos-produto", response_model=list[cadastro.GrupoProdutoOut])
def listar_grupos(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(GrupoProduto)
    if busca:
        q = q.filter(GrupoProduto.nome.ilike(f"%{busca}%"))
    return q.order_by(GrupoProduto.nome).all()


@router.post("/grupos-produto", response_model=cadastro.GrupoProdutoOut)
def criar_grupo(dados: cadastro.GrupoProdutoCreate, db: Session = Depends(get_db)):
    obj = GrupoProduto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/grupos-produto/{id}", response_model=cadastro.GrupoProdutoOut)
def atualizar_grupo(id: int, dados: cadastro.GrupoProdutoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, GrupoProduto, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/grupos-produto/{id}")
def deletar_grupo(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, GrupoProduto, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Formas de Pagamento ───────────────────────────────────────────────────────

@router.get("/formas-pagamento", response_model=list[cadastro.FormaPagamentoOut])
def listar_formas_pagamento(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(FormaPagamento)
    if busca:
        q = q.filter(FormaPagamento.nome.ilike(f"%{busca}%"))
    return q.order_by(FormaPagamento.nome).all()


@router.post("/formas-pagamento", response_model=cadastro.FormaPagamentoOut)
def criar_forma_pagamento(dados: cadastro.FormaPagamentoCreate, db: Session = Depends(get_db)):
    obj = FormaPagamento(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/formas-pagamento/{id}", response_model=cadastro.FormaPagamentoOut)
def atualizar_forma_pagamento(id: int, dados: cadastro.FormaPagamentoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, FormaPagamento, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/formas-pagamento/{id}")
def deletar_forma_pagamento(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, FormaPagamento, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Plano de Contas ───────────────────────────────────────────────────────────

@router.get("/plano-contas", response_model=list[cadastro.PlanoContaOut])
def listar_plano_contas(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(PlanoConta)
    if busca:
        q = q.filter(PlanoConta.descricao.ilike(f"%{busca}%"))
    return q.order_by(PlanoConta.codigo).all()


@router.post("/plano-contas", response_model=cadastro.PlanoContaOut)
def criar_plano_conta(dados: cadastro.PlanoContaCreate, db: Session = Depends(get_db)):
    obj = PlanoConta(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/plano-contas/{id}", response_model=cadastro.PlanoContaOut)
def atualizar_plano_conta(id: int, dados: cadastro.PlanoContaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, PlanoConta, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/plano-contas/{id}")
def deletar_plano_conta(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, PlanoConta, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Centros de Custo ──────────────────────────────────────────────────────────

@router.get("/centros-custo", response_model=list[cadastro.CentroCustoOut])
def listar_centros_custo(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(CentroCusto)
    if busca:
        q = q.filter(CentroCusto.nome.ilike(f"%{busca}%"))
    return q.order_by(CentroCusto.codigo).all()


@router.post("/centros-custo", response_model=cadastro.CentroCustoOut)
def criar_centro_custo(dados: cadastro.CentroCustoCreate, db: Session = Depends(get_db)):
    obj = CentroCusto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/centros-custo/{id}", response_model=cadastro.CentroCustoOut)
def atualizar_centro_custo(id: int, dados: cadastro.CentroCustoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, CentroCusto, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/centros-custo/{id}")
def deletar_centro_custo(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, CentroCusto, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Depósitos ─────────────────────────────────────────────────────────────────

@router.get("/depositos", response_model=list[cadastro.DepositoOut])
def listar_depositos(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Deposito)
    if busca:
        q = q.filter(Deposito.nome.ilike(f"%{busca}%"))
    return q.order_by(Deposito.nome).all()


@router.post("/depositos", response_model=cadastro.DepositoOut)
def criar_deposito(dados: cadastro.DepositoCreate, db: Session = Depends(get_db)):
    obj = Deposito(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/depositos/{id}", response_model=cadastro.DepositoOut)
def atualizar_deposito(id: int, dados: cadastro.DepositoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Deposito, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/depositos/{id}")
def deletar_deposito(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Deposito, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Clientes ──────────────────────────────────────────────────────────────────

@router.get("/clientes", response_model=list[cadastro.ClienteCompletoOut])
def listar_clientes(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(ClienteCompleto)
    if busca:
        q = q.filter(ClienteCompleto.nome.ilike(f"%{busca}%"))
    return q.order_by(ClienteCompleto.nome).all()


@router.post("/clientes", response_model=cadastro.ClienteCompletoOut)
def criar_cliente(dados: cadastro.ClienteCompletoCreate, db: Session = Depends(get_db)):
    obj = ClienteCompleto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/clientes/{id}", response_model=cadastro.ClienteCompletoOut)
def atualizar_cliente(id: int, dados: cadastro.ClienteCompletoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, ClienteCompleto, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/clientes/{id}")
def deletar_cliente(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, ClienteCompleto, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Fornecedores ──────────────────────────────────────────────────────────────

@router.get("/fornecedores", response_model=list[cadastro.FornecedorOut])
def listar_fornecedores(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Fornecedor)
    if busca:
        q = q.filter(Fornecedor.nome.ilike(f"%{busca}%"))
    return q.order_by(Fornecedor.nome).all()


@router.post("/fornecedores", response_model=cadastro.FornecedorOut)
def criar_fornecedor(dados: cadastro.FornecedorCreate, db: Session = Depends(get_db)):
    obj = Fornecedor(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/fornecedores/{id}", response_model=cadastro.FornecedorOut)
def atualizar_fornecedor(id: int, dados: cadastro.FornecedorUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Fornecedor, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/fornecedores/{id}")
def deletar_fornecedor(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Fornecedor, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Transportadoras ───────────────────────────────────────────────────────────

@router.get("/transportadoras", response_model=list[cadastro.TransportadoraOut])
def listar_transportadoras(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Transportadora)
    if busca:
        q = q.filter(Transportadora.nome.ilike(f"%{busca}%"))
    return q.order_by(Transportadora.nome).all()


@router.post("/transportadoras", response_model=cadastro.TransportadoraOut)
def criar_transportadora(dados: cadastro.TransportadoraCreate, db: Session = Depends(get_db)):
    obj = Transportadora(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/transportadoras/{id}", response_model=cadastro.TransportadoraOut)
def atualizar_transportadora(id: int, dados: cadastro.TransportadoraUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Transportadora, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/transportadoras/{id}")
def deletar_transportadora(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Transportadora, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Representantes ────────────────────────────────────────────────────────────

@router.get("/representantes", response_model=list[cadastro.RepresentanteOut])
def listar_representantes(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Representante)
    if busca:
        q = q.filter(Representante.nome.ilike(f"%{busca}%"))
    return q.order_by(Representante.nome).all()


@router.post("/representantes", response_model=cadastro.RepresentanteOut)
def criar_representante(dados: cadastro.RepresentanteCreate, db: Session = Depends(get_db)):
    obj = Representante(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/representantes/{id}", response_model=cadastro.RepresentanteOut)
def atualizar_representante(id: int, dados: cadastro.RepresentanteUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Representante, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/representantes/{id}")
def deletar_representante(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Representante, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Funcionários ──────────────────────────────────────────────────────────────

@router.get("/funcionarios", response_model=list[cadastro.FuncionarioOut])
def listar_funcionarios(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Funcionario)
    if busca:
        q = q.filter(Funcionario.nome.ilike(f"%{busca}%"))
    return q.order_by(Funcionario.nome).all()


@router.post("/funcionarios", response_model=cadastro.FuncionarioOut)
def criar_funcionario(dados: cadastro.FuncionarioCreate, db: Session = Depends(get_db)):
    obj = Funcionario(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/funcionarios/{id}", response_model=cadastro.FuncionarioOut)
def atualizar_funcionario(id: int, dados: cadastro.FuncionarioUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Funcionario, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/funcionarios/{id}")
def deletar_funcionario(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Funcionario, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Perfis de Acesso ──────────────────────────────────────────────────────────

@router.get("/perfis-acesso", response_model=list[cadastro.PerfilAcessoOut])
def listar_perfis(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(PerfilAcesso)
    if busca:
        q = q.filter(PerfilAcesso.nome.ilike(f"%{busca}%"))
    return q.order_by(PerfilAcesso.nome).all()


@router.post("/perfis-acesso", response_model=cadastro.PerfilAcessoOut)
def criar_perfil(dados: cadastro.PerfilAcessoCreate, db: Session = Depends(get_db)):
    obj = PerfilAcesso(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/perfis-acesso/{id}", response_model=cadastro.PerfilAcessoOut)
def atualizar_perfil(id: int, dados: cadastro.PerfilAcessoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, PerfilAcesso, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/perfis-acesso/{id}")
def deletar_perfil(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, PerfilAcesso, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}
