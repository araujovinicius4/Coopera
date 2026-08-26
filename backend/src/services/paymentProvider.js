// Contrato deliberadamente inativo. Nenhum pagamento é simulado como real.
export class PaymentProvider {
  async createCheckout() { throw new Error('Provedor de pagamento não configurado.'); }
  async verifyWebhook() { throw new Error('Provedor de pagamento não configurado.'); }
}
