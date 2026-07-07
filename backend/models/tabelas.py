from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Boolean, Text, LargeBinary
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    documento = Column(String(20), unique=True) # CPF/CNPJ

class Produto(Base):
    """Cadastro de produto.

    Além dos campos originais do ERP, esta tabela reconhece todos os campos
    da tabela PRODUTO do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), para
    permitir importar o cadastro de produtos sem perda de informação.
    Nomes e tipos foram conferidos diretamente no schema Firebird do GENUS.
    """
    __tablename__ = "produtos"

    # ── Campos originais do ERP ───────────────────────────────────────────
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)   # GENUS: DESCRI
    preco = Column(Float, nullable=False)
    estoque = Column(Integer, default=0)
    caracteristicas = Column(JSON)   # cor, tamanho etc. como mapa livre

    precos = relationship("PrecoProduto", back_populates="produto", cascade="all, delete-orphan")
    processos = relationship("ProdutoProcesso", back_populates="produto", cascade="all, delete-orphan")
    regras_cliente = relationship("RegraProdutoCliente", back_populates="produto", cascade="all, delete-orphan")
    regras_classificacao_cliente = relationship("RegraCliente", back_populates="produto", cascade="all, delete-orphan")
    codigos_barra = relationship("ProdutoBarra", back_populates="produto", cascade="all, delete-orphan")
    producoes = relationship("ProdutoProducao", back_populates="produto", cascade="all, delete-orphan")
    referencias_fornecedor = relationship("ProdutoReferencia", back_populates="produto", cascade="all, delete-orphan")
    regras = relationship("ProdutoRegra", back_populates="produto", cascade="all, delete-orphan")
    foto = relationship("ProdutoFoto", back_populates="produto", uselist=False, cascade="all, delete-orphan")
    movimentos = relationship("MovtoProduto", back_populates="produto", cascade="all, delete-orphan")
    itens_saida = relationship("ItemSaida", back_populates="produto", cascade="all, delete-orphan")
    itens_saida_excluidos = relationship("ItemSaidaExcluido", back_populates="produto", cascade="all, delete-orphan")
    itens_saida_cancelados = relationship("ItemSaidaCancelado", back_populates="produto", cascade="all, delete-orphan")
    itens_entrada = relationship("ItemEntrada", back_populates="produto", cascade="all, delete-orphan")
    itens_compra = relationship("ItemCompra", back_populates="produto", cascade="all, delete-orphan")
    itens_orcamento_genus = relationship("ItemOrcamentoGenus", back_populates="produto", cascade="all, delete-orphan")
    itens_pedido_lan = relationship("ItemPedidoLan", back_populates="produto", cascade="all, delete-orphan")
    produto_excluido = relationship("ProdutoExcluido", back_populates="produto", uselist=False, cascade="all, delete-orphan")
    composicoes = relationship("ProdutoComposicao", foreign_keys="ProdutoComposicao.produto_id", back_populates="produto", cascade="all, delete-orphan")
    composicoes_como_materia = relationship("ProdutoComposicao", foreign_keys="ProdutoComposicao.produto_materia_id", back_populates="materia_prima")
    conversoes_fornecedor = relationship("ProdutoConversaoFornecedor", back_populates="produto", cascade="all, delete-orphan")
    cotacao_itens = relationship("CotacaoItens", back_populates="produto", cascade="all, delete-orphan")
    cotacao_produtos = relationship("CotacaoProduto", back_populates="produto", cascade="all, delete-orphan")
    requisicao_produtos = relationship("RequisicaoProduto", back_populates="produto", cascade="all, delete-orphan")

    # ── Campos comerciais do ERP atual (não existem na tabela GENUS.PRODUTO) ─
    codigo_fornecedor = Column(String(30), nullable=True)
    categoria = Column(String(50), nullable=True)
    custo = Column(Float, nullable=True)
    preco_minimo = Column(Float, nullable=True)
    preco_atacado = Column(Float, nullable=True)

    # ── Campos migrados de GENUS.PRODUTO ──────────────────────────────────
    # Identificação
    codigo = Column(String(20), unique=True, nullable=True, index=True)          # CODIGO
    codigo_interno = Column(String(30), nullable=True)                           # CODINTERNO
    codigo_secundario = Column(String(30), nullable=True)                        # CODSECUNDARIO
    referencia = Column(String(20), nullable=True)                               # REFERENCIA
    descricao_interna = Column(String(50), nullable=True)                        # DESCRIINTERNA
    descricao_detalhada = Column(Text, nullable=True)                           # DESCRIDETALHADA
    ecf_descricao = Column(String(30), nullable=True)                           # ECFDESCRI
    situacao = Column(String(1), default="A")                                  # SITUACAO ('A' ativo / 'I' inativo)
    marcador = Column(String(10), nullable=True)                                # MARCADOR
    observacao = Column(Text, nullable=True)                                    # OBS

    # Classificação (códigos ainda não resolvidos contra tabelas próprias)
    cod_grupo = Column(Integer, nullable=True)                                  # CODGRUPO (resolve, no futuro, contra GrupoProduto.codigo com tipo='grupo')
    cod_subgrupo = Column(Integer, nullable=True)                               # CODSUBGRUPO (resolve, no futuro, contra GrupoProduto.codigo com tipo='subgrupo' — ver docstring de GrupoProduto)
    cod_marca = Column(Integer, nullable=True)                                  # CODMARCA
    cod_classificacao = Column(Integer, nullable=True)                         # CODCLASSIFICACAO
    cod_cor = Column(Integer, nullable=True)                                    # CODCOR
    cod_tamanho = Column(String(5), nullable=True)                             # CODTAMANHO
    cod_tamanho_produto = Column(Integer, nullable=True)                       # TAMANHOPROD
    cod_linha = Column(Integer, nullable=True)                                  # CODLINHA
    cod_grade = Column(Integer, nullable=True)                                  # CODGRADE
    cod_produto_grade = Column(String(15), nullable=True)                      # CODPRODUTOGRADE
    tipo_produto = Column(String(1), nullable=True)                            # TIPOPRODUTO
    tipo = Column(String(1), nullable=True)                                     # TIPO
    tipo_produto_fabrica = Column(String(1), nullable=True)                    # TIPOPRODUTOFABRICA

    # Fiscal
    ncm = Column(String(10), nullable=True)                                     # CLASSFISCAL
    cst = Column(String(5), nullable=True)                                      # ST
    csosn = Column(String(4), nullable=True)                                    # CSOSN
    cfop_dentro_estado = Column(String(10), nullable=True)                     # CODCFOPESTADO
    cfop_fora_estado = Column(String(10), nullable=True)                      # CODCFOPFORAESTADO
    origem_mercadoria = Column(String(1), nullable=True)                       # ORIGINAL (origem ICMS 0-8)
    codigo_anp = Column(String(9), nullable=True)                              # ANP
    cod_contabil_avista = Column(String(10), nullable=True)                    # CODCONTABILAVISTA
    cod_contabil_prazo = Column(String(10), nullable=True)                     # CODCONTABILPRAZO
    reforma_cclasstrib = Column(String(10), nullable=True)                     # REFORMA_CCLASSTRIB (reforma tributária)
    cod_cbenef = Column(Integer, nullable=True)                                 # CODCBENEF

    # Unidades e conversões
    unidade_venda = Column(String(10), nullable=True)                          # UNIDADE
    unidade_compra = Column(String(10), nullable=True)                         # UNIDADECOMPRA
    qtde_embalagem = Column(Float, nullable=True)                              # QTDEEMBAL
    fator_conversao = Column(Float, nullable=True)                             # FATORCONVERSAO
    tipo_conversao = Column(String(1), nullable=True)                          # TIPOCONVERSAO
    multiplo_producao = Column(Float, nullable=True)                          # MULTIPLOPRODUCAO
    kg_por_metro = Column(Float, nullable=True)                                # KGMT
    fator_unde = Column(Float, nullable=True)                                  # UNDE (campo de origem obscura no GENUS)
    kilos_receita = Column(Float, nullable=True)                              # KILOSRECEITA
    seq_codigo_barra = Column(String(13), nullable=True)                      # SEQCODBARRA

    # Pesos e dimensões
    peso_liquido = Column(Float, nullable=True)                               # PESOLIQUIDO
    peso_bruto = Column(Float, nullable=True)                                 # PESOBRUTO
    altura = Column(Float, nullable=True)                                      # ALTURA
    largura = Column(Float, nullable=True)                                     # LARGURA
    comprimento = Column(Float, nullable=True)                                # COMPRIMENTO
    espessura = Column(Float, nullable=True)                                  # ESPESSURA
    cubicagem = Column(Float, nullable=True)                                  # CUBICAGEM
    metros_cubicos = Column(Float, nullable=True)                             # METROSCUBICOS

    # Comercial / produção
    margem_lucro = Column(Float, nullable=True)                               # MARGEMLUCRO
    validade_dias = Column(Integer, nullable=True)                            # VALIDADE
    hora_padrao = Column(Float, nullable=True)                                 # HORAPADRAO (horas padrão de produção)
    data_seguro = Column(DateTime, nullable=True)                             # SEGURO
    data_licenciamento = Column(DateTime, nullable=True)                      # LICENCIAMENTO
    relatorio_tabela_preco = Column(String(1), nullable=True)                # RELATORIOTABELAPRECO

    # Ponteiras (linha de produção específica da Zanguettin)
    ponteira_tipo = Column(String(1), nullable=True)                          # PONTEIRATIPO
    ponteira_tipo_box = Column(String(1), nullable=True)                      # PONTEIRATIPOBOX
    ponteira_tipo_decote = Column(String(1), nullable=True)                  # PONTEIRATIPODECOTE

    # Transferência entre empresas / código antigo (multi-empresa GENUS)
    cod_empresa_transferencia = Column(Integer, nullable=True)                # COD_EMPRESA_TRANSF
    cod_empresa_transf1 = Column(Integer, nullable=True)                     # COD_EMPRESA_TRANSF1
    cod_empresa_transf2 = Column(Integer, nullable=True)                     # COD_EMPRESA_TRANSF2
    cod_antigo_transfere1 = Column(Integer, nullable=True)                   # COD_ANTIGO_TRANSFERE1
    cod_antigo_transfere2 = Column(Integer, nullable=True)                   # COD_ANTIGO_TRANSFERE2

    # Auditoria de origem (GENUS)
    cod_evento = Column(Integer, nullable=True)                              # CODEVENTO
    cod_alteracao = Column(Integer, nullable=True)                           # CODALTERACAO
    cod_funcionario_inclusao = Column(Integer, nullable=True)                # CODFUNCIONARIOINSERE
    cod_funcionario_alteracao = Column(Integer, nullable=True)               # CODFUNCIONARIOALTERA
    hora_alteracao_genus = Column(String(8), nullable=True)                  # HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                  # DATAALTERACAO
    data_hora_alterado_genus = Column(DateTime, nullable=True)              # DATA_HORA_ALTERADO


class PrecoProduto(Base):
    """Preço de tabela por produto/empresa.

    Reconhece a estrutura completa da tabela PRECO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `Produto`/GENUS.PRODUTO. No GENUS, PRECO é uma tabela "filha" de
    PRODUTO: guarda, para cada combinação de produto + empresa + tabela de
    preço (CODPRODUTO + CODEMPRESA + CODTABELAPRECO), o valor (ou
    percentual) praticado — ou seja, um mesmo produto pode ter várias
    linhas em PRECO (uma por empresa/tabela de preço).

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRECO.CODPRODUTO com GENUS.PRODUTO.CODIGO (= `Produto.codigo`
    neste ERP) — tarefa do agente de migração de dados, não deste agente
    de estrutura. Por isso `produto_id` é opcional (nullable) e o código
    bruto original (`cod_produto`) é preservado à parte, para não perder
    informação até que essa resolução aconteça.

    CODEMPRESA e CODTABELAPRECO também são mantidos como códigos brutos
    (`cod_empresa`, `cod_tabela_preco`), sem FK própria — assim como já
    ocorre em outras tabelas do GENUS já reconhecidas neste ERP (ex.:
    `Orcamento.cod_empresa`, `Orcamento.cod_tabela_preco`) — pois as
    tabelas de tabela de preço (TABELAPRECO) ainda não têm model dedicado
    neste ERP.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "precos_produto"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRECO ────────────────────────────────────
    cod_produto = Column(String(15), nullable=True, index=True)             # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    cod_empresa = Column(Integer, nullable=True, index=True)                # GENUS: CODEMPRESA
    cod_tabela_preco = Column(Integer, nullable=True, index=True)           # GENUS: CODTABELAPRECO
    valor = Column(Float, nullable=True)                                    # GENUS: VALOR
    percentual = Column(Float, nullable=True)                               # GENUS: PERCENTUAL
    data_hora_alterado_genus = Column(DateTime, nullable=True)              # GENUS: DATA_HORA_ALTERADO

    produto = relationship("Produto", back_populates="precos")


class ProdutoProcesso(Base):
    """Processo produtivo/roteiro de um produto (tempo padrão, valor, ordem).

    Reconhece a estrutura completa da tabela PRODUTOPROCESSO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente
    estabelecido para `Produto`/GENUS.PRODUTO e `PrecoProduto`/GENUS.PRECO.
    No GENUS, PRODUTOPROCESSO é uma tabela "filha" de PRODUTO: guarda, para
    cada combinação de produto + processo (CODPRODUTO + CODPROCESSO), o
    tempo padrão de execução, valor e ordem dentro do roteiro de produção —
    ou seja, um mesmo produto pode ter várias linhas em PRODUTOPROCESSO (uma
    por etapa/processo do seu roteiro).

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRODUTOPROCESSO.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    CODPROCESSO também é mantido como código bruto (`cod_processo`), sem FK
    própria — assim como já ocorre em outras tabelas do GENUS já
    reconhecidas neste ERP (ex.: `PrecoProduto.cod_empresa`) — pois a
    resolução de fato (CODPROCESSO -> PROCESSO.CODIGO) contra o model
    dedicado `Processo` (ver classe abaixo) é tarefa do agente de migração
    de dados, não deste agente de estrutura.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_processos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRODUTOPROCESSO ──────────────────────────
    cod_produto = Column(String(15), nullable=True, index=True)          # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    cod_processo = Column(Integer, nullable=True, index=True)            # GENUS: CODPROCESSO
    tempo_padrao = Column(String(6), nullable=True)                      # GENUS: TEMPOPADRAO
    observacao = Column(Text, nullable=True)                             # GENUS: OBS
    valor = Column(Float, nullable=True)                                 # GENUS: VALOR
    ordem = Column(Integer, nullable=True)                               # GENUS: ORDEM

    produto = relationship("Produto", back_populates="processos")


class RegraProdutoCliente(Base):
    """Regra comercial de produto por cliente (preço/condição específica).

    Reconhece a estrutura completa da tabela REGRASPRODCLI do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO, `PrecoProduto`/GENUS.PRECO e
    `ProdutoProcesso`/GENUS.PRODUTOPROCESSO. No GENUS, REGRASPRODCLI é uma
    tabela "filha" de PRODUTO: guarda, para cada combinação de produto +
    cliente (CODPRODUTO + CODCLIENTE), uma regra específica daquele cliente
    para aquele produto — ou seja, um mesmo produto pode ter várias linhas
    em REGRASPRODCLI (uma por cliente com regra própria).

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.REGRASPRODCLI.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    CODCLIENTE, diferente de CODPRODUTO, NÃO ganha FK própria aqui: no
    GENUS, CLIENTE não guarda identidade própria — ela referencia a tabela
    mestre CADASTRO através de CODCADASTRO (ver `ClienteCompleto` acima) — e
    o model `ClienteCompleto` deste ERP ainda não guarda o código bruto
    GENUS.CLIENTE.CODCLIENTE (sua chave real) que permitiria essa resolução.
    Por isso `cod_cliente` é mantido como código bruto, sem FK, exatamente
    como já ocorre em outras tabelas do GENUS já reconhecidas neste ERP
    (ex.: `ContaReceber.cod_cliente`, `ContaPagar.cod_fornecedor`) — a
    entidade real, quando migrada de fato, vai exigir resolver essa
    referência contra CLIENTE/CADASTRO.

    CODREGRAS é o identificador (chave primária) original da regra dentro do
    GENUS — preservado como código bruto (`cod_regras`), sem reaproveitar
    como PK deste ERP, seguindo o mesmo padrão usado em outras tabelas do
    GENUS (ex.: `ContaPagar.codigo` <- GENUS.PAGAR.CODIGO).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "regras_produto_cliente"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.REGRASPRODCLI ────────────────────────────
    cod_regras = Column(Integer, nullable=True, index=True)                 # GENUS: CODREGRAS (identificador original da regra no GENUS)
    cod_produto = Column(String(15), nullable=True, index=True)             # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    cod_cliente = Column(Integer, nullable=True, index=True)                # GENUS: CODCLIENTE (código bruto — requer resolução futura contra CLIENTE/CADASTRO)

    produto = relationship("Produto", back_populates="regras_cliente")


class RegraCliente(Base):
    """Regra de classificação fiscal específica de cliente, por produto —
    tabela REGRASCLIENTE do GENUS (módulo Cadastros, Tier 2).

    Reconhece a estrutura da tabela REGRASCLIENTE do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente já estabelecido
    para `Produto`/GENUS.PRODUTO e, mais diretamente, `RegraProdutoCliente`
    /GENUS.REGRASPRODCLI (tabela irmã, também filha de produto+cliente).
    Tipos seguem a sugestão de partida do agente de estrutura (CODIGO,
    CODCLIENTE e CODCLASSIFICACAO como Integer; CODPRODUTO como
    String(15), mesmo tipo já usado para `RegraProdutoCliente.cod_produto`)
    — não foi possível confirmar ao vivo contra o Firebird nesta sessão
    (arquivo GENUS_ZANGUETTIN.FDB e `isql` não encontrados nesta máquina);
    caso um agente futuro tenha acesso ao schema live, vale conferir antes
    de assumir.

    Apesar de compartilhar CODPRODUTO/CODCLIENTE com REGRASPRODCLI, e do
    nome parecido, REGRASCLIENTE é uma tabela GENUS distinta (não é a
    mesma coisa, nem um apelido): além do produto e do cliente, ela também
    guarda CODCLASSIFICACAO — ou seja, é a regra que define, por cliente,
    qual classificação fiscal (GENUS.CLASSIFICACAO/NCM, já reconhecida
    neste ERP como `Classificacao`) deve ser aplicada a um produto
    específico vendido para aquele cliente — uma exceção fiscal por
    cliente, distinta da classificação fiscal "padrão" do produto em
    `Produto.cod_classificacao`. Um mesmo produto pode ter várias linhas
    em REGRASCLIENTE (uma por cliente com regra própria), assim como em
    REGRASPRODCLI — por isso, tal como lá, este model é filho de `Produto`
    (via `produto_id`, opcional/nullable):

    - CODIGO: identificador original da regra no GENUS — preservado como
      código bruto (`codigo`), sem reaproveitar como PK deste ERP, mesmo
      padrão usado em `RegraProdutoCliente.cod_regras` <- GENUS.CODREGRAS.
    - CODPRODUTO: resolvido, quando possível, contra `Produto.codigo`, via
      `produto_id` (nullable) — resolução real (casar o código bruto com
      a linha de `Produto` correta) é tarefa do agente de migração de
      dados, não deste agente de estrutura. O código bruto (`cod_produto`)
      é preservado à parte, para não perder informação até essa resolução.
    - CODCLIENTE: NÃO ganha FK própria aqui, pelo mesmo motivo já descrito
      em `RegraProdutoCliente.cod_cliente` — no GENUS, CLIENTE não guarda
      identidade própria (referencia a tabela mestre CADASTRO via
      CODCADASTRO — ver `ClienteCompleto`/`CadastroPessoa`), e o model
      `ClienteCompleto` deste ERP ainda não guarda o código bruto
      GENUS.CLIENTE.CODCLIENTE (sua chave real) que permitiria essa
      resolução. Por isso `cod_cliente` é mantido como código bruto, sem
      FK, exatamente como já ocorre em `RegraProdutoCliente.cod_cliente`.
    - CODCLASSIFICACAO: mantido como código bruto (`cod_classificacao`),
      sem FK formal contra `Classificacao.codigo` — mesmo critério já
      usado em `Produto.cod_classificacao` (idêntica referência lógica,
      também sem FK formal nesta base) e em `Classificacao.cod_produto_tipo`
      /`cod_cest`. Resolver essa referência é tarefa do agente de migração
      de dados, fora do escopo desta atualização estrutural.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "regras_cliente"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.REGRASCLIENTE ─────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)                     # GENUS: CODIGO (identificador original da regra no GENUS)
    cod_produto = Column(String(15), nullable=True, index=True)             # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    cod_cliente = Column(Integer, nullable=True, index=True)                # GENUS: CODCLIENTE (código bruto — requer resolução futura contra CLIENTE/CADASTRO)
    cod_classificacao = Column(Integer, nullable=True, index=True)          # GENUS: CODCLASSIFICACAO (código bruto — requer resolução futura contra CLASSIFICACAO.CODIGO)

    produto = relationship("Produto", back_populates="regras_classificacao_cliente")


class ProdutoBarra(Base):
    """Código de barras alternativo de um produto.

    Reconhece a estrutura completa da tabela PRODUTOBARRA do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO, `PrecoProduto`/GENUS.PRECO,
    `ProdutoProcesso`/GENUS.PRODUTOPROCESSO e
    `RegraProdutoCliente`/GENUS.REGRASPRODCLI. No GENUS, PRODUTOBARRA é uma
    tabela "filha" de PRODUTO: guarda, para cada combinação de produto +
    código de barras (CODPRODUTO + CODBARRA), um código de barras adicional
    (EAN/GTIN alternativo, embalagem, múltiplo etc.) — ou seja, um mesmo
    produto pode ter várias linhas em PRODUTOBARRA (um por código de barras
    alternativo cadastrado).

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRODUTOBARRA.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_barras"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRODUTOBARRA ─────────────────────────────
    cod_produto = Column(String(15), nullable=True, index=True)          # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    codigo_barra = Column(String(20), nullable=True, index=True)         # GENUS: CODBARRA

    produto = relationship("Produto", back_populates="codigos_barra")


class ProdutoFoto(Base):
    """Foto/imagem cadastrada para um produto.

    Reconhece a estrutura completa da tabela PRODUTOFOTO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO, `PrecoProduto`/GENUS.PRECO,
    `ProdutoProcesso`/GENUS.PRODUTOPROCESSO,
    `RegraProdutoCliente`/GENUS.REGRASPRODCLI e
    `ProdutoBarra`/GENUS.PRODUTOBARRA. Diferente dessas outras tabelas
    "filhas" de PRODUTO (que permitem várias linhas por produto),
    PRODUTOFOTO é 1:1 com PRODUTO: sua chave primária (PK_PRODUTOFOTO) é o
    próprio CODPRODUTO, e sua FK (FK_PRODUTOFOTO_PRODUTO -> PK_PRODUTO) tem
    regra ON UPDATE/DELETE CASCADE — ou seja, cada produto tem no máximo uma
    linha em PRODUTOFOTO (uma foto). Tipos e chave foram conferidos
    diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS),
    sem ler nenhuma linha de dado de negócio.

    FOTO é um BLOB binário genuíno no GENUS (RDB$FIELD_TYPE 261, SUB_TYPE 0
    — blob binário, não texto), então aqui é modelado como `LargeBinary`
    (BYTEA no Postgres), e não como `Text` — diferente de
    `Empresa.foto_logo`, que reconhece um BLOB de mesmo tipo bruto no GENUS
    mas foi modelado como Text por precedente anterior; aqui optamos pelo
    tipo binário mais fiel à origem, como sugerido para esta tabela. Nenhum
    dado é lido/convertido agora — só a estrutura da coluna.

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRODUTOFOTO.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable),
    mas único (um produto tem no máximo uma foto), e o código bruto
    original (`cod_produto`) é preservado à parte, para não perder
    informação até que essa resolução aconteça.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_fotos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, unique=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRODUTOFOTO (PK = CODPRODUTO no GENUS) ───
    cod_produto = Column(String(15), nullable=True, unique=True, index=True)  # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id; também é a PK no GENUS)
    foto = Column(LargeBinary, nullable=True)                                # GENUS: FOTO (BLOB binário)

    produto = relationship("Produto", back_populates="foto")


class ProdutoRegra(Base):
    """Regra de negócio aplicada a um produto (vínculo produto <-> REGRAS).

    Reconhece a estrutura completa da tabela PRODUTOREGRAS do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO, `PrecoProduto`/GENUS.PRECO,
    `ProdutoProcesso`/GENUS.PRODUTOPROCESSO,
    `RegraProdutoCliente`/GENUS.REGRASPRODCLI e
    `ProdutoBarra`/GENUS.PRODUTOBARRA. No GENUS, PRODUTOREGRAS é uma tabela
    de junção pura entre PRODUTO e REGRAS: chave primária composta
    (CODPRODUTO + CODREGRAS), com uma FK própria para cada lado
    (FK_PRODUTOREGRAS_PRODUTO -> PRODUTO.CODIGO e
    FK_PRODUTOREGRAS_REGRAS -> REGRAS) — ou seja, associa um produto a uma
    ou mais regras de negócio cadastradas na tabela mestre REGRAS (regras
    fiscais/comerciais/de produção aplicáveis àquele produto). Tipos e
    chaves foram conferidos diretamente no schema Firebird do GENUS via
    metadados (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS /
    RDB$REF_CONSTRAINTS), sem ler nenhuma linha de dado de negócio.

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRODUTOREGRAS.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    CODREGRAS, apesar do nome parecido com `RegraProdutoCliente.cod_regras`,
    é um conceito diferente: em `RegraProdutoCliente`, CODREGRAS é a própria
    chave primária da regra comercial por cliente (REGRASPRODCLI); aqui,
    CODREGRAS é uma FK para a tabela mestre REGRAS (regras de negócio
    gerais do GENUS, ainda sem model dedicado neste ERP). Por isso é
    mantido como código bruto (`cod_regras`), sem FK própria — a entidade
    real, quando migrada de fato, vai exigir resolver essa referência
    contra REGRAS, quando essa tabela ganhar um model dedicado neste ERP.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_regras"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRODUTOREGRAS (PK composta no GENUS) ─────
    cod_produto = Column(String(15), nullable=True, index=True)   # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id; parte da PK composta no GENUS)
    cod_regras = Column(Integer, nullable=True, index=True)       # GENUS: CODREGRAS (FK bruta para REGRAS — tabela mestre ainda sem model dedicado; parte da PK composta no GENUS)

    produto = relationship("Produto", back_populates="regras")


class ProdutoReferencia(Base):
    """Referência de fabricante/fornecedor de um produto.

    Reconhece a estrutura completa da tabela PRODUTOREFERENCIA do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente
    estabelecido para `Produto`/GENUS.PRODUTO, `PrecoProduto`/GENUS.PRECO,
    `ProdutoProcesso`/GENUS.PRODUTOPROCESSO,
    `RegraProdutoCliente`/GENUS.REGRASPRODCLI e
    `ProdutoBarra`/GENUS.PRODUTOBARRA. No GENUS, PRODUTOREFERENCIA é uma
    tabela "filha" de PRODUTO: guarda, para cada combinação de produto +
    referência de fábrica + fornecedor (chave primária composta
    CODPRODUTO + REFFABRICA + CODFORNECEDOR), o código/referência com que
    aquele fornecedor específico identifica o produto — ou seja, um mesmo
    produto pode ter várias linhas em PRODUTOREFERENCIA (uma por
    fornecedor/referência de fábrica cadastrado). Tipos e chave foram
    conferidos diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS),
    sem ler nenhuma linha de dado de negócio.

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRODUTOREFERENCIA.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    CODFORNECEDOR, apesar do nome, NÃO referencia a chave própria da tabela
    GENUS.FORNECEDOR — a constraint FK_PRODREF_FORNECEDOR do GENUS aponta
    direto para a chave primária de CADASTRO (PK_CADASTRO), o mestre de
    pessoas/empresas do sistema legado (o mesmo mestre de onde
    `Fornecedor.cod_cadastro` já é reconhecido neste ERP — ver `Fornecedor`
    acima). Ou seja, CODFORNECEDOR aqui equivale a um CODCADASTRO. Por isso
    não criamos FK própria para `fornecedores.id`: a entidade real, quando
    migrada de fato, vai exigir resolver esse código bruto (`cod_fornecedor`)
    contra CADASTRO/`Fornecedor.cod_cadastro`, e não contra a PK serial deste
    ERP — exatamente como já ocorre em `RegraProdutoCliente.cod_cliente`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_referencias"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRODUTOREFERENCIA (PK composta no GENUS) ─
    cod_produto = Column(String(15), nullable=True, index=True)           # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id; parte da PK composta no GENUS)
    ref_fabrica = Column(String(20), nullable=True, index=True)           # GENUS: REFFABRICA (parte da PK composta no GENUS)
    cod_fornecedor = Column(Integer, nullable=True, index=True)           # GENUS: CODFORNECEDOR (código bruto — na verdade um CODCADASTRO; requer resolução futura contra CADASTRO/Fornecedor.cod_cadastro; parte da PK composta no GENUS)

    produto = relationship("Produto", back_populates="referencias_fornecedor")


class ProdutoProducao(Base):
    """Ordem/registro de produção de um produto (lote, quantidades, roteiro).

    Reconhece a estrutura completa da tabela PRODUTOPRODUCAO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente
    estabelecido para `Produto`/GENUS.PRODUTO, `PrecoProduto`/GENUS.PRECO,
    `ProdutoProcesso`/GENUS.PRODUTOPROCESSO,
    `RegraProdutoCliente`/GENUS.REGRASPRODCLI e
    `ProdutoBarra`/GENUS.PRODUTOBARRA. No GENUS, PRODUTOPRODUCAO é uma
    tabela "filha" de PRODUTO: guarda, para cada lote/ordem de produção
    (CODIGO + LOTE) gerado a partir de um produto (CODPRODUTO), as datas de
    produção/previsão/fechamento, quantidades físicas e produzidas, medidas
    (espessura/largura/comprimento) e variações apuradas, além de campos
    específicos do processo produtivo da Zanguettin (SANFONA, EXTRUSAO,
    APARAS, CORSELECIONADA, PIGMENTO etc.) — ou seja, um mesmo produto pode
    ter várias linhas em PRODUTOPRODUCAO (uma por lote/ordem de produção).

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRODUTOPRODUCAO.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    Os demais códigos (CODEMPRESA, CODFUNCIONARIO, CODSOLICITANTE,
    CODPEDIDOLAN, CODPRODUCAOETAPAS, CODFUNCIONARIOAUDITA,
    CODFUNCIONARIOFECHA) também são mantidos como códigos brutos
    (`cod_*`), sem FK própria — assim como já ocorre em outras tabelas do
    GENUS já reconhecidas neste ERP (ex.: `ContaPagar.cod_fornecedor`,
    `ContaReceber.cod_representante`) — pois as tabelas correspondentes
    (EMPRESA já tem model `Empresa`, mas FUNCIONARIO/SOLICITANTE/PEDIDOLAN/
    PRODUCAOETAPAS ainda não têm resolução própria aqui) — a entidade real,
    quando migrada de fato, vai exigir resolver essas referências contra as
    tabelas correspondentes.

    CODIGO é o identificador (chave primária) original do registro de
    produção dentro do GENUS — preservado como código bruto (`codigo`), sem
    reaproveitar como PK deste ERP, seguindo o mesmo padrão usado em outras
    tabelas do GENUS (ex.: `ContaPagar.codigo` <- GENUS.PAGAR.CODIGO).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_producoes"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRODUTOPRODUCAO ──────────────────────────
    # Identificação / chave original do registro no GENUS
    cod_empresa = Column(Integer, nullable=True)                              # GENUS: CODEMPRESA
    codigo = Column(Integer, nullable=True, index=True)                       # GENUS: CODIGO (identificador original do registro no GENUS)
    lote = Column(String(10), nullable=True, index=True)                      # GENUS: LOTE
    cod_produto = Column(String(15), nullable=True, index=True)               # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)

    # Datas / prazos
    data_producao = Column(DateTime, nullable=True)                          # GENUS: DATAPRODUCAO
    data_previsao = Column(DateTime, nullable=True)                          # GENUS: DATAPREVISAO
    hora_previsao = Column(String(10), nullable=True)                        # GENUS: HORAPREVISAO
    fechado = Column(DateTime, nullable=True)                                # GENUS: FECHADO
    auditado = Column(DateTime, nullable=True)                               # GENUS: AUDITADO
    data_entrega = Column(DateTime, nullable=True)                          # GENUS: DATAENTREGA

    # Responsáveis / referências (códigos brutos, sem FK própria)
    cod_funcionario = Column(Integer, nullable=True)                         # GENUS: CODFUNCIONARIO
    cod_solicitante = Column(Integer, nullable=True)                        # GENUS: CODSOLICITANTE
    cod_pedido_lan = Column(Integer, nullable=True)                         # GENUS: CODPEDIDOLAN
    cod_producao_etapas = Column(Integer, nullable=True)                    # GENUS: CODPRODUCAOETAPAS
    cod_funcionario_audita = Column(Integer, nullable=True)                 # GENUS: CODFUNCIONARIOAUDITA
    cod_funcionario_fecha = Column(Integer, nullable=True)                  # GENUS: CODFUNCIONARIOFECHA

    # Observações
    observacao = Column(Text, nullable=True)                                # GENUS: OBS
    observacao_detalhe = Column(Text, nullable=True)                        # GENUS: OBS_DET

    # Situação / flags (S/N ou código de 1 caractere)
    imprimiu_etiqueta = Column(String(1), nullable=True)                    # GENUS: IMPRIMIUETQ
    estoque_reservado = Column(String(1), nullable=True)                    # GENUS: ESTOQUERESERVADO
    processos_finalizados = Column(String(1), nullable=True)                # GENUS: PROCESSOSFINALIZADOS
    tipo_calculo = Column(String(1), nullable=True)                         # GENUS: TIPOCALCULO
    considerar_tarugo_extrusao = Column(String(1), nullable=True)           # GENUS: CONSIDERARTARUGOEXTRUSAO

    # Quantidades
    qtde_fisico = Column(Float, nullable=True)                              # GENUS: QTDEFISICO
    qtde_fisico_pedido = Column(Float, nullable=True)                       # GENUS: QTDEFISICOPEDIDO
    qtde = Column(Float, nullable=True)                                     # GENUS: QTDE
    qtde_produzida = Column(Float, nullable=True)                           # GENUS: QTDEPRODUZIDA
    total_produzido_real = Column(Float, nullable=True)                     # GENUS: TOTALPRODUZIDOREAL
    porcentagem = Column(Float, nullable=True)                              # GENUS: PORPCT
    aparas = Column(Float, nullable=True)                                   # GENUS: APARAS
    estoque = Column(Float, nullable=True)                                  # GENUS: ESTOQUE

    # Medidas / especificações do lote produzido
    sanfona = Column(String(100), nullable=True)                           # GENUS: SANFONA
    extrusao = Column(String(100), nullable=True)                          # GENUS: EXTRUSAO
    espessura = Column(Float, nullable=True)                               # GENUS: ESPESSURA
    largura = Column(Float, nullable=True)                                 # GENUS: LARGURA
    comprimento = Column(Float, nullable=True)                             # GENUS: COMPRIMENTO
    linear = Column(Float, nullable=True)                                  # GENUS: LINEAR
    unidade_medida = Column(String(5), nullable=True)                      # GENUS: UNIDADEMEDIDA
    cor_selecionada = Column(String(25), nullable=True)                    # GENUS: CORSELECIONADA
    pigmento = Column(String(60), nullable=True)                           # GENUS: PIGMENTO

    # Variações apuradas (real x especificado)
    variacao_espessura = Column(Float, nullable=True)                      # GENUS: VARIACAOESPESSURA
    variacao_largura = Column(Float, nullable=True)                        # GENUS: VARIACAOLARGURA
    variacao_comprimento = Column(Float, nullable=True)                    # GENUS: VARIACAOCOMPRIMENTO

    produto = relationship("Produto", back_populates="producoes")


class MovtoProduto(Base):
    """Movimento de produto (entrada ou saída), com valor e comissão.

    Reconhece a estrutura completa da tabela MOVTOPRODUTO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO, `PrecoProduto`/GENUS.PRECO,
    `ProdutoProcesso`/GENUS.PRODUTOPROCESSO,
    `RegraProdutoCliente`/GENUS.REGRASPRODCLI, `ProdutoBarra`/
    GENUS.PRODUTOBARRA e `ProdutoProducao`/GENUS.PRODUTOPRODUCAO. No GENUS,
    MOVTOPRODUTO é a tabela de lançamento de movimento de produto
    propriamente dita: cada linha registra uma entrada ou saída (ENTSAI) de
    um produto (CODPRODUTO) numa empresa (CODEMPRESA), com quantidade, valor
    unitário, total e o cálculo de comissão correspondente
    (PERCOMISSAO/CALCOMISSAO/VALCOMISSAO) — além de, quando o movimento se
    origina de uma ordem de produção, o vínculo com o lote de produção de
    origem (CODEMPRESAPRODUCAO/CODIGOPRODUCAO/LOTEPRODUCAO/
    CODPRODUTOPRINCIPALPRODUCAO). Um mesmo produto tem, portanto, muitas
    linhas em MOVTOPRODUTO (um por movimento lançado) — daí o vínculo via
    FK, e não campos únicos do cadastro de produto.

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.MOVTOPRODUTO.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    CODMOVTO é o identificador (chave primária) original do movimento dentro
    do GENUS — preservado como código bruto (`cod_movto`), sem reaproveitar
    como PK deste ERP, seguindo o mesmo padrão usado em outras tabelas do
    GENUS (ex.: `ProdutoProducao.codigo` <- GENUS.PRODUTOPRODUCAO.CODIGO).

    CODEMPRESA, CODEMPRESAPRODUCAO e CODIGOPRODUCAO também são mantidos como
    códigos brutos (`cod_empresa`, `cod_empresa_producao`,
    `codigo_producao`), sem FK própria — CODEMPRESA pelo mesmo motivo já
    registrado em `PrecoProduto.cod_empresa`/`ProdutoProducao.cod_empresa`
    (a tabela `Empresa` ainda não guarda o código bruto GENUS.EMPRESA.CODIGO
    de forma resolvível a partir daqui), e CODEMPRESAPRODUCAO/CODIGOPRODUCAO
    porque, embora `ProdutoProducao` já reconheça a estrutura de
    PRODUTOPRODUCAO neste ERP, a chave composta de origem
    (CODEMPRESAPRODUCAO + CODIGOPRODUCAO + LOTEPRODUCAO) não corresponde
    diretamente a `ProdutoProducao.id` (serial deste ERP) — essa resolução
    também fica para o agente de migração de dados.

    Nota importante sobre LOTEPRODUTO x LOTEPRODUCAO: são dois campos
    distintos no GENUS — LOTEPRODUTO identifica o lote do próprio produto
    movimentado (`lote_produto`), enquanto LOTEPRODUCAO identifica o lote da
    ordem de produção de origem do movimento (`lote_producao`), quando
    aplicável — ambos preservados separadamente, sem misturar.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "movto_produtos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.MOVTOPRODUTO ─────────────────────────────
    cod_movto = Column(Integer, nullable=True, index=True)                  # GENUS: CODMOVTO (identificador original do movimento no GENUS)
    cod_empresa = Column(Integer, nullable=True, index=True)                # GENUS: CODEMPRESA
    cod_produto = Column(String(15), nullable=True, index=True)             # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    ent_sai = Column(String(1), nullable=True)                              # GENUS: ENTSAI ('E' entrada / 'S' saída)
    qtde = Column(Float, nullable=True)                                     # GENUS: QTDE
    valor = Column(Float, nullable=True)                                    # GENUS: VALOR
    total = Column(Float, nullable=True)                                    # GENUS: TOTAL
    perc_comissao = Column(Float, nullable=True)                            # GENUS: PERCOMISSAO
    cal_comissao = Column(Float, nullable=True)                             # GENUS: CALCOMISSAO
    val_comissao = Column(Float, nullable=True)                             # GENUS: VALCOMISSAO
    lote_produto = Column(String(15), nullable=True, index=True)            # GENUS: LOTEPRODUTO

    # Vínculo com a ordem de produção de origem (quando o movimento vem de uma produção)
    cod_empresa_producao = Column(Integer, nullable=True)                   # GENUS: CODEMPRESAPRODUCAO
    codigo_producao = Column(Integer, nullable=True, index=True)            # GENUS: CODIGOPRODUCAO
    lote_producao = Column(String(10), nullable=True, index=True)           # GENUS: LOTEPRODUCAO
    cod_produto_principal_producao = Column(String(15), nullable=True)      # GENUS: CODPRODUTOPRINCIPALPRODUCAO

    produto = relationship("Produto", back_populates="movimentos")


class ProdutoExcluido(Base):
    """Registro de produto excluído (histórico/snapshot no momento da exclusão).

    Reconhece a estrutura completa da tabela DEL_PRODUTO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO e demais tabelas "filhas" já reconhecidas
    neste ERP (`PrecoProduto`, `ProdutoProcesso`, `RegraProdutoCliente`,
    `ProdutoBarra`, `ProdutoProducao`, `ProdutoReferencia`, `ProdutoRegra`,
    `ProdutoFoto`, `MovtoProduto`). Tipos e chave foram conferidos
    diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS),
    sem ler nenhuma linha de dado de negócio.

    Diferente das demais tabelas "filhas" de PRODUTO já reconhecidas neste
    ERP, DEL_PRODUTO **não tem nenhuma foreign key** no GENUS (confirmado
    via RDB$REF_CONSTRAINTS: a única constraint da tabela é a própria PK,
    PK_DEL_PRODUTO, sobre CODIGO, além das NOT NULL originais) — ou seja,
    ela não é uma tabela filha "viva" de PRODUTO no sentido relacional; é
    antes um "lixo"/histórico que guarda uma cópia de boa parte dos
    atributos de PRODUTO (mesmos nomes de coluna: CODIGO, DESCRI, UNIDADE,
    CODGRUPO, CODSUBGRUPO, CODMARCA, SITUACAO etc.) no momento em que o
    produto foi excluído de PRODUTO no GENUS — permitindo recuperar/auditar
    um produto apagado. CODIGO é a própria chave primária dentro do GENUS
    (PK_DEL_PRODUTO), do mesmo jeito que é a chave natural de
    PRODUTO.CODIGO (= `Produto.codigo` neste ERP).

    Por isso este model reconhece um vínculo opcional (`produto_id`) com o
    cadastro de produto já migrado (`Produto`, 5.629 produtos reais),
    resolvendo GENUS.DEL_PRODUTO.CODIGO contra GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Como CODIGO é único (é a PK no GENUS), o
    vínculo é modelado como 1:1, no mesmo padrão usado em `ProdutoFoto`
    (`produto_id` nullable, mas único). O código bruto original
    (`cod_produto`) é preservado à parte, para não perder informação até
    que essa resolução aconteça — e também porque um produto excluído no
    GENUS pode não ter (mais) uma linha correspondente em `Produto` neste
    ERP (ou pode ter sido recadastrado depois com o mesmo código).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produtos_excluidos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado (1:1, ver docstring) ─
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, unique=True, index=True)  # resolvido de GENUS: CODIGO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.DEL_PRODUTO (CODIGO é a PK no GENUS) ─────
    cod_produto = Column(String(15), nullable=True, unique=True, index=True)  # GENUS: CODIGO (código bruto, antes da resolução de produto_id; também é a PK no GENUS)
    descricao = Column(String(120), nullable=True)                           # GENUS: DESCRI
    unidade = Column(String(6), nullable=True)                               # GENUS: UNIDADE
    cod_grupo = Column(Integer, nullable=True)                               # GENUS: CODGRUPO
    cod_subgrupo = Column(Integer, nullable=True)                            # GENUS: CODSUBGRUPO
    cod_marca = Column(Integer, nullable=True)                               # GENUS: CODMARCA
    situacao = Column(String(1), nullable=True)                              # GENUS: SITUACAO
    ecf_descricao = Column(String(29), nullable=True)                        # GENUS: ECFDESCRI
    qtde_embalagem = Column(Float, nullable=True)                            # GENUS: QTDEEMBAL
    ncm = Column(String(10), nullable=True)                                  # GENUS: CLASSFISCAL
    cst = Column(String(3), nullable=True)                                   # GENUS: ST
    cod_classificacao = Column(Integer, nullable=True)                       # GENUS: CODCLASSIFICACAO
    margem_lucro = Column(Float, nullable=True)                              # GENUS: MARGEMLUCRO
    marcador = Column(String(10), nullable=True)                             # GENUS: MARCADOR
    csosn = Column(String(4), nullable=True)                                 # GENUS: CSOSN
    peso_liquido = Column(Float, nullable=True)                              # GENUS: PESOLIQUIDO
    peso_bruto = Column(Float, nullable=True)                                # GENUS: PESOBRUTO
    codigo_interno = Column(String(30), nullable=True)                       # GENUS: CODINTERNO
    tipo_produto = Column(String(1), nullable=True)                          # GENUS: TIPOPRODUTO
    validade_dias = Column(Integer, nullable=True)                           # GENUS: VALIDADE
    cubicagem = Column(Float, nullable=True)                                 # GENUS: CUBICAGEM
    observacao = Column(Text, nullable=True)                                 # GENUS: OBS
    descricao_interna = Column(String(50), nullable=True)                    # GENUS: DESCRIINTERNA
    referencia = Column(String(20), nullable=True)                           # GENUS: REFERENCIA
    multiplo_producao = Column(Integer, nullable=True)                       # GENUS: MULTIPLOPRODUCAO
    descricao_detalhada = Column(Text, nullable=True)                        # GENUS: DESCRIDETALHADA
    cod_cor = Column(Integer, nullable=True)                                 # GENUS: CODCOR
    cod_tamanho = Column(String(5), nullable=True)                           # GENUS: CODTAMANHO
    cod_alteracao = Column(Integer, nullable=True)                           # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)                  # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                   # GENUS: DATAALTERACAO
    cod_funcionario_inclusao = Column(Integer, nullable=True)                # GENUS: CODFUNCIONARIOINSERE
    cod_funcionario_alteracao = Column(Integer, nullable=True)               # GENUS: CODFUNCIONARIOALTERA

    produto = relationship("Produto", back_populates="produto_excluido")


class ProdutoComposicao(Base):
    """Composição/estrutura (BOM — bill of materials) de um produto.

    Reconhece a estrutura completa da tabela PRODUTOCOMPOSICAO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente
    estabelecido para `Produto`/GENUS.PRODUTO e demais tabelas "filhas" já
    reconhecidas neste ERP (`PrecoProduto`, `ProdutoProcesso`,
    `RegraProdutoCliente`, `ProdutoBarra`, `ProdutoProducao`,
    `ProdutoReferencia`, `ProdutoRegra`, `ProdutoFoto`, `MovtoProduto`,
    `ProdutoExcluido`). Tipos e chaves foram conferidos diretamente no schema
    Firebird do GENUS via metadados (RDB$RELATION_FIELDS /
    RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS), sem ler nenhuma linha de
    dado de negócio:
    - CODPRODUTO: VARCHAR(15), NOT NULL (RDB$FIELD_TYPE 37)
    - CODMATERIA: VARCHAR(15), NOT NULL (RDB$FIELD_TYPE 37)
    - PERDA: NUMERIC(9,5) (RDB$FIELD_TYPE 8 / sub_type 1) -> Float
    - QTDEEQUIVALENTE: NUMERIC(15,6) (RDB$FIELD_TYPE 16 / sub_type 1) -> Float
    - QTDE: NUMERIC(15,6) (RDB$FIELD_TYPE 16 / sub_type 1), NOT NULL -> Float
    - SEQUENCIA: INTEGER (RDB$FIELD_TYPE 8 / sub_type 0)
    - ID: INTEGER, NOT NULL (RDB$FIELD_TYPE 8 / sub_type 0)
    - CODPROCESSO: INTEGER (RDB$FIELD_TYPE 8 / sub_type 0)

    Diferente das demais tabelas "filhas" de PRODUTO já reconhecidas neste
    ERP, PRODUTOCOMPOSICAO tem **duas** foreign keys, ambas apontando para a
    mesma tabela mestre PRODUTO (confirmado via RDB$REF_CONSTRAINTS: as
    constraints PRODUTOCOMPOSICAO_PRODUTO e PRODUTOCOMPOSICAO_MATERIA
    referenciam a mesma PK_PRODUTO):
    - CODPRODUTO -> PRODUTO.CODIGO: o produto "pai"/acabado que é composto
      por outros itens (a receita/estrutura pertence a ele).
    - CODMATERIA -> PRODUTO.CODIGO: o produto "componente"/matéria-prima
      utilizado na composição daquele produto pai (também é um cadastro de
      PRODUTO no GENUS — não existe uma tabela "matéria-prima" separada).
    A chave primária no GENUS é composta (PK_PRODUTOCOMPOSICAO = CODMATERIA +
    CODPRODUTO + ID) — ou seja, para o mesmo par produto/matéria-prima pode
    haver mais de uma linha (ID distingue), por exemplo quando o mesmo
    componente entra em mais de uma etapa/processo da composição.

    Por isso este model reconhece **dois** vínculos opcionais com o cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais): `produto_id`
    (resolvido de CODPRODUTO) e `produto_materia_id` (resolvido de
    CODMATERIA). Ambas as resoluções de fato — relacionando os códigos
    brutos GENUS contra GENUS.PRODUTO.CODIGO (= `Produto.codigo` neste ERP)
    — são tarefa do agente de migração de dados, não deste agente de
    estrutura. Por isso os dois FKs são opcionais (nullable), e os códigos
    brutos originais (`cod_produto`, `cod_materia`) são preservados à parte,
    para não perder informação até que essa resolução aconteça. Como as duas
    FKs apontam para a mesma tabela (`produtos`), os `relationship()`
    correspondentes (em `ProdutoComposicao` e em `Produto`) precisam
    declarar `foreign_keys=` explicitamente para desambiguar.

    CODPROCESSO também é mantido como código bruto (`cod_processo`), sem FK
    própria — assim como já ocorre em `ProdutoProcesso.cod_processo` — pois a
    resolução de fato (CODPROCESSO -> PROCESSO.CODIGO) contra o model
    dedicado `Processo` (ver classe mais abaixo neste arquivo) é tarefa do
    agente de migração de dados, não deste agente de estrutura.

    ID é o identificador (parte da chave primária composta) original do
    registro dentro do GENUS — preservado como código bruto (`cod_id_genus`),
    sem reaproveitar como PK deste ERP, seguindo o mesmo padrão usado em
    outras tabelas do GENUS (ex.: `ProdutoProducao.codigo` <-
    GENUS.PRODUTOPRODUCAO.CODIGO).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_composicoes"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado (ver docstring — duas FKs para a mesma tabela) ─
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)          # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO (produto "pai"/acabado)
    produto_materia_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODMATERIA -> PRODUTO.CODIGO (produto "componente"/matéria-prima)

    # ── Campos migrados de GENUS.PRODUTOCOMPOSICAO (PK composta no GENUS: CODMATERIA + CODPRODUTO + ID) ─
    cod_produto = Column(String(15), nullable=True, index=True)   # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id; parte da PK composta no GENUS)
    cod_materia = Column(String(15), nullable=True, index=True)   # GENUS: CODMATERIA (código bruto, antes da resolução de produto_materia_id; parte da PK composta no GENUS)
    cod_id_genus = Column(Integer, nullable=True, index=True)     # GENUS: ID (identificador original do registro no GENUS; parte da PK composta)
    cod_processo = Column(Integer, nullable=True, index=True)     # GENUS: CODPROCESSO (FK bruta para PROCESSO -> Processo.codigo, ver docstring)
    sequencia = Column(Integer, nullable=True)                    # GENUS: SEQUENCIA
    qtde = Column(Float, nullable=True)                           # GENUS: QTDE
    qtde_equivalente = Column(Float, nullable=True)                # GENUS: QTDEEQUIVALENTE
    perda = Column(Float, nullable=True)                          # GENUS: PERDA

    produto = relationship("Produto", foreign_keys=[produto_id], back_populates="composicoes")
    materia_prima = relationship("Produto", foreign_keys=[produto_materia_id], back_populates="composicoes_como_materia")


class ProdutoConversaoFornecedor(Base):
    """Fator de conversão de unidade de compra por fornecedor de um produto.

    Reconhece a estrutura completa da tabela PRODUTOCONVERSAOFORNECEDOR do
    sistema legado GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente
    estabelecido para `Produto`/GENUS.PRODUTO e demais tabelas "filhas" já
    reconhecidas neste ERP (`PrecoProduto`, `ProdutoProcesso`,
    `RegraProdutoCliente`, `ProdutoBarra`, `ProdutoProducao`,
    `ProdutoReferencia`, `ProdutoRegra`, `ProdutoFoto`, `MovtoProduto`,
    `ProdutoExcluido`, `ProdutoComposicao`). Tipos e chaves foram conferidos
    diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS),
    sem ler nenhuma linha de dado de negócio:
    - CODPRODUTO: VARCHAR(15), NOT NULL (RDB$FIELD_TYPE 37)
    - CODFORNECEDOR: INTEGER, NOT NULL (RDB$FIELD_TYPE 8 / sub_type 0)
    - FATORCONVERSAO: NUMERIC(15,3) (RDB$FIELD_TYPE 16 / sub_type 1) -> Float
    - TIPOCONVERSAO: CHAR(1) (RDB$FIELD_TYPE 14)

    No GENUS, PRODUTOCONVERSAOFORNECEDOR é uma tabela "filha" de PRODUTO:
    guarda, para cada combinação de produto + fornecedor (chave primária
    composta PK_PRODUTOCONVERSAOFORNECEDOR = CODPRODUTO + CODFORNECEDOR), o
    fator/tipo de conversão entre a unidade de compra daquele fornecedor
    específico e a unidade padrão do produto — ou seja, um mesmo produto pode
    ter várias linhas em PRODUTOCONVERSAOFORNECEDOR (uma por fornecedor com
    fator de conversão próprio). Isso é diferente dos campos
    `Produto.fator_conversao`/`Produto.tipo_conversao` (migrados de
    GENUS.PRODUTO diretamente), que guardam um único fator "padrão" do
    produto — esta tabela guarda um fator *por fornecedor*.

    Por isso este model não é uma entidade solta: ele é ligado ao cadastro
    de produto já migrado (`Produto`, 5.629 produtos reais) através da FK
    `produto_id`. Essa FK só pode ser resolvida de fato relacionando
    GENUS.PRODUTOCONVERSAOFORNECEDOR.CODPRODUTO com GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça.

    CODFORNECEDOR, apesar do nome, também NÃO referencia a PK serial deste
    ERP (`fornecedores.id`): a constraint FK do GENUS
    (PRODUTOCONVERSAO_FORNECEDOR) aponta para a PK própria de
    GENUS.FORNECEDOR (PK_FORNECEDOR) — e, conferido via metadados, essa PK
    é, na verdade, a coluna CODCADASTRO (FORNECEDOR não tem identidade
    própria: ele é uma extensão 1:1 de CADASTRO, o mestre de pessoas do
    GENUS — ver `Fornecedor.cod_cadastro` acima). Ou seja, CODFORNECEDOR
    aqui equivale a um CODCADASTRO, exatamente como já ocorre em
    `ProdutoReferencia.cod_fornecedor`. Por isso não criamos FK própria para
    `fornecedores.id` aqui: a entidade real, quando migrada de fato, vai
    exigir resolver esse código bruto (`cod_fornecedor`) contra
    CADASTRO/`Fornecedor.cod_cadastro`, e não contra a PK serial deste ERP —
    seguindo o mesmo precedente já usado em `ProdutoReferencia.cod_fornecedor`
    e `RegraProdutoCliente.cod_cliente`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "produto_conversoes_fornecedor"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Campos migrados de GENUS.PRODUTOCONVERSAOFORNECEDOR (PK composta no GENUS: CODPRODUTO + CODFORNECEDOR) ─
    cod_produto = Column(String(15), nullable=True, index=True)      # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id; parte da PK composta no GENUS)
    cod_fornecedor = Column(Integer, nullable=True, index=True)      # GENUS: CODFORNECEDOR (código bruto — na verdade um CODCADASTRO; requer resolução futura contra CADASTRO/Fornecedor.cod_cadastro; parte da PK composta no GENUS)
    fator_conversao = Column(Float, nullable=True)                   # GENUS: FATORCONVERSAO
    tipo_conversao = Column(String(1), nullable=True)                # GENUS: TIPOCONVERSAO

    produto = relationship("Produto", back_populates="conversoes_fornecedor")


class RegraEstado(Base):
    """Regra fiscal (ICMS/ICMS-ST/IPI/PIS/COFINS/FCP) por estado + CFOP.

    Reconhece a estrutura completa da tabela REGRASESTADO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO, `ProdutoRegra`/GENUS.PRODUTOREGRAS e
    `RegraProdutoCliente`/GENUS.REGRASPRODCLI. Tipos e chaves foram
    conferidos diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS),
    sem ler nenhuma linha de dado de negócio.

    Diferente das tabelas "filhas" de PRODUTO já reconhecidas neste ERP
    (PrecoProduto, ProdutoProcesso, RegraProdutoCliente, ProdutoBarra,
    ProdutoFoto, ProdutoRegra, ProdutoReferencia, ProdutoProducao),
    REGRASESTADO não tem nenhuma coluna CODPRODUTO — ela não é filha de
    PRODUTO, e sim uma tabela de detalhamento fiscal por estado da tabela
    mestre REGRAS (a mesma tabela para a qual `ProdutoRegra.cod_regras`
    aponta): cada regra de negócio (CODREGRAS) pode ter, para cada estado
    (CODESTADO) e CFOP (CODCFOP), sua própria combinação de CST/CSOSN,
    alíquotas de ICMS/ICMS-ST/IPI/PIS/COFINS/FCP, reduções de base de
    cálculo e enquadramento. Por isso este model não ganha `produto_id`
    (não faria sentido: a ligação real é REGRAS -> PRODUTOREGRAS ->
    PRODUTO, não REGRASESTADO -> PRODUTO diretamente).

    No GENUS a chave primária é composta (PK_REGRASESTADO = CODESTADO +
    CODREGRAS), e há 5 foreign keys, nenhuma delas ainda resolvível contra
    um model dedicado deste ERP:
    - FK_REGRASESTADO_REGRAS  (CODREGRAS  -> REGRAS.CODIGO)     — tabela mestre de regras, sem model próprio ainda (mesma situação de `ProdutoRegra.cod_regras`).
    - FK_REGRASESTADO_ESTADO  (CODESTADO  -> ESTADO)            — tabela de estados/UF, sem model próprio ainda.
    - FK_REGRASESTADO_CFOP    (CODCFOP    -> CFOP)              — tabela de CFOP, sem model próprio ainda.
    - FK_REGRASESTADO_DECRETO (CODDECRETO -> DECRETO)           — tabela de decretos (benefício fiscal), sem model próprio ainda.
    - FK_REGRASESTADO_CBNEF   (CODCBENEF  -> CADASTROCBENEF)    — tabela de códigos de benefício fiscal, sem model próprio ainda.

    Por isso todos os códigos (`cod_regras`, `cod_estado`, `cod_cfop`,
    `cod_decreto`, `cod_cbenef`) são mantidos como códigos brutos, sem FK
    própria — assim como já ocorre em outras tabelas do GENUS já
    reconhecidas neste ERP (ex.: `ProdutoRegra.cod_regras`) — a entidade
    real, quando migrada de fato, vai exigir resolver essas referências
    contra REGRAS/ESTADO/CFOP/DECRETO/CADASTROCBENEF, quando essas tabelas
    ganharem model dedicado neste ERP.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "regras_estado"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.REGRASESTADO (PK composta no GENUS: CODESTADO + CODREGRAS) ─
    cod_regras = Column(Integer, nullable=True, index=True)          # GENUS: CODREGRAS (FK bruta para REGRAS — tabela mestre ainda sem model dedicado; parte da PK composta no GENUS)
    cod_estado = Column(String(2), nullable=True, index=True)        # GENUS: CODESTADO (FK bruta para ESTADO — tabela ainda sem model dedicado; parte da PK composta no GENUS)
    cst = Column(String(3), nullable=True)                           # GENUS: CST
    cod_cfop = Column(String(5), nullable=True, index=True)          # GENUS: CODCFOP (FK bruta para CFOP — tabela ainda sem model dedicado)
    aliquota_icms = Column(String(5), nullable=True)                 # GENUS: ALIQICMS
    icms_st = Column(Float, nullable=True)                           # GENUS: ICMSST
    reducao_icms = Column(Float, nullable=True)                      # GENUS: REDUCAO_ICMS
    reducao_icms_st = Column(Float, nullable=True)                   # GENUS: REDUCAO_ICMSST
    ipi_cst = Column(String(3), nullable=True)                       # GENUS: IPICST
    ipi = Column(Float, nullable=True)                               # GENUS: IPI
    pis_cst = Column(String(3), nullable=True)                       # GENUS: PISCST
    pis_aliquota = Column(Float, nullable=True)                      # GENUS: PISALIQUOTA
    cofins_cst = Column(String(3), nullable=True)                    # GENUS: COFINSCST
    cofins_aliquota = Column(Float, nullable=True)                   # GENUS: COFINSALIQUOTA
    cod_decreto = Column(Integer, nullable=True, index=True)         # GENUS: CODDECRETO (FK bruta para DECRETO — tabela ainda sem model dedicado)
    desconto_iva = Column(Float, nullable=True)                      # GENUS: DESCONTOIVA
    csosn = Column(String(4), nullable=True)                         # GENUS: CSOSN
    cenq = Column(String(3), nullable=True)                          # GENUS: CENQ
    fcp = Column(Float, nullable=True)                                # GENUS: FCP
    cod_cbenef = Column(Integer, nullable=True, index=True)          # GENUS: CODCBENEF (FK bruta para CADASTROCBENEF — tabela ainda sem model dedicado)


class Regra(Base):
    """Regra de negócio (fiscal/comercial/de produção) — tabela mestre REGRAS.

    Reconhece a estrutura completa da tabela REGRAS do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `TabelaPreco`/GENUS.TABELAPRECO, `GrupoProduto`/GENUS.GRUPO e
    `FormaPagamento`/GENUS.CONDPAGTO. Nomes e tipos foram conferidos contra
    o schema Firebird do GENUS, sem ler nenhuma linha de dado de negócio.

    Esta é a tabela MESTRE que outras tabelas GENUS já reconhecidas neste
    ERP referenciam através de um código bruto (`cod_regras`) ainda não
    resolvido:
    - `ProdutoRegra.cod_regras` (GENUS.PRODUTOREGRAS.CODREGRAS — vínculo
      produto <-> regra)
    - `RegraProdutoCliente.cod_regras` (GENUS.REGRASPRODCLI.CODREGRAS —
      identificador original da regra comercial por cliente; conceito
      diferente do CODREGRAS desta tabela, ver docstring de
      `RegraProdutoCliente`)
    - `RegraEstado.cod_regras` (GENUS.REGRASESTADO.CODREGRAS — detalhamento
      fiscal por estado/CFOP de uma regra desta tabela)
    - qualquer outro model deste ERP com um campo `cod_regras`

    Propositalmente nenhuma dessas colunas ganha uma FK própria aqui — a
    resolução (CODREGRAS -> REGRAS.CODIGO) é tarefa do agente de migração de
    dados, não deste agente de estrutura. Este model, em si, não é filha de
    `Produto` (não tem CODPRODUTO) — é uma tabela auxiliar mestre solta, por
    isso ganha entrada própria em `TabelasAuxiliaresWindow` no frontend, no
    mesmo padrão de `GrupoProduto`/`FormaPagamento`/`RegraEstado`/
    `TabelaPreco`.

    CODEMPRESA é mantido como código bruto (`cod_empresa`), sem FK própria —
    assim como já ocorre em outras tabelas do GENUS já reconhecidas neste
    ERP (ex.: `TabelaPreco.cod_empresa`, `PrecoProduto.cod_empresa`) — pois
    a tabela `Empresa` deste ERP ainda não guarda o código bruto
    GENUS.EMPRESA.CODIGO de forma resolvível a partir daqui.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "regras"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.REGRAS ───────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)               # GENUS: CODIGO (identificador original da regra no GENUS — ver `cod_regras` nas tabelas filhas acima)
    descricao = Column(String(40), nullable=True)                     # GENUS: DESCRICAO
    tipo_nf = Column(String(1), nullable=True)                        # GENUS: TIPONF
    tipo_cliente = Column(String(1), nullable=True)                   # GENUS: TIPOCLIENTE
    cod_empresa = Column(Integer, nullable=True, index=True)          # GENUS: CODEMPRESA (código bruto — sem FK própria, ver docstring)
    pessoa = Column(String(1), nullable=True)                         # GENUS: PESSOA ('F' física / 'J' jurídica, conforme convenção GENUS)
    tipo_apuracao = Column(String(1), nullable=True)                  # GENUS: TIPOAPURACAO
    nao_contribuinte = Column(String(1), nullable=True)               # GENUS: NAOCONTRIBUINTE ('S'/'N')


class Pedido(Base):
    __tablename__ = "pedidos"
    id = Column(Integer, primary_key=True, index=True)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    total = Column(Float)

    # Relacionamentos (Estilo OneToMany do Java)
    cliente = relationship("Cliente")
    itens = relationship("ItemPedido", back_populates="pedido")

class ItemPedido(Base):
    __tablename__ = "itens_pedido"
    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    produto_id = Column(Integer, ForeignKey("produtos.id"))
    quantidade = Column(Integer)
    preco_unitario = Column(Float)

    pedido = relationship("Pedido", back_populates="itens")
class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False) # Em produção, o ideal é usar hash
    permissao = Column(String(50), default="user") # Ex: admin, user, gerente

class Empresa(Base):
    """Empresa (matriz/filial) do ERP.

    Além do campo original (`nome`), esta tabela reconhece todos os campos
    da tabela EMPRESA do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), para
    permitir importar o cadastro de empresas sem perda de informação. Nomes
    e tipos foram conferidos a partir do schema Firebird do GENUS, seguindo
    o mesmo precedente estabelecido para `Produto`/GENUS.PRODUTO.

    Diferente de CentroCusto/ClienteCompleto/Fornecedor/Transportadora/
    Representante/Funcionario, a tabela GENUS.EMPRESA não tem uma coluna
    CODCADASTRO — é uma entidade autossuficiente (não exige JOIN com
    CADASTRO para ficar completa).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "empresas"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)

    contas_bancarias = relationship("ContaBancaria", back_populates="empresa")
    contas_pagar = relationship("ContaPagar", back_populates="empresa")
    contas_receber = relationship("ContaReceber", back_populates="empresa")

    # ── Campos migrados de GENUS.EMPRESA ──────────────────────────────────
    # Identificação
    codigo = Column(Integer, nullable=True, unique=True, index=True)         # GENUS: CODIGO
    razao = Column(String(60), nullable=True)                               # GENUS: RAZAO
    fantasia = Column(String(60), nullable=True)                            # GENUS: FANTASIA
    cod_cidade = Column(Integer, nullable=True)                             # GENUS: CODCIDADE
    endereco = Column(String(30), nullable=True)                            # GENUS: ENDERECO
    numero = Column(String(10), nullable=True)                              # GENUS: NUMERO
    bairro = Column(String(30), nullable=True)                              # GENUS: BAIRRO
    cep = Column(String(10), nullable=True)                                 # GENUS: CEP
    cnpj = Column(String(18), nullable=True)                                # GENUS: CNPJ
    insc = Column(String(18), nullable=True)                                # GENUS: INSC
    fone = Column(String(15), nullable=True)                                # GENUS: FONE
    fax = Column(String(15), nullable=True)                                 # GENUS: FAX
    email = Column(String(60), nullable=True)                               # GENUS: EMAIL
    www = Column(String(60), nullable=True)                                 # GENUS: WWW
    simples = Column(String(1), nullable=True)                              # GENUS: SIMPLES
    serie = Column(String(4), nullable=True)                                # GENUS: SERIE
    credito_icms = Column(Float, nullable=True)                             # GENUS: CREDITOICMS
    tipo_comercio = Column(String(1), nullable=True)                        # GENUS: TIPOCOMERCIO
    cnae = Column(String(10), nullable=True)                                # GENUS: CNAE
    insc_municipal = Column(String(10), nullable=True)                      # GENUS: INSCMUNICIPAL
    arq_banco = Column(Text, nullable=True)                                 # GENUS: ARQBANCO

    # Tributação / percentuais
    pis = Column(Float, nullable=True)                                      # GENUS: PIS
    cofins = Column(Float, nullable=True)                                   # GENUS: COFINS
    ir = Column(Float, nullable=True)                                       # GENUS: IR
    contrib_social = Column(Float, nullable=True)                           # GENUS: CONTRIB_SOCIAL
    propaganda = Column(Float, nullable=True)                               # GENUS: PROPAGANDA
    comissao = Column(Float, nullable=True)                                 # GENUS: COMISSAO
    fretes = Column(Float, nullable=True)                                   # GENUS: FRETES
    outros = Column(Float, nullable=True)                                   # GENUS: OUTROS
    simples_percento = Column(Float, nullable=True)                        # GENUS: SIMPLES_PERCENTO
    iss = Column(Float, nullable=True)                                      # GENUS: ISS
    embalagens = Column(Float, nullable=True)                               # GENUS: EMBALAGENS
    juros = Column(Float, nullable=True)                                    # GENUS: JUROS

    # E-mail / SMTP
    smtp_porta = Column(Integer, nullable=True)                             # GENUS: SMTP_PORTA
    smtp_host = Column(String(60), nullable=True)                           # GENUS: SMTP_HOST
    smtp_password = Column(String(20), nullable=True)                      # GENUS: SMTP_PASSWORD
    smtp_username = Column(String(60), nullable=True)                       # GENUS: SMTP_USERNAME
    from_address = Column(String(60), nullable=True)                        # GENUS: FROM_ADDRESS
    from_name = Column(String(20), nullable=True)                          # GENUS: FROM_NAME
    autenticar_email_ssl = Column(String(1), nullable=True)                 # GENUS: AUTENTICAREMAILSSL

    # Contador
    cnpj_cont = Column(String(14), nullable=True)                          # GENUS: CNPJCONT
    nome_cont = Column(String(45), nullable=True)                          # GENUS: NOMECONT
    cpf_cnpj_cont = Column(String(14), nullable=True)                      # GENUS: CPFCNPJCONT
    crc_cont = Column(String(15), nullable=True)                           # GENUS: CRCCONT
    cep_cont = Column(String(10), nullable=True)                           # GENUS: CEPCONT
    endereco_cont = Column(String(50), nullable=True)                      # GENUS: ENDERECOCONT
    num_cont = Column(String(6), nullable=True)                            # GENUS: NUMCONT
    bairro_cont = Column(String(35), nullable=True)                        # GENUS: BAIRROCONT
    fone_cont = Column(String(15), nullable=True)                          # GENUS: FONECONT
    fax_cont = Column(String(15), nullable=True)                           # GENUS: FAXCONT
    email_cont = Column(String(60), nullable=True)                         # GENUS: EMAILCONT
    cod_cidade_cont = Column(Integer, nullable=True)                       # GENUS: CODCIDADECONT

    # Regime tributário / atividade
    regime_apuracao = Column(String(2), nullable=True)                     # GENUS: REGIME_APURACAO
    regime_tributacao = Column(String(2), nullable=True)                   # GENUS: REGIME_TRIBUTACAO
    atividade_municipal = Column(String(20), nullable=True)                # GENUS: ATIVIDADE_MUNICIPAL
    atividade_federal = Column(String(10), nullable=True)                  # GENUS: ATIVIDADE_FEDERAL
    aliq_municipal = Column(Float, nullable=True)                          # GENUS: ALIQMUNICIPAL
    classif_comercial = Column(String(2), nullable=True)                   # GENUS: CLASSIFCOMERCIAL
    cod_gare_icms = Column(String(4), nullable=True)                       # GENUS: CODGAREICMS
    icms_pis_cofins_entrada = Column(String(1), nullable=True)             # GENUS: ICMSPISCOFINSENTRADA
    icms_pis_cofins_saida = Column(String(1), nullable=True)               # GENUS: ICMSPISCOFINSSAIDA
    calcular_icms_dentro_estado = Column(String(1), nullable=True)         # GENUS: CALCULARICMSDENTRODOESTADO
    reforma_tributaria = Column(String(1), nullable=True)                  # GENUS: REFORMA_TRIBUTARIA

    # Financeiro / cobrança
    dias_vencimento = Column(Integer, nullable=True)                       # GENUS: DIASVENCIMENTO
    mora = Column(Float, nullable=True)                                    # GENUS: MORA
    multa = Column(Float, nullable=True)                                   # GENUS: MULTA
    inss = Column(Float, nullable=True)                                    # GENUS: INSS
    fundo_garantia = Column(Float, nullable=True)                          # GENUS: FUNDOGARANTIA

    # Certificado digital / arquivos / integrações
    num_certificado = Column(String(50), nullable=True)                    # GENUS: NUMCERTIFICADO
    caminho_logo = Column(String(200), nullable=True)                      # GENUS: CAMINHOLOGO
    caminho_xml = Column(String(200), nullable=True)                       # GENUS: CAMINHOXML
    salvar_xml = Column(String(1), nullable=True)                          # GENUS: SALVARXML
    senha_padrao = Column(String(20), nullable=True)                       # GENUS: SENHAPADRAO
    rntrc = Column(String(10), nullable=True)                              # GENUS: RNTRC
    foto_logo = Column(Text, nullable=True)                                # GENUS: FOTOLOGO
    situacao = Column(String(1), nullable=True)                            # GENUS: SITUACAO

    # NFe/NSU (SEFAZ)
    ult_nsu = Column(String(20), nullable=True)                            # GENUS: ULTNSU
    max_nsu = Column(String(20), nullable=True)                            # GENUS: MAXNSU
    data_ultima_consulta_nsu = Column(DateTime, nullable=True)             # GENUS: DATAULTIMACONSULTANSU
    hora_ultima_consulta_nsu = Column(String(8), nullable=True)            # GENUS: HORAULTIMACONSULTANSU

    # CTe/NSU (SEFAZ)
    ult_nsu_cte = Column(String(20), nullable=True)                        # GENUS: ULTNSUCTE
    max_nsu_cte = Column(String(20), nullable=True)                        # GENUS: MAXNSUCTE
    data_ultima_consulta_nsu_cte = Column(DateTime, nullable=True)         # GENUS: DATAULTIMACONSULTANSUCTE
    hora_ultima_consulta_nsu_cte = Column(String(8), nullable=True)        # GENUS: HORAULTIMACONSULTANSUCTE

    # Integração Gmail
    client_id_gmail = Column(String(150), nullable=True)                  # GENUS: CLIENTIDGMAIL
    client_secret_gmail = Column(String(150), nullable=True)               # GENUS: CLIENTSECRETGMAIL
    token_gmail = Column(String(150), nullable=True)                       # GENUS: TOKENGMAIL
    refresh_token_gmail = Column(String(150), nullable=True)               # GENUS: REFRESHTOKENGMAIL
    codigo_gmail = Column(String(150), nullable=True)                      # GENUS: CODIGOGMAIL

class ContaBancaria(Base):
    __tablename__ = "contas_bancarias"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    banco = Column(String(100), nullable=False)
    numero_conta = Column(String(50), nullable=True)

    empresa = relationship("Empresa", back_populates="contas_bancarias")
    contas_pagar = relationship("ContaPagar", back_populates="conta_bancaria")
    contas_receber = relationship("ContaReceber", back_populates="conta_bancaria")

class ContaPagar(Base):
    """Conta a pagar.

    Além dos campos originais do ERP, esta tabela reconhece todos os campos
    da tabela PAGAR do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), para
    permitir importar o contas a pagar sem perda de informação. Nomes e
    tipos foram conferidos a partir do schema Firebird do GENUS, seguindo o
    mesmo precedente estabelecido para `Produto`/GENUS.PRODUTO e
    `ContaReceber`/GENUS.RECEBER.

    Alguns campos do GENUS.PAGAR são códigos de outras tabelas legadas ainda
    não modeladas neste ERP (CODFORNECEDOR -> CADASTRO/FORNECEDOR,
    CODCONTA -> PLANOCONTA, CODCARTEIRA, CODFRETE -> TRANSPORTADOR,
    CONTACHEQUE/DOCCHEQUE -> cheque emitido, CODFATURAPAGAR -> fatura).
    Propositalmente não criamos FK própria para eles aqui — são mantidos
    como códigos brutos (`cod_*`), apenas para não perder informação; a
    entidade real, quando migrada de fato, vai exigir resolver essas
    referências contra as tabelas correspondentes.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "contas_pagar"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    conta_bancaria_id = Column(Integer, ForeignKey("contas_bancarias.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    valor = Column(Float, nullable=False)                                      # GENUS: VALOR
    data_vencimento = Column(DateTime, nullable=False)                         # GENUS: VENCIMEN
    data_pagamento = Column(DateTime, nullable=True)                          # GENUS: DTPAGO
    status = Column(String(20), default="pendente")  # pendente / pago
    observacao = Column(String(500), nullable=True)                          # GENUS: OBS
    postergado = Column(Boolean, default=False)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow, nullable=True)
    importado_excel = Column(Boolean, default=False, nullable=False)

    empresa = relationship("Empresa", back_populates="contas_pagar")
    conta_bancaria = relationship("ContaBancaria", back_populates="contas_pagar")

    # ── Campos migrados de GENUS.PAGAR ────────────────────────────────────
    # Identificação / chave original do título no GENUS
    cod_empresa = Column(Integer, nullable=True)                              # GENUS: CODEMPRESA
    codigo = Column(Integer, nullable=True, index=True)                       # GENUS: CODIGO
    tipo_doc = Column(String(1), nullable=True)                               # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                                      # GENUS: DOC
    serie = Column(String(4), nullable=True)                                  # GENUS: SERIE
    cod_fornecedor = Column(Integer, nullable=True)                           # GENUS: CODFORNECEDOR
    emissao = Column(DateTime, nullable=True)                                 # GENUS: EMISSAO
    parcela = Column(String(7), nullable=True)                                # GENUS: PARCELA
    valor_pago = Column(Float, nullable=True)                                 # GENUS: VALORPAGO
    cod_conta = Column(Integer, nullable=True)                                # GENUS: CODCONTA
    cod_historico = Column(String(12), nullable=True)                        # GENUS: CODHISTORICO
    cod_empresa_pag = Column(Integer, nullable=True)                         # GENUS: CODEMPRESAPAG
    duplicata = Column(String(15), nullable=True)                            # GENUS: DUPLICATA

    # Boleto / controle
    linha_digitavel = Column(String(60), nullable=True)                     # GENUS: LINHADIGITAVEL
    previsao = Column(String(1), nullable=True)                             # GENUS: PREVISAO
    cod_controle = Column(Integer, nullable=True)                           # GENUS: CODCONTROLE
    cod_controle_empresa = Column(Integer, nullable=True)                   # GENUS: CODCONTROLEEMPRESA
    cod_controle_tipo = Column(String(1), nullable=True)                    # GENUS: CODCONTROLETIPO
    num_doc = Column(String(20), nullable=True)                             # GENUS: NUMDOC
    valor_documento = Column(Float, nullable=True)                         # GENUS: VALORDOCUMENTO
    conta_cheque = Column(Integer, nullable=True)                          # GENUS: CONTACHEQUE
    doc_cheque = Column(Integer, nullable=True)                           # GENUS: DOCCHEQUE
    cod_frete = Column(Integer, nullable=True)                            # GENUS: CODFRETE
    parc_real = Column(String(1), nullable=True)                          # GENUS: PARCREAL
    cod_empresa_entrada = Column(Integer, nullable=True)                  # GENUS: CODEMPRESAENTRADA
    doc_parcela = Column(String(15), nullable=True)                       # GENUS: DOCPARCELA
    cod_carteira = Column(Integer, nullable=True)                         # GENUS: CODCARTEIRA
    cod_fixo = Column(Integer, nullable=True)                            # GENUS: CODFIXO
    valor_credito_fornecedor = Column(Float, nullable=True)              # GENUS: VALORCREDITOFORNECEDOR
    cod_fatura_pagar = Column(Integer, nullable=True)                    # GENUS: CODFATURAPAGAR

    # Auditoria de origem (GENUS)
    cod_alteracao = Column(Integer, nullable=True)                       # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)              # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)               # GENUS: DATAALTERACAO

    faturas_nota_pagar_vinculadas = relationship("FaturaNotaPagar", back_populates="conta_pagar", cascade="all, delete-orphan")
    cheques_emitidos_vinculados = relationship("ChequeEmitido", back_populates="conta_pagar", cascade="all, delete-orphan")


class ContaReceber(Base):
    """Conta a receber.

    Além dos campos originais do ERP, esta tabela reconhece todos os campos
    da tabela RECEBER do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), para
    permitir importar o contas a receber sem perda de informação. Nomes e
    tipos foram conferidos a partir do schema Firebird do GENUS, seguindo o
    mesmo precedente estabelecido para `Produto`/GENUS.PRODUTO.

    Alguns campos do GENUS.RECEBER são códigos de outras tabelas legadas
    ainda não modeladas neste ERP (CODCLIENTE -> CADASTRO/CLIENTE,
    CODCONTAS -> PLANOCONTA, CODCARTEIRA, CODREPRESENTANTE -> REPRESENTANTE,
    CODFRETE -> TRANSPORTADOR, etc.). Propositalmente não criamos FK própria
    para eles aqui — são mantidos como códigos brutos (`cod_*`), apenas para
    não perder informação; a entidade real, quando migrada de fato, vai
    exigir resolver essas referências contra as tabelas correspondentes.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "contas_receber"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    conta_bancaria_id = Column(Integer, ForeignKey("contas_bancarias.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    valor = Column(Float, nullable=False)                                      # GENUS: VALOR
    data_vencimento = Column(DateTime, nullable=False)                         # GENUS: VENCIMEN
    data_recebimento = Column(DateTime, nullable=True)                        # GENUS: DTPAGO
    status = Column(String(20), default="pendente")  # pendente / recebido
    observacao = Column(String(500), nullable=True)                          # GENUS: OBS
    postergado = Column(Boolean, default=False)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow, nullable=True)  # GENUS: DTDIGITACAO
    importado_excel = Column(Boolean, default=False, nullable=False)

    empresa = relationship("Empresa", back_populates="contas_receber")
    conta_bancaria = relationship("ContaBancaria", back_populates="contas_receber")

    # ── Campos migrados de GENUS.RECEBER ──────────────────────────────────
    # Identificação / chave original do título no GENUS
    cod_empresa = Column(Integer, nullable=True)                              # GENUS: CODEMPRESA
    codigo = Column(Integer, nullable=True, index=True)                       # GENUS: CODIGO
    cod_saida = Column(Integer, nullable=True)                                # GENUS: CODSAIDA
    parcela = Column(String(5), nullable=True)                               # GENUS: PARCELA
    cod_cliente = Column(Integer, nullable=True)                             # GENUS: CODCLIENTE
    emissao = Column(DateTime, nullable=True)                                # GENUS: EMISSAO
    valor_pago = Column(Float, nullable=True)                                # GENUS: VALORPAGO
    cod_historico = Column(String(12), nullable=True)                        # GENUS: CODHISTORICO
    cod_contas = Column(Integer, nullable=True)                              # GENUS: CODCONTAS
    tipo_doc = Column(String(1), nullable=True)                              # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                                     # GENUS: DOC
    cod_empresa_rec = Column(Integer, nullable=True)                         # GENUS: CODEMPRESAREC
    imp_boleto = Column(String(1), nullable=True)                            # GENUS: IMPBOLETO
    cod_movto = Column(Integer, nullable=True)                               # GENUS: CODMOVTO

    # Boleto / carteira / cobrança
    nosso_numero = Column(String(20), nullable=True)                         # GENUS: NOSSONUMERO
    cod_carteira = Column(Integer, nullable=True)                            # GENUS: CODCARTEIRA
    cod_fatura = Column(Integer, nullable=True)                              # GENUS: CODFATURA
    comissao = Column(Float, nullable=True)                                  # GENUS: COMISSAO
    processamento = Column(DateTime, nullable=True)                         # GENUS: PROCESSAMENTO
    remessa = Column(Integer, nullable=True)                                 # GENUS: REMESSA
    lote = Column(Integer, nullable=True)                                    # GENUS: LOTE
    cod_retorno = Column(Integer, nullable=True)                            # GENUS: CODRETORNO
    banco_remessa = Column(String(20), nullable=True)                       # GENUS: BANCOREMESSA
    num_transacao = Column(String(15), nullable=True)                       # GENUS: NUMTRANSACAO
    valor_financeiro = Column(Float, nullable=True)                         # GENUS: VALORFINANCEIRO
    obs_boleto = Column(String(160), nullable=True)                         # GENUS: OBSBOLETO
    valor_deposito = Column(Float, nullable=True)                           # GENUS: VALORDEPOSITO

    # SCPC / cartório / protesto
    scpc_enviado = Column(DateTime, nullable=True)                          # GENUS: SCPCENVIADO
    scpc_retirado = Column(DateTime, nullable=True)                         # GENUS: SCPCRETIRADO
    carta_cobranca = Column(DateTime, nullable=True)                        # GENUS: CARTACOBRANCA
    carta_scpc = Column(DateTime, nullable=True)                            # GENUS: CARTASCPC
    data_protesto = Column(DateTime, nullable=True)                         # GENUS: DATAPROTESTO
    protocolo_protesto = Column(String(30), nullable=True)                  # GENUS: PROTOCOLOPROTESTO
    obs_protesto = Column(String(80), nullable=True)                        # GENUS: OBSPROTESTO
    obs_retira_protesto = Column(String(80), nullable=True)                 # GENUS: OBSRETIRAPROTESTO
    valor_cartorio = Column(Float, nullable=True)                          # GENUS: VALORCARTORIO

    # Multa / mora / desconto
    data_multa = Column(DateTime, nullable=True)                           # GENUS: DATAMULTA
    multa = Column(Float, nullable=True)                                   # GENUS: MULTA
    mora = Column(Float, nullable=True)                                    # GENUS: MORA
    desconto = Column(Float, nullable=True)                                # GENUS: DESCONTO
    data_desconto = Column(DateTime, nullable=True)                        # GENUS: DATADESCONTO
    valor_multa = Column(Float, nullable=True)                             # GENUS: VALORMULTA
    valor_mora = Column(Float, nullable=True)                              # GENUS: VALORMORA
    valor_desconto = Column(Float, nullable=True)                          # GENUS: VALORDESCONTO

    # Fiscal
    pis_cofins = Column(Float, nullable=True)                              # GENUS: PISCOFINS
    iss = Column(Float, nullable=True)                                     # GENUS: ISS

    # Ocorrência / baixa / responsáveis
    ocorrencia = Column(String(80), nullable=True)                         # GENUS: OCORRENCIA
    funcionario_baixa = Column(Integer, nullable=True)                     # GENUS: FUNCIONARIOBAIXA
    cod_frete = Column(Integer, nullable=True)                             # GENUS: CODFRETE
    cod_representante = Column(Integer, nullable=True)                     # GENUS: CODREPRESENTANTE
    cod_locacao = Column(Integer, nullable=True)                           # GENUS: CODLOCACAO
    cod_empresa_saida = Column(Integer, nullable=True)                     # GENUS: CODEMPRESASAIDA
    cod_fixo = Column(Integer, nullable=True)                              # GENUS: CODFIXO

    # Auditoria de origem (GENUS)
    cod_alteracao = Column(Integer, nullable=True)                         # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)                # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                 # GENUS: DATAALTERACAO
    valor_credito = Column(Float, nullable=True)                          # GENUS: VALORCREDITO
    cod_antigo_receber = Column(Integer, nullable=True)                    # GENUS: COD_ANTIGO_RECEBER


class ContaReceberExcluida(Base):
    """Conta a receber excluída (histórico/snapshot no momento da exclusão).

    Reconhece a estrutura completa da tabela DELRECEBER do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Financeiro (Tier 2) deste ERP,
    análoga a `ProdutoExcluido`/GENUS.DEL_PRODUTO e a
    `SaidaExcluida`/GENUS.DELSAIDA, só que para o título de contas a receber
    (`ContaReceber`/GENUS.RECEBER) em vez do cadastro de produto ou do
    cabeçalho de saída. É o mesmo padrão "tabela de lixo/histórico de
    exclusão" já visto nesses dois outros módulos, aqui repetido para o
    Financeiro: DEL_PRODUTO está para PRODUTO, DELSAIDA está para SAIDA, e
    DELRECEBER está para RECEBER.

    DELRECEBER guarda uma cópia de praticamente todos os atributos de
    `ContaReceber`/GENUS.RECEBER (mesmos nomes de coluna: CODEMPRESA, CODIGO,
    CODSAIDA, PARCELA, CODCLIENTE, EMISSAO, VENCIMEN, VALOR, DTPAGO,
    VALORPAGO, CODHISTORICO, CODCONTAS, OBS, NOSSONUMERO, CODCARTEIRA,
    CODFATURA, COMISSAO, VALORCREDITO etc. — reaproveitados aqui com os
    mesmos nomes em snake_case já usados em `ContaReceber`, para
    consistência) no momento em que o título foi excluído de RECEBER no
    GENUS — permitindo recuperar/auditar um título a receber inteiro que foi
    apagado. DELRECEBER é uma estrutura mais enxuta que RECEBER: não
    reconhece campos de boleto/remessa mais recentes (LOTE, CODRETORNO,
    BANCOREMESSA, NUMTRANSACAO, VALORFINANCEIRO, OBSBOLETO, VALORDEPOSITO),
    nem os de protesto/multa/mora/desconto (DATAPROTESTO,
    PROTOCOLOPROTESTO, MULTA, MORA, DESCONTO etc.), nem os fiscais
    (PISCOFINS, ISS), nem os de ocorrência/responsáveis (OCORRENCIA,
    FUNCIONARIOBAIXA, CODFRETE, CODREPRESENTANTE, CODLOCACAO,
    CODEMPRESASAIDA, CODFIXO) — sinal de que DELRECEBER foi criada antes
    dessas extensões mais recentes da estrutura RECEBER no GENUS (mesmo
    raciocínio já documentado em `SaidaExcluida` sobre DELSAIDA ser mais
    enxuta que SAIDA).

    Assim como `ProdutoExcluido` e `SaidaExcluida`, **não há nenhuma foreign
    key** própria criada aqui para (CODEMPRESA, CODIGO) contra `ContaReceber`
    — propositalmente: seria uma chave composta (CODEMPRESA + CODIGO, o
    mesmo par natural de `ContaReceber.cod_empresa`/`ContaReceber.codigo`),
    não há constraint única correspondente criada neste ERP para apoiar essa
    FK, e, por definição, um título excluído de RECEBER no GENUS normalmente
    **não** tem mais correspondente vivo em RECEBER (a menos que o código
    tenha sido reaproveitado depois) — por isso `cod_empresa`/`codigo` são
    mantidos como códigos brutos, indexados, sem FK própria; a
    resolução/religação (quando fizer sentido) fica a cargo do agente de
    migração de dados.

    CODCLIENTE, CODCONTAS, CODCARTEIRA, CODFATURA, CODSAIDA,
    CODEMPRESAREC, CODMOVTO são, igualmente, apenas códigos brutos de
    tabelas legadas ainda não modeladas (ou já modeladas, mas sem FK própria
    criada aqui) — mesmo critério já adotado em `ContaReceber` para os
    mesmos campos.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela DELRECEBER foi lido no GENUS por este agente.
    """
    __tablename__ = "contas_receber_excluidas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave original do título excluído no GENUS ───────
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA (par natural com codigo; ver docstring — sem FK própria para ContaReceber)
    codigo = Column(Integer, nullable=True, index=True)                   # GENUS: CODIGO (identificador original do título excluído no GENUS)
    cod_saida = Column(Integer, nullable=True)                            # GENUS: CODSAIDA
    parcela = Column(String(5), nullable=True)                            # GENUS: PARCELA
    cod_cliente = Column(Integer, nullable=True, index=True)              # GENUS: CODCLIENTE
    emissao = Column(DateTime, nullable=True)                             # GENUS: EMISSAO
    data_vencimento = Column(DateTime, nullable=True)                     # GENUS: VENCIMEN
    valor = Column(Float, nullable=True)                                  # GENUS: VALOR
    data_recebimento = Column(DateTime, nullable=True)                    # GENUS: DTPAGO
    valor_pago = Column(Float, nullable=True)                             # GENUS: VALORPAGO
    cod_historico = Column(String(12), nullable=True)                     # GENUS: CODHISTORICO
    cod_contas = Column(Integer, nullable=True)                           # GENUS: CODCONTAS
    dt_digitacao = Column(DateTime, nullable=True)                        # GENUS: DTDIGITACAO
    observacao = Column(String(500), nullable=True)                       # GENUS: OBS
    tipo_doc = Column(String(1), nullable=True)                           # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                                  # GENUS: DOC
    cod_empresa_rec = Column(Integer, nullable=True)                      # GENUS: CODEMPRESAREC

    # ── Boleto / carteira / cobrança ──────────────────────────────────────
    imp_boleto = Column(String(1), nullable=True)                         # GENUS: IMPBOLETO
    cod_movto = Column(Integer, nullable=True)                            # GENUS: CODMOVTO
    nosso_numero = Column(String(20), nullable=True)                      # GENUS: NOSSONUMERO
    cod_carteira = Column(Integer, nullable=True)                         # GENUS: CODCARTEIRA
    cod_fatura = Column(Integer, nullable=True)                           # GENUS: CODFATURA
    comissao = Column(Float, nullable=True)                               # GENUS: COMISSAO
    processamento = Column(DateTime, nullable=True)                       # GENUS: PROCESSAMENTO

    # ── SCPC / cartório / protesto (cobrança) ─────────────────────────────
    scpc_enviado = Column(DateTime, nullable=True)                        # GENUS: SCPCENVIADO
    scpc_retirado = Column(DateTime, nullable=True)                       # GENUS: SCPCRETIRADO
    carta_cobranca = Column(DateTime, nullable=True)                      # GENUS: CARTACOBRANCA
    carta_scpc = Column(DateTime, nullable=True)                          # GENUS: CARTASCPC

    # ── Auditoria de origem (GENUS) ───────────────────────────────────────
    cod_alteracao = Column(Integer, nullable=True)                        # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)               # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                # GENUS: DATAALTERACAO
    valor_credito = Column(Float, nullable=True)                          # GENUS: VALORCREDITO
    remessa = Column(Integer, nullable=True)                              # GENUS: REMESSA

    # ── Auditoria da exclusão ─────────────────────────────────────────────
    dt_exclusao = Column(DateTime, nullable=True)                         # GENUS: DT_EXCLUSAO


class ContaPagarExcluida(Base):
    """Conta a pagar excluída (histórico/snapshot no momento da exclusão).

    Reconhece a estrutura completa da tabela DELPAGAR do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Financeiro (Tier 2) deste ERP,
    análoga a `ContaReceberExcluida`/GENUS.DELRECEBER, só que para o título
    de contas a pagar (`ContaPagar`/GENUS.PAGAR) em vez do título de contas
    a receber. É o mesmo padrão "tabela de lixo/histórico de exclusão" já
    visto em `ProdutoExcluido`/GENUS.DEL_PRODUTO,
    `SaidaExcluida`/GENUS.DELSAIDA e `ContaReceberExcluida`/GENUS.DELRECEBER,
    aqui repetido para o Financeiro: DELRECEBER está para RECEBER, e
    DELPAGAR está para PAGAR.

    DELPAGAR guarda uma cópia de parte dos atributos de `ContaPagar`/GENUS.PAGAR
    (mesmos nomes de coluna: CODEMPRESA, CODIGO, TIPODOC, DOC, SERIE,
    CODFORNECEDOR, EMISSAO, VENCIMEN, VALOR, PARCELA, DTPAGO, VALORPAGO,
    CODCONTA, CODHISTORICO, OBS, CODEMPRESAPAG, DUPLICATA, CODALTERACAO,
    HORAALTERACAO, DATAALTERACAO, LINHADIGITAVEL, VALORDOCUMENTO,
    DOCPARCELA — reaproveitados aqui com os mesmos nomes em snake_case já
    usados em `ContaPagar`, para consistência) no momento em que o título
    foi excluído de PAGAR no GENUS — permitindo recuperar/auditar um título
    a pagar inteiro que foi apagado. DELPAGAR é uma estrutura bem mais
    enxuta que PAGAR: não reconhece os campos de controle/boleto mais
    recentes (PREVISAO, CODCONTROLE, CODCONTROLEEMPRESA, CODCONTROLETIPO,
    NUMDOC, CONTACHEQUE, DOCCHEQUE, CODFRETE, PARCREAL, CODEMPRESAENTRADA,
    CODCARTEIRA, CODFIXO, VALORCREDITOFORNECEDOR, CODFATURAPAGAR) — sinal de
    que DELPAGAR foi criada antes dessas extensões mais recentes da
    estrutura PAGAR no GENUS (mesmo raciocínio já documentado em
    `ContaReceberExcluida` sobre DELRECEBER ser mais enxuta que RECEBER).

    Assim como `ContaReceberExcluida`, **não há nenhuma foreign key** própria
    criada aqui para (CODEMPRESA, CODIGO) contra `ContaPagar` — propositalmente:
    seria uma chave composta (CODEMPRESA + CODIGO, o mesmo par natural de
    `ContaPagar.cod_empresa`/`ContaPagar.codigo`), não há constraint única
    correspondente criada neste ERP para apoiar essa FK, e, por definição,
    um título excluído de PAGAR no GENUS normalmente **não** tem mais
    correspondente vivo em PAGAR (a menos que o código tenha sido
    reaproveitado depois) — por isso `cod_empresa`/`codigo` são mantidos
    como códigos brutos, indexados, sem FK própria; a resolução/religação
    (quando fizer sentido) fica a cargo do agente de migração de dados.

    CODFORNECEDOR, CODCONTA, CODEMPRESAPAG são, igualmente, apenas códigos
    brutos de tabelas legadas ainda não modeladas (ou já modeladas, mas sem
    FK própria criada aqui) — mesmo critério já adotado em `ContaPagar` para
    os mesmos campos.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela DELPAGAR foi lido no GENUS por este agente.
    """
    __tablename__ = "contas_pagar_excluidas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave original do título excluído no GENUS ───────
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA (par natural com codigo; ver docstring — sem FK própria para ContaPagar)
    codigo = Column(Integer, nullable=True, index=True)                   # GENUS: CODIGO (identificador original do título excluído no GENUS)
    tipo_doc = Column(String(1), nullable=True)                           # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                                  # GENUS: DOC
    serie = Column(String(4), nullable=True)                              # GENUS: SERIE
    cod_fornecedor = Column(Integer, nullable=True, index=True)           # GENUS: CODFORNECEDOR
    emissao = Column(DateTime, nullable=True)                             # GENUS: EMISSAO
    data_vencimento = Column(DateTime, nullable=True)                     # GENUS: VENCIMEN
    valor = Column(Float, nullable=True)                                  # GENUS: VALOR
    parcela = Column(String(7), nullable=True)                            # GENUS: PARCELA
    data_pagamento = Column(DateTime, nullable=True)                      # GENUS: DTPAGO
    valor_pago = Column(Float, nullable=True)                             # GENUS: VALORPAGO
    cod_conta = Column(Integer, nullable=True)                            # GENUS: CODCONTA
    cod_historico = Column(String(12), nullable=True)                     # GENUS: CODHISTORICO
    observacao = Column(String(70), nullable=True)                        # GENUS: OBS
    cod_empresa_pag = Column(Integer, nullable=True)                      # GENUS: CODEMPRESAPAG
    duplicata = Column(String(15), nullable=True)                         # GENUS: DUPLICATA

    # ── Auditoria de origem (GENUS) ───────────────────────────────────────
    cod_alteracao = Column(Integer, nullable=True)                        # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)               # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                # GENUS: DATAALTERACAO
    linha_digitavel = Column(String(60), nullable=True)                   # GENUS: LINHADIGITAVEL

    # ── Auditoria da exclusão ─────────────────────────────────────────────
    dt_exclusao = Column(DateTime, nullable=True)                         # GENUS: DT_EXCLUSAO
    valor_documento = Column(Float, nullable=True)                        # GENUS: VALORDOCUMENTO
    doc_parcela = Column(String(15), nullable=True)                       # GENUS: DOCPARCELA


class LancamentoContabil(Base):
    """Lançamento contábil (GENUS.LANCAMENTO).

    Reconhece a estrutura completa da tabela LANCAMENTO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO, `ContaPagar`/GENUS.PAGAR e
    `ContaReceber`/GENUS.RECEBER.

    Não é o mesmo conceito de "lançamento financeiro" já existente neste ERP
    (título de `ContaPagar`/`ContaReceber`, exibido em
    `FinanceiroAgrupadoWindow`/`LancamentoDetalheWindow`). No GENUS, LANCAMENTO
    é o livro-razão contábil propriamente dito: cada linha é um lançamento de
    partida (dobrada ou não — ver PARTIDADOBRADA) num plano de contas
    (CODCONTAS), com histórico padronizado (CODHISTORICO), valor, documento e
    data de movimento — e pode ou não ter origem numa baixa de contas a
    receber (CODRECEBER/CODEMPRESARECEBER), num crédito de fornecedor
    (CODCREDITOFORNECEDOR), numa comissão de representante
    (CODCOMISSAOREPRESENTANTE) ou num depósito (CODDEPOSITO). CODLANCACREDITO
    referencia o lançamento de contrapartida (o outro lado da partida dobrada)
    dentro desta própria tabela — por isso é mantido como código bruto
    (`cod_lanc_credito`), sem virar FK própria, já que a chave primária real
    do GENUS (CODIGO) só pode ser resolvida contra si mesma depois que os
    dados forem migrados.

    Os demais campos que apontam para outras tabelas legadas ainda não
    plenamente resolvíveis a partir daqui (CODCONTAS -> PLANOCONTA,
    CENTROCUSTO -> um cadastro de centro de custo contábil que, no GENUS, é
    distinto da tabela GENUS.CENTROCUSTO já reconhecida neste ERP como
    extensão de PRODUTO — ver docstring de `CentroCusto`, CODCOMISSAOREPRESENTANTE
    -> REPRESENTANTE, CODRECEBER/CODEMPRESARECEBER -> `ContaReceber`
    (via `ContaReceber.codigo`/`ContaReceber.cod_empresa`), CODCREDITOFORNECEDOR
    -> crédito de fornecedor ainda não modelado, CODDEPOSITO -> `Deposito`)
    são propositalmente mantidos como códigos brutos (`cod_*`), sem FK
    própria — a entidade real, quando migrada de fato, vai exigir resolver
    essas referências contra as tabelas correspondentes.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "lancamentos_contabeis"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.LANCAMENTO ───────────────────────────────
    cod_empresa = Column(Integer, nullable=True, index=True)               # GENUS: CODEMPRESA
    codigo = Column(Integer, nullable=True, index=True)                    # GENUS: CODIGO (chave original do lançamento no GENUS)
    cod_contas = Column(Integer, nullable=True, index=True)                # GENUS: CODCONTAS
    cod_historico = Column(String(12), nullable=True)                      # GENUS: CODHISTORICO
    valor = Column(Float, nullable=True)                                   # GENUS: VALOR
    doc = Column(String(15), nullable=True)                                # GENUS: DOC
    obs = Column(String(70), nullable=True)                                # GENUS: OBS
    dt_movto = Column(DateTime, nullable=True)                             # GENUS: DTMOVTO
    usuario = Column(String(20), nullable=True)                            # GENUS: USUARIO
    dt_digitacao = Column(DateTime, nullable=True)                         # GENUS: DTDIGITACAO
    cod_centro_custo = Column(Integer, nullable=True)                      # GENUS: CENTROCUSTO
    cod_alteracao = Column(Integer, nullable=True)                         # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)                # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                 # GENUS: DATAALTERACAO
    cod_comissao_representante = Column(Integer, nullable=True)            # GENUS: CODCOMISSAOREPRESENTANTE
    cod_lanc_credito = Column(Integer, nullable=True, index=True)          # GENUS: CODLANCACREDITO
    partida_dobrada = Column(String(1), nullable=True)                     # GENUS: PARTIDADOBRADA
    cod_partida_dobrada = Column(Integer, nullable=True)                   # GENUS: CODPARTIDADOBRADA
    cod_receber = Column(Integer, nullable=True, index=True)               # GENUS: CODRECEBER
    cod_empresa_receber = Column(Integer, nullable=True)                   # GENUS: CODEMPRESARECEBER
    cod_credito_fornecedor = Column(Integer, nullable=True)                # GENUS: CODCREDITOFORNECEDOR
    cod_deposito = Column(Integer, nullable=True)                          # GENUS: CODDEPOSITO


class MovimentoFixo(Base):
    """Movimento de lançamento fixo/recorrente (GENUS.MOVTOFIXO).

    Reconhece a estrutura completa da tabela MOVTOFIXO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `LancamentoContabil`/GENUS.LANCAMENTO, `Produto`/GENUS.PRODUTO,
    `ContaPagar`/GENUS.PAGAR e `ContaReceber`/GENUS.RECEBER.

    No GENUS, MOVTOFIXO é a tabela de controle de geração/baixa de um título
    fixo/recorrente (mensalidade, despesa fixa etc.) para um mês/ano
    específico: cada linha marca que o título fixo referenciado por
    CODFIXOPAGAR (a pagar) ou CODFIXORECEBER (a receber) já teve seu
    movimento gerado (ou está agendado) para a competência MES/ANO. Uma
    mesma linha nunca teria as duas FKs preenchidas ao mesmo tempo na
    prática (é ou um fixo a pagar, ou um fixo a receber), mas o schema do
    GENUS permite ambas as colunas simultaneamente — por isso as duas são
    reconhecidas aqui, ambas opcionais.

    CODFIXOPAGAR e CODFIXORECEBER são chaves estrangeiras, no GENUS, para as
    tabelas mestras FIXOPAGAR (PK_FIXOPAGAR) e FIXORECEBER (PK_FIXORECEBER)
    respectivamente — confirmado via metadados do Firebird
    (RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS), sem ler nenhuma linha
    de dado de negócio. FIXOPAGAR (o cadastro mestre do "fixo a pagar" em
    si — valor, dia de vencimento, competência etc.) já está modelada neste
    ERP como `FixoPagar` (ver classe abaixo); `cod_fixo_pagar` é mantido
    como código bruto (mirror do GENUS), sem virar FK própria para
    `FixoPagar.codigo`, pelo mesmo motivo de `Comissao.cod_representante`
    (mirror bruto) — a chave primária real do GENUS só pode ser resolvida
    contra si mesma depois que os dados forem migrados. FIXORECEBER (a
    contrapartida "a receber") ainda não está modelada neste ERP, então
    `cod_fixo_receber` permanece como código bruto sem tabela mestra
    correspondente — a entidade real, quando FIXORECEBER for migrada, vai
    exigir resolver essa referência contra a tabela correspondente.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "movimentos_fixos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.MOVTOFIXO ────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)             # GENUS: CODIGO (PK original no GENUS)
    mes = Column(String(2), nullable=True)                          # GENUS: MES
    ano = Column(String(4), nullable=True)                          # GENUS: ANO
    cod_fixo_pagar = Column(Integer, nullable=True, index=True)     # GENUS: CODFIXOPAGAR (mirror bruto de FIXOPAGAR.CODIGO; ver model FixoPagar)
    cod_fixo_receber = Column(Integer, nullable=True, index=True)   # GENUS: CODFIXORECEBER (FK -> FIXORECEBER.CODIGO, ainda não modelada)


class FixoPagar(Base):
    """Cadastro mestre de título fixo/recorrente a pagar (GENUS.FIXOPAGAR).

    Reconhece a estrutura completa da tabela FIXOPAGAR do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `MovimentoFixo`/GENUS.MOVTOFIXO, `LancamentoContabil`/GENUS.LANCAMENTO,
    `Comissao`/GENUS.COMISSAO, `ContaPagar`/GENUS.PAGAR e `ContaReceber`/
    GENUS.RECEBER.

    No GENUS, FIXOPAGAR é a tabela CADASTRO/MESTRE de um título fixo ou
    recorrente a pagar (mensalidade, aluguel, despesa fixa mensal etc.) —
    valor, dia de vencimento, período de vigência (INICIO/TERMINO) e
    quantidade de parcelas. É esta tabela mestre que `MovimentoFixo`
    (GENUS.MOVTOFIXO, já modelada neste ERP) referencia através de
    CODFIXOPAGAR para controlar, mês a mês, se o movimento daquele título já
    foi gerado/baixado para a competência MES/ANO — ver
    `MovimentoFixo.cod_fixo_pagar` (mirror bruto do código original do
    GENUS, sem FK própria, pelo mesmo motivo descrito abaixo).

    CODCADASTRO é chave estrangeira, no GENUS, para a tabela mestre de
    identidade CADASTRO (já reconhecida neste ERP como `CadastroPessoa`) —
    é o beneficiário/credor do título fixo (a pessoa/empresa que recebe o
    pagamento). Propositalmente não criamos uma FK própria aqui (mesmo
    padrão usado para `ClienteCompleto.cod_cadastro` e
    `Fornecedor.cod_cadastro`) — apenas reconhecemos o campo bruto do
    GENUS (`cod_cadastro`); resolver o beneficiário completo, quando os
    dados forem migrados de fato, exige o JOIN entre FIXOPAGAR (estes
    campos) e CADASTRO via CODCADASTRO, contra `CadastroPessoa.codigo`.

    Os demais códigos (CODEMPRESA, CODCONTAS -> PLANOCONTA, CODCARTEIRA,
    CODHISTORICO -> HISTORICO, já reconhecida neste ERP como `Historico`)
    apontam para tabelas legadas ainda não plenamente resolvíveis a partir
    daqui, ou para tabelas mestras já reconhecidas mas cuja FK própria não
    foi criada — propositalmente mantidos como códigos brutos (`cod_*`),
    sem FK própria, apenas para não perder informação; a entidade real,
    quando migrada de fato, vai exigir resolver essas referências contra as
    tabelas correspondentes (mesmo padrão de `ContaPagar.cod_historico` e
    `LancamentoContabil.cod_historico`, ambos também VARCHAR(12) sem FK).

    `CODIGO` (o código original do título fixo no GENUS) é a peça que
    permite resolver `MovimentoFixo.cod_fixo_pagar` -> `FixoPagar.codigo`,
    no futuro, quando os dados forem migrados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "fixos_pagar"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.FIXOPAGAR ────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)              # GENUS: CODIGO (PK original no GENUS; ver MovimentoFixo.cod_fixo_pagar)
    cod_empresa = Column(Integer, nullable=True)                     # GENUS: CODEMPRESA
    cod_cadastro = Column(Integer, nullable=True, index=True)        # GENUS: CODCADASTRO (beneficiário/credor; FK -> CADASTRO.CODIGO, ver CadastroPessoa)
    cod_contas = Column(Integer, nullable=True)                      # GENUS: CODCONTAS
    inicio = Column(String(6), nullable=True)                       # GENUS: INICIO (competência inicial de vigência, ex.: MMAAAA)
    termino = Column(String(6), nullable=True)                      # GENUS: TERMINO (competência final de vigência, ex.: MMAAAA)
    valor = Column(Float, nullable=True)                             # GENUS: VALOR
    dia = Column(Integer, nullable=True)                             # GENUS: DIA (dia fixo de vencimento)
    obs = Column(String(50), nullable=True)                          # GENUS: OBS
    qtde_parcela = Column(Integer, nullable=True)                    # GENUS: QTDEPARCELA
    cod_carteira = Column(Integer, nullable=True)                    # GENUS: CODCARTEIRA
    cod_historico = Column(String(12), nullable=True)                # GENUS: CODHISTORICO (FK -> HISTORICO.CODIGO, ver Historico)


class FaturaNota(Base):
    """Vínculo entre uma fatura e a(s) nota(s) fiscal(is) de saída que a
    compõem (GENUS.FATURANOTA).

    Reconhece a estrutura completa da tabela FATURANOTA do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Financeiro (Tier 2) deste ERP,
    seguindo o mesmo precedente estabelecido para `LancamentoContabil`/
    GENUS.LANCAMENTO, `MovimentoFixo`/GENUS.MOVTOFIXO, `FixoPagar`/
    GENUS.FIXOPAGAR e `Comissao`/GENUS.COMISSAO. Tipos, chave primária e
    foreign keys foram conferidos diretamente no schema Firebird do GENUS
    via metadados (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS /
    RDB$REF_CONSTRAINTS / RDB$INDEX_SEGMENTS), sem ler nenhuma linha de
    dado de negócio: os 3 campos são simples (CODEMPRESA SMALLINT,
    RDB$FIELD_TYPE 7; CODFATURA/CODSAIDA INTEGER, RDB$FIELD_TYPE 8) ->
    Integer, exatamente os tipos sugeridos para esta tabela.

    No GENUS, FATURANOTA é a tabela de vínculo (many-to-many, análoga em
    espírito a `PedidoNota`/GENUS.PEDIDONOTA) entre FATURA (o agrupamento
    de título(s) a receber num boleto/fatura só, já reconhecida neste ERP
    como `Fatura` — ver classe abaixo) e SAIDA (cabeçalho da nota fiscal de
    saída, já reconhecido neste ERP como `Saida`) — confirmado por duas
    foreign keys reais:
    - `FK_FATURANOTA_FATURA`: (CODEMPRESA, CODFATURA) -> `PK_FATURA`.
    - `FK_FATURANOTA_SAIDA`: (CODEMPRESA, CODSAIDA) -> `PK_SAIDA` (a mesma
      chave natural já usada em `Saida.cod_empresa`/`Saida.codigo`).
    Ou seja, cada linha registra que uma nota fiscal de saída específica
    compõe (foi agrupada n)a fatura referenciada por CODFATURA — uma mesma
    fatura pode agrupar várias notas fiscais (fechamento/consolidação de
    faturamento num único boleto), por isso este model é a tabela de junção
    pura dessa relação N:N, e não um campo espalhado em nenhuma das duas.

    FATURA (a tabela mestre do agrupamento — CODEMPRESA, CODIGO, EMISSAO,
    CODCONDPAGTO, CODCADASTRO, CODCARTEIRA) agora tem model dedicado neste
    ERP (`Fatura`, ver classe abaixo, criada junto com esta atualização) —
    por isso `fatura_id` (FK própria para `Fatura`) é criado aqui, seguindo
    exatamente o mesmo padrão de `saida_id` logo abaixo: resolvível
    relacionando (GENUS.FATURANOTA.CODEMPRESA, GENUS.FATURANOTA.CODFATURA)
    com (`Fatura.cod_empresa`, `Fatura.codigo`) — tarefa do agente de
    migração de dados, não deste agente de estrutura. `cod_fatura` (e
    `cod_empresa`, compartilhado com ambas as FKs) continuam preservados à
    parte como códigos brutos, para não perder informação até que essa
    resolução aconteça, exatamente como já ocorre com `cod_saida` abaixo.

    CODSAIDA (junto com CODEMPRESA, compartilhado com a FK acima) já é
    resolvível contra `Saida`, já reconhecida neste ERP — por isso
    `saida_id` (FK própria para `Saida`) é criada aqui, seguindo exatamente
    o mesmo padrão de `PedidoNota.saida_id`. Essa FK só pode ser resolvida
    de fato relacionando (GENUS.FATURANOTA.CODEMPRESA,
    GENUS.FATURANOTA.CODSAIDA) com (`Saida.cod_empresa`, `Saida.codigo`) —
    tarefa do agente de migração de dados, não deste agente de estrutura.
    Por isso `saida_id` é opcional (nullable) e os códigos brutos originais
    (`cod_empresa`, `cod_saida`) são preservados à parte, para não perder
    informação até que essa resolução aconteça.

    FATURANOTA tem chave primária composta própria no GENUS
    (`PK_FATURANOTA`, formada por CODEMPRESA + CODFATURA + CODSAIDA, todos
    NOT NULL). Ainda assim, seguindo o mesmo critério já usado para as
    demais tabelas do GENUS reconhecidas neste ERP (nenhuma linha foi
    importada ainda), essa chave composta não é reaproveitada como PK
    deste ERP — o `id` serial é a única chave própria deste model, e os 3
    campos originais são preservados como códigos brutos (`cod_*`),
    indexados, mesmo assim mantidos nullable aqui, seguindo o padrão deste
    ERP de nunca exigir (`nullable=False`) um campo puramente estrutural
    ainda não populado por nenhuma importação de dados (mesmo critério já
    documentado em `PedidoNota` para CODEMPRESASAIDA).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "faturas_nota"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com a saída/nota fiscal já migrada neste ERP ──────────────
    saida_id = Column(Integer, ForeignKey("saidas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODSAIDA) -> (Saida.cod_empresa, Saida.codigo)

    # ── Vínculo com a fatura já migrada neste ERP (ver model Fatura) ──────
    fatura_id = Column(Integer, ForeignKey("faturas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODFATURA) -> (Fatura.cod_empresa, Fatura.codigo)

    # ── Campos migrados de GENUS.FATURANOTA (PK composta no GENUS: CODEMPRESA + CODFATURA + CODSAIDA) ─
    cod_empresa = Column(Integer, nullable=True, index=True)     # GENUS: CODEMPRESA (parte da PK_FATURANOTA e de ambas as FKs, FK_FATURANOTA_FATURA e FK_FATURANOTA_SAIDA)
    cod_fatura = Column(Integer, nullable=True, index=True)      # GENUS: CODFATURA (parte da PK_FATURANOTA e da FK_FATURANOTA_FATURA -> FATURA; mirror bruto — ver fatura_id acima para a FK própria, já resolvível agora que FATURA está modelada como Fatura)
    cod_saida = Column(Integer, nullable=True, index=True)       # GENUS: CODSAIDA (parte da PK_FATURANOTA e da FK_FATURANOTA_SAIDA -> Saida.codigo)

    saida = relationship("Saida", back_populates="faturas_vinculadas")
    fatura = relationship("Fatura", back_populates="notas_vinculadas")


class FaturaNotaPagar(Base):
    """Vínculo entre uma fatura a pagar e o(s) título(s)/nota(s) fiscal(is) de
    compra (entrada) que a compõem (GENUS.FATURANOTAPAGAR) — o análogo, no
    lado de contas a pagar, de `FaturaNota`/GENUS.FATURANOTA (lado de contas
    a receber).

    Reconhece a estrutura completa da tabela FATURANOTAPAGAR do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Financeiro (Tier 2) deste
    ERP, seguindo o mesmo precedente estabelecido para `FaturaNota`,
    `FixoPagar`/GENUS.FIXOPAGAR e `Comissao`/GENUS.COMISSAO.

    Diferente de FATURANOTA (uma tabela de junção pura com apenas 3 colunas),
    FATURANOTAPAGAR espelha praticamente todos os campos de PAGAR (já
    reconhecida neste ERP como `ContaPagar`) — CODEMPRESA, CODIGO, TIPODOC,
    DOC, SERIE, CODFORNECEDOR, EMISSAO, VENCIMEN, VALOR, PARCELA, DTPAGO,
    VALORPAGO, CODCONTA, CODHISTORICO, OBS, CODEMPRESAPAG, DUPLICATA,
    CODALTERACAO, HORAALTERACAO, DATAALTERACAO, LINHADIGITAVEL, PREVISAO,
    CODCONTROLE, CODCONTROLEEMPRESA, CODCONTROLETIPO, NUMDOC,
    VALORDOCUMENTO, CONTACHEQUE, DOCCHEQUE, CODFRETE, PARCREAL,
    CODEMPRESAENTRADA, DOCPARCELA, CODCARTEIRA, CODFIXO,
    VALORCREDITOFORNECEDOR e CODFATURAPAGAR — mais um segundo grupo de
    colunas que não existe em PAGAR:
    - TIPODOCENTRADA / DOCENTRADA / SERIEENTRADA / CODFORNECEDORENTRADA:
      identificam a nota fiscal de compra/entrada (documento, série, tipo de
      documento e fornecedor de origem) que efetivamente compõe a fatura a
      pagar — é este cluster que caracteriza o vínculo "fatura a pagar <->
      nota(s) fiscal(is) de entrada" descrito no nome da tabela;
    - CODPAGAR / CODEMPRESAPAGAR: apontam de volta para o título original em
      PAGAR (CODEMPRESA + CODIGO de `ContaPagar`) que esta linha representa
      dentro do agrupamento da fatura;
    - CODFATURAPAGAR_ANT / CODEMPRESAFAT_ANT: referenciam a fatura a pagar
      anterior, para quando o boleto/fatura é reemitido ou substituído,
      preservando o histórico da reemissão.

    CODFATURAPAGAR é chave estrangeira, no GENUS, para a tabela mestre
    FATURAPAGAR — o agrupamento de título(s) a pagar num boleto/pagamento
    só, análoga a FATURA no lado de contas a receber, agora reconhecida
    neste ERP como `FaturaPagar` (ver classe abaixo, criada junto com esta
    atualização). Por isso `fatura_pagar_id` (FK própria para `FaturaPagar`)
    é criado aqui, seguindo exatamente o mesmo padrão de `conta_pagar_id`
    acima e de `FaturaNota.fatura_id`: resolvível relacionando
    (GENUS.FATURANOTAPAGAR.CODEMPRESA, GENUS.FATURANOTAPAGAR.CODFATURAPAGAR)
    com (`FaturaPagar.cod_empresa`, `FaturaPagar.codigo`) — tarefa do agente
    de migração de dados, não deste agente de estrutura. `cod_fatura_pagar`
    continua preservado à parte como código bruto (mirror), para não perder
    informação até que essa resolução aconteça.

    CODFATURAPAGAR_ANT/CODEMPRESAFAT_ANT (a fatura a pagar anterior, para
    quando o boleto é reemitido/substituído) também apontam, em espírito,
    para essa mesma tabela mestre FATURAPAGAR — mas propositalmente não
    ganham uma FK própria nesta atualização (permanecem como códigos brutos
    `cod_fatura_pagar_ant`/`cod_empresa_fat_ant`), pois representam uma
    relação semântica distinta da linha atual (a fatura reemitida, não a
    fatura vigente) e resolvê-la está fora do escopo desta tarefa — pode ser
    feito no futuro seguindo exatamente o mesmo padrão de `fatura_pagar_id`.

    CODPAGAR (junto com CODEMPRESAPAGAR) já é resolvível contra `ContaPagar`
    (GENUS.PAGAR, já reconhecida neste ERP) através da chave natural
    (`ContaPagar.cod_empresa`, `ContaPagar.codigo`) — por isso `conta_pagar_id`
    (FK própria para `ContaPagar`) é criada aqui, seguindo exatamente o mesmo
    padrão de `FaturaNota.saida_id` (FK própria resolvível quando a tabela
    referenciada já está reconhecida neste ERP). Essa FK só pode ser
    resolvida de fato relacionando (GENUS.FATURANOTAPAGAR.CODEMPRESAPAGAR,
    GENUS.FATURANOTAPAGAR.CODPAGAR) com (`ContaPagar.cod_empresa`,
    `ContaPagar.codigo`) — tarefa do agente de migração de dados, não deste
    agente de estrutura. Por isso `conta_pagar_id` é opcional (nullable) e os
    códigos brutos originais (`cod_pagar`, `cod_empresa_pagar`) são
    preservados à parte, para não perder informação até que essa resolução
    aconteça.

    Os demais códigos que se repetem de PAGAR (CODFORNECEDOR, CODCONTA,
    CODHISTORICO, CODCARTEIRA, CODFRETE, CODFIXO, CONTACHEQUE/DOCCHEQUE,
    CODFORNECEDORENTRADA etc.) apontam para tabelas legadas ainda não
    plenamente resolvíveis a partir daqui, ou para tabelas mestras já
    reconhecidas mas cuja FK própria não foi criada — propositalmente
    mantidos como códigos brutos (`cod_*`), sem FK própria, apenas para não
    perder informação (mesmo critério documentado em `ContaPagar` para os
    mesmos campos herdados de GENUS.PAGAR).

    FATURANOTAPAGAR tem chave primária própria no GENUS (CODEMPRESA +
    CODIGO). Ainda assim, seguindo o mesmo critério já usado para as demais
    tabelas do GENUS reconhecidas neste ERP (nenhuma linha foi importada
    ainda), essa chave não é reaproveitada como PK deste ERP — o `id` serial
    é a única chave própria deste model, e os campos originais são
    preservados como códigos brutos (`cod_empresa`, `codigo`), indexados,
    mesmo assim mantidos nullable aqui, seguindo o padrão deste ERP de nunca
    exigir (`nullable=False`) um campo puramente estrutural ainda não
    populado por nenhuma importação de dados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "faturas_nota_pagar"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o título a pagar já migrado neste ERP ─────────────────
    conta_pagar_id = Column(Integer, ForeignKey("contas_pagar.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESAPAGAR, CODPAGAR) -> (ContaPagar.cod_empresa, ContaPagar.codigo)
    conta_pagar = relationship("ContaPagar", back_populates="faturas_nota_pagar_vinculadas")

    # ── Vínculo com a fatura a pagar já migrada neste ERP (ver model FaturaPagar) ─
    fatura_pagar_id = Column(Integer, ForeignKey("faturas_pagar.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODFATURAPAGAR) -> (FaturaPagar.cod_empresa, FaturaPagar.codigo)
    fatura_pagar = relationship("FaturaPagar", back_populates="notas_vinculadas")

    # ── Identificação própria da linha em GENUS.FATURANOTAPAGAR (PK original: CODEMPRESA + CODIGO) ─
    cod_empresa = Column(Integer, nullable=True, index=True)          # GENUS: CODEMPRESA
    codigo = Column(Integer, nullable=True, index=True)               # GENUS: CODIGO (PK original no GENUS, junto com CODEMPRESA)

    # ── Campos espelhados de GENUS.PAGAR (título a pagar original) ────────
    tipo_doc = Column(String(1), nullable=True)                       # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                               # GENUS: DOC
    serie = Column(String(4), nullable=True)                          # GENUS: SERIE
    cod_fornecedor = Column(Integer, nullable=True)                   # GENUS: CODFORNECEDOR (FK -> CADASTRO/FORNECEDOR, sem FK própria aqui)
    emissao = Column(DateTime, nullable=True)                        # GENUS: EMISSAO
    vencimento = Column(DateTime, nullable=True)                     # GENUS: VENCIMEN
    valor = Column(Float, nullable=True)                              # GENUS: VALOR
    parcela = Column(String(7), nullable=True)                       # GENUS: PARCELA
    dt_pago = Column(DateTime, nullable=True)                        # GENUS: DTPAGO
    valor_pago = Column(Float, nullable=True)                        # GENUS: VALORPAGO
    cod_conta = Column(Integer, nullable=True)                       # GENUS: CODCONTA (FK -> PLANOCONTA)
    cod_historico = Column(String(12), nullable=True)                # GENUS: CODHISTORICO (FK -> HISTORICO.CODIGO, ver Historico)
    obs = Column(String(70), nullable=True)                          # GENUS: OBS
    cod_empresa_pag = Column(Integer, nullable=True)                 # GENUS: CODEMPRESAPAG
    duplicata = Column(String(15), nullable=True)                    # GENUS: DUPLICATA

    # Auditoria de origem (GENUS)
    cod_alteracao = Column(Integer, nullable=True)                   # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)          # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)           # GENUS: DATAALTERACAO

    # Boleto / controle
    linha_digitavel = Column(String(60), nullable=True)              # GENUS: LINHADIGITAVEL
    previsao = Column(String(1), nullable=True)                      # GENUS: PREVISAO
    cod_controle = Column(Integer, nullable=True)                    # GENUS: CODCONTROLE
    cod_controle_empresa = Column(Integer, nullable=True)            # GENUS: CODCONTROLEEMPRESA
    cod_controle_tipo = Column(String(1), nullable=True)             # GENUS: CODCONTROLETIPO
    num_doc = Column(String(20), nullable=True)                      # GENUS: NUMDOC
    valor_documento = Column(Float, nullable=True)                   # GENUS: VALORDOCUMENTO
    conta_cheque = Column(Integer, nullable=True)                    # GENUS: CONTACHEQUE
    doc_cheque = Column(Integer, nullable=True)                      # GENUS: DOCCHEQUE
    cod_frete = Column(Integer, nullable=True)                       # GENUS: CODFRETE
    parc_real = Column(String(1), nullable=True)                     # GENUS: PARCREAL
    cod_empresa_entrada = Column(Integer, nullable=True)             # GENUS: CODEMPRESAENTRADA
    doc_parcela = Column(String(15), nullable=True)                  # GENUS: DOCPARCELA
    cod_carteira = Column(Integer, nullable=True)                    # GENUS: CODCARTEIRA
    cod_fixo = Column(Integer, nullable=True)                        # GENUS: CODFIXO
    valor_credito_fornecedor = Column(Float, nullable=True)          # GENUS: VALORCREDITOFORNECEDOR

    # ── Vínculo com a fatura a pagar (GENUS.FATURAPAGAR, agora modelada como FaturaPagar — ver fatura_pagar_id acima) ─
    cod_fatura_pagar = Column(Integer, nullable=True, index=True)     # GENUS: CODFATURAPAGAR (mirror bruto; ver fatura_pagar_id acima para a FK própria, já resolvível agora que FATURAPAGAR está modelada como FaturaPagar)
    cod_fatura_pagar_ant = Column(Integer, nullable=True)             # GENUS: CODFATURAPAGAR_ANT (fatura a pagar anterior, em caso de reemissão; aponta em espírito para FaturaPagar também, mas propositalmente sem FK própria nesta atualização — fora do escopo desta tarefa)
    cod_empresa_fat_ant = Column(Integer, nullable=True)              # GENUS: CODEMPRESAFAT_ANT

    # ── Vínculo com a nota fiscal de compra/entrada de origem (ainda não modelada neste ERP) ─
    tipo_doc_entrada = Column(String(1), nullable=True)               # GENUS: TIPODOCENTRADA
    doc_entrada = Column(Integer, nullable=True)                      # GENUS: DOCENTRADA
    serie_entrada = Column(String(4), nullable=True)                  # GENUS: SERIEENTRADA
    cod_fornecedor_entrada = Column(Integer, nullable=True)           # GENUS: CODFORNECEDORENTRADA

    # ── Vínculo de volta com o título original em PAGAR (ver conta_pagar_id acima) ─
    cod_pagar = Column(Integer, nullable=True, index=True)            # GENUS: CODPAGAR (mirror bruto; ver conta_pagar_id)
    cod_empresa_pagar = Column(Integer, nullable=True)                # GENUS: CODEMPRESAPAGAR (mirror bruto; ver conta_pagar_id)


class Fatura(Base):
    """Fatura — cabeçalho do agrupamento de título(s)/nota(s) fiscal(is) de
    saída faturados para um cliente, no lado de contas a receber
    (GENUS.FATURA) — módulo Financeiro (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela FATURA do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `FaturaNota`/GENUS.FATURANOTA, `FaturaNotaPagar`/GENUS.FATURANOTAPAGAR,
    `FixoPagar`/GENUS.FIXOPAGAR e `Comissao`/GENUS.COMISSAO. Todos os 6
    campos, a chave primária composta e as 4 foreign keys foram conferidos
    diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$INDEX_SEGMENTS),
    sem ler nenhuma linha de dado de negócio:
    - CODEMPRESA: SMALLINT (RDB$FIELD_TYPE 7), NOT NULL -> Integer.
    - CODIGO: INTEGER (RDB$FIELD_TYPE 8), NOT NULL -> Integer.
    - EMISSAO: DATE (RDB$FIELD_TYPE 12) -> DateTime (mesmo tratamento já
      dado a EMISSAO em `ContaPagar`/`ContaReceber`/`FaturaNotaPagar`,
      todas DateTime, mesmo quando a coluna original do GENUS é um DATE
      puro, sem componente de hora).
    - CODCONDPAGTO: CHAR(5) (RDB$FIELD_TYPE 14, comprimento 5) -> String(5).
    - CODCADASTRO: INTEGER, NOT NULL -> Integer.
    - CODCARTEIRA: INTEGER, nullable -> Integer.

    No GENUS, FATURA é exatamente a tabela mestre já antecipada na docstring
    de `FaturaNota` (ver `FaturaNota.cod_fatura`/`FaturaNota.fatura_id`): o
    agrupamento de uma ou mais notas fiscais de saída (via FATURANOTA) num
    único boleto/fatura para um cliente — CODCONDPAGTO é a condição de
    pagamento acordada para aquela fatura, CODCADASTRO é o sacado/cliente (o
    CADASTRO que vai pagar) e CODCARTEIRA é a carteira de cobrança usada.

    Chave primária composta no GENUS: `PK_FATURA` = (CODEMPRESA, CODIGO) —
    confirmado via metadados, e é exatamente a chave referenciada por
    `FK_FATURANOTA_FATURA: (CODEMPRESA, CODFATURA) -> PK_FATURA`, já citada
    na docstring de `FaturaNota`. Seguindo o mesmo critério já usado para as
    demais tabelas do GENUS reconhecidas neste ERP (nenhuma linha foi
    importada ainda), essa chave composta não é reaproveitada como PK deste
    ERP — o `id` serial é a única chave própria deste model, e os 2 campos
    originais são preservados como códigos brutos (`cod_empresa`, `codigo`),
    indexados, mesmo assim mantidos nullable aqui, seguindo o padrão deste
    ERP de nunca exigir (`nullable=False`) um campo puramente estrutural
    ainda não populado por nenhuma importação de dados.

    Foreign keys confirmadas no GENUS (RDB$RELATION_CONSTRAINTS):
    - `FK_FATURA_EMPRESA`: CODEMPRESA -> EMPRESA. Mantido como código bruto
      (`cod_empresa`), sem FK própria — mesmo critério já usado em todas as
      outras tabelas GENUS reconhecidas neste ERP para CODEMPRESA (ex.:
      `FixoPagar.cod_empresa`, `TabelaPreco.cod_empresa`), pois `Empresa`
      deste ERP ainda não guarda o código bruto GENUS.EMPRESA.CODIGO de
      forma resolvível a partir daqui.
    - `FK_FATURA_CONDPAGTO`: CODCONDPAGTO -> CONDPAGTO, já reconhecida
      neste ERP como `FormaPagamento` (`FormaPagamento.codigo`, também
      String(5) — ver `migrate_add_condpagto_fields.py`). Mantido como
      código bruto (`cod_cond_pagto`), sem FK própria — mesmo critério já
      usado para o mesmíssimo campo em `ClienteCompleto`, `Fornecedor`,
      `PedidoVenda`, `Saida` etc. (todos `cod_cond_pagto`, sem FK própria).
    - `FK_FATURA_CADASTRO`: CODCADASTRO -> CADASTRO, já reconhecida neste
      ERP como `CadastroPessoa` — o sacado/cliente da fatura. Mantido como
      código bruto (`cod_cadastro`), sem FK própria — mesmo critério já
      usado em `FixoPagar.cod_cadastro`, `ClienteCompleto.cod_cadastro` e
      `Fornecedor.cod_cadastro`: resolver o sacado completo exige o JOIN
      entre FATURA (este campo) e CADASTRO via CODCADASTRO, quando os dados
      forem migrados de fato — tarefa do agente de migração, não deste
      agente de estrutura.
    - `FK_FATURA_CARTEIRA`: CODCARTEIRA -> CARTEIRA, ainda não modelada
      neste ERP (mesmo critério já usado para CODCARTEIRA em `ContaPagar`,
      `ContaReceber`, `FixoPagar`, `FaturaNotaPagar` etc. — mantido como
      código bruto `cod_carteira`, sem FK própria).

    `CODIGO` (o código original da fatura no GENUS) é a peça que, junto com
    CODEMPRESA, permite resolver `FaturaNota.cod_fatura` -> `Fatura.id` (via
    `FaturaNota.fatura_id`, criado no momento em que este model passou a
    existir — ver `FaturaNota.fatura_id` e o comentário atualizado em
    `FaturaNota.cod_fatura`), no futuro, quando os dados forem migrados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "faturas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.FATURA (PK composta no GENUS: CODEMPRESA + CODIGO) ─
    cod_empresa = Column(Integer, nullable=True, index=True)      # GENUS: CODEMPRESA (parte da PK_FATURA e da FK_FATURA_EMPRESA -> EMPRESA)
    codigo = Column(Integer, nullable=True, index=True)           # GENUS: CODIGO (parte da PK_FATURA; é o CODFATURA referenciado por FaturaNota.cod_fatura/fatura_id)
    emissao = Column(DateTime, nullable=True)                     # GENUS: EMISSAO
    cod_cond_pagto = Column(String(5), nullable=True)             # GENUS: CODCONDPAGTO (FK_FATURA_CONDPAGTO -> CONDPAGTO, já reconhecida neste ERP como FormaPagamento.codigo; mirror bruto sem FK própria)
    cod_cadastro = Column(Integer, nullable=True, index=True)     # GENUS: CODCADASTRO (sacado/cliente; FK_FATURA_CADASTRO -> CADASTRO, já reconhecida neste ERP como CadastroPessoa; mirror bruto sem FK própria)
    cod_carteira = Column(Integer, nullable=True)                 # GENUS: CODCARTEIRA (FK_FATURA_CARTEIRA -> CARTEIRA, ainda não modelada neste ERP)

    notas_vinculadas = relationship("FaturaNota", back_populates="fatura", cascade="all, delete-orphan")


class FaturaPagar(Base):
    """FaturaPagar — cabeçalho do agrupamento de título(s)/nota(s) fiscal(is)
    de compra (entrada) faturados para um fornecedor, no lado de contas a
    pagar (GENUS.FATURAPAGAR) — módulo Financeiro (Tier 2) deste ERP, análoga
    a `Fatura`/GENUS.FATURA (lado de contas a receber).

    Reconhece a estrutura completa da tabela FATURAPAGAR do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Fatura`/GENUS.FATURA, `FaturaNotaPagar`/GENUS.FATURANOTAPAGAR,
    `FixoPagar`/GENUS.FIXOPAGAR e `Comissao`/GENUS.COMISSAO. Os 6 campos
    compartilhados com FATURA (CODEMPRESA, CODIGO, EMISSAO, CODCONDPAGTO,
    CODCADASTRO, CODCARTEIRA) usam exatamente os mesmos tipos já conferidos
    diretamente no schema Firebird do GENUS para `Fatura` (ver docstring da
    classe acima): CODEMPRESA SMALLINT (RDB$FIELD_TYPE 7) -> Integer, CODIGO
    INTEGER (RDB$FIELD_TYPE 8) -> Integer, EMISSAO DATE (RDB$FIELD_TYPE 12)
    -> DateTime, CODCONDPAGTO CHAR(5) (RDB$FIELD_TYPE 14) -> String(5),
    CODCADASTRO INTEGER -> Integer, CODCARTEIRA INTEGER -> Integer. Os 3
    campos que só existem em FATURAPAGAR (sem equivalente em FATURA) seguem
    a mesma convenção de tipos já usada em campos análogos de outras tabelas
    GENUS já reconhecidas neste ERP:
    - DOC: INTEGER -> Integer (mesmo tratamento de `FaturaNotaPagar.doc`,
      também um número de documento).
    - DATABASE: DATE -> DateTime (mesmo tratamento dado a EMISSAO/VENCIMEN em
      `ContaPagar`/`ContaReceber`/`Fatura`, sempre DateTime mesmo quando a
      coluna original do GENUS é um DATE puro; no GENUS, DATABASE é a
      "data-base" usada para calcular vencimento/desconto do boleto
      agrupado — daqui o nome de coluna `data_base`, para não colidir com a
      palavra reservada `database`).
    - OBS: texto -> Text (mesmo tratamento de `Produto.observacao`, texto
      livre sem limite de tamanho definido).

    No GENUS, FATURAPAGAR é o análogo, no lado de contas a pagar, da tabela
    mestre `Fatura`/GENUS.FATURA já reconhecida neste ERP: o agrupamento de
    um ou mais títulos/notas fiscais de compra (entrada) num único
    boleto/pagamento para um fornecedor, via FATURANOTAPAGAR (já reconhecida
    neste ERP como `FaturaNotaPagar` — ver `FaturaNotaPagar.cod_fatura_pagar`
    /`FaturaNotaPagar.fatura_pagar_id`, resolvido nesta mesma atualização) —
    CODCONDPAGTO é a condição de pagamento acordada para aquela fatura,
    CODCADASTRO é o fornecedor/credor (o CADASTRO que vai receber o
    pagamento) e CODCARTEIRA é a carteira usada.

    CODCADASTRO é chave estrangeira, no GENUS, para a tabela mestre de
    identidade CADASTRO (já reconhecida neste ERP como `CadastroPessoa`) —
    propositalmente não criamos uma FK própria aqui (mesmo padrão usado em
    `Fatura.cod_cadastro`, `FixoPagar.cod_cadastro` e
    `Fornecedor.cod_cadastro`) — apenas reconhecemos o campo bruto do GENUS
    (`cod_cadastro`); resolver o fornecedor/credor completo, quando os dados
    forem migrados de fato, exige o JOIN entre FATURAPAGAR (este campo) e
    CADASTRO via CODCADASTRO — tarefa do agente de migração de dados, não
    deste agente de estrutura.

    Os demais códigos (CODEMPRESA -> EMPRESA, CODCONDPAGTO -> CONDPAGTO já
    reconhecida neste ERP como `FormaPagamento`, CODCARTEIRA -> CARTEIRA
    ainda não modelada) seguem exatamente o mesmo critério já documentado em
    `Fatura` para os mesmos campos — mantidos como códigos brutos (`cod_*`),
    sem FK própria.

    FATURAPAGAR tem chave primária composta no GENUS: (CODEMPRESA, CODIGO) —
    mesmo formato de `PK_FATURA`, e é exatamente a chave referenciada pela FK
    de `FaturaNotaPagar.cod_fatura_pagar` (via CODEMPRESA + CODFATURAPAGAR ->
    CODEMPRESA + CODIGO desta tabela). Seguindo o mesmo critério já usado
    para as demais tabelas do GENUS reconhecidas neste ERP (nenhuma linha foi
    importada ainda), essa chave composta não é reaproveitada como PK deste
    ERP — o `id` serial é a única chave própria deste model, e os 2 campos
    originais são preservados como códigos brutos (`cod_empresa`, `codigo`),
    indexados, mesmo assim mantidos nullable aqui, seguindo o padrão deste
    ERP de nunca exigir (`nullable=False`) um campo puramente estrutural
    ainda não populado por nenhuma importação de dados.

    `CODIGO` (o código original da fatura a pagar no GENUS) é a peça que,
    junto com CODEMPRESA, permite resolver `FaturaNotaPagar.cod_fatura_pagar`
    -> `FaturaPagar.id` (via `FaturaNotaPagar.fatura_pagar_id`, criado no
    momento em que este model passou a existir), no futuro, quando os dados
    forem migrados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "faturas_pagar"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.FATURAPAGAR (PK composta no GENUS: CODEMPRESA + CODIGO) ─
    cod_empresa = Column(Integer, nullable=True, index=True)      # GENUS: CODEMPRESA (parte da PK_FATURAPAGAR e da FK -> EMPRESA)
    codigo = Column(Integer, nullable=True, index=True)           # GENUS: CODIGO (parte da PK_FATURAPAGAR; é o CODFATURAPAGAR referenciado por FaturaNotaPagar.cod_fatura_pagar/fatura_pagar_id)
    doc = Column(Integer, nullable=True)                          # GENUS: DOC (número do documento/boleto da fatura agrupada)
    emissao = Column(DateTime, nullable=True)                     # GENUS: EMISSAO
    cod_cond_pagto = Column(String(5), nullable=True)             # GENUS: CODCONDPAGTO (FK -> CONDPAGTO, já reconhecida neste ERP como FormaPagamento.codigo; mirror bruto sem FK própria)
    cod_cadastro = Column(Integer, nullable=True, index=True)     # GENUS: CODCADASTRO (fornecedor/credor; FK -> CADASTRO, já reconhecida neste ERP como CadastroPessoa; mirror bruto sem FK própria)
    cod_carteira = Column(Integer, nullable=True)                 # GENUS: CODCARTEIRA (FK -> CARTEIRA, ainda não modelada neste ERP)
    data_base = Column(DateTime, nullable=True)                   # GENUS: DATABASE (data-base p/ cálculo de vencimento/desconto do boleto agrupado; renomeado p/ evitar a palavra reservada `database`)
    obs = Column(Text, nullable=True)                             # GENUS: OBS

    notas_vinculadas = relationship("FaturaNotaPagar", back_populates="fatura_pagar", cascade="all, delete-orphan")


class ChequeEmitido(Base):
    """Cheque próprio emitido pela empresa para pagar um fornecedor/título
    (GENUS.CHEQUE_EMITIDO) — módulo Financeiro (Tier 2) deste ERP.

    É o contraponto, no lado de contas a pagar, de GENUS.CHEQUE (cheque de
    terceiro recebido de um cliente — ainda não modelado neste ERP, fora do
    escopo desta atualização). Enquanto CHEQUE guarda os dados bancários
    completos do cheque de terceiros (BANCO, AGENCIA, CONTA, CNPJ/SACADO
    etc.), CHEQUE_EMITIDO é mais enxuto: identifica apenas a conta bancária
    própria da empresa (CODCONTAS) e o número do cheque (CHEQUE) — os dados
    da conta em si (banco, agência etc.) ficam em outra tabela, não
    reproduzidos aqui.

    Reconhece a estrutura completa da tabela CHEQUE_EMITIDO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — nomes e tipos conferidos
    diretamente no schema Firebird (RDB$RELATION_FIELDS,
    RDB$RELATION_CONSTRAINTS, RDB$REF_CONSTRAINTS e RDB$INDEX_SEGMENTS, sem
    ler nenhuma linha de dado de negócio):
    - CODEMPRESA: SMALLINT (RDB$FIELD_TYPE 7) -> Integer. NOT NULL no GENUS;
      mantido nullable aqui, seguindo o padrão deste ERP de nunca exigir um
      campo estrutural ainda não populado por nenhuma importação de dados.
      FK_CHEQUE_EMITIDO_EMPRESA -> EMPRESA (já reconhecida neste ERP como
      `Empresa`) — mantido como código bruto (`cod_empresa`), sem FK própria,
      mesmo critério já usado em `FixoPagar.cod_empresa`,
      `Comissao.cod_empresa`, `FaturaPagar.cod_empresa` etc.
    - CODCONTAS: SMALLINT -> Integer. Parte da chave primária composta
      PK_CHEQUE_EMITIDO (CODCONTAS + CHEQUE) — identifica a conta bancária
      própria da empresa da qual o cheque foi emitido. Sem FK própria
      declarada no GENUS para esta coluna (nenhuma FK_CHEQUE_EMITIDO_CONTA
      existe no schema) — mantida como código bruto (`cod_contas`), mesmo
      critério já aplicado a CODCONTA/CODCONTAS em `ContaPagar`,
      `ContaReceber` e `FixoPagar` (também sem FK própria).
    - CHEQUE: INTEGER (RDB$FIELD_TYPE 8) -> Integer. Parte da chave primária
      composta PK_CHEQUE_EMITIDO junto com CODCONTAS — é exatamente o par
      (CODCONTAS, CHEQUE) referenciado por `ContaPagar.conta_cheque`
      (GENUS: CONTACHEQUE) e `ContaPagar.doc_cheque` (GENUS: DOCCHEQUE)
      quando um título a pagar foi quitado com um cheque emitido, em vez de
      outra forma de pagamento — ver também os campos espelhados
      `FaturaNotaPagar.conta_cheque`/`FaturaNotaPagar.doc_cheque`. Essa
      referência reversa (CONTACHEQUE/DOCCHEQUE -> CODCONTAS/CHEQUE desta
      tabela) não ganha uma FK própria nesta atualização — resolvê-la
      exigiria casar um par de colunas contra outro par (não contra um `id`
      serial único), fora do escopo desta tarefa estrutural.
    - VALOR: NUMERIC(15,2) (RDB$FIELD_TYPE 16, sub_type 1, scale -2) ->
      Float, mesmo tratamento dado a todo campo monetário já reconhecido
      neste ERP (`ContaPagar.valor`, `FixoPagar.valor` etc.).
    - PARA, DEVOLVE, DTBAIXA, DIGITADO, DATAALTERACAO, EMISSAO: DATE
      (RDB$FIELD_TYPE 12) -> DateTime, mesmo tratamento dado a toda data
      pura do GENUS já reconhecida neste ERP. PARA (a data "para" a qual o
      cheque foi emitido/pré-datado) tem índice próprio no GENUS
      (IDX_CHEQUE_EMITIDO) — replicado aqui via `index=True`.
    - OBS: BLOB texto (RDB$FIELD_TYPE 261, sub_type 1) -> Text, mesmo
      tratamento de `Produto.observacao`/`FaturaPagar.obs`.
    - CODPAGAR: INTEGER -> Integer. Junto com CODEMPRESA, é exatamente o par
      referenciado pela constraint FK_CHEQUE_EMITIDO_RECEBE -> PK_PAGAR
      (CODEMPRESA + CODIGO) — o título a pagar (já reconhecido neste ERP
      como `ContaPagar`) que este cheque emitido quita. Por isso
      `conta_pagar_id` (FK própria para `ContaPagar`) é criado aqui, seguindo
      exatamente o mesmo padrão de `FaturaNotaPagar.conta_pagar_id`:
      resolvível relacionando (GENUS.CHEQUE_EMITIDO.CODEMPRESA,
      GENUS.CHEQUE_EMITIDO.CODPAGAR) com (`ContaPagar.cod_empresa`,
      `ContaPagar.codigo`) — tarefa do agente de migração de dados, não deste
      agente de estrutura. `cod_pagar` continua preservado à parte como
      código bruto (mirror), para não perder informação até que essa
      resolução aconteça.
    - CODHISTORICO: VARCHAR(12) (RDB$FIELD_TYPE 37) -> String(12).
      FK_CHEQUE_EMITIDO_HISTORICO -> HISTORICO (já reconhecida neste ERP como
      `Historico`) — mantido como código bruto (`cod_historico`), sem FK
      própria, mesmo critério já usado em `ContaPagar.cod_historico`,
      `FixoPagar.cod_historico` etc.
    - NOMINAL: VARCHAR(30) -> String(30) — nome do favorecido/beneficiário
      impresso no cheque (não necessariamente o mesmo cadastro do credor do
      título, por isso é texto livre e não um código).
    - CODALTERACAO / HORAALTERACAO / DATAALTERACAO: trio padrão de
      auditoria de origem já usado em todas as demais tabelas GENUS
      reconhecidas neste ERP (INTEGER / CHAR(8) / DATE -> Integer /
      String(8) / DateTime).
    - CODEMPRESAPAGAR: INTEGER -> Integer. Apesar do nome sugerir que, junto
      com CODPAGAR, formaria o par usado para localizar o título em PAGAR
      (mesmo padrão de `FaturaNotaPagar.cod_empresa_pagar`/
      `FaturaNotaPagar.cod_pagar`), a constraint FK_CHEQUE_EMITIDO_RECEBE
      conferida no schema Firebird usa, na prática, (CODEMPRESA, CODPAGAR) —
      não (CODEMPRESAPAGAR, CODPAGAR). CODEMPRESAPAGAR é preservado aqui
      como código bruto informativo (`cod_empresa_pagar`), sem FK própria,
      por segurança, já que não é a coluna efetivamente usada pela FK
      declarada no GENUS.

    Este é o contraponto, no módulo Financeiro (Tier 2), de `ContaPagar`
    (GENUS.PAGAR) via `conta_pagar_id`/`cod_pagar` — o cheque próprio que a
    empresa emitiu para quitar um título a pagar.

    CHEQUE_EMITIDO tem chave primária composta no GENUS: (CODCONTAS, CHEQUE).
    Seguindo o mesmo critério já usado para as demais tabelas do GENUS
    reconhecidas neste ERP (nenhuma linha foi importada ainda), essa chave
    composta não é reaproveitada como PK deste ERP — o `id` serial é a única
    chave própria deste model, e os 2 campos originais são preservados como
    códigos brutos (`cod_contas`, `cheque`), indexados, mesmo assim mantidos
    nullable aqui, seguindo o padrão deste ERP de nunca exigir
    (`nullable=False`) um campo puramente estrutural ainda não populado por
    nenhuma importação de dados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cheques_emitidos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o título a pagar já migrado neste ERP (ver docstring acima) ─
    conta_pagar_id = Column(Integer, ForeignKey("contas_pagar.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODPAGAR) -> (ContaPagar.cod_empresa, ContaPagar.codigo), via FK_CHEQUE_EMITIDO_RECEBE
    conta_pagar = relationship("ContaPagar", back_populates="cheques_emitidos_vinculados")

    # ── Campos migrados de GENUS.CHEQUE_EMITIDO (PK composta no GENUS: CODCONTAS + CHEQUE) ─
    cod_empresa = Column(Integer, nullable=True, index=True)          # GENUS: CODEMPRESA (FK_CHEQUE_EMITIDO_EMPRESA -> EMPRESA, ver Empresa; mirror bruto sem FK própria)
    cod_contas = Column(Integer, nullable=True, index=True)           # GENUS: CODCONTAS (parte da PK_CHEQUE_EMITIDO; conta bancária própria emissora do cheque; sem FK declarada no GENUS)
    cheque = Column(Integer, nullable=True, index=True)               # GENUS: CHEQUE (parte da PK_CHEQUE_EMITIDO; número do cheque; ver ContaPagar.conta_cheque/doc_cheque)
    valor = Column(Float, nullable=True)                              # GENUS: VALOR
    para = Column(DateTime, nullable=True, index=True)                # GENUS: PARA (data para a qual o cheque foi emitido/pré-datado; IDX_CHEQUE_EMITIDO no GENUS)
    devolve = Column(DateTime, nullable=True)                         # GENUS: DEVOLVE
    dt_baixa = Column(DateTime, nullable=True)                        # GENUS: DTBAIXA
    obs = Column(Text, nullable=True)                                 # GENUS: OBS
    cod_pagar = Column(Integer, nullable=True, index=True)            # GENUS: CODPAGAR (mirror bruto; ver conta_pagar_id acima)
    digitado = Column(DateTime, nullable=True)                        # GENUS: DIGITADO
    cod_historico = Column(String(12), nullable=True)                 # GENUS: CODHISTORICO (FK -> HISTORICO.CODIGO, ver Historico; mirror bruto sem FK própria)
    nominal = Column(String(30), nullable=True)                       # GENUS: NOMINAL (favorecido/beneficiário impresso no cheque)
    cod_alteracao = Column(Integer, nullable=True)                    # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)           # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)            # GENUS: DATAALTERACAO
    emissao = Column(DateTime, nullable=True)                         # GENUS: EMISSAO
    cod_empresa_pagar = Column(Integer, nullable=True)                # GENUS: CODEMPRESAPAGAR (mirror informativo; a FK_CHEQUE_EMITIDO_RECEBE de fato usa CODEMPRESA, não esta coluna — ver docstring)


class ContaGenus(Base):
    """Conta bancária/caixa mestre do sistema legado GENUS (GENUS.CONTAS) —
    módulo Financeiro (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela CONTAS do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `Produto`/GENUS.PRODUTO, `ContaPagar`/GENUS.PAGAR, `ContaReceber`/
    GENUS.RECEBER, `FixoPagar`/GENUS.FIXOPAGAR e `ChequeEmitido`/
    GENUS.CHEQUE_EMITIDO.

    Não confundir com `ContaBancaria` (tabela `contas_bancarias`), que é o
    cadastro de conta bancária **próprio deste ERP** (usado por
    `ContaPagar.conta_bancaria`/`ContaReceber.conta_bancaria`/
    `SaldoDiarioBancario.conta_bancaria`, sem relação com o GENUS). GENUS.
    CONTAS é uma tabela legada **separada**, com seu próprio conjunto de
    colunas (nomes, tamanhos e semântica diferentes de `ContaBancaria`) —
    por isso ganha este model dedicado, em vez de expandir `ContaBancaria`.

    Tipos inferidos a partir dos códigos de tipo padrão do Firebird, mesmo
    critério já usado em todas as demais tabelas GENUS deste ERP — não foi
    possível confirmar contra a metadata Firebird ao vivo (RDB$RELATION_FIELDS
    etc.) neste ambiente de execução (sem acesso ao arquivo
    GENUS_ZANGUETTIN.FDB nem a `isql` aqui); os tipos abaixo seguem a mesma
    convenção já usada nas demais tabelas GENUS (SMALLINT/INTEGER -> Integer,
    CHAR/VARCHAR -> String(N), flags de 1 caractere -> String(1)):
    - CODIGO -> `codigo`: identificador original da conta no GENUS. Como em
      outras tabelas GENUS "mestre por empresa" já reconhecidas neste ERP
      (`ContaPagar`, `ContaReceber`, `Fatura`, `FaturaPagar`, `FixoPagar`,
      `Comissao`), é provável que a chave primária real do GENUS seja
      composta (CODEMPRESA + CODIGO) — não confirmável aqui sem a metadata
      Firebird ao vivo. Seguindo o mesmo critério já usado para as demais
      tabelas do GENUS reconhecidas neste ERP (nenhuma linha importada
      ainda), essa possível chave composta não é reaproveitada como PK
      deste ERP — o `id` serial é a única chave própria deste model, e os
      2 campos originais são preservados como códigos brutos (`codigo`,
      `cod_empresa`), indexados, mantidos nullable (padrão deste ERP de
      nunca exigir um campo estrutural ainda não populado por importação).
    - CODEMPRESA -> `cod_empresa`: FK, no GENUS, para EMPRESA (já
      reconhecida neste ERP como `Empresa`) — mantido como código bruto,
      sem FK própria, mesmo critério já usado em todas as demais tabelas
      GENUS deste ERP.
    - DESCRI -> `descricao`: nome/identificação da conta (ex.: "CAIXA",
      "BANCO DO BRASIL CC").
    - BANCO, AGENCIA, CONTA -> `banco`, `agencia`, `conta`: dados bancários
      da conta (código do banco, agência, número da conta).
    - CIDADE -> `cidade`: praça/cidade da agência.
    - TITULAR -> `titular`: nome do titular da conta.
    - PERMISSAO -> `permissao`: flag de 1 caractere (controle de acesso à
      conta no GENUS).
    - SITUACAO -> `situacao`: flag de 1 caractere (situação da conta,
      ex.: ativa/inativa).

    O `CODIGO` desta tabela (CODCONTAS) já é referenciado como código bruto
    em diversas outras tabelas GENUS reconhecidas neste ERP — confirmado por
    grep direto no código-fonte deste model (sem necessidade de acesso à
    metadata Firebird para esta parte): `ContaReceber.cod_contas`,
    `ContaReceberExcluida.cod_contas`, `LancamentoContabil.cod_contas`,
    `FixoPagar.cod_contas`, `ChequeEmitido.cod_contas`,
    `ClienteCompleto.cod_contas`, `Fornecedor.cod_contas`,
    `PedidoVenda.cod_contas`. Nenhum desses campos ganha FK própria nesta
    atualização — permanecem como códigos brutos (mirror), já que essa era
    a convenção adotada quando cada um desses models foi criado; resolvê-los
    contra `ContaGenus.codigo`/`ContaGenus.cod_empresa` é tarefa do agente
    de migração de dados, fora do escopo desta atualização estrutural (que
    toca apenas o model `ContaGenus`, sem modificar nenhum dos models
    acima). Relação intencionalmente não deixada "muda": esta docstring é o
    registro de onde CODCONTAS aparece hoje no código, para o agente de
    migração de dados não precisar redescobrir isso do zero.

    Importante — não confundir com `ContaPagar.cod_conta`/
    `ContaPagarExcluida.cod_conta`/`FaturaNotaPagar.cod_conta` (GENUS:
    CODCONTA, singular, sem "S"): esse é um campo **diferente**, já
    documentado no código-fonte desses models como referência a PLANOCONTA
    (plano de contas contábil), não a esta tabela CONTAS. Essa distinção
    (CODCONTA x CODCONTAS) já existia no código antes desta atualização e
    não foi alterada aqui.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "contas_genus"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CONTAS ───────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)          # GENUS: CODIGO (PK original no GENUS; referenciado como cod_contas em várias outras tabelas — ver docstring)
    cod_empresa = Column(Integer, nullable=True, index=True)     # GENUS: CODEMPRESA (FK -> EMPRESA, ver Empresa; mirror bruto sem FK própria)
    descricao = Column(String(35), nullable=True)                # GENUS: DESCRI
    banco = Column(String(3), nullable=True)                     # GENUS: BANCO
    agencia = Column(String(4), nullable=True)                   # GENUS: AGENCIA
    conta = Column(String(15), nullable=True)                    # GENUS: CONTA
    cidade = Column(String(30), nullable=True)                   # GENUS: CIDADE
    titular = Column(String(30), nullable=True)                  # GENUS: TITULAR
    permissao = Column(String(1), nullable=True)                 # GENUS: PERMISSAO
    situacao = Column(String(1), nullable=True)                  # GENUS: SITUACAO


class SaldoDiarioBancario(Base):
    """Saldo real de cada conta bancária por dia, extraído das planilhas Excel.
    Usado como fonte de verdade para o fluxo financeiro histórico.
    """
    __tablename__ = "saldos_diarios_bancarios"
    id = Column(Integer, primary_key=True, index=True)
    conta_bancaria_id = Column(Integer, ForeignKey("contas_bancarias.id"), nullable=False)
    data = Column(DateTime, nullable=False, index=True)
    saldo = Column(Float, nullable=False)
    coluna_excel = Column(String(5), nullable=True)  # F, J, N, Q

    conta_bancaria = relationship("ContaBancaria")


# ── Novos modelos — Fase 1 e Fase 2 ──────────────────────────────────────────

class UnidadeMedida(Base):
    __tablename__ = "unidades_medida"
    id = Column(Integer, primary_key=True, index=True)
    sigla = Column(String(10), nullable=False, unique=True)   # UN, KG, CX, L, M2
    descricao = Column(String(100), nullable=False)


class GrupoProduto(Base):
    """Grupo/subgrupo/categoria de produto.

    Além dos campos originais do ERP, esta tabela reconhece todos os campos
    da tabela GRUPO do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), para
    permitir importar o cadastro de grupos sem perda de informação. Nomes e
    tipos foram conferidos contra o schema Firebird do GENUS, seguindo o
    mesmo precedente estabelecido para `Produto`/GENUS.PRODUTO.

    O campo original `nome` já corresponde, em significado, ao campo DESCRI
    do GENUS (mesmo padrão usado em `Produto.nome` <- GENUS.PRODUTO.DESCRI),
    por isso não foi duplicado — apenas anotado com o comentário abaixo.
    `tipo` (grupo | subgrupo | categoria) é um campo próprio do ERP, sem
    correspondente direto em GENUS.GRUPO (que é uma tabela plana).

    `PRODUTO.cod_grupo` (ver `Produto` acima) hoje é um código bruto do
    GENUS ainda não resolvido contra nenhuma tabela própria deste ERP; o
    campo `codigo` abaixo (GENUS: CODIGO) é a peça que permitiria, no
    futuro, resolver essa referência (PRODUTO.CODGRUPO -> GRUPO.CODIGO).
    Propositalmente não criamos essa FK agora — apenas reconhecemos os
    campos brutos do GENUS, para não perder nenhuma informação.

    Este model também reconhece, de propósito, a estrutura completa da
    tabela SUBGRUPO do GENUS — verificada diretamente no schema Firebird via
    metadados (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS), sem ler
    nenhuma linha de dado de negócio. GENUS.SUBGRUPO é uma tabela plana e
    independente (PK_SUBGRUPO = CODIGO), com exatamente duas colunas —
    CODIGO (INTEGER) e DESCRI (VARCHAR(40)) — sem nenhuma FK para GRUPO
    (ou seja, no GENUS, subgrupo NÃO é filho de grupo; são duas tabelas
    mestras irmãs, de mesmo formato). Como esses dois campos já são
    idênticos, em forma, aos já reconhecidos `codigo`/`nome` desta classe,
    nenhuma coluna nova foi necessária para cobrir SUBGRUPO — uma linha
    desta tabela com `tipo='subgrupo'` representa um registro de
    GENUS.SUBGRUPO, do mesmo modo que uma linha com `tipo='grupo'`
    representa um registro de GENUS.GRUPO. `PRODUTO.cod_subgrupo` (ver
    `Produto` acima) é o código bruto que, no futuro, resolve contra
    `GrupoProduto.codigo` filtrado por `tipo='subgrupo'`
    (PRODUTO.CODSUBGRUPO -> SUBGRUPO.CODIGO). Os campos exclusivos de
    GENUS.GRUPO (`enviar_tablet`, `ordem`, `cod_grupo_antigo1/2`) não têm
    correspondente em SUBGRUPO — ficam `NULL` nas linhas de subgrupo.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "grupos_produto"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)   # GENUS: GRUPO.DESCRI / SUBGRUPO.DESCRI
    tipo = Column(String(20), default="grupo")   # grupo | subgrupo | categoria

    # ── Campos migrados de GENUS.GRUPO (também cobrem GENUS.SUBGRUPO, que só tem CODIGO/DESCRI) ─
    codigo = Column(Integer, nullable=True, index=True)          # GENUS: GRUPO.CODIGO / SUBGRUPO.CODIGO
    enviar_tablet = Column(String(1), nullable=True)             # GENUS: ENVIARTABLET (só existe em GRUPO)
    ordem = Column(Integer, nullable=True)                       # GENUS: ORDEM (só existe em GRUPO)
    cod_grupo_antigo1 = Column(Integer, nullable=True)           # GENUS: COD_GRUPO_ANTIGO1 (só existe em GRUPO)
    cod_grupo_antigo2 = Column(Integer, nullable=True)           # GENUS: COD_GRUPO_ANTIGO2 (só existe em GRUPO)


class Tamanho(Base):
    """Tamanho de produto (P/M/G, numeração etc.) — tabela mestre TAMANHO.

    Reconhece a estrutura completa da tabela TAMANHO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `GrupoProduto`/GENUS.GRUPO (e GENUS.SUBGRUPO), `FormaPagamento`/
    GENUS.CONDPAGTO, `RegraEstado`/GENUS.REGRASESTADO e `TabelaPreco`/
    GENUS.TABELAPRECO. Nomes e tipos foram conferidos contra o schema
    Firebird do GENUS (RDB$RELATION_FIELDS), sem ler nenhuma linha de dado
    de negócio. GENUS.TAMANHO é uma tabela plana e independente (mestre de
    tamanhos), com apenas três colunas: CODIGO, DESCRI e ORDEM.

    `PRODUTO.cod_tamanho` e `PRODUTO.cod_tamanho_produto` (ver `Produto`
    acima — GENUS: CODTAMANHO / TAMANHOPROD) hoje são códigos brutos do
    GENUS ainda não resolvidos contra nenhuma tabela própria deste ERP; o
    campo `codigo` abaixo (GENUS: CODIGO) é a peça que permitiria, no
    futuro, resolver essa referência (PRODUTO.CODTAMANHO -> TAMANHO.CODIGO).
    Propositalmente não criamos essa FK agora — apenas reconhecemos os
    campos brutos do GENUS, para não perder nenhuma informação, no mesmo
    padrão já usado para `PRODUTO.CODGRUPO -> GrupoProduto.codigo`.

    Este model não é filha de `Produto` (não tem CODPRODUTO) — é uma tabela
    auxiliar mestre solta, por isso ganha entrada própria em
    `TabelasAuxiliaresWindow` no frontend, no mesmo padrão de
    `GrupoProduto`/`FormaPagamento`/`RegraEstado`/`TabelaPreco`/`Regra`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "tamanhos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.TAMANHO ──────────────────────────────────
    codigo = Column(String(5), nullable=True, index=True)    # GENUS: CODIGO
    descricao = Column(String(40), nullable=True)             # GENUS: DESCRI
    ordem = Column(Integer, nullable=True)                    # GENUS: ORDEM


class Marca(Base):
    """Marca de produto — tabela mestre MARCA.

    Reconhece a estrutura completa da tabela MARCA do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `GrupoProduto`/GENUS.GRUPO (e GENUS.SUBGRUPO), `Tamanho`/GENUS.TAMANHO,
    `FormaPagamento`/GENUS.CONDPAGTO, `RegraEstado`/GENUS.REGRASESTADO e
    `TabelaPreco`/GENUS.TABELAPRECO. Nomes e tipos foram conferidos contra o
    schema Firebird do GENUS (RDB$RELATION_FIELDS), sem ler nenhuma linha de
    dado de negócio. GENUS.MARCA é uma tabela plana e independente (mestre de
    marcas), com apenas duas colunas: CODIGO (INTEGER) e DESCRI (VARCHAR(40)).

    `PRODUTO.cod_marca` e `DEL_PRODUTO.cod_marca` (ver `Produto` e
    `ProdutoExcluido` acima — GENUS: CODMARCA) hoje são códigos brutos do
    GENUS ainda não resolvidos contra nenhuma tabela própria deste ERP; o
    campo `codigo` abaixo (GENUS: CODIGO) é a peça que permitiria, no
    futuro, resolver essa referência (PRODUTO.CODMARCA -> MARCA.CODIGO).
    Propositalmente não criamos essa FK agora — apenas reconhecemos os
    campos brutos do GENUS, para não perder nenhuma informação, no mesmo
    padrão já usado para `PRODUTO.CODGRUPO -> GrupoProduto.codigo` e
    `PRODUTO.CODTAMANHO -> Tamanho.codigo`.

    Este model não é filha de `Produto` (não tem CODPRODUTO) — é uma tabela
    auxiliar mestre solta, por isso ganha entrada própria em
    `TabelasAuxiliaresWindow` no frontend, no mesmo padrão de
    `GrupoProduto`/`FormaPagamento`/`RegraEstado`/`TabelaPreco`/`Regra`/
    `Tamanho`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "marcas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.MARCA ────────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)     # GENUS: CODIGO
    descricao = Column(String(40), nullable=True)            # GENUS: DESCRI


class Processo(Base):
    """Processo/etapa de produção — tabela mestre PROCESSO.

    Reconhece a estrutura completa da tabela PROCESSO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Tamanho`/GENUS.TAMANHO, `Marca`/GENUS.MARCA e demais tabelas
    auxiliares mestre já reconhecidas neste ERP. GENUS.PROCESSO é uma tabela
    plana e independente (mestre de processos/etapas do roteiro de
    produção), com quatro colunas: CODIGO (INTEGER), DESCRI (VARCHAR(40)),
    MOSTRAR (CHAR(1), flag S/N) e ORDEM (INTEGER).

    Não é o mesmo model que `ProdutoProcesso`/GENUS.PRODUTOPROCESSO (tabela
    "filha" de PRODUTO que guarda, por produto, o tempo padrão/valor/ordem
    de cada etapa do seu roteiro — ver docstring de `ProdutoProcesso`
    acima). `ProdutoProcesso.cod_processo` e `ProdutoComposicao.cod_processo`
    são códigos brutos do GENUS (CODPROCESSO) ainda não resolvidos contra
    nenhuma tabela própria deste ERP; o campo `codigo` abaixo (GENUS:
    CODIGO) é a peça que permitiria, no futuro, resolver essa referência
    (PRODUTOPROCESSO.CODPROCESSO -> PROCESSO.CODIGO e
    PRODUTOCOMPOSICAO.CODPROCESSO -> PROCESSO.CODIGO). Propositalmente não
    criamos essa FK agora — apenas reconhecemos os campos brutos do GENUS,
    para não perder nenhuma informação, no mesmo padrão já usado para
    `PRODUTO.CODGRUPO -> GrupoProduto.codigo` e `PRODUTO.CODTAMANHO ->
    Tamanho.codigo`.

    Este model não é filha de `Produto` (não tem CODPRODUTO) — é uma tabela
    auxiliar mestre solta, por isso ganha entrada própria em
    `TabelasAuxiliaresWindow` no frontend, no mesmo padrão de
    `GrupoProduto`/`FormaPagamento`/`RegraEstado`/`TabelaPreco`/`Regra`/
    `Tamanho`/`Marca`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "processos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.PROCESSO ─────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)      # GENUS: CODIGO
    descricao = Column(String(40), nullable=True)             # GENUS: DESCRI
    mostrar = Column(String(1), nullable=True)                # GENUS: MOSTRAR (flag S/N)
    ordem = Column(Integer, nullable=True)                    # GENUS: ORDEM


class Classificacao(Base):
    """Classificação fiscal de produto por NCM — tabela mestre CLASSIFICACAO.

    Reconhece a estrutura completa da tabela CLASSIFICACAO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Tamanho`/GENUS.TAMANHO, `Marca`/GENUS.MARCA, `Regra`/GENUS.REGRAS,
    `TipoVenda`/GENUS.TIPOVENDA e `Historico`/GENUS.HISTORICO. Nomes e tipos
    foram conferidos ao vivo contra o schema Firebird do GENUS via metadata
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS,
    consultado via `isql`), sem ler nenhuma linha de dado de negócio:
    - CODIGO: INTEGER, NOT NULL, PK (constraint PK_CLASSIFICACAO) -> `codigo`
    - NCM: VARCHAR(10), NOT NULL -> `ncm`
    - CODPRODUTOTIPO: INTEGER, nullable, FK real no GENUS
      (FK_CLASSIFICACAO_PRODUTOTIPO -> PRODUTOTIPO.CODIGO — tabela
      PRODUTOTIPO ainda não reconhecida neste ERP) -> `cod_produto_tipo`
    - ALIQNAC: NUMERIC(10,2) -> Float -> `aliquota_nacional`
    - ALIQIMP: NUMERIC(10,2) -> Float -> `aliquota_importado`
    - CODCEST: INTEGER, nullable, FK real no GENUS
      (FK_CLASSIFICACAO_CEST -> CEST.CODIGO — tabela CEST ainda não
      reconhecida neste ERP) -> `cod_cest`
    - UNIDADEEXPORTACAO: VARCHAR(6), nullable -> `unidade_exportacao`
    - REFORMA_CCLASSTRIB: VARCHAR(10), nullable -> `reforma_cclasstrib`
    - DESCRINCM: VARCHAR(50), nullable -> `descricao_ncm`

    Apesar do nome parecido, esta tabela NÃO é a mesma coisa que
    GENUS.CLIENTECLASSIFICA (classificação de CLIENTE — tabela simples e
    independente, com apenas CODIGO INTEGER + DESCRI VARCHAR(40), conferida
    na mesma consulta de metadata acima; ainda não reconhecida neste ERP).
    GENUS.CLASSIFICACAO é a tabela mestre de classificação FISCAL/NCM de
    produto: é exatamente a tabela referenciada por `Produto.cod_classificacao`
    (GENUS: PRODUTO.CODCLASSIFICACAO -> CLASSIFICACAO.CODIGO) e guarda, por
    NCM, os campos de alíquota de IPI nacional/importado, CEST e a
    informação de reforma tributária (`Produto.reforma_cclasstrib` guarda o
    mesmo tipo de valor diretamente no produto — aqui é o valor "padrão" por
    classificação/NCM).

    Propositalmente não criamos FK formal agora — nem a resolução de
    `Produto.cod_classificacao` contra `Classificacao.codigo`, nem
    `cod_produto_tipo`/`cod_cest` contra `PRODUTOTIPO`/`CEST` (ainda não
    modeladas neste ERP) — apenas reconhecemos os campos brutos do GENUS,
    mesmo critério já usado em todas as demais tabelas GENUS deste ERP (ex.:
    `PRODUTO.CODGRUPO -> GrupoProduto.codigo`, `PRODUTO.CODTAMANHO ->
    Tamanho.codigo`). Resolver essas referências é tarefa do agente de
    migração de dados, fora do escopo desta atualização estrutural.

    Este model não é filha de `Produto` (é o inverso: `Produto` é que
    referencia esta tabela via `cod_classificacao`) — é uma tabela auxiliar
    mestre solta, por isso ganha entrada própria em `TabelasAuxiliaresWindow`
    no frontend, no mesmo padrão de `Tamanho`/`Marca`/`Regra`/`TipoVenda`/
    `Historico`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "classificacoes"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CLASSIFICACAO ────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)                # GENUS: CODIGO
    ncm = Column(String(10), nullable=True, index=True)                # GENUS: NCM
    cod_produto_tipo = Column(Integer, nullable=True)                  # GENUS: CODPRODUTOTIPO (FK bruta -> PRODUTOTIPO, tabela ainda não modelada)
    aliquota_nacional = Column(Float, nullable=True)                   # GENUS: ALIQNAC
    aliquota_importado = Column(Float, nullable=True)                  # GENUS: ALIQIMP
    cod_cest = Column(Integer, nullable=True)                          # GENUS: CODCEST (FK bruta -> CEST, tabela ainda não modelada)
    unidade_exportacao = Column(String(6), nullable=True)              # GENUS: UNIDADEEXPORTACAO
    reforma_cclasstrib = Column(String(10), nullable=True)             # GENUS: REFORMA_CCLASSTRIB
    descricao_ncm = Column(String(50), nullable=True)                  # GENUS: DESCRINCM


class CadastroCbenef(Base):
    """Código de Benefício Fiscal (CBENEF) usado em NF-e — tabela mestre
    CADASTROCBENEF do sistema legado GENUS (GENUS_ZANGUETTIN.FDB).

    Reconhece a estrutura completa da tabela CADASTROCBENEF, seguindo o
    mesmo precedente estabelecido para `Classificacao`/GENUS.CLASSIFICACAO,
    `Regra`/GENUS.REGRAS e `Marca`/GENUS.MARCA. Nomes e tipos foram
    conferidos ao vivo contra o schema Firebird do GENUS via metadata
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS /
    RDB$TRIGGERS, consultado via `isql`), sem ler nenhuma linha de dado de
    negócio:
    - CODIGO: INTEGER, NOT NULL, PK (constraint PK_CADASTROCBENEF) -> `codigo`
    - CBENEF: VARCHAR(30), nullable -> `cbenef`
    - SIMPLESNACIONAL: CHAR(1), nullable -> `simples_nacional`
    - CST00/02/10/15/20/30/40/41/50/51/53/60/61/70/90: CHAR(1), nullable
      (uma coluna por CST de ICMS aplicável a este benefício) -> `cst_00`...`cst_90`
    - DISPOSITIVO: BLOB subtype TEXT, nullable -> `dispositivo`
    - OBJETO_DESCRICAO: BLOB subtype TEXT, nullable -> `objeto_descricao`
    - OBSERVACAO: BLOB subtype TEXT, nullable -> `observacao`

    IMPORTANTE — apesar do nome ("CADASTRO" + "CBENEF"), esta tabela NÃO é
    uma extensão 1:1 de GENUS.CADASTRO (diferente de CLIENTE/FORNECEDOR/
    FUNCIONARIO/REPRESENTANTE/TRANSPORTADOR, que referenciam CADASTRO via
    CODCADASTRO — ver `CadastroPessoa`). Conferido ao vivo:
    - CADASTROCBENEF não tem nenhuma coluna CODCADASTRO, nem qualquer FK
      declarada (`RDB$REF_CONSTRAINTS` vazio para esta tabela — só existe a
      PK_CADASTROCBENEF e um NOT NULL em CODIGO).
    - O trigger BEFORE INSERT `TRI_CADASTROCBENEF` gera CODIGO a partir de
      `max(codigo)` da própria CADASTROCBENEF (sequência independente),
      confirmando que este CODIGO não vem de/está sincronizado com
      CADASTRO.CODIGO.
    - Outras tabelas GENUS já reconhecidas neste ERP referenciam esta
      tabela pelo código bruto `cod_cbenef` (`Produto.cod_cbenef` ==
      GENUS.PRODUTO.CODCBENEF; `RegraEstado.cod_cbenef` ==
      GENUS.REGRASESTADO.CODCBENEF, com comentário explícito
      "FK_REGRASESTADO_CBNEF -> CADASTROCBENEF"; também
      `ItemPedidoLan.cod_cbenef`).

    Ou seja, GENUS.CADASTROCBENEF é, na prática, uma tabela auxiliar MESTRE
    solta — um catálogo de códigos de benefício fiscal (CBENEF) e das
    regras de CST de ICMS associadas a cada um — referenciada por PRODUTO,
    REGRASESTADO e ITEMPEDIDOLAN, e não o inverso. Por isso este model não
    ganha relação com `CadastroPessoa`/`cod_cadastro` (campo que não existe
    nesta tabela) e, no frontend, ganha entrada própria em
    `TabelasAuxiliaresWindow`, no mesmo padrão de `Classificacao`/`Regra`/
    `Marca`/`TipoVenda`/`Historico`, em vez de ser embutido em
    `CadastroPessoaWindow`.

    Resolver `Produto.cod_cbenef`/`RegraEstado.cod_cbenef`/
    `ItemPedidoLan.cod_cbenef` contra `CadastroCbenef.codigo` é tarefa do
    agente de migração de dados, fora do escopo desta atualização estrutural.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cadastros_cbenef"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CADASTROCBENEF ───────────────────────────
    codigo = Column(Integer, nullable=True, index=True)        # GENUS: CODIGO (PK original no GENUS — ver Produto.cod_cbenef/RegraEstado.cod_cbenef/ItemPedidoLan.cod_cbenef)
    cbenef = Column(String(30), nullable=True, index=True)     # GENUS: CBENEF (código de benefício fiscal propriamente dito, usado na NF-e)
    simples_nacional = Column(String(1), nullable=True)        # GENUS: SIMPLESNACIONAL ('S'/'N' — aplicável a optantes do Simples Nacional)

    # CST de ICMS aplicável a este benefício, por natureza de operação/CST
    cst_00 = Column(String(1), nullable=True)                  # GENUS: CST00
    cst_02 = Column(String(1), nullable=True)                  # GENUS: CST02
    cst_10 = Column(String(1), nullable=True)                  # GENUS: CST10
    cst_15 = Column(String(1), nullable=True)                  # GENUS: CST15
    cst_20 = Column(String(1), nullable=True)                  # GENUS: CST20
    cst_30 = Column(String(1), nullable=True)                  # GENUS: CST30
    cst_40 = Column(String(1), nullable=True)                  # GENUS: CST40
    cst_41 = Column(String(1), nullable=True)                  # GENUS: CST41
    cst_50 = Column(String(1), nullable=True)                  # GENUS: CST50
    cst_51 = Column(String(1), nullable=True)                  # GENUS: CST51
    cst_53 = Column(String(1), nullable=True)                  # GENUS: CST53
    cst_60 = Column(String(1), nullable=True)                  # GENUS: CST60
    cst_61 = Column(String(1), nullable=True)                  # GENUS: CST61
    cst_70 = Column(String(1), nullable=True)                  # GENUS: CST70
    cst_90 = Column(String(1), nullable=True)                  # GENUS: CST90

    dispositivo = Column(Text, nullable=True)                   # GENUS: DISPOSITIVO (dispositivo legal/base normativa do benefício)
    objeto_descricao = Column(Text, nullable=True)               # GENUS: OBJETO_DESCRICAO
    observacao = Column(Text, nullable=True)                     # GENUS: OBSERVACAO


class Cfop(Base):
    """Código Fiscal de Operações e Prestações (CFOP) — tabela mestre CFOP
    do sistema legado GENUS (GENUS_ZANGUETTIN.FDB).

    Reconhece a estrutura completa da tabela CFOP, seguindo o mesmo
    precedente estabelecido para `Classificacao`/GENUS.CLASSIFICACAO,
    `Regra`/GENUS.REGRAS, `Marca`/GENUS.MARCA e `CadastroCbenef`/
    GENUS.CADASTROCBENEF. Nomes e tipos vêm da consulta de metadata já
    cacheada nesta sessão (schema Firebird do GENUS obtido via `isql`
    contra RDB$RELATION_FIELDS, sem `isql` disponível neste ambiente para
    nova conferência ao vivo — usado o cache
    `scratchpad/genus_full_schema.json` desta sessão), sem ler nenhuma
    linha de dado de negócio:
    - CODIGO: VARCHAR(5) -> `codigo` (código do CFOP propriamente dito,
      ex.: "5102", "1102" — é este valor que aparece cru como
      `cod_cfop`/`cod_cfop2` em todas as demais tabelas GENUS já
      reconhecidas neste ERP: `RegraEstado.cod_cfop`, `Entrada.cod_cfop`,
      `ItemEntrada.cod_cfop`, `PedidoVenda.cod_cfop`/`cod_cfop2`,
      `ItemPedidoLan.cod_cfop`, `Saida.cod_cfop`/`cod_cfop2`, etc. — ver
      comentário "FK bruta para CFOP — tabela ainda sem model dedicado"
      em cada um desses campos)
    - DESCRI: VARCHAR(45) -> `descricao`
    - MSG1: VARCHAR(30) -> `mensagem_1` (texto obrigatório impresso no
      documento fiscal para este CFOP, quando aplicável)
    - MSG2: VARCHAR(30) -> `mensagem_2`
    - CODCONTABILPRAZO: VARCHAR(4) -> `cod_contabil_prazo` (código de
      histórico/conta contábil usado quando a operação é a prazo)
    - CODCONTABILAVISTA: VARCHAR(4) -> `cod_contabil_avista` (idem, à
      vista)
    - CREDITOICMS: CHAR(1) -> `credito_icms` ('S'/'N' — se a operação gera
      direito a crédito de ICMS)
    - OBS: BLOB subtype TEXT -> `observacao`
    - OBRIGATORIORETORNOMERCADORIA: CHAR(1) -> `obrigatorio_retorno_mercadoria`
      ('S'/'N' — CFOPs de remessa que exigem retorno da mercadoria, ex.:
      remessa para conserto/industrialização)

    GENUS.CFOP é uma tabela auxiliar MESTRE solta (catálogo de CFOPs),
    referenciada por várias outras tabelas via o código bruto do CFOP
    (string, não FK declarada nesta atualização estrutural) — mesmo
    critério já usado para `Classificacao`/`Regra`/`Marca`/`CadastroCbenef`.
    Por isso este model não ganha relação SQLAlchemy com `Entrada`,
    `ItemEntrada`, `PedidoVenda` etc.; resolver `cod_cfop`/`cod_cfop2`
    contra `Cfop.codigo` é tarefa do agente de migração de dados, fora do
    escopo desta atualização estrutural. No frontend, ganha entrada
    própria em `TabelasAuxiliaresWindow`, no mesmo padrão de
    `Classificacao`/`Regra`/`Marca`/`TipoVenda`/`Historico`/`CadastroCbenef`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cfops"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CFOP ─────────────────────────────────────
    codigo = Column(String(5), nullable=True, index=True)                          # GENUS: CODIGO (PK original no GENUS — ver Entrada.cod_cfop/ItemEntrada.cod_cfop/PedidoVenda.cod_cfop/RegraEstado.cod_cfop etc.)
    descricao = Column(String(45), nullable=True)                                   # GENUS: DESCRI
    mensagem_1 = Column(String(30), nullable=True)                                  # GENUS: MSG1
    mensagem_2 = Column(String(30), nullable=True)                                  # GENUS: MSG2
    cod_contabil_prazo = Column(String(4), nullable=True)                           # GENUS: CODCONTABILPRAZO
    cod_contabil_avista = Column(String(4), nullable=True)                          # GENUS: CODCONTABILAVISTA
    credito_icms = Column(String(1), nullable=True)                                 # GENUS: CREDITOICMS
    observacao = Column(Text, nullable=True)                                        # GENUS: OBS
    obrigatorio_retorno_mercadoria = Column(String(1), nullable=True)               # GENUS: OBRIGATORIORETORNOMERCADORIA


class CClassTrib(Base):
    """Código de Classificação Tributária (CClassTrib) da Reforma Tributária
    (IBS/CBS) — tabela mestre CCLASSTRIB do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB).

    Reconhece a estrutura completa da tabela CCLASSTRIB, seguindo o mesmo
    precedente estabelecido para `Classificacao`/GENUS.CLASSIFICACAO,
    `Regra`/GENUS.REGRAS, `Marca`/GENUS.MARCA, `CadastroCbenef`/
    GENUS.CADASTROCBENEF e `Cfop`/GENUS.CFOP. Nomes e tipos vêm da consulta
    de metadata já cacheada nesta sessão (schema Firebird do GENUS obtido
    via `isql` contra RDB$RELATION_FIELDS, sem `isql` disponível neste
    ambiente para nova conferência ao vivo — usado o cache
    `scratchpad/genus_full_schema.json` desta sessão), sem ler nenhuma linha
    de dado de negócio:
    - CCLASSTRIB: VARCHAR(10) -> `cclasstrib` (código do CClassTrib
      propriamente dito — é este valor que aparece cru como
      `reforma_cclasstrib`/`reforma_cclasstribreg`/`reforma_cclasstribis_is`
      em todas as demais tabelas GENUS já reconhecidas neste ERP:
      `Produto.reforma_cclasstrib`, `Classificacao.reforma_cclasstrib`, além
      de campos equivalentes em outras tabelas de item de entrada/saída —
      ver comentário "GENUS: REFORMA_CCLASSTRIB*" em cada um desses campos)
    - CST: VARCHAR(3) -> `cst` (Código de Situação Tributária do IBS/CBS
      associado a este CClassTrib)
    - NOME: VARCHAR(200) -> `nome`
    - DESCRICAO: BLOB subtype TEXT -> `descricao`
    - PREDIBS: NUMERIC -> Float -> `perc_reducao_ibs` (percentual de
      redução de alíquota do IBS)
    - PREDCBS: NUMERIC -> Float -> `perc_reducao_cbs` (idem, CBS)
    - IND_REDUTORBC: CHAR(1) -> `ind_redutor_bc` ('S'/'N')
    - IND_GTRIBREGULAR: CHAR(1) -> `ind_tributacao_regular` ('S'/'N')
    - DINIVIG: TIMESTAMP -> `data_inicio_vigencia`
    - DFIMVIG: TIMESTAMP -> `data_fim_vigencia`
    - DATUALIZACAO: TIMESTAMP -> `data_atualizacao`
    - IND_MONOFASICO: CHAR(1) -> `ind_monofasico` ('S'/'N')
    - LC: VARCHAR(30) -> `lc` (Lei Complementar/base legal do CClassTrib)
    - IND_GCREDPRESOPER: INTEGER -> `ind_credito_presumido_operacao`
    - IND_GMONOPADRAO: INTEGER -> `ind_monofasico_padrao`
    - IND_GMONORETEN: INTEGER -> `ind_monofasico_retencao`
    - IND_GMONORET: INTEGER -> `ind_monofasico_retido`
    - IND_GMONODIF: INTEGER -> `ind_monofasico_diferimento`
    - IND_GESTORNOCRED: INTEGER -> `ind_estorno_credito`
    - IND_NFEABI: INTEGER -> `ind_nfe_abi`
    - IND_NFE: INTEGER -> `ind_nfe`
    - IND_NFCE: INTEGER -> `ind_nfce`
    - IND_CTE: INTEGER -> `ind_cte`
    - IND_CTEOS: INTEGER -> `ind_cte_os`
    - IND_BPE: INTEGER -> `ind_bpe`
    - IND_BPETA: INTEGER -> `ind_bpe_ta`
    - IND_BPETM: INTEGER -> `ind_bpe_tm`
    - IND_NF3E: INTEGER -> `ind_nf3e`
    - IND_NFSE: INTEGER -> `ind_nfse`
    - IND_NFSEVIA: INTEGER -> `ind_nfse_via`
    - IND_NFCOM: INTEGER -> `ind_nfcom`
    - IND_NFAG: INTEGER -> `ind_nfag`
    - IND_NFGAS: INTEGER -> `ind_nfgas`
    - IND_DERE: INTEGER -> `ind_dere`

    Os campos IND_* acima são, na prática, flags "documento fiscal aplica /
    não aplica este CClassTrib" por tipo de documento eletrônico
    (NF-e/NFC-e/CT-e/BP-e/NFS-e/NF3-e/NFCom/NFAgro/NFGas/DeRE etc.) —
    mantidos como INTEGER (0/1), fiéis ao tipo bruto do GENUS, em vez de
    normalizados para String(1) 'S'/'N' como os outros indicadores CHAR(1)
    desta mesma tabela.

    GENUS.CCLASSTRIB é uma tabela auxiliar MESTRE solta (catálogo de
    Códigos de Classificação Tributária da Reforma Tributária — IBS/CBS),
    referenciada por várias outras tabelas via o código bruto do
    CClassTrib (string, não FK declarada nesta atualização estrutural) —
    mesmo critério já usado para `Classificacao`/`Regra`/`Marca`/
    `CadastroCbenef`/`Cfop`. Por isso este model não ganha relação
    SQLAlchemy com `Produto`, `Classificacao` etc.; resolver
    `reforma_cclasstrib`/`reforma_cclasstribreg`/`reforma_cclasstribis_is`
    contra `CClassTrib.cclasstrib` é tarefa do agente de migração de dados,
    fora do escopo desta atualização estrutural. No frontend, ganha entrada
    própria em `TabelasAuxiliaresWindow`, no mesmo padrão de
    `Classificacao`/`Regra`/`Marca`/`TipoVenda`/`Historico`/
    `CadastroCbenef`/`Cfop`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cclasstribs"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CCLASSTRIB ───────────────────────────────
    cclasstrib = Column(String(10), nullable=True, index=True)            # GENUS: CCLASSTRIB (PK original no GENUS — ver Produto.reforma_cclasstrib/Classificacao.reforma_cclasstrib etc.)
    cst = Column(String(3), nullable=True)                                 # GENUS: CST
    nome = Column(String(200), nullable=True)                              # GENUS: NOME
    descricao = Column(Text, nullable=True)                                # GENUS: DESCRICAO
    perc_reducao_ibs = Column(Float, nullable=True)                        # GENUS: PREDIBS
    perc_reducao_cbs = Column(Float, nullable=True)                        # GENUS: PREDCBS
    ind_redutor_bc = Column(String(1), nullable=True)                      # GENUS: IND_REDUTORBC
    ind_tributacao_regular = Column(String(1), nullable=True)              # GENUS: IND_GTRIBREGULAR
    data_inicio_vigencia = Column(DateTime, nullable=True)                 # GENUS: DINIVIG
    data_fim_vigencia = Column(DateTime, nullable=True)                    # GENUS: DFIMVIG
    data_atualizacao = Column(DateTime, nullable=True)                     # GENUS: DATUALIZACAO
    ind_monofasico = Column(String(1), nullable=True)                      # GENUS: IND_MONOFASICO
    lc = Column(String(30), nullable=True)                                 # GENUS: LC
    ind_credito_presumido_operacao = Column(Integer, nullable=True)        # GENUS: IND_GCREDPRESOPER
    ind_monofasico_padrao = Column(Integer, nullable=True)                 # GENUS: IND_GMONOPADRAO
    ind_monofasico_retencao = Column(Integer, nullable=True)               # GENUS: IND_GMONORETEN
    ind_monofasico_retido = Column(Integer, nullable=True)                 # GENUS: IND_GMONORET
    ind_monofasico_diferimento = Column(Integer, nullable=True)            # GENUS: IND_GMONODIF
    ind_estorno_credito = Column(Integer, nullable=True)                   # GENUS: IND_GESTORNOCRED
    ind_nfe_abi = Column(Integer, nullable=True)                           # GENUS: IND_NFEABI
    ind_nfe = Column(Integer, nullable=True)                               # GENUS: IND_NFE
    ind_nfce = Column(Integer, nullable=True)                              # GENUS: IND_NFCE
    ind_cte = Column(Integer, nullable=True)                               # GENUS: IND_CTE
    ind_cte_os = Column(Integer, nullable=True)                            # GENUS: IND_CTEOS
    ind_bpe = Column(Integer, nullable=True)                               # GENUS: IND_BPE
    ind_bpe_ta = Column(Integer, nullable=True)                            # GENUS: IND_BPETA
    ind_bpe_tm = Column(Integer, nullable=True)                            # GENUS: IND_BPETM
    ind_nf3e = Column(Integer, nullable=True)                              # GENUS: IND_NF3E
    ind_nfse = Column(Integer, nullable=True)                              # GENUS: IND_NFSE
    ind_nfse_via = Column(Integer, nullable=True)                          # GENUS: IND_NFSEVIA
    ind_nfcom = Column(Integer, nullable=True)                             # GENUS: IND_NFCOM
    ind_nfag = Column(Integer, nullable=True)                              # GENUS: IND_NFAG
    ind_nfgas = Column(Integer, nullable=True)                             # GENUS: IND_NFGAS
    ind_dere = Column(Integer, nullable=True)                              # GENUS: IND_DERE


class CstIbsCbs(Base):
    """Código de Situação Tributária do IBS/CBS (CstIbsCbs) da Reforma
    Tributária — tabela mestre CST_IBS_CBS do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB).

    Reconhece a estrutura completa da tabela CST_IBS_CBS, seguindo o mesmo
    precedente estabelecido para `Classificacao`/GENUS.CLASSIFICACAO,
    `Regra`/GENUS.REGRAS, `Marca`/GENUS.MARCA, `CadastroCbenef`/
    GENUS.CADASTROCBENEF, `Cfop`/GENUS.CFOP e `CClassTrib`/GENUS.CCLASSTRIB.
    Nomes e tipos vêm de consulta ao vivo dos metadados do Firebird
    (RDB$RELATION_FIELDS/RDB$FIELDS/RDB$RELATION_CONSTRAINTS via `isql`
    contra GENUS_ZANGUETTIN.FDB nesta sessão), sem ler nenhuma linha de
    dado de negócio:
    - CST: CHAR(3), NOT NULL, PRIMARY KEY no GENUS -> `cst` (código do CST
      do IBS/CBS propriamente dito — é este valor que aparece cru como
      `reforma_cst_ibscbs` em outras tabelas GENUS já reconhecidas neste
      ERP: `ItemSaida.reforma_cst_ibscbs`, `ItemEntrada.reforma_cst_ibscbs`,
      e também como `CClassTrib.cst`, que referencia o mesmo domínio de
      código — ver comentário "GENUS: REFORMA_CST_IBSCBS" em cada um desses
      campos)
    - DESCRICAO: VARCHAR(80) -> `descricao`
    - IND_GIBSCBS: INTEGER -> `ind_gibscbs` (flag 0/1 — se o CST se aplica
      a operações de IBS/CBS)
    - IND_GRED: INTEGER -> `ind_gred` (flag 0/1 — CST de redução de
      alíquota)
    - IND_GDIF: INTEGER -> `ind_gdif` (flag 0/1 — CST de diferimento)
    - IND_GTRANSFCRED: INTEGER -> `ind_gtransfcred` (flag 0/1 — CST de
      transferência de crédito)
    - IND_GCREDPRESIBSZFM: INTEGER -> `ind_gcredpresibszfm` (flag 0/1 —
      CST de crédito presumido de IBS na Zona Franca de Manaus)
    - IND_GAJUSTECOMPET: INTEGER -> `ind_gajustecompet` (flag 0/1 — CST de
      ajuste de competência)
    - IND_REDUTORBC: INTEGER -> `ind_redutorbc` (flag 0/1 — CST com
      redutor de base de cálculo; mantido como INTEGER, fiel ao tipo bruto
      do GENUS nesta tabela — note que o campo homônimo em `CClassTrib`,
      IND_REDUTORBC, é CHAR(1) 'S'/'N' lá, então os dois NÃO compartilham
      o mesmo tipo Postgres apesar do nome igual)

    Todos os campos IND_* acima são mantidos como INTEGER (0/1), fiéis ao
    tipo bruto do GENUS (RDB$FIELD_TYPE 8 / long, sem escala), no mesmo
    critério já usado para os indicadores IND_* de `CClassTrib`.

    GENUS.CST_IBS_CBS é uma tabela auxiliar MESTRE solta (catálogo de CSTs
    do IBS/CBS), referenciada por várias outras tabelas via o código bruto
    do CST (string, não FK declarada nesta atualização estrutural) — mesmo
    critério já usado para `Classificacao`/`Regra`/`Marca`/`CadastroCbenef`/
    `Cfop`/`CClassTrib`. Por isso este model não ganha relação SQLAlchemy
    com `ItemSaida`, `ItemEntrada`, `CClassTrib` etc.; resolver
    `reforma_cst_ibscbs` contra `CstIbsCbs.cst` é tarefa do agente de
    migração de dados, fora do escopo desta atualização estrutural. No
    frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no mesmo
    padrão de `Classificacao`/`Regra`/`Marca`/`TipoVenda`/`Historico`/
    `CadastroCbenef`/`Cfop`/`CClassTrib`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cst_ibs_cbs"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CST_IBS_CBS ──────────────────────────────
    cst = Column(String(3), nullable=True, index=True)                     # GENUS: CST (PK original no GENUS, NOT NULL — ver ItemSaida.reforma_cst_ibscbs/ItemEntrada.reforma_cst_ibscbs/CClassTrib.cst)
    descricao = Column(String(80), nullable=True)                          # GENUS: DESCRICAO
    ind_gibscbs = Column(Integer, nullable=True)                           # GENUS: IND_GIBSCBS
    ind_gred = Column(Integer, nullable=True)                              # GENUS: IND_GRED
    ind_gdif = Column(Integer, nullable=True)                              # GENUS: IND_GDIF
    ind_gtransfcred = Column(Integer, nullable=True)                       # GENUS: IND_GTRANSFCRED
    ind_gcredpresibszfm = Column(Integer, nullable=True)                   # GENUS: IND_GCREDPRESIBSZFM
    ind_gajustecompet = Column(Integer, nullable=True)                     # GENUS: IND_GAJUSTECOMPET
    ind_redutorbc = Column(Integer, nullable=True)                         # GENUS: IND_REDUTORBC


class FormaPagamento(Base):
    """Condição/forma de pagamento (À vista, 30/60/90, Boleto...).

    Esta tabela também reconhece todos os campos da tabela CONDPAGTO do
    sistema legado GENUS (GENUS_ZANGUETTIN.FDB) — CONDPAGTO é a "condição de
    pagamento" do GENUS e corresponde diretamente a este model, então os
    campos legados foram adicionados aqui em vez de criar uma tabela nova.
    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "formas_pagamento"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)       # À vista, 30/60/90, Boleto...  GENUS: DESCRI
    parcelas = Column(Integer, default=1)                                        # GENUS: QTDEPARCELA
    dias_primeiro_vencimento = Column(Integer, default=0)                        # GENUS: PRIMEIRA
    intervalo_dias = Column(Integer, default=30)                                 # GENUS: DIASPARCELAS
    acrescimo_percentual = Column(Float, default=0.0)

    # ── Campos migrados de GENUS.CONDPAGTO ────────────────────────────────
    codigo = Column(String(5), nullable=True, index=True)     # GENUS: CODIGO
    avista_prazo = Column(String(1), nullable=True)            # GENUS: AVISTAPRAZO ('A' à vista / 'P' a prazo)
    baixa_primeira = Column(String(1), nullable=True)          # GENUS: BAIXAPRIMEIRA (S/N — baixa automática da 1ª parcela)
    dia = Column(Integer, nullable=True)                        # GENUS: DIA (dia fixo de vencimento, quando aplicável)


class TabelaPreco(Base):
    """Tabela de preço (cadastro mestre de "tabelas de preço" comerciais).

    Reconhece a estrutura completa da tabela TABELAPRECO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `GrupoProduto`/GENUS.GRUPO, `FormaPagamento`/GENUS.CONDPAGTO e
    `RegraEstado`/GENUS.REGRASESTADO. Nomes e tipos foram conferidos contra
    o schema Firebird do GENUS (RDB$RELATION_FIELDS), sem ler nenhuma linha
    de dado de negócio.

    Esta é a tabela MESTRE que outras tabelas GENUS já reconhecidas neste
    ERP referenciam através de um código bruto ainda não resolvido:
    - `PrecoProduto.cod_tabela_preco` (GENUS.PRECO.CODTABELAPRECO)
    - `Orcamento.cod_tabela_preco` (GENUS.ORCAMENTO.CODTABELAPRECO)
    - `PedidoVenda.cod_tabela_preco` (GENUS.PEDIDOVENDA.CODTABELAPRECO — via
      `schemas/vendas.py`)
    - qualquer outro model deste ERP com um campo `cod_tabela_preco`

    Propositalmente nenhuma dessas colunas ganhou uma FK própria antes de
    este model existir — a resolução (CODTABELAPRECO -> TABELAPRECO.CODIGO)
    é tarefa do agente de migração de dados, não deste agente de estrutura.
    Este model, em si, não é filha de `Produto` (não tem CODPRODUTO) — é uma
    tabela auxiliar solta, por isso ganha entrada própria em
    `TabelasAuxiliaresWindow` no frontend, no mesmo padrão de
    `GrupoProduto`/`FormaPagamento`/`RegraEstado`.

    CODEMPRESA é mantido como código bruto (`cod_empresa`), sem FK própria —
    assim como já ocorre em outras tabelas do GENUS já reconhecidas neste
    ERP (ex.: `PrecoProduto.cod_empresa`) — pois a tabela `Empresa` deste
    ERP ainda não guarda o código bruto GENUS.EMPRESA.CODIGO de forma
    resolvível a partir daqui.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "tabelas_preco"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.TABELAPRECO ──────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)          # GENUS: CODIGO
    cod_empresa = Column(Integer, nullable=True, index=True)     # GENUS: CODEMPRESA
    descricao = Column(String(50), nullable=True)                # GENUS: DESCRICAO
    percentual = Column(Float, nullable=True)                    # GENUS: PERCENTUAL
    cod_preco = Column(Integer, nullable=True)                   # GENUS: CODPRECO
    ativo = Column(String(1), nullable=True)                     # GENUS: ATIVO ('S' ativo / 'N' inativo)
    tipo_calculo = Column(String(1), nullable=True)               # GENUS: TIPOCALCULO
    tipo_comissao = Column(String(1), nullable=True)              # GENUS: TPCOMISSAO
    perc_comissao = Column(Float, nullable=True)                  # GENUS: PERCOMISSAO


class PlanoConta(Base):
    __tablename__ = "plano_contas"
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(20), nullable=False, unique=True)   # Ex: 1.1.1
    descricao = Column(String(200), nullable=False)
    tipo = Column(String(20), nullable=False)    # receita | despesa | ativo | passivo
    pai_id = Column(Integer, ForeignKey("plano_contas.id"), nullable=True)


class CentroCusto(Base):
    """Centro de custo (cadastro auxiliar do ERP).

    Os campos originais desta tabela (`codigo`, `nome`, `ativo`) definem a
    identidade de centro de custo própria do ERP, usada por
    `SolicitacaoCompra.centro_custo_id`. Nunca foram alterados aqui.

    Além disso, esta classe reconhece a estrutura completa da tabela
    CENTROCUSTO do sistema legado GENUS (GENUS_ZANGUETTIN.FDB). Apesar do
    nome coincidir, no GENUS essa tabela NÃO representa um centro de custo
    contábil: é, na prática, uma extensão de PRODUTO por empresa/filial,
    chaveada por CODPRODUTO + CODEMPRESA, guardando preços, promoções,
    tributos (PIS/COFINS/IPI/ICMS) e — quando o "produto" é um bem
    patrimonial (veículo, equipamento) — também dados de patrimônio e
    depreciação (VALORPATRIMONIO, PLACA, CHASSI, DATATROCAOLEO etc).
    A entidade real, quando migrada de fato, vai exigir relacionar estes
    campos com PRODUTO (via CODPRODUTO) e com EMPRESA (via CODEMPRESA) —
    propositalmente não criamos FK própria aqui, apenas reconhecemos os
    campos brutos do GENUS, para não perder nenhuma informação.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "centros_custo"
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(20), nullable=False, unique=True)
    nome = Column(String(100), nullable=False)
    ativo = Column(Boolean, default=True)

    # ── Campos migrados de GENUS.CENTROCUSTO ──────────────────────────────
    # Identificação (chave real da tabela GENUS: CODPRODUTO + CODEMPRESA)
    cod_produto = Column(String(15), nullable=True)                        # GENUS: CODPRODUTO
    cod_empresa = Column(Integer, nullable=True)                           # GENUS: CODEMPRESA
    pertence_empresa = Column(String(1), nullable=True)                    # GENUS: PERTENCEEMPRESA

    # Preço / venda
    ecf_aliquota = Column(String(5), nullable=True)                        # GENUS: ECFALIQ
    custo = Column(Float, nullable=True)                                   # GENUS: CUSTO
    venda = Column(Float, nullable=True)                                   # GENUS: VENDA
    frete = Column(Float, nullable=True)                                   # GENUS: FRETE
    minimo = Column(Float, nullable=True)                                  # GENUS: MINIMO
    maximo = Column(Float, nullable=True)                                  # GENUS: MAXIMO
    qtde = Column(Float, nullable=True)                                    # GENUS: QTDE
    consignacao = Column(Float, nullable=True)                             # GENUS: CONSIGNACAO
    valor_promocao = Column(Float, nullable=True)                          # GENUS: VALORPROMOCAO
    inicio_promocao = Column(DateTime, nullable=True)                      # GENUS: INICIOPROMOCAO
    fim_promocao = Column(DateTime, nullable=True)                         # GENUS: FIMPROMOCAO
    estoque_cliente = Column(Float, nullable=True)                         # GENUS: ESTOQUECLI
    custo_fixo = Column(Float, nullable=True)                              # GENUS: CUSTOFIXO
    margem_lucro = Column(Float, nullable=True)                            # GENUS: MARGEMLUCRO
    comissao = Column(Float, nullable=True)                                # GENUS: COMISSAO
    avista = Column(Float, nullable=True)                                  # GENUS: AVISTA
    comissao_avista = Column(Float, nullable=True)                         # GENUS: COMISSAOAVISTA
    percentual_avista = Column(Float, nullable=True)                       # GENUS: PERCENTUALAVISTA
    preco_minimo = Column(Float, nullable=True)                            # GENUS: PRECOMINIMO
    percentual_a_prazo = Column(Float, nullable=True)                      # GENUS: PERCENTUALAPRAZO
    percentual_minimo = Column(Float, nullable=True)                       # GENUS: PERCENTUALMINIMO
    ultimo_custo = Column(Float, nullable=True)                            # GENUS: ULTIMOCUSTO
    custo_medio = Column(Float, nullable=True)                             # GENUS: CUSTOMEDIO
    preco_sugerido = Column(Float, nullable=True)                          # GENUS: PRECOSUGERIDO
    unitario_compra = Column(Float, nullable=True)                         # GENUS: UNITARIOCOMPRA
    fornecedor_compra = Column(Integer, nullable=True)                     # GENUS: FORNECEDORCOMPRA
    mao_de_obra = Column(Float, nullable=True)                             # GENUS: MAODEOBRA
    custo_materia = Column(Float, nullable=True)                           # GENUS: CUSTOMATERIA
    localizacao_produto = Column(String(50), nullable=True)                # GENUS: LOCALIZACAOPRODUTO

    # Estoque
    estoque_reservado = Column(Float, nullable=True)                       # GENUS: ESTOQUERESERVADO
    fisico = Column(Float, nullable=True)                                  # GENUS: FISICO

    # Fiscal
    reducao_icms = Column(Float, nullable=True)                            # GENUS: REDUCAOICMS
    diferenca_subst = Column(Float, nullable=True)                         # GENUS: DIFERENCASUBST
    diferenca_icms = Column(Float, nullable=True)                          # GENUS: DIFERENCAICMS
    ipi_entrada = Column(Float, nullable=True)                             # GENUS: IPI_ENTRADA
    ipi_cst_entrada = Column(String(3), nullable=True)                     # GENUS: IPICST_ENTRADA
    ipi_cst_saida = Column(String(3), nullable=True)                       # GENUS: IPICST_SAIDA
    pis_cst = Column(String(3), nullable=True)                             # GENUS: PIS_CST
    pis_aliquota = Column(Float, nullable=True)                            # GENUS: PIS_ALIQUOTA
    pis_reais = Column(Float, nullable=True)                               # GENUS: PIS_REAIS
    pis_cst_entrada = Column(String(3), nullable=True)                     # GENUS: PIS_CST_ENTRADA
    pis_aliquota_entrada = Column(Float, nullable=True)                    # GENUS: PIS_ALIQUOTA_ENTRADA
    pis_reais_entrada = Column(Float, nullable=True)                       # GENUS: PIS_REAIS_ENTRADA
    cofins_cst = Column(String(3), nullable=True)                          # GENUS: COFINS_CST
    cofins_aliquota = Column(Float, nullable=True)                         # GENUS: COFINS_ALIQUOTA
    cofins_reais = Column(Float, nullable=True)                            # GENUS: COFINS_REAIS
    cofins_cst_entrada = Column(String(3), nullable=True)                  # GENUS: COFINS_CST_ENTRADA
    cofins_aliquota_entrada = Column(Float, nullable=True)                 # GENUS: COFINS_ALIQUOTA_ENTRADA
    cofins_reais_entrada = Column(Float, nullable=True)                    # GENUS: COFINS_REAIS_ENTRADA

    # Balança
    tecla_balanca = Column(Integer, nullable=True)                         # GENUS: TECLABALANCA
    tipo_balanca = Column(String(1), nullable=True)                       # GENUS: TIPOBALANCA
    cod_balanca = Column(Integer, nullable=True)                          # GENUS: CODBALANCA
    validade = Column(Integer, nullable=True)                             # GENUS: VALIDADE

    # Patrimônio / bem (quando o "produto" é ativo fixo, ex.: veículo, equipamento)
    data_aquisicao = Column(DateTime, nullable=True)                      # GENUS: AQUISICAO
    nota_patrimonio = Column(Integer, nullable=True)                      # GENUS: NOTAPATRIMONIO
    cod_patrimonio = Column(Integer, nullable=True)                       # GENUS: CODPATRIMONIO
    valor_patrimonio = Column(Float, nullable=True)                       # GENUS: VALORPATRIMONIO
    data_garantia = Column(DateTime, nullable=True)                       # GENUS: DATAGARANTIA
    data_depreciacao = Column(DateTime, nullable=True)                    # GENUS: DATADEPRECIACAO
    taxa_depreciacao = Column(Float, nullable=True)                       # GENUS: TAXADEPRECIACAO
    valor_depreciacao = Column(Float, nullable=True)                      # GENUS: VALORDEPRECIACAO
    data_revisao = Column(DateTime, nullable=True)                        # GENUS: REVISAO
    placa = Column(String(10), nullable=True)                            # GENUS: PLACA
    chassi = Column(String(20), nullable=True)                           # GENUS: CHASSI
    capacidade = Column(Float, nullable=True)                            # GENUS: CAPACIDADE
    troca_oleo_km = Column(Integer, nullable=True)                       # GENUS: TROCAOLEOKM
    data_troca_oleo = Column(DateTime, nullable=True)                    # GENUS: DATATROCAOLEO

    # Auditoria de origem (GENUS)
    data_alteracao_genus = Column(DateTime, nullable=True)              # GENUS: DATAALTERACAO
    data_hora_alterado_genus = Column(DateTime, nullable=True)          # GENUS: DATA_HORA_ALTERADO


class CentroCustoExcluido(Base):
    """Centro de Custo (GENUS) excluído (histórico/snapshot no momento da exclusão).

    Reconhece a estrutura completa da tabela DEL_CENTROCUSTO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Sistema/Config (Tier 2)
    deste ERP, análoga a `ProdutoExcluido`/GENUS.DEL_PRODUTO e a
    `SaidaExcluida`/GENUS.DELSAIDA, só que para a extensão de produto por
    empresa/filial (`CentroCusto`/GENUS.CENTROCUSTO — apesar do nome, não é
    o centro de custo contábil, ver docstring de `CentroCusto`) em vez do
    cadastro de produto ou do cabeçalho de saída. É o mesmo padrão "tabela
    de lixo/histórico de exclusão", repetido aqui para o módulo
    Sistema/Config: DEL_PRODUTO está para PRODUTO, DELSAIDA está para SAIDA,
    e DEL_CENTROCUSTO está para CENTROCUSTO.

    DEL_CENTROCUSTO guarda uma cópia de boa parte dos atributos de
    `CentroCusto`/GENUS.CENTROCUSTO (mesmos nomes de coluna: CODPRODUTO,
    CODEMPRESA, ECFALIQ, CUSTO, VENDA, FRETE, MINIMO, MAXIMO, QTDE,
    CONSIGNACAO, VALORPROMOCAO, INICIOPROMOCAO, FIMPROMOCAO, ESTOQUECLI,
    FISICO, REDUCAOICMS, CUSTOFIXO, MARGEMLUCRO, DIFERENCASUBST,
    DIFERENCAICMS, COMISSAO, AVISTA, COMISSAOAVISTA, PERCENTUALAVISTA,
    PERTENCEEMPRESA, PRECOMINIMO, IPI_ENTRADA, TECLABALANCA, TIPOBALANCA,
    VALIDADE, CODBALANCA, PIS_CST, COFINS_CST, PIS_ALIQUOTA, COFINS_ALIQUOTA,
    PIS_REAIS, COFINS_REAIS, PERCENTUALAPRAZO, PERCENTUALMINIMO, AQUISICAO,
    NOTAPATRIMONIO, VALORPATRIMONIO, DATAGARANTIA, DATADEPRECIACAO,
    TAXADEPRECIACAO, VALORDEPRECIACAO, REVISAO, PLACA, CHASSI, CAPACIDADE,
    TROCAOLEOKM, DATATROCAOLEO, CODPATRIMONIO, ULTIMOCUSTO, MAODEOBRA,
    CUSTOMATERIA — reaproveitados aqui com os mesmos nomes em snake_case já
    usados em `CentroCusto`, para consistência) no momento em que a linha
    foi excluída de CENTROCUSTO no GENUS — permitindo recuperar/auditar um
    registro de preço/patrimônio de produto por empresa que foi apagado.
    DEL_CENTROCUSTO é uma estrutura mais enxuta que CENTROCUSTO: não
    reconhece, por exemplo, CUSTOMEDIO, PRECOSUGERIDO, UNITARIOCOMPRA,
    FORNECEDORCOMPRA, LOCALIZACAOPRODUTO, ESTOQUERESERVADO, IPICST_ENTRADA,
    IPICST_SAIDA, PIS_CST_ENTRADA/PIS_ALIQUOTA_ENTRADA/PIS_REAIS_ENTRADA,
    COFINS_CST_ENTRADA/COFINS_ALIQUOTA_ENTRADA/COFINS_REAIS_ENTRADA, nem os
    campos de auditoria DATAALTERACAO/DATA_HORA_ALTERADO — sinal de que
    DEL_CENTROCUSTO foi criada antes dessas extensões mais recentes da
    estrutura CENTROCUSTO no GENUS (mesmo raciocínio já documentado em
    `SaidaExcluida` sobre DELSAIDA ser mais enxuta que SAIDA).

    Assim como `ProdutoExcluido` e `SaidaExcluida`, **não há nenhuma foreign
    key** própria criada aqui para (CODPRODUTO, CODEMPRESA) contra
    `CentroCusto` — propositalmente: seria uma chave composta (CODPRODUTO +
    CODEMPRESA, o mesmo par natural de
    `CentroCusto.cod_produto`/`CentroCusto.cod_empresa`), não há constraint
    única correspondente criada neste ERP para apoiar essa FK, e, por
    definição, uma linha excluída de CENTROCUSTO no GENUS normalmente **não**
    tem mais correspondente vivo em CENTROCUSTO (a menos que o par de
    códigos tenha sido reaproveitado depois) — por isso `cod_produto`/
    `cod_empresa` são mantidos como códigos brutos, indexados, sem FK
    própria; a resolução/religação (quando fizer sentido) fica a cargo do
    agente de migração de dados. Confirmado via metadados do Firebird
    (RDB$RELATION_FIELDS / índice PK_DEL_CENTROCUSTO com 26 registros) que
    esta é a estrutura completa da tabela — nenhuma linha de dado de negócio
    foi lida.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela DEL_CENTROCUSTO foi lido no GENUS por este
    agente.
    """
    __tablename__ = "centros_custo_excluidos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave original da linha excluída no GENUS ────────
    cod_produto = Column(String(15), nullable=True, index=True)          # GENUS: CODPRODUTO (par natural com cod_empresa; ver docstring — sem FK própria para CentroCusto)
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA
    pertence_empresa = Column(String(1), nullable=True)                  # GENUS: PERTENCEEMPRESA

    # ── Preço / venda ──────────────────────────────────────────────────
    ecf_aliquota = Column(String(5), nullable=True)                      # GENUS: ECFALIQ
    custo = Column(Float, nullable=True)                                 # GENUS: CUSTO
    venda = Column(Float, nullable=True)                                 # GENUS: VENDA
    frete = Column(Float, nullable=True)                                 # GENUS: FRETE
    minimo = Column(Float, nullable=True)                                # GENUS: MINIMO
    maximo = Column(Float, nullable=True)                                # GENUS: MAXIMO
    qtde = Column(Float, nullable=True)                                  # GENUS: QTDE
    consignacao = Column(Float, nullable=True)                           # GENUS: CONSIGNACAO
    valor_promocao = Column(Float, nullable=True)                        # GENUS: VALORPROMOCAO
    inicio_promocao = Column(DateTime, nullable=True)                    # GENUS: INICIOPROMOCAO
    fim_promocao = Column(DateTime, nullable=True)                       # GENUS: FIMPROMOCAO
    estoque_cliente = Column(Float, nullable=True)                       # GENUS: ESTOQUECLI
    custo_fixo = Column(Float, nullable=True)                            # GENUS: CUSTOFIXO
    margem_lucro = Column(Float, nullable=True)                          # GENUS: MARGEMLUCRO
    comissao = Column(Float, nullable=True)                              # GENUS: COMISSAO
    avista = Column(Float, nullable=True)                                # GENUS: AVISTA
    comissao_avista = Column(Float, nullable=True)                       # GENUS: COMISSAOAVISTA
    percentual_avista = Column(Float, nullable=True)                     # GENUS: PERCENTUALAVISTA
    preco_minimo = Column(Float, nullable=True)                          # GENUS: PRECOMINIMO
    percentual_a_prazo = Column(Float, nullable=True)                    # GENUS: PERCENTUALAPRAZO
    percentual_minimo = Column(Float, nullable=True)                     # GENUS: PERCENTUALMINIMO
    ultimo_custo = Column(Float, nullable=True)                          # GENUS: ULTIMOCUSTO
    mao_de_obra = Column(Float, nullable=True)                           # GENUS: MAODEOBRA
    custo_materia = Column(Float, nullable=True)                         # GENUS: CUSTOMATERIA

    # ── Estoque ────────────────────────────────────────────────────────
    fisico = Column(Float, nullable=True)                                # GENUS: FISICO

    # ── Fiscal — ICMS / IPI ────────────────────────────────────────────
    reducao_icms = Column(Float, nullable=True)                          # GENUS: REDUCAOICMS
    diferenca_subst = Column(Float, nullable=True)                       # GENUS: DIFERENCASUBST
    diferenca_icms = Column(Float, nullable=True)                        # GENUS: DIFERENCAICMS
    ipi_entrada = Column(Float, nullable=True)                           # GENUS: IPI_ENTRADA

    # ── Fiscal — PIS / COFINS ──────────────────────────────────────────
    pis_cst = Column(String(3), nullable=True)                           # GENUS: PIS_CST
    pis_aliquota = Column(Float, nullable=True)                          # GENUS: PIS_ALIQUOTA
    pis_reais = Column(Float, nullable=True)                             # GENUS: PIS_REAIS
    cofins_cst = Column(String(3), nullable=True)                        # GENUS: COFINS_CST
    cofins_aliquota = Column(Float, nullable=True)                       # GENUS: COFINS_ALIQUOTA
    cofins_reais = Column(Float, nullable=True)                          # GENUS: COFINS_REAIS

    # ── Balança ────────────────────────────────────────────────────────
    tecla_balanca = Column(Integer, nullable=True)                       # GENUS: TECLABALANCA
    tipo_balanca = Column(String(1), nullable=True)                      # GENUS: TIPOBALANCA
    cod_balanca = Column(Integer, nullable=True)                         # GENUS: CODBALANCA
    validade = Column(Integer, nullable=True)                            # GENUS: VALIDADE

    # ── Patrimônio / bem (veículo, equipamento etc.) ──────────────────
    data_aquisicao = Column(DateTime, nullable=True)                     # GENUS: AQUISICAO
    nota_patrimonio = Column(Integer, nullable=True)                     # GENUS: NOTAPATRIMONIO
    cod_patrimonio = Column(Integer, nullable=True)                      # GENUS: CODPATRIMONIO
    valor_patrimonio = Column(Float, nullable=True)                      # GENUS: VALORPATRIMONIO
    data_garantia = Column(DateTime, nullable=True)                      # GENUS: DATAGARANTIA
    data_depreciacao = Column(DateTime, nullable=True)                   # GENUS: DATADEPRECIACAO
    taxa_depreciacao = Column(Float, nullable=True)                      # GENUS: TAXADEPRECIACAO
    valor_depreciacao = Column(Float, nullable=True)                     # GENUS: VALORDEPRECIACAO
    data_revisao = Column(DateTime, nullable=True)                       # GENUS: REVISAO
    placa = Column(String(10), nullable=True)                            # GENUS: PLACA
    chassi = Column(String(20), nullable=True)                           # GENUS: CHASSI
    capacidade = Column(Float, nullable=True)                            # GENUS: CAPACIDADE
    troca_oleo_km = Column(Integer, nullable=True)                       # GENUS: TROCAOLEOKM
    data_troca_oleo = Column(DateTime, nullable=True)                    # GENUS: DATATROCAOLEO


class Deposito(Base):
    __tablename__ = "depositos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(200), nullable=True)
    ativo = Column(Boolean, default=True)


class Transportadora(Base):
    """Transportadora.

    Além dos campos originais do ERP, esta classe reconhece a estrutura
    completa da tabela TRANSPORTADOR do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB). Assim como em CLIENTE/FORNECEDOR/FUNCIONARIO,
    no GENUS a tabela TRANSPORTADOR não guarda identidade própria (nome,
    documento, endereço) — ela referencia a tabela mestre CADASTRO através
    da coluna CODCADASTRO (ver `cod_cadastro` abaixo e o model
    `CadastroPessoa`, que reconhece a estrutura de CADASTRO). A entidade
    "transportadora" completa do GENUS, quando migrada de fato, exige o
    JOIN entre TRANSPORTADOR (estes campos) e CADASTRO via CODCADASTRO —
    propositalmente não criamos uma FK própria aqui (o schema do ERP já tem
    seus próprios campos de identidade duplicados diretamente nesta
    tabela), apenas reconhecemos os campos brutos do GENUS, para não
    perder nenhuma informação.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "transportadoras"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cnpj = Column(String(20), unique=True, nullable=True)
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    observacao = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)

    # ── Campos migrados de GENUS.TRANSPORTADOR ────────────────────────────
    # Identificação / vínculo com CADASTRO (mestre de pessoas do GENUS)
    cod_cadastro = Column(Integer, nullable=True)                          # GENUS: CODCADASTRO

    # Dados específicos de transportadora
    placa = Column(String(8), nullable=True)                               # GENUS: PLACA
    insc_inss = Column(String(15), nullable=True)                          # GENUS: INSC_INSS
    insc_iss = Column(String(15), nullable=True)                           # GENUS: INSC_ISS
    cra_sp = Column(String(15), nullable=True)                             # GENUS: CRA_SP
    antt = Column(String(20), nullable=True)                               # GENUS: ANTT


class Representante(Base):
    """Representante comercial.

    No GENUS, REPRESENTANTE guarda apenas os dados específicos do papel de
    representante (comissão, dados bancários, hierarquia) e referencia a
    identidade da pessoa (nome, CPF/CNPJ, endereço) na tabela mestre
    CADASTRO via CODCADASTRO. Neste ERP, nome/cpf_cnpj/email/telefone já
    são mantidos diretamente aqui (sem normalização), então a entidade
    "completa" de fato, quando migrada, exigirá o JOIN entre esta tabela
    e CadastroPessoa via cod_cadastro — assim como já ocorre com
    Fornecedor/Transportadora.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "representantes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cpf_cnpj = Column(String(20), unique=True, nullable=True)
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    celular = Column(String(20), nullable=True)
    comissao_percentual = Column(Float, default=0.0)
    meta_mensal = Column(Float, default=0.0)
    ativo = Column(Boolean, default=True)

    comissoes = relationship("Comissao", back_populates="representante")

    # ── Campos migrados de GENUS.REPRESENTANTE ─────────────────────────────
    # Identificação / vínculo com CADASTRO (mestre de pessoas do GENUS) e
    # com EMPRESA
    cod_cadastro = Column(Integer, nullable=True)                           # GENUS: CODCADASTRO
    cod_empresa = Column(Integer, nullable=True)                            # GENUS: CODEMPRESA

    # Dados bancários
    banco = Column(String(3), nullable=True)                                # GENUS: BANCO
    agencia = Column(String(5), nullable=True)                              # GENUS: AGENCIA
    digito_agencia = Column(String(1), nullable=True)                       # GENUS: DIGITOAGENCIA
    conta = Column(Integer, nullable=True)                                  # GENUS: CONTA
    digito_conta = Column(String(1), nullable=True)                        # GENUS: DIGITOCONTA

    # Dados específicos de representante
    contato = Column(String(20), nullable=True)                             # GENUS: CONTATO
    comissao = Column(Float, nullable=True)                                 # GENUS: COMISSAO
    dt_admissao = Column(DateTime, nullable=True)                           # GENUS: DTADMISSAO
    dt_demissao = Column(DateTime, nullable=True)                           # GENUS: DTDEMISSAO
    cod_supervisor = Column(Integer, nullable=True)                         # GENUS: CODSUPERVISOR
    cod_gerente = Column(Integer, nullable=True)                            # GENUS: CODGERENTE
    nivel_hierarquico = Column(String(1), nullable=True)                    # GENUS: NIVELHIERARQUICO
    tipo_comissao = Column(String(1), nullable=True)                        # GENUS: TIPOCOMISSAO


class Comissao(Base):
    """Comissão paga a um representante sobre uma venda/nota fiscal.

    Reconhece a estrutura completa da tabela COMISSAO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Produto`/GENUS.PRODUTO. Cada linha representa o cálculo/lançamento
    de comissão de um representante sobre uma saída/nota fiscal específica.

    CODREPRESENTANTE é resolvido aqui com uma FK própria do ERP
    (`representante_id` -> `representantes.id`), já que `Representante` foi
    expandido com os campos de GENUS.REPRESENTANTE. O código bruto também é
    mantido (`cod_representante`) para não perder a referência original do
    GENUS até que a migração de dados real resolva o vínculo definitivo
    (mesmo padrão de `empresa_id`/`cod_empresa` em `ContaPagar`/`ContaReceber`).

    Os demais códigos (CODEMPRESA, CODSAIDA, CODPROSPECCAO, CODPEDIDO,
    CODRECEBER, CODDEPOSITO, CODPAGAR) apontam para tabelas legadas ainda não
    modeladas neste ERP (Empresa multi-filial do GENUS, Saida, Prospecção,
    Pedido, ContaReceber, Depósito, ContaPagar) — propositalmente mantidos
    como códigos brutos (`cod_*`), sem FK, apenas para não perder informação;
    a entidade real, quando migrada de fato, vai exigir resolver essas
    referências contra as tabelas correspondentes.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "comissoes"
    id = Column(Integer, primary_key=True, index=True)

    # Vínculo resolvível do ERP (Representante já expandido no Tier 1)
    representante_id = Column(Integer, ForeignKey("representantes.id"), nullable=True)
    representante = relationship("Representante", back_populates="comissoes")

    # ── Campos migrados de GENUS.COMISSAO ─────────────────────────────────
    # Identificação / vínculos (códigos ainda não resolvidos contra tabelas próprias)
    codigo = Column(Integer, nullable=True, index=True)                      # GENUS: CODIGO
    cod_empresa = Column(Integer, nullable=True)                             # GENUS: CODEMPRESA
    cod_representante = Column(Integer, nullable=True, index=True)           # GENUS: CODREPRESENTANTE (mirror bruto; ver representante_id)
    cod_saida = Column(Integer, nullable=True)                               # GENUS: CODSAIDA
    nota_fiscal = Column(Integer, nullable=True)                             # GENUS: NOTAFISCAL
    cod_prospeccao = Column(Integer, nullable=True)                          # GENUS: CODPROSPECCAO
    cod_pedido = Column(Integer, nullable=True)                              # GENUS: CODPEDIDO
    cod_receber = Column(Integer, nullable=True)                             # GENUS: CODRECEBER
    cod_deposito = Column(Integer, nullable=True)                            # GENUS: CODDEPOSITO
    cod_pagar = Column(Integer, nullable=True)                               # GENUS: CODPAGAR

    # Datas
    emissao = Column(DateTime, nullable=True)                                # GENUS: EMISSAO
    vencimento = Column(DateTime, nullable=True)                             # GENUS: VENCIMEN
    dt_processamento = Column(DateTime, nullable=True)                       # GENUS: DTPROCESSAMENTO

    # Valores
    valor_comissao = Column(Float, nullable=True)                            # GENUS: VALORCOMISSAO
    percentual_comissao = Column(Float, nullable=True)                       # GENUS: PERCENTUALCOMISSAO
    total = Column(Float, nullable=True)                                     # GENUS: TOTAL
    deducao = Column(Float, nullable=True)                                   # GENUS: DEDUCAO

    # Tipo/classificação
    tipo_comissao = Column(String(1), nullable=True)                         # GENUS: TIPOCOMISSAO
    tipo_func = Column(String(1), nullable=True)                             # GENUS: TIPOFUNC


class CadastroPessoa(Base):
    """Cadastro mestre de pessoas/empresas do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB, tabela CADASTRO).

    No GENUS, CADASTRO é a tabela única de identidade (nome, CPF/CNPJ,
    endereço, dados pessoais) referenciada por CLIENTE, FORNECEDOR,
    FUNCIONARIO, REPRESENTANTE e TRANSPORTADOR através da coluna
    CODCADASTRO. Neste ERP, ClienteCompleto/Fornecedor/Funcionario/
    Representante/Transportadora já possuem seus próprios campos de nome,
    documento e endereço (duplicados diretamente em cada tabela, sem
    normalização), então este model existe apenas para reconhecer a
    estrutura original da tabela mestre do GENUS — a entidade "completa"
    de qualquer uma dessas categorias, quando migrada de fato, exigirá
    o JOIN entre a tabela específica (CLIENTE, FORNECEDOR, ...) e esta
    tabela via CODCADASTRO, como já é feito manualmente para
    ClienteCompleto/Fornecedor.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cadastros_pessoa"

    id = Column(Integer, primary_key=True, index=True)

    contatos = relationship("CadastroContato", back_populates="cadastro_pessoa", cascade="all, delete-orphan")
    agregados = relationship("Agregado", back_populates="cadastro_pessoa", cascade="all, delete-orphan")

    # ── Identificação ──────────────────────────────────────────────────
    codigo = Column(Integer, unique=True, nullable=True, index=True)         # GENUS: CODIGO
    cpf_cnpj = Column(String(14), nullable=True)                             # GENUS: CPFCNPJ
    data_cadastro = Column(DateTime, nullable=True)                          # GENUS: DT_CADASTRO
    nome = Column(String(45), nullable=False)                                # GENUS: NOME
    fantasia = Column(String(25), nullable=True)                             # GENUS: FANTASIA
    pessoa = Column(String(1), nullable=True)                                # GENUS: PESSOA ('F' física / 'J' jurídica)
    situacao = Column(String(1), default="A", nullable=True)                 # GENUS: SITUACAO ('A' ativo / 'I' inativo)

    # ── Endereço ───────────────────────────────────────────────────────
    endereco = Column(String(50), nullable=True)                            # GENUS: ENDERECO
    numero = Column(String(6), nullable=True)                               # GENUS: NUMERO
    complemento = Column(Text, nullable=True)                               # GENUS: COMPLEMENTO
    bairro = Column(String(35), nullable=True)                              # GENUS: BAIRRO
    cod_cidade = Column(Integer, nullable=True)                             # GENUS: CODCIDADE
    cep = Column(String(10), nullable=True)                                 # GENUS: CEP

    # ── Contato ────────────────────────────────────────────────────────
    site = Column(String(60), nullable=True)                                # GENUS: SITE
    email = Column(String(500), nullable=True)                              # GENUS: EMAIL
    email_financeiro = Column(String(100), nullable=True)                   # GENUS: EMAIL_FINANCEIRO
    fone = Column(String(15), nullable=True)                                # GENUS: FONE
    fone2 = Column(String(15), nullable=True)                               # GENUS: FONE2
    celular = Column(String(15), nullable=True)                             # GENUS: CELULAR
    mobile = Column(String(1), nullable=True)                               # GENUS: MOBILE
    referencia_comercial = Column(String(45), nullable=True)                # GENUS: REF_COMERCIAL
    observacao = Column(Text, nullable=True)                                # GENUS: OBS

    # ── Dados pessoais (pessoa física) ────────────────────────────────
    data_nascimento = Column(DateTime, nullable=True)                       # GENUS: DTNASC
    local_nascimento = Column(String(50), nullable=True)                    # GENUS: LOCALNASC
    pais_nacionalidade = Column(Integer, nullable=True)                     # GENUS: PAISNAC
    nome_pai = Column(String(45), nullable=True)                            # GENUS: NOMEPAI
    nome_mae = Column(String(45), nullable=True)                            # GENUS: NOMEMAE
    rg_insc = Column(String(15), nullable=True)                             # GENUS: RGINSC
    orgao_uf_rg = Column(String(10), nullable=True)                         # GENUS: ORGAOUFRG
    data_emissao_rg = Column(DateTime, nullable=True)                       # GENUS: EMISSAORG
    passaporte = Column(String(8), nullable=True)                          # GENUS: PASSAPORTE
    escolaridade = Column(String(2), nullable=True)                        # GENUS: ESCOLARIDADE
    cor = Column(String(1), nullable=True)                                 # GENUS: COR
    deficiencia = Column(String(1), nullable=True)                        # GENUS: DEFICIENCIA
    estado_civil = Column(String(1), nullable=True)                       # GENUS: ESTADOCIVIL
    sexo = Column(String(1), nullable=True)                                # GENUS: SEXO
    reter_ir = Column(String(1), nullable=True)                            # GENUS: RETERIR

    # ── Fiscal ─────────────────────────────────────────────────────────
    insc_suframa = Column(String(18), nullable=True)                       # GENUS: INSCSUFRAMA
    zona_franca = Column(String(1), nullable=True)                         # GENUS: ZONAFRANCA
    apuracao = Column(String(1), nullable=True)                            # GENUS: APURACAO

    # ── Transferência entre empresas / código antigo (multi-empresa GENUS) ─
    cod_empresa_transferencia = Column(Integer, nullable=True)             # GENUS: COD_EMPRESA_TRANSF
    cod_empresa_transf1 = Column(Integer, nullable=True)                   # GENUS: COD_EMPRESA_TRANSF1
    cod_empresa_transf2 = Column(Integer, nullable=True)                   # GENUS: COD_EMPRESA_TRANSF2
    cod_antigo_transfere = Column(Integer, nullable=True)                  # GENUS: COD_ANTIGO_TRANSFERE
    cod_antigo_transfere1 = Column(Integer, nullable=True)                 # GENUS: COD_ANTIGO_TRANSFERE1
    cod_antigo_transfere2 = Column(Integer, nullable=True)                 # GENUS: COD_ANTIGO_TRANSFERE2

    # ── Auditoria de origem (GENUS) ───────────────────────────────────
    cod_alteracao = Column(Integer, nullable=True)                        # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)               # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                # GENUS: DATAALTERACAO


class CadastroContato(Base):
    """Contato adicional vinculado a um cadastro (pessoa física/jurídica) —
    tabela CADASTROCONTATO do sistema legado GENUS (GENUS_ZANGUETTIN.FDB),
    módulo Cadastros (Tier 2).

    Reconhece a estrutura completa da tabela CADASTROCONTATO. Os 14 campos e
    tipos foram conferidos contra `RDB$RELATION_FIELDS` do Firebird em uma
    sessão anterior deste mesmo trabalho de reconhecimento de estrutura do
    GENUS (resultado consolidado em cache local, `genus_full_schema.json`) —
    nesta sessão específica, nem o arquivo GENUS_ZANGUETTIN.FDB nem nenhum
    alias `isql` foram encontrados nesta máquina (buscado o disco `C:\\`
    inteiro por `*.fdb`/`*genus*`; o serviço Firebird 2.5 local está de pé
    na porta 3050, mas sem nenhum banco registrado em `aliases.conf`), então
    os tipos abaixo vieram desse cache já validado ao vivo, e batem
    exatamente com a sugestão de tipos do agente de estrutura:
    - CODIGO: Integer (PK original no GENUS)
    - CODCADASTRO: Integer (FK -> CADASTRO.CODIGO)
    - EMAIL: String(60)
    - EMAILNFE: String(1) ('S'/'N' — recebe cópia de e-mail de NF-e)
    - FONE, FONE2, CELULAR, CELULAR2: String(15)
    - OBS: Text
    - CODSETOR: Integer (FK bruta -> SETOR, já modelada em `Setor`)
    - CONJUGUE: String(45)
    - DTNASC_CONJUGUE, DTCASAMENTO: DateTime
    - CONTATO: String(40)

    No GENUS, CADASTROCONTATO é filha da tabela mestre CADASTRO (pessoa
    física/jurídica, já reconhecida neste ERP como `CadastroPessoa`) através
    de CODCADASTRO — um mesmo CADASTRO pode ter vários contatos adicionais
    cadastrados (ex.: um contato por setor, dados do cônjuge). A entidade
    completa, quando migrada de fato, exige o JOIN entre CADASTROCONTATO
    (estes campos) e CADASTRO via CODCADASTRO.

    Diferente de tabelas cuja identidade real passa por uma tabela
    intermediária ainda não migrada (ex.: CLIENTE/FORNECEDOR -> CADASTRO,
    onde só o código bruto é mantido — ver `ClienteCompleto.cod_cadastro`),
    aqui CODCADASTRO referencia CADASTRO diretamente, e CADASTRO já tem
    model dedicado neste ERP (`CadastroPessoa`) — por isso este model já
    ganha uma FK estrutural nullable (`cadastro_pessoa_id` ->
    `cadastros_pessoa.id`), além do código bruto (`cod_cadastro`) preservado
    à parte. Resolver de fato essa FK (casar CODCADASTRO com
    `CadastroPessoa.codigo`) é tarefa do agente de migração de dados, fora
    do escopo deste agente de estrutura — por isso `cadastro_pessoa_id`
    é opcional (nullable), sem popular nenhuma linha.

    CODSETOR é mantido como código bruto (`cod_setor`), sem FK própria —
    a tabela SETOR do GENUS já tem model dedicado neste ERP (`Setor`), mas
    resolver essa referência (casar `cod_setor` com `Setor.codigo`) é
    tarefa do agente de migração de dados, fora do escopo deste agente de
    estrutura.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cadastros_contato"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro mestre já modelado (GENUS.CADASTRO) ────────
    cadastro_pessoa_id = Column(Integer, ForeignKey("cadastros_pessoa.id"), nullable=True, index=True)  # resolvido de GENUS: CODCADASTRO -> CADASTRO.CODIGO (CadastroPessoa.codigo)

    # ── Campos migrados de GENUS.CADASTROCONTATO ──────────────────────────
    codigo = Column(Integer, nullable=True, index=True)                  # GENUS: CODIGO (PK original no GENUS)
    cod_cadastro = Column(Integer, nullable=True, index=True)            # GENUS: CODCADASTRO (código bruto, antes da resolução de cadastro_pessoa_id)
    email = Column(String(60), nullable=True)                           # GENUS: EMAIL
    email_nfe = Column(String(1), nullable=True)                        # GENUS: EMAILNFE ('S'/'N' — recebe e-mail de NF-e)
    fone = Column(String(15), nullable=True)                            # GENUS: FONE
    fone2 = Column(String(15), nullable=True)                           # GENUS: FONE2
    celular = Column(String(15), nullable=True)                         # GENUS: CELULAR
    celular2 = Column(String(15), nullable=True)                        # GENUS: CELULAR2
    observacao = Column(Text, nullable=True)                            # GENUS: OBS
    cod_setor = Column(Integer, nullable=True)                          # GENUS: CODSETOR (FK bruta -> SETOR, já modelada em `Setor`)
    conjuge = Column(String(45), nullable=True)                         # GENUS: CONJUGUE
    data_nascimento_conjuge = Column(DateTime, nullable=True)           # GENUS: DTNASC_CONJUGUE
    data_casamento = Column(DateTime, nullable=True)                    # GENUS: DTCASAMENTO
    contato = Column(String(40), nullable=True)                         # GENUS: CONTATO

    cadastro_pessoa = relationship("CadastroPessoa", back_populates="contatos")


class Agregado(Base):
    """Agregado (pessoa vinculada a um cadastro) — tabela AGREGADOS do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB), módulo Sistema/Cadastros (Tier 2).

    Estrutura completa reconhecida (16 campos), conferida contra o cache de
    metadados do Firebird já validado nesta sessão de trabalho de
    reconhecimento de estrutura do GENUS (`genus_full_schema.json` —
    consolidado a partir de `RDB$RELATION_FIELDS` em sessão anterior; nesta
    sessão específica, o serviço Firebird local não tinha nenhum alias
    apontando para GENUS_ZANGUETTIN.FDB registrado, então nenhum `isql` ao
    vivo foi possível, e os tipos abaixo vieram desse cache já conferido, que
    batem exatamente com a sugestão de tipos do agente de estrutura):
    - CODCADASTRO: Integer (FK -> CADASTRO.CODIGO)
    - CODAGREGADO: Integer (identidade própria do registro — é este código
      que aparece como FK bruta `cod_agregado` em várias outras tabelas já
      reconhecidas neste ERP: PedidoVenda, Orcamento, Saida, Compras, etc.)
    - TIPO: String(1)
    - NOME: String(45)
    - DTNASC, DTCASAMENTO: DateTime
    - ENDERECO: String(50)
    - NUMERO: String(6)
    - BAIRRO: String(35)
    - CODCIDADE: Integer (FK bruta -> CIDADE, tabela ainda não modelada)
    - FONE: String(15)
    - INSC: String(15)
    - CEP: String(10)
    - CNPJ: String(14)
    - PRODRURAL: String(1) ('S'/'N' — indica produtor rural)
    - OBS: Text

    No GENUS, AGREGADOS é filha da tabela mestre CADASTRO (pessoa física/
    jurídica, já reconhecida neste ERP como `CadastroPessoa`) através de
    CODCADASTRO — exatamente o mesmo papel estrutural de CADASTROCONTATO
    (ver `CadastroContato` acima): um mesmo CADASTRO pode ter vários
    "agregados" (pessoas adicionais vinculadas ao cadastro principal — no
    contexto de produtor rural, tipicamente familiares/dependentes que
    também constam na declaração, cada um com seu próprio nome, endereço,
    CPF/CNPJ e inscrição, distintos do titular). A entidade completa,
    quando migrada de fato, exige o JOIN entre AGREGADOS (estes campos) e
    CADASTRO via CODCADASTRO.

    Diferente de CLIENTE/FORNECEDOR (que só guardam o código bruto de
    CADASTRO, sem FK própria — ver `ClienteCompleto.cod_cadastro`), aqui
    seguimos o mesmo precedente de CadastroContato: como CADASTRO já tem
    model dedicado (`CadastroPessoa`), este model já ganha uma FK estrutural
    nullable (`cadastro_pessoa_id` -> `cadastros_pessoa.id`), além do código
    bruto (`cod_cadastro`) preservado à parte. Resolver de fato essa FK
    (casar CODCADASTRO com `CadastroPessoa.codigo`) é tarefa do agente de
    migração de dados, fora do escopo deste agente de estrutura — por isso
    `cadastro_pessoa_id` é opcional (nullable), sem popular nenhuma linha.

    CODCIDADE é mantido como código bruto (`cod_cidade`), sem FK própria —
    a tabela CIDADE do GENUS ainda não tem model dedicado neste ERP.

    `codigo` (CODAGREGADO) não ganha FK própria vindo de fora: as tabelas
    que hoje só guardam `cod_agregado` bruto (PedidoVenda, Orcamento, Saida,
    Compras etc.) continuam com o mirror bruto sem FK própria — resolver
    esses vínculos contra `Agregado.codigo` também é tarefa do agente de
    migração de dados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "agregados"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro mestre já modelado (GENUS.CADASTRO) ────────
    cadastro_pessoa_id = Column(Integer, ForeignKey("cadastros_pessoa.id"), nullable=True, index=True)  # resolvido de GENUS: CODCADASTRO -> CADASTRO.CODIGO (CadastroPessoa.codigo)

    # ── Campos migrados de GENUS.AGREGADOS ────────────────────────────────
    cod_cadastro = Column(Integer, nullable=True, index=True)            # GENUS: CODCADASTRO (código bruto, antes da resolução de cadastro_pessoa_id)
    codigo = Column(Integer, nullable=True, index=True)                  # GENUS: CODAGREGADO (identidade própria — referenciada como cod_agregado em outras tabelas)
    tipo = Column(String(1), nullable=True)                              # GENUS: TIPO
    nome = Column(String(45), nullable=True)                             # GENUS: NOME
    data_nascimento = Column(DateTime, nullable=True)                    # GENUS: DTNASC
    data_casamento = Column(DateTime, nullable=True)                     # GENUS: DTCASAMENTO
    endereco = Column(String(50), nullable=True)                        # GENUS: ENDERECO
    numero = Column(String(6), nullable=True)                           # GENUS: NUMERO
    bairro = Column(String(35), nullable=True)                          # GENUS: BAIRRO
    cod_cidade = Column(Integer, nullable=True)                         # GENUS: CODCIDADE (FK bruta -> CIDADE, tabela ainda não modelada)
    fone = Column(String(15), nullable=True)                            # GENUS: FONE
    insc = Column(String(15), nullable=True)                            # GENUS: INSC
    cep = Column(String(10), nullable=True)                             # GENUS: CEP
    cnpj = Column(String(14), nullable=True)                            # GENUS: CNPJ
    produtor_rural = Column(String(1), nullable=True)                   # GENUS: PRODRURAL ('S'/'N')
    observacao = Column(Text, nullable=True)                            # GENUS: OBS

    cadastro_pessoa = relationship("CadastroPessoa", back_populates="agregados")


class ClienteCompleto(Base):
    """Cliente completo — substitui gradualmente a tabela clientes simples.

    Além dos campos originais do ERP, esta classe reconhece a estrutura
    completa da tabela CLIENTE do sistema legado GENUS (GENUS_ZANGUETTIN.FDB).
    No GENUS, CLIENTE não guarda identidade própria (nome, documento,
    endereço) — ela referencia a tabela mestre CADASTRO através da coluna
    CODCADASTRO (ver `cod_cadastro` abaixo e o model `CadastroPessoa`, que
    reconhece a estrutura de CADASTRO). A entidade "cliente" completa do
    GENUS, quando migrada de fato, exige o JOIN entre CLIENTE (estes campos)
    e CADASTRO via CODCADASTRO — propositalmente não criamos uma FK própria
    aqui (o schema do ERP já tem seus próprios campos de identidade
    duplicados diretamente nesta tabela), apenas reconhecemos os campos
    brutos do GENUS, para não perder nenhuma informação.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "clientes_completo"
    id = Column(Integer, primary_key=True, index=True)
    # Identificação
    tipo_pessoa = Column(String(2), default="PJ")   # PF | PJ
    nome = Column(String(150), nullable=False)
    nome_fantasia = Column(String(150), nullable=True)
    documento = Column(String(20), unique=True, nullable=True)   # CPF ou CNPJ
    rg_ie = Column(String(30), nullable=True)                    # RG ou IE
    data_nascimento = Column(DateTime, nullable=True)
    # Contato
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    celular = Column(String(20), nullable=True)
    # Endereço
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    # Comercial
    limite_credito = Column(Float, default=0.0)
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    representante_id = Column(Integer, ForeignKey("representantes.id"), nullable=True)
    transportadora_id = Column(Integer, ForeignKey("transportadoras.id"), nullable=True)
    observacao = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)

    # ── Campos migrados de GENUS.CLIENTE ──────────────────────────────────
    # Identificação / vínculo com CADASTRO (mestre de pessoas do GENUS)
    cod_cadastro = Column(Integer, nullable=True)                          # GENUS: CODCADASTRO
    cod_naturalidade = Column(Integer, nullable=True)                      # GENUS: CODNATURALIDADE

    # Crédito / cobrança
    limite = Column(Float, nullable=True)                                  # GENUS: LIMITE
    cobranca = Column(Integer, nullable=True)                              # GENUS: COBRANCA
    bloqueado = Column(String(30), nullable=True)                         # GENUS: BLOQUEADO

    # Dependentes / contato
    dependente = Column(Integer, nullable=True)                           # GENUS: DEPENDENTE
    contato = Column(String(40), nullable=True)                           # GENUS: CONTATO

    # Renda / trabalho
    renda = Column(Float, nullable=True)                                  # GENUS: RENDA
    trabalho = Column(String(30), nullable=True)                          # GENUS: TRABALHO
    fone_trabalho = Column(String(15), nullable=True)                     # GENUS: FONE_TRABALHO
    data_admissao = Column(DateTime, nullable=True)                       # GENUS: DTADMISSAO
    contato_trabalho = Column(String(15), nullable=True)                  # GENUS: CONTATO_TRABALHO

    # Documento de identidade
    orgao_exp = Column(String(5), nullable=True)                          # GENUS: ORGAOEXP
    data_expedicao = Column(DateTime, nullable=True)                      # GENUS: DTEXPEDICAO

    # Endereço de cobrança (distinto do endereço principal)
    cob_endereco = Column(String(50), nullable=True)                      # GENUS: COB_ENDERECO
    cob_bairro = Column(String(23), nullable=True)                        # GENUS: COB_BAIRRO
    cob_cep = Column(String(10), nullable=True)                           # GENUS: COB_CEP
    cob_cod_cidade = Column(Integer, nullable=True)                       # GENUS: COB_CODCIDADE

    # Fiscal / comercial
    cnae = Column(String(10), nullable=True)                              # GENUS: CNAE
    cod_representante = Column(Integer, nullable=True)                    # GENUS: CODREPRESENTANTE
    cod_regiao = Column(Integer, nullable=True)                           # GENUS: CODREGIAO
    cod_cfop = Column(String(5), nullable=True)                           # GENUS: CODCFOP
    cod_transportador = Column(Integer, nullable=True)                   # GENUS: CODTRANSPORTADOR
    cod_carteira = Column(Integer, nullable=True)                        # GENUS: CODCARTEIRA
    cod_contas = Column(Integer, nullable=True)                          # GENUS: CODCONTAS
    cod_cond_pagto = Column(String(5), nullable=True)                    # GENUS: CODCONDPAGTO
    tipo_comercio = Column(String(1), nullable=True)                     # GENUS: TIPOCOMERCIO
    agregar_ipi = Column(String(1), nullable=True)                       # GENUS: AGREGARIPI
    reduzir_base_st = Column(String(1), nullable=True)                   # GENUS: REDUZIRBASEST
    carga_media_trib = Column(Float, nullable=True)                      # GENUS: CARGAMEDIATRIB
    valor_km_rodado = Column(Float, nullable=True)                       # GENUS: VALOR_KMRODADO
    acrescimo = Column(Float, nullable=True)                             # GENUS: ACRESCIMO
    cod_alternativo = Column(Integer, nullable=True)                     # GENUS: CODALTERNATIVO
    cod_tipo_venda = Column(Integer, nullable=True)                      # GENUS: CODTIPOVENDA
    operadora = Column(String(1), nullable=True)                        # GENUS: OPERADORA
    cod_tabela_preco = Column(Integer, nullable=True)                    # GENUS: CODTABELAPRECO
    prod_rural = Column(String(1), nullable=True)                       # GENUS: PRODRURAL
    dias_recorrencia = Column(Integer, nullable=True)                   # GENUS: DIASRECORRENCIA
    calcular_difal = Column(String(1), nullable=True)                   # GENUS: CALCULARDIFAL
    nao_destacar_icms = Column(String(1), nullable=True)                # GENUS: NAODESTACARICMS
    reduzir_icms_base_pis_cofins = Column(String(1), nullable=True)     # GENUS: REDUZIRICMSBASECALCULOPISCOFINS
    reforma_cclasstrib = Column(String(10), nullable=True)              # GENUS: REFORMA_CCLASSTRIB

    # LGPD
    data_imp_lgpd = Column(DateTime, nullable=True)                     # GENUS: DATA_IMP_LGPD
    data_dev_lgpd = Column(DateTime, nullable=True)                     # GENUS: DATA_DEV_LGPD
    hora_imp_lgpd = Column(String(8), nullable=True)                    # GENUS: HORA_IMP_LGPD
    hora_dev_lgpd = Column(String(8), nullable=True)                    # GENUS: HORA_DEV_LGPD
    cod_funcionario_lgpd = Column(Integer, nullable=True)               # GENUS: CODFUNCIONARIO_LGPD


class ClienteEmpresa(Base):
    """Vínculo entre um cliente e a(s) empresa(s)/filial(is) do GENUS em que
    ele está cadastrado (recurso multi-filial).

    Reconhece a estrutura completa da tabela CLIENTEEMPRESA do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Cadastros (Tier 2) deste
    ERP. Tipos e chaves foram conferidos diretamente no schema Firebird do
    GENUS via metadados (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS /
    RDB$REF_CONSTRAINTS / RDB$INDEX_SEGMENTS), sem ler nenhuma linha de
    dado de negócio: os 2 campos são simples (CODCADASTRO/CODEMPRESA
    INTEGER, RDB$FIELD_TYPE 8, ambos NOT NULL) -> Integer, exatamente os
    tipos sugeridos para esta tabela.

    No GENUS, CLIENTEEMPRESA é a tabela de vínculo (many-to-many) que
    registra em qual(is) empresa(s)/filial(is) cada cliente está
    cadastrado — confirmado por duas foreign keys reais, ambas ON
    UPDATE/DELETE CASCADE:
    - `FK_CLIENTEEMPRESA_CADASTRO`: CODCADASTRO -> CADASTRO.PK_CADASTRO —
      note que a FK aponta para a tabela mestre CADASTRO (identidade
      genérica de pessoas/empresas, já reconhecida neste ERP como
      `CadastroPessoa`), e não diretamente para CLIENTE. Como
      GENUS.CLIENTE também referencia CADASTRO por CODCADASTRO (e
      `ClienteCompleto.cod_cadastro` já espelha esse mesmo campo), na
      prática o CODCADASTRO de uma linha de CLIENTEEMPRESA identifica o
      cliente correspondente — mas essa resolução depende de casar
      CLIENTEEMPRESA.CODCADASTRO com CLIENTE.CODCADASTRO (via CADASTRO),
      não de uma FK direta entre as duas tabelas no GENUS.
    - `FK_CLIENTEEMPRESA_EMPRESA`: CODEMPRESA -> EMPRESA.PK_EMPRESA (a
      mesma entidade multi-filial já reconhecida neste ERP como
      `Empresa`).
    Ou seja, cada linha registra "este cliente está cadastrado nesta
    empresa/filial" — um mesmo cliente pode estar vinculado a várias
    empresas e, estruturalmente, uma mesma empresa está vinculada a vários
    clientes — por isso este model é a tabela de junção pura de uma
    relação N:N entre `ClienteCompleto` e `Empresa`, e não um campo
    espalhado em nenhuma das duas.

    CLIENTEEMPRESA tem chave primária composta própria no GENUS
    (`PK_CLIENTEEMPRESA`, formada por CODCADASTRO + CODEMPRESA). Seguindo
    o mesmo critério já usado para as demais tabelas de junção do GENUS
    reconhecidas neste ERP (nenhuma linha foi importada ainda), essa chave
    composta não é reaproveitada como PK deste ERP — o `id` serial é a
    única chave própria deste model, e os 2 campos originais são
    preservados como códigos brutos (`cod_*`), indexados.

    Este model é ligado ao cliente (`cliente_id` -> `ClienteCompleto`) já
    reconhecido neste ERP, seguindo o mesmo padrão de FK simples (sem
    `relationship()`/`back_populates`) já usado em `Orcamento.cliente_id`
    e `PedidoVenda.cliente_id`. Essa FK só pode ser resolvida de fato
    relacionando (GENUS.CLIENTEEMPRESA.CODCADASTRO, via CADASTRO) com
    (GENUS.CLIENTE.CODCADASTRO -> `ClienteCompleto.cod_cadastro`) — tarefa
    do agente de migração de dados, não deste agente de estrutura. Por
    isso `cliente_id` é opcional (nullable) e o código bruto original
    (`cod_cadastro`) é preservado à parte, para não perder informação até
    que essa resolução aconteça.

    `cod_empresa` é mantido deliberadamente como código bruto (sem FK real
    para `Empresa`) — apesar do model `Empresa` já existir neste ERP, a
    resolução do recurso multi-filial do GENUS (CODEMPRESA) ainda não é
    1:1 confiável em várias outras tabelas já reconhecidas
    (`ClienteCompleto`, `PedidoVenda`, `Saida` etc. também mantêm
    `cod_empresa`/similar como código bruto) — resolver isso exigiria uma
    decisão de mapeamento Empresa GENUS <-> Empresa Postgres que está fora
    do escopo deste agente de estrutura.

    Ambos os campos (CODCADASTRO, CODEMPRESA) são NOT NULL no GENUS
    (confirmado via RDB$RELATION_FIELDS/RDB$NULL_FLAG) — mesmo assim
    mantidos nullable aqui, seguindo o padrão deste ERP de nunca exigir
    (`nullable=False`) um campo puramente estrutural ainda não populado
    por nenhuma importação de dados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "clientes_empresa"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cliente já migrado (resolvido de GENUS.CLIENTE via CADASTRO) ──
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True, index=True)  # resolvido de GENUS: CODCADASTRO -> CADASTRO -> CLIENTE.CODCADASTRO -> ClienteCompleto.cod_cadastro

    # ── Campos migrados de GENUS.CLIENTEEMPRESA (PK composta no GENUS: CODCADASTRO + CODEMPRESA) ─
    cod_cadastro = Column(Integer, nullable=True, index=True)   # GENUS: CODCADASTRO (parte da PK_CLIENTEEMPRESA e da FK_CLIENTEEMPRESA_CADASTRO -> CADASTRO)
    cod_empresa = Column(Integer, nullable=True, index=True)    # GENUS: CODEMPRESA (parte da PK_CLIENTEEMPRESA e da FK_CLIENTEEMPRESA_EMPRESA -> EMPRESA; mantido bruto — ver docstring)


class ClienteAtendimento(Base):
    """Atendimento (registro de contato/CRM) prestado a um cliente —
    tabela CLIENTEATENDIMENTO do sistema legado GENUS (GENUS_ZANGUETTIN.FDB),
    módulo Cadastros (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela CLIENTEATENDIMENTO: 7 campos
    simples (CODIGO, CODCLIENTE, CODFUNCIONARIO INTEGER; DATA e DTRETORNO
    DATE/TIMESTAMP; HORA CHAR(8); OBS BLOB de texto), conferidos contra o
    cache de metadados Firebird já validado em sessão anterior deste mesmo
    trabalho de reconhecimento de estrutura do GENUS (`genus_full_schema.json`,
    mesma fonte já usada para outras tabelas deste trabalho, ex.
    `CadastroContato`) — batendo exatamente com a sugestão de tipos do
    agente de estrutura. Nenhuma linha de dado de negócio foi lida para
    montar este model.

    Cada linha registra um atendimento (ligação, visita, contato comercial
    etc.) prestado a um cliente por um funcionário, numa data/hora, com
    observações livres e uma data de retorno agendada — histórico de CRM
    vinculado ao cliente.

    No GENUS, CLIENTEATENDIMENTO não guarda identidade própria do cliente
    (apenas o código bruto CODCLIENTE). Como CLIENTE (já reconhecida neste
    ERP como `ClienteCompleto`) também não guarda identidade própria — ela
    referencia CADASTRO via CODCADASTRO — CODCLIENTE aqui identifica o
    mesmo "código de cliente" já usado em `ClienteEmpresa.cod_cadastro` /
    `ClienteCompleto.cod_cadastro`. Por isso, seguindo o mesmo padrão já
    usado em `Orcamento.cliente_id`, `PedidoVenda.cliente_id` e
    `ClienteEmpresa.cliente_id` (FK simples, nullable, sem
    `relationship()`/`back_populates`), este model já ganha uma FK
    estrutural (`cliente_id` -> `clientes_completo.id`), além do código
    bruto original (`cod_cliente`) preservado à parte. Resolver de fato
    essa FK (casar CODCLIENTE com `ClienteCompleto.cod_cadastro`) é tarefa
    do agente de migração de dados, fora do escopo deste agente de
    estrutura.

    CODFUNCIONARIO é mantido apenas como código bruto (`cod_funcionario`),
    sem FK própria — apesar de `Funcionario` já existir neste ERP, não há
    nenhum precedente de resolução direta CODFUNCIONARIO -> Funcionario em
    nenhuma outra tabela já reconhecida (o funcionário responsável por um
    atendimento, quando migrado de fato, exigirá casar esse código contra
    `Funcionario.cod_cadastro` via CADASTRO, assim como os demais campos
    `cod_funcionario*` espalhados pelo restante do ERP).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "clientes_atendimento"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cliente já migrado (resolvido de GENUS.CLIENTE via CADASTRO) ──
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True, index=True)  # resolvido de GENUS: CODCLIENTE -> CLIENTE.CODCADASTRO -> ClienteCompleto.cod_cadastro

    # ── Campos migrados de GENUS.CLIENTEATENDIMENTO ───────────────────────
    codigo = Column(Integer, nullable=True, index=True)         # GENUS: CODIGO (PK original no GENUS)
    cod_cliente = Column(Integer, nullable=True, index=True)    # GENUS: CODCLIENTE (código bruto, antes da resolução de cliente_id)
    cod_funcionario = Column(Integer, nullable=True)            # GENUS: CODFUNCIONARIO (funcionário responsável pelo atendimento — código bruto, sem FK própria)
    data = Column(DateTime, nullable=True)                      # GENUS: DATA
    hora = Column(String(8), nullable=True)                     # GENUS: HORA
    observacao = Column(Text, nullable=True)                    # GENUS: OBS
    data_retorno = Column(DateTime, nullable=True)              # GENUS: DTRETORNO


class ClienteCnae(Base):
    """CNAE(s) (Classificação Nacional de Atividades Econômicas) vinculados a
    um cliente — tabela CLIENTECNAE do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo Cadastros (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela CLIENTECNAE: 3 campos simples
    (CODCLIENTE INTEGER; CODCNAE VARCHAR(20); DESCRI VARCHAR(100)),
    conferidos contra o cache de metadados Firebird já validado em sessão
    anterior deste mesmo trabalho de reconhecimento de estrutura do GENUS
    (`genus_full_schema.json`, mesma fonte já usada para outras tabelas deste
    trabalho, ex. `ClienteAtendimento`) — batendo exatamente com a sugestão
    de tipos do agente de estrutura. `isql` não estava disponível neste
    ambiente, então a verificação foi feita inteiramente contra esse cache
    (já coletado ao vivo do Firebird em sessão anterior, via metadados
    RDB$RELATION_FIELDS e afins). Nenhuma linha de dado de negócio foi lida
    para montar este model.

    Cada linha registra um código CNAE (e sua descrição, já desnormalizada
    na própria linha — não há tabela mestre `CNAE` separada no schema do
    GENUS) associado a um cliente. Como um mesmo cliente pode exercer mais
    de uma atividade econômica, um mesmo CODCLIENTE pode aparecer em várias
    linhas de CLIENTECNAE (uma por CNAE) — por isso este model é a tabela de
    junção 1:N entre cliente e código CNAE (na prática N:N entre clientes e
    códigos de CNAE, já que o mesmo código de CNAE pode se repetir em vários
    clientes), e não um campo espalhado no cadastro principal do cliente.

    No GENUS, CLIENTECNAE não guarda identidade própria do cliente (apenas o
    código bruto CODCLIENTE). Como CLIENTE (já reconhecida neste ERP como
    `ClienteCompleto`) também não guarda identidade própria — ela referencia
    CADASTRO via CODCADASTRO — CODCLIENTE aqui identifica o mesmo "código de
    cliente" já usado em `ClienteAtendimento.cod_cliente` /
    `ClienteEmpresa.cod_cadastro` / `ClienteCompleto.cod_cadastro`. Por isso,
    seguindo o mesmo padrão já usado em `ClienteAtendimento` (FK simples,
    nullable, sem `relationship()`/`back_populates`), este model já ganha uma
    FK estrutural (`cliente_id` -> `clientes_completo.id`), além do código
    bruto original (`cod_cliente`) preservado à parte. Resolver de fato essa
    FK (casar CODCLIENTE com `ClienteCompleto.cod_cadastro`) é tarefa do
    agente de migração de dados, fora do escopo deste agente de estrutura.

    O cache de metadados usado para conferir esta tabela só trouxe as 3
    colunas de dado, sem informação de chave primária/índices/constraints —
    seguindo o mesmo critério já usado para as demais tabelas de junção do
    GENUS reconhecidas neste ERP (`ClienteEmpresa`, cuja PK composta real do
    GENUS também não é reaproveitada aqui), o `id` serial é a única chave
    própria deste model, e os campos originais são preservados como códigos
    brutos (`cod_*`), indexados. `cod_cnae` deliberadamente não ganha FK
    própria — não existe, no schema do GENUS já conferido, nenhuma tabela
    mestre `CNAE` para resolver contra (a descrição já vem desnormalizada em
    `descricao`).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "clientes_cnae"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cliente já migrado (resolvido de GENUS.CLIENTE via CADASTRO) ──
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True, index=True)  # resolvido de GENUS: CODCLIENTE -> CLIENTE.CODCADASTRO -> ClienteCompleto.cod_cadastro

    # ── Campos migrados de GENUS.CLIENTECNAE ──────────────────────────────
    cod_cliente = Column(Integer, nullable=True, index=True)    # GENUS: CODCLIENTE (código bruto, antes da resolução de cliente_id)
    cod_cnae = Column(String(20), nullable=True, index=True)    # GENUS: CODCNAE (código bruto — sem FK própria, não há tabela mestre CNAE no GENUS)
    descricao = Column(String(100), nullable=True)              # GENUS: DESCRI


class ClienteAnexo(Base):
    """Anexo/documento vinculado a um cliente — tabela CLIENTEANEXO do
    sistema legado GENUS (GENUS_ZANGUETTIN.FDB), módulo Cadastros (Tier 2)
    deste ERP.

    Reconhece a estrutura completa da tabela CLIENTEANEXO: 6 campos
    (CODIGO, CODCLIENTE, CODORCAMENTO INTEGER; DESCRI VARCHAR(40); TIPO
    CHAR(3); ANEXO BLOB), conferidos diretamente contra o cache de
    metadados Firebird já validado em sessão anterior deste mesmo trabalho
    de reconhecimento de estrutura do GENUS (RDB$RELATION_FIELDS /
    RDB$FIELD_TYPE / RDB$FIELD_SUB_TYPE, arquivo `all_tables_schema_out.txt`
    / `genus_full_schema.json` — `isql` não estava disponível neste
    ambiente). Nenhuma linha de dado de negócio foi lida para montar este
    model.

    ANEXO é um BLOB binário genuíno no GENUS (RDB$FIELD_TYPE 261, SUB_TYPE
    0 — blob binário, não texto —, exatamente o mesmo tipo bruto já
    conferido para `ProdutoFoto.foto`/GENUS.PRODUTOFOTO.FOTO), então aqui é
    modelado como `LargeBinary` (BYTEA no Postgres) — ajustando a sugestão
    inicial da tabela (que citava `Text`) à luz dessa mesma conferência já
    feita para `ProdutoFoto`, e não como `Text`.

    Cada linha representa um anexo (documento, imagem, PDF etc.) vinculado
    a um cliente — e, opcionalmente, a um orçamento específico daquele
    cliente (CODORCAMENTO) —, com uma descrição livre (DESCRI) e um tipo
    (TIPO, ex. extensão/categoria do arquivo). Este é o análogo, para
    clientes, de `ProdutoFoto` (para produtos). Existe também uma tabela
    prima CLIENTEANEXOINTERNO (mesmo módulo, ainda não modelada neste ERP)
    — mas ela não é uma simples variante desta: em vez de um BLOB binário
    embutido (ANEXO), guarda o nome de um arquivo hospedado em FTP
    (NOMEDOARQUIVOFTP, BLOB de texto, SUB_TYPE 1) e outras colunas
    diferentes (CODEMPRESA, CODSAIDA, DESCRI mais longo — VARCHAR(255) —,
    sem coluna TIPO), conferido no mesmo cache de metadados usado aqui.

    No GENUS, CLIENTEANEXO não guarda identidade própria do cliente
    (apenas o código bruto CODCLIENTE). Como CLIENTE (já reconhecida neste
    ERP como `ClienteCompleto`) também não guarda identidade própria — ela
    referencia CADASTRO via CODCADASTRO — CODCLIENTE aqui identifica o
    mesmo "código de cliente" já usado em `ClienteAtendimento.cod_cliente`
    / `ClienteCnae.cod_cliente` / `ClienteCompleto.cod_cadastro`. Por isso,
    seguindo o mesmo padrão já usado nesses models (FK simples, nullable,
    sem `relationship()`/`back_populates`), este model já ganha uma FK
    estrutural (`cliente_id` -> `clientes_completo.id`), além do código
    bruto original (`cod_cliente`) preservado à parte. Resolver de fato
    essa FK (casar CODCLIENTE com `ClienteCompleto.cod_cadastro`) é tarefa
    do agente de migração de dados, fora do escopo deste agente de
    estrutura.

    CODORCAMENTO é mantido deliberadamente como código bruto
    (`cod_orcamento`, sem FK própria para `Orcamento`): diferente de
    `ItemOrcamentoGenus` (que só resolve `orcamento_id` a partir do PAR
    CODEMPRESA+CODORCAMENTO contra `Orcamento.cod_empresa` +
    `Orcamento.codigo_genus`), CLIENTEANEXO não tem coluna CODEMPRESA —
    então casar CODORCAMENTO isoladamente contra `Orcamento.codigo_genus`
    não seria seguro (o mesmo número de orçamento pode se repetir entre
    empresas/filiais diferentes no GENUS). Por isso, apenas o código bruto
    é preservado aqui, sem FK obrigatória.

    CODIGO é o identificador (chave primária) original da linha dentro do
    GENUS (PK_CLIENTEANEXO) — preservado como código bruto (`codigo`), sem
    reaproveitar como PK deste ERP, seguindo o mesmo padrão usado em
    outras tabelas do GENUS (ex.: `ClienteAtendimento.codigo`).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "clientes_anexo"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cliente já migrado (resolvido de GENUS.CLIENTE via CADASTRO) ──
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True, index=True)  # resolvido de GENUS: CODCLIENTE -> CLIENTE.CODCADASTRO -> ClienteCompleto.cod_cadastro

    # ── Campos migrados de GENUS.CLIENTEANEXO (PK original: CODIGO) ───────
    codigo = Column(Integer, nullable=True, index=True)          # GENUS: CODIGO (PK original no GENUS)
    cod_cliente = Column(Integer, nullable=True, index=True)     # GENUS: CODCLIENTE (código bruto, antes da resolução de cliente_id)
    descricao = Column(String(40), nullable=True)                # GENUS: DESCRI
    anexo = Column(LargeBinary, nullable=True)                   # GENUS: ANEXO (BLOB binário)
    tipo = Column(String(3), nullable=True)                      # GENUS: TIPO
    cod_orcamento = Column(Integer, nullable=True, index=True)   # GENUS: CODORCAMENTO (código bruto — sem FK própria, ver docstring)


class Fornecedor(Base):
    """Fornecedor.

    Além dos campos originais do ERP, esta classe reconhece a estrutura
    completa da tabela FORNECEDOR do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB). Assim como em CLIENTE, no GENUS a tabela
    FORNECEDOR não guarda identidade própria (nome, documento, endereço) —
    ela referencia a tabela mestre CADASTRO através da coluna CODCADASTRO
    (ver `cod_cadastro` abaixo e o model `CadastroPessoa`, que reconhece a
    estrutura de CADASTRO). A entidade "fornecedor" completa do GENUS,
    quando migrada de fato, exige o JOIN entre FORNECEDOR (estes campos) e
    CADASTRO via CODCADASTRO — propositalmente não criamos uma FK própria
    aqui (o schema do ERP já tem seus próprios campos de identidade
    duplicados diretamente nesta tabela), apenas reconhecemos os campos
    brutos do GENUS, para não perder nenhuma informação.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "fornecedores"
    id = Column(Integer, primary_key=True, index=True)
    tipo_pessoa = Column(String(2), default="PJ")
    nome = Column(String(150), nullable=False)
    nome_fantasia = Column(String(150), nullable=True)
    cnpj = Column(String(20), unique=True, nullable=True)
    ie = Column(String(30), nullable=True)
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    celular = Column(String(20), nullable=True)
    website = Column(String(200), nullable=True)
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    prazo_entrega_dias = Column(Integer, default=0)
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    observacao = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)

    # ── Campos migrados de GENUS.FORNECEDOR ───────────────────────────────
    # Identificação / vínculo com CADASTRO (mestre de pessoas do GENUS)
    cod_cadastro = Column(Integer, nullable=True)                          # GENUS: CODCADASTRO
    filial = Column(Integer, nullable=True)                                # GENUS: FILIAL
    empresa_fornecedor = Column(String(10), nullable=True)                 # GENUS: EMPRESAFORNECEDOR

    # Contato / fiscal
    contato = Column(String(20), nullable=True)                           # GENUS: CONTATO
    cnae = Column(String(10), nullable=True)                              # GENUS: CNAE
    cod_historico = Column(String(12), nullable=True)                     # GENUS: CODHISTORICO
    cod_cfop = Column(String(5), nullable=True)                           # GENUS: CODCFOP
    cod_cond_pagto = Column(String(5), nullable=True)                     # GENUS: CODCONDPAGTO
    cod_transporte = Column(Integer, nullable=True)                       # GENUS: CODTRANSPORTE
    taxa_compra = Column(Float, nullable=True)                            # GENUS: TAXACOMPRA


class FornecedorBanco(Base):
    """Dados bancários de fornecedor (GENUS.FORNECEDORBANCO) — módulo
    Cadastros (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela FORNECEDORBANCO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente já
    estabelecido para `PRODUTO`/`Produto` e para as demais tabelas GENUS
    já reconhecidas neste ERP que também guardam colunas
    BANCO/AGENCIA/CONTA/TITULAR (`ContaGenus`, `Funcionario`,
    `Representante`).

    Um fornecedor pode ter mais de uma conta bancária cadastrada para
    recebimento de pagamento (ex.: contas em bancos diferentes) — por
    isso esta é uma tabela 1:N (uma linha por conta bancária, várias
    linhas possíveis por fornecedor), e não campos únicos espalhados no
    cadastro principal do fornecedor (`Fornecedor`). Mesmo padrão já
    usado para tabelas 1:N filhas de cadastro neste ERP (ex.:
    `ClienteCnae`, `ClienteEmpresa`, `ClienteAtendimento`, todas filhas de
    cliente).

    Não foi possível confirmar os tipos contra a metadata Firebird ao
    vivo (RDB$RELATION_FIELDS etc.) neste ambiente de execução (sem
    acesso ao arquivo GENUS_ZANGUETTIN.FDB nem a `isql` aqui, e sem cache
    de metadados desta tabela específica salvo de sessão anterior) — os
    tipos abaixo seguem exatamente a sugestão já fornecida para esta
    tabela pelo agente de estrutura, cruzada com o mesmo critério usado em
    colunas de mesmo nome já reconhecidas em outras tabelas GENUS deste
    ERP: BANCO String(3) (idêntico a `ContaGenus.banco`,
    `Funcionario.banco` e `Representante.banco`, todos String(3)),
    AGENCIA String(5) (idêntico a `Funcionario.agencia`/
    `Representante.agencia`; `ContaGenus.agencia` usa String(4) —
    divergência aceitável entre tabelas distintas do GENUS, cada uma com
    sua própria largura de coluna), CONTA String(15) (idêntico a
    `ContaGenus.conta`) e TITULAR String(50) (`ContaGenus.titular` usa
    String(30); mantido String(50) conforme a sugestão específica desta
    tabela, por segurança contra truncamento).

    CODFORNECEDOR, apesar do nome, segue o mesmo precedente já
    estabelecido em `ProdutoReferencia.cod_fornecedor`,
    `ProdutoConversaoFornecedor.cod_fornecedor`, `ContaPagar.cod_fornecedor`
    e `FaturaPagar.cod_fornecedor`: não referencia a chave serial própria
    (`id`) deste ERP para `Fornecedor`, e sim, muito provavelmente, o
    mesmo CODCADASTRO usado como código de fornecedor em todo o GENUS (ver
    `Fornecedor.cod_cadastro`). Por isso, seguindo esse mesmo precedente
    (repetido em todas as tabelas GENUS que referenciam fornecedor neste
    ERP), nenhuma FK própria é criada para o código bruto `cod_fornecedor`
    em si — permanece como código bruto, indexado; resolvê-lo de fato
    contra `Fornecedor.cod_cadastro` é tarefa do agente de migração de
    dados, fora do escopo deste agente de estrutura.

    Separadamente, e só para permitir que a janela deste ERP (aba
    "Bancos" de `FornecedorWindow`) já funcione hoje — sem esperar a
    migração de dados do GENUS —, este model também ganha uma FK
    estrutural própria do ERP, `fornecedor_id -> fornecedores.id`, nullable
    e sem `relationship()`/`back_populates`, mesmo padrão já usado em
    `ClienteCnae.cliente_id -> clientes_completo.id` para o mesmo tipo de
    situação (tabela 1:N filha de cadastro, cujo código bruto do GENUS não
    é diretamente resolvível contra a chave própria deste ERP). Essa FK é
    preenchida pela própria aplicação quando o usuário cadastra uma conta
    bancária pela tela, com o fornecedor já aberto — é independente de
    `cod_fornecedor` (que continua reservado ao código bruto do GENUS, a
    ser resolvido pelo agente de migração de dados).

    CODIGO é o identificador original da linha no GENUS — como em outras
    tabelas GENUS "filhas por entidade pai" já reconhecidas neste ERP
    (`ContaGenus`, `PrecoProduto`), é provável que a chave primária real
    do GENUS seja composta (ex.: CODFORNECEDOR + CODIGO) — não
    confirmável aqui sem a metadata Firebird ao vivo. Essa possível chave
    composta não é reaproveitada como PK deste ERP — o `id` serial é a
    única chave própria deste model, e os campos originais são
    preservados como códigos brutos (`codigo`, `cod_fornecedor`),
    indexados, nullable (padrão deste ERP de nunca exigir um campo
    estrutural ainda não populado por importação).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "fornecedores_banco"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o fornecedor já cadastrado neste ERP (independente do GENUS) ──
    fornecedor_id = Column(Integer, ForeignKey("fornecedores.id"), nullable=True, index=True)  # próprio deste ERP — preenchido ao cadastrar pela tela, ver docstring

    # ── Campos migrados de GENUS.FORNECEDORBANCO ──────────────────────────
    codigo = Column(Integer, nullable=True, index=True)          # GENUS: CODIGO (PK original no GENUS, provavelmente composta com CODFORNECEDOR)
    cod_fornecedor = Column(Integer, nullable=True, index=True)  # GENUS: CODFORNECEDOR (código bruto — na verdade um CODCADASTRO; requer resolução futura contra CADASTRO/Fornecedor.cod_cadastro; sem FK própria, mesmo precedente de ProdutoReferencia.cod_fornecedor/ContaPagar.cod_fornecedor)
    banco = Column(String(3), nullable=True)                    # GENUS: BANCO
    agencia = Column(String(5), nullable=True)                  # GENUS: AGENCIA
    conta = Column(String(15), nullable=True)                   # GENUS: CONTA
    titular = Column(String(50), nullable=True)                 # GENUS: TITULAR


class Funcionario(Base):
    """Funcionário.

    Além dos campos originais do ERP, esta classe reconhece a estrutura
    completa da tabela FUNCIONARIO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB). Assim como em CLIENTE/FORNECEDOR, no GENUS a
    tabela FUNCIONARIO não guarda identidade própria (nome, documento,
    endereço) — ela referencia a tabela mestre CADASTRO através da coluna
    CODCADASTRO (ver `cod_cadastro` abaixo e o model `CadastroPessoa`, que
    reconhece a estrutura de CADASTRO). A entidade "funcionário" completa do
    GENUS, quando migrada de fato, exige o JOIN entre FUNCIONARIO (estes
    campos) e CADASTRO via CODCADASTRO — propositalmente não criamos uma FK
    própria aqui (o schema do ERP já tem seus próprios campos de identidade
    duplicados diretamente nesta tabela), apenas reconhecemos os campos
    brutos do GENUS, para não perder nenhuma informação.

    Onde um campo do GENUS já correspondia, em significado e granularidade,
    a um campo original do ERP (SALARIO -> salario, DT_ADMISSAO ->
    data_admissao), o campo existente foi apenas anotado com o comentário
    `# GENUS: COLUNA`, sem duplicar a coluna. `CODCARGO` é um código bruto
    de uma tabela de cargos ainda não modelada neste ERP, distinto do campo
    livre `cargo` já existente aqui — por isso foi mantido separado como
    `cod_cargo`.

    Diversos outros campos são apenas códigos brutos de tabelas legadas
    ainda não modeladas neste ERP (CODEMPRESA -> EMPRESA, CODCONTAS ->
    PLANOCONTA, CODGRUPOMENU/CODFUNCAO -> tabelas administrativas do
    GENUS). Propositalmente não criamos FK própria para eles aqui — são
    mantidos como códigos brutos (`cod_*`), apenas para não perder
    informação; a entidade real, quando migrada de fato, vai exigir
    resolver essas referências contra as tabelas correspondentes. CODSETOR
    é exceção: já tem model dedicado neste ERP (`Setor`), mas mesmo assim
    `cod_setor` permanece como código bruto — resolver a referência contra
    `Setor.codigo` é tarefa do agente de migração de dados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "funcionarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cpf = Column(String(14), unique=True, nullable=True)
    rg = Column(String(20), nullable=True)
    data_nascimento = Column(DateTime, nullable=True)
    data_admissao = Column(DateTime, nullable=True)                       # GENUS: DT_ADMISSAO
    cargo = Column(String(100), nullable=True)
    departamento = Column(String(100), nullable=True)
    salario = Column(Float, default=0.0)                                  # GENUS: SALARIO
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    ativo = Column(Boolean, default=True)

    # ── Campos migrados de GENUS.FUNCIONARIO ──────────────────────────────
    # Identificação / vínculo com CADASTRO (mestre de pessoas do GENUS)
    cod_cadastro = Column(Integer, nullable=True)                         # GENUS: CODCADASTRO
    cod_empresa = Column(Integer, nullable=True)                          # GENUS: CODEMPRESA
    cadastro_cliente = Column(String(1), nullable=True)                  # GENUS: CADASTROCLIENTE

    # Acesso / login ao sistema
    nivel = Column(String(1), nullable=True)                             # GENUS: NIVEL
    senha = Column(String(10), nullable=True)                            # GENUS: SENHA
    usuario = Column(String(15), nullable=True)                          # GENUS: USUARIO
    cod_grupo_menu = Column(Integer, nullable=True)                      # GENUS: CODGRUPOMENU
    alterar_login = Column(String(1), nullable=True)                     # GENUS: ALTERARLOGIN
    bloq_visualizar_funcionarios = Column(String(1), nullable=True)      # GENUS: BLOQVISUALIZARFUNCIONARIOS

    # Dados bancários
    banco = Column(String(3), nullable=True)                            # GENUS: BANCO
    agencia = Column(String(5), nullable=True)                          # GENUS: AGENCIA
    digito_agencia = Column(String(1), nullable=True)                   # GENUS: DIGITOAGENCIA
    conta = Column(String(20), nullable=True)                           # GENUS: CONTA
    digito_conta = Column(String(1), nullable=True)                     # GENUS: DIGITOCONTA

    # Financeiro / contas
    cod_contas = Column(Integer, nullable=True)                         # GENUS: CODCONTAS
    caixa = Column(String(1), nullable=True)                            # GENUS: CAIXA

    # Configuração de e-mail (SMTP)
    smtp_porta = Column(Integer, nullable=True)                         # GENUS: SMTP_PORTA
    smtp_host = Column(String(60), nullable=True)                       # GENUS: SMTP_HOST
    smtp_password = Column(String(20), nullable=True)                   # GENUS: SMTP_PASSWORD
    smtp_username = Column(String(60), nullable=True)                   # GENUS: SMTP_USERNAME
    from_address = Column(String(60), nullable=True)                    # GENUS: FROM_ADDRESS
    from_name = Column(String(20), nullable=True)                       # GENUS: FROM_NAME
    autenticar_email_ssl = Column(String(1), nullable=True)             # GENUS: AUTENTICAREMAILSSL

    # Cargo / função / uniforme
    cod_cargo = Column(Integer, nullable=True)                          # GENUS: CODCARGO
    cod_funcao = Column(Integer, nullable=True)                         # GENUS: CODFUNCAO
    cod_setor = Column(Integer, nullable=True)                          # GENUS: CODSETOR (FK bruta -> SETOR, já modelada em `Setor`)
    n_carteira = Column(String(20), nullable=True)                      # GENUS: NCARTEIRA
    camisa = Column(String(5), nullable=True)                           # GENUS: CAMISA
    sapato = Column(String(5), nullable=True)                           # GENUS: SAPATO
    calca = Column(String(5), nullable=True)                            # GENUS: CALCA

    # Jornada de trabalho
    horas_trabalhadas = Column(String(7), nullable=True)                # GENUS: HORASTRABALHADAS
    horas_efetivas = Column(String(7), nullable=True)                   # GENUS: HORASEFETIVAS
    data_demissao = Column(DateTime, nullable=True)                     # GENUS: DT_DEMISSAO

    # Carteira de trabalho (CTPS)
    ctps = Column(String(7), nullable=True)                             # GENUS: CTPS
    serie = Column(String(4), nullable=True)                            # GENUS: SERIE
    emissao_ctps = Column(DateTime, nullable=True)                      # GENUS: EMISSAOCTPS
    uf_ctps = Column(String(2), nullable=True)                          # GENUS: UFCTPS
    cbo = Column(String(8), nullable=True)                              # GENUS: CBO

    # Vendedor
    vendedor = Column(String(1), nullable=True)                         # GENUS: VENDEDOR

    # Permissões — cadastro/atendimento de clientes
    exibe_dados = Column(String(1), nullable=True)                              # GENUS: EXIBEDADOS
    liberar_pre_pedido = Column(String(1), nullable=True)                       # GENUS: LIBERARPREPEDIDO
    consultar_produto = Column(String(1), nullable=True)                        # GENUS: CONSULTARPRODUTO
    receber_cotacao_email = Column(String(1), nullable=True)                    # GENUS: RECEBERCOTACAOEMAIL
    permitir_anexo_cliente = Column(String(1), nullable=True)                   # GENUS: PERMITIRANEXOCLIENTE
    permitir_inativar_clientes = Column(String(1), nullable=True)               # GENUS: PERMITIRINATIVARCLIENTES
    permitir_campo_bloqueado_cliente = Column(String(1), nullable=True)         # GENUS: PERMITIRCAMPOBLOQUEADOCLIENTE
    aprovar_pre_pedido = Column(String(1), nullable=True)                       # GENUS: APROVARPREPEDIDO
    visualizar_cotacao_preco = Column(String(1), nullable=True)                 # GENUS: VISUALIZARCOTACAOPRECO
    alterar_limite_cliente = Column(String(1), nullable=True)                   # GENUS: ALTERARLIMITECLIENTE
    permitir_imprimir_lgpd_cliente = Column(String(1), nullable=True)           # GENUS: PERMITIRIMPRIMIRLGPDCLIENTE
    permitir_anexo_funcionario = Column(String(1), nullable=True)               # GENUS: PERMITIRANEXOFUNCIONARIO

    # Permissões — financeiro
    permitir_acessar_cond_pagamento = Column(String(1), nullable=True)          # GENUS: PERMITIRACESSARCONDPAGAMENTO
    permitir_alterar_juros = Column(String(1), nullable=True)                   # GENUS: PERMITIRALTERARJUROS
    permitir_baixar_alterar_parcelas = Column(String(1), nullable=True)         # GENUS: PERMITIRBAIXARALTERARPARCELAS
    permitir_tornar_parcelas_pendentes = Column(String(1), nullable=True)       # GENUS: PERMITIRTORNARPARCELASPENDENTES
    permitir_redefinir_parcelas = Column(String(1), nullable=True)              # GENUS: PERMITIRREDEFINIRPARCELAS
    permitir_excluir_pagar_receber = Column(String(1), nullable=True)           # GENUS: PERMITIREXCLUIRPAGARRECEBER

    # Permissões — estoque / romaneio
    permitir_visualizar_custo = Column(String(1), nullable=True)                # GENUS: PERMITIRVISUALIZARCUSTO
    permitir_alterar_romaneio_fechado = Column(String(1), nullable=True)        # GENUS: PERMITIRALTERARROMANEIOFECHADO
    permitir_excluir_romaneio = Column(String(1), nullable=True)                # GENUS: PERMITIREXCLUIRROMANEIO
    permitir_alterar_unit_saidas = Column(String(1), nullable=True)             # GENUS: PERMITIRALTERARUNITSAIDAS
    acessar_menu_batelada = Column(String(1), nullable=True)                    # GENUS: ACESSARMENUBATELADA

    # Transferência entre empresas / código antigo (multi-empresa GENUS)
    cod_antigo_transfere1 = Column(Integer, nullable=True)              # GENUS: COD_ANTIGO_TRANSFERE1
    cod_antigo_transfere2 = Column(Integer, nullable=True)              # GENUS: COD_ANTIGO_TRANSFERE2
    cod_empresa_transf1 = Column(Integer, nullable=True)                # GENUS: COD_EMPRESA_TRANSF1
    cod_empresa_transf2 = Column(Integer, nullable=True)                # GENUS: COD_EMPRESA_TRANSF2


class PerfilAcesso(Base):
    __tablename__ = "perfis_acesso"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, unique=True)   # admin, gerente, operador, vendedor
    descricao = Column(String(300), nullable=True)
    permissoes = Column(JSON, default=dict)   # {"cadastros": "rw", "financeiro": "r", ...}


class MovimentoEstoque(Base):
    __tablename__ = "movimentos_estoque"
    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    deposito_id = Column(Integer, ForeignKey("depositos.id"), nullable=True)
    tipo = Column(String(20), nullable=False)      # entrada | saida | ajuste | transferencia
    quantidade = Column(Float, nullable=False)
    custo_unitario = Column(Float, nullable=True)
    documento_ref = Column(String(100), nullable=True)   # NF, PedidoCompra, PedidoVenda
    observacao = Column(String(300), nullable=True)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)


class SolicitacaoCompra(Base):
    __tablename__ = "solicitacoes_compra"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    solicitante = Column(String(150), nullable=True)
    centro_custo_id = Column(Integer, ForeignKey("centros_custo.id"), nullable=True)
    status = Column(String(20), default="pendente")   # pendente | aprovada | cancelada
    observacao = Column(String(500), nullable=True)
    itens = relationship("ItemSolicitacao", back_populates="solicitacao", cascade="all, delete-orphan")


class ItemSolicitacao(Base):
    __tablename__ = "itens_solicitacao"
    id = Column(Integer, primary_key=True, index=True)
    solicitacao_id = Column(Integer, ForeignKey("solicitacoes_compra.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    unidade = Column(String(10), nullable=True)
    solicitacao = relationship("SolicitacaoCompra", back_populates="itens")


class PedidoCompra(Base):
    __tablename__ = "pedidos_compra"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    fornecedor_id = Column(Integer, ForeignKey("fornecedores.id"), nullable=False)
    data_emissao = Column(DateTime, default=datetime.datetime.utcnow)
    data_entrega_prevista = Column(DateTime, nullable=True)
    data_recebimento = Column(DateTime, nullable=True)
    status = Column(String(20), default="aberto")   # aberto | recebido_parcial | recebido | cancelado
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    total = Column(Float, default=0.0)
    observacao = Column(String(500), nullable=True)
    itens = relationship("ItemPedidoCompra", back_populates="pedido", cascade="all, delete-orphan")
    fornecedor = relationship("Fornecedor")


class ItemPedidoCompra(Base):
    __tablename__ = "itens_pedido_compra"
    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos_compra.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    quantidade_recebida = Column(Float, default=0.0)
    preco_unitario = Column(Float, nullable=False)
    unidade = Column(String(10), nullable=True)
    pedido = relationship("PedidoCompra", back_populates="itens")


class Orcamento(Base):
    """Orçamento de venda.

    Além dos campos originais do ERP, esta tabela reconhece todos os campos
    da tabela ORCAMENTO do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), para
    permitir importar o histórico de orçamentos sem perda de informação.
    Nomes e tipos foram conferidos contra o schema Firebird do GENUS,
    seguindo o mesmo precedente estabelecido para `Produto`/GENUS.PRODUTO e
    `ContaPagar`/GENUS.PAGAR.

    Onde um campo do GENUS já correspondia, em significado e granularidade,
    a um campo original do ERP (ex.: EMISSAO -> data_emissao, VENCIMEN ->
    data_validade, OBS -> observacao, PERDESCONTOTOTAL -> desconto_percentual,
    CLINOME -> nome_cliente), o campo existente foi apenas anotado com o
    comentário `# GENUS: COLUNA`, sem duplicar a coluna.

    Os campos CLI* (CLIENDERECO, CLINUMERO, CLICODCIDADE, CLICEP, CLIFONE,
    CLICONTATO, CLIBAIRRO, CLICPFCNPJ) são um "snapshot" do cadastro do
    cliente no momento do orçamento, tal como no GENUS — não substituem o
    relacionamento com CADASTRO/CLIENTE (aqui, `cliente_id` ->
    `clientes_completo`), apenas preservam o valor histórico gravado.

    Diversos outros campos são apenas códigos brutos de tabelas legadas
    ainda não modeladas neste ERP (CODCONDPAGTO -> CONDPAGTO,
    CODFUNCIONARIO -> FUNCIONARIO/CADASTRO, CODTRANSPORTADOR ->
    TRANSPORTADOR, CODTABELAPRECO -> TABELAPRECO, CODADM/CODAGREGADO ->
    tabelas administrativas do GENUS). Propositalmente não criamos FK
    própria para eles aqui — são mantidos como códigos brutos (`cod_*`),
    apenas para não perder informação; a entidade real, quando migrada de
    fato, vai exigir resolver essas referências contra as tabelas
    correspondentes.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "orcamentos"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True)
    nome_cliente = Column(String(150), nullable=True)   # GENUS: CLINOME (para orcamento rápido sem cadastro)
    data_emissao = Column(DateTime, default=datetime.datetime.utcnow)   # GENUS: EMISSAO
    data_validade = Column(DateTime, nullable=True)                    # GENUS: VENCIMEN
    status = Column(String(20), default="aberto")   # aberto | aprovado | recusado | convertido
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    representante_id = Column(Integer, ForeignKey("representantes.id"), nullable=True)
    desconto_percentual = Column(Float, default=0.0)                   # GENUS: PERDESCONTOTOTAL
    total = Column(Float, default=0.0)
    observacao = Column(String(500), nullable=True)                    # GENUS: OBS
    itens = relationship("ItemOrcamento", back_populates="orcamento", cascade="all, delete-orphan")
    itens_genus = relationship("ItemOrcamentoGenus", back_populates="orcamento", cascade="all, delete-orphan")

    # ── Campos migrados de GENUS.ORCAMENTO ────────────────────────────────
    # Identificação / chave original do orçamento no GENUS
    cod_empresa = Column(Integer, nullable=True)                       # GENUS: CODEMPRESA
    codigo_genus = Column(Integer, nullable=True, index=True)          # GENUS: CODIGO
    cod_cliente = Column(Integer, nullable=True)                       # GENUS: CODCLIENTE

    # Condição de pagamento / funcionário / aprovação
    cod_cond_pagto = Column(String(5), nullable=True)                  # GENUS: CODCONDPAGTO
    cod_funcionario = Column(Integer, nullable=True)                   # GENUS: CODFUNCIONARIO
    avista_prazo = Column(String(1), nullable=True)                    # GENUS: AVISTAPRAZO ('A' à vista / 'P' a prazo)
    dt_pedido = Column(DateTime, nullable=True)                        # GENUS: DTPEDIDO
    liberado = Column(String(1), nullable=True)                        # GENUS: LIBERADO
    dt_liberado = Column(DateTime, nullable=True)                      # GENUS: DTLIBERADO
    cod_adm = Column(Integer, nullable=True)                           # GENUS: CODADM

    # Snapshot do cliente no momento do orçamento
    cli_endereco = Column(String(50), nullable=True)                   # GENUS: CLIENDERECO
    cli_numero = Column(String(6), nullable=True)                      # GENUS: CLINUMERO
    cli_cod_cidade = Column(Integer, nullable=True)                    # GENUS: CLICODCIDADE
    cli_cep = Column(String(10), nullable=True)                        # GENUS: CLICEP
    cli_fone = Column(String(15), nullable=True)                       # GENUS: CLIFONE
    cli_contato = Column(String(20), nullable=True)                    # GENUS: CLICONTATO
    cli_bairro = Column(String(35), nullable=True)                     # GENUS: CLIBAIRRO
    cli_cpf_cnpj = Column(String(14), nullable=True)                   # GENUS: CLICPFCNPJ

    # Frete / transporte / tabela de preço
    frete = Column(Float, nullable=True)                               # GENUS: FRETE
    cod_transportador = Column(Integer, nullable=True)                 # GENUS: CODTRANSPORTADOR
    tipo_frete = Column(String(3), nullable=True)                      # GENUS: TIPOFRETE
    cod_tabela_preco = Column(Integer, nullable=True)                  # GENUS: CODTABELAPRECO

    # Status / motivo / prazo (domínio bruto do GENUS, distinto do `status` do ERP)
    status_genus = Column(String(2), nullable=True)                    # GENUS: STATUS
    motivo = Column(String(2), nullable=True)                          # GENUS: MOTIVO
    prazo_entrega = Column(DateTime, nullable=True)                    # GENUS: PRAZOENTREGA

    # Diversos
    cod_agregado = Column(Integer, nullable=True)                      # GENUS: CODAGREGADO
    especie = Column(String(15), nullable=True)                        # GENUS: ESPECIE


class ItemOrcamento(Base):
    __tablename__ = "itens_orcamento"
    id = Column(Integer, primary_key=True, index=True)
    orcamento_id = Column(Integer, ForeignKey("orcamentos.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    desconto_percentual = Column(Float, default=0.0)
    unidade = Column(String(10), nullable=True)
    orcamento = relationship("Orcamento", back_populates="itens")


class ItemOrcamentoGenus(Base):
    """Item de orçamento (GENUS) — linha do orçamento no sistema legado.

    Reconhece a estrutura completa da tabela ORCAMENTO2 do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — segundo model do módulo Vendas/Faturamento
    (Tier 2) deste ERP, seguindo o mesmo precedente estabelecido para
    `ItemSaida`/GENUS.SAILAN. Tipos, chave primária e foreign keys foram
    conferidos diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS),
    sem ler nenhuma linha de dado de negócio.

    No GENUS, ORCAMENTO2 é a tabela "filha" de ORCAMENTO (confirmado via
    RDB$REF_CONSTRAINTS: FK_ORCAMENTO2_ORCAMENTO liga (CODEMPRESA +
    CODORCAMENTO) -> PK_ORCAMENTO): ORCAMENTO guarda o cabeçalho do
    orçamento de venda (já reconhecido neste ERP como `Orcamento`, expandido
    no Tier 1 desta sessão) e ORCAMENTO2 guarda, para cada combinação
    orçamento + produto (CODEMPRESA + CODORCAMENTO + CODPRODUTO — há também
    FK_ORCAMENTO2_PRODUTO ligando CODPRODUTO -> PK_PRODUTO), uma linha
    daquele orçamento — quantidade, valores unitário/total, custo, desconto,
    frete e IPI — ou seja, um mesmo orçamento tem muitas linhas em
    ORCAMENTO2 (uma por produto orçado).

    Diferente de `ItemOrcamento` (model ERP-nativo já existente neste ERP,
    usado hoje pela janela de Orçamentos do módulo Vendas — ver
    `VendasWindow`/`NovoOrcamentoWindow` — para lançar itens livres de um
    orçamento novo, sem nenhuma anotação `# GENUS:`), este model é dedicado
    e não reaproveita `ItemOrcamento`, para não misturar o formulário
    comercial "limpo" do ERP com a estrutura bruta do legado — mesmo
    critério já usado para não reaproveitar `ItemPedidoVenda` em
    `ItemSaida` (ver docstring de `ItemSaida` acima).

    Este model é ligado ao cadastro de produto já migrado (`Produto`, 5.629
    produtos reais) através da FK `produto_id`. Essa FK só pode ser
    resolvida de fato relacionando GENUS.ORCAMENTO2.CODPRODUTO com
    GENUS.PRODUTO.CODIGO (= `Produto.codigo` neste ERP) — tarefa do agente
    de migração de dados, não deste agente de estrutura. Por isso
    `produto_id` é opcional (nullable) e o código bruto original
    (`cod_produto`) é preservado à parte, para não perder informação até
    que essa resolução aconteça.

    Este model também é ligado ao orçamento já reconhecido neste ERP
    (`Orcamento`) através da FK `orcamento_id`. Essa FK só pode ser
    resolvida de fato relacionando (GENUS.ORCAMENTO2.CODEMPRESA,
    GENUS.ORCAMENTO2.CODORCAMENTO) com (`Orcamento.cod_empresa`,
    `Orcamento.codigo_genus`) — novamente, tarefa do agente de migração de
    dados. Por isso `orcamento_id` é opcional (nullable) e os códigos brutos
    originais (`cod_empresa`, `cod_orcamento`) são preservados à parte.

    CODIGO é o identificador (chave primária) original da linha dentro do
    GENUS (PK_ORCAMENTO2) — preservado como código bruto (`codigo`), sem
    reaproveitar como PK deste ERP, seguindo o mesmo padrão usado em outras
    tabelas do GENUS (ex.: `ItemSaida.codigo` <- GENUS.SAILAN.CODIGO).

    DESCRIPRODUTO é um snapshot da descrição do produto no momento do
    orçamento (histórico) — preservado à parte de `Produto.nome`, pelo mesmo
    motivo que `Orcamento` preserva o snapshot do cliente (CLINOME, CLI* —
    ver docstring de `Orcamento`).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "itens_orcamento_genus"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculos com cadastros já migrados neste ERP ──────────────────────
    orcamento_id = Column(Integer, ForeignKey("orcamentos.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODORCAMENTO) -> (Orcamento.cod_empresa, Orcamento.codigo_genus)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)      # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Identificação / chave original da linha e do orçamento (GENUS) ────
    codigo = Column(Integer, nullable=True, index=True)            # GENUS: CODIGO (identificador original da linha no GENUS — PK_ORCAMENTO2)
    cod_empresa = Column(Integer, nullable=True, index=True)        # GENUS: CODEMPRESA
    cod_orcamento = Column(Integer, nullable=True, index=True)      # GENUS: CODORCAMENTO (FK bruta para ORCAMENTO — ver Orcamento.codigo_genus)
    cod_produto = Column(String(15), nullable=True, index=True)     # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    descricao_produto = Column(String(120), nullable=True)          # GENUS: DESCRIPRODUTO (snapshot da descrição do produto no momento do orçamento)

    # ── Quantidades / valores comerciais ───────────────────────────────────
    qtde = Column(Float, nullable=True)              # GENUS: QTDE
    unitario = Column(Float, nullable=True)          # GENUS: UNITARIO
    custo = Column(Float, nullable=True)             # GENUS: CUSTO
    desconto = Column(Float, nullable=True)          # GENUS: DESCONTO
    per_desconto = Column(Float, nullable=True)      # GENUS: PERDESCONTO
    frete = Column(Float, nullable=True)             # GENUS: FRETE
    total = Column(Float, nullable=True)             # GENUS: TOTAL
    ipi = Column(Float, nullable=True)               # GENUS: IPI
    observacao = Column(Text, nullable=True)         # GENUS: OBS

    orcamento = relationship("Orcamento", back_populates="itens_genus")
    produto = relationship("Produto", back_populates="itens_orcamento_genus")


class PedidoVenda(Base):
    """Pedido de venda.

    Além dos campos originais do ERP, esta tabela reconhece todos os campos
    da tabela PEDIDO do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), para
    permitir importar o histórico de pedidos de venda sem perda de
    informação. Nomes e tipos foram conferidos contra o schema Firebird do
    GENUS, seguindo o mesmo precedente estabelecido para
    `Produto`/GENUS.PRODUTO e `Orcamento`/GENUS.ORCAMENTO.

    Onde um campo do GENUS já correspondia, em significado e granularidade,
    a um campo original do ERP (EMISSAO -> data_emissao, DTPREVISAO ->
    data_entrega_prevista, TOTAL -> total, OBS -> observacao), o campo
    existente foi apenas anotado com o comentário `# GENUS: COLUNA`, sem
    duplicar a coluna.

    Diversos outros campos são apenas códigos brutos de tabelas legadas
    ainda não modeladas neste ERP (CODCLIENTE -> CADASTRO/CLIENTE via
    CLIENTE, CODREPRESENTANTE -> REPRESENTANTE, CODTRANSPORTADOR ->
    TRANSPORTADOR, CODCONDPAGTO -> CONDPAGTO, CODCARTEIRA, CODTABELAPRECO ->
    TABELAPRECO, CODCONTAS -> PLANOCONTA, CODAGREGADO/CODCHAVE/
    CODMOVTOGRADE -> tabelas administrativas do GENUS). Propositalmente não
    criamos FK própria para eles aqui — são mantidos como códigos brutos
    (`cod_*`), apenas para não perder informação; a entidade real, quando
    migrada de fato, vai exigir resolver essas referências contra as
    tabelas correspondentes.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "pedidos_venda"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    orcamento_id = Column(Integer, ForeignKey("orcamentos.id"), nullable=True)
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True)
    nome_cliente = Column(String(150), nullable=True)
    data_emissao = Column(DateTime, default=datetime.datetime.utcnow)   # GENUS: EMISSAO
    data_entrega_prevista = Column(DateTime, nullable=True)             # GENUS: DTPREVISAO
    data_faturamento = Column(DateTime, nullable=True)
    status = Column(String(20), default="aberto")   # aberto | faturado | cancelado | entregue
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    representante_id = Column(Integer, ForeignKey("representantes.id"), nullable=True)
    transportadora_id = Column(Integer, ForeignKey("transportadoras.id"), nullable=True)
    desconto_percentual = Column(Float, default=0.0)
    total = Column(Float, default=0.0)                                 # GENUS: TOTAL
    observacao = Column(String(500), nullable=True)                    # GENUS: OBS
    itens = relationship("ItemPedidoVenda", back_populates="pedido", cascade="all, delete-orphan")
    itens_genus = relationship("ItemPedidoLan", back_populates="pedido", cascade="all, delete-orphan")
    logs_alteracao = relationship("LogAlteracaoPedido", back_populates="pedido", cascade="all, delete-orphan")
    notas_vinculadas = relationship("PedidoNota", back_populates="pedido", cascade="all, delete-orphan")

    # ── Campos migrados de GENUS.PEDIDO ───────────────────────────────────
    # Identificação / chave original do pedido no GENUS
    cod_empresa = Column(Integer, nullable=True)                       # GENUS: CODEMPRESA
    codigo_genus = Column(Integer, nullable=True, index=True)          # GENUS: CODIGO
    doc = Column(Integer, nullable=True)                               # GENUS: DOC
    serie = Column(String(4), nullable=True)                           # GENUS: SERIE
    cod_cliente = Column(Integer, nullable=True)                       # GENUS: CODCLIENTE
    cod_representante = Column(Integer, nullable=True)                 # GENUS: CODREPRESENTANTE
    cod_cond_pagto = Column(String(5), nullable=True)                  # GENUS: CODCONDPAGTO
    cod_chave = Column(Integer, nullable=True)                         # GENUS: CODCHAVE

    # Fiscal
    cod_cfop = Column(String(5), nullable=True)                        # GENUS: CODCFOP
    cod_cfop2 = Column(String(5), nullable=True)                       # GENUS: CODCFOP2
    icms_base = Column(Float, nullable=True)                           # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                          # GENUS: ICMS_VALOR
    icms_base_subst = Column(Float, nullable=True)                     # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                    # GENUS: ICMS_VALOR_SUBST
    ipi_valor = Column(Float, nullable=True)                           # GENUS: IPI_VALOR
    credito_icms = Column(Float, nullable=True)                        # GENUS: CREDITOICMS
    tipo_nf = Column(String(1), nullable=True)                         # GENUS: TIPONF
    tipo_cliente = Column(String(1), nullable=True)                    # GENUS: TIPOCLIENTE
    cte = Column(Integer, nullable=True)                               # GENUS: CTE
    numero_nf = Column(Integer, nullable=True)                         # GENUS: NUMERONF
    total_nf = Column(Float, nullable=True)                            # GENUS: TOTALNF

    # Valores / quantidades
    valor_produtos = Column(Float, nullable=True)                      # GENUS: VAL_PRO
    quantidade_genus = Column(String(10), nullable=True)               # GENUS: QUANTIDADE
    peso_bruto_genus = Column(String(15), nullable=True)               # GENUS: BRUTO
    peso_liquido_genus = Column(String(15), nullable=True)             # GENUS: LIQUIDO
    valor_unit = Column(Float, nullable=True)                          # GENUS: VALORUNIT
    qtde_kg = Column(Float, nullable=True)                             # GENUS: QTDEKG
    valor_kg = Column(Float, nullable=True)                            # GENUS: VALORKG

    # Frete / transporte
    frete = Column(Float, nullable=True)                               # GENUS: FRETE
    seguro = Column(Float, nullable=True)                              # GENUS: SEGURO
    outras_despesas = Column(Float, nullable=True)                     # GENUS: OUTRAS
    cod_transportador = Column(Integer, nullable=True)                 # GENUS: CODTRANSPORTADOR
    frete_conta = Column(String(1), nullable=True)                     # GENUS: FRETECONTA
    tipo_frete = Column(String(3), nullable=True)                      # GENUS: TIPOFRETE
    perc_frete = Column(Float, nullable=True)                          # GENUS: PERCFRETE
    valor_frete = Column(Float, nullable=True)                         # GENUS: VALORFRETE
    frete_interno = Column(Float, nullable=True)                       # GENUS: FRETEINTERNO
    tipo_transporte = Column(String(1), nullable=True)                 # GENUS: TIPOTRANSPORTE
    local_entrega = Column(String(50), nullable=True)                  # GENUS: LOCALENTREGA
    voltagem = Column(Integer, nullable=True)                          # GENUS: VOLTAGEM

    # Descontos / acréscimos / comissão
    desc_acres = Column(Float, nullable=True)                          # GENUS: DESC_ACRES
    descto1 = Column(Float, nullable=True)                             # GENUS: DESCTO1
    descto2 = Column(Float, nullable=True)                             # GENUS: DESCTO2
    descto3 = Column(Float, nullable=True)                             # GENUS: DESCTO3
    descto4 = Column(Float, nullable=True)                             # GENUS: DESCTO4
    descto5 = Column(Float, nullable=True)                             # GENUS: DESCTO5
    perc_desconto = Column(Float, nullable=True)                       # GENUS: PERCDESCONTO
    desconto_interno = Column(Float, nullable=True)                    # GENUS: DESCONTOINTERNO
    perc_divisao = Column(Float, nullable=True)                        # GENUS: PERCDIVISAO
    comissao = Column(Float, nullable=True)                            # GENUS: COMISSAO

    # Condição de pagamento / prazo / carteira
    avista_prazo = Column(String(1), nullable=True)                    # GENUS: AVISTAPRAZO
    vencimento = Column(DateTime, nullable=True)                       # GENUS: VENCIMENTO
    cod_contas = Column(Integer, nullable=True)                        # GENUS: CODCONTAS
    cod_carteira = Column(Integer, nullable=True)                      # GENUS: CODCARTEIRA
    cod_tabela_preco = Column(Integer, nullable=True)                  # GENUS: CODTABELAPRECO
    cod_tipo_venda = Column(Integer, nullable=True)                    # GENUS: CODTIPOVENDA
    lote = Column(String(10), nullable=True)                           # GENUS: LOTE

    # Tipo / classificação do pedido
    tipo_pedido = Column(String(1), nullable=True)                     # GENUS: TIPOPEDIDO
    tipo = Column(String(1), nullable=True)                            # GENUS: TIPO
    tipo_pre_pedido = Column(String(1), nullable=True)                 # GENUS: TIPOPREPEDIDO
    cod_tipo_ocorrencia = Column(Integer, nullable=True)               # GENUS: CODTIPOOCORRENCIA
    status_genus = Column(String(15), nullable=True)                   # GENUS: STATUS
    excluido = Column(String(1), nullable=True)                        # GENUS: EXCLUIDO
    telemarketing = Column(String(1), nullable=True)                   # GENUS: TELEMARKETING
    contato = Column(String(40), nullable=True)                        # GENUS: CONTATO

    # Liberação / aprovação / bloqueio
    liberado = Column(String(1), nullable=True)                        # GENUS: LIBERADO
    cod_liberacao = Column(Integer, nullable=True)                     # GENUS: CODLIBERACAO
    dt_liberacao = Column(DateTime, nullable=True)                     # GENUS: DTLIBERACAO
    cod_aprovacao = Column(Integer, nullable=True)                     # GENUS: CODAPROVACAO
    dt_aprovacao = Column(DateTime, nullable=True)                     # GENUS: DTAPROVACAO
    motivo_bloqueio = Column(Text, nullable=True)                      # GENUS: MOTIVOBLOQUEIO
    antes_bloqueado = Column(String(1), nullable=True)                 # GENUS: ANTESBLOQUEADO
    orcamento_negado = Column(String(1), nullable=True)                # GENUS: ORCAMENTONEGADO
    motivo_orcamento_negado = Column(Text, nullable=True)              # GENUS: MOTIVOORCAMENTONEGADO
    cod_func_orcamento_negado = Column(Integer, nullable=True)         # GENUS: CODFUNCORCAMENTONEGADO

    # Produção
    liberado_para_producao = Column(String(1), nullable=True)          # GENUS: LIBERADOPARAPRODUCAO
    producao_etapas = Column(String(1), nullable=True)                 # GENUS: PRODUCAOETAPAS
    cod_movto_grade = Column(Integer, nullable=True)                   # GENUS: CODMOVTOGRADE
    cod_agregado = Column(Integer, nullable=True)                      # GENUS: CODAGREGADO
    cod_empresa_saida_prod = Column(Integer, nullable=True)            # GENUS: CODEMPRESASAIDAPROD
    codigo_saida_prod = Column(Integer, nullable=True)                 # GENUS: CODIGOSAIDAPROD
    doc_saida_prod = Column(String(20), nullable=True)                 # GENUS: DOCSAIDAPROD

    # Faturamento / diversos
    faturado = Column(String(1), nullable=True)                        # GENUS: FATURADO
    obs_interna = Column(Text, nullable=True)                          # GENUS: OBSINTERNA
    pedido_representante = Column(String(15), nullable=True)           # GENUS: PEDIDOREPRESENTANTE

    # Auditoria de origem (GENUS)
    cod_alteracao = Column(Integer, nullable=True)                     # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)            # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)             # GENUS: DATAALTERACAO


class ItemPedidoVenda(Base):
    __tablename__ = "itens_pedido_venda"
    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos_venda.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    desconto_percentual = Column(Float, default=0.0)
    unidade = Column(String(10), nullable=True)
    pedido = relationship("PedidoVenda", back_populates="itens")


class ItemPedidoLan(Base):
    """Item de pedido de venda (GENUS) — linha do pedido no sistema legado.

    Reconhece a estrutura completa da tabela PEDIDOLAN do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2) deste
    ERP, seguindo o mesmo precedente estabelecido para `ItemSaida`/
    GENUS.SAILAN e `ItemOrcamentoGenus`/GENUS.ORCAMENTO2. Tipos e campos
    foram conferidos contra o schema Firebird do GENUS (mesma fonte de
    metadados já usada nos demais models `# GENUS:` deste arquivo), sem ler
    nenhuma linha de dado de negócio.

    No GENUS, PEDIDOLAN é a tabela "filha" de PEDIDO (o mesmo padrão já
    reconhecido entre ORCAMENTO/ORCAMENTO2 e SAIDA/SAILAN): PEDIDO guarda o
    cabeçalho do pedido de venda (já reconhecido neste ERP como
    `PedidoVenda`, expandido no Tier 1 desta sessão) e PEDIDOLAN guarda, para
    cada combinação pedido + produto (CODEMPRESA + CODPEDIDO + CODPRODUTO),
    uma linha daquele pedido — quantidade, valores unitário/total, custo
    atual, desconto, frete e a tributação completa (ICMS/ICMS-ST/IPI/PIS/
    COFINS) — ou seja, um mesmo pedido tem muitas linhas em PEDIDOLAN (uma
    por produto pedido).

    Diferente de `ItemPedidoVenda` (model ERP-nativo já existente neste ERP,
    usado hoje pela janela de Pedidos do módulo Vendas — ver
    `VendasWindow`/`NovoPedidoVendaWindow`/`ModalPedidoVenda` — para lançar
    itens livres de um pedido novo, sem nenhuma anotação `# GENUS:`), este
    model é dedicado e não reaproveita `ItemPedidoVenda`, para não misturar
    o formulário comercial "limpo" do ERP com a estrutura bruta e fiscal do
    legado — mesmo critério já usado para não reaproveitar `ItemPedidoVenda`
    em `ItemSaida` e para não reaproveitar `ItemOrcamento` em
    `ItemOrcamentoGenus` (ver docstrings de ambos acima).

    Este model é ligado ao cadastro de produto já migrado (`Produto`, 5.629
    produtos reais) através da FK `produto_id`. Essa FK só pode ser
    resolvida de fato relacionando GENUS.PEDIDOLAN.CODPRODUTO com
    GENUS.PRODUTO.CODIGO (= `Produto.codigo` neste ERP) — tarefa do agente
    de migração de dados, não deste agente de estrutura. Por isso
    `produto_id` é opcional (nullable) e o código bruto original
    (`cod_produto`) é preservado à parte, para não perder informação até que
    essa resolução aconteça.

    Este model também é ligado ao pedido de venda já reconhecido neste ERP
    (`PedidoVenda`) através da FK `pedido_id`. Essa FK só pode ser resolvida
    de fato relacionando (GENUS.PEDIDOLAN.CODEMPRESA,
    GENUS.PEDIDOLAN.CODPEDIDO) com (`PedidoVenda.cod_empresa`,
    `PedidoVenda.codigo_genus`) — novamente, tarefa do agente de migração de
    dados. Por isso `pedido_id` é opcional (nullable) e os códigos brutos
    originais (`cod_empresa`, `cod_pedido`) são preservados à parte.

    CODROMANEIO também é mantido como código bruto (`cod_romaneio`), sem FK
    própria — pelo mesmo motivo já registrado em `ItemSaida.cod_romaneio`
    (a tabela ROMANEIO ainda não tem model dedicado neste ERP).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "itens_pedido_lan"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculos com cadastros já migrados neste ERP ──────────────────────
    pedido_id = Column(Integer, ForeignKey("pedidos_venda.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODPEDIDO) -> (PedidoVenda.cod_empresa, PedidoVenda.codigo_genus)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)       # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Identificação / chave original da linha e do pedido (GENUS) ───────
    cod_empresa = Column(Integer, nullable=True, index=True)         # GENUS: CODEMPRESA
    cod_pedido = Column(Integer, nullable=True, index=True)          # GENUS: CODPEDIDO (FK bruta para PEDIDO — ver PedidoVenda.codigo_genus)
    cod_produto = Column(String(15), nullable=True, index=True)      # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    lote_produto = Column(String(15), nullable=True, index=True)     # GENUS: LOTEPRODUTO
    num_item = Column(String(7), nullable=True)                      # GENUS: NUMITEM
    unidade = Column(String(6), nullable=True)                       # GENUS: UNIDADE
    pai_filho = Column(String(1), nullable=True)                     # GENUS: PAIFILHO

    # ── Quantidades / valores comerciais ───────────────────────────────────
    qtde = Column(Float, nullable=True)                              # GENUS: QTDE
    qtde_embal = Column(Float, nullable=True)                        # GENUS: QTDEEMBAL
    qtde_controle = Column(Float, nullable=True)                     # GENUS: QTDECONTROLE
    qtde_fisico = Column(Float, nullable=True)                       # GENUS: QTDEFISICO
    qtde_faturado = Column(Float, nullable=True)                     # GENUS: QTDEFATURADO
    fat_parcial_qtde_fisico = Column(Float, nullable=True)           # GENUS: FATPARCIALQTDEFISICO
    diferenca = Column(Float, nullable=True)                         # GENUS: DIFERENCA
    unitario = Column(Float, nullable=True)                          # GENUS: UNITARIO
    total = Column(Float, nullable=True)                             # GENUS: TOTAL
    custo_atual = Column(Float, nullable=True)                       # GENUS: CUSTOATUAL
    desconto = Column(Float, nullable=True)                          # GENUS: DESCONTO
    per_desconto = Column(Float, nullable=True)                      # GENUS: PERDESCONTO
    frete = Column(Float, nullable=True)                             # GENUS: FRETE
    outras = Column(Float, nullable=True)                            # GENUS: OUTRAS
    comissao_item = Column(Float, nullable=True)                     # GENUS: COMISSAOITEM
    fechado = Column(Float, nullable=True)                           # GENUS: FECHADO

    # ── Fiscal: ICMS / ICMS-ST ──────────────────────────────────────────
    cst = Column(String(3), nullable=True)                           # GENUS: CST
    csosn = Column(String(4), nullable=True)                         # GENUS: CSOSN
    cod_cfop = Column(String(5), nullable=True)                      # GENUS: CODCFOP
    aliq_icms = Column(String(5), nullable=True)                     # GENUS: ALIQICMS
    icms = Column(Float, nullable=True)                              # GENUS: ICMS
    icms_base = Column(Float, nullable=True)                         # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                        # GENUS: ICMS_VALOR
    icms_outras = Column(Float, nullable=True)                       # GENUS: ICMSOUTRAS
    icms_isento = Column(Float, nullable=True)                       # GENUS: ICMSISENTO
    reducao_icms = Column(Float, nullable=True)                      # GENUS: REDUCAO_ICMS
    iva = Column(Float, nullable=True)                               # GENUS: IVA
    icmsst = Column(Float, nullable=True)                            # GENUS: ICMSST
    reducao_icmsst = Column(Float, nullable=True)                    # GENUS: REDUCAO_ICMSST
    icms_base_subst = Column(Float, nullable=True)                   # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                  # GENUS: ICMS_VALOR_SUBST
    icms_fcp = Column(Float, nullable=True)                          # GENUS: ICMSFCP
    cenq = Column(String(3), nullable=True)                          # GENUS: CENQ

    # ── Fiscal: IPI ──────────────────────────────────────────────────────
    ipi = Column(Float, nullable=True)                               # GENUS: IPI
    ipi_cst = Column(String(3), nullable=True)                       # GENUS: IPICST
    ipi_valor = Column(Float, nullable=True)                         # GENUS: IPIVALOR
    ipi_base_calculo = Column(Float, nullable=True)                  # GENUS: IPIBASECALCULO

    # ── Fiscal: PIS / COFINS ─────────────────────────────────────────────
    pis_cst = Column(String(3), nullable=True)                       # GENUS: PISCST
    pis_valor = Column(Float, nullable=True)                         # GENUS: PISVALOR
    pis_base = Column(Float, nullable=True)                          # GENUS: PISBASE
    pis_aliquota = Column(Float, nullable=True)                      # GENUS: PISALIQUOTA
    quantidade_pis = Column(Float, nullable=True)                    # GENUS: QUANTIDADEPIS
    aliq_pis_reais = Column(Float, nullable=True)                    # GENUS: ALIQPISREAIS
    cofins_cst = Column(String(3), nullable=True)                    # GENUS: COFINSCST
    cofins_valor = Column(Float, nullable=True)                      # GENUS: COFINSVALOR
    cofins_base = Column(Float, nullable=True)                       # GENUS: COFINSBASE
    cofins_aliquota = Column(Float, nullable=True)                   # GENUS: COFINSALIQUOTA
    quantidade_cofins = Column(Float, nullable=True)                 # GENUS: QUANTIDADECOFINS
    aliq_cofins_reais = Column(Float, nullable=True)                 # GENUS: ALIQCOFINSREAIS

    # ── Referências / classificação (códigos brutos, tabelas mestre ainda sem model) ─
    cod_romaneio = Column(Integer, nullable=True, index=True)        # GENUS: CODROMANEIO
    cod_tipo_estampa = Column(Integer, nullable=True)                # GENUS: CODTIPOESTAMPA
    cod_decreto = Column(Integer, nullable=True)                     # GENUS: CODDECRETO
    estoque_reservado_tipo = Column(String(1), nullable=True)        # GENUS: ESTOQUERESERVADOTIPO

    # ── Observação ────────────────────────────────────────────────────────
    obs_produto = Column(Text, nullable=True)                        # GENUS: OBSPRODUTO

    pedido = relationship("PedidoVenda", back_populates="itens_genus")
    produto = relationship("Produto", back_populates="itens_pedido_lan")


class LogAlteracaoPedido(Base):
    """Log de auditoria de alterações de status de um pedido de venda (GENUS).

    Reconhece a estrutura completa da tabela LOGALTERACAOPEDIDO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2)
    deste ERP, seguindo o mesmo precedente estabelecido para
    `ItemPedidoLan`/GENUS.PEDIDOLAN. Tipos e chaves foram conferidos
    diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS /
    RDB$INDEX_SEGMENTS), sem ler nenhuma linha de dado de negócio: todos os
    7 campos são VARCHAR/SMALLINT/INTEGER simples (RDB$FIELD_TYPE 37/7/8),
    confirmando exatamente os tipos sugeridos para esta tabela.

    No GENUS, LOGALTERACAOPEDIDO é uma tabela "filha" de PEDIDO — a
    constraint FK_PEDIDO_LOGPEDIDO confirma uma foreign key real de
    (CODEMPRESA, CODPEDIDO) para a chave composta de PEDIDO (PK_PEDIDO), o
    mesmo cabeçalho de pedido de venda já reconhecido neste ERP como
    `PedidoVenda` (expandido no Tier 1) — ou seja, cada linha registra uma
    alteração de status ocorrida num pedido específico (um mesmo pedido tem
    muitas linhas em LOGALTERACAOPEDIDO, uma por alteração de status
    registrada: novo status, quem alterou, data/hora e a origem/tela de onde
    partiu a alteração). Diferente de PEDIDOLAN (que não tem FK própria além
    da ligação com PRODUTO), aqui a tabela também tem uma segunda FK real,
    FK_PEDIDO_FUNCPEDIDO, de CODFUNCIONARIOLOGADO para PK_FUNCIONARIO — a
    tabela mestre de funcionários do GENUS, ainda sem model dedicado neste
    ERP; por isso `cod_funcionario_logado` é mantido como código bruto, sem
    FK própria, seguindo o mesmo critério já usado para outras referências a
    tabelas do GENUS ainda não modeladas (ex.: `ProdutoProducao.cod_funcionario`).

    Este model é ligado ao pedido de venda já reconhecido neste ERP
    (`PedidoVenda`) através da FK `pedido_id`. Essa FK só pode ser resolvida
    de fato relacionando (GENUS.LOGALTERACAOPEDIDO.CODEMPRESA,
    GENUS.LOGALTERACAOPEDIDO.CODPEDIDO) com (`PedidoVenda.cod_empresa`,
    `PedidoVenda.codigo_genus`) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `pedido_id` é opcional (nullable) e
    os códigos brutos originais (`cod_empresa`, `cod_pedido`) são
    preservados à parte, para não perder informação até que essa resolução
    aconteça.

    LOGALTERACAOPEDIDO não tem chave primária própria no GENUS (apenas as
    NOT NULL originais em CODEMPRESA/CODPEDIDO) — é puramente um log de
    linhas de auditoria, sem identificador natural — por isso o `id` serial
    deste ERP é a única chave própria deste model.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "log_alteracoes_pedido"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o pedido de venda já migrado neste ERP ────────────────
    pedido_id = Column(Integer, ForeignKey("pedidos_venda.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODPEDIDO) -> (PedidoVenda.cod_empresa, PedidoVenda.codigo_genus)

    # ── Campos migrados de GENUS.LOGALTERACAOPEDIDO ───────────────────────
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA (parte da FK composta para PEDIDO, FK_PEDIDO_LOGPEDIDO)
    cod_pedido = Column(Integer, nullable=True, index=True)              # GENUS: CODPEDIDO (parte da FK composta para PEDIDO, FK_PEDIDO_LOGPEDIDO)
    status_novo = Column(String(100), nullable=True)                     # GENUS: STATUSNOVO
    cod_funcionario_logado = Column(Integer, nullable=True, index=True)  # GENUS: CODFUNCIONARIOLOGADO (FK bruta para FUNCIONARIO — tabela mestre ainda sem model dedicado; FK_PEDIDO_FUNCPEDIDO)
    data_alteracao = Column(String(12), nullable=True)                  # GENUS: DATAALTERACAO
    hora_alteracao = Column(String(12), nullable=True)                  # GENUS: HORAALTERACAO
    origem_alteracao = Column(String(200), nullable=True)               # GENUS: ORIGEMALTERACAO

    pedido = relationship("PedidoVenda", back_populates="logs_alteracao")


class AuditoriaPrePedido(Base):
    """Log de auditoria de um pré-pedido (GENUS) — módulo Vendas/Faturamento.

    Reconhece a estrutura completa da tabela AUDITORIA_PREPEDIDO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2)
    deste ERP, seguindo o mesmo precedente estabelecido para
    `LogAlteracaoPedido`/GENUS.LOGALTERACAOPEDIDO. Tipos e chaves foram
    conferidos diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS),
    sem ler nenhuma linha de dado de negócio: os 14 campos batem exatamente
    com os tipos sugeridos (CODIGO/CODFUNCIONARIO/CODEMPRESA/CODPREPEDIDO/
    DOC/CODCLIENTE/CODPRODUTOPRODUCAO = INTEGER (RDB$FIELD_TYPE 8), DATA/
    EMISSAODOC = DATE (12), HORA = CHAR(5) (14), TEXTO = BLOB texto,
    sub_type 1 (261), CODPRODUTO = VARCHAR(15) e LOTE/OPERACAO =
    VARCHAR(10) (37)).

    No GENUS, AUDITORIA_PREPEDIDO é um log solto de auditoria — cada linha
    registra um evento de texto livre (campo TEXTO) ocorrido num pré-pedido
    (CODPREPEDIDO), com quem fez (CODFUNCIONARIO), quando (DATA/HORA), a
    operação realizada (OPERACAO), o produto/lote envolvido (CODPRODUTO/
    LOTE) e, quando aplicável, o produto de produção (CODPRODUTOPRODUCAO) e
    o documento/cliente relacionados (DOC/EMISSAODOC/CODCLIENTE) — ou seja,
    um mesmo pré-pedido tem muitas linhas em AUDITORIA_PREPEDIDO (uma por
    evento de auditoria registrado).

    Diferente de `LogAlteracaoPedido` (cuja FK_PEDIDO_LOGPEDIDO liga de fato
    a PEDIDO, já reconhecido neste ERP como `PedidoVenda`),
    AUDITORIA_PREPEDIDO.CODPREPEDIDO referencia PREPEDIDO — uma tabela de
    "pré-pedido" (rascunho comercial anterior à confirmação do pedido)
    ainda **sem model dedicado** neste ERP (e distinta de `PedidoVenda`/
    GENUS.PEDIDO — não são a mesma entidade nem compartilham chave). Por
    isso propositalmente não criamos nenhuma FK própria para `pedido_id`
    aqui: `cod_pre_pedido` e `cod_empresa` são mantidos como códigos brutos,
    para não perder informação até que PREPEDIDO seja modelado e a entidade
    real (pré-pedido + sua auditoria) seja migrada de fato.

    CODFUNCIONARIO tem FK real confirmada nos metadados
    (FK_AUDPREPEDIDO_FUNCIONARIO -> PK_FUNCIONARIO), mas — assim como já
    documentado em `LogAlteracaoPedido.cod_funcionario_logado` — o model
    `Funcionario` já existente neste ERP não preserva o CODIGO original de
    GENUS.FUNCIONARIO (apenas o vínculo com CADASTRO via `cod_cadastro`),
    então ainda não há chave própria para resolver essa FK; por isso
    `cod_funcionario` é mantido como código bruto, sem FK própria, seguindo
    o mesmo critério.

    CODPRODUTO já tem contraparte migrada neste ERP (`Produto`, 5.629
    produtos reais, via `Produto.codigo`) — por isso ganha a FK opcional
    `produto_id`, resolvida de fato relacionando
    GENUS.AUDITORIA_PREPEDIDO.CODPRODUTO com GENUS.PRODUTO.CODIGO (tarefa
    do agente de migração de dados, não deste agente de estrutura); o
    código bruto original (`cod_produto`) é preservado à parte.

    CODPRODUTOPRODUCAO, pelo mesmo motivo, ganha a FK opcional
    `produto_producao_id` para `ProdutoProducao` (que preserva
    GENUS.PRODUTOPRODUCAO.CODIGO em `ProdutoProducao.codigo`) — resolução
    também deixada para o agente de migração de dados; o código bruto
    (`cod_produto_producao`) é preservado à parte.

    CODCLIENTE, assim como em `PedidoVenda.cod_cliente`, é mantido como
    código bruto: CLIENTE não guarda identidade própria no GENUS (o cliente
    completo exige JOIN com CADASTRO) e `ClienteCompleto` não preserva o
    CODCLIENTE original, então ainda não há chave própria para resolver
    essa FK.

    CODIGO é a chave primária original da linha no GENUS
    (PK_AUDITORIA_PREPEDIDO) — preservada como código bruto (`codigo`), sem
    reaproveitar como PK deste ERP, seguindo o mesmo padrão já usado em
    outras tabelas do GENUS (ex.: `ProdutoProducao.codigo`).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "auditorias_pre_pedido"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculos com cadastros já migrados neste ERP ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)                     # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO
    produto_producao_id = Column(Integer, ForeignKey("produto_producoes.id"), nullable=True, index=True)   # resolvido de GENUS: CODPRODUTOPRODUCAO -> PRODUTOPRODUCAO.CODIGO

    # ── Campos migrados de GENUS.AUDITORIA_PREPEDIDO ──────────────────────
    codigo = Column(Integer, nullable=True, index=True)                     # GENUS: CODIGO (PK original da linha no GENUS; PK_AUDITORIA_PREPEDIDO)
    cod_funcionario = Column(Integer, nullable=True, index=True)            # GENUS: CODFUNCIONARIO (FK real FK_AUDPREPEDIDO_FUNCIONARIO -> FUNCIONARIO; sem model dedicado com CODIGO original preservado)
    data = Column(DateTime, nullable=True)                                  # GENUS: DATA
    hora = Column(String(5), nullable=True)                                 # GENUS: HORA
    texto = Column(Text, nullable=True)                                     # GENUS: TEXTO (BLOB texto)
    cod_empresa = Column(Integer, nullable=True, index=True)                # GENUS: CODEMPRESA
    cod_pre_pedido = Column(Integer, nullable=True, index=True)             # GENUS: CODPREPEDIDO (raw — PREPEDIDO ainda sem model dedicado neste ERP)
    cod_produto = Column(String(15), nullable=True, index=True)             # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    doc = Column(Integer, nullable=True)                                    # GENUS: DOC
    emissao_doc = Column(DateTime, nullable=True)                           # GENUS: EMISSAODOC
    cod_cliente = Column(Integer, nullable=True, index=True)                # GENUS: CODCLIENTE (raw — ClienteCompleto não preserva CODCLIENTE original)
    cod_produto_producao = Column(Integer, nullable=True, index=True)       # GENUS: CODPRODUTOPRODUCAO (código bruto, antes da resolução de produto_producao_id)
    lote = Column(String(10), nullable=True, index=True)                    # GENUS: LOTE
    operacao = Column(String(10), nullable=True)                            # GENUS: OPERACAO

    produto = relationship("Produto")
    produto_producao = relationship("ProdutoProducao")


class Saida(Base):
    """Cabeçalho de saída (nota fiscal de saída/venda) — módulo Vendas/Faturamento.

    Reconhece a estrutura completa da tabela SAIDA do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB). No GENUS, SAIDA é a tabela mestre de uma emissão
    física de mercadoria (nota fiscal de saída/venda): guarda cliente,
    condição de pagamento, datas de emissão/saída/liberação, totais
    comerciais e fiscais (ICMS/ICMS-ST/IPI/PIS/COFINS e os campos da reforma
    tributária IBS/CBS, prefixo REFORMA_*), dados de transporte/volumes,
    vínculos com pedido/orçamento/romaneio e o histórico de
    alteração/cancelamento — uma linha por nota emitida. `ItemSaida`/
    GENUS.SAILAN (já reconhecido neste ERP) é a tabela "filha": cada saída
    tem muitas linhas em SAILAN (uma por produto vendido/faturado naquela
    nota).

    É uma entidade de cabeçalho de venda própria — análoga a
    `PedidoVenda`/GENUS.PEDIDO (o pedido *antes* de faturar) — e não uma
    tabela filha de `Produto`. Diferente de `PedidoVenda`, que já mistura
    campos originais do ERP (numero, cliente_id, itens) com os campos
    migrados do GENUS, `Saida` ainda não tem contraparte original no ERP:
    por isso este model reconhece a estrutura bruta da tabela GENUS na
    íntegra, seguindo o mesmo precedente estabelecido para `ItemSaida`,
    `MovtoProduto` e `ProdutoProducao` (todos puramente estruturais, sem
    campos "ERP" inventados).

    CODEMPRESA + CODIGO formam a chave natural da saída dentro do GENUS —
    é exatamente o par que `ItemSaida.cod_empresa` / `ItemSaida.cod_saida`
    já referenciam como códigos brutos (ver docstring de `ItemSaida`).
    `codigo` aqui preserva CODIGO sem reaproveitá-lo como PK deste ERP,
    seguindo o mesmo padrão usado em outras tabelas do GENUS (ex.:
    `ProdutoProducao.codigo` <- GENUS.PRODUTOPRODUCAO.CODIGO). Quando a
    entidade completa (cabeçalho + itens) for migrada de fato, o agente de
    migração de dados poderá resolver `ItemSaida.cod_saida`/`cod_empresa`
    contra `Saida.codigo`/`cod_empresa` — nenhuma FK é criada agora, pois
    nenhuma linha foi importada ainda.

    Diversos outros campos são apenas códigos brutos de tabelas legadas
    ainda não modeladas neste ERP (CODCLIENTE -> CADASTRO/CLIENTE via
    CLIENTE, CODFUNCIONARIO -> FUNCIONARIO, CODCONDPAGTO -> CONDPAGTO,
    CODTRANSPORTADOR -> TRANSPORTADOR, CODTABELAPRECO -> TABELAPRECO,
    CODCARTEIRA, CODAGREGADO, CODPEDIDO -> PEDIDO, CODORCAMENTO ->
    ORCAMENTO, CODROMANEIO -> ROMANEIO, ENTRADACODFORNECEDOR -> FORNECEDOR
    etc.). Propositalmente não criamos FK própria para eles aqui — são
    mantidos como códigos brutos (`cod_*`/`entrada_cod_*`), apenas para não
    perder informação; a entidade real, quando migrada de fato, vai exigir
    resolver essas referências contra as tabelas correspondentes.

    Os campos QUANTIDADE/ESPECIE/MARCA/NUMERO/BRUTO/LIQUIDO correspondem à
    seção "Dados dos Volumes Transportados" de uma NF-e (quantidade de
    volumes, espécie de embalagem, marca, numeração e pesos bruto/líquido
    dos volumes) — mantidos como String, fiéis ao tipo original do GENUS,
    e nomeados aqui com o sufixo `_volumes` para deixar esse significado
    explícito.

    Os campos com prefixo REFORMA_ correspondem à Reforma Tributária
    brasileira (IBS/CBS/IS), já presentes na estrutura SAIDA do GENUS para
    preparar a emissão fiscal do novo modelo — reconhecidos com o mesmo
    prefixo em snake_case (`reforma_*`), sem reinterpretação de significado,
    igual ao já feito em `ItemSaida`.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela SAIDA foi lido no GENUS por este agente.
    """
    __tablename__ = "saidas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave original da saída no GENUS ──────────────────
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA
    codigo = Column(Integer, nullable=True, index=True)                  # GENUS: CODIGO (identificador original da saída no GENUS; par natural com cod_empresa — referenciado por ItemSaida.cod_saida/cod_empresa)
    tipo_doc = Column(String(1), nullable=True)                          # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                                 # GENUS: DOC
    serie = Column(String(4), nullable=True)                             # GENUS: SERIE
    cod_cliente = Column(Integer, nullable=True, index=True)             # GENUS: CODCLIENTE
    cod_funcionario = Column(Integer, nullable=True)                     # GENUS: CODFUNCIONARIO
    cod_cond_pagto = Column(String(5), nullable=True)                    # GENUS: CODCONDPAGTO
    emissao = Column(DateTime, nullable=True)                            # GENUS: EMISSAO
    modelo = Column(String(2), nullable=True)                            # GENUS: MODELO
    status_genus = Column(String(30), nullable=True)                     # GENUS: STATUS
    cancelado = Column(String(1), nullable=True)                         # GENUS: CANCELADO

    # ── Fiscal: ICMS / ICMS-ST / IPI / PIS / COFINS ───────────────────────
    cod_cfop = Column(String(5), nullable=True)                          # GENUS: CODCFOP
    cod_cfop2 = Column(String(5), nullable=True)                         # GENUS: CODCFOP2
    icms_base = Column(Float, nullable=True)                             # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                            # GENUS: ICMS_VALOR
    icms_base_subst = Column(Float, nullable=True)                       # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                      # GENUS: ICMS_VALOR_SUBST
    ipi_valor = Column(Float, nullable=True)                             # GENUS: IPI_VALOR
    pis_valor = Column(Float, nullable=True)                             # GENUS: PIS_VALOR
    cofins_valor = Column(Float, nullable=True)                          # GENUS: COFINS_VALOR
    credito_icms = Column(Float, nullable=True)                          # GENUS: CREDITOICMS
    total_icms_uf_dest = Column(Float, nullable=True)                    # GENUS: TOTALICMSUFDEST
    total_icms_uf_rem = Column(Float, nullable=True)                     # GENUS: TOTALICMSUFREM
    total_icms_fcp = Column(Float, nullable=True)                        # GENUS: TOTALICMSFCP

    # ── Valores comerciais / totais ────────────────────────────────────────
    valor_produtos = Column(Float, nullable=True)                        # GENUS: VAL_PRO
    frete = Column(Float, nullable=True)                                 # GENUS: FRETE
    seguro = Column(Float, nullable=True)                                # GENUS: SEGURO
    outras = Column(Float, nullable=True)                                # GENUS: OUTRAS
    total = Column(Float, nullable=True)                                 # GENUS: TOTAL
    desc_acres = Column(Float, nullable=True)                            # GENUS: DESC_ACRES
    descto1 = Column(Float, nullable=True)                               # GENUS: DESCTO1
    descto2 = Column(Float, nullable=True)                               # GENUS: DESCTO2
    descto3 = Column(Float, nullable=True)                               # GENUS: DESCTO3
    descto4 = Column(Float, nullable=True)                               # GENUS: DESCTO4
    descto5 = Column(Float, nullable=True)                               # GENUS: DESCTO5
    perc_divisao = Column(Float, nullable=True)                          # GENUS: PERCDIVISAO
    comissao = Column(Float, nullable=True)                              # GENUS: COMISSAO
    valor_credito = Column(Float, nullable=True)                         # GENUS: VALORCREDITO

    # ── Observações ────────────────────────────────────────────────────────
    observacao = Column(Text, nullable=True)                            # GENUS: OBS
    obs_interna = Column(Text, nullable=True)                            # GENUS: OBSINTERNA
    obs_fisco = Column(Text, nullable=True)                              # GENUS: OBSFISCO

    # ── Transferência entre empresas / identificação do destinatário ─────
    transfere = Column(String(1), nullable=True)                        # GENUS: TRANSFERE
    cpf_cnpj = Column(String(18), nullable=True)                        # GENUS: CPFCNPJ
    hora = Column(String(8), nullable=True)                             # GENUS: HORA
    cod_transfere = Column(Integer, nullable=True)                      # GENUS: CODTRANSFERE
    fechar = Column(String(1), nullable=True)                           # GENUS: FECHAR

    # ── Dados dos volumes transportados (seção NF-e) ──────────────────────
    quantidade_volumes = Column(String(10), nullable=True)              # GENUS: QUANTIDADE
    especie_volumes = Column(String(15), nullable=True)                 # GENUS: ESPECIE
    marca_volumes = Column(String(15), nullable=True)                   # GENUS: MARCA
    numero_volumes = Column(String(10), nullable=True)                  # GENUS: NUMERO
    peso_bruto_volumes = Column(String(15), nullable=True)              # GENUS: BRUTO
    peso_liquido_volumes = Column(String(15), nullable=True)            # GENUS: LIQUIDO

    # ── Transporte / entrega ───────────────────────────────────────────────
    cod_transportador = Column(Integer, nullable=True)                  # GENUS: CODTRANSPORTADOR
    frete_conta = Column(String(1), nullable=True)                      # GENUS: FRETECONTA
    placa = Column(String(8), nullable=True)                            # GENUS: PLACA
    entregue = Column(String(1), nullable=True)                         # GENUS: ENTREGUE
    dt_previsao = Column(DateTime, nullable=True)                       # GENUS: DTPREVISAO

    # ── ECF / cupom fiscal ──────────────────────────────────────────────────
    cod_ecf = Column(Integer, nullable=True)                            # GENUS: CODECF
    ccf = Column(Integer, nullable=True)                                # GENUS: CCF
    retirar_estoque = Column(String(1), nullable=True)                  # GENUS: RETIRAR_ESTQ
    cod_tipo_venda = Column(Integer, nullable=True)                     # GENUS: CODTIPOVENDA
    romaneio = Column(Integer, nullable=True, index=True)               # GENUS: ROMANEIO
    romaneio_lote = Column(String(10), nullable=True)                   # GENUS: ROMANEIOLOTE
    chave_nfe = Column(String(70), nullable=True, index=True)           # GENUS: CHAVENFE
    cod_agregado = Column(Integer, nullable=True)                       # GENUS: CODAGREGADO
    avista_prazo = Column(String(1), nullable=True)                     # GENUS: AVISTAPRAZO
    cod_cupom_vinculado = Column(Integer, nullable=True)                # GENUS: COD_CUPOMVINCULADO

    # ── Liberação / datas de saída física ───────────────────────────────────
    dt_liberado = Column(DateTime, nullable=True)                       # GENUS: DTLIBERADO
    cod_adm = Column(Integer, nullable=True)                            # GENUS: CODADM
    dt_saida = Column(DateTime, nullable=True)                          # GENUS: DTSAIDA
    hora_saida = Column(String(8), nullable=True)                       # GENUS: HORASAIDA
    liberado = Column(String(1), nullable=True)                         # GENUS: LIBERADO

    # ── Auditoria de origem (GENUS) ─────────────────────────────────────────
    cod_alteracao = Column(Integer, nullable=True)                      # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)             # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)              # GENUS: DATAALTERACAO
    email_enviado = Column(DateTime, nullable=True)                     # GENUS: EMAILENVIADO
    email_cod_funcionario = Column(Integer, nullable=True)              # GENUS: EMAILCODFUNCIONARIO

    # ── Carteira / tabela de preço / classificação ─────────────────────────
    cod_carteira = Column(Integer, nullable=True)                       # GENUS: CODCARTEIRA
    discriminacao = Column(String(1), nullable=True)                    # GENUS: DISCRIMINACAO
    cod_cliente_entrega = Column(Integer, nullable=True)                # GENUS: CODCLIENTEENTREGA
    tipo_comercio = Column(String(1), nullable=True)                    # GENUS: TIPOCOMERCIO
    tipo_nf = Column(String(1), nullable=True)                          # GENUS: TIPONF
    tipo_cliente = Column(String(1), nullable=True)                     # GENUS: TIPOCLIENTE
    cod_tabela_preco = Column(Integer, nullable=True)                   # GENUS: CODTABELAPRECO
    cod_orcamento = Column(Integer, nullable=True, index=True)          # GENUS: CODORCAMENTO
    devop_simples = Column(String(1), nullable=True)                    # GENUS: DEVOPSIMPLES

    # ── Ordem de serviço ────────────────────────────────────────────────────
    cod_ordem_servico = Column(Integer, nullable=True)                  # GENUS: COD_ORDEMSERVICO
    cod_empresa_ordem_servico = Column(Integer, nullable=True)          # GENUS: COD_EMPRESAORDEMSERVICO
    tipo_ordem_servico = Column(String(1), nullable=True)               # GENUS: TIPO_ORDEMSERVICO

    # ── Fiscal: serviço (ISS) / retenções (INSS/IR/CSLL/PIS/COFINS) ───────
    vl_base_calculo = Column(Float, nullable=True)                      # GENUS: VL_BASECALCULO
    vl_deducao = Column(Float, nullable=True)                           # GENUS: VL_DEDUCAO
    vl_aliquota = Column(Float, nullable=True)                          # GENUS: VL_ALIQUOTA
    vl_inss = Column(Float, nullable=True)                              # GENUS: VL_INSS
    al_inss = Column(Float, nullable=True)                              # GENUS: AL_INSS
    al_ir = Column(Float, nullable=True)                                # GENUS: AL_IR
    vl_ir = Column(Float, nullable=True)                                # GENUS: VL_IR
    al_csll = Column(Float, nullable=True)                              # GENUS: AL_CSLL
    vl_csll = Column(Float, nullable=True)                              # GENUS: VL_CSLL
    al_pis = Column(Float, nullable=True)                               # GENUS: AL_PIS
    al_cofins = Column(Float, nullable=True)                            # GENUS: AL_COFINS
    vl_iss = Column(Float, nullable=True)                               # GENUS: VL_ISS
    vl_iss_retido = Column(Float, nullable=True)                        # GENUS: VL_ISS_RETIDO
    vl_servico = Column(Float, nullable=True)                           # GENUS: VL_SERVICO

    # ── Referências (saída de origem/vínculo, pedido, empresa não fiscal) ──
    cod_empresa_ref = Column(Integer, nullable=True)                    # GENUS: CODEMPRESAREF
    cod_saida_ref = Column(Integer, nullable=True)                      # GENUS: CODSAIDAREF
    cod_pedido = Column(Integer, nullable=True, index=True)             # GENUS: CODPEDIDO
    cod_empresa_vinculado = Column(Integer, nullable=True)              # GENUS: CODEMPRESAVINCULADO
    cod_saida_vinculado = Column(Integer, nullable=True)                # GENUS: CODSAIDAVINCULADO
    cod_empresa_nao_fiscal = Column(Integer, nullable=True)             # GENUS: CODEMPRESANAOFISCAL

    # ── Entrada vinculada (devolução) ───────────────────────────────────────
    entrada_cod_empresa = Column(Integer, nullable=True)                # GENUS: ENTRADACODEMPRESA
    entrada_tipo_doc = Column(String(1), nullable=True)                 # GENUS: ENTRADATIPODOC
    entrada_doc = Column(Integer, nullable=True)                        # GENUS: ENTRADADOC
    entrada_serie = Column(String(4), nullable=True)                    # GENUS: ENTRADASERIE
    entrada_cod_fornecedor = Column(Integer, nullable=True)             # GENUS: ENTRADACODFORNECEDOR

    # ── Retorno CFOP (fechamento fiscal) ────────────────────────────────────
    data_retorno_cfop = Column(DateTime, nullable=True)                 # GENUS: DATARETORNOCFOP
    retorno_fechado_cfop = Column(String(1), nullable=True)             # GENUS: RETORNOFECHADOCFOP
    data_retorno_fechado_cfop = Column(DateTime, nullable=True)         # GENUS: DATARETORNOFECHADOCFOP

    # ── Códigos antigos / transferência entre empresas (multi-empresa GENUS) ─
    cod_antigo_transfere1 = Column(Integer, nullable=True)              # GENUS: COD_ANTIGO_TRANSFERE1
    cod_antigo_transfere2 = Column(Integer, nullable=True)              # GENUS: COD_ANTIGO_TRANSFERE2
    cod_empresa_transf1 = Column(Integer, nullable=True)                # GENUS: COD_EMPRESA_TRANSF1
    cod_empresa_transf2 = Column(Integer, nullable=True)                # GENUS: COD_EMPRESA_TRANSF2
    cod_saida_antigo = Column(Integer, nullable=True)                   # GENUS: COD_SAIDA_ANTIGO
    pedido_representante = Column(String(15), nullable=True)            # GENUS: PEDIDOREPRESENTANTE

    # ── Reforma Tributária: gerais / governo ───────────────────────────────
    reforma_tpnfdebito = Column(String(2), nullable=True)               # GENUS: REFORMA_TPNFDEBITO
    reforma_tpnfcredito = Column(String(2), nullable=True)              # GENUS: REFORMA_TPNFCREDITO
    reforma_tpentegov = Column(String(1), nullable=True)                # GENUS: REFORMA_TPENTEGOV
    reforma_predutorgov = Column(Float, nullable=True)                  # GENUS: REFORMA_PREDUTORGOV
    reforma_tpopergov = Column(String(1), nullable=True)                # GENUS: REFORMA_TPOPERGOV
    reforma_refnfeant = Column(String(44), nullable=True)               # GENUS: REFORMA_REFNFEANT
    reforma_cod_saida_ant = Column(Integer, nullable=True)              # GENUS: REFORMA_CODSAIDAANT
    reforma_cod_empresa_ant = Column(Integer, nullable=True)            # GENUS: REFORMA_CODEMPRESAANT

    # ── Reforma Tributária: totais IBS-UF ───────────────────────────────────
    reforma_totvbcibscbs = Column(Float, nullable=True)                 # GENUS: REFORMA_TOTVBCIBSCBS
    reforma_totvdif_ibsuf = Column(Float, nullable=True)                # GENUS: REFORMA_TOTVDIF_IBSUF
    reforma_totvdevtrib_ibsuf = Column(Float, nullable=True)            # GENUS: REFORMA_TOTVDEVTRIB_IBSUF
    reforma_totvibsuf_ibsuf = Column(Float, nullable=True)              # GENUS: REFORMA_TOTVIBSUF_IBSUF

    # ── Reforma Tributária: totais IBS-Município ────────────────────────────
    reforma_totvdif_ibsmun = Column(Float, nullable=True)               # GENUS: REFORMA_TOTVDIF_IBSMUN
    reforma_totvdevtrib_ibsmun = Column(Float, nullable=True)           # GENUS: REFORMA_TOTVDEVTRIB_IBSMUN
    reforma_totvibsmun_ibsmun = Column(Float, nullable=True)            # GENUS: REFORMA_TOTVIBSMUN_IBSMUN

    # ── Reforma Tributária: totais IBS geral / crédito presumido ────────────
    reforma_totvibs_ibs = Column(Float, nullable=True)                  # GENUS: REFORMA_TOTVIBS_IBS
    reforma_totvcredpres_ibs = Column(Float, nullable=True)             # GENUS: REFORMA_TOTVCREDPRES_IBS
    reforma_totvcredprescondsus_ibs = Column(Float, nullable=True)      # GENUS: REFORMA_TOTVCREDPRESCONDSUS_IBS
    reforma_totvibsestcred = Column(Float, nullable=True)               # GENUS: REFORMA_TOTVIBSESTCRED

    # ── Reforma Tributária: totais CBS ──────────────────────────────────────
    reforma_totvdif_cbs = Column(Float, nullable=True)                  # GENUS: REFORMA_TOTVDIF_CBS
    reforma_totvdevtrib_cbs = Column(Float, nullable=True)              # GENUS: REFORMA_TOTVDEVTRIB_CBS
    reforma_totvcbs_cbs = Column(Float, nullable=True)                  # GENUS: REFORMA_TOTVCBS_CBS
    reforma_totvcredpres_cbs = Column(Float, nullable=True)             # GENUS: REFORMA_TOTVCREDPRES_CBS
    reforma_totvcredprescondsus_cbs = Column(Float, nullable=True)      # GENUS: REFORMA_TOTVCREDPRESCONDSUS_CBS
    reforma_totvcbsestcred = Column(Float, nullable=True)               # GENUS: REFORMA_TOTVCBSESTCRED

    # ── Reforma Tributária: total geral da NF / exceção ─────────────────────
    reforma_vnftot = Column(Float, nullable=True)                       # GENUS: REFORMA_VNFTOT
    reforma_excecao = Column(String(1), nullable=True)                  # GENUS: REFORMA_EXCECAO
    reforma_excecao_descricao = Column(Text, nullable=True)             # GENUS: REFORMA_EXCECAO_DESCRI
    reforma_excecao_responsaveis = Column(Text, nullable=True)          # GENUS: REFORMA_EXCECAO_RESPONSAVEIS

    pedidos_vinculados = relationship("PedidoNota", back_populates="saida", cascade="all, delete-orphan")
    devolucoes_vinculadas = relationship("SaidaDevolucao", back_populates="saida", cascade="all, delete-orphan")
    faturas_vinculadas = relationship("FaturaNota", back_populates="saida", cascade="all, delete-orphan")
    notas_xml_vinculadas = relationship("NotaXml", back_populates="saida", cascade="all, delete-orphan")
    notas_correcao_vinculadas = relationship("NotaCorrecao", back_populates="saida", cascade="all, delete-orphan")


class ItemSaida(Base):
    """Item de saída (venda/faturamento) — linha de nota fiscal de saída.

    Reconhece a estrutura completa da tabela SAILAN do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB) — primeiro model do módulo Vendas/Faturamento
    (Tier 2) deste ERP. No GENUS, SAILAN é a tabela "filha" de SAIDA: SAIDA
    guarda o cabeçalho da nota fiscal de saída/venda (uma emissão física de
    mercadoria) e SAILAN guarda, para cada combinação de saída + produto
    (CODEMPRESA + CODSAIDA + CODPRODUTO), uma linha/item daquela nota —
    quantidade, valores unitário/total, tributação (ICMS/IPI/PIS/COFINS/
    ICMS-ST) e, mais recentemente, os campos da reforma tributária
    (IBS/CBS/IS, prefixo REFORMA_*) — ou seja, uma mesma saída (nota fiscal)
    tem muitas linhas em SAILAN (uma por produto vendido/faturado).

    Diferente de `ItemPedidoVenda`/GENUS.PEDIDOITEM (item do *pedido* de
    venda, antes de faturar) e de `ItemOrcamento`/GENUS.ORCAMENTOITEM (item
    do *orçamento*, antes de virar pedido), `ItemSaida`/GENUS.SAILAN
    representa o item já efetivamente faturado/emitido (a saída fiscal de
    mercadoria) — por isso não reaproveita `ItemPedidoVenda`, mesmo com
    campos conceitualmente parecidos (quantidade, valor unitário, desconto):
    são estágios diferentes do fluxo comercial, com granularidade fiscal
    própria (SAILAN tem dezenas de campos tributários que PEDIDOITEM/
    ORCAMENTOITEM não têm).

    Este model é ligado ao cadastro de produto já migrado (`Produto`, 5.629
    produtos reais) através da FK `produto_id`. Essa FK só pode ser
    resolvida de fato relacionando GENUS.SAILAN.CODPRODUTO com
    GENUS.PRODUTO.CODIGO (= `Produto.codigo` neste ERP) — tarefa do agente
    de migração de dados, não deste agente de estrutura. Por isso
    `produto_id` é opcional (nullable) e o código bruto original
    (`cod_produto`) é preservado à parte, para não perder informação até que
    essa resolução aconteça.

    CODSAIDA (chave da nota fiscal de saída, dentro de CODEMPRESA) agora tem
    contraparte estrutural em `Saida`/GENUS.SAIDA (cabeçalho da saída
    fiscal, ver classe acima) — mas ainda **não** ganha FK própria aqui:
    `Saida` é recém-criada e nenhuma linha de nenhuma das duas tabelas foi
    importada ainda. Por isso `cod_empresa` e `cod_saida` continuam como
    códigos brutos (`cod_empresa`, `cod_saida`), sem FK própria, exatamente
    como já ocorre em outras tabelas do GENUS já reconhecidas neste ERP
    (ex.: `PrecoProduto.cod_empresa`, `MovtoProduto.cod_empresa`) — a
    entidade real "saída completa" (nota + itens), quando migrada de fato,
    vai exigir relacionar SAILAN a SAIDA por esse par de códigos
    (`Saida.codigo`/`Saida.cod_empresa`).

    Os demais códigos de referência ainda sem model dedicado neste ERP
    (CODROMANEIO -> ROMANEIO, CODEMBALAGEM -> EMBALAGEM, CODCLASSIFICACAO2,
    CODPREPEDIDO/CODEMPRESAPREPEDIDO -> PREPEDIDO, CODEMPRESANAOFISCAL ->
    EMPRESA não fiscal, NUMPEDIDO -> PEDIDO) também são mantidos como
    códigos brutos (`cod_*`/`num_*`), sem FK própria, pelo mesmo motivo.

    CODIGO é o identificador (chave primária) original da linha dentro do
    GENUS — preservado como código bruto (`codigo`), sem reaproveitar como
    PK deste ERP, seguindo o mesmo padrão usado em outras tabelas do GENUS
    (ex.: `ProdutoProducao.codigo` <- GENUS.PRODUTOPRODUCAO.CODIGO).

    Os campos com prefixo REFORMA_ correspondem à Reforma Tributária
    brasileira (IBS/CBS — Imposto sobre Bens e Serviços / Contribuição sobre
    Bens e Serviços — e IS — Imposto Seletivo), já presentes na estrutura
    SAILAN do GENUS para preparar a emissão fiscal do novo modelo. Foram
    reconhecidos com o mesmo prefixo em snake_case (`reforma_*`), sem
    reinterpretação de significado.

    Nenhuma linha é importada por este model — apenas a estrutura. A tabela
    SAILAN tem da ordem de 53 mil linhas reais no GENUS; nenhuma delas foi
    lida ou copiada por este agente.
    """
    __tablename__ = "itens_saida"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Identificação / chave original da linha e da saída (SAIDA ainda sem model) ─
    codigo = Column(Integer, nullable=True, index=True)                 # GENUS: CODIGO (identificador original da linha no GENUS)
    cod_empresa = Column(Integer, nullable=True, index=True)            # GENUS: CODEMPRESA
    cod_saida = Column(Integer, nullable=True, index=True)              # GENUS: CODSAIDA (FK bruta para SAIDA — tabela mestre ainda sem model dedicado)
    cod_produto = Column(String(15), nullable=True, index=True)         # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    nitem = Column(Integer, nullable=True)                              # GENUS: NITEM (número do item dentro da saída)
    num_item = Column(String(7), nullable=True)                         # GENUS: NUMITEM
    lote_produto = Column(String(15), nullable=True, index=True)        # GENUS: LOTEPRODUTO
    unidade = Column(String(6), nullable=True)                          # GENUS: UNIDADE
    pai_filho = Column(String(1), nullable=True)                        # GENUS: PAIFILHO
    cancelado = Column(String(1), nullable=True)                        # GENUS: CANCELADO

    # ── Quantidades / valores comerciais ───────────────────────────────────
    qtde = Column(Float, nullable=True)                                 # GENUS: QTDE
    qtde_controle = Column(Float, nullable=True)                        # GENUS: QTDECONTROLE
    qtde_embal = Column(Float, nullable=True)                           # GENUS: QTDEEMBAL
    cod_embalagem = Column(String(15), nullable=True)                   # GENUS: CODEMBALAGEM
    qtde_embalagem = Column(Float, nullable=True)                       # GENUS: QTDEEMBALAGEM
    qtde_faturamento_parcial = Column(Float, nullable=True)             # GENUS: QTDEFATURAMENTOPARCIAL
    unitario = Column(Float, nullable=True)                             # GENUS: UNITARIO
    total = Column(Float, nullable=True)                                # GENUS: TOTAL
    custo = Column(Float, nullable=True)                                # GENUS: CUSTO
    desconto = Column(Float, nullable=True)                             # GENUS: DESCONTO
    per_desconto = Column(Float, nullable=True)                         # GENUS: PERDESCONTO
    frete = Column(Float, nullable=True)                                # GENUS: FRETE
    seguro = Column(Float, nullable=True)                               # GENUS: SEGURO
    outras = Column(Float, nullable=True)                               # GENUS: OUTRAS
    retirar = Column(String(1), nullable=True)                          # GENUS: RETIRAR
    estoque_cli = Column(String(1), nullable=True)                      # GENUS: ESTOQUECLI

    # ── Comissão ────────────────────────────────────────────────────────
    perc_comissao = Column(Float, nullable=True)                        # GENUS: PERCOMISSAO
    cal_comissao = Column(Float, nullable=True)                         # GENUS: CALCOMISSAO
    val_comissao = Column(Float, nullable=True)                         # GENUS: VALCOMISSAO
    comissao_item = Column(Float, nullable=True)                        # GENUS: COMISSAOITEM

    # ── Fiscal: ICMS / ICMS-ST ──────────────────────────────────────────
    entrada_saida = Column(String(1), nullable=True)                    # GENUS: ENTRADASAIDA
    cst = Column(String(3), nullable=True)                              # GENUS: CST
    csosn = Column(String(4), nullable=True)                            # GENUS: CSOSN
    cod_cfop = Column(String(5), nullable=True)                         # GENUS: CODCFOP
    aliq_icms = Column(String(5), nullable=True)                        # GENUS: ALIQICMS
    icms = Column(Float, nullable=True)                                 # GENUS: ICMS
    icms_base = Column(Float, nullable=True)                            # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                           # GENUS: ICMS_VALOR
    icms_outras = Column(Float, nullable=True)                          # GENUS: ICMSOUTRAS
    icms_isento = Column(Float, nullable=True)                          # GENUS: ICMSISENTO
    reducao_icms = Column(Float, nullable=True)                         # GENUS: REDUCAO_ICMS
    iva = Column(Float, nullable=True)                                  # GENUS: IVA
    icmsst = Column(Float, nullable=True)                               # GENUS: ICMSST
    reducao_icmsst = Column(Float, nullable=True)                       # GENUS: REDUCAO_ICMSST
    icms_base_subst = Column(Float, nullable=True)                      # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                     # GENUS: ICMS_VALOR_SUBST
    reduzir_base_st = Column(String(1), nullable=True)                  # GENUS: REDUZIRBASEST
    icms_fcp = Column(Float, nullable=True)                             # GENUS: ICMSFCP

    # ── Fiscal: ICMS partilha interestadual (DIFAL) ─────────────────────
    aliq_uf_dest = Column(Float, nullable=True)                         # GENUS: ALIQUFDEST
    aliq_inter = Column(String(5), nullable=True)                       # GENUS: ALIQINTER
    perc_partilha = Column(String(5), nullable=True)                    # GENUS: PERCPARTILHA
    vl_icms_uf_dest = Column(Float, nullable=True)                      # GENUS: VLICMSUFDEST
    vl_icms_uf_rem = Column(Float, nullable=True)                       # GENUS: VLICMSUFREM
    vl_icms_fcp = Column(Float, nullable=True)                          # GENUS: VLICMSFCP
    credito = Column(Float, nullable=True)                              # GENUS: CREDITO

    # ── Fiscal: IPI ──────────────────────────────────────────────────────
    ipi = Column(Float, nullable=True)                                  # GENUS: IPI
    ipi_cst = Column(String(3), nullable=True)                          # GENUS: IPICST
    ipi_valor = Column(Float, nullable=True)                            # GENUS: IPIVALOR
    ipi_base_calculo = Column(Float, nullable=True)                     # GENUS: IPIBASECALCULO
    calcula_ipi_base = Column(String(1), nullable=True)                 # GENUS: CALCULAIPIBASE
    calcula_ipi_base_subst = Column(String(1), nullable=True)           # GENUS: CALCULAIPIBASE_SUBST

    # ── Fiscal: PIS / COFINS ─────────────────────────────────────────────
    pis_cst = Column(String(3), nullable=True)                          # GENUS: PISCST
    pis_valor = Column(Float, nullable=True)                            # GENUS: PISVALOR
    pis_base = Column(Float, nullable=True)                             # GENUS: PISBASE
    pis_aliquota = Column(Float, nullable=True)                         # GENUS: PISALIQUOTA
    quantidade_pis = Column(Float, nullable=True)                       # GENUS: QUANTIDADEPIS
    aliq_pis_reais = Column(Float, nullable=True)                       # GENUS: ALIQPISREAIS
    cofins_cst = Column(String(3), nullable=True)                       # GENUS: COFINSCST
    cofins_valor = Column(Float, nullable=True)                         # GENUS: COFINSVALOR
    cofins_base = Column(Float, nullable=True)                          # GENUS: COFINSBASE
    cofins_aliquota = Column(Float, nullable=True)                      # GENUS: COFINSALIQUOTA
    quantidade_cofins = Column(Float, nullable=True)                    # GENUS: QUANTIDADECOFINS
    aliq_cofins_reais = Column(Float, nullable=True)                    # GENUS: ALIQCOFINSREAIS
    aliq_ibpt = Column(Float, nullable=True)                            # GENUS: ALIQIBPT
    cenq = Column(String(3), nullable=True)                             # GENUS: CENQ

    # ── Importação (DI — Declaração de Importação) ──────────────────────
    di_doc = Column(String(10), nullable=True)                          # GENUS: DIDOC
    di_dt = Column(DateTime, nullable=True)                             # GENUS: DIDT
    desemb_dt = Column(DateTime, nullable=True)                         # GENUS: DESEMBDT
    desemb_local = Column(String(40), nullable=True)                    # GENUS: DESEMBLOCAL
    desemb_uf = Column(String(2), nullable=True)                        # GENUS: DESEMBUF
    di_exportador = Column(String(10), nullable=True)                   # GENUS: DIEXPORTADOR
    di_fabricante = Column(String(10), nullable=True)                   # GENUS: DIFABRICANTE

    # ── Referências / classificação (códigos brutos, tabelas mestre ainda sem model) ─
    cod_romaneio = Column(Integer, nullable=True, index=True)           # GENUS: CODROMANEIO
    cod_classificacao2 = Column(Integer, nullable=True)                 # GENUS: CODCLASSIFICACAO2
    cod_empresa_nao_fiscal = Column(Integer, nullable=True)             # GENUS: CODEMPRESANAOFISCAL
    cod_pre_pedido = Column(Integer, nullable=True)                     # GENUS: CODPREPEDIDO
    cod_empresa_pre_pedido = Column(Integer, nullable=True)             # GENUS: CODEMPRESAPREPEDIDO
    num_pedido = Column(String(15), nullable=True, index=True)          # GENUS: NUMPEDIDO
    num_lote_prod_etapas = Column(String(20), nullable=True)            # GENUS: NUMLOTEPRODETAPAS
    ref_fabrica = Column(String(20), nullable=True)                     # GENUS: REFFABRICA
    cod_cbenef = Column(Integer, nullable=True)                         # GENUS: CODCBENEF

    # ── Observação ────────────────────────────────────────────────────────
    obs_produto = Column(Text, nullable=True)                          # GENUS: OBSPRODUTO

    # ── Reforma Tributária: IBS/CBS gerais do item ──────────────────────
    reforma_cst_ibscbs = Column(String(3), nullable=True)               # GENUS: REFORMA_CST_IBSCBS
    reforma_cclasstrib = Column(String(10), nullable=True)              # GENUS: REFORMA_CCLASSTRIB
    reforma_vbc_ibscbs = Column(Float, nullable=True)                   # GENUS: REFORMA_VBC_IBSCBS
    reforma_vitem = Column(Float, nullable=True)                        # GENUS: REFORMA_VITEM
    reforma_chave_acesso = Column(String(44), nullable=True)            # GENUS: REFORMA_CHAVEACESSO
    reforma_nitem = Column(Integer, nullable=True)                      # GENUS: REFORMA_NITEM
    reforma_inddoacao = Column(String(1), nullable=True)                # GENUS: REFORMA_INDDOACAO

    # ── Reforma Tributária: IBS-UF ───────────────────────────────────────
    reforma_pibsuf_ibsuf = Column(Float, nullable=True)                 # GENUS: REFORMA_PIBSUF_IBSUF
    reforma_pdif_ibsuf = Column(Float, nullable=True)                   # GENUS: REFORMA_PDIF_IBSUF
    reforma_vdif_ibsuf = Column(Float, nullable=True)                   # GENUS: REFORMA_VDIF_IBSUF
    reforma_vdevtrib_ibsuf = Column(Float, nullable=True)               # GENUS: REFORMA_VDEVTRIB_IBSUF
    reforma_predaliq_ibsuf = Column(Float, nullable=True)               # GENUS: REFORMA_PREDALIQ_IBSUF
    reforma_paliqefet_ibsuf = Column(Float, nullable=True)              # GENUS: REFORMA_PALIQEFET_IBSUF
    reforma_vibsuf_ibsuf = Column(Float, nullable=True)                 # GENUS: REFORMA_VIBSUF_IBSUF
    reforma_paliqefetregibsuf = Column(Float, nullable=True)            # GENUS: REFORMA_PALIQEFETREGIBSUF
    reforma_vtribregibsuf = Column(Float, nullable=True)                # GENUS: REFORMA_VTRIBREGIBSUF
    reforma_paliqibsuf_gov = Column(Float, nullable=True)               # GENUS: REFORMA_PALIQIBSUF_GOV
    reforma_vtribibsuf_gov = Column(Float, nullable=True)               # GENUS: REFORMA_VTRIBIBSUF_GOV
    reforma_vibs_transfcred = Column(Float, nullable=True)              # GENUS: REFORMA_VIBS_TRANSFCRED
    reforma_vibsestcred = Column(Float, nullable=True)                  # GENUS: REFORMA_VIBSESTCRED

    # ── Reforma Tributária: IBS-Município ────────────────────────────────
    reforma_pibsmun_ibsmun = Column(Float, nullable=True)               # GENUS: REFORMA_PIBSMUN_IBSMUN
    reforma_pdif_ibsmun = Column(Float, nullable=True)                  # GENUS: REFORMA_PDIF_IBSMUN
    reforma_vdif_ibsmun = Column(Float, nullable=True)                  # GENUS: REFORMA_VDIF_IBSMUN
    reforma_vdevtrib_ibsmun = Column(Float, nullable=True)              # GENUS: REFORMA_VDEVTRIB_IBSMUN
    reforma_predaliq_ibsmun = Column(Float, nullable=True)              # GENUS: REFORMA_PREDALIQ_IBSMUN
    reforma_paliqefet_ibsmun = Column(Float, nullable=True)             # GENUS: REFORMA_PALIQEFET_IBSMUN
    reforma_vibsmun_ibsmun = Column(Float, nullable=True)               # GENUS: REFORMA_VIBSMUN_IBSMUN
    reforma_paliqefetregibsmun = Column(Float, nullable=True)           # GENUS: REFORMA_PALIQEFETREGIBSMUN
    reforma_vtribregibsmun = Column(Float, nullable=True)               # GENUS: REFORMA_VTRIBREGIBSMUN
    reforma_paliqibsmun_gov = Column(Float, nullable=True)              # GENUS: REFORMA_PALIQIBSMUN_GOV
    reforma_vtribibsmun_gov = Column(Float, nullable=True)              # GENUS: REFORMA_VTRIBIBSMUN_GOV

    # ── Reforma Tributária: IBS total ────────────────────────────────────
    reforma_vibs = Column(Float, nullable=True)                         # GENUS: REFORMA_VIBS

    # ── Reforma Tributária: CBS ──────────────────────────────────────────
    reforma_pcbs_cbs = Column(Float, nullable=True)                     # GENUS: REFORMA_PCBS_CBS
    reforma_pdif_cbs = Column(Float, nullable=True)                     # GENUS: REFORMA_PDIF_CBS
    reforma_vdif_cbs = Column(Float, nullable=True)                     # GENUS: REFORMA_VDIF_CBS
    reforma_vdevtrib_cbs = Column(Float, nullable=True)                 # GENUS: REFORMA_VDEVTRIB_CBS
    reforma_predaliq_cbs = Column(Float, nullable=True)                 # GENUS: REFORMA_PREDALIQ_CBS
    reforma_paliqefet_cbs = Column(Float, nullable=True)                # GENUS: REFORMA_PALIQEFET_CBS
    reforma_vcbs_cbs = Column(Float, nullable=True)                     # GENUS: REFORMA_VCBS_CBS
    reforma_paliqefetregcbs = Column(Float, nullable=True)              # GENUS: REFORMA_PALIQEFETREGCBS
    reforma_vtribregcbs = Column(Float, nullable=True)                  # GENUS: REFORMA_VTRIBREGCBS
    reforma_paliqcbs_gov = Column(Float, nullable=True)                 # GENUS: REFORMA_PALIQCBS_GOV
    reforma_vtribcbs_gov = Column(Float, nullable=True)                 # GENUS: REFORMA_VTRIBCBS_GOV
    reforma_vcbs_transfcred = Column(Float, nullable=True)              # GENUS: REFORMA_VCBS_TRANSFCRED
    reforma_vcbsestcred = Column(Float, nullable=True)                  # GENUS: REFORMA_VCBSESTCRED

    # ── Reforma Tributária: registro especial (regime regional) ────────
    reforma_cstreg = Column(String(3), nullable=True)                   # GENUS: REFORMA_CSTREG
    reforma_cclasstribreg = Column(String(10), nullable=True)           # GENUS: REFORMA_CCLASSTRIBREG

    # ── Reforma Tributária: crédito presumido IBS/CBS ───────────────────
    reforma_ccredpres_ibs = Column(String(2), nullable=True)            # GENUS: REFORMA_CCREDPRES_IBS
    reforma_pcredpres_ibs = Column(Float, nullable=True)                # GENUS: REFORMA_PCREDPRES_IBS
    reforma_vcredpres_ibs = Column(Float, nullable=True)                # GENUS: REFORMA_VCREDPRES_IBS
    reforma_vcredprescondsus_ibs = Column(Float, nullable=True)         # GENUS: REFORMA_VCREDPRESCONDSUS_IBS
    reforma_ccredpres_cbs = Column(String(2), nullable=True)            # GENUS: REFORMA_CCREDPRES_CBS
    reforma_pcredpres_cbs = Column(Float, nullable=True)                # GENUS: REFORMA_PCREDPRES_CBS
    reforma_vcredpres_cbs = Column(Float, nullable=True)                # GENUS: REFORMA_VCREDPRES_CBS
    reforma_vcredprescondsus_cbs = Column(Float, nullable=True)         # GENUS: REFORMA_VCREDPRESCONDSUS_CBS
    reforma_tpcredpresibszfm = Column(String(1), nullable=True)         # GENUS: REFORMA_TPCREDPRESIBSZFM
    reforma_vcredpresibszfm = Column(Float, nullable=True)              # GENUS: REFORMA_VCREDPRESIBSZFM

    # ── Reforma Tributária: IS (Imposto Seletivo) ───────────────────────
    reforma_cstis_is = Column(String(3), nullable=True)                 # GENUS: REFORMA_CSTIS_IS
    reforma_cclasstribis_is = Column(String(10), nullable=True)         # GENUS: REFORMA_CCLASSTRIBIS_IS
    reforma_vbcis_is = Column(Float, nullable=True)                     # GENUS: REFORMA_VBCIS_IS
    reforma_pis_is = Column(Float, nullable=True)                       # GENUS: REFORMA_PIS_IS
    reforma_pisespec_is = Column(Float, nullable=True)                  # GENUS: REFORMA_PISESPEC_IS
    reforma_utrib_is = Column(String(10), nullable=True)                # GENUS: REFORMA_UTRIB_IS
    reforma_qtrib_is = Column(Float, nullable=True)                     # GENUS: REFORMA_QTRIB_IS
    reforma_vis_is = Column(Float, nullable=True)                       # GENUS: REFORMA_VIS_IS

    produto = relationship("Produto", back_populates="itens_saida")


class ItemSaidaExcluido(Base):
    """Registro de item de saída excluído (histórico/snapshot no momento da exclusão).

    Reconhece a estrutura completa da tabela DELSAILAN do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2) deste
    ERP, análoga a `ProdutoExcluido`/GENUS.DEL_PRODUTO, mas para
    `ItemSaida`/GENUS.SAILAN. Tipos foram conferidos diretamente no schema
    Firebird do GENUS via metadados (RDB$RELATION_FIELDS /
    RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS), sem ler nenhuma linha de
    dado de negócio:
    - CODEMPRESA / CODSAIDA / CODROMANEIO: INTEGER (RDB$FIELD_TYPE 8 /
      sub_type 0) -> Integer
    - CODPRODUTO / ALIQICMS (VARCHAR) / LOTEPRODUTO: VARCHAR (RDB$FIELD_TYPE
      37) -> String
    - RETIRAR / ESTOQUECLI / ENTRADASAIDA / REDUZIRBASEST / CALCULAIPIBASE /
      CODCFOP (CHAR) / CSOSN (CHAR): CHAR (RDB$FIELD_TYPE 14) -> String
    - CST / IPICST / PISCST / COFINSCST: VARCHAR(3) (RDB$FIELD_TYPE 37) ->
      String(3)
    - Demais campos numéricos (DESCONTO, UNITARIO, IPI, ICMS, FRETE, IVA,
      REDUCAO_ICMS, PERCOMISSAO, PERDESCONTO, REDUCAO_ICMSST, ICMSST,
      ICMS_BASE, ICMS_VALOR, ICMS_BASE_SUBST, ICMS_VALOR_SUBST, IPIVALOR,
      IPIBASECALCULO, ICMSOUTRAS, ICMSISENTO, PISVALOR, PISBASE,
      PISALIQUOTA, COFINSVALOR, COFINSBASE, COFINSALIQUOTA, QUANTIDADEPIS,
      ALIQPISREAIS, QUANTIDADECOFINS, ALIQCOFINSREAIS, CUSTO, SEGURO,
      OUTRAS, QTDE, CALCOMISSAO, TOTAL, VALCOMISSAO): NUMERIC (RDB$FIELD_TYPE
      8 ou 16 / sub_type 1) -> Float
    - OBSPRODUTO: BLOB SUB_TYPE 1 (RDB$FIELD_TYPE 261 / sub_type 1) -> Text
    - DT_EXCLUSAO: TIMESTAMP (RDB$FIELD_TYPE 35) -> DateTime

    Assim como DEL_PRODUTO, DELSAILAN **não tem nenhuma foreign key nem
    chave primária** no GENUS (confirmado via RDB$RELATION_CONSTRAINTS /
    RDB$REF_CONSTRAINTS: nenhuma constraint na tabela, nem PK nem FK) — ou
    seja, ela não é uma tabela filha "viva" de SAIDA/SAILAN no sentido
    relacional; é antes um "lixo"/histórico que guarda uma cópia de boa
    parte dos atributos comerciais/fiscais de SAILAN (mesmos nomes de
    coluna: CODEMPRESA, CODSAIDA, CODPRODUTO, QTDE, UNITARIO, TOTAL, ICMS,
    IPI etc. — só que sem CODIGO/NITEM/NUMITEM e sem os campos da Reforma
    Tributária, que SAILAN já tem) no momento em que a linha foi excluída de
    SAILAN no GENUS — permitindo recuperar/auditar um item de saída apagado.

    Diferente de `ProdutoExcluido` (1:1 com `Produto`, pois CODIGO é a
    própria PK de DEL_PRODUTO), aqui não há nenhuma coluna que garanta
    unicidade por produto — um mesmo produto pode ter sido vendido e
    excluído várias vezes (várias saídas), e a própria tabela não tem PK —
    por isso este model é modelado como lista (1:N), no mesmo padrão usado
    em `ItemSaida`.

    Por isso este model reconhece um vínculo opcional (`produto_id`) com o
    cadastro de produto já migrado (`Produto`, 5.629 produtos reais),
    resolvendo GENUS.DELSAILAN.CODPRODUTO contra GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `produto_id` é opcional (nullable) e
    o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça — e também porque um
    item excluído no GENUS pode não ter (mais) uma linha correspondente em
    `Produto` neste ERP.

    CODEMPRESA/CODSAIDA (chave da saída, ver `ItemSaida.cod_empresa`/
    `ItemSaida.cod_saida` e `Saida.cod_empresa`/`Saida.codigo`) e
    CODROMANEIO (ver `ItemSaida.cod_romaneio`) são mantidos como códigos
    brutos, sem FK própria, pelo mesmo motivo já documentado em `ItemSaida`
    — nenhuma linha de nenhuma dessas tabelas foi importada ainda.

    DT_EXCLUSAO guarda a data/hora em que a linha foi excluída de SAILAN no
    GENUS — o equivalente, para este model, do timestamp de auditoria que
    outras tabelas "filhas" de exclusão já reconhecidas neste ERP preservam
    (ver `ProdutoExcluido.data_alteracao_genus`).

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "itens_saida_excluidos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado (1:N, ver docstring) ─
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Identificação / chave original da linha e da saída (sem PK/FK no GENUS) ─
    cod_empresa = Column(Integer, nullable=True, index=True)            # GENUS: CODEMPRESA
    cod_saida = Column(Integer, nullable=True, index=True)              # GENUS: CODSAIDA (código bruto — SAIDA/SAILAN ainda sem FK própria, ver docstring)
    cod_produto = Column(String(15), nullable=True, index=True)         # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    lote_produto = Column(String(15), nullable=True, index=True)        # GENUS: LOTEPRODUTO

    # ── Quantidades / valores comerciais ───────────────────────────────────
    qtde = Column(Float, nullable=True)                                 # GENUS: QTDE
    unitario = Column(Float, nullable=True)                             # GENUS: UNITARIO
    total = Column(Float, nullable=True)                                # GENUS: TOTAL
    custo = Column(Float, nullable=True)                                # GENUS: CUSTO
    desconto = Column(Float, nullable=True)                             # GENUS: DESCONTO
    per_desconto = Column(Float, nullable=True)                         # GENUS: PERDESCONTO
    frete = Column(Float, nullable=True)                                # GENUS: FRETE
    seguro = Column(Float, nullable=True)                               # GENUS: SEGURO
    outras = Column(Float, nullable=True)                               # GENUS: OUTRAS
    retirar = Column(String(1), nullable=True)                          # GENUS: RETIRAR
    estoque_cli = Column(String(1), nullable=True)                      # GENUS: ESTOQUECLI

    # ── Comissão ────────────────────────────────────────────────────────
    perc_comissao = Column(Float, nullable=True)                        # GENUS: PERCOMISSAO
    cal_comissao = Column(Float, nullable=True)                         # GENUS: CALCOMISSAO
    val_comissao = Column(Float, nullable=True)                         # GENUS: VALCOMISSAO

    # ── Fiscal: ICMS / ICMS-ST ──────────────────────────────────────────
    entrada_saida = Column(String(1), nullable=True)                    # GENUS: ENTRADASAIDA
    cst = Column(String(3), nullable=True)                              # GENUS: CST
    csosn = Column(String(4), nullable=True)                            # GENUS: CSOSN
    cod_cfop = Column(String(5), nullable=True)                         # GENUS: CODCFOP
    aliq_icms = Column(String(5), nullable=True)                        # GENUS: ALIQICMS
    icms = Column(Float, nullable=True)                                 # GENUS: ICMS
    icms_base = Column(Float, nullable=True)                            # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                           # GENUS: ICMS_VALOR
    icms_outras = Column(Float, nullable=True)                          # GENUS: ICMSOUTRAS
    icms_isento = Column(Float, nullable=True)                          # GENUS: ICMSISENTO
    reducao_icms = Column(Float, nullable=True)                         # GENUS: REDUCAO_ICMS
    iva = Column(Float, nullable=True)                                  # GENUS: IVA
    icmsst = Column(Float, nullable=True)                               # GENUS: ICMSST
    reducao_icmsst = Column(Float, nullable=True)                       # GENUS: REDUCAO_ICMSST
    icms_base_subst = Column(Float, nullable=True)                      # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                     # GENUS: ICMS_VALOR_SUBST
    reduzir_base_st = Column(String(1), nullable=True)                  # GENUS: REDUZIRBASEST

    # ── Fiscal: IPI ──────────────────────────────────────────────────────
    ipi = Column(Float, nullable=True)                                  # GENUS: IPI
    ipi_cst = Column(String(3), nullable=True)                          # GENUS: IPICST
    ipi_valor = Column(Float, nullable=True)                            # GENUS: IPIVALOR
    ipi_base_calculo = Column(Float, nullable=True)                     # GENUS: IPIBASECALCULO
    calcula_ipi_base = Column(String(1), nullable=True)                 # GENUS: CALCULAIPIBASE

    # ── Fiscal: PIS / COFINS ─────────────────────────────────────────────
    pis_cst = Column(String(3), nullable=True)                          # GENUS: PISCST
    pis_valor = Column(Float, nullable=True)                            # GENUS: PISVALOR
    pis_base = Column(Float, nullable=True)                             # GENUS: PISBASE
    pis_aliquota = Column(Float, nullable=True)                         # GENUS: PISALIQUOTA
    quantidade_pis = Column(Float, nullable=True)                       # GENUS: QUANTIDADEPIS
    aliq_pis_reais = Column(Float, nullable=True)                       # GENUS: ALIQPISREAIS
    cofins_cst = Column(String(3), nullable=True)                       # GENUS: COFINSCST
    cofins_valor = Column(Float, nullable=True)                         # GENUS: COFINSVALOR
    cofins_base = Column(Float, nullable=True)                          # GENUS: COFINSBASE
    cofins_aliquota = Column(Float, nullable=True)                      # GENUS: COFINSALIQUOTA
    quantidade_cofins = Column(Float, nullable=True)                    # GENUS: QUANTIDADECOFINS
    aliq_cofins_reais = Column(Float, nullable=True)                    # GENUS: ALIQCOFINSREAIS

    # ── Referências (código bruto, tabela mestre ainda sem model dedicado) ─
    cod_romaneio = Column(Integer, nullable=True, index=True)           # GENUS: CODROMANEIO

    # ── Observação ────────────────────────────────────────────────────────
    obs_produto = Column(Text, nullable=True)                           # GENUS: OBSPRODUTO

    # ── Auditoria da exclusão ───────────────────────────────────────────
    dt_exclusao = Column(DateTime, nullable=True)                       # GENUS: DT_EXCLUSAO

    produto = relationship("Produto", back_populates="itens_saida_excluidos")


class ItemSaidaCancelado(Base):
    """Snapshot de item de saída cancelado (histórico do cancelamento de uma linha de SAILAN).

    Reconhece a estrutura completa da tabela SAILAN_CANCELADA do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2)
    deste ERP, irmã de `ItemSaidaExcluido`/GENUS.DELSAILAN: as duas guardam
    uma cópia dos atributos comerciais/fiscais de uma linha de
    `ItemSaida`/GENUS.SAILAN no momento em que algo aconteceu com ela no
    GENUS — DELSAILAN quando a linha foi **excluída**, SAILAN_CANCELADA
    quando a linha foi **cancelada** (dois eventos distintos do fluxo de
    faturamento: excluir remove o item; cancelar mantém o item mas marca a
    operação como não efetivada — ver também `ItemSaida.cancelado`,
    GENUS.SAILAN.CANCELADO, o mesmo indicador na tabela "viva"). Por isso
    SAILAN_CANCELADA não é reaproveitada dentro de `ItemSaidaExcluido`
    mesmo com campos conceitualmente parecidos: são snapshots de eventos
    diferentes, cada um com sua própria estrutura de colunas no GENUS.

    Tipos foram conferidos diretamente no schema Firebird do GENUS via
    metadados (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS /
    RDB$REF_CONSTRAINTS), sem ler nenhuma linha de dado de negócio:
    - CODEMPRESA: SMALLINT (RDB$FIELD_TYPE 7 / sub_type 0) -> Integer
    - CODSAIDA / CODSAILAN: INTEGER (RDB$FIELD_TYPE 8 / sub_type 0) ->
      Integer
    - CODPRODUTO (VARCHAR(15)) / ALIQICMS (VARCHAR(5)): RDB$FIELD_TYPE 37
      -> String
    - RETIRAR / ESTOQUECLI / ENTRADASAIDA (CHAR(1)) / CODCFOP (CHAR(5)):
      RDB$FIELD_TYPE 14 -> String
    - DESCONTO / UNITARIO / IPI / ICMS / IVA / REDUCAO_ICMS / PERCOMISSAO /
      PERDESCONTO: NUMERIC armazenado como INTEGER/BIGINT com escala
      negativa (RDB$FIELD_TYPE 8, sub_type 1) -> Float
    - FRETE / QTDE / TOTAL / CALCOMISSAO / VALCOMISSAO: NUMERIC armazenado
      como INT64/BIGINT com escala negativa (RDB$FIELD_TYPE 16, sub_type 0
      ou 1) -> Float

    SAILAN_CANCELADA **tem chave primária** no GENUS (`PK_SAILAN_CANCELADA`,
    confirmado via RDB$RELATION_CONSTRAINTS/RDB$INDEX_SEGMENTS), composta
    por CODEMPRESA + CODSAIDA + CODPRODUTO + CODSAILAN — e **nenhuma foreign
    key** (confirmado via RDB$REF_CONSTRAINTS: nenhuma linha). Repare que
    essa composição de chave (CODEMPRESA + CODSAIDA + CODPRODUTO + <campo
    de linha>) é estruturalmente idêntica à PK de SAILAN em si
    (CODEMPRESA + CODSAIDA + CODPRODUTO + CODIGO — ver `ItemSaida.codigo`):
    ou seja, CODSAILAN aqui corresponde ao CODIGO original da linha em
    SAILAN que foi cancelada, permitindo (quando os dados forem migrados)
    religar um registro de SAILAN_CANCELADA à linha de `ItemSaida` da qual
    ele é o snapshot de cancelamento. Ainda assim, seguindo o mesmo padrão
    já usado para `ItemSaida`/`ItemSaidaExcluido` (nenhuma linha de nenhuma
    das tabelas do módulo Vendas/Faturamento foi importada ainda), essa
    chave composta não é reaproveitada como PK nem ganha FK própria neste
    ERP agora — os quatro campos (`cod_empresa`, `cod_saida`,
    `cod_produto`, `cod_sailan`) são preservados como códigos brutos,
    indexados, e a resolução de fato (religar contra `ItemSaida` por esse
    quádruplo, e/ou contra `Saida` por `cod_empresa`/`cod_saida`) fica a
    cargo do agente de migração de dados.

    Assim como em `ItemSaida` e `ItemSaidaExcluido`, este model reconhece um
    vínculo opcional (`produto_id`) com o cadastro de produto já migrado
    (`Produto`, 5.629 produtos reais), resolvendo
    GENUS.SAILAN_CANCELADA.CODPRODUTO contra GENUS.PRODUTO.CODIGO (=
    `Produto.codigo` neste ERP) — tarefa do agente de migração de dados,
    não deste agente de estrutura. Por isso `produto_id` é opcional
    (nullable) e o código bruto original (`cod_produto`) é preservado à
    parte. Um mesmo produto pode ter tido várias linhas de saída canceladas
    ao longo do tempo, por isso o vínculo é modelado como lista (1:N), no
    mesmo padrão usado em `ItemSaida`/`ItemSaidaExcluido`.

    Diferente de `ItemSaidaExcluido`/DELSAILAN (que não tem PK/FK nenhuma no
    GENUS e reconhece dezenas de campos, incluindo boa parte da tributação
    detalhada de PIS/COFINS/IPI/DIFAL e o timestamp `dt_exclusao`),
    SAILAN_CANCELADA é uma estrutura bem mais enxuta (21 colunas apenas) —
    reconhece só os campos comerciais/de comissão e um subconjunto fiscal
    básico (ICMS/IPI/CFOP), sem os campos de PIS/COFINS, sem CST/CSOSN e sem
    nenhum timestamp de auditoria do cancelamento (o GENUS não guarda
    "quando" a linha foi cancelada nesta tabela, diferente de
    DT_EXCLUSAO em DELSAILAN).

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela SAILAN_CANCELADA foi lido no GENUS por este
    agente.
    """
    __tablename__ = "itens_saida_cancelados"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado (1:N, ver docstring) ─
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Identificação / chave original da linha e da saída (PK composta no GENUS, sem FK) ─
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA (parte da PK_SAILAN_CANCELADA)
    cod_saida = Column(Integer, nullable=True, index=True)               # GENUS: CODSAIDA (parte da PK_SAILAN_CANCELADA — FK bruta para SAIDA/ItemSaida, tabelas ainda sem FK própria aqui)
    cod_produto = Column(String(15), nullable=True, index=True)          # GENUS: CODPRODUTO (parte da PK_SAILAN_CANCELADA; código bruto, antes da resolução de produto_id)
    cod_sailan = Column(Integer, nullable=True, index=True)               # GENUS: CODSAILAN (parte da PK_SAILAN_CANCELADA; corresponde a ItemSaida.codigo — ver docstring)

    # ── Quantidades / valores comerciais ───────────────────────────────────
    qtde = Column(Float, nullable=True)                                  # GENUS: QTDE
    unitario = Column(Float, nullable=True)                             # GENUS: UNITARIO
    total = Column(Float, nullable=True)                                # GENUS: TOTAL
    desconto = Column(Float, nullable=True)                             # GENUS: DESCONTO
    per_desconto = Column(Float, nullable=True)                         # GENUS: PERDESCONTO
    frete = Column(Float, nullable=True)                                # GENUS: FRETE
    retirar = Column(String(1), nullable=True)                          # GENUS: RETIRAR
    estoque_cli = Column(String(1), nullable=True)                      # GENUS: ESTOQUECLI

    # ── Comissão ────────────────────────────────────────────────────────
    perc_comissao = Column(Float, nullable=True)                        # GENUS: PERCOMISSAO
    cal_comissao = Column(Float, nullable=True)                         # GENUS: CALCOMISSAO
    val_comissao = Column(Float, nullable=True)                         # GENUS: VALCOMISSAO

    # ── Fiscal: ICMS / IPI / CFOP ─────────────────────────────────────────
    entrada_saida = Column(String(1), nullable=True)                    # GENUS: ENTRADASAIDA
    cod_cfop = Column(String(5), nullable=True)                         # GENUS: CODCFOP
    aliq_icms = Column(String(5), nullable=True)                        # GENUS: ALIQICMS
    icms = Column(Float, nullable=True)                                 # GENUS: ICMS
    reducao_icms = Column(Float, nullable=True)                         # GENUS: REDUCAO_ICMS
    iva = Column(Float, nullable=True)                                  # GENUS: IVA
    ipi = Column(Float, nullable=True)                                  # GENUS: IPI

    produto = relationship("Produto", back_populates="itens_saida_cancelados")


class PedidoNota(Base):
    """Vínculo entre um pedido de venda e a(s) nota(s) fiscal(is) de saída geradas a partir dele.

    Reconhece a estrutura completa da tabela PEDIDONOTA do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2) deste
    ERP, seguindo o mesmo precedente estabelecido para
    `LogAlteracaoPedido`/GENUS.LOGALTERACAOPEDIDO. Tipos e chaves foram
    conferidos diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS / RDB$RELATION_CONSTRAINTS / RDB$REF_CONSTRAINTS /
    RDB$INDEX_SEGMENTS), sem ler nenhuma linha de dado de negócio: os 4
    campos são simples (CODEMPRESA/CODEMPRESASAIDA SMALLINT, RDB$FIELD_TYPE
    7; CODPEDIDO/CODSAIDA INTEGER, RDB$FIELD_TYPE 8) -> Integer, exatamente
    os tipos sugeridos para esta tabela.

    No GENUS, PEDIDONOTA é a tabela de vínculo (many-to-many) entre PEDIDO
    (cabeçalho do pedido de venda, já reconhecido neste ERP como
    `PedidoVenda`) e SAIDA (cabeçalho da nota fiscal de saída, já reconhecido
    neste ERP como `Saida`) — confirmado por duas foreign keys reais:
    - `FK_PEDIDONOTA_PEDIDO`: (CODEMPRESA, CODPEDIDO) -> PK_PEDIDO (a mesma
      chave natural já usada em `PedidoVenda.cod_empresa`/
      `PedidoVenda.codigo_genus`), ON UPDATE/DELETE CASCADE.
    - `FK_PEDIDONOTA_SAIDA`: (CODSAIDA, CODEMPRESASAIDA) -> PK_SAIDA (a
      mesma chave natural já usada em `Saida.codigo`/`Saida.cod_empresa`),
      ON UPDATE/DELETE CASCADE.
    Ou seja, cada linha registra que uma nota fiscal de saída específica foi
    emitida/gerada a partir de um pedido específico — um mesmo pedido pode
    ter várias linhas em PEDIDONOTA (faturamento parcial, várias notas a
    partir do mesmo pedido) e, estruturalmente, o inverso também é possível
    (a mesma chave de saída aparecer vinculada a mais de um pedido) — por
    isso este model é a tabela de junção pura de uma relação N:N entre
    `PedidoVenda` e `Saida`, e não um campo espalhado em nenhuma das duas.

    PEDIDONOTA tem chave primária composta própria no GENUS (`PK_PEDIDONOTA`,
    formada por CODEMPRESA + CODPEDIDO + CODSAIDA) — diferente de
    `LogAlteracaoPedido`/LOGALTERACAOPEDIDO (que não tem PK própria). Ainda
    assim, seguindo o mesmo critério já usado para as demais tabelas do
    GENUS reconhecidas neste ERP (nenhuma linha foi importada ainda), essa
    chave composta não é reaproveitada como PK deste ERP — o `id` serial é a
    única chave própria deste model, e os 4 campos originais são preservados
    como códigos brutos (`cod_*`), indexados.

    Este model é ligado tanto ao pedido de venda (`pedido_id` ->
    `PedidoVenda`) quanto à saída/nota fiscal (`saida_id` -> `Saida`) já
    reconhecidos neste ERP. Essas FKs só podem ser resolvidas de fato
    relacionando (GENUS.PEDIDONOTA.CODEMPRESA, GENUS.PEDIDONOTA.CODPEDIDO)
    com (`PedidoVenda.cod_empresa`, `PedidoVenda.codigo_genus`) e
    (GENUS.PEDIDONOTA.CODEMPRESASAIDA, GENUS.PEDIDONOTA.CODSAIDA) com
    (`Saida.cod_empresa`, `Saida.codigo`) — tarefa do agente de migração de
    dados, não deste agente de estrutura. Por isso `pedido_id`/`saida_id`
    são opcionais (nullable) e os códigos brutos originais (`cod_empresa`,
    `cod_pedido`, `cod_saida`, `cod_empresa_saida`) são preservados à parte,
    para não perder informação até que essa resolução aconteça.

    CODEMPRESASAIDA é o único dos 4 campos nullable no GENUS (os outros 3
    são NOT NULL, confirmado via RDB$RELATION_FIELDS/RDB$NULL_FLAG) — mesmo
    assim mantido nullable aqui, seguindo o padrão deste ERP de nunca exigir
    (`nullable=False`) um campo puramente estrutural ainda não populado por
    nenhuma importação de dados.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "pedidos_nota"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o pedido de venda e a saída/nota fiscal já migrados ───
    pedido_id = Column(Integer, ForeignKey("pedidos_venda.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODPEDIDO) -> (PedidoVenda.cod_empresa, PedidoVenda.codigo_genus)
    saida_id = Column(Integer, ForeignKey("saidas.id"), nullable=True, index=True)          # resolvido de GENUS: (CODEMPRESASAIDA, CODSAIDA) -> (Saida.cod_empresa, Saida.codigo)

    # ── Campos migrados de GENUS.PEDIDONOTA (PK composta no GENUS: CODEMPRESA + CODPEDIDO + CODSAIDA) ─
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA (parte da PK_PEDIDONOTA e da FK_PEDIDONOTA_PEDIDO)
    cod_pedido = Column(Integer, nullable=True, index=True)              # GENUS: CODPEDIDO (parte da PK_PEDIDONOTA e da FK_PEDIDONOTA_PEDIDO)
    cod_saida = Column(Integer, nullable=True, index=True)               # GENUS: CODSAIDA (parte da PK_PEDIDONOTA e da FK_PEDIDONOTA_SAIDA)
    cod_empresa_saida = Column(Integer, nullable=True, index=True)       # GENUS: CODEMPRESASAIDA (parte da FK_PEDIDONOTA_SAIDA; único campo nullable no GENUS)

    pedido = relationship("PedidoVenda", back_populates="notas_vinculadas")
    saida = relationship("Saida", back_populates="pedidos_vinculados")


class SaidaDevolucao(Base):
    """Devolução de mercadoria vinculada a uma saída (nota fiscal de venda).

    Reconhece a estrutura completa da tabela SAIDADEVOLUCAO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2)
    deste ERP, seguindo o mesmo precedente estabelecido para
    `PedidoNota`/GENUS.PEDIDONOTA (tabela de vínculo entre um pedido/saída já
    reconhecidos neste ERP). Os 11 campos e tipos seguidos aqui são os
    sugeridos para esta tabela (CODIGO/CODSAIDA/CODEMPRESA/SAIDACODIGO/
    SAIDACODEMPRESA/ENTRADADOC/ENTRADACODFORNECEDOR INTEGER;
    ENTRADATIPODOC CHAR(1); ENTRADASERIE CHAR(4); ENTRADACODEMPRESA INTEGER;
    REFCHAVE VARCHAR(70)); diferente de `PedidoNota`, este agente não teve
    acesso a uma instância viva do GENUS_ZANGUETTIN.FDB neste ambiente (sem
    `isql`/arquivo `.fdb` disponíveis) para confirmar os tipos via
    RDB$RELATION_FIELDS — os tipos abaixo replicam exatamente os já usados
    para os mesmos nomes de campo ENTRADA* em `Saida` (`entrada_cod_empresa`,
    `entrada_tipo_doc`, `entrada_doc`, `entrada_serie`,
    `entrada_cod_fornecedor`, seção "Entrada vinculada (devolução)"), que
    foram, por sua vez, verificados quando `Saida` foi criada.

    No GENUS, SAIDA guarda um único jogo de campos ENTRADA* (a devolução mais
    recente vinculada à nota) diretamente no cabeçalho — ver a seção
    "Entrada vinculada (devolução)" de `Saida`. SAIDADEVOLUCAO existe à parte
    porque uma mesma saída pode ter **várias** devoluções ao longo do tempo
    (devolução parcial em mais de uma remessa, cada uma com seu próprio
    documento de entrada/fornecedor) — SAIDADEVOLUCAO é, portanto, a tabela
    "filha"/detalhe de devoluções de `Saida`, análoga em espírito a
    `ItemSaida`/SAILAN (detalhe de produtos) e a `PedidoNota` (vínculo N:N),
    só que aqui o vínculo é 1:N (uma saída, várias devoluções).

    Interpretação dos 5 campos de identificação/vínculo, inferida pela
    convenção de nomenclatura já observada nas demais tabelas GENUS
    reconhecidas neste ERP (não confirmada por FK ao vivo nesta sessão):
    - CODEMPRESA + CODSAIDA + CODIGO formam a chave própria da linha de
      devolução dentro do GENUS (a empresa e a saída "dona" do registro,
      mais um identificador sequencial da própria devolução) — mantidos como
      códigos brutos (`cod_empresa`, `cod_saida`, `codigo`), sem reaproveitar
      como PK deste ERP, seguindo o mesmo critério já usado em `Saida.codigo`
      e `ItemSaida`.
    - SAIDACODEMPRESA + SAIDACODIGO (prefixo "SAIDA" explícito, mesmo padrão
      de nomenclatura já visto em `Saida.entrada_cod_empresa` etc., onde o
      prefixo indica a entidade referenciada) formam o par que de fato
      referencia a saída original — o mesmo par natural de `Saida.cod_empresa`
      / `Saida.codigo`. Por isso `saida_id` (FK para `Saida` já reconhecida
      neste ERP) é resolvido a partir de (SAIDACODEMPRESA, SAIDACODIGO), e
      não de (CODEMPRESA, CODSAIDA) — a resolução de fato é tarefa do agente
      de migração de dados, não deste agente de estrutura; por isso
      `saida_id` é nullable.

    ENTRADACODEMPRESA/ENTRADATIPODOC/ENTRADADOC/ENTRADASERIE/
    ENTRADACODFORNECEDOR identificam o documento de entrada (a remessa física
    de devolução) — mesmos nomes/tipos de `Saida.entrada_*`. ENTRADACODFORNECEDOR
    é apenas um código bruto (na prática um CODCADASTRO, como já documentado
    em `ProdutoReferencia.cod_fornecedor`/`ContaPagar.cod_fornecedor`);
    propositalmente sem FK própria aqui — requer resolução futura contra
    CADASTRO/`Fornecedor.cod_cadastro`.

    REFCHAVE é mantida como referência de chave (ex.: chave de NF-e do
    documento de entrada vinculado), String(70), mesmo tamanho já usado para
    `Saida.chave_nfe`/`SaidaExcluida.chave_nfe`.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela SAIDADEVOLUCAO foi lido no GENUS por este
    agente.
    """
    __tablename__ = "saidas_devolucao"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com a saída original já reconhecida neste ERP ────────────
    saida_id = Column(Integer, ForeignKey("saidas.id"), nullable=True, index=True)  # resolvido de GENUS: (SAIDACODEMPRESA, SAIDACODIGO) -> (Saida.cod_empresa, Saida.codigo)

    # ── Chave própria da linha de devolução no GENUS ─────────────────────
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA
    cod_saida = Column(Integer, nullable=True, index=True)                # GENUS: CODSAIDA
    codigo = Column(Integer, nullable=True, index=True)                   # GENUS: CODIGO

    # ── Referência explícita à saída original (par natural com Saida.cod_empresa/codigo) ─
    saida_codigo = Column(Integer, nullable=True, index=True)             # GENUS: SAIDACODIGO
    saida_cod_empresa = Column(Integer, nullable=True, index=True)        # GENUS: SAIDACODEMPRESA

    # ── Documento de entrada vinculado (remessa física da devolução) ─────
    entrada_cod_empresa = Column(Integer, nullable=True)                  # GENUS: ENTRADACODEMPRESA
    entrada_tipo_doc = Column(String(1), nullable=True)                   # GENUS: ENTRADATIPODOC
    entrada_doc = Column(Integer, nullable=True)                          # GENUS: ENTRADADOC
    entrada_serie = Column(String(4), nullable=True)                      # GENUS: ENTRADASERIE
    entrada_cod_fornecedor = Column(Integer, nullable=True)               # GENUS: ENTRADACODFORNECEDOR (código bruto — na verdade um CODCADASTRO; requer resolução futura contra CADASTRO/Fornecedor.cod_cadastro)

    # ── Referência de chave (ex.: chave de NF-e do documento de entrada) ─
    ref_chave = Column(String(70), nullable=True, index=True)             # GENUS: REFCHAVE

    saida = relationship("Saida", back_populates="devolucoes_vinculadas")


class NotaXml(Base):
    """XML da NF-e emitida vinculado a uma saída (nota fiscal de venda) — GENUS.NOTAXML.

    Reconhece a estrutura completa da tabela NOTAXML do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB) — módulo Fiscal (Tier 2) deste ERP. Tipos
    conferidos via metadados Firebird já coletados nesta sessão
    (RDB$RELATION_FIELDS/RDB$FIELDS): CODEMPRESA (RDB$FIELD_TYPE 7 =
    SMALLINT, NOT NULL no GENUS) -> Integer; CODSAIDA (RDB$FIELD_TYPE 8 =
    INTEGER, NOT NULL no GENUS) -> Integer; CHAVENFE (RDB$FIELD_TYPE 37 =
    VARCHAR, tamanho 70) -> String(70); ARQXML (RDB$FIELD_TYPE 261 = BLOB)
    -> Text. Apenas 4 colunas — tabela simples, sem seção fiscal própria
    (o cálculo de impostos já vive em `Saida`; NOTAXML só guarda o XML
    final já assinado/transmitido da NF-e).

    No GENUS, NOTAXML guarda o conteúdo bruto do XML da NF-e efetivamente
    emitida para uma saída (nota fiscal de venda) — uma linha por saída
    com XML gerado, vinculada 1:1 a SAIDA pelo par CODEMPRESA + CODSAIDA
    (o mesmo par natural já usado como chave de `Saida.cod_empresa`/
    `Saida.codigo`, e pelas demais tabelas "filhas" de SAIDA já
    reconhecidas neste ERP: `ItemSaida.cod_saida`/`cod_empresa`,
    `SaidaDevolucao.saida_codigo`/`saida_cod_empresa`,
    `FaturaNota.cod_saida`/`cod_empresa`). Por isso `saida_id` (FK própria
    para `Saida`, já reconhecida neste ERP) é criado aqui, seguindo
    exatamente o mesmo padrão de `FaturaNota.saida_id`/
    `SaidaDevolucao.saida_id`: resolvível relacionando
    (GENUS.NOTAXML.CODEMPRESA, GENUS.NOTAXML.CODSAIDA) com
    (`Saida.cod_empresa`, `Saida.codigo`) — tarefa do agente de migração de
    dados, não deste agente de estrutura (este agente não teve acesso a
    `isql`/instância viva do GENUS_ZANGUETTIN.FDB para confirmar uma FK
    nomeada via RDB$REF_CONSTRAINTS; a relação é inferida pela mesma
    convenção de nomenclatura CODEMPRESA+CODSAIDA já usada nas demais
    tabelas filhas de SAIDA citadas acima). `saida_id` é nullable e os
    códigos brutos originais (`cod_empresa`, `cod_saida`) são preservados
    à parte, para não perder informação até que essa resolução aconteça.

    Embora CODEMPRESA e CODSAIDA sejam NOT NULL no GENUS (formam a chave
    natural da linha), ambos são mantidos nullable aqui, seguindo o mesmo
    critério já usado para as demais tabelas do GENUS reconhecidas neste
    ERP (nenhuma linha foi importada ainda) — o `id` serial é a única
    chave própria deste model (mesmo critério documentado em `FaturaNota`
    para sua chave composta NOT NULL do GENUS).

    ARQXML é o conteúdo do XML da NF-e (BLOB no GENUS) — mapeado para
    `Text`, sem qualquer parsing/reinterpretação do conteúdo.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela NOTAXML foi lido no GENUS por este agente.
    """
    __tablename__ = "notas_xml"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com a saída/nota fiscal já reconhecida neste ERP ─────────
    saida_id = Column(Integer, ForeignKey("saidas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODSAIDA) -> (Saida.cod_empresa, Saida.codigo)

    # ── Chave natural original da linha no GENUS (par único com SAIDA) ───
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA (SMALLINT NOT NULL no GENUS; parte da chave natural com SAIDA)
    cod_saida = Column(Integer, nullable=True, index=True)               # GENUS: CODSAIDA (INTEGER NOT NULL no GENUS; parte da chave natural com SAIDA)

    # ── Dados do XML da NF-e ──────────────────────────────────────────────
    chave_nfe = Column(String(70), nullable=True, index=True)            # GENUS: CHAVENFE
    arq_xml = Column(Text, nullable=True)                                 # GENUS: ARQXML (conteúdo do XML da NF-e emitida)

    saida = relationship("Saida", back_populates="notas_xml_vinculadas")


class NotaCorrecao(Base):
    """Carta de Correção Eletrônica (CC-e) vinculada a uma saída (nota fiscal de venda) — GENUS.NOTACORRECAO.

    Reconhece a estrutura completa da tabela NOTACORRECAO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Fiscal (Tier 2) deste ERP, seguindo
    exatamente o mesmo precedente estabelecido para `NotaXml`/GENUS.NOTAXML
    (tabela "irmã", também filha de SAIDA e com o mesmo par de identificação
    CODEMPRESA + CODSAIDA). Os 6 campos e tipos usados aqui foram conferidos
    contra o cache de metadados Firebird já coletado nesta sessão
    (RDB$RELATION_FIELDS/RDB$FIELDS, mesmo utilizado para `NotaXml` e
    `SaidaDevolucao`): CODEMPRESA -> Integer; CODSAIDA -> Integer;
    SEQUENCIA -> Integer; TEXTO -> Text; EMISSAO -> DateTime;
    ARQXML -> Text.

    No GENUS, NOTACORRECAO guarda cada Carta de Correção Eletrônica (CC-e)
    emitida para complementar/corrigir uma NF-e de saída já transmitida
    (evento fiscal que retifica dados não relacionados a valor/quantidade/
    tributação, sem alterar a NF-e original) — diferente de NOTAXML, que
    guarda o XML da NF-e original em si (1:1 com SAIDA), aqui é 1:N: uma
    mesma saída pode receber várias CC-e ao longo do tempo, cada uma com seu
    próprio número sequencial (SEQUENCIA), texto da correção (TEXTO), data de
    emissão do evento (EMISSAO) e o XML do evento de CC-e já transmitido/
    autorizado (ARQXML) — mesmo espírito 1:N já visto em `SaidaDevolucao`
    (várias devoluções por saída).

    CODEMPRESA + CODSAIDA formam o mesmo par natural que identifica a saída
    "dona" da correção em `Saida.cod_empresa`/`Saida.codigo` (idêntico ao já
    usado por `NotaXml.cod_empresa`/`cod_saida`, `SaidaDevolucao.saida_cod_empresa`/
    `saida_codigo`, `ItemSaida.cod_empresa`/`cod_saida`) — por isso `saida_id`
    (FK própria para `Saida`, já reconhecida neste ERP) é criado aqui,
    seguindo exatamente o mesmo padrão de `NotaXml.saida_id`: resolvível
    relacionando (GENUS.NOTACORRECAO.CODEMPRESA, GENUS.NOTACORRECAO.CODSAIDA)
    com (`Saida.cod_empresa`, `Saida.codigo`) — tarefa do agente de migração
    de dados, não deste agente de estrutura. `saida_id` é nullable e os
    códigos brutos originais (`cod_empresa`, `cod_saida`) são preservados à
    parte, para não perder informação até que essa resolução aconteça.

    SEQUENCIA é o número sequencial da CC-e para aquela saída (1ª correção,
    2ª correção, ...) — mantido como Integer bruto, sem virar parte da PK
    deste ERP (mesmo critério de `Saida.codigo`/`SaidaDevolucao.codigo`).
    TEXTO é o texto livre da correção (o conteúdo da CC-e) — mapeado para
    `Text`. ARQXML é o XML do evento de CC-e já transmitido/autorizado
    (BLOB no GENUS, mesmo tratamento de `NotaXml.arq_xml`) — mapeado para
    `Text`, sem qualquer parsing/reinterpretação do conteúdo.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela NOTACORRECAO foi lido no GENUS por este agente.
    """
    __tablename__ = "notas_correcao"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com a saída/nota fiscal já reconhecida neste ERP ─────────
    saida_id = Column(Integer, ForeignKey("saidas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, CODSAIDA) -> (Saida.cod_empresa, Saida.codigo)

    # ── Chave natural original da linha no GENUS (par comum com SAIDA) ───
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA
    cod_saida = Column(Integer, nullable=True, index=True)                # GENUS: CODSAIDA

    # ── Dados da Carta de Correção Eletrônica (CC-e) ──────────────────────
    sequencia = Column(Integer, nullable=True)                            # GENUS: SEQUENCIA (número sequencial da CC-e para a saída)
    texto = Column(Text, nullable=True)                                   # GENUS: TEXTO (texto da correção)
    emissao = Column(DateTime, nullable=True)                             # GENUS: EMISSAO (data/hora de emissão do evento de CC-e)
    arq_xml = Column(Text, nullable=True)                                 # GENUS: ARQXML (XML do evento de CC-e transmitido/autorizado)

    saida = relationship("Saida", back_populates="notas_correcao_vinculadas")


class SaidaExcluida(Base):
    """Cabeçalho de saída excluído (histórico/snapshot no momento da exclusão).

    Reconhece a estrutura completa da tabela DELSAIDA do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2) deste
    ERP, análoga a `ProdutoExcluido`/GENUS.DEL_PRODUTO e a
    `ItemSaidaExcluido`/GENUS.DELSAILAN, só que para o **cabeçalho** da nota
    fiscal de saída (`Saida`/GENUS.SAIDA), não para a linha de produto
    (`ItemSaida`/GENUS.SAILAN). Ou seja: DEL_PRODUTO está para PRODUTO,
    DELSAILAN está para SAILAN, e DELSAIDA está para SAIDA — o mesmo padrão
    "tabela de lixo/histórico de exclusão", repetido em três níveis
    diferentes do módulo Vendas/Faturamento.

    DELSAIDA guarda uma cópia de praticamente todos os atributos comerciais
    e fiscais de `Saida`/GENUS.SAIDA (mesmos nomes de coluna: CODEMPRESA,
    CODIGO, TIPODOC, DOC, SERIE, CODCLIENTE, EMISSAO, ICMS_BASE, TOTAL,
    OBS, CHAVENFE etc. — reaproveitados aqui com os mesmos nomes em
    snake_case já usados em `Saida`, para consistência) no momento em que o
    cabeçalho de saída foi excluído de SAIDA no GENUS — permitindo
    recuperar/auditar uma nota fiscal de saída inteira que foi apagada.
    DELSAIDA não reconhece os campos da Reforma Tributária (REFORMA_*) nem
    os de Ordem de Serviço/retenções (VL_*), presentes em `Saida` mas
    ausentes nesta tabela de histórico — sinal de que DELSAIDA foi criada
    antes dessas extensões mais recentes da estrutura SAIDA no GENUS.

    Assim como DEL_PRODUTO e DELSAILAN, **não há nenhuma foreign key**
    própria criada aqui para (CODEMPRESA, CODIGO) contra `Saida` —
    propositalmente, seguindo o mesmo raciocínio já documentado em
    `ItemSaidaExcluido`: seria uma chave composta (CODEMPRESA + CODIGO, o
    mesmo par natural de `Saida.cod_empresa`/`Saida.codigo`), não há
    constraint única correspondente criada neste ERP para apoiar essa FK, e,
    por definição, uma linha excluída de SAIDA no GENUS normalmente **não**
    tem mais correspondente vivo em SAIDA (a menos que o código tenha sido
    reaproveitado depois) — por isso `cod_empresa`/`codigo` são mantidos
    como códigos brutos, indexados, sem FK própria; a resolução/religação
    (quando fizer sentido) fica a cargo do agente de migração de dados.

    CODCLIENTE, CODFUNCIONARIO, CODCONDPAGTO, CODTRANSPORTADOR,
    CODTRANSFERE, CODECF, CODTIPOVENDA, CODAGREGADO, COD_CUPOMVINCULADO,
    CODADM, EMAILCODFUNCIONARIO, CODCARTEIRA, CODCLIENTEENTREGA são,
    igualmente, apenas códigos brutos de tabelas legadas ainda não
    modeladas (ou já modeladas, mas sem FK própria criada aqui) — mesmo
    critério já adotado em `Saida` para os mesmos campos.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela DELSAIDA foi lido no GENUS por este agente.
    """
    __tablename__ = "saidas_excluidas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave original da saída excluída no GENUS ────────
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA (par natural com codigo; ver docstring — sem FK própria para Saida)
    codigo = Column(Integer, nullable=True, index=True)                  # GENUS: CODIGO (identificador original da saída excluída no GENUS)
    tipo_doc = Column(String(1), nullable=True)                          # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                                 # GENUS: DOC
    serie = Column(String(4), nullable=True)                             # GENUS: SERIE
    cod_cliente = Column(Integer, nullable=True, index=True)             # GENUS: CODCLIENTE
    cod_funcionario = Column(Integer, nullable=True)                     # GENUS: CODFUNCIONARIO
    cod_cond_pagto = Column(String(5), nullable=True)                    # GENUS: CODCONDPAGTO
    emissao = Column(DateTime, nullable=True)                            # GENUS: EMISSAO

    # ── Fiscal: ICMS / ICMS-ST / IPI / PIS / COFINS ───────────────────────
    cod_cfop = Column(String(5), nullable=True)                          # GENUS: CODCFOP
    cod_cfop2 = Column(String(5), nullable=True)                         # GENUS: CODCFOP2
    icms_base = Column(Float, nullable=True)                             # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                            # GENUS: ICMS_VALOR
    icms_base_subst = Column(Float, nullable=True)                       # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                      # GENUS: ICMS_VALOR_SUBST
    ipi_valor = Column(Float, nullable=True)                             # GENUS: IPI_VALOR
    pis_valor = Column(Float, nullable=True)                             # GENUS: PIS_VALOR
    cofins_valor = Column(Float, nullable=True)                          # GENUS: COFINS_VALOR
    credito_icms = Column(Float, nullable=True)                          # GENUS: CREDITOICMS

    # ── Valores comerciais / totais ────────────────────────────────────────
    valor_produtos = Column(Float, nullable=True)                        # GENUS: VAL_PRO
    frete = Column(Float, nullable=True)                                 # GENUS: FRETE
    seguro = Column(Float, nullable=True)                                # GENUS: SEGURO
    outras = Column(Float, nullable=True)                                # GENUS: OUTRAS
    total = Column(Float, nullable=True)                                 # GENUS: TOTAL
    desc_acres = Column(Float, nullable=True)                            # GENUS: DESC_ACRES
    descto1 = Column(Float, nullable=True)                               # GENUS: DESCTO1
    descto2 = Column(Float, nullable=True)                               # GENUS: DESCTO2
    descto3 = Column(Float, nullable=True)                               # GENUS: DESCTO3
    descto4 = Column(Float, nullable=True)                               # GENUS: DESCTO4
    descto5 = Column(Float, nullable=True)                               # GENUS: DESCTO5
    perc_divisao = Column(Float, nullable=True)                          # GENUS: PERCDIVISAO
    comissao = Column(Float, nullable=True)                              # GENUS: COMISSAO
    valor_credito = Column(Float, nullable=True)                         # GENUS: VALORCREDITO

    # ── Observação ──────────────────────────────────────────────────────
    observacao = Column(Text, nullable=True)                             # GENUS: OBS

    # ── Transferência entre empresas / identificação do destinatário ─────
    transfere = Column(String(1), nullable=True)                        # GENUS: TRANSFERE
    cpf_cnpj = Column(String(18), nullable=True)                        # GENUS: CPFCNPJ
    hora = Column(String(8), nullable=True)                             # GENUS: HORA
    cod_transfere = Column(Integer, nullable=True)                      # GENUS: CODTRANSFERE
    fechar = Column(String(1), nullable=True)                           # GENUS: FECHAR

    # ── Dados dos volumes transportados (seção NF-e) ──────────────────────
    quantidade_volumes = Column(String(10), nullable=True)              # GENUS: QUANTIDADE
    especie_volumes = Column(String(15), nullable=True)                 # GENUS: ESPECIE
    marca_volumes = Column(String(15), nullable=True)                   # GENUS: MARCA
    numero_volumes = Column(String(10), nullable=True)                  # GENUS: NUMERO
    peso_bruto_volumes = Column(String(15), nullable=True)              # GENUS: BRUTO
    peso_liquido_volumes = Column(String(15), nullable=True)            # GENUS: LIQUIDO

    # ── Transporte / entrega ───────────────────────────────────────────────
    cod_transportador = Column(Integer, nullable=True)                  # GENUS: CODTRANSPORTADOR
    frete_conta = Column(String(1), nullable=True)                      # GENUS: FRETECONTA
    placa = Column(String(8), nullable=True)                            # GENUS: PLACA

    # ── ECF / cupom fiscal ──────────────────────────────────────────────────
    cod_ecf = Column(Integer, nullable=True)                            # GENUS: CODECF
    ccf = Column(Integer, nullable=True)                                # GENUS: CCF
    retirar_estoque = Column(String(1), nullable=True)                  # GENUS: RETIRAR_ESTQ
    cod_tipo_venda = Column(Integer, nullable=True)                     # GENUS: CODTIPOVENDA
    romaneio = Column(Integer, nullable=True, index=True)               # GENUS: ROMANEIO
    romaneio_lote = Column(String(10), nullable=True)                   # GENUS: ROMANEIOLOTE
    chave_nfe = Column(String(70), nullable=True, index=True)           # GENUS: CHAVENFE
    cod_agregado = Column(Integer, nullable=True)                       # GENUS: CODAGREGADO
    avista_prazo = Column(String(1), nullable=True)                     # GENUS: AVISTAPRAZO
    cod_cupom_vinculado = Column(Integer, nullable=True)                # GENUS: COD_CUPOMVINCULADO

    # ── Liberação / datas de saída física ───────────────────────────────────
    dt_liberado = Column(DateTime, nullable=True)                       # GENUS: DTLIBERADO
    cod_adm = Column(Integer, nullable=True)                            # GENUS: CODADM
    dt_saida = Column(DateTime, nullable=True)                          # GENUS: DTSAIDA
    hora_saida = Column(String(8), nullable=True)                       # GENUS: HORASAIDA

    # ── Auditoria de origem (GENUS) ─────────────────────────────────────────
    cod_alteracao = Column(Integer, nullable=True)                      # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)             # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)              # GENUS: DATAALTERACAO
    email_enviado = Column(DateTime, nullable=True)                     # GENUS: EMAILENVIADO
    email_cod_funcionario = Column(Integer, nullable=True)              # GENUS: EMAILCODFUNCIONARIO

    # ── Carteira / classificação ───────────────────────────────────────────
    cod_carteira = Column(Integer, nullable=True)                       # GENUS: CODCARTEIRA
    discriminacao = Column(String(1), nullable=True)                    # GENUS: DISCRIMINACAO
    pedido_representante = Column(String(15), nullable=True)            # GENUS: PEDIDOREPRESENTANTE
    cod_cliente_entrega = Column(Integer, nullable=True)                # GENUS: CODCLIENTEENTREGA
    tipo_comercio = Column(String(1), nullable=True)                    # GENUS: TIPOCOMERCIO
    tipo_nf = Column(String(1), nullable=True)                          # GENUS: TIPONF
    tipo_cliente = Column(String(1), nullable=True)                     # GENUS: TIPOCLIENTE

    # ── Auditoria da exclusão ───────────────────────────────────────────
    dt_exclusao = Column(DateTime, nullable=True)                       # GENUS: DT_EXCLUSAO


class SaidaCancelada(Base):
    """Cabeçalho de saída cancelado (snapshot no momento do cancelamento).

    Reconhece a estrutura completa da tabela SAIDA_CANCELADA do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB) — módulo Vendas/Faturamento (Tier 2)
    deste ERP, irmã de `SaidaExcluida`/GENUS.DELSAIDA: as duas guardam uma
    cópia dos atributos comerciais/fiscais de um cabeçalho de
    `Saida`/GENUS.SAIDA no momento em que algo aconteceu com ele no GENUS —
    DELSAIDA quando o cabeçalho foi **excluído**, SAIDA_CANCELADA quando o
    cabeçalho foi **cancelado** (dois eventos distintos do fluxo de
    faturamento: excluir remove a nota; cancelar mantém a nota mas marca a
    operação como não efetivada — ver também `Saida.cancelado`,
    GENUS.SAIDA.CANCELADO, o mesmo indicador na tabela "viva"). Por isso
    SAIDA_CANCELADA não é reaproveitada dentro de `SaidaExcluida` mesmo com
    campos conceitualmente parecidos: são snapshots de eventos diferentes,
    cada um com sua própria estrutura de colunas no GENUS. É exatamente o
    mesmo raciocínio já usado para `ItemSaidaCancelado`/GENUS.SAILAN_CANCELADA
    (irmã de `ItemSaidaExcluido`/GENUS.DELSAILAN), só que aqui em nível de
    **cabeçalho** em vez de linha de produto.

    Todos os 43 campos desta tabela (CODEMPRESA, CODIGO, TIPODOC, DOC, SERIE,
    CODCLIENTE, CODFUNCIONARIO, CODCONDPAGTO, EMISSAO, CODCFOP, ICMS_BASE,
    ICMS_VALOR, ICMS_BASE_SUBST, ICMS_VALOR_SUBST, VAL_PRO, FRETE, SEGURO,
    OUTRAS, IPI_VALOR, TOTAL, OBS, TRANSFERE, CPFCNPJ, HORA, CODTRANSFERE,
    FECHAR, CODECF, CCF, DESC_ACRES, RETIRAR_ESTQ, CODTIPOVENDA, CHAVENFE,
    CODTRANSPORTADOR, CODAGREGADO, COMISSAO, AVISTAPRAZO,
    COD_CUPOMVINCULADO, VALORCREDITO, DTLIBERADO, CODADM, DTSAIDA,
    HORASAIDA, CODDIGITA) já existem, com o mesmo nome e mesmo tipo
    sugerido, em `Saida`/GENUS.SAIDA e/ou `SaidaExcluida`/GENUS.DELSAIDA
    (ex.: ICMS_BASE, CPFCNPJ, CHAVENFE, DTLIBERADO etc.) — os tipos aqui
    seguem, portanto, o mesmo mapeamento Firebird->SQLAlchemy já usado (e
    conferido via metadados) para esses campos idênticos em `Saida`/
    `SaidaExcluida`: SMALLINT/INTEGER simples -> Integer, CHAR/VARCHAR ->
    String(n), NUMERIC armazenado como INTEGER/BIGINT com escala negativa ->
    Float, TIMESTAMP -> DateTime, BLOB SUB_TYPE TEXT -> Text. O único campo
    sem precedente direto nas duas tabelas irmãs é CODDIGITA — um SMALLINT/
    INTEGER simples (mesmo padrão de CODADM/CODECF/CODAGREGADO, todos
    "código de quem fez algo"), mapeado aqui como Integer.

    SAIDA_CANCELADA é uma estrutura mais enxuta que `Saida` e até que
    `SaidaExcluida`: não reconhece os campos da Reforma Tributária
    (REFORMA_*), os de Ordem de Serviço/retenções (VL_*/COD_ORDEMSERVICO),
    os de volumes transportados (QUANTIDADE/ESPECIE/MARCA/NUMERO/BRUTO/
    LIQUIDO), descontos por faixa (DESCTO1..5), PIS/COFINS, romaneio,
    carteira/discriminação/tipo de cliente, nem nenhum timestamp de
    auditoria do cancelamento (diferente de DT_EXCLUSAO em `SaidaExcluida` —
    o GENUS não guarda "quando" o cabeçalho foi cancelado nesta tabela) —
    sinal de que é uma tabela de snapshot mais antiga/enxuta que DELSAIDA.

    Assim como `SaidaExcluida`, **não há nenhuma foreign key** própria criada
    aqui para (CODEMPRESA, CODIGO) contra `Saida` — propositalmente, seguindo
    o mesmo raciocínio já documentado em `SaidaExcluida`/`ItemSaidaExcluido`:
    seria uma chave composta (CODEMPRESA + CODIGO, o mesmo par natural de
    `Saida.cod_empresa`/`Saida.codigo`), não há constraint única
    correspondente criada neste ERP para apoiar essa FK, e, por definição,
    um cabeçalho cancelado pode ou não ter correspondente vivo em SAIDA —
    por isso `cod_empresa`/`codigo` são mantidos como códigos brutos,
    indexados, sem FK própria; a resolução/religação (quando fizer sentido)
    fica a cargo do agente de migração de dados.

    CODCLIENTE, CODFUNCIONARIO, CODCONDPAGTO, CODTRANSPORTADOR,
    CODTRANSFERE, CODECF, CODTIPOVENDA, CODAGREGADO, COD_CUPOMVINCULADO,
    CODADM, CODDIGITA são, igualmente, apenas códigos brutos de tabelas
    legadas ainda não modeladas (ou já modeladas, mas sem FK própria criada
    aqui) — mesmo critério já adotado em `Saida`/`SaidaExcluida` para os
    mesmos campos.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela SAIDA_CANCELADA foi lido no GENUS por este
    agente.
    """
    __tablename__ = "saidas_canceladas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave original da saída cancelada no GENUS ───────
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA (par natural com codigo; ver docstring — sem FK própria para Saida)
    codigo = Column(Integer, nullable=True, index=True)                  # GENUS: CODIGO (identificador original da saída cancelada no GENUS)
    tipo_doc = Column(String(1), nullable=True)                          # GENUS: TIPODOC
    doc = Column(Integer, nullable=True)                                 # GENUS: DOC
    serie = Column(String(4), nullable=True)                             # GENUS: SERIE
    cod_cliente = Column(Integer, nullable=True, index=True)             # GENUS: CODCLIENTE
    cod_funcionario = Column(Integer, nullable=True)                     # GENUS: CODFUNCIONARIO
    cod_cond_pagto = Column(String(5), nullable=True)                    # GENUS: CODCONDPAGTO
    emissao = Column(DateTime, nullable=True)                            # GENUS: EMISSAO

    # ── Fiscal: ICMS / IPI ─────────────────────────────────────────────────
    cod_cfop = Column(String(5), nullable=True)                          # GENUS: CODCFOP
    icms_base = Column(Float, nullable=True)                             # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                            # GENUS: ICMS_VALOR
    icms_base_subst = Column(Float, nullable=True)                       # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                      # GENUS: ICMS_VALOR_SUBST
    ipi_valor = Column(Float, nullable=True)                             # GENUS: IPI_VALOR

    # ── Valores comerciais / totais ────────────────────────────────────────
    valor_produtos = Column(Float, nullable=True)                        # GENUS: VAL_PRO
    frete = Column(Float, nullable=True)                                 # GENUS: FRETE
    seguro = Column(Float, nullable=True)                                # GENUS: SEGURO
    outras = Column(Float, nullable=True)                                # GENUS: OUTRAS
    total = Column(Float, nullable=True)                                 # GENUS: TOTAL
    desc_acres = Column(Float, nullable=True)                            # GENUS: DESC_ACRES
    comissao = Column(Float, nullable=True)                              # GENUS: COMISSAO
    valor_credito = Column(Float, nullable=True)                         # GENUS: VALORCREDITO

    # ── Observação ──────────────────────────────────────────────────────
    observacao = Column(Text, nullable=True)                             # GENUS: OBS

    # ── Transferência entre empresas / identificação do destinatário ─────
    transfere = Column(String(1), nullable=True)                        # GENUS: TRANSFERE
    cpf_cnpj = Column(String(18), nullable=True)                        # GENUS: CPFCNPJ
    hora = Column(String(8), nullable=True)                             # GENUS: HORA
    cod_transfere = Column(Integer, nullable=True)                      # GENUS: CODTRANSFERE
    fechar = Column(String(1), nullable=True)                           # GENUS: FECHAR

    # ── ECF / cupom fiscal / estoque ────────────────────────────────────────
    cod_ecf = Column(Integer, nullable=True)                            # GENUS: CODECF
    ccf = Column(Integer, nullable=True)                                # GENUS: CCF
    retirar_estoque = Column(String(1), nullable=True)                  # GENUS: RETIRAR_ESTQ
    cod_tipo_venda = Column(Integer, nullable=True)                     # GENUS: CODTIPOVENDA
    chave_nfe = Column(String(70), nullable=True, index=True)           # GENUS: CHAVENFE

    # ── Transporte / vínculos ───────────────────────────────────────────────
    cod_transportador = Column(Integer, nullable=True)                  # GENUS: CODTRANSPORTADOR
    cod_agregado = Column(Integer, nullable=True)                       # GENUS: CODAGREGADO
    avista_prazo = Column(String(1), nullable=True)                     # GENUS: AVISTAPRAZO
    cod_cupom_vinculado = Column(Integer, nullable=True)                # GENUS: COD_CUPOMVINCULADO

    # ── Liberação / datas de saída física ───────────────────────────────────
    dt_liberado = Column(DateTime, nullable=True)                       # GENUS: DTLIBERADO
    cod_adm = Column(Integer, nullable=True)                            # GENUS: CODADM
    dt_saida = Column(DateTime, nullable=True)                          # GENUS: DTSAIDA
    hora_saida = Column(String(8), nullable=True)                       # GENUS: HORASAIDA

    # ── Auditoria de origem (GENUS) ─────────────────────────────────────────
    cod_digita = Column(Integer, nullable=True)                         # GENUS: CODDIGITA


class TipoVenda(Base):
    """Tipo de venda (À Vista, A Prazo, Troca, Bonificação etc.) — tabela
    mestre TIPOVENDA.

    Reconhece a estrutura completa da tabela TIPOVENDA do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Tamanho`/GENUS.TAMANHO, `Marca`/GENUS.MARCA, `Regra`/GENUS.REGRAS
    e demais tabelas auxiliares mestre. Nomes e tipos foram conferidos
    contra o schema Firebird do GENUS (RDB$RELATION_FIELDS: CODIGO é
    SMALLINT, DESCRICAO é VARCHAR(35), e os quatro campos de flag são
    CHAR(1) — sem ler nenhuma linha de dado de negócio). GENUS.TIPOVENDA é
    uma tabela plana e independente (mestre de tipos de venda), com seis
    colunas: CODIGO, DESCRICAO, RETIRARESTOQUE, GERARFINANCEIRO,
    ENTRADASAIDA e MOSTRARELATORIO.

    `SAIDA.cod_tipo_venda` (ver `Saida` acima — GENUS: CODTIPOVENDA), assim
    como o mesmo campo em `ItemSaida`, `PedidoVenda`, `SaidaExcluida` e
    `SaidaCancelada`, hoje é um código bruto do GENUS ainda não resolvido
    contra nenhuma tabela própria deste ERP; o campo `codigo` abaixo (GENUS:
    CODIGO) é a peça que permitiria, no futuro, resolver essa referência
    (SAIDA.CODTIPOVENDA -> TIPOVENDA.CODIGO). Propositalmente não criamos
    essa FK agora — apenas reconhecemos os campos brutos do GENUS, para não
    perder nenhuma informação, no mesmo padrão já usado para
    `PRODUTO.CODGRUPO -> GrupoProduto.codigo` e
    `PRODUTO.CODTAMANHO -> Tamanho.codigo`.

    Este model não é filha de `Produto` nem de `Saida` (não tem CODPRODUTO
    nem é referenciada por chave estrangeira formal) — é uma tabela
    auxiliar mestre solta, por isso ganha entrada própria em
    `TabelasAuxiliaresWindow` no frontend, no mesmo padrão de
    `GrupoProduto`/`FormaPagamento`/`RegraEstado`/`TabelaPreco`/`Regra`/
    `Tamanho`/`Marca`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "tipos_venda"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.TIPOVENDA ────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)               # GENUS: CODIGO
    descricao = Column(String(35), nullable=True)                     # GENUS: DESCRICAO
    retirar_estoque = Column(String(1), nullable=True)                # GENUS: RETIRARESTOQUE
    gerar_financeiro = Column(String(1), nullable=True)               # GENUS: GERARFINANCEIRO
    entrada_saida = Column(String(1), nullable=True)                  # GENUS: ENTRADASAIDA
    mostra_relatorio = Column(String(1), nullable=True)               # GENUS: MOSTRARELATORIO


class Historico(Base):
    """Histórico padrão de lançamento financeiro — tabela mestre HISTORICO.

    Reconhece a estrutura completa da tabela HISTORICO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido
    para `Tamanho`/GENUS.TAMANHO, `Marca`/GENUS.MARCA, `Regra`/GENUS.REGRAS
    e `TipoVenda`/GENUS.TIPOVENDA. Nomes e tipos foram conferidos contra o
    schema Firebird do GENUS (RDB$RELATION_FIELDS: CODIGO é VARCHAR(12),
    DESCRI é VARCHAR(40), e os seis campos restantes — DEBCRE, GRAU,
    SITUACAO, MOSTRAR_DRE, PERMISSAO e TIPO — são todos CHAR(1) — sem ler
    nenhuma linha de dado de negócio). GENUS.HISTORICO é uma tabela plana e
    independente (mestre de históricos financeiros padronizados), com oito
    colunas: CODIGO, DESCRI, DEBCRE, GRAU, SITUACAO, MOSTRAR_DRE, PERMISSAO
    e TIPO.

    Esta é a tabela MESTRE que outras tabelas GENUS já reconhecidas neste
    ERP referenciam através de um código bruto (`cod_historico`) ainda não
    resolvido — ver `ContaPagar.cod_historico`, `ContaReceber.cod_historico`,
    `LancamentoContabil.cod_historico`, `ContaPagarExcluida.cod_historico` e
    `ContaReceberExcluida.cod_historico` (todos GENUS: CODHISTORICO,
    VARCHAR(12) — mesmo tamanho do `codigo` desta tabela). O campo `codigo`
    abaixo (GENUS: CODIGO) é a peça que permitiria, no futuro, resolver essa
    referência (PAGAR/RECEBER/LANCTOCONTABIL.CODHISTORICO ->
    HISTORICO.CODIGO). Propositalmente não criamos essa FK agora — apenas
    reconhecemos os campos brutos do GENUS, para não perder nenhuma
    informação, no mesmo padrão já usado para
    `PRODUTO.CODGRUPO -> GrupoProduto.codigo` e
    `SAIDA.CODTIPOVENDA -> TipoVenda.codigo`.

    Este model não é filha de nenhuma outra tabela (não tem chave
    estrangeira formal de nenhum outro model deste ERP) — é uma tabela
    auxiliar mestre solta, por isso ganha entrada própria em
    `TabelasAuxiliaresWindow` no frontend, no mesmo padrão de
    `GrupoProduto`/`FormaPagamento`/`RegraEstado`/`TabelaPreco`/`Regra`/
    `Tamanho`/`Marca`/`TipoVenda`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "historicos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.HISTORICO ────────────────────────────────
    codigo = Column(String(12), nullable=True, index=True)            # GENUS: CODIGO
    descricao = Column(String(40), nullable=True)                     # GENUS: DESCRI
    debito_credito = Column(String(1), nullable=True)                 # GENUS: DEBCRE
    grau = Column(String(1), nullable=True)                           # GENUS: GRAU
    situacao = Column(String(1), nullable=True)                       # GENUS: SITUACAO
    mostrar_dre = Column(String(1), nullable=True)                    # GENUS: MOSTRAR_DRE
    permissao = Column(String(1), nullable=True)                      # GENUS: PERMISSAO
    tipo = Column(String(1), nullable=True)                           # GENUS: TIPO


class Movto(Base):
    """Movimento de crédito de cadastro (GENUS.MOVTO) — módulo Financeiro
    (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela MOVTO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `ContaGenus`/GENUS.CONTAS, `FaturaPagar`/GENUS.FATURAPAGAR e
    `ChequeEmitido`/GENUS.CHEQUE_EMITIDO. Não foi possível confirmar os tipos
    contra a metadata Firebird ao vivo (RDB$RELATION_FIELDS etc.) neste
    ambiente de execução (sem acesso ao arquivo GENUS_ZANGUETTIN.FDB nem a
    `isql` aqui) — os tipos abaixo seguem exatamente a sugestão já fornecida
    para esta tabela, e o mesmo critério usado em todas as demais colunas de
    mesmo nome já reconhecidas em outras tabelas GENUS deste ERP
    (INTEGER/SMALLINT -> Integer, CHAR(1) -> String(1), DATE/TIMESTAMP ->
    DateTime, NUMERIC monetário -> Float, texto livre -> Text):
    - CODIGO -> `codigo`: identificador original do movimento no GENUS.
      Como em outras tabelas GENUS "mestre por empresa" já reconhecidas
      neste ERP (`ContaGenus`, `ContaPagar`, `ContaReceber`, `Fatura`,
      `FaturaPagar`), é provável que a chave primária real do GENUS seja
      composta (CODEMPRESA + CODIGO) — não confirmável aqui sem a metadata
      Firebird ao vivo. Nenhuma linha foi importada ainda, então essa
      possível chave composta não é reaproveitada como PK deste ERP — o
      `id` serial é a única chave própria deste model.
    - CODEMPRESA -> `cod_empresa`: FK, no GENUS, para EMPRESA (já
      reconhecida neste ERP como `Empresa`) — mantido como código bruto,
      sem FK própria, mesmo critério já usado em todas as demais tabelas
      GENUS deste ERP.
    - CODCADASTRO -> `cod_cadastro`: FK, no GENUS, para CADASTRO (já
      reconhecida neste ERP como `CadastroPessoa`, tabela mestre de
      identidade de pessoas/empresas) — mantido como código bruto
      (mirror), sem FK própria, mesmo critério usado em
      `FaturaPagar.cod_cadastro`/`Fatura.cod_cadastro`. Resolver esta
      referência (join contra `CadastroPessoa.codigo`) é tarefa do agente
      de migração de dados, fora do escopo desta atualização estrutural —
      esta anotação existe justamente para essa entidade real (cadastro
      completo do titular do movimento) não ficar "muda": a linha completa
      de MOVTO só se obtém unindo esta tabela com CADASTRO via CODCADASTRO.
    - EMISSAO -> `emissao`: DATE -> DateTime, data de lançamento do
      movimento — mesmo tratamento dado a toda data pura do GENUS já
      reconhecida neste ERP (ex.: `FaturaPagar.emissao`, `ContaPagar.emissao`).
    - CODFUNCIONARIO -> `cod_funcionario`: FK, no GENUS, para FUNCIONARIO
      (já reconhecida neste ERP como `Funcionario`) — mantido como código
      bruto, sem FK própria, mesmo critério usado em outras tabelas GENUS
      deste ERP (ex.: `AuditoriaPrePedido.cod_funcionario`). Identifica o
      funcionário que lançou/registrou o movimento.
    - TIPO -> `tipo`: CHAR(1) -> String(1), flag de 1 caractere. Sem acesso à
      metadata Firebird ao vivo não é possível confirmar os valores
      possíveis; pelo padrão de outras tabelas GENUS com coluna TIPO/
      ENTRADASAIDA já reconhecidas neste ERP (ex.: `TipoVenda.entrada_saida`,
      `Historico.tipo`), é provável que indique se este é um movimento de
      entrada ou saída de crédito para o cadastro.
    - CODSAIDA -> `cod_saida`: FK, no GENUS, para SAIDA (já reconhecida
      neste ERP como `Saida`) — mantido como código bruto, sem FK própria,
      mesmo critério usado em outras tabelas GENUS deste ERP que
      referenciam SAIDA apenas por código (ex.: `ItemOrcamentoGenus.cod_saida`,
      `PedidoNota.cod_saida`). Sugere que este movimento de crédito pode ter
      se originado de uma saída/nota (ex.: crédito gerado por devolução de
      mercadoria), embora essa relação não seja confirmável sem a metadata
      Firebird ao vivo.
    - CREDITO -> `credito`: NUMERIC monetário -> Float, mesmo tratamento
      dado a todo campo monetário já reconhecido neste ERP
      (`ContaPagar.valor`, `ChequeEmitido.valor` etc.) — valor do crédito
      lançado neste movimento.
    - OBS -> `obs`: texto -> Text, mesmo tratamento de
      `Produto.observacao`/`FaturaPagar.obs`, texto livre sem limite de
      tamanho definido.
    - DTCREDITO -> `dt_credito`: DATE -> DateTime — data em que o crédito
      efetivamente fica disponível/é liberado para uso, distinta de EMISSAO
      (a data em que o movimento foi lançado).
    - CODALTERACAO / HORAALTERACAO / DATAALTERACAO -> `cod_alteracao` /
      `hora_alteracao_genus` / `data_alteracao_genus`: trio padrão de
      auditoria de origem já usado em todas as demais tabelas GENUS
      reconhecidas neste ERP (INTEGER / CHAR(8) / DATE -> Integer /
      String(8) / DateTime).
    - CODCADASTROCREDITO -> `cod_cadastro_credito`: FK, no GENUS, também
      para CADASTRO (mesma tabela mestre de `cod_cadastro` acima) — mantido
      como código bruto separado (mirror), sem FK própria. Como o nome
      sugere um segundo cadastro distinto do CODCADASTRO original (por
      exemplo, o cadastro que efetivamente recebe/é titular do crédito,
      quando diferente do cadastro do movimento em si — caso de
      transferência de crédito entre cadastros), esta coluna é preservada
      à parte, e não reaproveitada como o mesmo campo de `cod_cadastro`.
      Resolver esta segunda referência (join contra `CadastroPessoa.codigo`)
      é, do mesmo modo, tarefa do agente de migração de dados.

    Nota importante sobre a hipótese inicial desta tarefa: a lista de
    campos fornecida para MOVTO **não inclui** nenhuma coluna CODCONTAS (ou
    equivalente) — ou seja, ao contrário do que se poderia supor por
    analogia com `ContaGenus`/GENUS.CONTAS (conta bancária/caixa), este
    model **não** parece ser um extrato de movimentação bancária/caixa de
    uma conta CONTAS; nenhum vínculo com `ContaGenus` é criado aqui. Pelos
    campos realmente presentes (CODCADASTRO, CODCADASTROCREDITO, CODSAIDA,
    CREDITO), MOVTO se parece mais com um livro-razão de crédito de
    cliente/cadastro (ex.: crédito de devolução, "vale-troca") do que com um
    extrato bancário. Esta observação fica registrada aqui para o agente de
    migração de dados não presumir uma relação com `ContaGenus` que os
    campos não sustentam.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "movtos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.MOVTO ────────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)                    # GENUS: CODIGO (PK original no GENUS, provavelmente composta com CODEMPRESA)
    cod_empresa = Column(Integer, nullable=True, index=True)               # GENUS: CODEMPRESA (FK -> EMPRESA, ver Empresa; mirror bruto sem FK própria)
    cod_cadastro = Column(Integer, nullable=True, index=True)              # GENUS: CODCADASTRO (FK -> CADASTRO, ver CadastroPessoa; mirror bruto sem FK própria — ver docstring)
    emissao = Column(DateTime, nullable=True, index=True)                  # GENUS: EMISSAO
    cod_funcionario = Column(Integer, nullable=True)                       # GENUS: CODFUNCIONARIO (FK -> FUNCIONARIO, ver Funcionario; mirror bruto sem FK própria)
    tipo = Column(String(1), nullable=True)                                # GENUS: TIPO
    cod_saida = Column(Integer, nullable=True, index=True)                 # GENUS: CODSAIDA (FK -> SAIDA, ver Saida; mirror bruto sem FK própria)
    credito = Column(Float, nullable=True)                                 # GENUS: CREDITO
    obs = Column(Text, nullable=True)                                      # GENUS: OBS
    dt_credito = Column(DateTime, nullable=True)                           # GENUS: DTCREDITO
    cod_alteracao = Column(Integer, nullable=True)                         # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)                # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                 # GENUS: DATAALTERACAO
    cod_cadastro_credito = Column(Integer, nullable=True, index=True)      # GENUS: CODCADASTROCREDITO (segundo FK bruto -> CADASTRO, ver CadastroPessoa; ver docstring)


class BcoSicred(Base):
    """Configuração de integração/retorno bancário do Banco Sicred, por
    empresa/carteira (GENUS.BCOSICRED) — módulo Financeiro (Tier 2) deste
    ERP.

    Reconhece a estrutura completa da tabela BCOSICRED do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB). Não foi possível confirmar os tipos contra
    a metadata Firebird ao vivo (RDB$RELATION_FIELDS etc.) neste ambiente de
    execução (sem acesso ao arquivo GENUS_ZANGUETTIN.FDB nem a `isql` aqui)
    — os tipos abaixo seguem exatamente a sugestão já fornecida para esta
    tabela, cruzada com o mesmo critério usado em todas as colunas de mesmo
    nome já reconhecidas em outras tabelas GENUS deste ERP (INTEGER/
    SMALLINT -> Integer, CHAR(N)/VARCHAR(N) -> String(N), NUMERIC monetário
    -> Float).

    BCOSICRED é uma tabela de layout de arquivo de retorno/remessa bancária
    (CNAB) **específica do Banco Sicred** — um cadastro de parâmetros de
    cobrança/boleto usado para gerar a remessa e interpretar o retorno desse
    banco em particular, por empresa (e possivelmente por carteira). É
    análoga, dentro do GENUS, às tabelas irmãs BCOBRADESCO, BCOBRASIL,
    BCOCAIXA, BCOHSBC, BCOITAU, BCOSANTANDER e BCOSICOOB — todas tabelas de
    layout de retorno bancário por banco, uma por instituição, ainda não
    modeladas neste ERP (fora do escopo desta atualização, que toca apenas
    BCOSICRED).

    Detalhe dos campos:
    - CODIGO -> `codigo`: identificador original do registro no GENUS. Como
      em outras tabelas GENUS "mestre por empresa" já reconhecidas neste ERP
      (`ContaGenus`, `ContaPagar`, `ContaReceber`, `Fatura`, `FaturaPagar`),
      é provável que a chave primária real do GENUS seja composta
      (CODEMPRESA + CODIGO) — não confirmável aqui sem a metadata Firebird
      ao vivo. Seguindo o mesmo critério já usado para as demais tabelas do
      GENUS reconhecidas neste ERP (nenhuma linha importada ainda), essa
      possível chave composta não é reaproveitada como PK deste ERP — o
      `id` serial é a única chave própria deste model.
    - AGENCIA / CONTA -> `agencia` / `conta`: dados bancários da conta
      Sicred usada para a cobrança (agência e número da conta/cedente no
      banco).
    - JUROSMORA -> `juros_mora`: NUMERIC monetário/percentual -> Float, taxa
      de juros de mora cobrada em atraso (mesmo tratamento dado a todo
      campo percentual/monetário já reconhecido neste ERP).
    - SEQUENCIA -> `sequencia`: contador sequencial interno (ex.: sequência
      de registro/lote), sem confirmação da semântica exata sem a metadata
      Firebird ao vivo.
    - ACEITE -> `aceite`: CHAR(1) -> String(1), flag de aceite do boleto
      (campo padrão de layout de cobrança bancária, ex.: 'A'/'N' — aceite/
      não aceite).
    - DIASPROTESTO -> `dias_protesto`: número de dias após o vencimento para
      protesto automático do título, se configurado.
    - INSTRUCAO1 / INSTRUCAO2 -> `instrucao1` / `instrucao2`: CHAR(2) ->
      String(2), códigos de instrução de cobrança enviados ao banco no
      layout CNAB (ex.: instruções de protesto, desconto, não cobrar juros
      etc. — o significado exato de cada código é definido pelo manual de
      integração do Sicred, não pela metadata Firebird).
    - CODCARTEIRA -> `cod_carteira`: FK, no GENUS, para CARTEIRA (ainda não
      modelada neste ERP) — mantido como código bruto, sem FK própria,
      mesmo critério já usado em `FaturaPagar.cod_carteira`,
      `ContaPagar.cod_carteira`, `ContaReceber.cod_carteira` etc. Distinto
      de `carteira` (ver CARTEIRA abaixo): este é o vínculo interno do
      sistema com o cadastro de carteira, enquanto `carteira` é o código
      textual da carteira exigido pelo layout do banco.
    - CODEMPRESA -> `cod_empresa`: FK, no GENUS, para EMPRESA (já
      reconhecida neste ERP como `Empresa`) — mantido como código bruto,
      sem FK própria, mesmo critério já usado em todas as demais tabelas
      GENUS deste ERP.
    - CODCEDENTE -> `cod_cedente`: nenhuma outra tabela GENUS já reconhecida
      neste ERP usa esta coluna (grep direto no código-fonte deste model
      não encontrou nenhuma ocorrência prévia de CODCEDENTE), então não há
      precedente local para confirmar o destino exato desta FK. Pelo nome
      (CEDENTE = beneficiário do boleto perante o banco) e pelo padrão já
      usado em outras tabelas GENUS de cobrança/cadastro reconhecidas neste
      ERP (`CODCADASTRO` como FK para a tabela mestre de identidade CADASTRO,
      já reconhecida neste ERP como `CadastroPessoa`), é provável que
      CODCEDENTE também seja uma FK para CADASTRO — mas isso **não é
      confirmável aqui sem a metadata Firebird ao vivo** (poderia, em vez
      disso, referenciar uma tabela de cedentes própria, ainda não
      modelada). Mantido como código bruto (`cod_cedente`), sem FK própria.
      Caso se confirme que aponta para CADASTRO, resolver o cedente
      completo (razão social, CNPJ, endereço) exigirá o JOIN entre esta
      tabela e CADASTRO via CODCEDENTE — tarefa do agente de migração de
      dados, fora do escopo desta atualização estrutural; esta anotação
      existe justamente para essa relação não ficar muda.
    - ESPECIE -> `especie`: CHAR(2) -> String(2), código da espécie do
      título (ex.: duplicata, nota promissória) exigido pelo layout CNAB.
    - OBSERVACAO -> `observacao`: VARCHAR(160) -> String(160), mesma largura
      já usada para observação de boleto em `ContaPagar.obs_boleto`
      (GENUS: OBSBOLETO) — texto livre impresso no boleto/mensagem ao
      sacado.
    - SEQREMESSA -> `seq_remessa`: número sequencial da última remessa CNAB
      gerada para esta configuração/empresa junto ao Sicred.
    - CARTEIRA -> `carteira`: VARCHAR(10) -> String(10), código textual da
      carteira exigido pelo layout de arquivo do banco (distinto de
      `cod_carteira`/CODCARTEIRA, o vínculo interno do sistema — ver acima).
    - CONVENIO -> `convenio`: VARCHAR(10) -> String(10), número de convênio
      de cobrança contratado junto ao Sicred.
    - CNAB -> `cnab`: VARCHAR(3) -> String(3), versão/layout do arquivo CNAB
      utilizado (ex.: "240", "400").
    - EMITIRBOLETO -> `emitir_boleto`: VARCHAR(15) -> String(15), parâmetro
      que controla o modo de emissão do boleto (ex.: caminho/nome de
      relatório, ou flag textual de forma de emissão) — sem confirmação da
      semântica exata sem a metadata Firebird ao vivo.
    - POSTO -> `posto`: CHAR(2) -> String(2), código do posto/agência
      utilizado por alguns bancos cooperativos (o Sicred, sendo uma
      cooperativa de crédito, costuma ter posto de atendimento além da
      agência).
    - POSTAR -> `postar`: CHAR(1) -> String(1), flag de 1 caractere (ex.:
      'S'/'N' indicando se o boleto deve ser postado/enviado por correio).
    - TIPOJUROS -> `tipo_juros`: CHAR(1) -> String(1), flag indicando o
      critério de cálculo do juros de mora (ex.: valor fixo vs. percentual
      ao dia/mês) associado a JUROSMORA.
    - CAMINHO -> `caminho`: VARCHAR(120) -> String(120), caminho de arquivo
      (ex.: local de geração/gravação do arquivo de remessa/retorno CNAB
      deste banco), mesma largura já usada para `ProdutoExcluido.descricao`
      (GENUS: DESCRI, também VARCHAR(120)).
    - MULTA -> `multa`: NUMERIC monetário/percentual -> Float, taxa de multa
      por atraso, mesmo tratamento dado a JUROSMORA.
    - NUMERO -> `numero`: contador/número sequencial adicional (distinto de
      SEQUENCIA e SEQREMESSA), sem confirmação da semântica exata sem a
      metadata Firebird ao vivo.
    - CARTEIRABANCO -> `carteira_banco`: código numérico da carteira exigido
      pelo layout específico do Sicred (distinto tanto de `carteira`
      — o código textual — quanto de `cod_carteira` — o vínculo interno do
      sistema com CARTEIRA) — terceira representação de carteira coexistindo
      nesta mesma tabela, cada uma preservada em coluna própria por
      segurança, já que a tabela fornecida não deixa claro se são
      equivalentes.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "bco_sicred"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.BCOSICRED ────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)            # GENUS: CODIGO (PK original no GENUS, provavelmente composta com CODEMPRESA)
    agencia = Column(String(6), nullable=True)                     # GENUS: AGENCIA
    conta = Column(String(10), nullable=True)                      # GENUS: CONTA
    juros_mora = Column(Float, nullable=True)                      # GENUS: JUROSMORA
    sequencia = Column(Integer, nullable=True)                     # GENUS: SEQUENCIA
    aceite = Column(String(1), nullable=True)                      # GENUS: ACEITE
    dias_protesto = Column(Integer, nullable=True)                 # GENUS: DIASPROTESTO
    instrucao1 = Column(String(2), nullable=True)                  # GENUS: INSTRUCAO1
    instrucao2 = Column(String(2), nullable=True)                  # GENUS: INSTRUCAO2
    cod_carteira = Column(Integer, nullable=True, index=True)      # GENUS: CODCARTEIRA (FK -> CARTEIRA, ainda não modelada neste ERP; mirror bruto sem FK própria)
    cod_empresa = Column(Integer, nullable=True, index=True)       # GENUS: CODEMPRESA (FK -> EMPRESA, ver Empresa; mirror bruto sem FK própria)
    cod_cedente = Column(Integer, nullable=True, index=True)       # GENUS: CODCEDENTE (provável FK -> CADASTRO, ver CadastroPessoa; não confirmável sem metadata Firebird ao vivo; mirror bruto sem FK própria — ver docstring)
    especie = Column(String(2), nullable=True)                     # GENUS: ESPECIE
    observacao = Column(String(160), nullable=True)                # GENUS: OBSERVACAO
    seq_remessa = Column(Integer, nullable=True)                   # GENUS: SEQREMESSA
    carteira = Column(String(10), nullable=True)                   # GENUS: CARTEIRA (código textual de carteira exigido pelo layout do banco; distinto de cod_carteira/CODCARTEIRA)
    convenio = Column(String(10), nullable=True)                   # GENUS: CONVENIO
    cnab = Column(String(3), nullable=True)                        # GENUS: CNAB
    emitir_boleto = Column(String(15), nullable=True)              # GENUS: EMITIRBOLETO
    posto = Column(String(2), nullable=True)                       # GENUS: POSTO
    postar = Column(String(1), nullable=True)                      # GENUS: POSTAR
    tipo_juros = Column(String(1), nullable=True)                  # GENUS: TIPOJUROS
    caminho = Column(String(120), nullable=True)                   # GENUS: CAMINHO
    multa = Column(Float, nullable=True)                           # GENUS: MULTA
    numero = Column(Integer, nullable=True)                        # GENUS: NUMERO
    carteira_banco = Column(Integer, nullable=True)                # GENUS: CARTEIRABANCO (código numérico de carteira do Sicred; distinto de carteira e cod_carteira — ver docstring)


class Credito(Base):
    """Crédito de cliente disponível (GENUS.CREDITO) — módulo Financeiro
    (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela CREDITO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `ContaGenus`/GENUS.CONTAS, `Movto`/GENUS.MOVTO e `BcoSicred`/
    GENUS.BCOSICRED. Não foi possível confirmar os tipos contra a metadata
    Firebird ao vivo (RDB$RELATION_FIELDS etc.) neste ambiente de execução
    (sem acesso ao arquivo GENUS_ZANGUETTIN.FDB nem a `isql` aqui) — os
    tipos abaixo seguem exatamente a sugestão já fornecida para esta tabela,
    cruzada com o mesmo critério usado em todas as colunas de mesmo nome já
    reconhecidas em outras tabelas GENUS deste ERP (INTEGER/SMALLINT ->
    Integer, CHAR(N)/VARCHAR(N) -> String(N), DATE/TIMESTAMP -> DateTime,
    NUMERIC monetário -> Float, texto livre -> Text).

    GENUS.CREDITO parece ser o registro de saldo credor disponível do
    cliente (crédito que o cliente tem para abater em compras futuras),
    distinto de:
    - `Movto`/GENUS.MOVTO ("Movimento de crédito de cadastro"), que é o
      livro-razão/histórico de lançamentos de crédito por CADASTRO (entradas
      e saídas de crédito, com CODCADASTRO/CODCADASTROCREDITO,
      CODFUNCIONARIO, TIPO de movimento). CREDITO, por outro lado,
      referencia o cliente diretamente por CODCLIENTE (não por CODCADASTRO)
      e carrega CODCONTA/CODHISTORICO (colunas típicas de lançamento
      contábil/financeiro, ausentes em MOVTO) — os dois parecem ser tabelas
      irmãs, com propósito e chaves diferentes, não a mesma entidade. Nenhum
      vínculo entre `Credito` e `Movto` é criado aqui, por falta de
      confirmação contra a metadata Firebird ao vivo.
    - CREDITOFORNECEDOR (crédito de fornecedor) e CREDITOICMS (crédito
      tributário de ICMS), tabelas GENUS irmãs por nome mas de propósito
      distinto (crédito de fornecedor / crédito de ICMS, não crédito de
      cliente) — nenhuma das duas é modelada aqui; ficam fora do escopo
      desta atualização, que toca apenas CREDITO.

    Detalhe dos campos:
    - CODIGO -> `codigo`: identificador original do registro de crédito no
      GENUS. Como em outras tabelas GENUS "mestre por empresa" já
      reconhecidas neste ERP (`ContaGenus`, `ContaPagar`, `ContaReceber`,
      `Movto`), é provável que a chave primária real do GENUS seja composta
      (CODEMPRESA + CODIGO) — não confirmável aqui sem a metadata Firebird
      ao vivo. Nenhuma linha foi importada ainda, então essa possível chave
      composta não é reaproveitada como PK deste ERP — o `id` serial é a
      única chave própria deste model.
    - CODEMPRESA -> `cod_empresa`: FK, no GENUS, para EMPRESA (já reconhecida
      neste ERP como `Empresa`) — mantido como código bruto, sem FK própria,
      mesmo critério usado em todas as demais tabelas GENUS deste ERP.
    - CODCLIENTE -> `cod_cliente`: FK, no GENUS, para CADASTRO/CLIENTE
      (mesmo critério já usado em `ContaReceber.cod_cliente`,
      `PedidoVenda.cod_cliente`, `Fatura.cod_cliente` etc.) — mantido como
      código bruto, sem FK própria. A entidade real do cliente titular deste
      crédito só se obtém unindo esta tabela com CADASTRO/CLIENTE via
      CODCLIENTE — tarefa do agente de migração de dados, fora do escopo
      desta atualização estrutural.
    - EMISSAO -> `emissao`: DATE -> DateTime, data de lançamento do crédito —
      mesmo tratamento dado a toda data pura do GENUS já reconhecida neste
      ERP (ex.: `Movto.emissao`, `ContaPagar.emissao`).
    - VALOR -> `valor`: NUMERIC monetário -> Float, mesmo tratamento dado a
      todo campo monetário já reconhecido neste ERP (`ContaPagar.valor`,
      `Movto.credito` etc.) — valor do saldo credor disponível para o
      cliente neste registro.
    - OBS -> `obs`: texto -> Text, mesmo tratamento de
      `Produto.observacao`/`Movto.obs`/`FaturaPagar.obs`, texto livre sem
      limite de tamanho definido.
    - CODALTERACAO / HORAALTERACAO / DATAALTERACAO -> `cod_alteracao` /
      `hora_alteracao_genus` / `data_alteracao_genus`: trio padrão de
      auditoria de origem já usado em todas as demais tabelas GENUS
      reconhecidas neste ERP (INTEGER / CHAR(8) / DATE -> Integer /
      String(8) / DateTime).
    - CODCONTA -> `cod_conta`: FK, no GENUS, para PLANOCONTA (já reconhecida
      neste ERP como `PlanoConta`) — mesmo critério e mesmo nome de campo já
      usado em `ContaPagar.cod_conta`/`FaturaPagar.cod_conta`/
      `FaturaNotaPagar.cod_conta` (GENUS: CODCONTA, singular, sem "S"). Não
      confundir com CODCONTAS (plural, FK para GENUS.CONTAS/`ContaGenus`) —
      distinção já documentada na docstring do model `ContaGenus`. Mantido
      como código bruto, sem FK própria.
    - CODHISTORICO -> `cod_historico`: VARCHAR(12) -> String(12), FK, no
      GENUS, para HISTORICO (já reconhecida neste ERP como `Historico`, via
      `Historico.codigo`) — mesmo critério já usado em
      `ContaPagar.cod_historico`/`ContaReceber.cod_historico`/
      `LancamentoContabil.cod_historico`. Mantido como código bruto, sem FK
      própria.
    - CODSAIDA -> `cod_saida`: FK, no GENUS, para SAIDA (já reconhecida
      neste ERP como `Saida`) — mesmo critério já usado em
      `Movto.cod_saida`/`ItemOrcamentoGenus.cod_saida`/
      `PedidoNota.cod_saida`. Sugere que este crédito pode ter se originado
      de uma saída/nota (ex.: crédito gerado por devolução de mercadoria),
      embora essa relação não seja confirmável sem a metadata Firebird ao
      vivo. Mantido como código bruto, sem FK própria.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "creditos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CREDITO ──────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)                    # GENUS: CODIGO (PK original no GENUS, provavelmente composta com CODEMPRESA)
    cod_empresa = Column(Integer, nullable=True, index=True)               # GENUS: CODEMPRESA (FK -> EMPRESA, ver Empresa; mirror bruto sem FK própria)
    cod_cliente = Column(Integer, nullable=True, index=True)               # GENUS: CODCLIENTE (FK -> CADASTRO/CLIENTE; mirror bruto sem FK própria)
    emissao = Column(DateTime, nullable=True, index=True)                  # GENUS: EMISSAO
    valor = Column(Float, nullable=True)                                   # GENUS: VALOR
    obs = Column(Text, nullable=True)                                      # GENUS: OBS
    cod_alteracao = Column(Integer, nullable=True)                         # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)                # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)                 # GENUS: DATAALTERACAO
    cod_conta = Column(Integer, nullable=True, index=True)                 # GENUS: CODCONTA (FK -> PLANOCONTA, ver PlanoConta; mirror bruto sem FK própria)
    cod_historico = Column(String(12), nullable=True)                     # GENUS: CODHISTORICO (FK -> HISTORICO.CODIGO, ver Historico; mirror bruto sem FK própria)
    cod_saida = Column(Integer, nullable=True, index=True)                 # GENUS: CODSAIDA (FK -> SAIDA, ver Saida; mirror bruto sem FK própria)


class Carteira(Base):
    """Carteira de cobrança bancária (GENUS.CARTEIRA) — tabela mestre do
    módulo Financeiro (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela CARTEIRA do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), seguindo o mesmo precedente estabelecido para
    `ContaGenus`/GENUS.CONTAS, `Movto`/GENUS.MOVTO, `BcoSicred`/
    GENUS.BCOSICRED e `Credito`/GENUS.CREDITO. Diferente dessas 4, os tipos
    abaixo **foram confirmados ao vivo** contra a metadata Firebird
    (RDB$RELATION_FIELDS / RDB$FIELDS / RDB$RELATION_CONSTRAINTS) da tabela
    CARTEIRA em GENUS_ZANGUETTIN.FDB, via `isql` (Firebird 2.5, apenas
    consulta de metadata do sistema — nenhuma linha de dado de negócio foi
    lida):
    - CODIGO: RDB$FIELD_TYPE 8 (INTEGER/LONG), sub_type 0, scale 0 ->
      Integer. Confirmado `NOT NULL` na origem e confirmado, via
      RDB$RELATION_CONSTRAINTS, como a **chave primária real do GENUS**
      (`PRIMARY KEY` sobre CODIGO isoladamente). Isso distingue CARTEIRA das
      demais tabelas GENUS "mestre" já reconhecidas neste ERP
      (`ContaGenus`, `Movto`, `BcoSicred`, `Credito`), cuja PK provável é
      composta com CODEMPRESA — CARTEIRA **não tem** coluna CODEMPRESA, ou
      seja, não é uma tabela particionada por empresa: é uma tabela de
      domínio único (lista fixa de carteiras de cobrança), compartilhada
      por todas as empresas, mais parecida em formato com `Historico`/
      GENUS.HISTORICO ou `TipoVenda`/GENUS.TIPOVENDA do que com `Credito`/
      `Movto`. Ainda assim, por instrução explícita desta tarefa, este
      model segue o padrão de janela dedicada (model + schema + controller
      + migração aditiva própria + `CarteiraWindow`/`NovoCarteiraWindow`)
      já usado para `Credito`/`BcoSicred`/`Movto`/`ContaGenus`, em vez do
      padrão „tabela auxiliar solta dentro de `TabelasAuxiliaresWindow`"
      usado por `Historico`/`Tamanho`/`Marca`/`TipoVenda`/`Regra`.
    - DESCRI: RDB$FIELD_TYPE 37 (VARCHAR), tamanho 40 -> String(40). Nome/
      descrição da carteira de cobrança (ex.: "COBRANÇA SIMPLES",
      "CARTEIRA 17 ITAÚ").
    - DESCONTADA: RDB$FIELD_TYPE 14 (CHAR), tamanho 1 -> String(1).
      Confirmado `NOT NULL` na origem. Flag de 1 caractere (ex.: 'S'/'N')
      indicando se títulos lançados nesta carteira são, por padrão,
      descontados (antecipação/desconto de duplicata junto ao banco).
    - FLOATPAGTO: RDB$FIELD_TYPE 8 (INTEGER/LONG), sub_type 0, scale 0 ->
      Integer — confirmado que **não** é um NUMERIC com escala (que exigiria
      Float, mesmo critério de conferência já usado para campos de
      peso/dimensão de `Produto`, ver `migrate_add_produto_fields.py`): é um
      INTEGER puro. Número de dias de "floating" (carência) somados ao
      pagamento — dias adicionais até o valor pago nesta carteira
      efetivamente ficar disponível/ser considerado liquidado.

    Apesar do nome curto e de só 4 colunas, CARTEIRA é referenciada como
    `CODCARTEIRA` (código bruto, sem FK própria) por diversas outras tabelas
    GENUS já reconhecidas neste ERP — confirmado por grep direto no
    código-fonte deste model: `ContaPagar.cod_carteira`,
    `ContaReceber.cod_carteira`, `ContaReceberExcluida.cod_carteira`,
    `FixoPagar.cod_carteira`, `FaturaNotaPagar.cod_carteira`,
    `Fatura.cod_carteira`, `FaturaPagar.cod_carteira`,
    `ClienteCompleto.cod_carteira`, `PedidoVenda.cod_carteira`,
    `Saida.cod_carteira`, `SaidaExcluida.cod_carteira` e
    `BcoSicred.cod_carteira` (esta última também tem `carteira`/
    `carteira_banco`, representações textuais/numéricas de carteira
    específicas do layout de arquivo do Sicred — distintas deste
    `Carteira.codigo`, ver docstring de `BcoSicred`). Nenhum desses campos
    ganha FK própria nesta atualização — permanecem como códigos brutos
    (mirror), já que essa era a convenção adotada quando cada um desses
    models foi criado; resolvê-los contra `Carteira.codigo` é tarefa do
    agente de migração de dados, fora do escopo desta atualização estrutural
    (que toca apenas o model `Carteira`, sem modificar nenhum dos models
    acima). Relação intencionalmente não deixada "muda": esta docstring é o
    registro de onde CODCARTEIRA aparece hoje no código, para o agente de
    migração de dados não precisar redescobrir isso do zero.

    Nenhuma linha é importada por este model — apenas a estrutura (nenhuma
    linha de dado de negócio de CARTEIRA, nem de nenhuma outra tabela GENUS,
    foi lida para esta atualização — apenas metadata via
    RDB$RELATION_FIELDS/RDB$FIELDS/RDB$RELATION_CONSTRAINTS).
    """
    __tablename__ = "carteiras"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CARTEIRA ─────────────────────────────────
    codigo = Column(Integer, nullable=True, index=True)    # GENUS: CODIGO (PK real e isolada do GENUS — ver docstring; NOT NULL na origem, mantido nullable aqui: nenhuma linha importada ainda)
    descricao = Column(String(40), nullable=True)          # GENUS: DESCRI
    descontada = Column(String(1), nullable=True)           # GENUS: DESCONTADA (NOT NULL na origem, mantido nullable aqui)
    float_pagto = Column(Integer, nullable=True)             # GENUS: FLOATPAGTO


class Entrada(Base):
    """Cabeçalho de entrada (nota fiscal de entrada/compra) — módulo Compras
    (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela ENTRADA do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB) — o cabeçalho de nota fiscal de entrada/compra que
    `ItemEntrada`/GENUS.ENTLAN (já reconhecida neste ERP) já citava em sua
    própria docstring como "ainda sem model dedicado". Os 101 campos
    originais foram conferidos diretamente contra o cache de metadados do
    schema Firebird do GENUS (RDB$RELATION_FIELDS via isql), sem ler nenhuma
    linha de dado de negócio: a lista, a ordem e os tipos batem exatamente
    com os já usados como sugestão — majoritariamente NUMERIC armazenado
    como INTEGER/BIGINT com escala negativa -> Float (ex.: ICMS_BASE,
    ICMS_VALOR, VAL_PRO, FRETE, TOTAL_NF e todos os campos REFORMA_V*/
    REFORMA_P*), um subconjunto de colunas CHAR/VARCHAR -> String (ex.:
    TIPODOC, SERIE, CODCFOP, CST) e colunas INTEGER puras -> Integer
    (CODEMPRESA, DOC, CODFORNECEDOR etc.).

    No GENUS, ENTRADA é a tabela "mãe" de ENTLAN: é a emissão física de um
    documento fiscal de compra (uma linha por nota fiscal de entrada
    recebida de um fornecedor) — análoga, no lado de compras, a `Saida`/
    GENUS.SAIDA (cabeçalho de nota fiscal de saída/venda, módulo Vendas/
    Faturamento). Assim como SAIDA tem muitas linhas em SAILAN, uma mesma
    ENTRADA tem muitas linhas em ENTLAN (uma por produto recebido/comprado
    naquele documento).

    ENTRADA não tem uma coluna única "CODIGO"/"CODENTRADA": exatamente como
    já documentado em `ItemEntrada`, o documento de entrada é identificado
    pela combinação de campos CODEMPRESA + TIPODOC + DOC + SERIE +
    CODFORNECEDOR — essa é a chave natural desta tabela (`cod_empresa`,
    `tipo_doc`, `doc`, `serie`, `cod_fornecedor` abaixo), o mesmo conjunto de
    campos que `ItemEntrada` já preserva como códigos brutos. Seguindo o
    critério já usado nas demais tabelas do GENUS reconhecidas neste ERP
    (nenhuma linha foi importada ainda), essa chave composta não é
    reaproveitada como PK deste ERP — o `id` serial é a única chave própria
    deste model.

    Por essa mesma razão, `ItemEntrada.entrada_id` (FK própria para esta
    tabela) é criada agora, seguindo exatamente o mesmo precedente
    retroativo já estabelecido em `FaturaNota.saida_id`/`FaturaNota.fatura_id`
    e em `FaturaNotaPagar.conta_pagar_id`/`FaturaNotaPagar.fatura_pagar_id`
    (uma FK própria só passa a existir quando a tabela referenciada ganha
    model dedicado neste ERP). Essa FK só pode ser resolvida de fato
    relacionando (GENUS.ENTLAN.CODEMPRESA, .TIPODOC, .DOC, .SERIE,
    .CODFORNECEDOR) com (`Entrada.cod_empresa`, `Entrada.tipo_doc`,
    `Entrada.doc`, `Entrada.serie`, `Entrada.cod_fornecedor`) — tarefa do
    agente de migração de dados, não deste agente de estrutura. Por isso
    `entrada_id` é opcional (nullable) e os cinco códigos brutos originais em
    `ItemEntrada` continuam preservados à parte, para não perder informação
    até que essa resolução aconteça.

    CODFORNECEDOR, apesar do nome, também NÃO referencia a PK serial deste
    ERP (`fornecedores.id`): mesmo precedente já confirmado em
    `ItemEntrada.cod_fornecedor` — o FORNECEDOR do GENUS não tem identidade
    própria (é uma extensão 1:1 de CADASTRO, o mestre de pessoas/empresas do
    sistema legado), ou seja, CODFORNECEDOR aqui equivale a um CODCADASTRO.
    Por isso não criamos FK própria para `fornecedores.id` — a entidade
    real, quando migrada de fato, vai exigir resolver esse código bruto
    (`cod_fornecedor`) contra CADASTRO/`Fornecedor.cod_cadastro`.

    CODEMPRESA2/TIPODOC2/DOC2/SERIE2/CODFORNECEDOR2 formam um segundo
    conjunto de chave bruta de documento (mesmo padrão de campos de
    CODEMPRESA/TIPODOC/DOC/SERIE/CODFORNECEDOR) — provavelmente uma nota
    fiscal complementar ou vinculada a esta entrada. Mantidos como códigos
    brutos (`cod_empresa2`, `tipo_doc2`, `doc2`, `serie2`,
    `cod_fornecedor2`), sem FK própria: resolver o significado exato e ligar
    contra `Entrada` (auto-relacionamento) é tarefa fora do escopo desta
    atualização estrutural.

    CODSAIDAVINCULADA/CODEMPRESASAIDAVINCULADA/DOCSAIDAVINCULADA repetem,
    aqui no cabeçalho, os mesmos três campos brutos já presentes em
    `ItemEntrada` (uma saída vinculada a esta entrada, ex.: devolução de
    mercadoria vendida antes) — mantidos como códigos brutos
    (`cod_saida_vinculada`, `cod_empresa_saida_vinculada`,
    `doc_saida_vinculada`), sem FK própria para `Saida` (a chave usada aqui,
    DOC, não corresponde à chave natural `Saida.cod_empresa`/`Saida.codigo`;
    resolução é tarefa do agente de migração de dados).

    Os demais códigos de referência ainda sem model dedicado neste ERP
    (CODCOMPRA -> COMPRA/pedido de compra, CODCONDPAGTO -> CONDPAGTO,
    CODFUNCIONARIO -> FUNCIONARIO, CODHISTORICO -> HISTORICO,
    CODEMPRESANAOFISCAL -> empresa não fiscal, CODEMPRESAPRODUCAO/
    CODIGOPRODUCAO/LOTEPRODUCAO/CODEMPRESASAIDAPROD/CODIGOSAIDAPROD/
    DOCSAIDAPROD -> produção) também são mantidos como códigos brutos
    (`cod_*`/`codigo_*`/`lote_*`/`doc_*`), sem FK própria, pelo mesmo motivo
    já documentado em `Saida` e em `ItemEntrada`: apenas para não perder
    informação, até que a entidade real seja migrada de fato.

    O campo ENTRADA (data de entrada física da mercadoria, distinta de
    EMISSAO) é reconhecido aqui como `dt_entrada` — renomeado com o prefixo
    `dt_` (mesmo padrão de `Saida.dt_saida`/`Saida.dt_liberado`) para evitar
    colisão de nome com a própria classe/tabela `Entrada`, já que no GENUS a
    coluna se chama literalmente ENTRADA, igual à tabela que a contém.

    Os campos QUANTIDADE/ESPECIE/BRUTO/LIQUIDO (seção "Dados dos Volumes
    Transportados" de uma NF-e) e PLACA1/PLACA2/PLACA3/UFPLACA1/UFPLACA2/
    UFPLACA3/MODFRETE/MODTRANSPORTE/INDICADORNATFRETE (transporte) seguem o
    mesmo tratamento e nomenclatura (`_volumes` / `placaN` / `uf_placaN`) já
    usados em `Saida`.

    Os campos com prefixo REFORMA_ correspondem à Reforma Tributária
    brasileira (IBS/CBS), já presentes na estrutura ENTRADA do GENUS para
    preparar a emissão fiscal do novo modelo — reconhecidos com o mesmo
    prefixo em snake_case (`reforma_*`), sem reinterpretação de significado,
    agrupados pelas mesmas seções já usadas em `Saida` (gerais/governo,
    IBS-UF/IBS-Município/IBS geral, CBS). Diferente de `Saida`, ENTRADA só
    tem os totais agregados por documento (sem os campos de exceção
    REFORMA_EXCECAO* nem REFORMA_TPNFDEBITO/REFORMA_TPNFCREDITO/
    REFORMA_REFNFEANT/REFORMA_CODSAIDAANT/REFORMA_CODEMPRESAANT) —
    confirmado por conferência direta da lista de colunas via metadados.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela ENTRADA foi lido no GENUS por este agente.
    """
    __tablename__ = "entradas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave natural do documento de entrada ─────────────
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA (parte da chave natural — ver docstring)
    tipo_doc = Column(String(1), nullable=True, index=True)               # GENUS: TIPODOC (parte da chave natural)
    doc = Column(Integer, nullable=True, index=True)                      # GENUS: DOC (parte da chave natural)
    serie = Column(String(4), nullable=True, index=True)                  # GENUS: SERIE (parte da chave natural)
    cod_fornecedor = Column(Integer, nullable=True, index=True)           # GENUS: CODFORNECEDOR (parte da chave natural; na verdade um CODCADASTRO — ver docstring)
    emissao = Column(DateTime, nullable=True)                             # GENUS: EMISSAO
    dt_entrada = Column(DateTime, nullable=True)                          # GENUS: ENTRADA (data de entrada física da mercadoria — ver docstring sobre o prefixo dt_)
    modelo = Column(String(2), nullable=True)                             # GENUS: MODELO
    subserie = Column(String(4), nullable=True)                           # GENUS: SUBSERIE
    cod_funcionario = Column(Integer, nullable=True)                      # GENUS: CODFUNCIONARIO

    # ── Compra / condição de pagamento ─────────────────────────────────────
    cod_compra = Column(Integer, nullable=True, index=True)               # GENUS: CODCOMPRA
    cod_cond_pagto = Column(String(5), nullable=True)                     # GENUS: CODCONDPAGTO
    cod_tipo_compra = Column(Integer, nullable=True)                      # GENUS: CODTIPOCOMPRA

    # ── Documento vinculado / complementar (2ª nota) ───────────────────────
    cod_empresa2 = Column(Integer, nullable=True)                         # GENUS: CODEMPRESA2
    tipo_doc2 = Column(String(1), nullable=True)                          # GENUS: TIPODOC2
    doc2 = Column(Integer, nullable=True)                                 # GENUS: DOC2
    serie2 = Column(String(4), nullable=True)                             # GENUS: SERIE2
    cod_fornecedor2 = Column(Integer, nullable=True)                      # GENUS: CODFORNECEDOR2
    transfere = Column(String(1), nullable=True)                         # GENUS: TRANSFERE

    # ── NF-e / chave de acesso ──────────────────────────────────────────────
    chave_nfe = Column(String(70), nullable=True, index=True)             # GENUS: CHAVENFE
    msg_chave = Column(String(25), nullable=True)                        # GENUS: MSGCHAVE
    arq_xml = Column(Text, nullable=True)                                 # GENUS: ARQXML

    # ── Fiscal: ICMS / ICMS-ST / IPI / PIS / COFINS ────────────────────────
    cod_cfop = Column(String(5), nullable=True)                          # GENUS: CODCFOP
    icms_base = Column(Float, nullable=True)                             # GENUS: ICMS_BASE
    icms_valor = Column(Float, nullable=True)                            # GENUS: ICMS_VALOR
    icms_base_subst = Column(Float, nullable=True)                       # GENUS: ICMS_BASE_SUBST
    icms_valor_subst = Column(Float, nullable=True)                      # GENUS: ICMS_VALOR_SUBST
    icms_reducao = Column(Float, nullable=True)                          # GENUS: ICMSREDUCAO
    aliquota = Column(String(5), nullable=True)                          # GENUS: ALIQUOTA
    aliquota_subs = Column(String(5), nullable=True)                     # GENUS: ALIQUOTA_SUBS
    cst = Column(String(3), nullable=True)                               # GENUS: CST
    ipi_valor = Column(Float, nullable=True)                             # GENUS: IPI_VALOR
    pis_cst = Column(String(3), nullable=True)                           # GENUS: PISCST
    pis_valor = Column(Float, nullable=True)                             # GENUS: PISVALOR
    pis_base = Column(Float, nullable=True)                              # GENUS: PISBASE
    pis_aliquota = Column(Float, nullable=True)                          # GENUS: PISALIQUOTA
    cofins_cst = Column(String(3), nullable=True)                        # GENUS: COFINSCST
    cofins_valor = Column(Float, nullable=True)                          # GENUS: COFINSVALOR
    cofins_base = Column(Float, nullable=True)                           # GENUS: COFINSBASE
    cofins_aliquota = Column(Float, nullable=True)                       # GENUS: COFINSALIQUOTA
    simples = Column(String(1), nullable=True)                          # GENUS: SIMPLES
    reter_imposto = Column(String(1), nullable=True)                    # GENUS: RETERIMPOSTO

    # ── Valores comerciais / totais ─────────────────────────────────────────
    valor_produtos = Column(Float, nullable=True)                       # GENUS: VAL_PRO
    frete = Column(Float, nullable=True)                                # GENUS: FRETE
    seguro = Column(Float, nullable=True)                               # GENUS: SEGURO
    outras = Column(Float, nullable=True)                               # GENUS: OUTRAS
    total_nf = Column(Float, nullable=True)                             # GENUS: TOTAL_NF
    desc_acres = Column(Float, nullable=True)                           # GENUS: DESC_ACRES
    outros_custo = Column(Float, nullable=True)                         # GENUS: OUTROSCUSTO
    valor_credito_fornecedor = Column(Float, nullable=True)             # GENUS: VALORCREDITOFORNECEDOR

    # ── Observações ──────────────────────────────────────────────────────────
    observacao = Column(Text, nullable=True)                            # GENUS: OBS
    obs_fisco = Column(Text, nullable=True)                             # GENUS: OBSFISCO

    # ── Dados dos volumes transportados (seção NF-e) ────────────────────────
    quantidade_volumes = Column(String(10), nullable=True)              # GENUS: QUANTIDADE
    especie_volumes = Column(String(15), nullable=True)                 # GENUS: ESPECIE
    peso_bruto_volumes = Column(String(15), nullable=True)              # GENUS: BRUTO
    peso_liquido_volumes = Column(String(15), nullable=True)            # GENUS: LIQUIDO

    # ── Transporte ────────────────────────────────────────────────────────────
    mod_frete = Column(String(3), nullable=True)                        # GENUS: MODFRETE
    mod_transporte = Column(String(20), nullable=True)                  # GENUS: MODTRANSPORTE
    indicador_nat_frete = Column(String(1), nullable=True)              # GENUS: INDICADORNATFRETE
    placa1 = Column(String(8), nullable=True)                           # GENUS: PLACA1
    placa2 = Column(String(8), nullable=True)                           # GENUS: PLACA2
    placa3 = Column(String(8), nullable=True)                           # GENUS: PLACA3
    uf_placa1 = Column(String(2), nullable=True)                        # GENUS: UFPLACA1
    uf_placa2 = Column(String(2), nullable=True)                        # GENUS: UFPLACA2
    uf_placa3 = Column(String(2), nullable=True)                        # GENUS: UFPLACA3

    # ── Auditoria de origem (GENUS) ─────────────────────────────────────────
    cod_alteracao = Column(Integer, nullable=True)                      # GENUS: CODALTERACAO
    hora_alteracao_genus = Column(String(8), nullable=True)             # GENUS: HORAALTERACAO
    data_alteracao_genus = Column(DateTime, nullable=True)              # GENUS: DATAALTERACAO

    # ── Histórico / controle ─────────────────────────────────────────────────
    cod_historico = Column(String(12), nullable=True)                   # GENUS: CODHISTORICO
    cod_controle = Column(Integer, nullable=True)                       # GENUS: CODCONTROLE
    cod_controle_empresa = Column(Integer, nullable=True)               # GENUS: CODCONTROLEEMPRESA
    cod_controle_tipo = Column(String(1), nullable=True)                # GENUS: CODCONTROLETIPO
    cod_empresa_nao_fiscal = Column(Integer, nullable=True)             # GENUS: CODEMPRESANAOFISCAL

    # ── Saída vinculada (devolução) ─────────────────────────────────────────
    cod_saida_vinculada = Column(Integer, nullable=True, index=True)    # GENUS: CODSAIDAVINCULADA
    cod_empresa_saida_vinculada = Column(Integer, nullable=True)        # GENUS: CODEMPRESASAIDAVINCULADA
    doc_saida_vinculada = Column(Integer, nullable=True)                # GENUS: DOCSAIDAVINCULADA

    # ── Produção ───────────────────────────────────────────────────────────────
    cod_empresa_producao = Column(Integer, nullable=True)               # GENUS: CODEMPRESAPRODUCAO
    codigo_producao = Column(Integer, nullable=True)                    # GENUS: CODIGOPRODUCAO
    lote_producao = Column(String(10), nullable=True)                   # GENUS: LOTEPRODUCAO
    cod_empresa_saida_prod = Column(Integer, nullable=True)             # GENUS: CODEMPRESASAIDAPROD
    codigo_saida_prod = Column(Integer, nullable=True)                  # GENUS: CODIGOSAIDAPROD
    doc_saida_prod = Column(String(20), nullable=True)                  # GENUS: DOCSAIDAPROD

    # ── Reforma Tributária: gerais / governo ────────────────────────────────
    reforma_totvbcibscbs = Column(Float, nullable=True)                 # GENUS: REFORMA_TOTVBCIBSCBS
    reforma_vnftot = Column(Float, nullable=True)                       # GENUS: REFORMA_VNFTOT
    reforma_tpentegov = Column(String(1), nullable=True)                # GENUS: REFORMA_TPENTEGOV
    reforma_tpopergov = Column(String(1), nullable=True)                # GENUS: REFORMA_TPOPERGOV
    reforma_predutorgov = Column(Float, nullable=True)                  # GENUS: REFORMA_PREDUTORGOV

    # ── Reforma Tributária: totais IBS-UF / IBS-Município / IBS geral ──────
    reforma_totvibsuf_ibsuf = Column(Float, nullable=True)              # GENUS: REFORMA_TOTVIBSUF_IBSUF
    reforma_totvdif_ibsuf = Column(Float, nullable=True)                # GENUS: REFORMA_TOTVDIF_IBSUF
    reforma_totvdevtrib_ibsuf = Column(Float, nullable=True)            # GENUS: REFORMA_TOTVDEVTRIB_IBSUF
    reforma_totvibsmun_ibsmun = Column(Float, nullable=True)            # GENUS: REFORMA_TOTVIBSMUN_IBSMUN
    reforma_totvdif_ibsmun = Column(Float, nullable=True)               # GENUS: REFORMA_TOTVDIF_IBSMUN
    reforma_totvdevtrib_ibsmun = Column(Float, nullable=True)           # GENUS: REFORMA_TOTVDEVTRIB_IBSMUN
    reforma_totvibs_ibs = Column(Float, nullable=True)                  # GENUS: REFORMA_TOTVIBS_IBS
    reforma_totvcredpres_ibs = Column(Float, nullable=True)             # GENUS: REFORMA_TOTVCREDPRES_IBS
    reforma_totvcredprescondsus_ibs = Column(Float, nullable=True)      # GENUS: REFORMA_TOTVCREDPRESCONDSUS_IBS

    # ── Reforma Tributária: totais CBS ──────────────────────────────────────
    reforma_totvcbs_cbs = Column(Float, nullable=True)                  # GENUS: REFORMA_TOTVCBS_CBS
    reforma_totvdevtrib_cbs = Column(Float, nullable=True)              # GENUS: REFORMA_TOTVDEVTRIB_CBS
    reforma_totvdif_cbs = Column(Float, nullable=True)                  # GENUS: REFORMA_TOTVDIF_CBS
    reforma_totvcredpres_cbs = Column(Float, nullable=True)             # GENUS: REFORMA_TOTVCREDPRES_CBS
    reforma_totvcredprescondsus_cbs = Column(Float, nullable=True)      # GENUS: REFORMA_TOTVCREDPRESCONDSUS_CBS

    itens_entrada = relationship("ItemEntrada", back_populates="entrada", cascade="all, delete-orphan")
    fretes = relationship("EntradaFrete", foreign_keys="[EntradaFrete.entrada_id]", back_populates="entrada", cascade="all, delete-orphan")
    compras_vinculadas = relationship("CompraEntrada", foreign_keys="[CompraEntrada.entrada_id]", back_populates="entrada", cascade="all, delete-orphan")
    notas_xml_entrada = relationship("NotaXmlEntrada", foreign_keys="[NotaXmlEntrada.entrada_id]", back_populates="entrada", cascade="all, delete-orphan")
    notas_destinadas_vinculadas = relationship("NotaDestinada", foreign_keys="[NotaDestinada.entrada_id]", back_populates="entrada")


class ItemEntrada(Base):
    """Item de entrada (compra/nota fiscal de entrada) — linha de nota fiscal de entrada.

    Reconhece a estrutura completa da tabela ENTLAN do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB) — primeiro model do módulo Compras (Tier 2) deste
    ERP, análogo a `ItemSaida`/GENUS.SAILAN (módulo Vendas/Faturamento), mas
    para o lado de entrada/compra da mercadoria. Tipos foram conferidos
    diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS), sem ler nenhuma linha de dado de negócio: os 109
    campos originais de ENTLAN são majoritariamente NUMERIC armazenado como
    INTEGER/BIGINT com escala negativa (RDB$FIELD_TYPE 8/16, sub_type 1) ->
    Float, exatamente como já ocorre em `ItemSaida` (ex.: ICMS, IPI,
    UNITARIO, TOTAL, QTDE e todos os campos REFORMA_V*/REFORMA_P*), com um
    subconjunto menor de colunas CHAR/VARCHAR -> String (ex.: TIPODOC, CF,
    FISCAL, CODCFOP, CST/CSOSN de cada tributo) e de colunas INTEGER puras
    -> Integer (CODEMPRESA, DOC, CODFORNECEDOR, CODPRODUTO só que este é
    VARCHAR, os *VINCULADA e NITEMFORNEC).

    No GENUS, ENTLAN é a tabela "filha" de uma tabela de cabeçalho de nota
    fiscal de entrada (que ainda não tem model dedicado neste ERP — não
    confundir com `Saida`/GENUS.SAIDA, que é o cabeçalho de saída/venda):
    ENTLAN guarda, para cada linha de entrada (produto recebido dentro de um
    documento fiscal de um fornecedor), quantidade, valores unitário/total,
    tributação (ICMS/ICMS-ST/IPI/PIS/COFINS) e, mais recentemente, os campos
    da reforma tributária (IBS/CBS, prefixo REFORMA_*) — ou seja, uma mesma
    entrada (nota fiscal de compra) tem muitas linhas em ENTLAN (uma por
    produto recebido/comprado).

    Diferente de `ItemPedidoCompra`/GENUS (item do *pedido* de compra, antes
    de a mercadoria chegar), `ItemEntrada`/GENUS.ENTLAN representa o item já
    efetivamente recebido/entrado fiscalmente (a entrada fiscal de
    mercadoria) — por isso não reaproveita `ItemPedidoCompra`, mesmo com
    campos conceitualmente parecidos (quantidade, valor unitário): são
    estágios diferentes do fluxo de compras, com granularidade fiscal
    própria (ENTLAN tem dezenas de campos tributários que ItemPedidoCompra
    não tem) — o mesmo raciocínio já usado para justificar por que
    `ItemSaida`/SAILAN não reaproveita `ItemPedidoVenda`/PEDIDOITEM.

    Este model é ligado ao cadastro de produto já migrado (`Produto`, 5.629
    produtos reais) através da FK `produto_id`. Essa FK só pode ser
    resolvida de fato relacionando GENUS.ENTLAN.CODPRODUTO com
    GENUS.PRODUTO.CODIGO (= `Produto.codigo` neste ERP) — tarefa do agente
    de migração de dados, não deste agente de estrutura. Por isso
    `produto_id` é opcional (nullable) e o código bruto original
    (`cod_produto`) é preservado à parte, para não perder informação até que
    essa resolução aconteça.

    ENTLAN não tem uma coluna única "CODENTRADA": o documento de entrada
    (nota fiscal de compra) é identificado, dentro de ENTLAN, pela
    combinação de campos CODEMPRESA + TIPODOC + DOC + SERIE + CODFORNECEDOR
    — exatamente o mesmo conjunto de campos que já aparece, com o prefixo
    ENTRADA*, em `Saida.entrada_tipo_doc` / `Saida.entrada_doc` /
    `Saida.entrada_serie` / `Saida.entrada_cod_fornecedor` (a devolução de
    uma saída referenciando o documento de entrada original que a gerou) e
    em `SaidaDevolucao.entrada_tipo_doc` / `entrada_doc` / `entrada_serie` /
    `entrada_cod_fornecedor`.

    Essa combinação de campos agora tem contraparte estrutural em
    `Entrada`/GENUS.ENTRADA (cabeçalho da nota fiscal de entrada/compra, ver
    classe acima, criada junto com esta atualização) — por isso `entrada_id`
    (FK própria para `Entrada`) é criado aqui, seguindo exatamente o mesmo
    precedente retroativo já usado em `FaturaNota.saida_id`/
    `FaturaNota.fatura_id` (uma FK própria passa a existir quando a tabela
    referenciada ganha model dedicado neste ERP). Essa FK só pode ser
    resolvida de fato relacionando (GENUS.ENTLAN.CODEMPRESA, .TIPODOC, .DOC,
    .SERIE, .CODFORNECEDOR) com (`Entrada.cod_empresa`, `Entrada.tipo_doc`,
    `Entrada.doc`, `Entrada.serie`, `Entrada.cod_fornecedor`) — tarefa do
    agente de migração de dados, não deste agente de estrutura. Por isso
    `entrada_id` é opcional (nullable) e os cinco campos originais
    continuam preservados à parte como códigos brutos (`cod_empresa`,
    `tipo_doc`, `doc`, `serie`, `cod_fornecedor`), para não perder
    informação até que essa resolução aconteça.

    CODFORNECEDOR, apesar do nome, também NÃO referencia a PK serial deste
    ERP (`fornecedores.id`): seguindo o mesmo precedente já confirmado para
    `ProdutoReferencia.cod_fornecedor` e
    `ProdutoConversaoFornecedor.cod_fornecedor`, o FORNECEDOR do GENUS não
    tem identidade própria (é uma extensão 1:1 de CADASTRO, o mestre de
    pessoas/empresas do sistema legado) — ou seja, CODFORNECEDOR aqui
    equivale a um CODCADASTRO. Por isso não criamos FK própria para
    `fornecedores.id`: a entidade real, quando migrada de fato, vai exigir
    resolver esse código bruto (`cod_fornecedor`) contra
    CADASTRO/`Fornecedor.cod_cadastro`.

    CODSAIDAVINCULADA / CODEMPRESASAIDAVINCULADA / DOCSAIDAVINCULADA
    guardam, de forma simétrica ao "ENTRADA vinculada" de `Saida`/
    `SaidaDevolucao`, uma referência bruta a uma saída vinculada a esta
    entrada (ex.: entrada de devolução de mercadoria que havia sido vendida
    antes, cuja saída original agora é referenciada aqui) — mantidos como
    códigos brutos (`cod_saida_vinculada`, `cod_empresa_saida_vinculada`,
    `doc_saida_vinculada`), sem FK própria para `itens_saida`/`Saida`
    (chaves compostas diferentes; resolução é tarefa do agente de
    migração de dados).

    Os campos com prefixo REFORMA_ correspondem à Reforma Tributária
    brasileira (IBS/CBS — Imposto sobre Bens e Serviços / Contribuição
    sobre Bens e Serviços), já presentes na estrutura ENTLAN do GENUS para
    preparar a emissão fiscal do novo modelo. Foram reconhecidos com o
    mesmo prefixo em snake_case (`reforma_*`), sem reinterpretação de
    significado — seguindo exatamente o mesmo agrupamento por seção já
    usado em `ItemSaida` (gerais do item / IBS-UF / IBS-Município / IBS
    total / CBS / registro especial / crédito presumido IBS/CBS).
    Diferente de `ItemSaida`/SAILAN, ENTLAN não tem os campos de Imposto
    Seletivo (REFORMA_*_IS) nem os campos de partilha interestadual/DIFAL
    (ALIQUFDEST etc.) — confirmado por conferência direta da lista de
    colunas via metadados: essas seções simplesmente não existem em ENTLAN.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela ENTLAN foi lido no GENUS por este agente.
    """
    __tablename__ = "itens_entrada"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Vínculo com o cabeçalho de entrada já migrado (ver model Entrada) ──
    entrada_id = Column(Integer, ForeignKey("entradas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, TIPODOC, DOC, SERIE, CODFORNECEDOR) -> (Entrada.cod_empresa, Entrada.tipo_doc, Entrada.doc, Entrada.serie, Entrada.cod_fornecedor)

    # ── Identificação / chave bruta do documento de entrada (mirror — ver entrada_id acima) ─
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA (parte da chave bruta do documento de entrada — ver docstring)
    tipo_doc = Column(String(1), nullable=True, index=True)              # GENUS: TIPODOC (parte da chave bruta do documento de entrada)
    doc = Column(Integer, nullable=True, index=True)                     # GENUS: DOC (parte da chave bruta do documento de entrada)
    serie = Column(String(4), nullable=True, index=True)                 # GENUS: SERIE (parte da chave bruta do documento de entrada)
    cod_fornecedor = Column(Integer, nullable=True, index=True)          # GENUS: CODFORNECEDOR (código bruto — na verdade um CODCADASTRO; requer resolução futura contra CADASTRO/Fornecedor.cod_cadastro; parte da chave bruta do documento de entrada)
    cod_produto = Column(String(15), nullable=True, index=True)          # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    lote_produto = Column(String(15), nullable=True, index=True)         # GENUS: LOTEPRODUTO
    nitem_fornec = Column(Integer, nullable=True)                        # GENUS: NITEMFORNEC (número do item dentro do documento do fornecedor)

    # ── Quantidades / valores comerciais ───────────────────────────────────
    unitario = Column(Float, nullable=True)                              # GENUS: UNITARIO
    total = Column(Float, nullable=True)                                 # GENUS: TOTAL
    qtde = Column(Float, nullable=True)                                  # GENUS: QTDE
    qtde_estq = Column(Float, nullable=True)                             # GENUS: QTDEESTQ
    frete = Column(Float, nullable=True)                                 # GENUS: FRETE
    retirar = Column(String(1), nullable=True)                           # GENUS: RETIRAR
    perc_a_prazo = Column(Float, nullable=True)                          # GENUS: PERCAPRAZO
    vl_venda = Column(Float, nullable=True)                              # GENUS: VLVENDA
    taxa_fornecedor = Column(Float, nullable=True)                       # GENUS: TAXAFORNECEDOR
    credito_fornecedor = Column(Float, nullable=True)                    # GENUS: CREDITOFORNECEDOR
    cpr = Column(Float, nullable=True)                                   # GENUS: CPR (abreviação não documentada na origem — mantida como está)

    # ── Custos ──────────────────────────────────────────────────────────────
    custo_item = Column(Float, nullable=True)                            # GENUS: CUSTOITEM
    custo_real = Column(Float, nullable=True)                            # GENUS: CUSTOREAL
    preco_custo = Column(Float, nullable=True)                           # GENUS: PRECOCUSTO
    outros_custo = Column(Float, nullable=True)                          # GENUS: OUTROSCUSTO
    icms_custo = Column(Float, nullable=True)                            # GENUS: ICMSCUSTO

    # ── Referências / vínculo com empresa não fiscal e saída vinculada (devolução) ─
    cod_empresa_nao_fiscal = Column(Integer, nullable=True)              # GENUS: CODEMPRESANAOFISCAL
    cod_saida_vinculada = Column(Integer, nullable=True, index=True)     # GENUS: CODSAIDAVINCULADA (FK bruta — ver docstring)
    cod_empresa_saida_vinculada = Column(Integer, nullable=True)         # GENUS: CODEMPRESASAIDAVINCULADA
    doc_saida_vinculada = Column(Integer, nullable=True)                 # GENUS: DOCSAIDAVINCULADA

    # ── Fiscal: ICMS / ICMS-ST ────────────────────────────────────────────
    cf = Column(String(3), nullable=True)                                # GENUS: CF
    fiscal = Column(String(12), nullable=True)                           # GENUS: FISCAL
    cod_cfop = Column(String(5), nullable=True)                          # GENUS: CODCFOP
    tipo_imposto = Column(String(1), nullable=True)                      # GENUS: TIPOIMPOSTO
    csosn = Column(String(4), nullable=True)                             # GENUS: CSOSN
    cenq = Column(String(3), nullable=True)                              # GENUS: CENQ
    icms = Column(Float, nullable=True)                                  # GENUS: ICMS
    iva = Column(Float, nullable=True)                                   # GENUS: IVA
    iva_reajusta = Column(String(1), nullable=True)                      # GENUS: IVAREAJUSTA
    icms_valor = Column(Float, nullable=True)                            # GENUS: ICMSVALOR
    icms_base_calculo = Column(Float, nullable=True)                     # GENUS: ICMSBASECALCULO
    icms_reducao = Column(Float, nullable=True)                          # GENUS: ICMSREDUCAO
    icms_isento = Column(Float, nullable=True)                           # GENUS: ICMSISENTO
    icms_outras = Column(Float, nullable=True)                           # GENUS: ICMSOUTRAS
    icms_percentual_st = Column(Float, nullable=True)                    # GENUS: ICMSPERCENTUALST
    icms_reducao_st = Column(Float, nullable=True)                       # GENUS: ICMSREDUCAOST
    icms_subst_tributaria = Column(Float, nullable=True)                 # GENUS: ICMSSUBSTTRIBUTARIA
    icms_base_subst_tributaria = Column(Float, nullable=True)            # GENUS: ICMSBASESUBSTTRIBUTARIA

    # ── Fiscal: IPI ──────────────────────────────────────────────────────
    ipi = Column(Float, nullable=True)                                   # GENUS: IPI
    ipi_cst = Column(String(3), nullable=True)                           # GENUS: IPICST
    ipi_valor = Column(Float, nullable=True)                             # GENUS: IPIVALOR
    ipi_base_calculo = Column(Float, nullable=True)                      # GENUS: IPIBASECALCULO

    # ── Fiscal: PIS / COFINS ─────────────────────────────────────────────
    pis_cst = Column(String(3), nullable=True)                           # GENUS: PISCST
    pis_valor = Column(Float, nullable=True)                             # GENUS: PISVALOR
    pis_base = Column(Float, nullable=True)                              # GENUS: PISBASE
    pis_aliquota = Column(Float, nullable=True)                          # GENUS: PISALIQUOTA
    quantidade_pis = Column(Float, nullable=True)                        # GENUS: QUANTIDADEPIS
    aliq_pis_reais = Column(Float, nullable=True)                        # GENUS: ALIQPISREAIS
    cofins_cst = Column(String(3), nullable=True)                        # GENUS: COFINSCST
    cofins_valor = Column(Float, nullable=True)                          # GENUS: COFINSVALOR
    cofins_base = Column(Float, nullable=True)                           # GENUS: COFINSBASE
    cofins_aliquota = Column(Float, nullable=True)                       # GENUS: COFINSALIQUOTA
    quantidade_cofins = Column(Float, nullable=True)                     # GENUS: QUANTIDADECOFINS
    aliq_cofins_reais = Column(Float, nullable=True)                     # GENUS: ALIQCOFINSREAIS

    # ── Reforma Tributária: IBS/CBS gerais do item ──────────────────────
    reforma_cst_ibscbs = Column(String(3), nullable=True)                # GENUS: REFORMA_CST_IBSCBS
    reforma_cclasstrib = Column(String(10), nullable=True)               # GENUS: REFORMA_CCLASSTRIB
    reforma_vbc_ibscbs = Column(Float, nullable=True)                    # GENUS: REFORMA_VBC_IBSCBS
    reforma_vitem = Column(Float, nullable=True)                         # GENUS: REFORMA_VITEM

    # ── Reforma Tributária: IBS-UF ───────────────────────────────────────
    reforma_pibsuf_ibsuf = Column(Float, nullable=True)                  # GENUS: REFORMA_PIBSUF_IBSUF
    reforma_pdif_ibsuf = Column(Float, nullable=True)                    # GENUS: REFORMA_PDIF_IBSUF
    reforma_vdif_ibsuf = Column(Float, nullable=True)                    # GENUS: REFORMA_VDIF_IBSUF
    reforma_vdevtrib_ibsuf = Column(Float, nullable=True)                # GENUS: REFORMA_VDEVTRIB_IBSUF
    reforma_predaliq_ibsuf = Column(Float, nullable=True)                # GENUS: REFORMA_PREDALIQ_IBSUF
    reforma_paliqefet_ibsuf = Column(Float, nullable=True)               # GENUS: REFORMA_PALIQEFET_IBSUF
    reforma_vibsuf_ibsuf = Column(Float, nullable=True)                  # GENUS: REFORMA_VIBSUF_IBSUF
    reforma_paliqefetregibsuf = Column(Float, nullable=True)             # GENUS: REFORMA_PALIQEFETREGIBSUF
    reforma_vtribregibsuf = Column(Float, nullable=True)                 # GENUS: REFORMA_VTRIBREGIBSUF
    reforma_vtribibsuf_gov = Column(Float, nullable=True)                # GENUS: REFORMA_VTRIBIBSUF_GOV
    reforma_vibs_transfcred = Column(Float, nullable=True)               # GENUS: REFORMA_VIBS_TRANSFCRED

    # ── Reforma Tributária: IBS-Município ────────────────────────────────
    reforma_pibsmun_ibsmun = Column(Float, nullable=True)                # GENUS: REFORMA_PIBSMUN_IBSMUN
    reforma_pdif_ibsmun = Column(Float, nullable=True)                   # GENUS: REFORMA_PDIF_IBSMUN
    reforma_vdif_ibsmun = Column(Float, nullable=True)                   # GENUS: REFORMA_VDIF_IBSMUN
    reforma_vdevtrib_ibsmun = Column(Float, nullable=True)               # GENUS: REFORMA_VDEVTRIB_IBSMUN
    reforma_predaliq_ibsmun = Column(Float, nullable=True)               # GENUS: REFORMA_PREDALIQ_IBSMUN
    reforma_paliqefet_ibsmun = Column(Float, nullable=True)              # GENUS: REFORMA_PALIQEFET_IBSMUN
    reforma_vibsmun_ibsmun = Column(Float, nullable=True)                # GENUS: REFORMA_VIBSMUN_IBSMUN
    reforma_paliqefetregibsmun = Column(Float, nullable=True)            # GENUS: REFORMA_PALIQEFETREGIBSMUN
    reforma_vtribregibsmun = Column(Float, nullable=True)                # GENUS: REFORMA_VTRIBREGIBSMUN
    reforma_vtribibsmun_gov = Column(Float, nullable=True)               # GENUS: REFORMA_VTRIBIBSMUN_GOV

    # ── Reforma Tributária: IBS total ────────────────────────────────────
    reforma_vibs = Column(Float, nullable=True)                          # GENUS: REFORMA_VIBS

    # ── Reforma Tributária: CBS ──────────────────────────────────────────
    reforma_pcbs_cbs = Column(Float, nullable=True)                      # GENUS: REFORMA_PCBS_CBS
    reforma_pdif_cbs = Column(Float, nullable=True)                      # GENUS: REFORMA_PDIF_CBS
    reforma_vdif_cbs = Column(Float, nullable=True)                      # GENUS: REFORMA_VDIF_CBS
    reforma_vdevtrib_cbs = Column(Float, nullable=True)                  # GENUS: REFORMA_VDEVTRIB_CBS
    reforma_predaliq_cbs = Column(Float, nullable=True)                  # GENUS: REFORMA_PREDALIQ_CBS
    reforma_paliqefet_cbs = Column(Float, nullable=True)                 # GENUS: REFORMA_PALIQEFET_CBS
    reforma_vcbs_cbs = Column(Float, nullable=True)                      # GENUS: REFORMA_VCBS_CBS
    reforma_paliqefetregcbs = Column(Float, nullable=True)               # GENUS: REFORMA_PALIQEFETREGCBS
    reforma_vtribregcbs = Column(Float, nullable=True)                   # GENUS: REFORMA_VTRIBREGCBS
    reforma_vtribcbs_gov = Column(Float, nullable=True)                  # GENUS: REFORMA_VTRIBCBS_GOV
    reforma_vcbs_transfcred = Column(Float, nullable=True)               # GENUS: REFORMA_VCBS_TRANSFCRED

    # ── Reforma Tributária: registro especial (regime regional) ────────
    reforma_cstreg = Column(String(3), nullable=True)                    # GENUS: REFORMA_CSTREG
    reforma_cclasstribreg = Column(String(10), nullable=True)            # GENUS: REFORMA_CCLASSTRIBREG

    # ── Reforma Tributária: crédito presumido IBS/CBS ───────────────────
    reforma_ccredpres_ibs = Column(String(2), nullable=True)             # GENUS: REFORMA_CCREDPRES_IBS
    reforma_pcredpres_ibs = Column(Float, nullable=True)                 # GENUS: REFORMA_PCREDPRES_IBS
    reforma_vcredpres_ibs = Column(Float, nullable=True)                 # GENUS: REFORMA_VCREDPRES_IBS
    reforma_vcredprescondsus_ibs = Column(Float, nullable=True)          # GENUS: REFORMA_VCREDPRESCONDSUS_IBS
    reforma_ccredpres_cbs = Column(String(2), nullable=True)             # GENUS: REFORMA_CCREDPRES_CBS
    reforma_pcredpres_cbs = Column(Float, nullable=True)                 # GENUS: REFORMA_PCREDPRES_CBS
    reforma_vcredpres_cbs = Column(Float, nullable=True)                 # GENUS: REFORMA_VCREDPRES_CBS
    reforma_vcredprescondsus_cbs = Column(Float, nullable=True)          # GENUS: REFORMA_VCREDPRESCONDSUS_CBS

    produto = relationship("Produto", back_populates="itens_entrada")
    entrada = relationship("Entrada", back_populates="itens_entrada")


class CompraGenus(Base):
    """Cabeçalho de solicitação/pedido de compra — GENUS.COMPRAS.

    Reconhece a estrutura completa da tabela COMPRAS do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB) — cabeçalho que `ItemCompra`/GENUS.COMPRASLAN (já
    reconhecida neste ERP) já citava em sua própria docstring como "ainda sem
    model dedicado". Os 30 campos originais (a tabela tem 32 posições de
    coluna, mas 2 — posições 11 e 29 — são colunas já removidas no GENUS,
    RDB$FIELD_POSITION descontínuo, confirmado ao vivo) foram conferidos
    diretamente contra a metadata Firebird do GENUS (RDB$RELATION_FIELDS via
    `isql`, sem ler nenhuma linha de dado de negócio): CODIGO/CODEMPRESA/
    CODFUNCIONARIO/CODFORNECEDOR/CODTRANSPORTE/CODDESTINO/CODAPROVADOR/
    CODCOMPRADOR/EMAILCODFUNCIONARIO/CODCOTACAO/CODRECEBEDOR/CODAGREGADO são
    INTEGER/SMALLINT puro -> Integer; PLACA/PLACA2/CODCONDPAGTO/TIPOFRETE são
    CHAR -> String(N); CONHECIMENTO/CODHISTORICO/OS/STATUS são VARCHAR ->
    String(N); OBS é BLOB sub_type 1 (texto) -> Text; TOTAL/FRETE/DESC_ACRES
    são NUMERIC armazenado como BIGINT com escala negativa -> Float; EMISSAO/
    DTENTREGA são DATE e DTCOMPRA/DTAPROVACAO/EMAILENVIADO/DTRECEBIMENTO são
    TIMESTAMP -> DateTime em todos os seis casos, mesmo critério já usado em
    `Entrada.emissao`/`Entrada.dt_entrada` para DATE vs. TIMESTAMP.

    CODIGO é confirmado, via metadata ao vivo (RDB$RELATION_CONSTRAINTS), como
    a chave primária real e própria desta tabela (`PK_COMPRAS`) — diferente de
    `Entrada`/GENUS.ENTRADA (que não tem CODIGO próprio e usa uma chave
    natural composta). Mesmo assim, seguindo o critério já usado em todas as
    demais tabelas GENUS reconhecidas neste ERP (nenhuma linha foi importada
    ainda, dedup ficará a cargo do agente de migração de dados, como já feito
    em `Produto.codigo`), esse CODIGO não é reaproveitado como PK deste ERP —
    o `id` serial é a única chave própria deste model, e o código original é
    preservado à parte (`codigo`, indexado, nullable).

    No GENUS, COMPRAS é a tabela "mãe" de COMPRASLAN: é a solicitação/pedido
    de compra em si (empresa, fornecedor, funcionário/comprador/aprovador,
    transportadora, frete, condição de pagamento, datas de emissão/aprovação/
    entrega/recebimento, status) — ou seja, um mesmo registro de COMPRAS tem
    muitas linhas em COMPRASLAN (uma por produto solicitado/comprado). Por
    isso `ItemCompra.compra_id` (FK própria para esta tabela) é criada agora,
    seguindo exatamente o mesmo precedente retroativo já estabelecido em
    `Entrada`/`ItemEntrada.entrada_id` e em `FaturaNota.saida_id`/
    `FaturaNota.fatura_id` (uma FK própria só passa a existir quando a tabela
    referenciada ganha model dedicado neste ERP). Essa FK só pode ser
    resolvida de fato relacionando GENUS.COMPRASLAN.CODCOMPRAS com
    GENUS.COMPRAS.CODIGO (= `CompraGenus.codigo` neste ERP) — tarefa do agente
    de migração de dados, não deste agente de estrutura. Por isso
    `ItemCompra.compra_id` é opcional (nullable) e `ItemCompra.cod_compras`
    continua preservado à parte, para não perder informação até que essa
    resolução aconteça.

    Diferente de `SolicitacaoCompra`/`PedidoCompra` (tabelas
    `solicitacoes_compra`/`pedidos_compra`, o fluxo de compras nativo deste
    ERP, criado antes da integração com o GENUS) e de `Entrada`/GENUS.ENTRADA
    (cabeçalho da nota fiscal de entrada, já efetivamente recebida
    fiscalmente), `CompraGenus`/GENUS.COMPRAS representa a solicitação/pedido
    de compra em si — antes do recebimento fiscal da mercadoria — exatamente
    o mesmo raciocínio de estágio já usado na docstring de `ItemCompra` para
    justificar por que ela não reaproveita `ItemPedidoCompra` nem
    `ItemEntrada`. Por isso `CompraGenus` também não reaproveita
    `SolicitacaoCompra`/`PedidoCompra`/`Entrada`, mesmo com campos
    conceitualmente parecidos (fornecedor, frete, datas, status).

    CODFUNCIONARIO/CODAPROVADOR/CODCOMPRADOR/CODRECEBEDOR/CODFORNECEDOR/
    CODTRANSPORTE, apesar do nome, referenciam CADASTRO no GENUS (confirmado
    ao vivo via RDB$REF_CONSTRAINTS: FK_COMPRAS_FUNCIONARIO,
    FK_COMPRAS_APROVADOR, FK_COMPRAS_COMPRADOR, FK_COMPRAS_RECEBEDOR,
    FK_COMPRAS_FORNECEDOR e FK_COMPRAS_TRANSPORTE apontam todas para
    CADASTRO) — mesmo precedente já confirmado em `Entrada.cod_fornecedor`/
    `ItemEntrada.cod_fornecedor`: essas entidades não têm identidade própria
    no GENUS (são extensões 1:1 de CADASTRO, o mestre de pessoas/empresas do
    sistema legado). Por isso nenhuma delas ganha FK própria para
    `funcionarios.id`/`fornecedores.id`/`transportadoras.id` deste ERP — a
    entidade real, quando migrada de fato, vai exigir resolver esses códigos
    brutos contra CADASTRO. EMAILCODFUNCIONARIO não tem constraint de FK
    formal no GENUS, mas é mantido com o mesmo tratamento por consistência de
    nome/semântica (é apenas um segundo CODFUNCIONARIO).

    CODEMPRESA e CODDESTINO referenciam EMPRESA (confirmado ao vivo:
    FK_COMPRAS_EMPRESA e FK_COMPRAS_DESTINO apontam para EMPRESA — CODDESTINO
    é a empresa/filial de destino da compra, não uma tabela "DESTINO"
    separada, apesar do nome). CODCONDPAGTO referencia CONDPAGTO (já
    reconhecida neste ERP como `FormaPagamento`). CODHISTORICO referencia
    HISTORICO (já reconhecida neste ERP como `Historico`). CODCOTACAO
    referencia COTACAOPRECO (ainda sem model dedicado). CODAGREGADO participa
    de uma FK composta (FK_AGREG_COMPRAS, junto com CODFORNECEDOR) para
    AGREGADOS (ainda sem model dedicado). Seguindo exatamente o mesmo critério
    já usado para `Historico`/GENUS.HISTORICO em relação a
    `ContaPagar.cod_historico`/`ContaReceber.cod_historico` (tabela mestre já
    existe no ERP, mas a FK é deliberadamente **não** criada agora) e para
    `GrupoProduto`/`TipoVenda` em relação a `Produto.cod_grupo`/
    `Saida.cod_tipo_venda`, nenhum desses códigos ganha FK própria nesta
    atualização — todos permanecem como códigos brutos (`cod_*`), sem FK,
    mesmo quando o model mestre já existe neste ERP; resolvê-los é tarefa do
    agente de migração de dados.

    OS (campo de nome curto, "ordem de serviço") é mantido como está, mesmo
    padrão de campos de nome obscuro/abreviado já preservados sem
    reinterpretação em outras tabelas GENUS deste ERP (ex.: `ItemCompra.cpr`/
    `ItemCompra.st`).

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela COMPRAS foi lido no GENUS por este agente.
    """
    __tablename__ = "compras_genus"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave própria do documento de compra ──────────────
    codigo = Column(Integer, nullable=True, index=True)                    # GENUS: CODIGO (PK original no GENUS — PK_COMPRAS; referenciado como cod_compras em ItemCompra — ver docstring)
    cod_empresa = Column(Integer, nullable=True, index=True)               # GENUS: CODEMPRESA (FK GENUS -> EMPRESA; mirror bruto sem FK própria)
    emissao = Column(DateTime, nullable=True)                              # GENUS: EMISSAO
    cod_funcionario = Column(Integer, nullable=True)                       # GENUS: CODFUNCIONARIO (FK GENUS -> CADASTRO; funcionário que solicitou — ver docstring)
    cod_fornecedor = Column(Integer, nullable=True, index=True)            # GENUS: CODFORNECEDOR (FK GENUS -> CADASTRO; ver docstring)
    cod_transporte = Column(Integer, nullable=True)                        # GENUS: CODTRANSPORTE (FK GENUS -> CADASTRO; transportadora — ver docstring)
    cod_destino = Column(Integer, nullable=True)                          # GENUS: CODDESTINO (FK GENUS -> EMPRESA; empresa/filial de destino — ver docstring)

    # ── Condição de pagamento / transporte ─────────────────────────────────
    cod_cond_pagto = Column(String(5), nullable=True)                     # GENUS: CODCONDPAGTO (FK GENUS -> CONDPAGTO, já reconhecida como FormaPagamento — ver docstring)
    placa = Column(String(8), nullable=True)                              # GENUS: PLACA
    placa2 = Column(String(8), nullable=True)                             # GENUS: PLACA2
    tipo_frete = Column(String(1), nullable=True)                         # GENUS: TIPOFRETE
    frete = Column(Float, nullable=True)                                  # GENUS: FRETE
    conhecimento = Column(String(15), nullable=True)                      # GENUS: CONHECIMENTO

    # ── Valores comerciais / totais ────────────────────────────────────────
    total = Column(Float, nullable=True)                                  # GENUS: TOTAL
    desc_acres = Column(Float, nullable=True)                             # GENUS: DESC_ACRES

    # ── Fluxo de aprovação / compra ─────────────────────────────────────────
    cod_aprovador = Column(Integer, nullable=True)                         # GENUS: CODAPROVADOR (FK GENUS -> CADASTRO; ver docstring)
    cod_comprador = Column(Integer, nullable=True)                         # GENUS: CODCOMPRADOR (FK GENUS -> CADASTRO; ver docstring)
    dt_compra = Column(DateTime, nullable=True)                            # GENUS: DTCOMPRA
    dt_aprovacao = Column(DateTime, nullable=True)                         # GENUS: DTAPROVACAO
    dt_entrega = Column(DateTime, nullable=True)                           # GENUS: DTENTREGA

    # ── Recebimento ──────────────────────────────────────────────────────────
    cod_recebedor = Column(Integer, nullable=True)                         # GENUS: CODRECEBEDOR (FK GENUS -> CADASTRO; ver docstring)
    dt_recebimento = Column(DateTime, nullable=True)                       # GENUS: DTRECEBIMENTO

    # ── Cotação / agregação ──────────────────────────────────────────────────
    cod_cotacao = Column(Integer, nullable=True)                           # GENUS: CODCOTACAO (FK GENUS -> COTACAOPRECO, não modelada ainda)
    cod_agregado = Column(Integer, nullable=True)                          # GENUS: CODAGREGADO (parte de FK composta GENUS -> AGREGADOS, não modelada ainda)

    # ── Histórico / observações / status ───────────────────────────────────
    cod_historico = Column(String(12), nullable=True)                     # GENUS: CODHISTORICO (FK GENUS -> HISTORICO, já reconhecida como Historico — ver docstring)
    os = Column(String(20), nullable=True)                                # GENUS: OS
    obs = Column(Text, nullable=True)                                     # GENUS: OBS
    status = Column(String(50), nullable=True, index=True)                # GENUS: STATUS

    # ── E-mail ──────────────────────────────────────────────────────────────
    email_enviado = Column(DateTime, nullable=True)                       # GENUS: EMAILENVIADO
    email_cod_funcionario = Column(Integer, nullable=True)                 # GENUS: EMAILCODFUNCIONARIO

    itens = relationship("ItemCompra", back_populates="compra", cascade="all, delete-orphan")
    entradas_vinculadas = relationship("CompraEntrada", foreign_keys="[CompraEntrada.compra_id]", back_populates="compra", cascade="all, delete-orphan")


class ItemCompra(Base):
    """Item de compra (linha de uma solicitação/pedido de compra) — GENUS.COMPRASLAN.

    Reconhece a estrutura completa da tabela COMPRASLAN do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB) — segundo model do módulo Compras (Tier 2) deste ERP,
    ao lado de `ItemEntrada`/GENUS.ENTLAN. Os 19 campos originais de COMPRASLAN
    foram conferidos diretamente no schema Firebird do GENUS via metadados
    (RDB$RELATION_FIELDS), sem ler nenhuma linha de dado de negócio: são
    majoritariamente NUMERIC armazenado como INTEGER/BIGINT com escala negativa
    -> Float (UNITARIO, CUSTOREAL, DESCONTO, IPIVALOR, IPI, KGMT, UNDE, ST, CPR,
    OUTROSVALORES, TAXAFORNECEDOR, TOTAL, QTDE, KGMTTOTAL), com CODCOMPRAS/
    CODEMPRESA como INTEGER puro, CODPRODUTO/LOTEPRODUTO como VARCHAR -> String
    e OBS como BLOB texto -> Text.

    No GENUS, COMPRASLAN é a tabela "filha" de COMPRAS (cabeçalho da
    solicitação/pedido de compra: empresa, fornecedor, funcionário/comprador/
    aprovador, transportadora, frete, datas de emissão/aprovação/entrega/
    recebimento, status) — ou seja, um mesmo registro de COMPRAS (pedido de
    compra) tem muitas linhas em COMPRASLAN (uma por produto solicitado/
    comprado). Essa combinação agora tem contraparte estrutural em
    `CompraGenus`/GENUS.COMPRAS (cabeçalho, ver classe acima, criada junto com
    esta atualização) — por isso `compra_id` (FK própria para `CompraGenus`)
    é criado aqui, seguindo exatamente o mesmo precedente retroativo já usado
    em `Entrada`/`ItemEntrada.entrada_id` (uma FK própria passa a existir
    quando a tabela referenciada ganha model dedicado neste ERP). Essa FK só
    pode ser resolvida de fato relacionando GENUS.COMPRASLAN.CODCOMPRAS com
    GENUS.COMPRAS.CODIGO (= `CompraGenus.codigo`) — tarefa do agente de
    migração de dados, não deste agente de estrutura. Por isso `compra_id` é
    opcional (nullable) e o código bruto original (`cod_compras`) continua
    preservado à parte, para não perder informação até que essa resolução
    aconteça.

    Diferente de `ItemPedidoCompra` (tabela `itens_pedido_compra`, o fluxo de
    pedido de compra nativo deste ERP, criado antes da integração com o GENUS)
    e de `ItemEntrada`/GENUS.ENTLAN (item já efetivamente recebido/entrado
    fiscalmente, nota fiscal de compra), `ItemCompra`/GENUS.COMPRASLAN
    representa o item da solicitação/pedido de compra em si — antes do
    recebimento fiscal da mercadoria — por isso não reaproveita nenhum dos
    dois, mesmo com campos conceitualmente parecidos (quantidade, valor
    unitário, total): são estágios diferentes do fluxo de compras.

    Este model é ligado ao cadastro de produto já migrado (`Produto`, 5.629
    produtos reais) através da FK `produto_id`. Essa FK só pode ser resolvida
    de fato relacionando GENUS.COMPRASLAN.CODPRODUTO com GENUS.PRODUTO.CODIGO
    (= `Produto.codigo` neste ERP) — tarefa do agente de migração de dados,
    não deste agente de estrutura. Por isso `produto_id` é opcional (nullable)
    e o código bruto original (`cod_produto`) é preservado à parte, para não
    perder informação até que essa resolução aconteça — exatamente o mesmo
    precedente já usado em `ItemEntrada.produto_id`/`ItemEntrada.cod_produto`
    e `ItemSaida.produto_id`/`ItemSaida.cod_produto`.

    CPR e ST são abreviações não documentadas na origem — mantidas como estão,
    seguindo o mesmo precedente já usado para `ItemEntrada.cpr`. UNDE também é
    um campo de origem obscura no GENUS, já visto antes em
    `Produto.fator_unde` (mesmo nome de coluna, tabela diferente).

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela COMPRASLAN foi lido no GENUS por este agente.
    """
    __tablename__ = "itens_compra"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO

    # ── Vínculo com o cabeçalho de compra já migrado (ver model CompraGenus) ──
    compra_id = Column(Integer, ForeignKey("compras_genus.id"), nullable=True, index=True)  # resolvido de GENUS: CODCOMPRAS -> CompraGenus.codigo

    # ── Identificação / chave bruta do documento de compra (mirror — ver compra_id acima) ─
    cod_compras = Column(Integer, nullable=True, index=True)             # GENUS: CODCOMPRAS (código bruto — referencia GENUS.COMPRAS.CODIGO, antes da resolução de compra_id — ver docstring)
    cod_produto = Column(String(15), nullable=True, index=True)          # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    cod_empresa = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA
    lote_produto = Column(String(15), nullable=True, index=True)         # GENUS: LOTEPRODUTO

    # ── Quantidades / valores comerciais ───────────────────────────────────
    unitario = Column(Float, nullable=True)                              # GENUS: UNITARIO
    custo_real = Column(Float, nullable=True)                            # GENUS: CUSTOREAL
    desconto = Column(Float, nullable=True)                              # GENUS: DESCONTO
    outros_valores = Column(Float, nullable=True)                        # GENUS: OUTROSVALORES
    taxa_fornecedor = Column(Float, nullable=True)                       # GENUS: TAXAFORNECEDOR
    total = Column(Float, nullable=True)                                 # GENUS: TOTAL
    qtde = Column(Float, nullable=True)                                  # GENUS: QTDE
    cpr = Column(Float, nullable=True)                                   # GENUS: CPR (abreviação não documentada na origem — mantida como está)

    # ── Unidades / conversões ──────────────────────────────────────────────
    kgmt = Column(Float, nullable=True)                                  # GENUS: KGMT
    kgmt_total = Column(Float, nullable=True)                            # GENUS: KGMTTOTAL
    unde = Column(Float, nullable=True)                                  # GENUS: UNDE (campo de origem obscura no GENUS, mesmo nome já visto em Produto.fator_unde)

    # ── Fiscal ──────────────────────────────────────────────────────────────
    ipi = Column(Float, nullable=True)                                   # GENUS: IPI
    ipi_valor = Column(Float, nullable=True)                             # GENUS: IPIVALOR
    st = Column(Float, nullable=True)                                    # GENUS: ST (abreviação não documentada na origem — mantida como está)

    # ── Observação ──────────────────────────────────────────────────────────
    obs = Column(Text, nullable=True)                                    # GENUS: OBS

    produto = relationship("Produto", back_populates="itens_compra")
    compra = relationship("CompraGenus", foreign_keys=[compra_id], back_populates="itens")


class EntradaFrete(Base):
    """Vínculo de frete de uma entrada (nota fiscal de compra) com um segundo
    documento (GENUS.ENTRADAFRETE) — módulo Compras (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela ENTRADAFRETE do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB). Os 10 campos originais foram conferidos
    diretamente contra o cache de metadados do schema Firebird do GENUS
    (RDB$RELATION_FIELDS via isql), sem ler nenhuma linha de dado de
    negócio: todos INTEGER puro (CODEMPRESA, DOC, CODFORNECEDOR,
    CODEMPRESA2, DOC2, CODFORNECEDOR2) ou CHAR/VARCHAR curto -> String
    (TIPODOC/TIPODOC2 de 1 posição, SERIE/SERIE2 de 4 posições) —
    exatamente os tipos sugeridos, sem ambiguidade.

    No GENUS, ENTRADAFRETE é uma tabela de vínculo (análoga em espírito a
    `FaturaNota`/GENUS.FATURANOTA e a `PedidoNota`/GENUS.PEDIDONOTA, ambas já
    reconhecidas neste ERP) que liga, por duas chaves de documento lado a
    lado, uma entrada (nota fiscal de compra) a um segundo documento de
    frete: CODEMPRESA+TIPODOC+DOC+SERIE+CODFORNECEDOR identifica a entrada
    "principal" e CODEMPRESA2+TIPODOC2+DOC2+SERIE2+CODFORNECEDOR2 identifica
    o documento de frete vinculado (ex.: a nota fiscal do serviço de frete,
    ou uma segunda entrada que compõe o rateio de frete da primeira) — cada
    conjunto de 5 campos reproduz exatamente a mesma chave natural composta
    já usada em `Entrada.cod_empresa`/`Entrada.tipo_doc`/`Entrada.doc`/
    `Entrada.serie`/`Entrada.cod_fornecedor`.

    O primeiro conjunto (CODEMPRESA/TIPODOC/DOC/SERIE/CODFORNECEDOR) já é
    resolvível contra `Entrada`, já reconhecida neste ERP — por isso
    `entrada_id` (FK própria para `Entrada`) é criado aqui, seguindo
    exatamente o mesmo precedente retroativo já estabelecido em
    `FaturaNota.saida_id`/`FaturaNota.fatura_id` e em
    `ItemEntrada.entrada_id` (uma FK própria só passa a existir quando a
    tabela referenciada ganha model dedicado neste ERP, e a chave bruta bate
    exatamente com a chave natural já modelada). Essa FK só pode ser
    resolvida de fato relacionando (GENUS.ENTRADAFRETE.CODEMPRESA,
    .TIPODOC, .DOC, .SERIE, .CODFORNECEDOR) com (`Entrada.cod_empresa`,
    `Entrada.tipo_doc`, `Entrada.doc`, `Entrada.serie`,
    `Entrada.cod_fornecedor`) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `entrada_id` é opcional (nullable) e
    os cinco códigos brutos originais continuam preservados à parte
    (`cod_empresa`, `tipo_doc`, `doc`, `serie`, `cod_fornecedor`), para não
    perder informação até que essa resolução aconteça.

    O segundo conjunto (CODEMPRESA2/TIPODOC2/DOC2/SERIE2/CODFORNECEDOR2)
    tem exatamente a mesma forma da chave natural de `Entrada`, mas seu
    significado exato (documento de frete propriamente dito? uma segunda
    entrada vinculada? TIPODOC2 pode não ser sempre o mesmo tipo de
    documento de uma ENTRADA) não pôde ser confirmado apenas por metadados
    de schema — mesmo critério de cautela já usado em `Entrada` para seus
    próprios campos CODEMPRESA2/TIPODOC2/DOC2/SERIE2/CODFORNECEDOR2 (lá
    também deixados sem FK própria, "resolver o significado exato... é
    tarefa fora do escopo desta atualização estrutural"). Por isso, para
    não criar um relacionamento incorreto, o segundo conjunto é mantido
    aqui apenas como códigos brutos (`cod_empresa2`, `tipo_doc2`, `doc2`,
    `serie2`, `cod_fornecedor2`), sem FK própria — resolver se ele também
    aponta para `Entrada` (e criar `entrada2_id` nesse caso) é tarefa do
    agente de migração de dados, que poderá confirmar o significado exato
    inspecionando dados reais.

    CODFORNECEDOR/CODFORNECEDOR2, apesar do nome, também NÃO referenciam a
    PK serial deste ERP (`fornecedores.id`): mesmo precedente já confirmado
    em `Entrada.cod_fornecedor`/`ItemEntrada.cod_fornecedor` — o FORNECEDOR
    do GENUS não tem identidade própria (é uma extensão 1:1 de CADASTRO, o
    mestre de pessoas/empresas do sistema legado), ou seja, CODFORNECEDOR
    aqui equivale a um CODCADASTRO.

    ENTRADAFRETE não tem uma coluna única "CODIGO"/"ID": seguindo o mesmo
    critério já usado nas demais tabelas de vínculo do GENUS reconhecidas
    neste ERP (nenhuma linha foi importada ainda), a chave composta natural
    não é reaproveitada como PK deste ERP — o `id` serial é a única chave
    própria deste model.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela ENTRADAFRETE foi lido no GENUS por este
    agente.
    """
    __tablename__ = "entradas_frete"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cabeçalho de entrada já migrado (ver model Entrada) ──
    entrada_id = Column(Integer, ForeignKey("entradas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, TIPODOC, DOC, SERIE, CODFORNECEDOR) -> (Entrada.cod_empresa, Entrada.tipo_doc, Entrada.doc, Entrada.serie, Entrada.cod_fornecedor)

    # ── Identificação / chave bruta da entrada principal (mirror — ver entrada_id acima) ──
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA (parte da chave natural da entrada principal — ver docstring)
    tipo_doc = Column(String(1), nullable=True, index=True)               # GENUS: TIPODOC (parte da chave natural da entrada principal)
    doc = Column(Integer, nullable=True, index=True)                      # GENUS: DOC (parte da chave natural da entrada principal)
    serie = Column(String(4), nullable=True, index=True)                  # GENUS: SERIE (parte da chave natural da entrada principal)
    cod_fornecedor = Column(Integer, nullable=True, index=True)           # GENUS: CODFORNECEDOR (parte da chave natural da entrada principal; na verdade um CODCADASTRO — ver docstring)

    # ── Documento de frete vinculado (2º conjunto de chave — sem FK própria, ver docstring) ──
    cod_empresa2 = Column(Integer, nullable=True, index=True)             # GENUS: CODEMPRESA2
    tipo_doc2 = Column(String(1), nullable=True)                         # GENUS: TIPODOC2
    doc2 = Column(Integer, nullable=True, index=True)                    # GENUS: DOC2
    serie2 = Column(String(4), nullable=True)                            # GENUS: SERIE2
    cod_fornecedor2 = Column(Integer, nullable=True)                     # GENUS: CODFORNECEDOR2 (na verdade um CODCADASTRO — ver docstring)

    entrada = relationship("Entrada", foreign_keys=[entrada_id], back_populates="fretes")


class CompraEntrada(Base):
    """Vínculo entre uma solicitação/pedido de compra e a(s) nota(s) fiscal(is)
    de entrada geradas a partir dele — GENUS.COMPRAENTRADA, módulo Compras
    (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela COMPRAENTRADA do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB). Os 6 campos originais foram conferidos
    diretamente contra o cache de metadados do schema Firebird do GENUS
    (RDB$RELATION_FIELDS/RDB$NULL_FLAG via isql, já reunido nesta sessão),
    sem ler nenhuma linha de dado de negócio: CODEMPRESA é SMALLINT
    (RDB$FIELD_TYPE 7) -> Integer; DOC/CODFORNECEDOR/CODCOMPRAS são INTEGER
    puro (RDB$FIELD_TYPE 8) -> Integer; TIPODOC é CHAR(1) e SERIE é CHAR(4)
    (RDB$FIELD_TYPE 14) -> String(1)/String(4) — exatamente os tipos já
    sugeridos para esta tabela. Os 6 campos são NOT NULL no GENUS
    (RDB$NULL_FLAG = 1 em todos), diferente de `PedidoNota`/GENUS.PEDIDONOTA
    (onde só 3 dos 4 campos são NOT NULL).

    A relação N:N desta tabela com as duas entidades já reconhecidas neste
    ERP é confirmada ao vivo, e não apenas por convenção de nome: o cache de
    metadados desta sessão inclui a saída de `gstat` para COMPRAENTRADA, que
    lista três índices próprios da tabela — `PK_COMPRAENTRADA` (chave
    primária composta pelos 6 campos), `FK_COMPRAENTRADA_COMPRAS` (índice de
    1 coluna, batendo com CODCOMPRAS) e `FK_COMPRAENTRADA_ENTRADA` (índice de
    múltiplas colunas, batendo com o conjunto CODEMPRESA+TIPODOC+DOC+SERIE+
    CODFORNECEDOR) — confirmando exatamente a mesma leitura estrutural já
    usada para `PedidoNota` (vínculo N:N entre `PedidoVenda` e `Saida`) e
    para `EntradaFrete` (chave natural de `Entrada` reaproveitada por uma
    segunda tabela).

    Interpretação dos 6 campos, cruzando essas duas FKs reais com os models
    já existentes neste ERP:
    - CODCOMPRAS referencia GENUS.COMPRAS.CODIGO — a mesma coluna que
      `ItemCompra.cod_compras`/`CompraGenus.codigo` já reconhecem (ver
      docstring de `CompraGenus`). Por isso `compra_id` (FK própria para
      `CompraGenus`) é criado aqui.
    - CODEMPRESA + TIPODOC + DOC + SERIE + CODFORNECEDOR reproduzem
      exatamente a chave natural composta já usada em `Entrada.cod_empresa`/
      `Entrada.tipo_doc`/`Entrada.doc`/`Entrada.serie`/
      `Entrada.cod_fornecedor` (e em `ItemEntrada`/`EntradaFrete`, que já
      reaproveitam essa mesma chave). Por isso `entrada_id` (FK própria para
      `Entrada`) é criado aqui.

    Ou seja, cada linha de COMPRAENTRADA registra que uma nota fiscal de
    entrada específica foi recebida/vinculada a partir de uma solicitação de
    compra específica — uma mesma compra pode gerar várias entradas
    (recebimento parcial em mais de uma nota fiscal) e, estruturalmente, o
    inverso também é possível (uma mesma entrada vinculada a mais de uma
    compra, ex.: consolidação de pedidos em uma única nota) — por isso este
    model é a tabela de junção pura de uma relação N:N entre `CompraGenus` e
    `Entrada`, análoga em espírito a `PedidoNota` (vínculo N:N entre
    `PedidoVenda` e `Saida`, módulo Vendas/Faturamento), só que aqui no lado
    de Compras.

    Ambas as FKs só podem ser resolvidas de fato relacionando
    GENUS.COMPRAENTRADA.CODCOMPRAS com GENUS.COMPRAS.CODIGO
    (= `CompraGenus.codigo`) e (GENUS.COMPRAENTRADA.CODEMPRESA, .TIPODOC,
    .DOC, .SERIE, .CODFORNECEDOR) com (`Entrada.cod_empresa`,
    `Entrada.tipo_doc`, `Entrada.doc`, `Entrada.serie`,
    `Entrada.cod_fornecedor`) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `compra_id`/`entrada_id` são
    opcionais (nullable) e os 6 códigos brutos originais (`cod_empresa`,
    `tipo_doc`, `doc`, `serie`, `cod_fornecedor`, `cod_compras`) são
    preservados à parte, para não perder informação até que essa resolução
    aconteça.

    CODFORNECEDOR, apesar do nome, também NÃO referencia a PK serial deste
    ERP (`fornecedores.id`): mesmo precedente já confirmado em
    `Entrada.cod_fornecedor`/`ItemEntrada.cod_fornecedor` — o FORNECEDOR do
    GENUS não tem identidade própria (é uma extensão 1:1 de CADASTRO, o
    mestre de pessoas/empresas do sistema legado), ou seja, CODFORNECEDOR
    aqui equivale a um CODCADASTRO.

    COMPRAENTRADA tem chave primária composta própria no GENUS
    (`PK_COMPRAENTRADA`, formada pelos 6 campos) — mesma situação já vista em
    `PedidoNota`/PK_PEDIDONOTA. Ainda assim, seguindo o mesmo critério já
    usado para as demais tabelas do GENUS reconhecidas neste ERP (nenhuma
    linha foi importada ainda), essa chave composta não é reaproveitada como
    PK deste ERP — o `id` serial é a única chave própria deste model.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela COMPRAENTRADA foi lido no GENUS por este
    agente.
    """
    __tablename__ = "compras_entrada"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com a entrada (nota fiscal) e a compra já migradas neste ERP ──
    entrada_id = Column(Integer, ForeignKey("entradas.id"), nullable=True, index=True)      # resolvido de GENUS: (CODEMPRESA, TIPODOC, DOC, SERIE, CODFORNECEDOR) -> (Entrada.cod_empresa, Entrada.tipo_doc, Entrada.doc, Entrada.serie, Entrada.cod_fornecedor) — FK_COMPRAENTRADA_ENTRADA
    compra_id = Column(Integer, ForeignKey("compras_genus.id"), nullable=True, index=True)  # resolvido de GENUS: CODCOMPRAS -> CompraGenus.codigo — FK_COMPRAENTRADA_COMPRAS

    # ── Campos migrados de GENUS.COMPRAENTRADA (PK composta no GENUS: CODEMPRESA + TIPODOC + DOC + SERIE + CODFORNECEDOR + CODCOMPRAS; todos NOT NULL) ──
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA (NOT NULL no GENUS; parte da chave natural da entrada — ver docstring)
    tipo_doc = Column(String(1), nullable=True, index=True)               # GENUS: TIPODOC (NOT NULL no GENUS; parte da chave natural da entrada)
    doc = Column(Integer, nullable=True, index=True)                      # GENUS: DOC (NOT NULL no GENUS; parte da chave natural da entrada)
    serie = Column(String(4), nullable=True, index=True)                  # GENUS: SERIE (NOT NULL no GENUS; parte da chave natural da entrada)
    cod_fornecedor = Column(Integer, nullable=True, index=True)           # GENUS: CODFORNECEDOR (NOT NULL no GENUS; na verdade um CODCADASTRO — ver docstring)
    cod_compras = Column(Integer, nullable=True, index=True)              # GENUS: CODCOMPRAS (NOT NULL no GENUS; referencia GENUS.COMPRAS.CODIGO — ver docstring)

    entrada = relationship("Entrada", foreign_keys=[entrada_id], back_populates="compras_vinculadas")
    compra = relationship("CompraGenus", foreign_keys=[compra_id], back_populates="entradas_vinculadas")


class NotaXmlEntrada(Base):
    """XML da NF-e recebida vinculado a uma entrada (nota fiscal de entrada/
    compra) — GENUS.NOTAXMLENTRADA, módulo Fiscal (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela NOTAXMLENTRADA do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB). Os 7 campos originais foram conferidos
    diretamente contra o cache de metadados do schema Firebird do GENUS
    (RDB$RELATION_FIELDS via isql, já reunido nesta sessão), sem ler nenhuma
    linha de dado de negócio: CODEMPRESA é SMALLINT (RDB$FIELD_TYPE 7) NOT
    NULL -> Integer; TIPODOC é CHAR(1) (RDB$FIELD_TYPE 14) NOT NULL ->
    String(1); DOC é INTEGER puro (RDB$FIELD_TYPE 8) NOT NULL -> Integer;
    SERIE é CHAR(4) (RDB$FIELD_TYPE 14) NOT NULL -> String(4); CODFORNECEDOR
    é INTEGER puro (RDB$FIELD_TYPE 8) NOT NULL -> Integer; CHAVENFE é
    VARCHAR(70) (RDB$FIELD_TYPE 37), nullable -> String(70); ARQXML é BLOB
    (RDB$FIELD_TYPE 261), nullable -> Text — exatamente os tipos sugeridos,
    sem ambiguidade.

    NOTAXMLENTRADA é o par de NOTAXML (já reconhecida neste ERP como
    `NotaXml`, vinculada a `Saida`), só que do lado de entrada/compra: guarda
    o conteúdo bruto do XML da NF-e efetivamente recebida do fornecedor, uma
    linha por entrada com XML disponível. Diferente de NOTAXML (cuja chave
    natural com SAIDA é só o par CODEMPRESA+CODSAIDA), aqui a chave natural
    reproduz exatamente os 5 campos já usados como chave composta de
    `Entrada` (CODEMPRESA+TIPODOC+DOC+SERIE+CODFORNECEDOR) — o mesmo
    critério já documentado em `EntradaFrete`/`CompraEntrada`, ambas também
    filhas de `Entrada` pela mesma chave.

    Essa leitura estrutural é confirmada ao vivo, e não apenas por convenção
    de nome: o cache de metadados desta sessão inclui a saída de `gstat` para
    NOTAXMLENTRADA, que lista um índice `FK_NOTAXMLENTRADA_ENTRADA` (índice
    de múltiplas colunas, batendo exatamente com o conjunto
    CODEMPRESA+TIPODOC+DOC+SERIE+CODFORNECEDOR) — mesmo padrão de evidência
    real já usado para confirmar a relação `CompraEntrada` -> `Entrada`
    (`FK_COMPRAENTRADA_ENTRADA`). O cache também lista `FK_NOTAXMLENTRADA_
    EMPRESA` (índice de 1 coluna, CODEMPRESA -> EMPRESA, ainda sem model
    dedicado neste ERP) e `FK_NOTAXMLENTRADA_FORNECEDOR` (índice de 1 coluna,
    CODFORNECEDOR); este último, apesar do nome, também NÃO referencia a PK
    serial deste ERP (`fornecedores.id`) — mesmo precedente já confirmado em
    `Entrada.cod_fornecedor`/`ItemEntrada.cod_fornecedor`/`EntradaFrete.
    cod_fornecedor`: o FORNECEDOR do GENUS não tem identidade própria (é uma
    extensão 1:1 de CADASTRO, o mestre de pessoas/empresas do sistema
    legado), ou seja, CODFORNECEDOR aqui equivale a um CODCADASTRO.

    Por essa relação real e confirmada com `Entrada`, `entrada_id` (FK
    própria para `Entrada`) é criado aqui, seguindo exatamente o mesmo
    precedente já estabelecido em `EntradaFrete.entrada_id`/
    `CompraEntrada.entrada_id` (uma FK própria só passa a existir quando a
    tabela referenciada ganha model dedicado neste ERP, e a chave bruta bate
    exatamente com a chave natural já modelada). Essa FK só pode ser
    resolvida de fato relacionando (GENUS.NOTAXMLENTRADA.CODEMPRESA,
    .TIPODOC, .DOC, .SERIE, .CODFORNECEDOR) com (`Entrada.cod_empresa`,
    `Entrada.tipo_doc`, `Entrada.doc`, `Entrada.serie`,
    `Entrada.cod_fornecedor`) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `entrada_id` é opcional (nullable) e
    os cinco códigos brutos originais (`cod_empresa`, `tipo_doc`, `doc`,
    `serie`, `cod_fornecedor`) são preservados à parte, para não perder
    informação até que essa resolução aconteça.

    Vale notar que `Entrada` já reconhece, em seu próprio cabeçalho, colunas
    CHAVENFE/ARQXML idênticas em nome e tipo (`Entrada.chave_nfe`/
    `Entrada.arq_xml`, vindas de GENUS.ENTRADA) — NOTAXMLENTRADA é uma tabela
    GENUS estruturalmente separada e distinta (`gstat` confirma PK/dados
    próprios em página física separada), então este model dedicado é criado
    à parte, sem reaproveitar/fundir os campos de `Entrada`, mesmo critério
    de fidelidade estrutural 1:1 já usado para `NotaXml` (que também
    coexiste com colunas próprias equivalentes em `Saida`).

    Embora CODEMPRESA/TIPODOC/DOC/SERIE/CODFORNECEDOR sejam NOT NULL no
    GENUS (formam a chave natural da linha, compartilhada com `Entrada`),
    todos são mantidos nullable aqui, seguindo o mesmo critério já usado
    para as demais tabelas do GENUS reconhecidas neste ERP (nenhuma linha
    foi importada ainda) — o `id` serial é a única chave própria deste
    model.

    ARQXML é o conteúdo do XML da NF-e (BLOB no GENUS) — mapeado para
    `Text`, sem qualquer parsing/reinterpretação do conteúdo.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela NOTAXMLENTRADA foi lido no GENUS por este
    agente.
    """
    __tablename__ = "notas_xml_entrada"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cabeçalho de entrada já reconhecido neste ERP ──────────
    entrada_id = Column(Integer, ForeignKey("entradas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESA, TIPODOC, DOC, SERIE, CODFORNECEDOR) -> (Entrada.cod_empresa, Entrada.tipo_doc, Entrada.doc, Entrada.serie, Entrada.cod_fornecedor) — FK_NOTAXMLENTRADA_ENTRADA

    # ── Chave natural original da linha no GENUS (mesma chave composta de ENTRADA) ──
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA (SMALLINT NOT NULL no GENUS; parte da chave natural — ver docstring; FK_NOTAXMLENTRADA_EMPRESA)
    tipo_doc = Column(String(1), nullable=True, index=True)               # GENUS: TIPODOC (CHAR(1) NOT NULL no GENUS; parte da chave natural)
    doc = Column(Integer, nullable=True, index=True)                      # GENUS: DOC (INTEGER NOT NULL no GENUS; parte da chave natural)
    serie = Column(String(4), nullable=True, index=True)                  # GENUS: SERIE (CHAR(4) NOT NULL no GENUS; parte da chave natural)
    cod_fornecedor = Column(Integer, nullable=True, index=True)           # GENUS: CODFORNECEDOR (INTEGER NOT NULL no GENUS; na verdade um CODCADASTRO — ver docstring; FK_NOTAXMLENTRADA_FORNECEDOR)

    # ── Dados do XML da NF-e recebida ────────────────────────────────────────
    chave_nfe = Column(String(70), nullable=True, index=True)            # GENUS: CHAVENFE
    arq_xml = Column(Text, nullable=True)                                 # GENUS: ARQXML (conteúdo do XML da NF-e recebida)

    entrada = relationship("Entrada", foreign_keys=[entrada_id], back_populates="notas_xml_entrada")


class NotaDestinada(Base):
    """Nota fiscal destinada à empresa / manifesto do destinatário —
    GENUS.NOTASDESTINADAS, módulo Fiscal (Tier 2) deste ERP.

    Reconhece a estrutura completa da tabela NOTASDESTINADAS do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB). As 21 colunas originais foram
    conferidas contra o cache de metadados do schema Firebird do GENUS já
    coletado nesta sessão (RDB$RELATION_FIELDS/RDB$FIELDS,
    `scratchpad/genus_full_schema.json`), sem ler nenhuma linha de dado de
    negócio: a lista e os tipos batem exatamente com os já usados como
    sugestão para esta tabela (não foi possível confirmar chaves
    estrangeiras nomeadas via `gstat`/isql nesta sessão — `isql` não estava
    disponível no ambiente; a relação com `Entrada` abaixo é inferida pela
    mesma convenção de nome de coluna já confirmada ao vivo em
    `NotaXmlEntrada`/`FK_NOTAXMLENTRADA_ENTRADA`, não por uma FK própria
    confirmada nesta tabela).

    No GENUS, NOTASDESTINADAS é o "Manifesto do Destinatário": para cada
    NF-e emitida por um FORNECEDOR contra o CNPJ desta empresa e capturada
    via consulta à SEFAZ (Nota Fiscal Eletrônica destinada a este
    destinatário), existe uma linha aqui — antes de qualquer lançamento de
    compra propriamente dito. É, portanto, conceitualmente distinta de
    `Entrada`/GENUS.ENTRADA (que já registra a nota fiscal de entrada/compra
    efetivamente lançada no sistema, com seu próprio par CHAVENFE/ARQXML) e
    de `NotaXmlEntrada`/GENUS.NOTAXMLENTRADA (o XML já vinculado a uma
    ENTRADA lançada): NOTASDESTINADAS é o estágio anterior a ambas
    ("nota destinada"/pré-entrada, ainda pendente de manifestação e/ou
    lançamento), enquanto ENTRADA é o lançamento fiscal e contábil
    definitivo depois que o usuário decide confirmar a operação. Essa
    leitura é confirmada pelos próprios campos desta tabela:
    TIPODOCENTRADA/DOCENTRADA/SERIEENTRADA/CODFORNECEDORENTRADA/
    CODEMPRESAENTRADA reproduzem exatamente a chave natural composta já
    usada em `Entrada` (`Entrada.tipo_doc`/`Entrada.doc`/`Entrada.serie`/
    `Entrada.cod_fornecedor`/`Entrada.cod_empresa`, o mesmo conjunto de 5
    campos já usado em `NotaXmlEntrada`) — preenchidos somente depois que a
    nota destinada é de fato lançada como uma ENTRADA.

    CODIGO + CODEMPRESA formam a chave natural própria desta linha
    (`codigo`/`cod_empresa` abaixo) — mesmo critério já usado nas demais
    tabelas do GENUS reconhecidas neste ERP (nenhuma linha foi importada
    ainda): não é reaproveitada como PK; o `id` serial é a única chave
    própria deste model.

    FORNECEDOR/CNPJ/INSC guardam o nome e os documentos do emitente da NF-e
    destinada diretamente como texto (FORNECEDOR é VARCHAR(60), não um
    código) — ao contrário de `Fornecedor`/GENUS.FORNECEDOR (que só
    referencia CADASTRO por código via CODCADASTRO), aqui o GENUS grava a
    identificação do emitente em claro, coerente com este ser o estágio
    inicial de captura da NF-e (o fornecedor pode ainda não existir como
    CADASTRO próprio no sistema). Por isso não há FK própria para
    `fornecedores.id` aqui — sem confirmação adicional, mantido como texto
    bruto.

    Como já documentado em `Entrada` para CODSAIDAVINCULADA/
    CODEMPRESASAIDAVINCULADA/DOCSAIDAVINCULADA, os campos
    CODSAIDA/CODEMPRESASAIDA/DOCSAIDA aqui têm o mesmo formato de um
    vínculo com uma saída (nota fiscal de venda) desta empresa — por
    exemplo, no caso de devolução de mercadoria vendida antes, capturada de
    volta como NF-e destinada. Mantidos como códigos brutos (`cod_saida`,
    `cod_empresa_saida`, `doc_saida`), sem FK própria: a chave usada aqui
    (DOC) não corresponde à chave natural `Saida.cod_empresa`/
    `Saida.codigo`; resolução é tarefa do agente de migração de dados, não
    deste agente de estrutura.

    DOC (sem sufixo) é mantido como código bruto (`doc`) — não corresponde a
    nenhuma chave já reconhecida neste ERP; seu papel exato (talvez o
    número do próprio documento fiscal desta nota destinada, distinto do
    identificador CODIGO) só pode ser confirmado quando a entidade real for
    migrada de fato.

    RESUMO é mantido como código bruto (`resumo`, INTEGER) — possivelmente
    um indicador de que a NF-e foi capturada apenas como "resumo" (ciência
    da operação na SEFAZ, sem o XML completo) em vez do documento completo
    autorizado, sem reinterpretação. SITUACAO/STATUS (a situação da
    manifestação do destinatário perante a SEFAZ e o status interno de
    processamento no GENUS, respectivamente) são mantidos como strings
    livres, sem enumeração própria, mesmo critério já usado em
    `Saida.status_genus`/`Entrada`.

    CHAVENFE (chave de acesso da NF-e) e ARQXML (conteúdo do XML da NF-e
    destinada, baixado da SEFAZ) seguem o mesmo tratamento já usado em
    `NotaXml.chave_nfe`/`NotaXml.arq_xml` e em
    `NotaXmlEntrada.chave_nfe`/`NotaXmlEntrada.arq_xml` — aqui referentes à
    NF-e de terceiros ainda no estágio de manifesto do destinatário, não à
    NF-e própria emitida nem à já vinculada a uma ENTRADA lançada.

    Como `Entrada` já é um model dedicado neste ERP, `entrada_id` (FK
    própria, nullable) é criado agora, seguindo o mesmo precedente
    retroativo já estabelecido em `NotaXmlEntrada.entrada_id`/
    `CompraEntrada.entrada_id`/`EntradaFrete.entrada_id` (uma FK própria só
    passa a existir quando a tabela referenciada ganha model dedicado neste
    ERP). Essa FK só pode ser resolvida de fato relacionando
    (GENUS.NOTASDESTINADAS.CODEMPRESAENTRADA, .TIPODOCENTRADA, .DOCENTRADA,
    .SERIEENTRADA, .CODFORNECEDORENTRADA) com (`Entrada.cod_empresa`,
    `Entrada.tipo_doc`, `Entrada.doc`, `Entrada.serie`,
    `Entrada.cod_fornecedor`) — tarefa do agente de migração de dados, não
    deste agente de estrutura. Por isso `entrada_id` é opcional (nullable) e
    os cinco códigos brutos originais (`tipo_doc_entrada`, `doc_entrada`,
    `serie_entrada`, `cod_fornecedor_entrada`, `cod_empresa_entrada`)
    continuam preservados à parte, para não perder informação até que essa
    resolução aconteça — inclusive para as notas destinadas ainda não
    lançadas (`entrada_id` nulo), que são a maioria enquanto pendentes de
    manifestação.

    Embora CODIGO/CODEMPRESA sejam a chave natural da linha no GENUS, ambos
    são mantidos nullable aqui, seguindo o mesmo critério já usado para as
    demais tabelas do GENUS reconhecidas neste ERP (nenhuma linha foi
    importada ainda).

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela NOTASDESTINADAS foi lido no GENUS por este
    agente.
    """
    __tablename__ = "notas_destinadas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave natural própria desta linha ──────────────────
    cod_empresa = Column(Integer, nullable=True, index=True)              # GENUS: CODEMPRESA
    codigo = Column(Integer, nullable=True, index=True)                   # GENUS: CODIGO (identificador original da nota destinada; par natural com cod_empresa)
    emissao = Column(DateTime, nullable=True)                             # GENUS: EMISSAO
    doc = Column(Integer, nullable=True)                                  # GENUS: DOC

    # ── Emitente da NF-e destinada (texto em claro, sem código CADASTRO) ────
    cnpj = Column(String(14), nullable=True, index=True)                  # GENUS: CNPJ
    insc = Column(String(15), nullable=True)                              # GENUS: INSC
    fornecedor = Column(String(60), nullable=True)                        # GENUS: FORNECEDOR

    # ── Valores e status da manifestação/processamento ──────────────────────
    total_nfe = Column(Float, nullable=True)                              # GENUS: TOTALNFE
    situacao = Column(String(20), nullable=True)                          # GENUS: SITUACAO
    status_genus = Column(String(30), nullable=True)                     # GENUS: STATUS
    resumo = Column(Integer, nullable=True)                               # GENUS: RESUMO

    # ── NF-e destinada (chave de acesso e XML) ──────────────────────────────
    chave_nfe = Column(String(70), nullable=True, index=True)             # GENUS: CHAVENFE
    arq_xml = Column(Text, nullable=True)                                 # GENUS: ARQXML (conteúdo do XML da NF-e destinada, ainda não necessariamente lançada)

    # ── Vínculo com a entrada (lançamento de compra), quando já lançada ─────
    entrada_id = Column(Integer, ForeignKey("entradas.id"), nullable=True, index=True)  # resolvido de GENUS: (CODEMPRESAENTRADA, TIPODOCENTRADA, DOCENTRADA, SERIEENTRADA, CODFORNECEDORENTRADA) -> Entrada natural key
    tipo_doc_entrada = Column(String(1), nullable=True)                   # GENUS: TIPODOCENTRADA
    doc_entrada = Column(Integer, nullable=True)                          # GENUS: DOCENTRADA
    serie_entrada = Column(String(4), nullable=True)                      # GENUS: SERIEENTRADA
    cod_fornecedor_entrada = Column(Integer, nullable=True)               # GENUS: CODFORNECEDORENTRADA
    cod_empresa_entrada = Column(Integer, nullable=True)                  # GENUS: CODEMPRESAENTRADA

    # ── Vínculo com uma saída (nota de venda), ex.: devolução ───────────────
    cod_saida = Column(Integer, nullable=True)                            # GENUS: CODSAIDA
    cod_empresa_saida = Column(Integer, nullable=True)                    # GENUS: CODEMPRESASAIDA
    doc_saida = Column(Integer, nullable=True)                            # GENUS: DOCSAIDA

    entrada = relationship("Entrada", foreign_keys=[entrada_id], back_populates="notas_destinadas_vinculadas")


class CotacaoPreco(Base):
    """Cabeçalho da cotação de preço (RFQ - Request for Quotation) — GENUS.
    COTACAOPRECO, módulo Compras (Tier 2) deste ERP, terceiro model do grupo
    GENUS COTACAO* reconhecido nesta sessão, e o pai de `CotacaoItens`/
    GENUS.COTACAOITENS e `CotacaoProduto`/GENUS.COTACAOPRODUTO (ambas já
    reconhecidas nesta mesma sessão, ainda sem FK própria para esta tabela,
    porque COTACAOPRECO não tinha model dedicado até agora — ver abaixo).

    Reconhece a estrutura completa da tabela COTACAOPRECO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB). Os 10 campos originais foram conferidos ao
    vivo via metadados Firebird (RDB$RELATION_FIELDS/RDB$RELATION_CONSTRAINTS/
    RDB$REF_CONSTRAINTS/RDB$INDEX_SEGMENTS por isql, sem ler nenhuma linha de
    dado de negócio):
    - CODIGO: INTEGER (RDB$FIELD_TYPE 8, sub_type 0) -> Integer. PK própria
      no GENUS (`PK_COTACAOPRECO`, coluna única — diferente de
      `CotacaoItens`/`CotacaoProduto`, cujas PKs são compostas).
    - CODEMPRESA: SMALLINT (RDB$FIELD_TYPE 7, sub_type 0, length 2) ->
      Integer (mesmo tratamento já dado a todo CODEMPRESA SMALLINT neste
      ERP, ex.: `Fatura.cod_empresa`).
    - EMISSAO: DATE (RDB$FIELD_TYPE 12) -> DateTime (mesmo tratamento já
      dado a toda data DATE no GENUS reconhecida neste ERP, ex.:
      `Fatura.emissao`, mesmo quando a coluna original não tem componente de
      hora).
    - DESCRICAO: VARCHAR(50) (RDB$FIELD_TYPE 37, sub_type 0, length 50) ->
      String(50) — exatamente o tipo já sugerido para esta tabela.
    - STATUS: CHAR(1) (RDB$FIELD_TYPE 14, sub_type 0, length 1) -> String(1).
    - VALIDADE: DATE (RDB$FIELD_TYPE 12) -> DateTime, mesmo tratamento de
      EMISSAO acima.
    - CODFUNCIONARIO: INTEGER (RDB$FIELD_TYPE 8, sub_type 0) -> Integer.
    - CODAPROVADOR: INTEGER (RDB$FIELD_TYPE 8, sub_type 0) -> Integer.
    - DATAAPROVADO: DATE (RDB$FIELD_TYPE 12) -> DateTime, mesmo tratamento de
      EMISSAO/VALIDADE acima.
    - HORAAPROVADO: CHAR(8) (RDB$FIELD_TYPE 14, sub_type 0, length 8) ->
      String(8) — exatamente os tipos já sugeridos para toda esta tabela.

    No GENUS, COTACAOPRECO é o cabeçalho da cotação de preço (RFQ): empresa,
    data de emissão, descrição, status (aberta/fechada/cancelada etc.),
    validade, o funcionário que solicitou/conduziu a cotação e o aprovador
    (com data/hora da aprovação) — os dados comerciais em si (produtos e
    quantidades solicitados, propostas de fornecedores) vivem nas tabelas
    filhas já reconhecidas neste ERP:
    - `CotacaoProduto`/GENUS.COTACAOPRODUTO responde "quais produtos e
      quanto" foi pedido cotação (a demanda).
    - `CotacaoItens`/GENUS.COTACAOITENS responde "quem cotou cada produto e
      por qual preço" (a oferta, uma linha por fornecedor/produto).
    Confirmado ao vivo, não apenas por convenção de nome: nenhuma FK própria
    parte de COTACAOPRECO para essas duas tabelas (a direção é sempre
    filha -> COTACAOPRECO, via `FK_COTACAOITENS_COTACAOPRECO` e `FK_COTACAO`
    respectivamente, já citadas nas docstrings de `CotacaoItens`/
    `CotacaoProduto`).

    Foreign keys confirmadas no GENUS (RDB$RELATION_CONSTRAINTS/
    RDB$REF_CONSTRAINTS), todas mantidas como códigos brutos, sem FK própria
    neste ERP, seguindo os mesmos critérios já usados em todo o restante do
    grupo GENUS COTACAO*/Financeiro/Compras reconhecido neste ERP:
    - `FK_COTACAOPRECO_EMPRESA`: CODEMPRESA -> EMPRESA. Mantido como código
      bruto (`cod_empresa`) — mesmo critério já usado em `Fatura.cod_empresa`
      /`FaturaPagar.cod_empresa`/`TabelaPreco.cod_empresa` etc., pois
      `Empresa` deste ERP ainda não guarda o código bruto GENUS.EMPRESA.
      CODIGO de forma resolvível a partir daqui.
    - `FK_COTACAOPRECO_FUNCIONARIO`: CODFUNCIONARIO -> CADASTRO (confirmado
      ao vivo — apesar do nome da constraint, o alvo real é CADASTRO, não
      FUNCIONARIO). Mantido como código bruto (`cod_funcionario`), sem FK
      própria — mesmo critério já usado para todo `cod_funcionario`
      espalhado neste ERP (ex.: `Saida.cod_funcionario`,
      `PedidoVenda.cod_funcionario`), mesmo quando a FK real é confirmada.
    - `FK_COTACAOPRECO_APROVADOR`: CODAPROVADOR -> CADASTRO (também
      confirmado ao vivo como indo para CADASTRO, não para uma tabela
      "aprovador" própria — o aprovador é, como o funcionário, uma extensão
      1:1 de CADASTRO, mesmo precedente de `CotacaoItens.cod_fornecedor`/
      `CompraGenus.cod_fornecedor`). Mantido como código bruto
      (`cod_aprovador`), sem FK própria, pelo mesmo motivo.

    COTACAOPRECO tem chave primária própria no GENUS (`PK_COTACAOPRECO`,
    coluna única CODIGO — diferente das duas tabelas filhas, cujas PKs são
    compostas). Ainda assim, seguindo o mesmo critério já usado para as
    demais tabelas do GENUS reconhecidas neste ERP (nenhuma linha foi
    importada ainda), essa PK não é reaproveitada como PK deste ERP — o `id`
    serial é a única chave própria deste model, e `codigo` é preservado à
    parte (mirror), indexado, nullable.

    Agora que COTACAOPRECO ganhou model dedicado, `CotacaoItens.cod_cotacao_
    preco` e `CotacaoProduto.cod_cotacao` passam a ser resolvíveis contra
    `CotacaoPreco.codigo` — por isso `cotacao_preco_id` (FK própria para esta
    tabela) foi acrescentado retroativamente em ambos os models filhos,
    seguindo exatamente o mesmo precedente retroativo já usado em
    `Entrada`/`ItemEntrada.entrada_id` e em `Fatura`/`FaturaNota.fatura_id`.
    Essa FK só pode ser resolvida de fato relacionando GENUS.COTACAOITENS.
    CODCOTACAOPRECO (ou GENUS.COTACAOPRODUTO.CODCOTACAO) com GENUS.
    COTACAOPRECO.CODIGO (= `CotacaoPreco.codigo` neste ERP) — tarefa do
    agente de migração de dados, não deste agente de estrutura. Por isso
    `cotacao_preco_id` é opcional (nullable) e os códigos brutos originais
    (`cod_cotacao_preco`/`cod_cotacao`) continuam preservados à parte, para
    não perder informação até que essa resolução aconteça.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela COTACAOPRECO foi lido no GENUS por este agente.
    """
    __tablename__ = "cotacoes_preco"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave bruta original (PK própria no GENUS: CODIGO) ──
    codigo = Column(Integer, nullable=True, index=True)                # GENUS: CODIGO (PK_COTACAOPRECO)
    cod_empresa = Column(Integer, nullable=True, index=True)           # GENUS: CODEMPRESA (FK_COTACAOPRECO_EMPRESA -> EMPRESA; código bruto, ver docstring)

    # ── Cabeçalho da cotação ────────────────────────────────────────────────
    emissao = Column(DateTime, nullable=True)                          # GENUS: EMISSAO
    descricao = Column(String(50), nullable=True)                      # GENUS: DESCRICAO
    status = Column(String(1), nullable=True)                          # GENUS: STATUS
    validade = Column(DateTime, nullable=True)                         # GENUS: VALIDADE

    # ── Solicitante e aprovação (ambos CODFUNCIONARIO/CODAPROVADOR -> CADASTRO no GENUS; ver docstring) ──
    cod_funcionario = Column(Integer, nullable=True, index=True)       # GENUS: CODFUNCIONARIO (FK_COTACAOPRECO_FUNCIONARIO -> CADASTRO; código bruto, ver docstring)
    cod_aprovador = Column(Integer, nullable=True, index=True)         # GENUS: CODAPROVADOR (FK_COTACAOPRECO_APROVADOR -> CADASTRO; código bruto, ver docstring)
    data_aprovado = Column(DateTime, nullable=True)                    # GENUS: DATAAPROVADO
    hora_aprovado = Column(String(8), nullable=True)                   # GENUS: HORAAPROVADO

    itens = relationship("CotacaoItens", back_populates="cotacao_preco", cascade="all, delete-orphan")
    produtos_solicitados = relationship("CotacaoProduto", back_populates="cotacao_preco", cascade="all, delete-orphan")


class CotacaoItens(Base):
    """Item de cotação de preço (linha "fornecedor cotou produto por tal
    preço" dentro de uma RFQ) — GENUS.COTACAOITENS, módulo Compras (Tier 2)
    deste ERP, primeiro model do grupo GENUS COTACAO* reconhecido neste ERP.

    Reconhece a estrutura completa da tabela COTACAOITENS do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB). Os 13 campos originais foram conferidos ao
    vivo via metadados Firebird (RDB$RELATION_FIELDS/RDB$NULL_FLAG por isql,
    sem ler nenhuma linha de dado de negócio): CODIGO/CODCOTACAOPRECO/
    CODFORNECEDOR são INTEGER puro (RDB$FIELD_TYPE 8, sub_type 0) -> Integer;
    CODPRODUTO é VARCHAR(15) e OBS é VARCHAR(200) (RDB$FIELD_TYPE 37,
    sub_type 0) -> String(15)/String(200) (diferente do OBS BLOB texto ->
    Text já visto em `CompraGenus`/`ItemCompra` — aqui OBS é VARCHAR mesmo,
    conferido ao vivo); PRECO/FRETE/ST/IPI/CPR/OUTROSVALORES/UNITARIO são
    NUMERIC armazenado como INTEGER com escala negativa (RDB$FIELD_TYPE 8,
    sub_type 1) e TOTAL é NUMERIC armazenado como BIGINT (RDB$FIELD_TYPE 16,
    sub_type 1) -> Float em todos — exatamente os tipos já sugeridos para
    esta tabela.

    No GENUS, COTACAOITENS é a tabela "filha" de COTACAOPRECO (cabeçalho da
    cotação de preço/RFQ: empresa, emissão, descrição, status, validade,
    funcionário, aprovador — agora com model dedicado neste ERP, `CotacaoPreco`,
    criado nesta mesma sessão de reconhecimento do grupo GENUS COTACAO*):
    cada registro de COTACAOITENS representa uma proposta de um
    fornecedor específico para um produto específico, dentro de uma mesma
    cotação — ou seja, um mesmo cabeçalho de COTACAOPRECO tem muitas linhas
    em COTACAOITENS (uma por combinação produto/fornecedor cotado), o que
    permite montar o mapa comparativo de propostas de fornecedores diferentes
    para os mesmos produtos antes de decidir a compra. Isso é confirmado ao
    vivo, e não apenas por convenção de nome: o schema Firebird lista três FKs
    próprias da tabela (RDB$REF_CONSTRAINTS) — `FK_COTACAOITENS_COTACAOPRECO`
    (CODCOTACAOPRECO -> COTACAOPRECO.CODIGO), `FK_COTACAOITENS_PRODUTO`
    (CODPRODUTO -> PRODUTO.CODIGO) e `FK_COTACAOITENS_FORNECEDOR`
    (CODFORNECEDOR -> CADASTRO, não uma tabela FORNECEDOR própria).

    CODFORNECEDOR, apesar do nome, referencia CADASTRO no GENUS (confirmado
    ao vivo) — mesmo precedente já confirmado em `CompraGenus.cod_fornecedor`/
    `Entrada.cod_fornecedor`/`ItemEntrada.cod_fornecedor`: o "fornecedor" do
    GENUS aqui não tem identidade própria, é uma extensão 1:1 de CADASTRO, o
    mestre de pessoas/empresas do sistema legado. Por isso `cod_fornecedor`
    permanece como código bruto, sem FK própria para `fornecedores.id`.

    CODCOTACAOPRECO agora é resolvido com FK própria (`cotacao_preco_id`)
    para `CotacaoPreco`, acrescentada retroativamente nesta mesma sessão, no
    momento em que COTACAOPRECO ganhou model dedicado neste ERP — seguindo
    exatamente o mesmo precedente retroativo já usado em `Entrada`/
    `ItemEntrada.entrada_id` e em `Fatura`/`FaturaNota.fatura_id` (uma FK
    própria só passa a existir quando a tabela referenciada ganha model
    dedicado neste ERP). Essa FK só pode ser resolvida de fato relacionando
    GENUS.COTACAOITENS.CODCOTACAOPRECO com GENUS.COTACAOPRECO.CODIGO (=
    `CotacaoPreco.codigo` neste ERP) — tarefa do agente de migração de dados,
    não deste agente de estrutura. Por isso `cotacao_preco_id` é opcional
    (nullable) e o código bruto original (`cod_cotacao_preco`) continua
    preservado à parte, para não perder informação até que essa resolução
    aconteça. (`CompraGenus.cod_cotacao`, campo análogo em outra tabela
    ainda não resolvido, permanece como código bruto — fora do escopo desta
    atualização.)

    Já CODPRODUTO é resolvido com FK própria (`produto_id`) para o cadastro
    de produto já migrado neste ERP (`Produto`, 5.629 produtos reais),
    seguindo exatamente o mesmo precedente já usado em `ItemCompra.produto_id`/
    `ItemEntrada.produto_id`/`ItemSaida.produto_id`. Essa FK só pode ser
    resolvida de fato relacionando GENUS.COTACAOITENS.CODPRODUTO com
    GENUS.PRODUTO.CODIGO (= `Produto.codigo` neste ERP) — tarefa do agente de
    migração de dados, não deste agente de estrutura. Por isso `produto_id` é
    opcional (nullable) e o código bruto original (`cod_produto`) é
    preservado à parte, para não perder informação até que essa resolução
    aconteça.

    CPR e ST são abreviações não documentadas na origem — mantidas como
    estão, mesmo precedente já usado em `ItemCompra.cpr`/`ItemCompra.st`.

    COTACAOITENS tem chave primária composta própria no GENUS
    (`PK_CONTROLECOTACAO`, formada por CODIGO + CODCOTACAOPRECO — nome de
    constraint que não bate com o nome da tabela, resquício de uma renomeação
    no sistema de origem; CODIGO por si só não é único entre cotações
    diferentes, só é único dentro de uma mesma CODCOTACAOPRECO). Seguindo o
    mesmo critério já usado para as demais tabelas do GENUS reconhecidas
    neste ERP, essa chave composta não é reaproveitada como PK deste ERP — o
    `id` serial é a única chave própria deste model, e `codigo`/
    `cod_cotacao_preco` são preservados à parte (mirror), indexados,
    nullable.

    Existe ainda GENUS.COTACAOITENSAGREGADO, tabela-neta que referencia
    CODCOTACAOITENS (= esta tabela) + CODCOTACAOPRECO + CODPRODUTO +
    CODFORNECEDOR + CODAGREGADO para detalhar quantidade por agregado/tamanho
    dentro de cada linha de cotação — fora do escopo desta tarefa (nenhum
    model criado para ela aqui), citada apenas para não perder de vista esse
    relacionamento.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela COTACAOITENS foi lido no GENUS por este agente.
    """
    __tablename__ = "cotacao_itens"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO — FK_COTACAOITENS_PRODUTO

    # ── Vínculo com o cabeçalho da cotação de preço já migrado (ver model CotacaoPreco, acrescentado retroativamente) ──
    cotacao_preco_id = Column(Integer, ForeignKey("cotacoes_preco.id"), nullable=True, index=True)  # resolvido de GENUS: CODCOTACAOPRECO -> COTACAOPRECO.CODIGO — FK_COTACAOITENS_COTACAOPRECO

    # ── Identificação / chave bruta original (PK composta no GENUS: CODIGO + CODCOTACAOPRECO — ver docstring) ──
    codigo = Column(Integer, nullable=True, index=True)                    # GENUS: CODIGO (parte da PK_CONTROLECOTACAO no GENUS; não reaproveitado como PK deste ERP)
    cod_cotacao_preco = Column(Integer, nullable=True, index=True)         # GENUS: CODCOTACAOPRECO (FK_COTACAOITENS_COTACAOPRECO -> COTACAOPRECO.CODIGO; mirror bruto — ver cotacao_preco_id acima para a FK própria)
    cod_produto = Column(String(15), nullable=True, index=True)            # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)
    cod_fornecedor = Column(Integer, nullable=True, index=True)            # GENUS: CODFORNECEDOR (FK GENUS -> CADASTRO; ver docstring; FK_COTACAOITENS_FORNECEDOR)

    # ── Valores comerciais da proposta cotada ──────────────────────────────
    preco = Column(Float, nullable=True)                                   # GENUS: PRECO
    frete = Column(Float, nullable=True)                                   # GENUS: FRETE
    st = Column(Float, nullable=True)                                      # GENUS: ST (abreviação não documentada na origem — mantida como está)
    ipi = Column(Float, nullable=True)                                     # GENUS: IPI
    total = Column(Float, nullable=True)                                   # GENUS: TOTAL
    cpr = Column(Float, nullable=True)                                     # GENUS: CPR (abreviação não documentada na origem — mantida como está)
    outros_valores = Column(Float, nullable=True)                          # GENUS: OUTROSVALORES
    unitario = Column(Float, nullable=True)                                # GENUS: UNITARIO

    # ── Observação ──────────────────────────────────────────────────────────
    obs = Column(String(200), nullable=True)                              # GENUS: OBS

    produto = relationship("Produto", back_populates="cotacao_itens")
    cotacao_preco = relationship("CotacaoPreco", back_populates="itens")


class CotacaoProduto(Base):
    """Item solicitado (produto + quantidade) de uma cotação de preço (RFQ)
    — GENUS.COTACAOPRODUTO, módulo Compras (Tier 2) deste ERP, segundo model
    do grupo GENUS COTACAO* reconhecido nesta sessão (após `CotacaoItens`).

    Reconhece a estrutura completa da tabela COTACAOPRODUTO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB). Os 3 campos originais foram
    conferidos ao vivo via metadados Firebird (RDB$RELATION_FIELDS/
    RDB$NULL_FLAG por isql, sem ler nenhuma linha de dado de negócio):
    CODCOTACAO é INTEGER puro NOT NULL (RDB$FIELD_TYPE 8, sub_type 0) ->
    Integer; CODPRODUTO é VARCHAR(15) NOT NULL (RDB$FIELD_TYPE 37, sub_type
    0) -> String(15); QTDE é NUMERIC armazenado como BIGINT com escala
    negativa (RDB$FIELD_TYPE 16, sub_type 1, precision 15, scale -4),
    nullable -> Float — exatamente os tipos já sugeridos para esta tabela.

    Diferença de papel entre COTACAOPRODUTO e COTACAOITENS (ambas filhas de
    COTACAOPRECO, o cabeçalho da cotação de preço/RFQ: empresa, emissão,
    descrição, status, validade, funcionário, aprovador — agora com model
    dedicado neste ERP, `CotacaoPreco`, criado nesta mesma sessão),
    confirmada ao vivo via RDB$REF_CONSTRAINTS/RDB$INDEX_SEGMENTS, não apenas
    por convenção de nome:
    - COTACAOPRODUTO é a lista de produtos e quantidades *solicitados* numa
      cotação (o "o que estamos pedindo cotação, e de quanto" — a demanda),
      uma linha por produto dentro do cabeçalho.
    - COTACAOITENS é a lista de propostas *recebidas* de fornecedores para
      esses mesmos produtos dentro da mesma cotação (preço, frete, ST, IPI
      etc. por fornecedor/produto — a oferta).
    Ou seja, para uma mesma COTACAOPRECO, COTACAOPRODUTO responde "quais
    produtos e quanto" e COTACAOITENS responde "quem cotou cada produto e
    por qual preço".

    COTACAOPRODUTO tem chave primária composta própria no GENUS
    (`PK_COTACAOPRODUTO`, formada por CODCOTACAO + CODPRODUTO). Seguindo o
    mesmo critério já usado para as demais tabelas do GENUS reconhecidas
    neste ERP (incluindo `CotacaoItens`), essa chave composta não é
    reaproveitada como PK deste ERP — o `id` serial é a única chave própria
    deste model, e `cod_cotacao`/`cod_produto` são preservados à parte
    (mirror), indexados, nullable.

    CODCOTACAO tem FK própria confirmada ao vivo (`FK_COTACAO`, CODCOTACAO
    -> COTACAOPRECO.CODIGO via PK_COTACAOPRECO) e agora é resolvido com FK
    própria (`cotacao_preco_id`) para `CotacaoPreco`, acrescentada
    retroativamente nesta mesma sessão, no momento em que COTACAOPRECO
    ganhou model dedicado neste ERP — seguindo exatamente o mesmo precedente
    retroativo já usado em `Entrada`/`ItemEntrada.entrada_id` e em
    `CotacaoItens.cotacao_preco_id` (também resolvido nesta mesma
    atualização). Essa FK só pode ser resolvida de fato relacionando
    GENUS.COTACAOPRODUTO.CODCOTACAO com GENUS.COTACAOPRECO.CODIGO (=
    `CotacaoPreco.codigo` neste ERP) — tarefa do agente de migração de
    dados, não deste agente de estrutura. Por isso `cotacao_preco_id` é
    opcional (nullable) e o código bruto original (`cod_cotacao`) continua
    preservado à parte, para não perder informação até que essa resolução
    aconteça. (`CompraGenus.cod_cotacao`, campo análogo em outra tabela
    ainda não resolvido, permanece como código bruto — fora do escopo desta
    atualização.)

    Já CODPRODUTO tem FK própria confirmada ao vivo (`FK_COTACAOPRODUTO`,
    CODPRODUTO -> PRODUTO.CODIGO via PK_PRODUTO) e é resolvido com FK
    própria (`produto_id`) para o cadastro de produto já migrado neste ERP
    (`Produto`), seguindo exatamente o mesmo precedente já usado em
    `CotacaoItens.produto_id`/`ItemCompra.produto_id`/`ItemEntrada.produto_id`/
    `ItemSaida.produto_id`. Essa FK só pode ser resolvida de fato
    relacionando GENUS.COTACAOPRODUTO.CODPRODUTO com GENUS.PRODUTO.CODIGO
    (= `Produto.codigo` neste ERP) — tarefa do agente de migração de dados,
    não deste agente de estrutura. Por isso `produto_id` é opcional
    (nullable) e o código bruto original (`cod_produto`) é preservado à
    parte, para não perder informação até que essa resolução aconteça.

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela COTACAOPRODUTO foi lido no GENUS por este
    agente.
    """
    __tablename__ = "cotacao_produtos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Vínculo com o cadastro de produto já migrado ──────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO — FK_COTACAOPRODUTO

    # ── Vínculo com o cabeçalho da cotação de preço já migrado (ver model CotacaoPreco, acrescentado retroativamente) ──
    cotacao_preco_id = Column(Integer, ForeignKey("cotacoes_preco.id"), nullable=True, index=True)  # resolvido de GENUS: CODCOTACAO -> COTACAOPRECO.CODIGO — FK_COTACAO

    # ── Identificação / chave bruta original (PK composta no GENUS: CODCOTACAO + CODPRODUTO — ver docstring) ──
    cod_cotacao = Column(Integer, nullable=True, index=True)               # GENUS: CODCOTACAO (FK_COTACAO -> COTACAOPRECO.CODIGO; mirror bruto — ver cotacao_preco_id acima para a FK própria)
    cod_produto = Column(String(15), nullable=True, index=True)            # GENUS: CODPRODUTO (código bruto, antes da resolução de produto_id)

    # ── Quantidade solicitada na cotação ──────────────────────────────────
    qtde = Column(Float, nullable=True)                                    # GENUS: QTDE

    produto = relationship("Produto", back_populates="cotacao_produtos")
    cotacao_preco = relationship("CotacaoPreco", back_populates="produtos_solicitados")


class RequisicaoMateria(Base):
    """Cabeçalho da requisição de material — GENUS.REQUISICAOMATERIA, módulo
    Compras (Tier 2) deste ERP, segundo model do grupo GENUS
    REQUISICAOMATERIA* reconhecido neste ERP (depois de
    `RequisicaoMateriaEtapas`/GENUS.REQUISICAOMATERIAETAPAS, já reconhecida
    nesta mesma sessão, logo antes deste model). É o cabeçalho, pai de
    GENUS.REQUISICAOPRODUTO (item da requisição: produto, quantidade
    solicitada/QTDEPRODUZIDA, DTENTRADA, CUSTOTOTAL "resumo" — ainda sem
    model dedicado neste ERP), que por sua vez é o pai de
    `RequisicaoMateriaEtapas` (via `cod_req_produto`, código bruto — ver
    docstring daquele model, já reconhecido antes deste). Ou seja, a cadeia
    real no GENUS é REQUISICAOMATERIA -> REQUISICAOPRODUTO ->
    REQUISICAOMATERIAETAPAS. ATUALIZAÇÃO (mesma sessão): REQUISICAOPRODUTO,
    o elo do meio, agora também tem model dedicado neste ERP —
    `RequisicaoProduto`, logo abaixo — com FK própria (`requisicao_materia_id`)
    de volta para este model, e `RequisicaoMateriaEtapas.cod_req_produto`
    ganhou, retroativamente, sua própria FK (`requisicao_produto_id`) para
    `RequisicaoProduto`.

    Reconhece a estrutura completa da tabela REQUISICAOMATERIA do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB). Os 18 campos originais foram
    conferidos contra o cache de metadados do schema Firebird do GENUS
    (scratchpad/genus_full_schema.json, coletado via isql em sessão anterior
    deste mesmo agente de reconhecimento de estrutura) — isql não estava
    acessível ao vivo nesta sessão (nem o arquivo GENUS_ZANGUETTIN.FDB foi
    localizado no disco desta máquina), então a verificação foi feita
    inteiramente contra esse cache já validado, sem inventar nenhum tipo e
    sem ler nenhuma linha de dado de negócio:
    - CODIGO/CODEMPRESA/CODCLIENTE/CODFUNCIONARIO/CODTRANSPORTADOR/
      CODTANQUE -> Integer.
    - EMISSAO/DTPREVISAO -> DateTime (mesmo critério já dado a toda data
      DATE do GENUS reconhecida neste ERP, ex.: `CotacaoPreco.emissao`).
    - OBS -> Text (mesmo critério já usado para todo OBS "livre" deste
      grupo, ex.: `CompraGenus.obs`, diferente do OBS VARCHAR curto de
      `CotacaoItens.obs`).
    - TIPO/TIPOREQUISICAO -> String(1) (flags de um caractere, mesmo
      critério de `CotacaoPreco.status`).
    - HORA/HORAPREVISAO -> String(8) (mesmo critério já usado em toda hora
      "HH:MM:SS" deste ERP, ex.: `CotacaoPreco.hora_aprovado`).
    - LOTE -> String(10) (mesmo critério já usado em `PedidoVenda.lote`).
    - STATUS -> String(12) — mais longo que o STATUS de um caractere só já
      visto em `CotacaoPreco.status`/`CotacaoItens`; primeira vez que este
      comprimento aparece neste ERP para STATUS, mas é exatamente o mesmo
      sugerido no levantamento desta tabela e o mesmo do cache.
    - CODEQUIPAMENTO -> String(15). Atenção: aponta, por nome, para
      GENUS.EQUIPAMENTO (tabela de frota/equipamento do cliente:
      DESCRICAO/CHASSI/MARCA/MODELO/ANOFAB/ANOMOD/PREFIXOFROTA/CODCLIENTE —
      sem model dedicado neste ERP), cujo próprio CODIGO aparece como
      Integer no mesmo cache. Essa divergência de tipo (código aqui como
      String, CODIGO lá como Integer) não pôde ser resolvida com metadados
      de mais detalhe (RDB$FIELD_TYPE/sub_type/scale, ou conferência de que
      CODEQUIPAMENTO é de fato uma FK para EQUIPAMENTO.CODIGO e não outra
      coluna) nesta sessão, porque isql não estava acessível — fica
      registrada aqui para o agente de migração de dados conferir ao vivo
      antes de tentar qualquer join. `cod_equipamento` é mantido como
      String(15), exatamente o tipo sugerido/cacheado para esta coluna.
    - LOCALENTREGA -> String(50).
    - VOLTAGEM -> Float.

    Nenhuma FK própria (constraint) pôde ser confirmada ao vivo para este
    model, porque isql não estava acessível nesta sessão (apenas o cache de
    tipos sugeridos, sem RDB$RELATION_CONSTRAINTS/RDB$REF_CONSTRAINTS, foi
    usado) — diferente do que foi possível fazer, por exemplo, em
    `CotacaoPreco`. Por nome de coluna, e pelo mesmo critério já aplicado a
    todo o restante deste ERP para os mesmos nomes de coluna, os seguintes
    campos são mantidos como códigos brutos, sem FK própria:
    - `cod_empresa` -> EMPRESA (mesmo critério de `Fatura.cod_empresa`).
    - `cod_cliente` -> CADASTRO/CLIENTE (mesmo critério de
      `ContaReceber.cod_cliente`/`PedidoVenda.cod_cliente`).
    - `cod_funcionario` -> CADASTRO (mesmo critério de
      `CotacaoPreco.cod_funcionario`, mesmo quando a FK real aponta para
      CADASTRO e não para um "FUNCIONARIO" próprio).
    - `cod_transportador` -> TRANSPORTADORA (mesmo critério de
      `PedidoVenda.cod_transportador`; `Transportadora` já tem model
      dedicado neste ERP, mas sem o código bruto GENUS gravado ainda, o que
      impede resolver esta FK agora).
    - `cod_equipamento` -> GENUS.EQUIPAMENTO (tabela ainda sem model
      dedicado neste ERP — ver nota de tipo acima).
    - `cod_tanque` -> provavelmente GENUS.TANQUES_BATELADA (CODIGO/DESCRI)
      ou resolvido via a tabela de junção GENUS.TANQUES_REQUISICAO_MATERIA
      (CODIGO/CODREQUISICAOMATERIA/CODEMPRESAREQUISICAO/CODTANQUE/QTDE) —
      nenhuma das duas tem model dedicado neste ERP; mantido como código
      bruto.

    Quando GENUS.REQUISICAOPRODUTO ganhar model dedicado neste ERP, seu
    campo CODREQUISICAO (confirmado no mesmo cache de metadados, tabela
    REQUISICAOPRODUTO) deve resolver contra `RequisicaoMateria.codigo`, e
    uma FK própria (`requisicao_materia_id`) deve ser acrescentada
    retroativamente ao model de REQUISICAOPRODUTO — mesmo precedente
    retroativo já usado em `CotacaoPreco`/`CotacaoItens.cotacao_preco_id` e
    em `Entrada`/`ItemEntrada.entrada_id`. Resolver esse código de fato é
    tarefa do agente de migração de dados, não deste agente de estrutura.

    CODIGO é a chave primária própria e dedicada desta tabela no GENUS.
    Seguindo o mesmo critério já usado em todas as demais tabelas GENUS
    reconhecidas neste ERP (nenhuma linha foi importada ainda), esse CODIGO
    não é reaproveitado como PK deste ERP — o `id` serial é a única chave
    própria deste model, e o código original é preservado à parte
    (`codigo`, indexado, nullable).

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela REQUISICAOMATERIA foi lido no GENUS por este
    agente.
    """
    __tablename__ = "requisicoes_materia"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave bruta original (PK própria no GENUS: CODIGO — ver docstring) ──
    codigo = Column(Integer, nullable=True, index=True)                     # GENUS: CODIGO (PK própria no GENUS — não reaproveitada como PK deste ERP)
    cod_empresa = Column(Integer, nullable=True, index=True)                # GENUS: CODEMPRESA (código bruto -> EMPRESA)

    # ── Cabeçalho da requisição ─────────────────────────────────────────────
    emissao = Column(DateTime, nullable=True)                               # GENUS: EMISSAO
    tipo = Column(String(1), nullable=True)                                 # GENUS: TIPO
    tipo_requisicao = Column(String(1), nullable=True)                      # GENUS: TIPOREQUISICAO
    status = Column(String(12), nullable=True, index=True)                  # GENUS: STATUS
    lote = Column(String(10), nullable=True, index=True)                   # GENUS: LOTE
    obs = Column(Text, nullable=True)                                       # GENUS: OBS

    # ── Solicitante / responsáveis (códigos brutos -> CADASTRO/CLIENTE — ver docstring) ──
    cod_cliente = Column(Integer, nullable=True, index=True)                # GENUS: CODCLIENTE (código bruto -> CADASTRO/CLIENTE)
    cod_funcionario = Column(Integer, nullable=True, index=True)            # GENUS: CODFUNCIONARIO (código bruto -> CADASTRO)

    # ── Previsão de entrega/execução ────────────────────────────────────────
    dt_previsao = Column(DateTime, nullable=True)                           # GENUS: DTPREVISAO
    hora = Column(String(8), nullable=True)                                 # GENUS: HORA
    hora_previsao = Column(String(8), nullable=True)                        # GENUS: HORAPREVISAO
    local_entrega = Column(String(50), nullable=True)                      # GENUS: LOCALENTREGA
    cod_transportador = Column(Integer, nullable=True, index=True)         # GENUS: CODTRANSPORTADOR (código bruto -> TRANSPORTADORA)

    # ── Equipamento / tanque / voltagem (contexto de produção industrial — ver docstring) ──
    cod_equipamento = Column(String(15), nullable=True, index=True)        # GENUS: CODEQUIPAMENTO (código bruto -> GENUS.EQUIPAMENTO, sem model dedicado — ver nota de tipo na docstring)
    cod_tanque = Column(Integer, nullable=True, index=True)                # GENUS: CODTANQUE (código bruto -> GENUS.TANQUES_BATELADA/TANQUES_REQUISICAO_MATERIA, sem model dedicado)
    voltagem = Column(Float, nullable=True)                                # GENUS: VOLTAGEM

    itens = relationship("RequisicaoProduto", back_populates="requisicao_materia", cascade="all, delete-orphan")


class RequisicaoProduto(Base):
    """Item da requisição de material — GENUS.REQUISICAOPRODUTO, módulo
    Compras (Tier 2) deste ERP, elo do meio da cadeia REQUISICAOMATERIA
    (cabeçalho, `RequisicaoMateria`, model criado antes deste na mesma
    sessão) -> REQUISICAOPRODUTO (este model) -> REQUISICAOMATERIAETAPAS
    (etapa/apontamento parcial, `RequisicaoMateriaEtapas`, model criado
    antes deste na mesma sessão, ainda ligado a este por código bruto
    `cod_req_produto` até este model existir — ver abaixo a FK própria
    acrescentada retroativamente).

    Reconhece a estrutura completa da tabela REQUISICAOPRODUTO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB). Os 12 campos originais foram
    conferidos contra o cache de metadados do schema Firebird do GENUS
    (RDB$RELATION_FIELDS, scratchpad/genus_full_schema.json e
    scratchpad/all_tables_schema_out.txt, coletados em sessão anterior deste
    mesmo agente de reconhecimento de estrutura) — isql não estava acessível
    ao vivo nesta sessão (nem o arquivo GENUS_ZANGUETTIN.FDB foi localizado
    no disco desta máquina), então a verificação foi feita inteiramente
    contra esse cache já validado, sem inventar nenhum tipo e sem ler
    nenhuma linha de dado de negócio:
    - CODIGO/CODREQUISICAO/CODEMPRESA/CODFUNCIONARIO: INTEGER puro
      (RDB$FIELD_TYPE 8, sub_type 0) -> Integer.
    - CODPRODUTO: VARCHAR(15) (RDB$FIELD_TYPE 37) -> String(15), mesmo
      critério já usado para todo CODPRODUTO string deste ERP (ex.:
      `CotacaoItens.cod_produto`, `CotacaoProduto.cod_produto`).
    - QTDE/QTDEPRODUZIDA: NUMERIC armazenado como BIGINT com escala negativa
      (RDB$FIELD_TYPE 16, sub_type 1, precision 10, scale -4) -> Float.
    - DTENTRADA: DATE (RDB$FIELD_TYPE 12), nullable -> DateTime, mesmo
      critério já usado em `RequisicaoMateriaEtapas.dt_entrada` para esta
      mesma coluna em tabela irmã.
    - CUSTOTOTAL: NUMERIC/BIGINT escala -4, precision 15 -> Float, mesmo
      critério de `RequisicaoMateriaEtapas.custo_total`.
    - DIFERENCA: NUMERIC/BIGINT escala -4, precision 10 -> Float.
    - OBS: BLOB sub_type 1 (texto) -> Text, mesmo critério já usado para
      todo OBS "livre" deste grupo (ex.: `CompraGenus.obs`).
    - STATUS: VARCHAR(12) -> String(12), mesmo critério já usado em
      `RequisicaoMateria.status` (mais longo que o STATUS de um caractere
      só de `CotacaoPreco.status`).

    Todos os 12 campos batem exatamente com o tipo sugerido no pedido desta
    tarefa e com o cache já validado.

    Diferente de `RequisicaoMateria` (sem FK própria confirmada ao vivo
    nesta sessão), para REQUISICAOPRODUTO o índice de metadados coletado
    nesta mesma sessão (`gstat -r`, scratchpad/gstat_full.txt, sem ler
    conteúdo de linha) confirma quatro FKs reais, todas com nome de
    constraint explícito:
    - `FK_REQUISICAOPROD_EMPRESA`: CODEMPRESA -> EMPRESA.CODIGO. Mantido
      como código bruto (`cod_empresa`), sem FK própria — mesmo critério já
      usado para todo `cod_empresa` espalhado neste ERP (ex.:
      `RequisicaoMateria.cod_empresa`, `Fatura.cod_empresa`), mesmo quando a
      FK real é confirmada.
    - `FK_REQUISICAOPROD_FUNCIONARIO`: CODFUNCIONARIO -> FUNCIONARIO.CODIGO.
      Embora `Funcionario` já tenha model dedicado neste ERP, ele preserva
      apenas `CODCADASTRO` (`cod_cadastro`) como código bruto do GENUS, não
      o `CODIGO` próprio de GENUS.FUNCIONARIO — não há coluna própria para
      resolver esta FK contra `funcionarios.id` com segurança ainda.
      Mantido como código bruto (`cod_funcionario`), sem FK própria, mesmo
      critério de todo `cod_funcionario` já espalhado neste ERP.
    - `FK_REQUISICAOPROD_PRODUTO`: CODPRODUTO -> PRODUTO.CODIGO. `Produto`
      já tem model dedicado com `codigo` (String(20)) preservando o CODIGO
      original do GENUS — por isso, exatamente como em
      `CotacaoProduto.produto_id`/`CotacaoItens.produto_id`, esta FK ganha
      resolução própria (`produto_id`, ForeignKey para `produtos.id`),
      opcional (nullable), com o código bruto original preservado à parte
      (`cod_produto`) para o agente de migração de dados popular
      `produto_id` a partir do match `cod_produto == Produto.codigo`.
    - `FK_REQUISICAOPROD_REQUISICAO`: CODREQUISICAO -> REQUISICAOMATERIA.CODIGO.
      `RequisicaoMateria` já tem model dedicado com `codigo` (Integer)
      preservando o CODIGO original do GENUS — por isso esta FK também
      ganha resolução própria (`requisicao_materia_id`, ForeignKey para
      `requisicoes_materia.id`), opcional (nullable), com o código bruto
      original preservado à parte (`cod_requisicao`) para o agente de
      migração de dados popular `requisicao_materia_id` a partir do match
      `cod_requisicao == RequisicaoMateria.codigo`.

    Como este model agora existe, a FK retroativa prevista na docstring de
    `RequisicaoMateriaEtapas` foi acrescentada: `requisicao_produto_id`
    (ForeignKey para `requisicoes_produto.id`), opcional, com
    `cod_req_produto` mantido como mirror bruto — mesmo precedente
    retroativo já usado em `Entrada`/`ItemEntrada.entrada_id` e em
    `CotacaoPreco`/`CotacaoItens.cotacao_preco_id`. Resolver esse código de
    fato (popular as FKs a partir dos códigos brutos) é tarefa do agente de
    migração de dados, não deste agente de estrutura.

    CODIGO é a chave primária própria e dedicada desta tabela no GENUS
    (`PK_REQUISICAOPRODUTO`). Seguindo o mesmo critério já usado em todas as
    demais tabelas GENUS reconhecidas neste ERP (nenhuma linha foi
    importada ainda), esse CODIGO não é reaproveitado como PK deste ERP — o
    `id` serial é a única chave própria deste model, e o código original é
    preservado à parte (`codigo`, indexado, nullable).

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela REQUISICAOPRODUTO foi lido no GENUS por este
    agente.
    """
    __tablename__ = "requisicoes_produto"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave bruta original (PK própria no GENUS: PK_REQUISICAOPRODUTO — ver docstring) ──
    codigo = Column(Integer, nullable=True, index=True)                     # GENUS: CODIGO (PK própria no GENUS — não reaproveitada como PK deste ERP)

    # ── Vínculo com o cabeçalho da requisição (ver RequisicaoMateria) ──────
    requisicao_materia_id = Column(Integer, ForeignKey("requisicoes_materia.id"), nullable=True, index=True)  # resolvido de GENUS: CODREQUISICAO -> REQUISICAOMATERIA.CODIGO — FK_REQUISICAOPROD_REQUISICAO
    cod_requisicao = Column(Integer, nullable=True, index=True)             # GENUS: CODREQUISICAO (FK_REQUISICAOPROD_REQUISICAO -> REQUISICAOMATERIA.CODIGO; mirror bruto — ver requisicao_materia_id acima para a FK própria)
    cod_empresa = Column(Integer, nullable=True, index=True)                # GENUS: CODEMPRESA (FK_REQUISICAOPROD_EMPRESA -> EMPRESA; código bruto, ver docstring)

    # ── Vínculo com o produto solicitado (ver Produto) ─────────────────────
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True, index=True)  # resolvido de GENUS: CODPRODUTO -> PRODUTO.CODIGO — FK_REQUISICAOPROD_PRODUTO
    cod_produto = Column(String(15), nullable=True, index=True)             # GENUS: CODPRODUTO (FK_REQUISICAOPROD_PRODUTO -> PRODUTO.CODIGO; mirror bruto — ver produto_id acima para a FK própria)

    # ── Quantidade solicitada / produzida ──────────────────────────────────
    qtde = Column(Float, nullable=True)                                     # GENUS: QTDE
    qtde_produzida = Column(Float, nullable=True)                           # GENUS: QTDEPRODUZIDA

    # ── Entrada / responsável / custo ───────────────────────────────────────
    dt_entrada = Column(DateTime, nullable=True)                            # GENUS: DTENTRADA
    cod_funcionario = Column(Integer, nullable=True, index=True)            # GENUS: CODFUNCIONARIO (FK_REQUISICAOPROD_FUNCIONARIO -> FUNCIONARIO; código bruto, ver docstring)
    custo_total = Column(Float, nullable=True)                              # GENUS: CUSTOTOTAL
    diferenca = Column(Float, nullable=True)                                # GENUS: DIFERENCA
    obs = Column(Text, nullable=True)                                       # GENUS: OBS
    status = Column(String(12), nullable=True, index=True)                 # GENUS: STATUS

    requisicao_materia = relationship("RequisicaoMateria", back_populates="itens")
    produto = relationship("Produto", back_populates="requisicao_produtos")
    etapas = relationship("RequisicaoMateriaEtapas", back_populates="requisicao_produto", cascade="all, delete-orphan")


class RequisicaoMateriaEtapas(Base):
    """Etapa (apontamento parcial) de um item de requisição de material —
    GENUS.REQUISICAOMATERIAETAPAS, módulo Compras (Tier 2) deste ERP,
    primeiro model do grupo GENUS REQUISICAOMATERIA* reconhecido neste ERP
    (antes de `REQUISICAOMATERIA`, cabeçalho, e `REQUISICAOPRODUTO`, item —
    ambas planejadas para esta mesma sessão, ainda sem model dedicado neste
    ERP no momento em que este model foi criado).

    Reconhece a estrutura completa da tabela REQUISICAOMATERIAETAPAS do
    sistema legado GENUS (GENUS_ZANGUETTIN.FDB). Os 5 campos originais
    foram conferidos contra o cache de metadados do schema Firebird do
    GENUS (RDB$RELATION_FIELDS, coletado via isql em sessão anterior deste
    mesmo agente de reconhecimento de estrutura — nenhuma linha de dado de
    negócio foi lida): CODIGO/CODREQPRODUTO são INTEGER puro NOT NULL
    (RDB$FIELD_TYPE 8, sub_type 0) -> Integer; QTDE é NUMERIC armazenado
    como BIGINT com escala negativa (RDB$FIELD_TYPE 16, sub_type 1,
    precision 10, scale -4) NOT NULL -> Float; DTENTRADA é DATE (RDB$FIELD_TYPE
    12), nullable -> DateTime, mesmo critério já usado em
    `Entrada.emissao`/`CompraGenus.emissao` para DATE (não apenas TIMESTAMP)
    -> DateTime; CUSTOTOTAL é NUMERIC armazenado como BIGINT com escala
    negativa (RDB$FIELD_TYPE 16, sub_type 1, precision 15, scale -4),
    nullable -> Float — exatamente os tipos já sugeridos para esta tabela.

    A tabela é minúscula na base viva do GENUS (3 registros, confirmado via
    `gstat -r`, sem ler o conteúdo das linhas) mas sua estrutura de índices
    já revela o papel real: existe um índice próprio `FK_REQETAPA_REQPROD`
    (nome que abrevia REQ(uisicao)ETAPA(s) -> REQ(uisicao)PROD(uto), mesma
    convenção de abreviação de nome de constraint já vista em
    `FK_COMPRAS_FUNCIONARIO`/`FK_COTACAOITENS_PRODUTO`) sobre CODREQPRODUTO,
    com `total dup: 2, max dup: 2` — ou seja, mais de uma linha desta tabela
    compartilha o mesmo CODREQPRODUTO, confirmando (não apenas por
    convenção de nome de coluna) que REQUISICAOMATERIAETAPAS é tabela
    "filha" de REQUISICAOPRODUTO (item de uma requisição de material: produto,
    quantidade solicitada/QTDEPRODUZIDA, DTENTRADA e CUSTOTOTAL "resumo" —
    tabela ainda sem model dedicado neste ERP): cada registro aqui representa
    uma etapa/apontamento parcial (uma entrega, produção ou lote lançado em
    uma data específica, com sua própria quantidade e custo) que compõe o
    total acumulado do item de requisição correspondente — mesmo raciocínio
    de "detalhe que soma para o resumo do cabeçalho" já usado para
    `ItemCompra` em relação a `CompraGenus.total`.

    ATUALIZAÇÃO (mesma sessão, depois que `RequisicaoProduto`/
    GENUS.REQUISICAOPRODUTO ganhou model dedicado): a FK retroativa prevista
    no parágrafo acima foi acrescentada — `requisicao_produto_id`
    (ForeignKey para `requisicoes_produto.id`), opcional (nullable), com
    `cod_req_produto` mantido como mirror bruto ao lado dela, exatamente o
    mesmo precedente retroativo já estabelecido em `CompraGenus`/
    `ItemCompra.compra_id` e em `CotacaoPreco`/`CotacaoItens.cotacao_preco_id`.
    Resolver esse código de fato (popular `requisicao_produto_id` a partir
    do match `cod_req_produto == RequisicaoProduto.codigo`) é tarefa do
    agente de migração de dados, não deste agente de estrutura.

    CODIGO é a chave primária própria e dedicada desta tabela no GENUS
    (`PK_REQUISICAOMATERIAETAPAS`, índice de coluna única, sem duplicatas —
    diferente da chave composta já vista em `CotacaoItens`/`CotacaoProduto`).
    Mesmo assim, seguindo o mesmo critério já usado em todas as demais
    tabelas GENUS reconhecidas neste ERP (nenhuma linha foi importada ainda,
    dedup ficará a cargo do agente de migração de dados, como já feito em
    `CompraGenus.codigo`), esse CODIGO não é reaproveitado como PK deste
    ERP — o `id` serial é a única chave própria deste model, e o código
    original é preservado à parte (`codigo`, indexado, nullable).

    Nenhuma linha é importada por este model — apenas a estrutura. Nenhum
    dado de negócio da tabela REQUISICAOMATERIAETAPAS foi lido no GENUS por
    este agente.
    """
    __tablename__ = "requisicao_materia_etapas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Identificação / chave bruta original (PK própria no GENUS: PK_REQUISICAOMATERIAETAPAS — ver docstring) ──
    codigo = Column(Integer, nullable=True, index=True)                     # GENUS: CODIGO (PK própria no GENUS — não reaproveitada como PK deste ERP)

    # ── Vínculo com o item de requisição (ver RequisicaoProduto, FK acrescentada retroativamente — ver docstring) ──
    requisicao_produto_id = Column(Integer, ForeignKey("requisicoes_produto.id"), nullable=True, index=True)  # resolvido de GENUS: CODREQPRODUTO -> REQUISICAOPRODUTO.CODIGO — FK_REQETAPA_REQPROD
    cod_req_produto = Column(Integer, nullable=True, index=True)            # GENUS: CODREQPRODUTO (FK_REQETAPA_REQPROD -> REQUISICAOPRODUTO.CODIGO; mirror bruto — ver requisicao_produto_id acima para a FK própria)

    # ── Dados da etapa/apontamento parcial ────────────────────────────────
    qtde = Column(Float, nullable=True)                                     # GENUS: QTDE
    dt_entrada = Column(DateTime, nullable=True)                            # GENUS: DTENTRADA
    custo_total = Column(Float, nullable=True)                              # GENUS: CUSTOTOTAL

    requisicao_produto = relationship("RequisicaoProduto", back_populates="etapas")


class Iva(Base):
    """Índice de Valor Agregado (IVA) por Classificação Fiscal x Estado —
    tabela mestre IVA do sistema legado GENUS (GENUS_ZANGUETTIN.FDB),
    módulo Fiscal (Tier 2).

    Reconhece a estrutura completa da tabela IVA, seguindo o mesmo
    precedente estabelecido para `Classificacao`/GENUS.CLASSIFICACAO,
    `Regra`/GENUS.REGRAS, `Marca`/GENUS.MARCA, `CadastroCbenef`/
    GENUS.CADASTROCBENEF, `Cfop`/GENUS.CFOP, `CClassTrib`/GENUS.CCLASSTRIB
    e `CstIbsCbs`/GENUS.CST_IBS_CBS. Nomes e tipos vêm do cache de metadados
    do schema Firebird do GENUS desta sessão (`scratchpad/genus_full_schema.json`,
    obtido via `isql` contra RDB$RELATION_FIELDS em sessão anterior deste
    mesmo agente de reconhecimento de estrutura; `isql` não disponível neste
    ambiente para nova conferência ao vivo), sem ler nenhuma linha de dado
    de negócio:
    - CODCLASSIFICACAO: INTEGER -> `cod_classificacao` (parte da chave
      composta original no GENUS — código da classificação fiscal/NCM, o
      mesmo valor bruto já reconhecido como `Classificacao.codigo` /
      `Produto.cod_classificacao` neste ERP)
    - ESTADO: VARCHAR(2) -> `estado` (parte da chave composta original no
      GENUS — sigla da UF de destino, mesmo domínio de
      `RegraEstado.cod_estado`)
    - IVA: NUMERIC -> Float -> `iva` (percentual do Índice de Valor
      Agregado aplicável a esta combinação classificação/estado, usado no
      cálculo da base de cálculo do ICMS-ST — é este mesmo conceito que
      aparece já calculado/aplicado por item, como valor bruto, nos campos
      `iva`/`iva_reajusta` de `ItemEntrada`, `Entrada`, `Saida` e
      `ItemPedidoLan`/`ItemSaida` já reconhecidos neste ERP; ver também
      `RegraEstado.desconto_iva`, percentual de desconto aplicado sobre
      este IVA)

    GENUS.IVA é uma tabela auxiliar MESTRE solta (tabela de "de-para"
    classificação fiscal x estado -> percentual de IVA), com chave composta
    original (CODCLASSIFICACAO, ESTADO) no GENUS — não uma chave simples de
    coluna única como `Cfop.codigo`/`CClassTrib.cclasstrib`/`CstIbsCbs.cst`.
    Referenciada por várias outras tabelas apenas via o valor bruto já
    calculado do IVA (float, não FK declarada nesta atualização estrutural)
    — mesmo critério já usado para `Classificacao`/`Regra`/`Marca`/
    `CadastroCbenef`/`Cfop`/`CClassTrib`/`CstIbsCbs`. Por isso este model
    não ganha relação SQLAlchemy com `ItemEntrada`, `Entrada`, `Saida` etc.;
    resolver `cod_classificacao`/`estado` contra `Classificacao.codigo` e
    a UF de destino de cada operação é tarefa do agente de migração de
    dados, fora do escopo desta atualização estrutural. No frontend, ganha
    entrada própria em `TabelasAuxiliaresWindow`, no mesmo padrão de
    `Classificacao`/`Regra`/`Marca`/`TipoVenda`/`Historico`/
    `CadastroCbenef`/`Cfop`/`CClassTrib`/`CstIbsCbs`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "ivas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.IVA (chave composta original: CODCLASSIFICACAO + ESTADO) ──
    cod_classificacao = Column(Integer, nullable=True, index=True)   # GENUS: CODCLASSIFICACAO (parte da PK composta original — ver Classificacao.codigo/Produto.cod_classificacao)
    estado = Column(String(2), nullable=True, index=True)            # GENUS: ESTADO (parte da PK composta original — UF, ver RegraEstado.cod_estado)
    iva = Column(Float, nullable=True)                                # GENUS: IVA (percentual do Índice de Valor Agregado usado no cálculo do ICMS-ST)


class Cidade(Base):
    """Tabela mestre de Cidades — tabela CIDADE do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela CIDADE, seguindo o mesmo
    precedente estabelecido para `Classificacao`/GENUS.CLASSIFICACAO,
    `Regra`/GENUS.REGRAS, `Marca`/GENUS.MARCA, `CadastroCbenef`/
    GENUS.CADASTROCBENEF, `Cfop`/GENUS.CFOP, `CClassTrib`/GENUS.CCLASSTRIB,
    `CstIbsCbs`/GENUS.CST_IBS_CBS e `Iva`/GENUS.IVA. Nomes e tipos vêm de
    consulta ao vivo de metadados do Firebird nesta sessão (`isql` contra
    RDB$RELATION_FIELDS/RDB$RELATION_CONSTRAINTS em
    `GENUS_ZANGUETTIN.FDB`), sem ler nenhuma linha de dado de negócio:
    - CODIGO: INTEGER, NOT NULL, PK (PK_CIDADE) -> `codigo`
    - NOME: VARCHAR(40), NOT NULL -> `nome`
    - CODESTADO: CHAR(2), NOT NULL, FK_CIDADE_ESTADO -> `cod_estado` (sigla
      da UF — mesmo domínio de `RegraEstado.cod_estado`/`Iva.estado`; a
      tabela ESTADO do GENUS ainda não tem model dedicado neste ERP, então
      fica como código bruto)
    - QTDE_HABITANTE: INTEGER -> `qtde_habitante`
    - CEP: CHAR(10) -> `cep`
    - IBGE: VARCHAR(7) -> `ibge` (código do município no IBGE)
    - CODPAIS: INTEGER, FK_CIDADE_PAIS -> `cod_pais` (código bruto do país;
      tabela PAIS do GENUS ainda não tem model dedicado neste ERP)
    - QTDEPONTOS: INTEGER -> `qtde_pontos`
    - OBS: BLOB subtype TEXT -> `observacao`
    - META: INTEGER -> `meta`

    GENUS.CIDADE é uma tabela auxiliar MESTRE solta (catálogo de cidades),
    referenciada por várias outras tabelas via o código bruto da cidade
    (`CODCIDADE`/variantes, não FK declarada nesta atualização estrutural)
    — mesmo critério já usado para `Classificacao`/`Regra`/`Marca`/
    `CadastroCbenef`/`Cfop`/`CClassTrib`/`CstIbsCbs`/`Iva`. Já reconhecido
    neste ERP como valor bruto em `Empresa.cod_cidade`,
    `CadastroPessoa.cod_cidade`, `ClienteCompleto.cob_cod_cidade` e
    `Orcamento.cli_cod_cidade` (snapshot histórico) — nenhum desses campos
    ganha FK própria aqui; resolver esses códigos contra `Cidade.codigo` é
    tarefa do agente de migração de dados, fora do escopo desta atualização
    estrutural. Note também que a identidade "completa" de uma pessoa/
    empresa no GENUS normalmente vem de CADASTRO (ver `Cadastro`/
    `CadastroPessoa`), que por sua vez referencia CIDADE por CODCIDADE —
    ou seja, resolver o endereço legível de um cadastro exige o join
    CADASTRO -> CIDADE (por CODCIDADE) -> ESTADO (por CODESTADO), não só
    este model isolado.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Classificacao`/`Regra`/`Marca`/`TipoVenda`/
    `Historico`/`CadastroCbenef`/`Cfop`/`CClassTrib`/`CstIbsCbs`/`Iva`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cidades"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CIDADE ───────────────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)   # GENUS: CODIGO (PK_CIDADE original no GENUS — não reaproveitada como PK deste ERP; ver Empresa.cod_cidade/CadastroPessoa.cod_cidade/ClienteCompleto.cob_cod_cidade/Orcamento.cli_cod_cidade)
    nome = Column(String(40), nullable=True)                           # GENUS: NOME
    cod_estado = Column(String(2), nullable=True, index=True)          # GENUS: CODESTADO (FK_CIDADE_ESTADO -> ESTADO.CODESTADO — tabela ainda sem model dedicado; mesmo domínio de RegraEstado.cod_estado/Iva.estado)
    qtde_habitante = Column(Integer, nullable=True)                    # GENUS: QTDE_HABITANTE
    cep = Column(String(10), nullable=True)                            # GENUS: CEP
    ibge = Column(String(7), nullable=True)                            # GENUS: IBGE
    cod_pais = Column(Integer, nullable=True, index=True)               # GENUS: CODPAIS (FK_CIDADE_PAIS -> PAIS.CODPAIS — tabela ainda sem model dedicado)
    qtde_pontos = Column(Integer, nullable=True)                        # GENUS: QTDEPONTOS
    observacao = Column(Text, nullable=True)                           # GENUS: OBS
    meta = Column(Integer, nullable=True)                              # GENUS: META


class Pais(Base):
    """Tabela mestre de Países — tabela PAIS do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela PAIS, seguindo o mesmo
    precedente estabelecido para `Cidade`/GENUS.CIDADE (que referencia esta
    tabela via `Cidade.cod_pais`, código bruto). Nomes e tipos vêm do
    snapshot de metadados do Firebird já obtido nesta sessão (cache
    `genus_full_schema.json`, gerado por consulta a
    RDB$RELATION_FIELDS/RDB$RELATION_CONSTRAINTS em `GENUS_ZANGUETTIN.FDB`,
    sem ler nenhuma linha de dado de negócio) — a tabela é bem simples,
    apenas duas colunas:
    - CODIGO: INTEGER, PK (padrão PK_PAIS, mesmo critério de PK_CIDADE) ->
      `codigo`
    - NOME: VARCHAR(50) -> `nome`

    GENUS.PAIS é uma tabela auxiliar MESTRE solta (catálogo de países),
    referenciada apenas por código bruto — hoje já reconhecido neste ERP em
    `Cidade.cod_pais` (GENUS.CIDADE.CODPAIS, FK_CIDADE_PAIS). Nenhum FK
    própria é criada aqui; resolver `Cidade.cod_pais` contra `Pais.codigo`
    é tarefa do agente de migração de dados, fora do escopo desta
    atualização estrutural.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Cidade`/`Cfop`/`CClassTrib`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "paises"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.PAIS ─────────────────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)   # GENUS: CODIGO (PK_PAIS original no GENUS — não reaproveitada como PK deste ERP; ver Cidade.cod_pais)
    nome = Column(String(50), nullable=True)                           # GENUS: NOME


class Mensagem(Base):
    """Tabela mestre de Mensagens — tabela MENSAGEM do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela MENSAGEM, seguindo o mesmo
    precedente estabelecido para `Cidade`/GENUS.CIDADE e `Pais`/GENUS.PAIS.
    Nomes e tipos vêm do snapshot de metadados do Firebird já obtido nesta
    sessão (cache `genus_full_schema.json`, gerado por consulta a
    RDB$RELATION_FIELDS/RDB$RELATION_CONSTRAINTS em `GENUS_ZANGUETTIN.FDB`,
    sem ler nenhuma linha de dado de negócio), conferido também contra a
    lista de colunas já fornecida para esta tarefa:
    - CODIGO: INTEGER -> `codigo` (PK original no GENUS)
    - CODORIGEM: INTEGER -> `cod_origem` (código bruto da empresa/cadastro
      de origem da mensagem)
    - CODDESTINO: INTEGER -> `cod_destino` (código bruto da empresa/cadastro
      de destino da mensagem)
    - USUARIOORIGEM: INTEGER -> `usuario_origem` (código bruto do usuário
      GENUS remetente — GENUS.USUARIO ainda não tem model dedicado neste
      ERP; não confundir com `Usuario`, a tabela de autenticação própria
      deste ERP, que não compartilha os códigos do GENUS)
    - USUARIODESTINO: INTEGER -> `usuario_destino` (código bruto do usuário
      GENUS destinatário, mesma ressalva de `usuario_origem`)
    - TITULO: VARCHAR(20) -> `titulo`
    - OBS: BLOB subtype TEXT -> `observacao` (corpo/texto da mensagem)
    - CHAVE: VARCHAR(25) -> `chave` (chave livre, ex.: liga a mensagem a um
      registro de outra tabela/tela do GENUS — sem FK declarada)
    - DIA: TIMESTAMP -> `dia` (data/hora da mensagem)

    GENUS.MENSAGEM é uma tabela auxiliar MESTRE solta (mensagens internas
    entre usuários/empresas do GENUS — ex.: avisos/memorandos trocados
    dentro do sistema), sem CODCADASTRO — não exige JOIN com CADASTRO para
    ficar completa (diferente de CentroCusto/ClienteCompleto/Fornecedor/
    Transportadora/Representante/Funcionario). Nenhuma FK própria é criada
    aqui para `cod_origem`/`cod_destino`/`usuario_origem`/`usuario_destino`;
    resolver esses códigos brutos é tarefa do agente de migração de dados,
    fora do escopo desta atualização estrutural.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Cidade`/`Pais`/`Cfop`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "mensagens"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.MENSAGEM ─────────────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)   # GENUS: CODIGO (PK original no GENUS — não reaproveitada como PK deste ERP)
    cod_origem = Column(Integer, nullable=True, index=True)            # GENUS: CODORIGEM (código bruto de empresa/cadastro de origem)
    cod_destino = Column(Integer, nullable=True, index=True)           # GENUS: CODDESTINO (código bruto de empresa/cadastro de destino)
    usuario_origem = Column(Integer, nullable=True, index=True)        # GENUS: USUARIOORIGEM (código bruto do usuário GENUS remetente — GENUS.USUARIO ainda sem model dedicado)
    usuario_destino = Column(Integer, nullable=True, index=True)       # GENUS: USUARIODESTINO (código bruto do usuário GENUS destinatário)
    titulo = Column(String(20), nullable=True)                         # GENUS: TITULO
    observacao = Column(Text, nullable=True)                           # GENUS: OBS
    chave = Column(String(25), nullable=True)                          # GENUS: CHAVE
    dia = Column(DateTime, nullable=True)                              # GENUS: DIA


class Estado(Base):
    """Tabela mestre de Estados/UF — tabela ESTADO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela ESTADO, seguindo o mesmo
    precedente estabelecido para `Cidade`/GENUS.CIDADE, `Pais`/GENUS.PAIS
    e `Mensagem`/GENUS.MENSAGEM. Nomes e tipos vêm de consulta ao vivo de
    metadados do Firebird nesta sessão (`isql` contra RDB$RELATION_FIELDS/
    RDB$RELATION_CONSTRAINTS em `GENUS_ZANGUETTIN.FDB`), sem ler nenhuma
    linha de dado de negócio:
    - SIGLA: CHAR(2), NOT NULL, PK (PK_ESTADO) -> `sigla` (sigla da UF, ex.
      "SP", "RJ" — mesmo domínio já reconhecido em `Cidade.cod_estado`,
      `RegraEstado.cod_estado` e `Iva.estado`)
    - NOME: VARCHAR(20), NOT NULL -> `nome`
    - ICMS: NUMERIC(7,3) (armazenado como FLOAT/SUB_TYPE 1 no Firebird) ->
      `icms` (alíquota padrão de ICMS do estado)
    - PERCOMISSAO: NUMERIC(9,3) -> `perc_comissao` (percentual de comissão
      padrão associado ao estado)

    Um model chamado `RegraEstado` já existe neste arquivo, mas reconhece
    uma tabela GENUS diferente (REGRASESTADO, regra fiscal por estado+CFOP)
    — sem relação direta de herança com esta tabela ESTADO, apesar de
    `RegraEstado.cod_estado` apontar para `Estado.sigla` como código bruto
    (FK_REGRASESTADO_ESTADO no GENUS). Por isso a classe aqui se chama
    `Estado`, e não `RegraEstado`, para não colidir.

    GENUS.ESTADO é uma tabela auxiliar MESTRE solta (catálogo de UFs),
    referenciada por várias outras tabelas via o código bruto da sigla
    (`CODESTADO`/`ESTADO`, não FK declarada nesta atualização estrutural)
    — mesmo critério já usado para `Cidade`/`Pais`/`Mensagem`. Já
    reconhecido neste ERP como valor bruto em `Cidade.cod_estado`,
    `RegraEstado.cod_estado` e `Iva.estado` — nenhum desses campos ganha FK
    própria aqui; resolver esses códigos contra `Estado.sigla` é tarefa do
    agente de migração de dados, fora do escopo desta atualização
    estrutural.

    Diferente de CADASTRO/CIDADE (que exigem join para resolver identidade
    completa de pessoa/endereço), ESTADO não tem CODCADASTRO nem depende de
    outra tabela GENUS para estar completa — é uma tabela solta e simples.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Cidade`/`Pais`/`Mensagem`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "estados"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.ESTADO (PK original no GENUS: SIGLA) ─────
    sigla = Column(String(2), nullable=True, unique=True, index=True)   # GENUS: SIGLA (PK_ESTADO original no GENUS — não reaproveitada como PK deste ERP; ver Cidade.cod_estado/RegraEstado.cod_estado/Iva.estado)
    nome = Column(String(20), nullable=True)                           # GENUS: NOME
    icms = Column(Float, nullable=True)                                # GENUS: ICMS (alíquota padrão de ICMS do estado)
    perc_comissao = Column(Float, nullable=True)                       # GENUS: PERCOMISSAO


class PadraoConsulta(Base):
    """Padrões de consulta (layout de grade salvo por usuário) — tabela
    PADRAOCONSULTA do sistema legado GENUS (GENUS_ZANGUETTIN.FDB), módulo
    Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela PADRAOCONSULTA, seguindo o
    mesmo precedente estabelecido para `Cidade`/`Pais`/`Mensagem`/`Estado`
    (tabelas mestre soltas do módulo Sistema/Config). Nomes e tipos vêm da
    lista de colunas fornecida para esta tarefa (não foi possível consultar
    `isql` ao vivo nem havia cache de metadados desta tabela específica
    salvo em sessão anterior — `isql`/`isql-fb` não estão disponíveis neste
    ambiente; nenhuma linha de dado de negócio foi lida em nenhum momento):
    - CODIGO: INTEGER -> `codigo` (PK original no GENUS)
    - CODEMPRESA: INTEGER -> `cod_empresa` (código bruto da empresa —
      GENUS.EMPRESA, já reconhecida neste ERP como `Empresa`, mas sem FK
      própria criada aqui, mesmo critério de `Mensagem.cod_origem`/
      `TabelaPreco.cod_empresa`)
    - TCONSULTA: VARCHAR(100) -> `tipo_consulta` (identifica a tela/consulta
      a que este padrão se aplica — ex.: nome da tela de listagem no GENUS
      cujo layout de grade foi customizado)
    - CHECKBOX: VARCHAR(50) -> `checkbox` (flags/estado de checkboxes de
      configuração da consulta — formato bruto do GENUS, string livre)
    - ORDEM: VARCHAR(500) -> `ordem` (ordem das colunas da grade, string
      longa — ex.: lista/sequência serializada de índices ou nomes de
      coluna)
    - CODFUNCIONARIO: INTEGER -> `cod_funcionario` (código bruto do
      funcionário dono deste padrão de consulta — GENUS.FUNCIONARIO, já
      reconhecida neste ERP como `Funcionario`, mas sem FK própria criada
      aqui, mesmo critério de `Mensagem.usuario_origem`)
    - COLUNA: VARCHAR(500) -> `coluna` (definição das colunas visíveis da
      grade, string longa — ex.: lista/serialização dos nomes/larguras das
      colunas exibidas)

    GENUS.PADRAOCONSULTA é uma tabela auxiliar MESTRE solta (preferência de
    interface por funcionário — não é uma entidade de negócio como
    cliente/produto/pedido), sem CODCADASTRO — não exige JOIN com CADASTRO
    para ficar completa (mesmo critério de `Mensagem`/`Estado`). Não é
    criada nenhuma FK própria para `cod_empresa`/`cod_funcionario`; resolver
    esses códigos brutos contra `Empresa`/`Funcionario` é tarefa do agente
    de migração de dados, fora do escopo desta atualização estrutural.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Cidade`/`Pais`/`Mensagem`/`Estado`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "padroes_consulta"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.PADRAOCONSULTA ───────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)   # GENUS: CODIGO (PK original no GENUS — não reaproveitada como PK deste ERP)
    cod_empresa = Column(Integer, nullable=True, index=True)           # GENUS: CODEMPRESA (código bruto de Empresa — sem FK própria)
    tipo_consulta = Column(String(100), nullable=True, index=True)     # GENUS: TCONSULTA
    checkbox = Column(String(50), nullable=True)                       # GENUS: CHECKBOX
    ordem = Column(String(500), nullable=True)                         # GENUS: ORDEM
    cod_funcionario = Column(Integer, nullable=True, index=True)       # GENUS: CODFUNCIONARIO (código bruto de Funcionario — sem FK própria)
    coluna = Column(String(500), nullable=True)                        # GENUS: COLUNA


class Configuracao(Base):
    """Configurações gerais do sistema — tabela CONFIGURACAO do sistema
    legado GENUS (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela CONFIGURACAO, seguindo o mesmo
    precedente estabelecido para `Cidade`/`Pais`/`Mensagem`/`Estado`/
    `PadraoConsulta` (tabelas mestre soltas do módulo Sistema/Config). Não
    foi possível consultar `isql`/`isql-fb` ao vivo neste ambiente (não
    instalado) nem havia cache de metadados desta tabela salvo em sessão
    anterior — os nomes e tipos abaixo vêm da lista de colunas fornecida
    para esta tarefa (inferida a partir dos códigos de tipo interno do
    Firebird); nenhuma linha de dado de negócio foi lida em nenhum momento.

    GENUS.CONFIGURACAO é, pelo desenho da tabela (nenhuma coluna
    CODEMPRESA/CODCADASTRO presente na lista de campos fornecida, e CODIGO
    de apenas 1 caractere), muito provavelmente uma tabela de parâmetros
    globais do sistema com uma única linha (ou pouquíssimas linhas,
    identificadas por `codigo`) — não uma entidade de negócio com múltiplos
    registros por natureza como Cliente/Produto/Pedido. Mesmo assim, o
    controller/frontend expõem CRUD genérico (mesmo padrão de
    `Estado`/`PadraoConsulta`), já que a cardinalidade real (1 linha global
    x 1 linha por empresa) só pode ser confirmada durante a migração de
    dados — fora do escopo desta atualização estrutural.

    A grande maioria dos campos é um flag CHAR(1) (tipicamente S/N no
    GENUS) que liga/desliga um comportamento do sistema (ex.: `producao`,
    `nf_eletronica`, `balanca`, `agregado`, `grade`, `tablet`) — cada um
    documentado abaixo com seu nome de coluna original em GENUS via
    comentário `# GENUS: COLNAME`.

    GENUS.CONFIGURACAO não tem CODCADASTRO nem depende de outra tabela
    GENUS para estar completa (mesmo critério de `Estado`/`PadraoConsulta`)
    — não há junção com CADASTRO a documentar aqui.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Cidade`/`Pais`/`Mensagem`/`Estado`/`PadraoConsulta`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "configuracoes"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CONFIGURACAO ─────────────────────────────
    codigo = Column(String(1), nullable=True, index=True)                        # GENUS: CODIGO (PK original no GENUS — não reaproveitada como PK deste ERP)
    versao = Column(Integer, nullable=True)                                      # GENUS: VERSAO
    dh = Column(String(15), nullable=True)                                       # GENUS: DH
    dc = Column(String(15), nullable=True)                                       # GENUS: DC
    estoque_cliente = Column(String(1), nullable=True)                           # GENUS: ESTOQUECLI
    frete = Column(String(1), nullable=True)                                     # GENUS: FRETE
    dias_atraso = Column(Integer, nullable=True)                                 # GENUS: DIASATRASO
    producao = Column(String(1), nullable=True)                                  # GENUS: PRODUCAO
    nf_eletronica = Column(String(1), nullable=True)                             # GENUS: NFELETRONICA
    imagem = Column(Text, nullable=True)                                         # GENUS: IMAGEM
    lote_produto = Column(String(1), nullable=True)                              # GENUS: LOTEPRODUTO
    preco_minimo = Column(String(1), nullable=True)                              # GENUS: PRECOMINIMO
    pedido_mat = Column(String(1), nullable=True)                                # GENUS: PEDIDOMAT
    orcamento_mat = Column(String(1), nullable=True)                             # GENUS: ORCAMENTOMAT
    recibo_mat = Column(String(1), nullable=True)                                # GENUS: RECIBOMAT
    prevenda_mat = Column(String(1), nullable=True)                              # GENUS: PREVENDAMAT
    duplicata_mat = Column(String(1), nullable=True)                             # GENUS: DUPLICATAMAT
    fatura_mat = Column(String(1), nullable=True)                                # GENUS: FATURAMAT
    colunas_mat = Column(Integer, nullable=True)                                 # GENUS: COLUNASMAT
    carne_mat = Column(String(1), nullable=True)                                 # GENUS: CARNEMAT
    copia_cupom = Column(String(1), nullable=True)                               # GENUS: COPIACUPOM
    banco_origem = Column(String(100), nullable=True)                            # GENUS: BANCOORIGEM
    banco_destino = Column(String(100), nullable=True)                           # GENUS: BANCODESTINO
    conexao_destino = Column(String(100), nullable=True)                        # GENUS: CONEXAODESTINO
    balanca = Column(String(1), nullable=True)                                   # GENUS: BALANCA
    validade_orcamento = Column(Integer, nullable=True)                          # GENUS: VALIDADEORCAMENTO
    agregado = Column(String(1), nullable=True)                                  # GENUS: AGREGADO
    volume = Column(String(1), nullable=True)                                    # GENUS: VOLUME
    fatura_pedido = Column(String(1), nullable=True)                             # GENUS: FATURAPEDIDO
    controle = Column(String(1), nullable=True)                                  # GENUS: CONTROLE
    calcula_custo = Column(String(1), nullable=True)                             # GENUS: CALCULACUSTO
    estoque_negativo = Column(String(1), nullable=True)                          # GENUS: ESTQNEGATIVO
    producao_receita = Column(String(1), nullable=True)                          # GENUS: PRODUCAORECEITA
    status_func = Column(String(1), nullable=True)                               # GENUS: STATUSFUNC
    tablet = Column(String(1), nullable=True)                                    # GENUS: TABLET
    holerite = Column(String(1), nullable=True)                                  # GENUS: HOLERITE
    custo_producao = Column(String(1), nullable=True)                            # GENUS: CUSTOPRODUCAO
    locacao = Column(String(1), nullable=True)                                   # GENUS: LOCACAO
    manutencao = Column(String(1), nullable=True)                                # GENUS: MANUTENCAO
    producao_etapas = Column(String(1), nullable=True)                           # GENUS: PRODUCAOETAPAS
    custo_medio_producao = Column(String(1), nullable=True)                      # GENUS: CUSTOMEDIOPRODUCAO
    estoque_pre_pedido = Column(String(1), nullable=True)                        # GENUS: ESTOQUEPREPEDIDO
    checar_mensagem = Column(String(1), nullable=True)                           # GENUS: CHECARMENSAGEM
    grade = Column(String(1), nullable=True)                                     # GENUS: GRADE
    empresa_nao_fiscal = Column(String(1), nullable=True)                        # GENUS: EMPRESANAOFISCAL
    icms_mensagem = Column(String(1), nullable=True)                             # GENUS: ICMSMENSAGEM
    cadastrar_importar_xml = Column(String(1), nullable=True)                    # GENUS: CADASTRARIMPORTARXML
    desconto_acumulativo = Column(String(1), nullable=True)                      # GENUS: DESCONTOACUMULATIVO
    data_envio_arquivos_contador = Column(DateTime, nullable=True)               # GENUS: DATAENVIOARQUIVOSCONTADOR
    logo_impressao_pedido = Column(String(1), nullable=True)                     # GENUS: LOGOIMPRESSAOPEDIDO
    logo_impressao_pre_pedido = Column(String(1), nullable=True)                 # GENUS: LOGOIMPRESSAOPREPEDIDO
    mostra_lembrete_agenda = Column(String(1), nullable=True)                    # GENUS: MOSTRALEMBRETEAGENDA
    alterar_nota = Column(String(1), nullable=True)                              # GENUS: ALTERARNOTA
    cotacao_por_agregado = Column(String(1), nullable=True)                      # GENUS: COTACAOPORAGREGADO
    xml_automatico_contador = Column(String(1), nullable=True)                   # GENUS: XMLAUTOMATICOCONTADOR
    reduzir_icms_pis_cofins = Column(String(1), nullable=True)                   # GENUS: REDUZIRICMSPISCOFINS
    verificar_cst_reducao_icms = Column(String(1), nullable=True)                # GENUS: VERIFICARCSTREDUCAOICMS
    menu_batelada = Column(String(1), nullable=True)                             # GENUS: MENUBATELADA
    aprovar_pre_pedido = Column(String(1), nullable=True)                        # GENUS: APROVARPREPEDIDO
    producao_etapas_processo = Column(String(1), nullable=True)                  # GENUS: PRODUCAOETAPASPROCESSO
    atualizar_custo_por_composicao = Column(String(1), nullable=True)            # GENUS: ATUALIZARCUSTOPORCOMPOSICAO
    consulta_sem_espaco = Column(String(1), nullable=True)                       # GENUS: CONSULTASEMESPACO
    consulta_sem_espaco_palavra = Column(String(1), nullable=True)               # GENUS: CONSULTASEMESPACOPALAVRA
    ultima_consulta_produto = Column(String(1), nullable=True)                   # GENUS: ULTIMACONSULTAPRODUTO
    consulta_produto_completo = Column(String(1), nullable=True)                 # GENUS: CONSULTAPRODUTOCOMPLETO
    producao_cores = Column(String(1), nullable=True)                            # GENUS: PRODUCAOCORES
    estoque_reservado = Column(String(1), nullable=True)                         # GENUS: ESTOQUERESERVADO
    fechamento_producao = Column(String(1), nullable=True)                       # GENUS: FECHAMENTOPRODUCAO
    conferencia_fechamento_producao = Column(String(1), nullable=True)           # GENUS: CONFERENCIAFECHAMENTOPRODUCAO
    obrigar_preencher_dados_cliente = Column(String(1), nullable=True)           # GENUS: OBRIGARPREENCHERDADOSCLIENTE
    dias_pos_venda = Column(Integer, nullable=True)                              # GENUS: DIASPOSVENDA
    dias_manutencao = Column(Integer, nullable=True)                             # GENUS: DIASMANUTENCAO
    dias_recorrencia = Column(Integer, nullable=True)                            # GENUS: DIASRECORRENCIA
    data_prevista = Column(String(1), nullable=True)                            # GENUS: DATAPREVISTA
    nova_prospeccao = Column(String(1), nullable=True)                           # GENUS: NOVAPROSPECCAO
    enviar_email_automatico = Column(String(1), nullable=True)                   # GENUS: ENVIAREMAILAUTOMATICO
    vbloq_estoque_financeiro = Column(String(1), nullable=True)                  # GENUS: VBLOQESTOQUEFINANCEIRO
    enviar_email_status = Column(String(1), nullable=True)                       # GENUS: ENVIAREMAILSTATUS
    imagem_produto = Column(String(1), nullable=True)                            # GENUS: IMAGEMPRODUTO
    faturamento_parcial = Column(String(1), nullable=True)                       # GENUS: FATURAMENTOPARCIAL
    producao_manual = Column(String(1), nullable=True)                          # GENUS: PRODUCAOMANUAL
    perda_ganho_automatico = Column(String(1), nullable=True)                    # GENUS: PERDAGANHOAUTOMATICO
    confeccao = Column(String(1), nullable=True)                                # GENUS: CONFECCAO
    anexos_internos = Column(String(1), nullable=True)                          # GENUS: ANEXOSINTERNOS
    cad_cclasstrib_automatico = Column(String(1), nullable=True)                # GENUS: CADCCLASSTRIBAUTOMATICO


class Padrao(Base):
    """Padrões contábeis do sistema — tabela PADRAO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela PADRAO, seguindo o mesmo
    precedente estabelecido para `Estado`/`PadraoConsulta`/`Configuracao`
    (tabelas mestre soltas do módulo Sistema/Config). Nomes e tipos foram
    conferidos contra o cache de metadados do schema Firebird do GENUS
    (`genus_full_schema.json`, obtido em sessão anterior via consulta a
    RDB$RELATION_FIELDS — nenhuma linha de dado de negócio foi lida em
    nenhum momento); a lista de colunas fornecida para esta tarefa bate
    exatamente com esse cache:
    - CODIGO: INTEGER -> `codigo` (PK original no GENUS)
    - CAIXA: INTEGER -> `caixa` (código bruto da conta-caixa padrão —
      GENUS.CONTA, sem FK própria criada aqui)
    - RECEBER: VARCHAR(12) -> `historico_receber` (código do histórico
      contábil padrão usado em lançamentos de contas a receber — formato de
      código do plano de contas/histórico do GENUS, ex.: mesmo formato de
      `Historico.codigo`)
    - PAGAR: VARCHAR(12) -> `historico_pagar` (idem, para contas a pagar)
    - DESCONTO: VARCHAR(12) -> `historico_desconto` (histórico padrão para
      lançamento de desconto concedido)
    - ACRESCIMO: VARCHAR(12) -> `historico_acrescimo` (histórico padrão
      para lançamento de acréscimo/juros recebido)
    - CARTAO: VARCHAR(12) -> `historico_cartao` (histórico padrão para
      lançamento de recebimento via cartão)
    - DEPRECIACAO: VARCHAR(12) -> `historico_depreciacao` (histórico
      padrão para lançamento de depreciação de ativo)
    - HISTLANCCREDITO: VARCHAR(12) -> `historico_lancamento_credito`
      (histórico padrão de lançamento de crédito em conta corrente/cliente)
    - CARTRECEBER: INTEGER -> `cod_conta_cartao_receber` (código bruto da
      conta contábil de recebíveis de cartão — GENUS.CONTA, sem FK própria)
    - HISTCREDPARTDOBRADA: VARCHAR(12) -> `historico_credito_partida_dobrada`
      (histórico padrão do lado crédito da partida dobrada contábil)
    - HISTDEBPARTDOBRADA: VARCHAR(12) -> `historico_debito_partida_dobrada`
      (histórico padrão do lado débito da partida dobrada contábil)
    - HISTCREDCARTDESC: VARCHAR(12) -> `historico_credito_cartao_desconto`
      (histórico padrão de crédito referente a desconto de cartão/taxa da
      operadora)
    - HISTDEBCARTDESC: VARCHAR(12) -> `historico_debito_cartao_desconto`
      (idem, lado débito)
    - HISTLANCCREDITOFORN: VARCHAR(12) -> `historico_lancamento_credito_fornecedor`
      (histórico padrão de lançamento de crédito em conta corrente de
      fornecedor)
    - CONTALANCCREDITOFORN: INTEGER -> `cod_conta_lancamento_credito_fornecedor`
      (código bruto da conta contábil usada no lançamento de crédito de
      fornecedor — GENUS.CONTA, sem FK própria)
    - CONTALANCCREDITO: INTEGER -> `cod_conta_lancamento_credito` (idem,
      para o lançamento de crédito de cliente)

    GENUS.PADRAO é, pelo desenho da tabela (nenhuma coluna CODEMPRESA
    presente na lista de campos fornecida, e um único CODIGO), muito
    provavelmente uma tabela de parâmetros contábeis globais com uma única
    linha (armazena os históricos/contas contábeis padrão usados pelas
    rotinas automáticas de lançamento do módulo financeiro/contábil do
    GENUS — caixa padrão, contas de cartão a receber, históricos de
    desconto/acréscimo/depreciação/partida dobrada) — não uma entidade de
    negócio com múltiplos registros por natureza como Cliente/Produto/
    Pedido. Mesmo assim, o controller/frontend expõem CRUD genérico (mesmo
    padrão de `Estado`/`PadraoConsulta`/`Configuracao`), já que a
    cardinalidade real só pode ser confirmada durante a migração de dados —
    fora do escopo desta atualização estrutural.

    Os campos String(12) apontam para códigos de histórico contábil (mesmo
    formato de `Historico.codigo`, também VARCHAR(12) no GENUS) e os campos
    Integer apontam para códigos brutos de conta contábil (GENUS.CONTA, já
    reconhecida neste ERP como `ContaGenus`); nenhuma FK própria é criada
    para nenhum desses campos — resolver esses códigos brutos é tarefa do
    agente de migração de dados, fora do escopo desta atualização
    estrutural (mesmo critério de `Mensagem.cod_origem`/
    `TabelaPreco.cod_empresa`).

    GENUS.PADRAO não tem CODCADASTRO nem depende de CADASTRO para estar
    completa (mesmo critério de `Estado`/`PadraoConsulta`/`Configuracao`)
    — não há junção com CADASTRO a documentar aqui. Também é diferente de
    `PadraoConsulta` (GENUS.PADRAOCONSULTA, layout de grade por usuário) —
    tabelas distintas, sem relação entre si.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Estado`/`PadraoConsulta`/`Configuracao`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "padroes"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.PADRAO ───────────────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)                      # GENUS: CODIGO (PK original no GENUS — não reaproveitada como PK deste ERP)
    caixa = Column(Integer, nullable=True)                                                # GENUS: CAIXA (código bruto de conta — sem FK própria)
    historico_receber = Column(String(12), nullable=True)                                 # GENUS: RECEBER
    historico_pagar = Column(String(12), nullable=True)                                   # GENUS: PAGAR
    historico_desconto = Column(String(12), nullable=True)                                # GENUS: DESCONTO
    historico_acrescimo = Column(String(12), nullable=True)                               # GENUS: ACRESCIMO
    historico_cartao = Column(String(12), nullable=True)                                  # GENUS: CARTAO
    historico_depreciacao = Column(String(12), nullable=True)                              # GENUS: DEPRECIACAO
    historico_lancamento_credito = Column(String(12), nullable=True)                       # GENUS: HISTLANCCREDITO
    cod_conta_cartao_receber = Column(Integer, nullable=True)                              # GENUS: CARTRECEBER (código bruto de conta — sem FK própria)
    historico_credito_partida_dobrada = Column(String(12), nullable=True)                  # GENUS: HISTCREDPARTDOBRADA
    historico_debito_partida_dobrada = Column(String(12), nullable=True)                   # GENUS: HISTDEBPARTDOBRADA
    historico_credito_cartao_desconto = Column(String(12), nullable=True)                  # GENUS: HISTCREDCARTDESC
    historico_debito_cartao_desconto = Column(String(12), nullable=True)                   # GENUS: HISTDEBCARTDESC
    historico_lancamento_credito_fornecedor = Column(String(12), nullable=True)            # GENUS: HISTLANCCREDITOFORN
    cod_conta_lancamento_credito_fornecedor = Column(Integer, nullable=True)                # GENUS: CONTALANCCREDITOFORN (código bruto de conta — sem FK própria)
    cod_conta_lancamento_credito = Column(Integer, nullable=True)                           # GENUS: CONTALANCCREDITO (código bruto de conta — sem FK própria)


class Repositorio(Base):
    """Repositório de objetos/scripts do sistema — tabela REPOSITORIO do
    sistema legado GENUS (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config
    (Tier 2).

    Reconhece a estrutura completa da tabela REPOSITORIO, seguindo o mesmo
    precedente estabelecido para `Estado`/`PadraoConsulta`/`Configuracao`/
    `Padrao` (tabelas mestre soltas do módulo Sistema/Config). A estrutura
    (apenas 4 colunas: NOME, AQ, VERSAO, ATUALIZA) foi confirmada via cache
    de metadados salvo em sessão anterior deste mesmo projeto
    (`genus_full_schema.json`, obtido de consulta a RDB$RELATION_FIELDS/
    metadados do Firebird, não de dados de negócio) — `isql`/`isql-fb` não
    está instalado neste ambiente. O mesmo cache mostra a tabela com
    apenas 1 (uma) linha atualmente no GENUS de produção, e a categoriza
    como "Sistema / Config / Outros"; nenhuma linha de dado de negócio foi
    lida em nenhum momento por este model.

    Apesar do nome ("repositório"), a tabela NÃO é um repositório de
    anexos/fotos por CODCADASTRO/CODPRODUTO no estilo de `ClienteAnexo`/
    `ProdutoFoto` — não há nenhuma coluna de chave estrangeira para outra
    tabela GENUS (sem CODCADASTRO, CODEMPRESA ou CODPRODUTO na lista de
    campos), e a coluna identificadora é `NOME` (String(25), provável nome
    de um objeto/rotina do sistema), não um código numérico de entidade de
    negócio. Combinado com a baixíssima cardinalidade (1 linha) e as
    colunas `VERSAO`/`ATUALIZA`, o desenho é consistente com uma tabela de
    controle interno do próprio GENUS — um registro versionado de algum
    artefato/script/objeto do sistema (nome do objeto em `nome`, conteúdo
    ou referência textual em `aq`, número de versão em `versao`, timestamp
    da última atualização em `atualiza`) usado por rotinas de atualização
    automática do cliente GENUS, não uma entidade de negócio do ERP.

    `AQ` chega como BLOB SUB_TYPE TEXT no Firebird (mapeado aqui como
    `Text`, não `LargeBinary`) — é conteúdo textual (não imagem/binário),
    mesmo critério já usado para `Configuracao.imagem`/`Mensagem.texto`.

    GENUS.REPOSITORIO não tem CODCADASTRO nem depende de outra tabela
    GENUS para estar completa (mesmo critério de `Estado`/`PadraoConsulta`/
    `Configuracao`/`Padrao`) — não há junção com CADASTRO a documentar
    aqui.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Estado`/`PadraoConsulta`/`Configuracao`/`Padrao`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "repositorios"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.REPOSITORIO ──────────────────────────────
    nome = Column(String(25), nullable=True, index=True)     # GENUS: NOME (identificador do objeto/rotina — sem PK própria confirmada no GENUS)
    aq = Column(Text, nullable=True)                          # GENUS: AQ (BLOB SUB_TYPE TEXT — conteúdo/referência textual do objeto)
    versao = Column(Integer, nullable=True)                   # GENUS: VERSAO
    atualiza = Column(DateTime, nullable=True)                # GENUS: ATUALIZA


class Restricao(Base):
    """Restrição cadastral por CPF/CNPJ — tabela RESTRICAO do sistema legado
    GENUS (GENUS_ZANGUETTIN.FDB), módulo Sistema/Config (Tier 2).

    Reconhece a estrutura completa da tabela RESTRICAO, seguindo o mesmo
    precedente estabelecido para `Pais`/`Estado`/`Repositorio` (tabelas
    mestre soltas do módulo Sistema/Config). A estrutura (apenas 3 colunas:
    CPFCNPJ, NOME, MOTIVO) foi confirmada via cache de metadados salvo em
    sessão anterior deste mesmo projeto (`genus_full_schema.json`, obtido
    de consulta a RDB$RELATION_FIELDS/metadados do Firebird, não de dados
    de negócio) — `isql`/`isql-fb` não está instalado neste ambiente;
    nenhuma linha de dado de negócio foi lida em nenhum momento por este
    model.

    GENUS.RESTRICAO é a lista de "clientes/pessoas restritas" do GENUS
    (bloqueio de crédito / negativação tipo SPC-Serasa) — provavelmente
    consultada nas rotinas de venda/orçamento para impedir ou alertar sobre
    negociação com um CPF/CNPJ marcado aqui, com o motivo do bloqueio
    registrado em `MOTIVO` (ex.: "SPC", "cheque devolvido", "inadimplente").

    Diferente de outras tabelas do módulo (`Cliente*`/`CadastroPessoa`),
    RESTRICAO NÃO tem CODCADASTRO nem CODCLIENTE — a identificação da
    pessoa/empresa restrita é feita diretamente pelo documento (`CPFCNPJ`),
    não por FK para `CADASTRO`. Ou seja, é uma tabela auxiliar MESTRE solta,
    como `Pais`/`Estado`/`Repositorio` acima — não há junção com CADASTRO
    a documentar aqui. Quando a migração de dados (fora do escopo deste
    agente) for feita, o cruzamento com `ClienteCompleto`/`CadastroPessoa`
    para saber se um cliente específico está restrito deverá ser feito por
    comparação de `documento`/CPF-CNPJ, não por chave estrangeira.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Pais`/`Estado`/`Repositorio`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "restricoes"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.RESTRICAO ────────────────────────────────
    cpf_cnpj = Column(String(14), nullable=True, index=True)   # GENUS: CPFCNPJ
    nome = Column(String(40), nullable=True)                    # GENUS: NOME
    motivo = Column(String(50), nullable=True)                  # GENUS: MOTIVO


class Agenda(Base):
    """Compromisso/lembrete de agenda — tabela AGENDA do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo RH/Folha (Tier 2, apenas 1 linha de dado
    real no GENUS).

    Reconhece a estrutura completa da tabela AGENDA. Nomes e tipos vêm do
    snapshot de metadados do Firebird já obtido em sessão anterior deste
    mesmo projeto (cache `genus_full_schema.json`, gerado por consulta a
    RDB$RELATION_FIELDS/RDB$RELATION_CONSTRAINTS, sem ler nenhuma linha de
    dado de negócio), conferido também contra a lista de colunas fornecida
    para esta tarefa:
    - CODIGO: INTEGER -> `codigo` (PK original no GENUS, não reaproveitada
      como PK deste ERP)
    - CODAGENDADOR: INTEGER -> `cod_agendador` (código bruto do funcionário
      que criou/é dono do compromisso — provável referência a
      GENUS.FUNCIONARIO, que por sua vez só ganha identidade completa via
      JOIN com CADASTRO através de CODCADASTRO; ver docstring do model
      `Funcionario`)
    - CODPARA: INTEGER -> `cod_para` (código bruto da pessoa/empresa para
      quem — ou sobre quem — é o compromisso; provável referência a
      GENUS.CADASTRO, ver docstring do model `CadastroPessoa`)
    - DATA: TIMESTAMP -> `data` (data do compromisso)
    - HORA: VARCHAR(5) -> `hora` (horário livre, formato "HH:MM")
    - TEXTO: BLOB subtype TEXT -> `texto` (descrição/anotação do
      compromisso)
    - EMISSAO: TIMESTAMP -> `emissao` (data/hora de criação/emissão do
      registro)
    - STATUS: VARCHAR(25) -> `status` (situação do compromisso, ex.:
      pendente/concluído/cancelado — valores livres definidos pelo GENUS)

    GENUS.AGENDA é uma tabela auxiliar MESTRE solta (agenda de
    compromissos/lembretes) que não guarda identidade própria de pessoa —
    tanto `cod_agendador` quanto `cod_para` são apenas códigos brutos de
    outras tabelas (FUNCIONARIO e CADASTRO, respectivamente). Propositalmente
    não criamos FK própria para eles aqui, seguindo o mesmo precedente de
    `Mensagem.cod_origem`/`cod_destino`/`usuario_origem`/`usuario_destino` —
    resolver esses códigos brutos (e o JOIN adicional FUNCIONARIO -> CADASTRO
    exigido para identificar de fato o agendador) é tarefa do agente de
    migração de dados, fora do escopo desta atualização estrutural.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Mensagem`/`Cidade`/`Pais`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "agendas"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.AGENDA ───────────────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)   # GENUS: CODIGO (PK original no GENUS)
    cod_agendador = Column(Integer, nullable=True, index=True)          # GENUS: CODAGENDADOR (código bruto do funcionário — GENUS.FUNCIONARIO)
    cod_para = Column(Integer, nullable=True, index=True)               # GENUS: CODPARA (código bruto da pessoa/empresa — GENUS.CADASTRO)
    data = Column(DateTime, nullable=True)                              # GENUS: DATA
    hora = Column(String(5), nullable=True)                             # GENUS: HORA
    texto = Column(Text, nullable=True)                                 # GENUS: TEXTO
    emissao = Column(DateTime, nullable=True)                           # GENUS: EMISSAO
    status = Column(String(25), nullable=True)                          # GENUS: STATUS


class Cargo(Base):
    """Tabela mestre de Cargos — tabela CARGO do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo RH/Folha (Tier 2).

    Reconhece a estrutura completa da tabela CARGO, seguindo o mesmo
    precedente estabelecido para `Pais`/`Estado`/`Restricao` (tabelas mestre
    soltas, com apenas um par código/descrição). Nomes e tipos vêm do cache
    de metadados do Firebird já obtido em sessão anterior deste mesmo
    projeto (`genus_full_schema.json`, gerado por consulta a
    RDB$RELATION_FIELDS/RDB$RELATION_CONSTRAINTS, sem ler nenhuma linha de
    dado de negócio), conferido também contra a lista de colunas fornecida
    para esta tarefa — apenas duas colunas:
    - CODIGO: INTEGER -> `codigo` (PK original no GENUS, não reaproveitada
      como PK deste ERP, mesmo critério de `Pais.codigo`/`Agenda.codigo`)
    - DESCRI: VARCHAR(40) -> `descricao`

    GENUS.CARGO é referenciada como código bruto por GENUS.FUNCIONARIO
    através da coluna CODCARGO, já reconhecida neste ERP em
    `Funcionario.cod_cargo` (ver docstring do model `Funcionario` — o campo
    livre `Funcionario.cargo`, de texto, é distinto e foi mantido separado).
    Nenhuma FK própria é criada aqui; resolver `Funcionario.cod_cargo`
    contra `Cargo.codigo` é tarefa do agente de migração de dados, fora do
    escopo desta atualização estrutural.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Pais`/`Agenda`/`Mensagem`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "cargos"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.CARGO ────────────────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)   # GENUS: CODIGO (PK original no GENUS)
    descricao = Column(String(40), nullable=True)                      # GENUS: DESCRI


class Setor(Base):
    """Tabela mestre de Setores — tabela SETOR do sistema legado GENUS
    (GENUS_ZANGUETTIN.FDB), módulo RH/Folha (Tier 2).

    Reconhece a estrutura completa da tabela SETOR, seguindo o mesmo
    precedente estabelecido para `Cargo`/`Pais`/`Restricao` (tabelas mestre
    soltas, com apenas um par código/descrição). Nomes e tipos vêm do cache
    de metadados do Firebird já obtido em sessão anterior deste mesmo
    projeto (`genus_full_schema.json`, gerado por consulta a
    RDB$RELATION_FIELDS/RDB$RELATION_CONSTRAINTS, sem ler nenhuma linha de
    dado de negócio) — apenas duas colunas, batendo exatamente com a
    sugestão de tipos desta tarefa:
    - CODIGO: INTEGER -> `codigo` (PK original no GENUS, não reaproveitada
      como PK deste ERP, mesmo critério de `Cargo.codigo`/`Pais.codigo`)
    - DESCRICAO: VARCHAR(30) -> `descricao`

    GENUS.SETOR é referenciada como código bruto por pelo menos duas
    tabelas já reconhecidas neste ERP:
    - `Funcionario.cod_setor` (GENUS.FUNCIONARIO.CODSETOR)
    - `CadastroContato.cod_setor` (GENUS.CADASTROCONTATO.CODSETOR)
    Nenhuma FK própria é criada aqui; resolver esses códigos brutos contra
    `Setor.codigo` é tarefa do agente de migração de dados, fora do escopo
    desta atualização estrutural.

    No frontend, ganha entrada própria em `TabelasAuxiliaresWindow`, no
    mesmo padrão de `Cargo`/`Pais`/`Agenda`/`Mensagem`.

    Nenhuma linha é importada por este model — apenas a estrutura.
    """
    __tablename__ = "setores"
    id = Column(Integer, primary_key=True, index=True)

    # ── Campos migrados de GENUS.SETOR ────────────────────────────────────
    codigo = Column(Integer, nullable=True, unique=True, index=True)   # GENUS: CODIGO (PK original no GENUS)
    descricao = Column(String(30), nullable=True)                      # GENUS: DESCRICAO

