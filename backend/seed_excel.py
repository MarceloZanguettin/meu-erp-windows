"""
Popula o banco de dados com dados históricos das planilhas financeiras Excel.

Fonte 1 — classificacao_ml_resultados.json:
    Documentos classificados (transações): armazenados como ContaPagar / ContaReceber
    com importado_excel=True. Esses registros aparecem na listagem mas NÃO são
    contabilizados no saldo do fluxo financeiro (a UI filtra pelo flag).

Fonte 2 — celulas_extraidas.json:
    Saldo real de cada conta bancária por dia (colunas F, J, N, Q).
    Armazenado em SaldoDiarioBancario, que é a fonte de verdade para o saldo
    exibido na janela Financeiro Agrupado.

Correlação entre os arquivos:
    Cada entrada de classificacao_ml tem (coluna, valor_na_planilha).
    O registro correspondente em celulas_extraidas com a mesma (coluna, valor)
    fornece a data da transação. Para valores duplicados numa mesma coluna,
    a ordem cronológica das células é respeitada.

Execute: python seed_excel.py
"""

import sys
import os
import json
import math
from datetime import datetime
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal
from models.tabelas import Empresa, ContaBancaria, ContaPagar, ContaReceber, SaldoDiarioBancario

# ── Caminhos dos arquivos fonte ───────────────────────────────────────────────
BASE_DIR = r"D:\Projetos VS Code\Financeiro Empresas Excel"
CLASSIFICACAO_PATH = os.path.join(BASE_DIR, "classificacao_ml_resultados.json")
CELULAS_PATH       = os.path.join(BASE_DIR, "celulas_extraidas.json")

# ── Mapeamento de colunas Excel → (empresa, banco, tipo_lancamento) ───────────
# tipo_lancamento: 'pagar' = saída de caixa  |  'receber' = entrada de caixa
# Confirmado pelas fórmulas das planilhas:
#   BB Osvaldo : F = E - B - C    → B,C saídas; D entrada
#   BB Pinzan  : J = Jprev + H - G → G saída; H entrada
#   Sicredi Osvaldo: N = Nprev + M - L → L saída; M entrada
#   Sicredi Pinzan : Q = Qprev + P - O → O saída; P entrada
COLUNA_MOVIMENTO = {
    "B": ("Osvaldo", "Banco do Brasil", "pagar"),
    "C": ("Osvaldo", "Banco do Brasil", "pagar"),
    "D": ("Osvaldo", "Banco do Brasil", "receber"),
    "G": ("Pinzan",  "Banco do Brasil", "pagar"),
    "H": ("Pinzan",  "Banco do Brasil", "receber"),
    "L": ("Osvaldo", "Sicredi",         "pagar"),
    "M": ("Osvaldo", "Sicredi",         "receber"),
    "O": ("Pinzan",  "Sicredi",         "pagar"),
    "P": ("Pinzan",  "Sicredi",         "receber"),
}

# Colunas que representam o saldo real do dia → SaldoDiarioBancario
COLUNA_SALDO = {
    "F": ("Osvaldo", "Banco do Brasil"),
    "J": ("Pinzan",  "Banco do Brasil"),
    "N": ("Osvaldo", "Sicredi"),
    "Q": ("Pinzan",  "Sicredi"),
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def _round2(v):
    if v is None:
        return None
    try:
        fv = float(v)
        if math.isnan(fv):
            return None
        return round(fv, 2)
    except (TypeError, ValueError):
        return None


def _parse_date(date_str) -> datetime | None:
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str)
    except ValueError:
        return None


def _carregar_jsons():
    with open(CLASSIFICACAO_PATH, encoding="utf-8") as f:
        classificacoes = json.load(f)["classificacoes"]
    with open(CELULAS_PATH, encoding="utf-8") as f:
        celulas = json.load(f)
    return classificacoes, celulas


