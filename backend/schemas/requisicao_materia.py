from pydantic import BaseModel
from typing import Optional
import datetime


class RequisicaoMateriaCreate(BaseModel):
    # Identificação / chave bruta original (PK própria no GENUS: PK_REQUISICAOMATERIA)
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None

    # Cabeçalho da requisição
    emissao: Optional[datetime.datetime] = None
    tipo: Optional[str] = None
    tipo_requisicao: Optional[str] = None
    status: Optional[str] = None
    lote: Optional[str] = None
    obs: Optional[str] = None

    # Solicitante / responsáveis (códigos brutos, sem FK própria — ver docstring do model)
    cod_cliente: Optional[int] = None
    cod_funcionario: Optional[int] = None

    # Previsão de entrega/execução
    dt_previsao: Optional[datetime.datetime] = None
    hora: Optional[str] = None
    hora_previsao: Optional[str] = None
    local_entrega: Optional[str] = None
    cod_transportador: Optional[int] = None

    # Equipamento / tanque / voltagem (contexto de produção industrial)
    cod_equipamento: Optional[str] = None
    cod_tanque: Optional[int] = None
    voltagem: Optional[float] = None


class RequisicaoMateriaUpdate(RequisicaoMateriaCreate):
    pass


class RequisicaoMateriaOut(RequisicaoMateriaCreate):
    id: int

    class Config:
        from_attributes = True
