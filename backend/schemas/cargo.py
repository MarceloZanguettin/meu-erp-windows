from pydantic import BaseModel
from typing import Optional


class CargoCreate(BaseModel):
    # Campos migrados de GENUS.CARGO
    codigo: Optional[int] = None
    descricao: Optional[str] = None


class CargoUpdate(BaseModel):
    codigo: Optional[int] = None
    descricao: Optional[str] = None


class CargoOut(CargoCreate):
    id: int

    class Config:
        from_attributes = True
