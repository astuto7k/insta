// POST /api/payevo/criar-pix
// Rota final usando o serviço estrito

import { createPixTransaction } from '../../services/payevo.service'

const PRODUTOS: Record<string, { valor: number, descricao: string, nome: string, proximaPagina: string | null }> = {
  'insta-espiao-vip': { valor: 2490, descricao: 'Acesso completo ao Insta Espião', nome: 'Acesso VIP Insta Espião', proximaPagina: '/sigilo' },
  'firewall-sigilo': { valor: 1990, descricao: 'Proteção total dos dados e identidade', nome: 'Firewall & Sigilo', proximaPagina: '/planos' },
  'plano-gold': { valor: 6700, descricao: 'Plano Gold - Acesso de 7 dias', nome: 'Plano Gold', proximaPagina: null },
  'plano-diamond': { valor: 9700, descricao: 'Plano Diamond - Acesso de 1 mês', nome: 'Plano Diamond', proximaPagina: null },
  'plano-premium': { valor: 12700, descricao: 'Plano Premium - Acesso Vitalício', nome: 'Plano Premium', proximaPagina: null }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { produtoId } = body

    if (!produtoId) throw new Error('produtoId não informado')

    const produto = PRODUTOS[produtoId]
    if (!produto) throw new Error(`Produto não encontrado: ${produtoId}`)

    // Tenta criar PIX via serviço
    const pix = await createPixTransaction({
      amount: produto.valor,
      description: produto.descricao
    })

    // Mapeamento correto dos campos da resposta PayEvo V2
    // O campo "qrcode" retornado pela API é na verdade o texto EMV (Copia e Cola)
    const pixCopyPaste = pix.pix?.qrcode || ''

    // Geramos a imagem visualmente usando uma API pública para evitar dependências extras no front
    const qrCodeImage = pixCopyPaste
      ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopyPaste)}`
      : ''

    return {
      success: true,
      transactionId: pix.id,
      status: pix.status,
      pixCopyPaste: pixCopyPaste,
      qrCode: qrCodeImage,
      valor: produto.valor,
      nomeProduto: produto.nome,
      proximaPagina: produto.proximaPagina
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('[PayEvo API] Falha:', errorMessage)

    // Retorna erro 500 para o frontend exibir a mensagem
    setResponseStatus(event, 500)
    return {
      success: false,
      message: errorMessage
    }
  }
})
