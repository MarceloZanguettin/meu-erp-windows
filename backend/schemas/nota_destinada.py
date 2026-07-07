from pydantic import BaseModel
from typing import Optional
import datetime


class NotaDestinadaCreate(BaseModel):
    # Identificação / chave natural própria desta linha (GENUS.NOTASDESTINADAS)
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    emissao: Optional[datetime.datetime] = None
    doc: Optional[int] = None

    # Emitente da NF-e destinada (texto em claro, sem código CADASTRO)
    cnpj: Optional[str] = None
    insc: Optional[str] = None
    fornecedor: Optional[str] = None

    # Valores e status da manifestação/processamento
    total_nfe: Optional[float] = None
    situacao: Optional[str] = None
    status_genus: Optional[str] = None
    resumo: Optional[int] = None

    # NF-e destinada (chave de acesso e XML)
    chave_nfe: Optional[str] = None
    arq_xml: Optional[str] = None

    # Vínculo com a entrada (lançamento de compra), quando já lançada
    entrada_id: Optional[int] = None
    tipo_doc_entrada: Optional[str] = None
    doc_entrada: Optional[int] = None
    serie_entrada: Optional[str] = None
    cod_fornecedor_entrada: Optional[int] = None
    cod_empresa_entrada: Optional[int] = None

    # Vínculo com uma saída (nota de venda), ex.: devolução
    cod_saida: Optional[int] = None
    cod_empresa_saida: Optional[int] = None
    doc_saida: Optional[int] = None


class NotaDestinadaUpdate(NotaDestinadaCreate):
    pass


class NotaDestinadaOut(NotaDestinadaCreate):
    id: int

    class Config:
        from_attributes = True
