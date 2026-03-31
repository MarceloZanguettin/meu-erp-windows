"""
Seed: Contas a Receber — dia a dia, 2 meses atrás até 2 meses à frente.
- Dias úteis (seg-sex) apenas
- 10 a 15 lançamentos por dia por empresa
- Para datas passadas: 0 a 2 ficam como pendente (= atrasados), o restante é 'recebido'
- Para hoje e datas futuras: todos 'pendente'
Execute: python seed_financeiro.py  (dentro de backend/, com venv ativo)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.tabelas import Empresa, ContaBancaria, ContaReceber
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
    "Venda de mercadorias", "Prestação de serviços", "Comissão de vendas",
    "Consultoria técnica", "Aluguel de equipamentos", "Fornecimento de materiais",
    "Manutenção preventiva", "Entrega de produtos", "Serviços de instalação",
    "Parcela de contrato", "Fatura mensal", "Nota fiscal de serviço",
    "Recebimento de royalties", "Reembolso de despesas", "Adiantamento de cliente",
]

CLIENTES = [
    "João Silva", "Maria Souza", "Pedro Oliveira", "Ana Costa",
    "Carlos Lima", "Fernanda Rocha", "Roberto Alves", "Patrícia Nunes",
    "Lucas Pereira", "Juliana Martins", "Marcos Ribeiro", "Camila Ferreira",
    "André Santos", "Beatriz Moreira", "Thiago Carvalho",
]

random.seed(42)

hoje = datetime.date.today()
inicio = hoje - datetime.timedelta(days=60)
fim    = hoje + datetime.timedelta(days=60)

total_inseridos = 0

dia = inicio
while dia <= fim:
    # Contas a receber: apenas dias úteis (seg=0 … sex=4)
    if dia.weekday() > 4:
        dia += datetime.timedelta(days=1)
        continue

    e_passado = dia < hoje
    dt_venc = datetime.datetime(dia.year, dia.month, dia.day, 9, 0, 0)

    for empresa, cbs in [(emp1, [cb_emp1_bb, cb_emp1_sicredi]),
                         (emp2, [cb_emp2_bb, cb_emp2_sicredi])]:

        n = random.randint(10, 15)
        # Quantos ficam como atrasados (pendente no passado)
        n_atrasados = random.randint(0, 2) if e_passado else 0

        for i in range(n):
            cb = random.choice(cbs)
            desc = f"{random.choice(DESCRICOES)} – {random.choice(CLIENTES)}"
            valor = round(random.uniform(150.0, 8500.0), 2)

            if e_passado and i < (n - n_atrasados):
                # recebido no prazo ou com pequeno atraso
                dias_depois = random.randint(0, 3)
                data_rec = dt_venc + datetime.timedelta(days=dias_depois)
                conta = ContaReceber(
                    empresa_id=empresa.id,
                    conta_bancaria_id=cb.id,
                    descricao=desc,
                    valor=valor,
                    data_vencimento=dt_venc,
                    data_recebimento=data_rec,
                    status="recebido",
                )
            else:
                # pendente (atrasado se passado, normal se futuro/hoje)
                conta = ContaReceber(
                    empresa_id=empresa.id,
                    conta_bancaria_id=cb.id,
                    descricao=desc,
                    valor=valor,
                    data_vencimento=dt_venc,
                    data_recebimento=None,
                    status="pendente",
                )
            db.add(conta)
            total_inseridos += 1

    dia += datetime.timedelta(days=1)

db.commit()
db.close()
print(f"Seed Contas a Receber concluído: {total_inseridos} lançamentos inseridos.")
