from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ComissaoCreate(BaseModel):
    # ── Vínculo resolvível do ERP (Representante já expandido no Tier 1) ──
    representante_id: Optional[int] = None

    # ── Campos migrados de GENUS.COMISSAO (todos opcionais) ────────────────
    # Identificação / vínculos (códigos ainda não resolvidos contra tabelas próprias)
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_representante: Optional[int] = None
    cod_saida: Optional[int] = None
    nota_fiscal: Optional[int] = None
    cod_prospeccao: Optional[int] = None
    cod_pedido: Optional[int] = None
    cod_receber: Optional[int] = None
    cod_deposito: Optional[int] = None
    cod_pagar: Optional[int] = None

    # Datas
    emissao: Optional[datetime] = None
    vencimento: Optional[datetime] = None
    dt_processamento: Optional[datetime] = None

    # Valores
    valor_comissao: Optional[float] = None
    percentual_comissao: Optional[float] = None
    total: Optional[float] = None
    deducao: Optional[float] = None

    # Tipo/classificação
    tipo_comissao: Optional[str] = None
    tipo_func: Optional[str] = None


class ComissaoUpdate(ComissaoCreate):
    pass


class ComissaoOut(ComissaoCreate):
    id: int

    class Config:
        from_attributes = True
