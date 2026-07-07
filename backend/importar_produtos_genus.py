"""
Importação dos produtos do GENUS (GENUS_ZANGUETTIN.FDB) para a tabela
`produtos` do Postgres.

Só INSERE. Nunca atualiza ou apaga produtos que já existem no Postgres.
Deduplicação é feita aqui, na aplicação, comparando o `codigo` de cada
produto do GENUS contra os códigos já existentes no Postgres (não há
constraint UNIQUE no banco — ver migrate_add_produto_fields.py).

Lê a tabela PRODUTO do Firebird via `isql` em vez do driver Python
(`firebird-driver`), porque o fbclient.dll instalado nesta máquina é
32-bit e o venv do projeto é 64-bit (WinError 193 ao tentar carregar).
O charset do banco é WIN1252 — confirmado lendo bytes reais de
descrições de produto (CONEXÃO, AÇO, PLÁSTICO, AGRÍCOLAS decodificaram
corretamente). OBS e DESCRIDETALHADA são BLOB de texto — lidos via
CAST(campo AS VARCHAR(N)) direto no SQL, sem precisar do driver.

Uso (dentro da pasta backend, com o venv ativo):
    python importar_produtos_genus.py --dry-run   # só valida e mostra o resumo, não grava nada
    python importar_produtos_genus.py             # importa de verdade
"""
import sys
import os
import re
import subprocess
import argparse
import datetime

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal
from models.tabelas import Produto

ISQL = r"C:\Program Files (x86)\Firebird\Firebird_2_5\bin\isql.exe"
GENUS_DB = r"C:\Users\mzang\Documents\VS Code\arquivos empresas\GENUS_ZANGUETTIN.FDB"
GENUS_USER = "SYSDBA"
GENUS_PASSWORD = "masterkey"

EXPORT_SQL_PATH = os.path.join(os.path.dirname(__file__), "_export_produtos_genus.sql")
EXPORT_OUT_PATH = os.path.join(os.path.dirname(__file__), "_export_produtos_genus.txt")

# separadores de campo/linha — caracteres de controle que não aparecem em texto real
FS = "\x1f"
RS = "\x1e"

