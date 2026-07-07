from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NotaCorrecaoCreate(BaseModel):
    # Vínculo com a saída/nota fiscal já reconhecida neste ERP
    saida_id: Optional[int] = None

    # Chave natural original da linha no GENUS (par comum com SAIDA)
    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None

    # Dados da Carta de Correção Eletrônica (CC-e)
    sequencia: Optional[int] = None
    texto: Optional[str] = None
    emissao: Optional[datetime] = None
    arq_xml: Optional[str] = None


class NotaCorrecaoUpdate(NotaCorrecaoCreate):
    pass


class NotaCorrecaoOut(NotaCorrecaoCreate):
    id: int

    class Config:
        from_attributes = True
