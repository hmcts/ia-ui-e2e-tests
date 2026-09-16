import { APIRequestContext, expect } from '@playwright/test';
import { DataUtils } from '../../../../utils';

export class CardPaymentApi {
  private apiContext: APIRequestContext;
  private dataUtils: DataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitPayment(options: { serviceRequestReference: string; amount: number }): Promise<void> {
    await expect(async () => {
      const createPaymentResponse = await this.apiContext.post(`payments/service-request/${options.serviceRequestReference}/card-payments`, {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
        },
        data: {
          amount: options.amount,
          currency: 'GBP',
          language: 'en',
          'return-url': 'https://paymentoutcome-web.aat.platform.hmcts.net/payment',
        },
        maxRedirects: 0,
      });

      const body = await createPaymentResponse.json();

      const paymentUrl = body.next_url;

      if (!paymentUrl) {
        throw new Error('Next payment URL not found in GOV.UK Pay response');
      }
      // Load GOV.UK Pay card details page
      const paymentPageResponse = await this.apiContext.get(paymentUrl);

      await expect(paymentPageResponse, {
        message: 'Verify response from GOV.UK Pay card details page is successful',
      }).toBeOK();

      const paymentPageHtml = await paymentPageResponse.text();

      const paymentPageCsrf = paymentPageHtml.match(/name="csrfToken".*?value="([^"]+)"/)?.[1];

      if (!paymentPageCsrf) {
        throw new Error('Could not extract initial csrfToken from GOV.UK Pay page');
      }

      const paymentId = paymentPageResponse.url().replace(/\/$/, '').split('/').pop();

      if (!paymentId) {
        throw new Error('Could not extract payment ID from GOV.UK Pay URL');
      }

      const submissionBaseUrl = `https://card.payments.service.gov.uk/card_details/${paymentId}`;

      const paymentDetails = await this.dataUtils.generatePaymentDetails();

      // Submit card details
      const submitDetailsResponse = await this.apiContext.post(submissionBaseUrl, {
        form: {
          chargeId: paymentId,
          csrfToken: paymentPageCsrf,
          cardNo: paymentDetails.cardNumber,
          expiryMonth: paymentDetails.expiryMonth,
          expiryYear: paymentDetails.expiryYear,
          cardholderName: paymentDetails.nameOnCard,
          cvc: paymentDetails.securityCode,
          addressLine1: paymentDetails.addressLine1,
          addressLine2: '',
          addressCity: paymentDetails.townOrCity,
          addressCountry: 'GB',
          addressPostcode: paymentDetails.postcode,
          email: paymentDetails.email,
        },
      });

      await expect(submitDetailsResponse, {
        message: 'Verify response from GOV.UK Pay card details submission is successful',
      }).toBeOK();

      // Extract CSRF token from confirmation page
      const confirmPaymentHtml = await submitDetailsResponse.text();

      const confirmPaymentCsrf = confirmPaymentHtml.match(/name="csrfToken".*?value="([^"]+)"/)?.[1];

      if (!confirmPaymentCsrf) {
        throw new Error('Could not extract confirmation csrfToken');
      }

      // Confirm payment
      const confirmPaymentResponse = await this.apiContext.post(`${submissionBaseUrl}/confirm`, {
        form: {
          csrfToken: confirmPaymentCsrf,
          chargeId: paymentId,
        },
      });

      await expect(confirmPaymentResponse, {
        message: 'Verify response from GOV.UK Pay confirmation page is successful',
      }).toBeOK();
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });
  }
}
