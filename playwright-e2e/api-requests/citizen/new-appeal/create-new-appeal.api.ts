import { APIRequestContext, expect } from '@playwright/test';

export class CreateNewAppealApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async get(): Promise<void> {
    await expect(async () => {
      const response = await this.apiContext.get('create-new-appeal?Create+new+appeal=');
      await expect(response).toBeOK();
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });
  }
}