def _build_linha_to_date(classificacoes: list, celulas: list) -> dict[int, datetime]:
    """
    Constrói mapa linha_excel → datetime usando correlação (coluna, valor).

    Estratégia:
      1. Para cada coluna, ordena as células por data e as entradas de
         classificacao por linha_excel.
      2. Percorre as entradas e tenta casar por (coluna, valor arredondado).
         Ao casar, remove a célula do pool para evitar reuso.
      3. Entradas sem casamento recebem data pela posição sequencial.
    """
    # Pool por coluna: lista ordenada por data de (valor_arredondado, data_str)
    pool: dict[str, list] = defaultdict(list)
    for c in sorted(celulas, key=lambda x: x.get("data") or ""):
        d = c.get("data")
        v = c.get("valor")
        if not d or v is None:
            continue
        pool[c["coluna"]].append([_round2(v), d])   # lista mutável para pop

    # Agrupa classificacoes por coluna → lista ordenada por linha_excel
    by_col: dict[str, list] = defaultdict(list)
    for e in sorted(classificacoes, key=lambda x: x["linha_excel"]):
        by_col[e["coluna"]].append(e)

    linha_dates: dict[int, datetime] = {}

    for col, entries in by_col.items():
        col_pool = pool.get(col, [])
        pool_vals = [item[0] for item in col_pool]   # view para busca

        for entry in entries:
            linha = entry["linha_excel"]
            if linha in linha_dates:
                continue
            v = _round2(entry["valor_na_planilha"])
            if v is None:
                continue   # sem valor numérico → não pode casar por valor
            # Tenta casar com o pool desta coluna
            try:
                idx = pool_vals.index(v)
                d_str = col_pool[idx][1]
                dt = _parse_date(d_str)
                if dt:
                    linha_dates[linha] = dt
                    # Remove para não reutilizar
                    col_pool.pop(idx)
                    pool_vals.pop(idx)
            except ValueError:
                pass   # sem match — será tratado pelo fallback

    # Fallback sequencial para linhas sem data
    linhas_sem_data = sorted(
        set(e["linha_excel"] for e in classificacoes) - set(linha_dates.keys())
    )
    if linhas_sem_data:
        todas_datas = sorted(
            set(_parse_date(c["data"]) for c in celulas if c.get("data"))
            - set(linha_dates.values())
        )
        for linha, dt in zip(linhas_sem_data, todas_datas):
            linha_dates[linha] = dt

    return linha_dates


def _get_ou_criar_empresa(db: Session, nome: str) -> Empresa:
    emp = db.query(Empresa).filter(Empresa.nome == nome).first()
    if not emp:
        emp = Empresa(nome=nome)
        db.add(emp)
        db.flush()
        print(f"  [+] Empresa criada: {nome}")
    return emp


def _get_ou_criar_conta(db: Session, empresa_id: int, banco: str) -> ContaBancaria:
    cb = (
        db.query(ContaBancaria)
        .filter(ContaBancaria.empresa_id == empresa_id, ContaBancaria.banco == banco)
        .first()
    )
    if not cb:
        cb = ContaBancaria(empresa_id=empresa_id, banco=banco)
        db.add(cb)
        db.flush()
        print(f"  [+] Conta bancária criada: {banco}")
    return cb


# ── Seed principal ────────────────────────────────────────────────────────────

