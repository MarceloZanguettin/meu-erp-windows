from pydantic import BaseModel
from typing import Optional


class NotaXmlCreate(BaseModel):
    # Vínculo com a saída/nota fiscal já reconhecida neste ERP
    saida_id: Optional[int] = None

    # Chave natural original da linha no GENUS (par único com SAIDA)
    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None

    # Dados do XML da NF-e
    chave_nfe: Optional[str] = None
    arq_xml: Optional[str] = None


class NotaXmlUpdate(NotaXmlCreate):
    pass


class NotaXmlOut(NotaXmlCreate):
    id: int

    class Config:
        from_attributes = True
