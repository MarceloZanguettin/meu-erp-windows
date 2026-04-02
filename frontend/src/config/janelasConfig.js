import ProdutoWindow            from '../Components/ProductWindow/ProductWindow.jsx';
import FluxoTrabalhoWindow      from '../Components/FluxoTrabalhoWindow/FluxoTrabalhoWindow.jsx';
import FinanceiroAgrupadoWindow from '../Components/FinanceiroAgrupadoWindow/index.jsx';
import ClienteWindow            from '../Components/ClienteWindow/ClienteWindow.jsx';
import FornecedorWindow         from '../Components/FornecedorWindow/FornecedorWindow.jsx';
import TransportadoraWindow     from '../Components/TransportadoraWindow/TransportadoraWindow.jsx';
import RepresentanteWindow      from '../Components/RepresentanteWindow/RepresentanteWindow.jsx';
import FuncionarioWindow        from '../Components/FuncionarioWindow/FuncionarioWindow.jsx';
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
import NovaEntradaAuxiliarWindow          from '../Components/TabelasAuxiliaresWindow/NovaEntradaAuxiliarWindow.jsx';
import NovoLancamentoFinanceiroWindow     from '../Components/FinanceiroAgrupadoWindow/components/NovoLancamentoFinanceiroWindow.jsx';
import NovoUsuarioWindow                 from '../Components/UsuariosWindow/NovoUsuarioWindow.jsx';
import NovoPerfilAcessoWindow            from '../Components/UsuariosWindow/NovoPerfilAcessoWindow.jsx';

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
    titulo:    'Novo Produto',
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
  cliente: {
    titulo:    'Clientes',
    Component: ClienteWindow,
  },
  fornecedor: {
    titulo:    'Fornecedores',
    Component: FornecedorWindow,
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
  novaEntradaAuxiliar: {
    titulo:    'Novo Cadastro Auxiliar',
    Component: NovaEntradaAuxiliarWindow,
  },
  novoLancamentoFinanceiro: {
    titulo:    'Novo Lançamento Financeiro',
    Component: NovoLancamentoFinanceiroWindow,
  },
  novoUsuario: {
    titulo:    'Novo Usuário',
    Component: NovoUsuarioWindow,
  },
  novoPerfilAcesso: {
    titulo:    'Novo Perfil de Acesso',
    Component: NovoPerfilAcessoWindow,
  },
};
