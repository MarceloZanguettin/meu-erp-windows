import { createPortal } from 'react-dom';

/**
 * Renderiza filhos diretamente em document.body via React Portal.
 * Necessário para modais dentro de janelas draggables:
 * react-draggable aplica transform no pai, quebrando position:fixed.
 */
export default function Portal({ children }) {
  return createPortal(children, document.body);
}
