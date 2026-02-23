from pydantic import BaseModel, Field
from typing import Optional

class Produto(BaseModel):
    # Tipagem rígida: se mandar string no preco, o Python gera erro
    id: Optional[str] = None
    nome: str = Field(..., min_length=3, max_length=100)
    descricao: str
    preco: float = Field(..., gt=0) # Deve ser maior que zero
    estoque: int = Field(..., ge=0)  # Não pode ser negativo
    categoria: str
    
    # Características (Como se fosse um mapa de atributos)
    caracteristicas: dict[str, str]  # Ex: {"cor": "Azul", "peso": "1kg"}