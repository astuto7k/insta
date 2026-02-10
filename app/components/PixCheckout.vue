<script setup lang="ts">
import type { PixCheckoutData } from '~/types/payevo'

const props = defineProps<{
  pixData?: PixCheckoutData | null
  loading: boolean
  erro?: string | null
  statusPagamento: 'pending' | 'paid' | 'failed'
}>()

const emit = defineEmits<{
  (e: 'tentar-novamente'): void
}>()

const copiado = ref(false)

const copiarCodigo = async () => {
  if (!props.pixData?.pixCopyPaste) return

  try {
    await navigator.clipboard.writeText(props.pixData.pixCopyPaste)
    copiado.value = true
    setTimeout(() => {
      copiado.value = false
    }, 2000)
  } catch (err) {
    console.error('Falha ao copiar:', err)
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center gap-6">
    
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center gap-4 py-8">
      <div class="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <p class="text-gray-400 text-sm animate-pulse">Gerando PIX...</p>
    </div>

    <!-- Erro State (RAW para debug do usuario) -->
    <div v-else-if="erro" class="flex flex-col items-center gap-4 bg-red-500/10 border border-red-500/30 p-6 rounded-2xl w-full max-w-md">
      <div class="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 shrink-0">
        <Icon name="lucide:alert-circle" class="w-6 h-6" />
      </div>
      <div class="text-center space-y-2 w-full">
        <p class="text-red-400 font-bold block">Falha na PayEvo</p>
        <div class="bg-black/50 p-3 rounded-lg text-left overflow-x-auto">
             <code class="text-red-300 text-xs font-mono break-words whitespace-pre-wrap">{{ erro }}</code>
        </div>
        <p class="text-gray-500 text-xs mt-2">Envie este erro para o suporte da PayEvo.</p>
      </div>
      <button 
        @click="emit('tentar-novamente')"
        class="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
      >
        Tentar Novamente
      </button>
    </div>

    <!-- QR Code + Copia e Cola -->
    <template v-else-if="pixData">
      
      <!-- Status Pagamento -->
      <div v-if="statusPagamento === 'paid'" class="flex flex-col items-center gap-2 animate-bounce">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
            <Icon name="lucide:check" class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-green-400 font-bold text-xl">Pagamento Aprovado!</h3>
        <p class="text-gray-400 text-sm">Redirecionando...</p>
      </div>

      <div v-else class="w-full flex flex-col items-center gap-6">
          <p class="text-gray-200 text-center font-medium">
            Escaneie o QR Code ou copie o código para pagar
          </p>

          <!-- QR Code Container -->
          <div class="bg-white p-4 rounded-2xl shadow-lg">
             <img 
               v-if="pixData.qrCode" 
               :src="pixData.qrCode.startsWith('http') || pixData.qrCode.startsWith('data:') ? pixData.qrCode : `data:image/png;base64,${pixData.qrCode}`" 
               alt="QR Code PIX" 
               class="max-w-[200px] h-auto object-contain"
             />
             <div v-else class="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-4">
                 QR Code Indisponível (use Copia e Cola)
             </div>
          </div>

          <!-- Copia e Cola -->
          <div class="w-full max-w-md bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-gray-400 text-xs uppercase tracking-wider font-bold">PIX Copia e Cola</span>
            </div>
            <div class="flex gap-2">
                <input 
                  readonly 
                  :value="pixData.pixCopyPaste"
                  class="flex-1 bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 text-xs font-mono focus:outline-none focus:border-purple-500 transition-colors truncate"
                  @click="($event.target as HTMLInputElement)?.select()"
                />
                <button 
                  @click="copiarCodigo"
                  class="shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center"
                  :class="copiado ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'"
                >
                  <Icon :name="copiado ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
                  {{ copiado ? 'Copiado!' : 'Copiar' }}
                </button>
            </div>
          </div>
          
          <!-- Instructions -->
          <div class="text-center space-y-1">
              <p class="text-gray-400 text-xs">
                 1. Abra o app do seu banco
              </p>
              <p class="text-gray-400 text-xs">
                 2. Escolha pagar via PIX com Copia e Cola ou QR Code
              </p>
              <p class="text-gray-400 text-xs">
                 3. Após pagar, aguarde a confirmação automática nesta tela.
              </p>
          </div>
          
          <div class="mt-4 flex items-center gap-2 text-purple-400/60 text-xs animate-pulse">
               <div class="w-2 h-2 bg-purple-500 rounded-full" />
               Aguardando pagamento...
          </div>
      </div>

    </template>
  </div>
</template>
