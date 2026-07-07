from pydantic import BaseModel
from typing import Optional


class SaidaDevolucaoCreate(BaseModel):
    # Vínculo com a saída (nota fiscal de venda) já reconhecida neste ERP
    saida_id: Optional[int] = None

    # Chave própria da linha de devolução no GENUS
    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None
    codigo: Optional[int] = None

    # Referência explícita à saída original (GENUS.SAIDADEVOLUCAO.SAIDACODIGO/SAIDACODEMPRESA)
    saida_codigo: Optional[int] = None
    saida_cod_empresa: Optional[int] = None

    # Documento de entrada vinculado (remessa física da devolução)
    entrada_cod_empresa: Optional[int] = None
    entrada_tipo_doc: Optional[str] = None
    entrada_doc: Optional[int] = None
    entrada_serie: Optional[str] = None
    entrada_cod_fornecedor: Optional[int] = None

    # Referência de chave (ex.: chave de NF-e do documento de entrada)
    ref_chave: Optional[str] = None


class SaidaDevolucaoUpdate(SaidaDevolucaoCreate):
    pass


class SaidaDevolucaoOut(SaidaDevolucaoCreate):
    id: int

    class Config:
        from_attributes = True
