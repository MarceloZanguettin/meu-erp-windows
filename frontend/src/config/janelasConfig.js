import ProdutoWindow            from '../Components/ProductWindow/ProductWindow.jsx';
import FluxoTrabalhoWindow      from '../Components/FluxoTrabalhoWindow/FluxoTrabalhoWindow.jsx';
import FinanceiroAgrupadoWindow from '../Components/FinanceiroAgrupadoWindow/index.jsx';
import ClienteWindow            from '../Components/ClienteWindow/ClienteWindow.jsx';
import NovoClienteWindow        from '../Components/ClienteWindow/NovoClienteWindow.jsx';
import FornecedorWindow         from '../Components/FornecedorWindow/FornecedorWindow.jsx';
import NovoFornecedorWindow     from '../Components/FornecedorWindow/NovoFornecedorWindow.jsx';
import TransportadoraWindow     from '../Components/TransportadoraWindow/TransportadoraWindow.jsx';
import RepresentanteWindow      from '../Components/RepresentanteWindow/RepresentanteWindow.jsx';
import FuncionarioWindow        from '../Components/FuncionarioWindow/FuncionarioWindow.jsx';
import CadastroPessoaWindow     from '../Components/CadastroPessoaWindow/CadastroPessoaWindow.jsx';
import CentroCustoWindow        from '../Components/CentroCustoWindow/CentroCustoWindow.jsx';
import CentroCustoExcluidoWindow from '../Components/CentroCustoWindow/CentroCustoExcluidoWindow.jsx';
import LancamentoContabilWindow from '../Components/LancamentoContabilWindow/LancamentoContabilWindow.jsx';
import MovimentoFixoWindow      from '../Components/MovimentoFixoWindow/MovimentoFixoWindow.jsx';
import ComissaoWindow           from '../Components/ComissaoWindow/ComissaoWindow.jsx';
import FixoPagarWindow          from '../Components/FixoPagarWindow/FixoPagarWindow.jsx';
import FaturaNotaWindow         from '../Components/FaturaNotaWindow/FaturaNotaWindow.jsx';
import FaturaNotaPagarWindow    from '../Components/FaturaNotaPagarWindow/FaturaNotaPagarWindow.jsx';
import FaturaWindow             from '../Components/FaturaWindow/FaturaWindow.jsx';
import FaturaPagarWindow        from '../Components/FaturaPagarWindow/FaturaPagarWindow.jsx';
import ChequeEmitidoWindow      from '../Components/ChequeEmitidoWindow/ChequeEmitidoWindow.jsx';
import ContaGenusWindow         from '../Components/ContaGenusWindow/ContaGenusWindow.jsx';
import MovtoWindow              from '../Components/MovtoWindow/MovtoWindow.jsx';
import BcoSicredWindow          from '../Components/BcoSicredWindow/BcoSicredWindow.jsx';
import CreditoWindow            from '../Components/CreditoWindow/CreditoWindow.jsx';
import CarteiraWindow           from '../Components/CarteiraWindow/CarteiraWindow.jsx';
import EmpresaWindow            from '../Components/EmpresaWindow/EmpresaWindow.jsx';
import SaidaWindow              from '../Components/VendasWindow/saida/SaidaWindow.jsx';
import SaidaExcluidaWindow      from '../Components/VendasWindow/saida/SaidaExcluidaWindow.jsx';
import SaidaCanceladaWindow     from '../Components/VendasWindow/saida/SaidaCanceladaWindow.jsx';
import EntradaWindow            from '../Components/ComprasWindow/entrada/EntradaWindow.jsx';
import NotaDestinadaWindow      from '../Components/ComprasWindow/notasDestinadas/NotaDestinadaWindow.jsx';
import CompraGenusWindow        from '../Components/ComprasWindow/compra/CompraGenusWindow.jsx';
import CotacaoItensWindow       from '../Components/ComprasWindow/cotacao/CotacaoItensWindow.jsx';
import CotacaoProdutoWindow     from '../Components/ComprasWindow/cotacao/CotacaoProdutoWindow.jsx';
import CotacaoPrecoWindow       from '../Components/ComprasWindow/cotacao/CotacaoPrecoWindow.jsx';
import RequisicaoMateriaEtapasWindow from '../Components/ComprasWindow/requisicaoMateriaEtapas/RequisicaoMateriaEtapasWindow.jsx';
import RequisicaoMateriaWindow      from '../Components/ComprasWindow/requisicaoMateria/RequisicaoMateriaWindow.jsx';
import RequisicaoProdutoWindow      from '../Components/ComprasWindow/requisicaoProduto/RequisicaoProdutoWindow.jsx';
import ContaReceberExcluidaWindow from '../Components/FinanceiroAgrupadoWindow/receber/ContaReceberExcluidaWindow.jsx';
import ContaPagarExcluidaWindow  from '../Components/FinanceiroAgrupadoWindow/pagar/ContaPagarExcluidaWindow.jsx';
import AuditoriaPrePedidoWindow from '../Components/VendasWindow/auditoria/AuditoriaPrePedidoWindow.jsx';
import TabelasAuxiliaresWindow  from '../Components/TabelasAuxiliaresWindow/TabelasAuxiliaresWindow.jsx';
import EstoqueWindow            from '../Components/EstoqueWindow/index.jsx';
import ComprasWindow            from '../Components/ComprasWindow/index.jsx';
import VendasWindow             from '../Components/VendasWindow/index.jsx';
import UsuariosWindow           from '../Components/UsuariosWindow/UsuariosWindow.jsx';

