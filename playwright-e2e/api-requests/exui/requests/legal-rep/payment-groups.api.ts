import { APIRequestContext, expect } from '@playwright/test';

export type PaymentGroup = {
  payment_group_reference: string;
  amount_due: number;
};

export class PaymentGroupsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async get(options: { caseId: string }): Promise<PaymentGroup> {
    let paymentGroup: PaymentGroup = { payment_group_reference: '', amount_due: 0 };

    await expect(async () => {
      const response = await this.apiContext.get(`payments/cases/${options.caseId}/paymentgroups`, {
        headers: {
          accept: 'application/json, text/plain, */*',
        },
      });

      await expect(response, {
        message: 'Verify response from payment groups api is successful',
      }).toBeOK();

      const body = await response.json();
      expect(body.payment_groups[0].payment_group_reference, 'Verify payment group reference is defined').toBeDefined();
      expect(body.payment_groups[0].fees[0].amount_due, 'Verify amount due is defined').toBeDefined();

      paymentGroup = {
        payment_group_reference: body.payment_groups[0].payment_group_reference,
        amount_due: body.payment_groups[0].fees[0].amount_due,
      };
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });

    return paymentGroup;
  }
}
