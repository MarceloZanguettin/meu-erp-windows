from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID, uuid4

# --- Base Models ---

class ProductCharacteristic(BaseModel):
    name: str
    value: str

class Product(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0, description="O preço deve ser maior que zero")
    category: str
    characteristics: List[ProductCharacteristic] = []
    stock_quantity: int = Field(ge=0, default=0)

class Client(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    email: EmailStr
    tax_id: str  # CPF ou CNPJ
    phone: Optional[str] = None
    address: str

class OrderItem(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0)
    unit_price: float

class OrderStatus(str):
    PENDING = "pendente"
    PAID = "pago"
    SHIPPED = "enviado"
    DELIVERED = "entregue"
    CANCELLED = "cancelado"

class Order(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    client_id: UUID
    items: List[OrderItem]
    total_amount: float
    status: str = "pendente"
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
