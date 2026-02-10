// Tipagens para a API PayEvo v2

// Produto interno do catálogo
export interface ProdutoCheckout {
    id: string
    nome: string
    descricao: string
    precoEmCentavos: number
    // Página para redirecionar após pagamento confirmado (null = página final)
    proximaPagina: string | null
}

// Request para criar transação PIX na PayEvo
export interface CriarPixRequest {
    amount: number // valor em centavos
    currency: 'BRL'
    description: string
    payment_method: 'pix'
}

// Resposta da PayEvo ao criar transação PIX
export interface CriarPixResponse {
    transaction_id: string
    status: 'pending' | 'paid' | 'failed'
    qr_code: string // código EMV do PIX
    pix_copy_paste: string // código copia e cola
}

// Resposta da PayEvo ao consultar status
export interface StatusPixResponse {
    transaction_id: string
    status: 'pending' | 'paid' | 'failed'
    qr_code: string
    pix_copy_paste: string
}

// Payload do webhook PayEvo
export interface WebhookPayload {
    transaction_id: string
    status: 'pending' | 'paid' | 'failed'
}

// Resposta da API route /api/payevo/criar-pix para o frontend
export interface PixCheckoutData {
    transactionId: string
    status: string
    qrCode: string
    pixCopyPaste: string
    valor: number
    nomeProduto: string
    proximaPagina: string | null
}
