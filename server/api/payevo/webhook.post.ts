// POST /api/payevo/webhook
// Recebe notificações da PayEvo quando o PIX é pago
// A PayEvo chama esse endpoint automaticamente

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { transaction_id, status } = body as {
    transaction_id?: string
    status?: string
  }

  console.log(`[PayEvo Webhook] Recebido: transaction_id=${transaction_id}, status=${status}`)

  // Validar payload
  if (!transaction_id || !status) {
    console.error('[PayEvo Webhook] Payload inválido:', body)
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload inválido'
    })
  }

  if (status === 'paid') {
    console.log(`[PayEvo Webhook] ✅ Pagamento CONFIRMADO: ${transaction_id}`)
    // Aqui você pode:
    // - Salvar no banco de dados
    // - Enviar email de confirmação
    // - Atualizar status do pedido
    // - Liberar acesso ao produto
  } else if (status === 'failed') {
    console.log(`[PayEvo Webhook] ❌ Pagamento FALHOU: ${transaction_id}`)
  } else {
    console.log(`[PayEvo Webhook] ⏳ Status: ${status} para ${transaction_id}`)
  }

  // Sempre retornar 200 para a PayEvo confirmar recebimento
  return { ok: true }
})