# (coluna_postgres, coluna_genus, categoria, tamanho_do_cast_varchar)
FIELD_MAP = [
    ("nome", "DESCRI", "str", 120),
    ("codigo", "CODIGO", "str", 40),
    ("codigo_interno", "CODINTERNO", "str", 50),
    ("codigo_secundario", "CODSECUNDARIO", "str", 50),
    ("referencia", "REFERENCIA", "str", 40),
    ("descricao_interna", "DESCRIINTERNA", "str", 70),
    ("descricao_detalhada", "DESCRIDETALHADA", "str", 2000),
    ("ecf_descricao", "ECFDESCRI", "str", 50),
    ("situacao", "SITUACAO", "str", 30),
    ("marcador", "MARCADOR", "str", 30),
    ("observacao", "OBS", "str", 2000),
    ("cod_grupo", "CODGRUPO", "int", None),
    ("cod_subgrupo", "CODSUBGRUPO", "int", None),
    ("cod_marca", "CODMARCA", "int", None),
    ("cod_classificacao", "CODCLASSIFICACAO", "int", None),
    ("cod_cor", "CODCOR", "int", None),
    ("cod_tamanho", "CODTAMANHO", "str", 30),
    ("cod_tamanho_produto", "TAMANHOPROD", "int", None),
    ("cod_linha", "CODLINHA", "int", None),
    ("cod_grade", "CODGRADE", "int", None),
    ("cod_produto_grade", "CODPRODUTOGRADE", "str", 35),
    ("tipo_produto", "TIPOPRODUTO", "str", 30),
    ("tipo", "TIPO", "str", 30),
    ("tipo_produto_fabrica", "TIPOPRODUTOFABRICA", "str", 30),
    ("ncm", "CLASSFISCAL", "str", 30),
    ("cst", "ST", "str", 30),
    ("csosn", "CSOSN", "str", 30),
    ("cfop_dentro_estado", "CODCFOPESTADO", "str", 30),
    ("cfop_fora_estado", "CODCFOPFORAESTADO", "str", 30),
    ("origem_mercadoria", "ORIGINAL", "str", 30),
    ("codigo_anp", "ANP", "str", 30),
    ("cod_contabil_avista", "CODCONTABILAVISTA", "str", 30),
    ("cod_contabil_prazo", "CODCONTABILPRAZO", "str", 30),
    ("reforma_cclasstrib", "REFORMA_CCLASSTRIB", "str", 30),
    ("cod_cbenef", "CODCBENEF", "int", None),
    ("unidade_venda", "UNIDADE", "str", 30),
    ("unidade_compra", "UNIDADECOMPRA", "str", 30),
    ("qtde_embalagem", "QTDEEMBAL", "float", None),
    ("fator_conversao", "FATORCONVERSAO", "float", None),
    ("tipo_conversao", "TIPOCONVERSAO", "str", 30),
    ("multiplo_producao", "MULTIPLOPRODUCAO", "float", None),
    ("kg_por_metro", "KGMT", "float", None),
    ("fator_unde", "UNDE", "float", None),
    ("kilos_receita", "KILOSRECEITA", "float", None),
    ("seq_codigo_barra", "SEQCODBARRA", "str", 33),
    ("peso_liquido", "PESOLIQUIDO", "float", None),
    ("peso_bruto", "PESOBRUTO", "float", None),
    ("altura", "ALTURA", "float", None),
    ("largura", "LARGURA", "float", None),
    ("comprimento", "COMPRIMENTO", "float", None),
    ("espessura", "ESPESSURA", "float", None),
    ("cubicagem", "CUBICAGEM", "float", None),
    ("metros_cubicos", "METROSCUBICOS", "float", None),
    ("margem_lucro", "MARGEMLUCRO", "float", None),
    ("validade_dias", "VALIDADE", "int", None),
    ("hora_padrao", "HORAPADRAO", "float", None),
    ("data_seguro", "SEGURO", "data", None),
    ("data_licenciamento", "LICENCIAMENTO", "data", None),
    ("relatorio_tabela_preco", "RELATORIOTABELAPRECO", "str", 30),
    ("ponteira_tipo", "PONTEIRATIPO", "str", 30),
    ("ponteira_tipo_box", "PONTEIRATIPOBOX", "str", 30),
    ("ponteira_tipo_decote", "PONTEIRATIPODECOTE", "str", 30),
    ("cod_empresa_transferencia", "COD_EMPRESA_TRANSF", "int", None),
    ("cod_empresa_transf1", "COD_EMPRESA_TRANSF1", "int", None),
    ("cod_empresa_transf2", "COD_EMPRESA_TRANSF2", "int", None),
    ("cod_antigo_transfere1", "COD_ANTIGO_TRANSFERE1", "int", None),
    ("cod_antigo_transfere2", "COD_ANTIGO_TRANSFERE2", "int", None),
    ("cod_evento", "CODEVENTO", "int", None),
    ("cod_alteracao", "CODALTERACAO", "int", None),
    ("cod_funcionario_inclusao", "CODFUNCIONARIOINSERE", "int", None),
    ("cod_funcionario_alteracao", "CODFUNCIONARIOALTERA", "int", None),
    ("hora_alteracao_genus", "HORAALTERACAO", "str", 30),
    ("data_alteracao_genus", "DATAALTERACAO", "data", None),
    ("data_hora_alterado_genus", "DATA_HORA_ALTERADO", "data", None),
]


def montar_sql_export():
    partes = []
    for _pg_col, genus_col, categoria, tam in FIELD_MAP:
        largura = tam if categoria == "str" else 60
        partes.append(f"COALESCE(CAST({genus_col} AS VARCHAR({largura})), '')")
    expressao = " || ASCII_CHAR(31) || ".join(partes)
    sql = (
        "SET LIST OFF;\nSET HEADING OFF;\n"
        f"OUTPUT '{os.path.basename(EXPORT_OUT_PATH)}';\n"
        f"SELECT {expressao} || ASCII_CHAR(30)\nFROM PRODUTO\nORDER BY CODIGO;\n"
        "OUTPUT;\n"
    )
    with open(EXPORT_SQL_PATH, "w", encoding="ascii") as f:
        f.write(sql)


def rodar_export():
    montar_sql_export()
    # o comando OUTPUT do isql ANEXA a um arquivo já existente em vez de sobrescrever —
    # sem isso, rodar o script mais de uma vez duplicava as linhas exportadas
    if os.path.exists(EXPORT_OUT_PATH):
        os.remove(EXPORT_OUT_PATH)
    resultado = subprocess.run(
        [ISQL, "-user", GENUS_USER, "-password", GENUS_PASSWORD,
         f"localhost:{GENUS_DB}", "-i", EXPORT_SQL_PATH],
        cwd=os.path.dirname(__file__),
        capture_output=True, text=False, timeout=300,
    )
    if resultado.returncode != 0:
        raise RuntimeError(f"isql falhou: {resultado.stderr!r}")


