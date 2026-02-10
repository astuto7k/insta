// Catálogo de produtos — server-side (duplicado do frontend para segurança)
// Garante que o backend sempre usa os valores corretos, mesmo se o frontend for manipulado

interface ProdutoServer {
    id: string
    nome: string
    descricao: string
    precoEmCentavos: number
    proximaPagina: string | null
}

export const PRODUTOS_SERVER: Record<string, ProdutoServer> = {
    'insta-espiao-vip': {
        id: 'insta-espiao-vip',
        nome: 'Acesso VIP Insta Espião',
        descricao: 'Acesso completo ao Insta Espião',
        precoEmCentavos: 2490,
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
