from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProdutoProducaoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRODUTOPRODUCAO
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    lote: Optional[str] = None
    cod_produto: Optional[str] = None

    data_producao: Optional[datetime] = None
    data_previsao: Optional[datetime] = None
    hora_previsao: Optional[str] = None
    fechado: Optional[datetime] = None
    auditado: Optional[datetime] = None
    data_entrega: Optional[datetime] = None

    cod_funcionario: Optional[int] = None
    cod_solicitante: Optional[int] = None
    cod_pedido_lan: Optional[int] = None
    cod_producao_etapas: Optional[int] = None
    cod_funcionario_audita: Optional[int] = None
    cod_funcionario_fecha: Optional[int] = None

    observacao: Optional[str] = None
    observacao_detalhe: Optional[str] = None

    imprimiu_etiqueta: Optional[str] = None
    estoque_reservado: Optional[str] = None
    processos_finalizados: Optional[str] = None
    tipo_calculo: Optional[str] = None
    considerar_tarugo_extrusao: Optional[str] = None

    qtde_fisico: Optional[float] = None
    qtde_fisico_pedido: Optional[float] = None
    qtde: Optional[float] = None
    qtde_produzida: Optional[float] = None
    total_produzido_real: Optional[float] = None
    porcentagem: Optional[float] = None
    aparas: Optional[float] = None
    estoque: Optional[float] = None

    sanfona: Optional[str] = None
    extrusao: Optional[str] = None
    espessura: Optional[float] = None
    largura: Optional[float] = None
    comprimento: Optional[float] = None
    linear: Optional[float] = None
    unidade_medida: Optional[str] = None
    cor_selecionada: Optional[str] = None
    pigmento: Optional[str] = None

    variacao_espessura: Optional[float] = None
    variacao_largura: Optional[float] = None
    variacao_comprimento: Optional[float] = None


class ProdutoProducaoUpdate(ProdutoProducaoCreate):
    pass


class ProdutoProducaoOut(ProdutoProducaoCreate):
    id: int

    class Config:
        from_attributes = True
