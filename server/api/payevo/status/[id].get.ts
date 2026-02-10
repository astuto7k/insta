// GET /api/payevo/status/[id]
// Consulta o status de uma transação PIX na PayEvo v2
// Importa do serviço centralizado para usar fallbacks de URL

import { getTransactionStatus } from '../../../services/payevo.service'

export default defineEventHandler(async (event) => {
  const transactionId = getRouterParam(event, 'id')

  if (!transactionId) {
    setResponseStatus(event, 400)
    return { success: false, message: 'ID da transação é obrigatório' }
  }

  try {
    const resultado = await getTransactionStatus(transactionId)

    return {
      success: true,
      transactionId: resultado.id,
      status: resultado.status,
      // Mapeamento correto para resposta do status
      qrCode: resultado.pix?.qrcode,
      pixCopyPaste: resultado.pix?.qrcode
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
    // console.error(`[PayEvo] Erro status ${transactionId}:`, errorMessage)

    // Retorna sucesso falso mas sem crashar (status pending se falhar)
    // O serviço já retorna { status: 'pending' } se falhar tudo, então aqui só pegamos erro de rede grave
    setResponseStatus(event, 502)
    return { success: false, message: 'Falha ao consultar status do pagamento' }
  }
})