def parse_linha(campos_raw):
    dados = {}
    for (pg_col, _genus_col, categoria, _tam), valor in zip(FIELD_MAP, campos_raw):
        valor = valor.rstrip(" ").lstrip("\r\n")
        if valor == "" or valor == "<null>":
            dados[pg_col] = None
            continue
        try:
            if categoria == "int":
                dados[pg_col] = int(float(valor))
            elif categoria == "float":
                dados[pg_col] = float(valor)
            elif categoria == "data":
                valor_limpo = valor.split(".")[0]  # descarta fração de segundo do TIMESTAMP
                if len(valor_limpo) > 10:
                    dados[pg_col] = datetime.datetime.strptime(valor_limpo, "%Y-%m-%d %H:%M:%S")
                else:
                    dados[pg_col] = datetime.datetime.strptime(valor_limpo, "%Y-%m-%d")
            else:
                dados[pg_col] = valor
        except ValueError:
            dados[pg_col] = None
    return dados


def ler_produtos_exportados():
    with open(EXPORT_OUT_PATH, "rb") as f:
        bruto = f.read()
    texto = bruto.decode("cp1252", errors="replace")
    linhas = texto.split(RS)
    produtos = []
    for linha in linhas:
        if not linha.strip():
            continue
        campos = linha.split(FS)
        if len(campos) != len(FIELD_MAP):
            continue  # linha corrompida/incompleta — pula em vez de derrubar o import inteiro
        # isql preenche a expressão concatenada até a largura fixa declarada (soma dos
        # VARCHAR); essa sobra de espaços + \r\n do fim da linha anterior gruda no
        # começo do 1o campo desta linha. O 1o campo (nome/DESCRI) nunca tem quebra de
        # linha de verdade, então cortar tudo até o último \n resolve sem risco.
        if "\n" in campos[0]:
            campos[0] = campos[0].rsplit("\n", 1)[-1]
        produtos.append(parse_linha(campos))
    return produtos


def importar(dry_run: bool):
    print("Exportando PRODUTO do GENUS via isql...")
    rodar_export()
    produtos = ler_produtos_exportados()
    print(f"Linhas lidas do GENUS: {len(produtos)}")

    db = SessionLocal()
    try:
        existentes = {c for (c,) in db.query(Produto.codigo).filter(Produto.codigo.isnot(None)).all()}
        print(f"Códigos já existentes no Postgres: {len(existentes)}")

        novos, duplicados, sem_codigo, sem_nome = 0, 0, 0, 0
        vistos_nesta_importacao = set()

        for dados in produtos:
            codigo = dados.get("codigo")
            if not codigo:
                sem_codigo += 1
                continue
            if codigo in existentes or codigo in vistos_nesta_importacao:
                duplicados += 1
                continue
            if not dados.get("nome"):
                dados["nome"] = codigo  # nome é NOT NULL no Postgres; usa o código como fallback
                sem_nome += 1

            dados.setdefault("preco", 0.0)   # PRODUTO do GENUS não tem preço (fica na tabela PRECO, fora do escopo aqui)
            dados.setdefault("estoque", 0)
            dados["situacao"] = dados.get("situacao") or "A"

            vistos_nesta_importacao.add(codigo)
            novos += 1
            if not dry_run:
                db.add(Produto(**dados))
                if novos % 500 == 0:
                    db.commit()
                    print(f"  ... {novos} gravados")

        if not dry_run:
            db.commit()

        print("\n=== Resumo ===")
        print(f"Novos {'a importar' if dry_run else 'importados'}: {novos}")
        print(f"Duplicados (código já existia): {duplicados}")
        print(f"Sem código no GENUS (pulados): {sem_codigo}")
        print(f"Sem nome/descrição (usou o código como nome): {sem_nome}")
        if dry_run:
            print("\nDRY RUN — nada foi gravado no Postgres.")
        else:
            total_final = db.query(Produto).count()
            print(f"Total de produtos no Postgres agora: {total_final}")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Só valida e mostra o resumo, não grava nada")
    args = parser.parse_args()
    importar(dry_run=args.dry_run)
