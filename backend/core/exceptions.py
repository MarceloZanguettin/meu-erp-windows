"""
Exceções de domínio do ERP.
Lançadas nas camadas de Repository e Service — capturadas pelo error_handler global.
"""


class ERPException(Exception):
    """Base de todas as exceções de domínio."""
    status_code: int = 500
    detail: str = "Erro interno do servidor."

    def __init__(self, detail: str | None = None):
        self.detail = detail or self.__class__.detail
        super().__init__(self.detail)


class NaoEncontradoError(ERPException):
    status_code = 404
    detail = "Recurso não encontrado."


class ConflitoDuplicidadeError(ERPException):
    status_code = 409
    detail = "Registro duplicado."


class ValidacaoDominioError(ERPException):
    status_code = 422
    detail = "Dados inválidos para esta operação."


class EstoqueInsuficienteError(ERPException):
    status_code = 422
    detail = "Estoque insuficiente para realizar a operação."


class OperacaoNaoPermitidaError(ERPException):
    status_code = 403
    detail = "Operação não permitida para o estado atual do recurso."
