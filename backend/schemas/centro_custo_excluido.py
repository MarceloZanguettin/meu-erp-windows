from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CentroCustoExcluidoCreate(BaseModel):
    # Identificação / chave original da linha excluída no GENUS
    cod_produto: Optional[str] = None
    cod_empresa: Optional[int] = None
    pertence_empresa: Optional[str] = None

    # Preço / venda
    ecf_aliquota: Optional[str] = None
    custo: Optional[float] = None
    venda: Optional[float] = None
    frete: Optional[float] = None
    minimo: Optional[float] = None
    maximo: Optional[float] = None
    qtde: Optional[float] = None
    consignacao: Optional[float] = None
    valor_promocao: Optional[float] = None
    inicio_promocao: Optional[datetime] = None
    fim_promocao: Optional[datetime] = None
    estoque_cliente: Optional[float] = None
    custo_fixo: Optional[float] = None
    margem_lucro: Optional[float] = None
    comissao: Optional[float] = None
    avista: Optional[float] = None
    comissao_avista: Optional[float] = None
    percentual_avista: Optional[float] = None
    preco_minimo: Optional[float] = None
    percentual_a_prazo: Optional[float] = None
    percentual_minimo: Optional[float] = None
    ultimo_custo: Optional[float] = None
    mao_de_obra: Optional[float] = None
    custo_materia: Optional[float] = None

    # Estoque
    fisico: Optional[float] = None

    # Fiscal — ICMS / IPI
    reducao_icms: Optional[float] = None
    diferenca_subst: Optional[float] = None
    diferenca_icms: Optional[float] = None
    ipi_entrada: Optional[float] = None

    # Fiscal — PIS / COFINS
    pis_cst: Optional[str] = None
    pis_aliquota: Optional[float] = None
    pis_reais: Optional[float] = None
    cofins_cst: Optional[str] = None
    cofins_aliquota: Optional[float] = None
    cofins_reais: Optional[float] = None

    # Balança
    tecla_balanca: Optional[int] = None
    tipo_balanca: Optional[str] = None
    cod_balanca: Optional[int] = None
    validade: Optional[int] = None

    # Patrimônio / bem (veículo, equipamento etc.)
    data_aquisicao: Optional[datetime] = None
    nota_patrimonio: Optional[int] = None
    cod_patrimonio: Optional[int] = None
    valor_patrimonio: Optional[float] = None
    data_garantia: Optional[datetime] = None
    data_depreciacao: Optional[datetime] = None
    taxa_depreciacao: Optional[float] = None
    valor_depreciacao: Optional[float] = None
    data_revisao: Optional[datetime] = None
    placa: Optional[str] = None
    chassi: Optional[str] = None
    capacidade: Optional[float] = None
    troca_oleo_km: Optional[int] = None
    data_troca_oleo: Optional[datetime] = None


class CentroCustoExcluidoUpdate(CentroCustoExcluidoCreate):
    pass


class CentroCustoExcluidoOut(CentroCustoExcluidoCreate):
    id: int

    class Config:
        from_attributes = True
