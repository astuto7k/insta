import type { ProdutoCheckout } from '~/types/payevo'

// Catálogo de produtos com preços em centavos e redirecionamento pós-pagamento
export const PRODUTOS: Record<string, ProdutoCheckout> = {
  'insta-espiao-vip': {
    id: 'insta-espiao-vip',
    nome: 'Acesso VIP Insta Espião',
    descricao: 'Acesso completo ao Insta Espião',
    precoEmCentavos: 3790,
    proximaPagina: '/sigilo'
  },
  'firewall-sigilo': {
    id: 'firewall-sigilo',
    nome: 'Firewall & Sigilo',
    descricao: 'Proteção total dos dados e identidade',
    precoEmCentavos: 1990,
    proximaPagina: '/planos'
  },
  'plano-gold': {
    id: 'plano-gold',
    nome: 'Plano Gold',
    descricao: 'Plano Gold - Acesso de 7 dias',
    precoEmCentavos: 6700,
    proximaPagina: null
  },
  'plano-diamond': {
    id: 'plano-diamond',
    nome: 'Plano Diamond',
    descricao: 'Plano Diamond - Acesso de 1 mês',
    precoEmCentavos: 9700,
    proximaPagina: null
  },
  'plano-premium': {
    id: 'plano-premium',
    nome: 'Plano Premium',
    descricao: 'Plano Premium - Acesso Vitalício',
    precoEmCentavos: 12700,
    proximaPagina: null
  }
}

export const APP_VERSION = '1.0.0'