def seed(db: Session):
    print("Carregando arquivos JSON...")
    classificacoes, celulas = _carregar_jsons()

    print("Construindo mapeamento linha -> data...")
    linha_to_date = _build_linha_to_date(classificacoes, celulas)
    print(f"  Datas mapeadas: {len(linha_to_date)}/{len(set(e['linha_excel'] for e in classificacoes))}")

    # ── 1. Garantir empresas e contas bancárias ───────────────────────────────
    print("\nCriando/verificando empresas e contas bancárias...")
    conta_map: dict[tuple, int] = {}   # (empresa_nome, banco) → conta_bancaria_id

    # Contas de movimento
    for col, (emp_nome, banco, _) in COLUNA_MOVIMENTO.items():
        if (emp_nome, banco) in conta_map:
            continue
        emp = _get_ou_criar_empresa(db, emp_nome)
        cb  = _get_ou_criar_conta(db, emp.id, banco)
        conta_map[(emp_nome, banco)] = cb.id

    # Contas de saldo (podem ser as mesmas)
    for col, (emp_nome, banco) in COLUNA_SALDO.items():
        if (emp_nome, banco) in conta_map:
            continue
        emp = _get_ou_criar_empresa(db, emp_nome)
        cb  = _get_ou_criar_conta(db, emp.id, banco)
        conta_map[(emp_nome, banco)] = cb.id

    db.commit()
    print(f"  Contas mapeadas: {len(conta_map)}")

    # ── 2. Importar transações (ContaPagar / ContaReceber) ────────────────────
    print("\nImportando transações...")

    # Verificar se já foram importadas (evita duplicata em re-execução)
    existentes_pagar   = db.query(ContaPagar.id).filter(ContaPagar.importado_excel == True).count()
    existentes_receber = db.query(ContaReceber.id).filter(ContaReceber.importado_excel == True).count()
    if existentes_pagar + existentes_receber > 0:
        print(f"  AVISO: já existem {existentes_pagar + existentes_receber} registros importados.")
        resp = input("  Deseja re-importar mesmo assim? (s/N) ").strip().lower()
        if resp != "s":
            print("  Importação de transações ignorada.")
        else:
            _importar_transacoes(db, classificacoes, linha_to_date, conta_map)
    else:
        _importar_transacoes(db, classificacoes, linha_to_date, conta_map)

    # ── 3. Importar saldos diários ────────────────────────────────────────────
    print("\nImportando saldos diários reais...")

    existentes_saldo = db.query(SaldoDiarioBancario.id).count()
    if existentes_saldo > 0:
        print(f"  AVISO: já existem {existentes_saldo} saldos diários.")
        resp = input("  Deseja re-importar mesmo assim? (s/N) ").strip().lower()
        if resp != "s":
            print("  Importação de saldos ignorada.")
        else:
            _importar_saldos(db, celulas, conta_map)
    else:
        _importar_saldos(db, celulas, conta_map)

    db.commit()
    print("\nSeed concluído com sucesso.")


def _importar_transacoes(
    db: Session,
    classificacoes: list,
    linha_to_date: dict,
    conta_map: dict,
):
    entradas_validas = [
        e for e in classificacoes
        if e.get("banco") and e.get("empresa") and e["coluna"] in COLUNA_MOVIMENTO
    ]
    print(f"  Total de entradas válidas: {len(entradas_validas)}")

    sem_data = 0
    inseridos_pagar   = 0
    inseridos_receber = 0

    BATCH = 500
    batch_pagar   = []
    batch_receber = []

    for entry in entradas_validas:
        dt = linha_to_date.get(entry["linha_excel"])
        if not dt:
            sem_data += 1
            continue

        emp_nome, banco, tipo = COLUNA_MOVIMENTO[entry["coluna"]]
        # A empresa e banco vêm do mapeamento de coluna — ignora o campo "empresa" do JSON
        # (que pode conter valores incorretos como "Osvaldo (conta secundária)")
        emp_chave = (emp_nome, banco)
        cb_id = conta_map.get(emp_chave)

        descricao = (entry.get("descricao") or "").replace("Server:\n", "").strip()
        descricao = descricao[:198] if descricao else f"Importado Excel col.{entry['coluna']}"
        valor_raw = _round2(entry.get("valor_na_planilha"))
        valor     = abs(valor_raw) if valor_raw is not None else 0.0

        if valor == 0.0:
            continue

        # Observação: tipo ML + NFs
        nfs  = entry.get("notas_fiscais") or []
        obs  = f"Tipo ML: {entry.get('tipo_documento', '')}"
        if nfs:
            obs += f" | NF: {', '.join(str(n) for n in nfs)}"
        obs = obs[:498]

        if tipo == "pagar":
            batch_pagar.append(dict(
                empresa_id        = _empresa_id_from_map(conta_map, emp_chave, db),
                conta_bancaria_id = cb_id,
                descricao         = descricao,
                valor             = valor,
                data_vencimento   = dt,
                data_pagamento    = dt,
                status            = "pago",
                observacao        = obs,
                postergado        = False,
                importado_excel   = True,
                criado_em         = dt,
            ))
        else:
            batch_receber.append(dict(
                empresa_id        = _empresa_id_from_map(conta_map, emp_chave, db),
                conta_bancaria_id = cb_id,
                descricao         = descricao,
                valor             = valor,
                data_vencimento   = dt,
                data_recebimento  = dt,
                status            = "recebido",
                observacao        = obs,
                postergado        = False,
                importado_excel   = True,
                criado_em         = dt,
            ))

        if len(batch_pagar) >= BATCH:
            db.bulk_insert_mappings(ContaPagar, batch_pagar)
            inseridos_pagar += len(batch_pagar)
            batch_pagar = []
            print(f"    ... {inseridos_pagar} a pagar inseridos")

        if len(batch_receber) >= BATCH:
            db.bulk_insert_mappings(ContaReceber, batch_receber)
            inseridos_receber += len(batch_receber)
            batch_receber = []
            print(f"    ... {inseridos_receber} a receber inseridas")

    # Flush dos remanescentes
    if batch_pagar:
        db.bulk_insert_mappings(ContaPagar, batch_pagar)
        inseridos_pagar += len(batch_pagar)
    if batch_receber:
        db.bulk_insert_mappings(ContaReceber, batch_receber)
        inseridos_receber += len(batch_receber)

    db.flush()
    print(f"  ContaPagar inseridas   : {inseridos_pagar}")
    print(f"  ContaReceber inseridas : {inseridos_receber}")
    print(f"  Entradas sem data      : {sem_data}")


