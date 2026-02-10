// Composable para gerenciar o pagamento PIX
// Encapsula criação do PIX, polling de status e redirecionamento pós-pagamento

import type { PixCheckoutData } from '~/types/payevo'

export function usePixPayment() {
  const pixData = ref<PixCheckoutData | null>(null)
  const loading = ref(false)
  const erro = ref<string | null>(null)
  const statusPagamento = ref<string>('idle') // idle, creating, pending, paid, failed, error

  let pollingInterval: ReturnType<typeof setInterval> | undefined

  // Criar PIX — chama API route no backend
  const criarPix = async (produtoId: string) => {
    loading.value = true
    erro.value = null
    statusPagamento.value = 'creating'

    try {
      const response = await $fetch<PixCheckoutData>('/api/payevo/criar-pix', {
        method: 'POST',
        body: { produtoId }
      })

      pixData.value = response
      statusPagamento.value = response.status // 'pending'
      return response
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } }).data?.message
        || (error as { statusMessage?: string }).statusMessage
        || 'Erro ao gerar pagamento PIX'
      erro.value = message
      statusPagamento.value = 'error'
      console.error('[usePixPayment] Erro:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Verificar status de uma transação
  const verificarStatus = async (transactionId: string) => {
    try {
      const response = await $fetch<{
        transactionId: string
        status: string
        qrCode: string
        pixCopyPaste: string
      }>(`/api/payevo/status/${transactionId}`)

      return response
    } catch (error) {
      console.error('[usePixPayment] Erro ao verificar status:', error)
      return null
    }
  }

  // Iniciar polling automático de status a cada 5 segundos
  const iniciarPolling = (transactionId: string, onPago: () => void) => {
    // Limpar polling anterior se existir
    pararPolling()

    pollingInterval = setInterval(async () => {
      const resultado = await verificarStatus(transactionId)

      if (resultado) {
        statusPagamento.value = resultado.status

        if (resultado.status === 'paid') {
          pararPolling()
          onPago()
        } else if (resultado.status === 'failed') {
          pararPolling()
        }
      }
    }, 5000) // Polling a cada 5 segundos
  }

  // Parar polling
  const pararPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = undefined
    }
  }

  // Limpar ao desmontar componente
  onUnmounted(() => {
    pararPolling()
  })

  return {
    pixData,
    loading,
    erro,
    statusPagamento,
    criarPix,
    verificarStatus,
    iniciarPolling,
    pararPolling
  }
}
