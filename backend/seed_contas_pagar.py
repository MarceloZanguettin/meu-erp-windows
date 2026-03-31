"""
Seed: Contas a Pagar — dia a dia, 2 meses atrás até 2 meses à frente.
- TODOS os dias da semana (incluindo sábado e domingo)
- 2 a 10 lançamentos por dia por empresa
- Para datas passadas: 0 a 1 ficam como pendente (= atrasados), o restante é 'pago'
- Para hoje e datas futuras: todos 'pendente'
Execute: python seed_contas_pagar.py  (dentro de backend/, com venv ativo)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.tabelas import Empresa, ContaBancaria, ContaPagar
import datetime, random

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Empresas ──────────────────────────────────────────────────────────────────
def garantir_empresa(eid, nome):
    emp = db.query(Empresa).filter(Empresa.id == eid).first()
    if not emp:
        emp = Empresa(nome=nome)
        db.add(emp); db.commit(); db.refresh(emp)
    return emp

emp1 = garantir_empresa(1, "Empresa 1")
emp2 = garantir_empresa(2, "Empresa 2")

# ── Contas bancárias ──────────────────────────────────────────────────────────
def garantir_cb(empresa_id, banco, numero):
    cb = db.query(ContaBancaria).filter(
        ContaBancaria.empresa_id == empresa_id,
        ContaBancaria.banco == banco,
    ).first()
    if not cb:
        cb = ContaBancaria(empresa_id=empresa_id, banco=banco, numero_conta=numero)
        db.add(cb); db.commit(); db.refresh(cb)
    return cb

cb_emp1_bb      = garantir_cb(emp1.id, "Banco do Brasil", "12345-6")
cb_emp1_sicredi = garantir_cb(emp1.id, "Banco Sicredi",   "78901-2")
cb_emp2_bb      = garantir_cb(emp2.id, "Banco do Brasil", "98765-4")
cb_emp2_sicredi = garantir_cb(emp2.id, "Banco Sicredi",   "32109-8")

DESCRICOES = [
    "Pagamento de fornecedor", "Aluguel do galpão", "Conta de energia elétrica",
    "Conta de água e esgoto", "Internet e telefonia", "Folha de pagamento",
    "Encargos trabalhistas", "Imposto sobre serviços", "Nota fiscal de compra",
    "Manutenção de equipamentos", "Seguro patrimonial", "Material de escritório",
    "Frete e logística", "Serviços de limpeza", "Licença de software",
]

FORNECEDORES = [
    "Distribuidora ABC", "Fornecedor XYZ", "Cia de Energia", "Sabesp",
    "Claro Empresas", "Folha Interna", "Receita Federal", "Prefeitura SP",
    "Transportadora Delta", "Oficina Mecânica", "Porto Seguro", "Papelaria Central",
    "Correios", "Limpadora Silva", "Microsoft BR",
]

random.seed(99)

hoje = datetime.date.today()
inicio = hoje - datetime.timedelta(days=60)
fim    = hoje + datetime.timedelta(days=60)

total_inseridos = 0

dia = inicio
while dia <= fim:
    # Contas a pagar: TODOS os dias (incluindo sábado e domingo)
    e_passado = dia < hoje
    dt_venc = datetime.datetime(dia.year, dia.month, dia.day, 18, 0, 0)

    for empresa, cbs in [(emp1, [cb_emp1_bb, cb_emp1_sicredi]),
                         (emp2, [cb_emp2_bb, cb_emp2_sicredi])]:

        n = random.randint(2, 10)
        # Quantos ficam como atrasados (pendente no passado)
        n_atrasados = random.randint(0, 1) if e_passado else 0

        for i in range(n):
            cb = random.choice(cbs)
            desc = f"{random.choice(DESCRICOES)} – {random.choice(FORNECEDORES)}"
            valor = round(random.uniform(200.0, 12000.0), 2)

            if e_passado and i < (n - n_atrasados):
                # pago no prazo ou com pequeno atraso
                dias_depois = random.randint(0, 2)
                data_pag = dt_venc + datetime.timedelta(days=dias_depois)
                conta = ContaPagar(
                    empresa_id=empresa.id,
                    conta_bancaria_id=cb.id,
                    descricao=desc,
                    valor=valor,
                    data_vencimento=dt_venc,
                    data_pagamento=data_pag,
                    status="pago",
                )
            else:
                # pendente (atrasado se passado, normal se futuro/hoje)
                conta = ContaPagar(
                    empresa_id=empresa.id,
                    conta_bancaria_id=cb.id,
                    descricao=desc,
                    valor=valor,
                    data_vencimento=dt_venc,
                    data_pagamento=None,
                    status="pendente",
                )
            db.add(conta)
            total_inseridos += 1

    dia += datetime.timedelta(days=1)

db.commit()
db.close()
print(f"Seed Contas a Pagar concluído: {total_inseridos} lançamentos inseridos.")
