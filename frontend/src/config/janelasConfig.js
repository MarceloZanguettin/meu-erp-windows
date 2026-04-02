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
};
