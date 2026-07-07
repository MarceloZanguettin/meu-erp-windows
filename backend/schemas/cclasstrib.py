from pydantic import BaseModel
from typing import Optional
import datetime


class CClassTribCreate(BaseModel):
    # Campos migrados de GENUS.CCLASSTRIB
    cclasstrib: Optional[str] = None
    cst: Optional[str] = None
    nome: Optional[str] = None
    descricao: Optional[str] = None
    perc_reducao_ibs: Optional[float] = None
    perc_reducao_cbs: Optional[float] = None
    ind_redutor_bc: Optional[str] = None
    ind_tributacao_regular: Optional[str] = None
    data_inicio_vigencia: Optional[datetime.datetime] = None
    data_fim_vigencia: Optional[datetime.datetime] = None
    data_atualizacao: Optional[datetime.datetime] = None
    ind_monofasico: Optional[str] = None
    lc: Optional[str] = None
    ind_credito_presumido_operacao: Optional[int] = None
    ind_monofasico_padrao: Optional[int] = None
    ind_monofasico_retencao: Optional[int] = None
    ind_monofasico_retido: Optional[int] = None
    ind_monofasico_diferimento: Optional[int] = None
    ind_estorno_credito: Optional[int] = None
    ind_nfe_abi: Optional[int] = None
    ind_nfe: Optional[int] = None
    ind_nfce: Optional[int] = None
    ind_cte: Optional[int] = None
    ind_cte_os: Optional[int] = None
    ind_bpe: Optional[int] = None
    ind_bpe_ta: Optional[int] = None
    ind_bpe_tm: Optional[int] = None
    ind_nf3e: Optional[int] = None
    ind_nfse: Optional[int] = None
    ind_nfse_via: Optional[int] = None
    ind_nfcom: Optional[int] = None
    ind_nfag: Optional[int] = None
    ind_nfgas: Optional[int] = None
    ind_dere: Optional[int] = None


class CClassTribUpdate(BaseModel):
    cclasstrib: Optional[str] = None
    cst: Optional[str] = None
    nome: Optional[str] = None
    descricao: Optional[str] = None
    perc_reducao_ibs: Optional[float] = None
    perc_reducao_cbs: Optional[float] = None
    ind_redutor_bc: Optional[str] = None
    ind_tributacao_regular: Optional[str] = None
    data_inicio_vigencia: Optional[datetime.datetime] = None
    data_fim_vigencia: Optional[datetime.datetime] = None
    data_atualizacao: Optional[datetime.datetime] = None
    ind_monofasico: Optional[str] = None
    lc: Optional[str] = None
    ind_credito_presumido_operacao: Optional[int] = None
    ind_monofasico_padrao: Optional[int] = None
    ind_monofasico_retencao: Optional[int] = None
    ind_monofasico_retido: Optional[int] = None
    ind_monofasico_diferimento: Optional[int] = None
    ind_estorno_credito: Optional[int] = None
    ind_nfe_abi: Optional[int] = None
    ind_nfe: Optional[int] = None
    ind_nfce: Optional[int] = None
    ind_cte: Optional[int] = None
    ind_cte_os: Optional[int] = None
    ind_bpe: Optional[int] = None
    ind_bpe_ta: Optional[int] = None
    ind_bpe_tm: Optional[int] = None
    ind_nf3e: Optional[int] = None
    ind_nfse: Optional[int] = None
    ind_nfse_via: Optional[int] = None
    ind_nfcom: Optional[int] = None
    ind_nfag: Optional[int] = None
    ind_nfgas: Optional[int] = None
    ind_dere: Optional[int] = None


class CClassTribOut(CClassTribCreate):
    id: int

    class Config:
        from_attributes = True
