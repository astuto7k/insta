<template>
  <div class="relative min-h-screen bg-[#0B0B0E] flex flex-col items-center pt-8 pb-12 overflow-x-hidden">
    <MatrixBackground />

    <div class="w-full max-w-[400px] px-4 relative z-10 flex flex-col gap-6">
      <!-- Hero Card -->
      <div class="bg-[#0F0F13]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">
        <AppLogo class="mb-8" />

        <h1 class="text-[28px] font-black leading-[1.2] tracking-tight text-white mb-4">
          O que seu <span class="text-[#d62b9d]">Cônjuge</span> faz quando está no Instagram?
        </h1>

        <template v-if="step === 'intro'">
          <p class="text-[#D62B9D] text-base font-medium leading-relaxed mb-8 px-2">
            Descubra a verdade sobre qualquer pessoa, acessando o instagram dela!
          </p>

          <button
            class="w-full h-16 bg-gradient-to-r from-[#d62b9d] to-[#e24db0] rounded-full flex items-center justify-center gap-3 text-white font-bold text-lg shadow-[0_8px_30px_rgba(214,43,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-transform mb-8 cursor-pointer"
            @click="step = 'input'"
          >
            <UIcon
              name="i-lucide-eye"
              class="w-6 h-6"
            />
            Espionar Agora
          </button>
        </template>

        <template v-else>
          <p class="text-[#D62B9D] text-base font-medium leading-relaxed mb-8 px-2">
            Digite o nome de usuário da pessoa a ser espionada, sem o arroba "@"
          </p>

          <form
            class="w-full mb-8 relative"
            @submit.prevent="handleSearch"
          >
            <div class="relative flex items-center">
              <span class="absolute left-6 text-[#d62b9d] text-xl font-bold">@</span>

              <input
                v-model="username"
                type="text"
                placeholder="Ex: nomedoconjuge"
                class="w-full h-16 bg-[#16161A] border border-[#2D2D33] rounded-[24px] pl-12 pr-16 text-white placeholder-[#52525C] text-sm font-medium focus:outline-none focus:border-[#d62b9d] focus:ring-1 focus:ring-[#d62b9d] transition-all"
                autofocus
              >

              <button
                v-if="username.length > 4"
                type="submit"
                :disabled="isLoading"
                class="absolute right-2 top-2 bottom-2 w-12 h-12 bg-[#d62b9d] rounded-full flex items-center justify-center hover:bg-[#b91e84] active:scale-95 transition-all shadow-[0_4px_12px_rgba(214,43,157,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UIcon
                  v-if="isLoading"
                  name="i-lucide-loader-2"
                  class="w-6 h-6 text-white animate-spin"
                />
                <UIcon
                  v-else
                  name="i-lucide-chevron-right"
                  class="w-6 h-6 text-white"
                />
              </button>
            </div>
          </form>
        </template>

        <div class="flex flex-wrap justify-center gap-x-6 gap-y-3">
          <div class="flex items-center gap-1.5 text-xs text-[#D62B9D] font-semibold">
            <UIcon
              name="i-lucide-lock"
              class="w-3.5 h-3.5 text-[#d62b9d]"
            />
            100% Anônimo
          </div>
          <div class="flex items-center gap-1.5 text-xs text-[#D62B9D] font-semibold">
            <UIcon
              name="i-lucide-key"
              class="w-3.5 h-3.5 text-[#d62b9d]"
            />
            Sem Senha
          </div>
          <div class="flex items-center gap-1.5 text-xs text-[#D62B9D] font-semibold">
            <UIcon
              name="i-lucide-check-circle"
              class="w-3.5 h-3.5 text-[#d62b9d]"
            />
            Teste Grátis
          </div>
        </div>
      </div>

      <!-- Stats Footer -->
      <div class="text-center">
        <p class="text-[#d62b9d] font-bold text-sm tracking-wide">
          <span class="text-white/90 font-black">+{{ analyticsCount }}</span>
          perfis analisados hoje ({{ currentDay }})
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StalkeaService } from '~/services/stalkea.service'

const router = useRouter()
const step = ref('intro')
const username = ref('')
const isLoading = ref(false)
const analyticsCount = ref('96.901')

const currentDay = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })
  .format(new Date())
  .split('-')[0]

onMounted(() => {
  const base = 109200
  analyticsCount.value = base.toLocaleString('pt-BR')

  setInterval(() => {
    const increment = Math.floor(Math.random() * 3)
    const current = parseInt(analyticsCount.value.replace(/\./g, ''))
    analyticsCount.value = (current + increment).toLocaleString('pt-BR')
  }, 3000)
})

const handleSearch = async () => {
  if (username.value.length < 3) return

  isLoading.value = true
  try {
    await StalkeaService.getProfile(username.value)
    router.push({
      path: '/analysis',
      query: { username: username.value }
    })
  } catch (error) {
    console.error('Search failed', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
:deep(body) {
  overflow-x: hidden;
}
</style>
