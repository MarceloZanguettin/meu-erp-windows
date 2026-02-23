from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Sistema"])

@router.get("/status")
def get_status():
    return {"status": "Online", "msg": "Servidor do ERP respondendo via rede local"}