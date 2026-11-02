import { APIRequestContext, expect } from '@playwright/test';

export class CasesListApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async get(): Promise<string> {
    let result: string;

    await expect(async () => {
      const response = await this.apiContext.get('cases-list');
      await expect(response).toBeOK();
      result = await response.text();
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });

    return result!;
  }
}