# Cache de empresa_id para não bater no banco a cada linha
_emp_id_cache: dict[tuple, int] = {}

def _empresa_id_from_map(conta_map, chave, db: Session) -> int:
    if chave in _emp_id_cache:
        return _emp_id_cache[chave]
    cb_id = conta_map.get(chave)
    if cb_id:
        cb = db.query(ContaBancaria).filter(ContaBancaria.id == cb_id).first()
        if cb:
            _emp_id_cache[chave] = cb.empresa_id
            return cb.empresa_id
    emp_nome = chave[0]
    emp = db.query(Empresa).filter(Empresa.nome == emp_nome).first()
    if emp:
        _emp_id_cache[chave] = emp.id
        return emp.id
    raise ValueError(f"Empresa nao encontrada: {emp_nome}")


def _importar_saldos(db: Session, celulas: list, conta_map: dict):
    """Importa o saldo real por dia para cada conta bancária (colunas F, J, N, Q)."""

    # Apaga saldos existentes antes de re-importar
    db.query(SaldoDiarioBancario).delete()
    db.flush()

    inseridos = 0
    batch = []
    BATCH = 500

    # Indexa celulas por (coluna, data) para acesso rápido
    celulas_saldo = [
        c for c in celulas
        if c.get("coluna") in COLUNA_SALDO
        and c.get("data")
        and c.get("valor") is not None
    ]

    print(f"  Células de saldo encontradas: {len(celulas_saldo)}")

    # Controla unicidade (conta_bancaria_id, data) — mantém o último valor do dia
    seen: dict[tuple, dict] = {}

    for c in celulas_saldo:
        dt = _parse_date(c["data"])
        if not dt:
            continue

        emp_nome, banco = COLUNA_SALDO[c["coluna"]]
        cb_id = conta_map.get((emp_nome, banco))
        if not cb_id:
            continue

        key = (cb_id, dt)
        seen[key] = dict(
            conta_bancaria_id = cb_id,
            data              = dt,
            saldo             = float(c["valor"]),
            coluna_excel      = c["coluna"],
        )

    for rec in seen.values():
        batch.append(rec)
        if len(batch) >= BATCH:
            db.bulk_insert_mappings(SaldoDiarioBancario, batch)
            inseridos += len(batch)
            batch = []
            print(f"    ... {inseridos} saldos inseridos")

    if batch:
        db.bulk_insert_mappings(SaldoDiarioBancario, batch)
        inseridos += len(batch)

    db.flush()
    print(f"  Saldos diários inseridos: {inseridos}")


# ── Ponto de entrada ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed(db)
    except Exception as e:
        db.rollback()
        print(f"\nERRO: {e}")
        raise
    finally:
        db.close()