import NovoOrcamentoWindow                from '../Components/VendasWindow/components/NovoOrcamentoWindow.jsx';
import NovoPedidoVendaWindow              from '../Components/VendasWindow/components/NovoPedidoVendaWindow.jsx';
import NovaSolicitacaoCompraWindow        from '../Components/ComprasWindow/components/NovaSolicitacaoCompraWindow.jsx';
import NovoPedidoCompraWindow             from '../Components/ComprasWindow/components/NovoPedidoCompraWindow.jsx';
import NovoMovimentoEstoqueWindow         from '../Components/EstoqueWindow/components/NovoMovimentoEstoqueWindow.jsx';
import NovaTransportadoraWindow           from '../Components/TransportadoraWindow/NovaTransportadoraWindow.jsx';
import NovoRepresentanteWindow            from '../Components/RepresentanteWindow/NovoRepresentanteWindow.jsx';
import NovoFuncionarioWindow              from '../Components/FuncionarioWindow/NovoFuncionarioWindow.jsx';
import NovoCadastroPessoaWindow           from '../Components/CadastroPessoaWindow/NovoCadastroPessoaWindow.jsx';
import NovoCentroCustoWindow              from '../Components/CentroCustoWindow/NovoCentroCustoWindow.jsx';
import NovoCentroCustoExcluidoWindow      from '../Components/CentroCustoWindow/NovoCentroCustoExcluidoWindow.jsx';
import NovoLancamentoContabilWindow       from '../Components/LancamentoContabilWindow/NovoLancamentoContabilWindow.jsx';
import NovoMovimentoFixoWindow            from '../Components/MovimentoFixoWindow/NovoMovimentoFixoWindow.jsx';
import NovaComissaoWindow                 from '../Components/ComissaoWindow/NovoComissaoWindow.jsx';
import NovoFixoPagarWindow                from '../Components/FixoPagarWindow/NovoFixoPagarWindow.jsx';
import NovoFaturaNotaWindow               from '../Components/FaturaNotaWindow/NovoFaturaNotaWindow.jsx';
import NovoFaturaNotaPagarWindow          from '../Components/FaturaNotaPagarWindow/NovoFaturaNotaPagarWindow.jsx';
import NovaFaturaWindow                   from '../Components/FaturaWindow/NovoFaturaWindow.jsx';
import NovaFaturaPagarWindow              from '../Components/FaturaPagarWindow/NovoFaturaPagarWindow.jsx';
import NovoChequeEmitidoWindow            from '../Components/ChequeEmitidoWindow/NovoChequeEmitidoWindow.jsx';
import NovaContaGenusWindow               from '../Components/ContaGenusWindow/NovoContaGenusWindow.jsx';
import NovoMovtoWindow                    from '../Components/MovtoWindow/NovoMovtoWindow.jsx';
import NovoBcoSicredWindow                from '../Components/BcoSicredWindow/NovoBcoSicredWindow.jsx';
import NovoCreditoWindow                  from '../Components/CreditoWindow/NovoCreditoWindow.jsx';
import NovaCarteiraWindow                 from '../Components/CarteiraWindow/NovoCarteiraWindow.jsx';
import NovaEmpresaWindow                  from '../Components/EmpresaWindow/NovoEmpresaWindow.jsx';
import NovaSaidaWindow                    from '../Components/VendasWindow/saida/NovaSaidaWindow.jsx';
import NovaSaidaExcluidaWindow            from '../Components/VendasWindow/saida/NovaSaidaExcluidaWindow.jsx';
import NovaSaidaCanceladaWindow           from '../Components/VendasWindow/saida/NovaSaidaCanceladaWindow.jsx';
import NovaEntradaWindow                  from '../Components/ComprasWindow/entrada/NovaEntradaWindow.jsx';
import NovaNotaDestinadaWindow            from '../Components/ComprasWindow/notasDestinadas/NovaNotaDestinadaWindow.jsx';
import NovaCompraGenusWindow              from '../Components/ComprasWindow/compra/NovaCompraGenusWindow.jsx';
import NovaCotacaoItensWindow             from '../Components/ComprasWindow/cotacao/NovaCotacaoItensWindow.jsx';
import NovaCotacaoProdutoWindow           from '../Components/ComprasWindow/cotacao/NovaCotacaoProdutoWindow.jsx';
import NovaCotacaoPrecoWindow             from '../Components/ComprasWindow/cotacao/NovaCotacaoPrecoWindow.jsx';
import NovaRequisicaoMateriaEtapasWindow  from '../Components/ComprasWindow/requisicaoMateriaEtapas/NovaRequisicaoMateriaEtapasWindow.jsx';
import NovaRequisicaoMateriaWindow        from '../Components/ComprasWindow/requisicaoMateria/NovaRequisicaoMateriaWindow.jsx';
import NovaRequisicaoProdutoWindow        from '../Components/ComprasWindow/requisicaoProduto/NovaRequisicaoProdutoWindow.jsx';
import NovaContaReceberExcluidaWindow     from '../Components/FinanceiroAgrupadoWindow/receber/NovaContaReceberExcluidaWindow.jsx';
import NovaContaPagarExcluidaWindow       from '../Components/FinanceiroAgrupadoWindow/pagar/NovaContaPagarExcluidaWindow.jsx';
import NovaAuditoriaPrePedidoWindow       from '../Components/VendasWindow/auditoria/NovaAuditoriaPrePedidoWindow.jsx';
import NovaEntradaAuxiliarWindow          from '../Components/TabelasAuxiliaresWindow/NovaEntradaAuxiliarWindow.jsx';
import NovoLancamentoFinanceiroWindow     from '../Components/FinanceiroAgrupadoWindow/components/NovoLancamentoFinanceiroWindow.jsx';
import LancamentoDetalheWindow           from '../Components/LancamentoDetalheWindow/LancamentoDetalheWindow.jsx';
import NovoUsuarioWindow                 from '../Components/UsuariosWindow/NovoUsuarioWindow.jsx';
import NovoPerfilAcessoWindow            from '../Components/UsuariosWindow/NovoPerfilAcessoWindow.jsx';
import ConfiguracaoAparenciaWindow       from '../Components/ConfiguracaoAparenciaWindow/ConfiguracaoAparenciaWindow.jsx';

