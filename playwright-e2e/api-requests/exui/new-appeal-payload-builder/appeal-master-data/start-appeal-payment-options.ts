interface StartAppealPaymentOptionsData {
  paAppealTypePaymentOption: 'payNow' | 'payLater';
}

export class StartAppealPaymentOptions {
  public async paymentOptions(paymentOption: 'payNow' | 'payLater'): Promise<StartAppealPaymentOptionsData> {
    return {
      paAppealTypePaymentOption: paymentOption,
    };
  }
}
