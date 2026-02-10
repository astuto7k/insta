<template>
  <div class="min-h-screen bg-black text-white font-sans flex flex-col overflow-hidden max-w-[450px] mx-auto relative shadow-2xl border-x border-gray-800">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-900/50 via-[#0f0f11] to-purple-900/50 border-b border-gray-800 p-4 text-center relative z-20">
      <div class="flex items-center justify-center gap-2">
        <UIcon
          name="i-lucide-search"
          class="w-5 h-5 text-purple-500"
        />
        <span class="font-bold text-white tracking-widest text-sm">INSTA <span class="text-purple-500">ESPIÃO</span></span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col px-6 pt-6 pb-12 overflow-y-auto">
      <!-- Title -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600/20 to-purple-900/20 rounded-2xl mb-4 border border-purple-500/20">
          <UIcon
            name="i-lucide-qr-code"
            class="w-7 h-7 text-purple-400"
          />
        </div>

        <h1 class="text-xl font-bold mb-2">
          Pagamento via <span class="text-purple-400">PIX</span>
        </h1>
        <p class="text-gray-400 text-sm leading-relaxed">
          Escaneie o QR Code ou copie o código para pagar
        </p>
      </div>

      <!-- PIX Checkout Component -->
      <PixCheckout
        :pix-data="pixData"
        :loading="loading"
        :erro="erro"
        :status-pagamento="statusPagamento"
        @retry="gerarPix"
      />

      <!-- Timer de expiração -->
      <div
        v-if="pixData && statusPagamento === 'pending'"
        class="mt-6 text-center"
      >
        <div class="flex items-center justify-center gap-2 text-gray-400">
          <UIcon
            name="i-lucide-clock"
            class="w-4 h-4"
          />
          <span class="text-xs">PIX expira em <strong class="text-white">{{ tempoRestante }}</strong></span>
        </div>
      </div>

      <!-- Garantia -->
      <div class="mt-8 bg-[#040f08] border border-green-500/20 rounded-2xl p-4 text-center">
        <div class="flex items-center justify-center gap-2 mb-2">
          <UIcon
            name="i-lucide-shield-check"
            class="w-5 h-5 text-green-500"
          />
          <span class="text-green-500 font-bold text-sm">Garantia de 30 Dias</span>
        </div>
        <p class="text-gray-400 text-[11px] leading-relaxed">
          Não gostou? Devolvemos 100% do seu dinheiro.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex flex-col items-center gap-1 py-4 opacity-50">
      <div class="flex items-center gap-1">
        <UIcon
          name="i-lucide-search"
          class="w-3 h-3 text-white"
        />
        <span class="font-bold text-white text-[10px] tracking-widest">INSTA <span class="text-purple-500">ESPIÃO</span></span>
      </div>
      <p class="text-[9px] text-gray-500">
        © 2025 Insta Espião — Todos os direitos reservados.®
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRODUTOS } from '~/utils/constants'

// SEO
useHead({
  title: 'Pagamento PIX | Insta Espião',
  meta: [
    { name: 'description', content: 'Complete seu pagamento via PIX para acessar o Insta Espião' },
    { name: 'theme-color', content: '#000000' }
  ]
})

// Dark mode
const colorMode = useColorMode()
colorMode.preference = 'dark'

// Query params
const route = useRoute()
const produtoId = computed(() => route.query.produto as string)
const username = computed(() => route.query.username as string || '')

// Composable de pagamento
const { pixData, loading, erro, statusPagamento, criarPix, iniciarPolling } = usePixPayment()

// Timer de expiração do PIX (30 minutos)
const tempoExpiracao = ref(30 * 60) // 30 minutos em segundos
let timerInterval: ReturnType<typeof setInterval> | undefined

const tempoRestante = computed(() => {
  const mins = Math.floor(tempoExpiracao.value / 60)
  const secs = tempoExpiracao.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

// Gerar PIX
const gerarPix = async () => {
  if (!produtoId.value) return

  const resultado = await criarPix(produtoId.value)

  if (resultado) {
    // Iniciar polling de status
    iniciarPolling(resultado.transactionId, () => {
      // Callback quando pagamento for confirmado
      handlePagamentoConfirmado()
    })

    // Iniciar timer de expiração
    iniciarTimerExpiracao()
  }
}

// Handler de pagamento confirmado
const handlePagamentoConfirmado = () => {
  // Parar timer de expiração
  if (timerInterval) {
    clearInterval(timerInterval)
  }

  // Aguardar 3 segundos para o usuário ver a confirmação, depois redirecionar
  setTimeout(() => {
    const proximaPagina = pixData.value?.proximaPagina

    if (proximaPagina) {
      // Se tem upsell/próxima oferta, redirecionar para ela
      navigateTo({
        path: proximaPagina,
        query: username.value ? { username: username.value } : undefined
      })
    } else {
      // Sem próxima oferta — redirecionar para o feed (página final)
      navigateTo({
        path: '/feed',
        query: username.value ? { username: username.value } : undefined
      })
    }
  }, 3000)
}

// Timer de expiração
const iniciarTimerExpiracao = () => {
  tempoExpiracao.value = 30 * 60

  timerInterval = setInterval(() => {
    tempoExpiracao.value--
    if (tempoExpiracao.value <= 0) {
      clearInterval(timerInterval)
      // PIX expirou — pode gerar um novo
      erro.value = 'O PIX expirou. Gere um novo código.'
      statusPagamento.value = 'error'
    }
  }, 1000)
}

// Validação do produto
onMounted(() => {
  if (!produtoId.value || !PRODUTOS[produtoId.value]) {
    // Produto inválido — redirecionar de volta
    navigateTo('/')
    return
  }

  // Gerar PIX automaticamente ao abrir a página
  gerarPix()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>