/**
 * Registry central de janelas.
 * Para adicionar um novo módulo, basta inserir uma entrada aqui —
 * sem tocar em App.jsx nem em Header.jsx.
 *
 * Estrutura de cada entrada:
 *   titulo    — rótulo exibido na Taskbar
 *   Component — componente React da janela
 */
export const JANELAS_CONFIG = {
  produto: {
    titulo:    'Produtos',
    Component: ProdutoWindow,
  },
  fluxoTrabalho: {
    titulo:    'Fluxo de Trabalho',
    Component: FluxoTrabalhoWindow,
  },
  financeiroAgrupado: {
    titulo:    'Financeiro Agrupado',
    Component: FinanceiroAgrupadoWindow,
  },
  contaReceberExcluida: {
    titulo:    'Contas a Receber Excluídas (GENUS)',
    Component: ContaReceberExcluidaWindow,
  },
  contaPagarExcluida: {
    titulo:    'Contas a Pagar Excluídas (GENUS)',
    Component: ContaPagarExcluidaWindow,
  },
  cliente: {
    titulo:    'Clientes',
    Component: ClienteWindow,
  },
  fornecedor: {
    titulo:    'Fornecedores',
    Component: FornecedorWindow,
  },
  novoCliente: {
    titulo:    'Novo Cliente',
    Component: NovoClienteWindow,
  },
  novoFornecedor: {
    titulo:    'Novo Fornecedor',
    Component: NovoFornecedorWindow,
  },
  transportadora: {
    titulo:    'Transportadoras',
    Component: TransportadoraWindow,
  },
  representante: {
    titulo:    'Representantes',
    Component: RepresentanteWindow,
  },
  funcionario: {
    titulo:    'Funcionários',
    Component: FuncionarioWindow,
  },
  cadastroPessoa: {
    titulo:    'Cadastro (GENUS)',
    Component: CadastroPessoaWindow,
  },
  centroCusto: {
    titulo:    'Centro de Custo (GENUS)',
    Component: CentroCustoWindow,
  },
  centroCustoExcluido: {
    titulo:    'Centros de Custo Excluídos (GENUS)',
    Component: CentroCustoExcluidoWindow,
  },
  lancamentoContabil: {
    titulo:    'Lançamentos Contábeis (GENUS)',
    Component: LancamentoContabilWindow,
  },
  movimentoFixo: {
    titulo:    'Movimentos Fixos (GENUS)',
    Component: MovimentoFixoWindow,
  },
  comissao: {
    titulo:    'Comissões (GENUS)',
    Component: ComissaoWindow,
  },
  fixoPagar: {
    titulo:    'Fixos a Pagar (GENUS)',
    Component: FixoPagarWindow,
  },
  faturaNota: {
    titulo:    'Vínculo Fatura-Nota Fiscal (GENUS)',
    Component: FaturaNotaWindow,
  },
  faturaNotaPagar: {
    titulo:    'Vínculo Fatura-Nota Pagar (GENUS)',
    Component: FaturaNotaPagarWindow,
  },
  fatura: {
    titulo:    'Faturas (GENUS)',
    Component: FaturaWindow,
  },
  faturaPagar: {
    titulo:    'Faturas a Pagar (GENUS)',
    Component: FaturaPagarWindow,
  },
  chequeEmitido: {
    titulo:    'Cheques Emitidos (GENUS)',
    Component: ChequeEmitidoWindow,
  },
  contaGenus: {
    titulo:    'Contas (GENUS)',
    Component: ContaGenusWindow,
  },
  movto: {
    titulo:    'Movimentos de Crédito (GENUS)',
    Component: MovtoWindow,
  },
  bcoSicred: {
    titulo:    'Banco Sicred - Retorno/Remessa (GENUS)',
    Component: BcoSicredWindow,
  },
  credito: {
    titulo:    'Créditos de Cliente (GENUS)',
    Component: CreditoWindow,
  },
  carteira: {
    titulo:    'Carteiras de Cobrança (GENUS)',
    Component: CarteiraWindow,
  },
  empresa: {
    titulo:    'Empresas (GENUS)',
    Component: EmpresaWindow,
  },
  entrada: {
    titulo:    'Entradas (GENUS)',
    Component: EntradaWindow,
  },
  notaDestinada: {
    titulo:    'Notas Destinadas (GENUS)',
    Component: NotaDestinadaWindow,
  },
  compraGenus: {
    titulo:    'Compras (GENUS)',
    Component: CompraGenusWindow,
  },
  cotacaoItens: {
    titulo:    'Itens de Cotação de Preço (GENUS)',
    Component: CotacaoItensWindow,
  },
  cotacaoProduto: {
    titulo:    'Produtos solicitados em Cotação de Preço (GENUS)',
    Component: CotacaoProdutoWindow,
  },
  cotacaoPreco: {
    titulo:    'Cotação de Preço - Cabeçalho (GENUS)',
    Component: CotacaoPrecoWindow,
  },
  requisicaoMateriaEtapas: {
    titulo:    'Etapas de Requisição de Material (GENUS)',
    Component: RequisicaoMateriaEtapasWindow,
  },
  requisicaoMateria: {
    titulo:    'Requisição de Material - Cabeçalho (GENUS)',
    Component: RequisicaoMateriaWindow,
  },
  requisicaoProduto: {
    titulo:    'Requisição de Material - Item (GENUS)',
    Component: RequisicaoProdutoWindow,
  },
  saida: {
    titulo:    'Saídas (GENUS)',
    Component: SaidaWindow,
  },
  saidaExcluida: {
    titulo:    'Saídas Excluídas (GENUS)',
    Component: SaidaExcluidaWindow,
  },
  saidaCancelada: {
    titulo:    'Saídas Canceladas (GENUS)',
    Component: SaidaCanceladaWindow,
  },
  auditoriaPrePedido: {
    titulo:    'Auditoria de Pré-Pedido (GENUS)',
    Component: AuditoriaPrePedidoWindow,
  },
  tabelasAuxiliares: {
    titulo:    'Tabelas Auxiliares',
    Component: TabelasAuxiliaresWindow,
  },
  estoque: {
    titulo:    'Estoque',
    Component: EstoqueWindow,
  },
  compras: {
    titulo:    'Compras',
    Component: ComprasWindow,
  },
  vendas: {
    titulo:    'Vendas',
    Component: VendasWindow,
  },
  usuarios: {
    titulo:    'Usuários e Perfis',
    Component: UsuariosWindow,
  },

  // Janelas de cadastro de novos registros
  novoOrcamento: {
    titulo:    'Novo Orçamento',
    Component: NovoOrcamentoWindow,
  },
  novoPedidoVenda: {
    titulo:    'Novo Pedido de Venda',
    Component: NovoPedidoVendaWindow,
  },
  novaSolicitacaoCompra: {
    titulo:    'Nova Solicitação de Compra',
    Component: NovaSolicitacaoCompraWindow,
  },
  novoPedidoCompra: {
    titulo:    'Novo Pedido de Compra',
    Component: NovoPedidoCompraWindow,
  },
  novoMovimentoEstoque: {
    titulo:    'Lançar Movimento de Estoque',
    Component: NovoMovimentoEstoqueWindow,
  },
  novaTransportadora: {
    titulo:    'Nova Transportadora',
    Component: NovaTransportadoraWindow,
  },
  novoRepresentante: {
    titulo:    'Novo Representante',
    Component: NovoRepresentanteWindow,
  },
  novoFuncionario: {
    titulo:    'Novo Funcionário',
    Component: NovoFuncionarioWindow,
  },
  novoCadastroPessoa: {
    titulo:    'Novo Cadastro',
    Component: NovoCadastroPessoaWindow,
  },
  novoCentroCusto: {
    titulo:    'Novo Centro de Custo',
    Component: NovoCentroCustoWindow,
  },
  novoCentroCustoExcluido: {
    titulo:    'Novo Centro de Custo Excluído',
    Component: NovoCentroCustoExcluidoWindow,
  },
  novoLancamentoContabil: {
    titulo:    'Novo Lançamento Contábil',
    Component: NovoLancamentoContabilWindow,
  },
  novoMovimentoFixo: {
    titulo:    'Novo Movimento Fixo',
    Component: NovoMovimentoFixoWindow,
  },
  novaComissao: {
    titulo:    'Nova Comissão',
    Component: NovaComissaoWindow,
  },
  novoFixoPagar: {
    titulo:    'Novo Fixo a Pagar',
    Component: NovoFixoPagarWindow,
  },
  novoFaturaNota: {
    titulo:    'Novo Vínculo Fatura-Nota',
    Component: NovoFaturaNotaWindow,
  },
  novoFaturaNotaPagar: {
    titulo:    'Novo Vínculo Fatura-Nota Pagar',
    Component: NovoFaturaNotaPagarWindow,
  },
  novaFatura: {
    titulo:    'Nova Fatura',
    Component: NovaFaturaWindow,
  },
  novaFaturaPagar: {
    titulo:    'Nova Fatura a Pagar',
    Component: NovaFaturaPagarWindow,
  },
  novoChequeEmitido: {
    titulo:    'Novo Cheque Emitido',
    Component: NovoChequeEmitidoWindow,
  },
  novaContaGenus: {
    titulo:    'Nova Conta (GENUS)',
    Component: NovaContaGenusWindow,
  },
  novoMovto: {
    titulo:    'Novo Movimento (GENUS)',
    Component: NovoMovtoWindow,
  },
  novoBcoSicred: {
    titulo:    'Nova Configuração Banco Sicred',
    Component: NovoBcoSicredWindow,
  },
  novoCredito: {
    titulo:    'Novo Crédito (GENUS)',
    Component: NovoCreditoWindow,
  },
  novaCarteira: {
    titulo:    'Nova Carteira (GENUS)',
    Component: NovaCarteiraWindow,
  },
  novaEmpresa: {
    titulo:    'Nova Empresa',
    Component: NovaEmpresaWindow,
  },
  novaEntrada: {
    titulo:    'Nova Entrada',
    Component: NovaEntradaWindow,
  },
  novaNotaDestinada: {
    titulo:    'Nova Nota Destinada',
    Component: NovaNotaDestinadaWindow,
  },
  novaCompraGenus: {
    titulo:    'Nova Compra (GENUS)',
    Component: NovaCompraGenusWindow,
  },
  novaCotacaoItens: {
    titulo:    'Novo Item de Cotação (GENUS)',
    Component: NovaCotacaoItensWindow,
  },
  novaCotacaoProduto: {
    titulo:    'Novo Produto de Cotação (GENUS)',
    Component: NovaCotacaoProdutoWindow,
  },
  novaRequisicaoMateriaEtapas: {
    titulo:    'Nova Etapa de Requisição de Material (GENUS)',
    Component: NovaRequisicaoMateriaEtapasWindow,
  },
  novaRequisicaoMateria: {
    titulo:    'Nova Requisição de Material (GENUS)',
    Component: NovaRequisicaoMateriaWindow,
  },
  novaRequisicaoProduto: {
    titulo:    'Novo Item de Requisição de Material (GENUS)',
    Component: NovaRequisicaoProdutoWindow,
  },
  novaCotacaoPreco: {
    titulo:    'Nova Cotação de Preço (GENUS)',
    Component: NovaCotacaoPrecoWindow,
  },
  novaSaida: {
    titulo:    'Nova Saída',
    Component: NovaSaidaWindow,
  },
  novaSaidaExcluida: {
    titulo:    'Nova Saída Excluída',
    Component: NovaSaidaExcluidaWindow,
  },
  novaSaidaCancelada: {
    titulo:    'Nova Saída Cancelada',
    Component: NovaSaidaCanceladaWindow,
  },
  novaAuditoriaPrePedido: {
    titulo:    'Nova Auditoria de Pré-Pedido',
    Component: NovaAuditoriaPrePedidoWindow,
  },
  novaEntradaAuxiliar: {
    titulo:    'Novo Cadastro Auxiliar',
    Component: NovaEntradaAuxiliarWindow,
  },
  novoLancamentoFinanceiro: {
    titulo:    'Novo Lançamento Financeiro',
    Component: NovoLancamentoFinanceiroWindow,
  },
  novaContaReceberExcluida: {
    titulo:    'Nova Conta a Receber Excluída',
    Component: NovaContaReceberExcluidaWindow,
  },
  novaContaPagarExcluida: {
    titulo:    'Nova Conta a Pagar Excluída',
    Component: NovaContaPagarExcluidaWindow,
  },
  lancamentoDetalhe: {
    titulo:    'Detalhe do Lançamento',
    Component: LancamentoDetalheWindow,
  },
  novoUsuario: {
    titulo:    'Novo Usuário',
    Component: NovoUsuarioWindow,
  },
  novoPerfilAcesso: {
    titulo:    'Novo Perfil de Acesso',
    Component: NovoPerfilAcessoWindow,
  },
  aparencia: {
    titulo:    'Aparência do Sistema',
    Component: ConfiguracaoAparenciaWindow,
  },
};
