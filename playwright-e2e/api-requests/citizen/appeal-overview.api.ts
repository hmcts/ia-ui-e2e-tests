import { APIRequestContext, expect } from '@playwright/test';

export class AppealOverviewApi {
  constructor(private readonly apiContext: APIRequestContext) {}

  public async get(options: { caseId: string }): Promise<string> {
    let responseHtml!: string;

    await expect(async () => {
      const response = await this.apiContext.get(`load-case?caseId=${encodeURIComponent(options.caseId)}`);

      await expect(response).toBeOK();

      expect(response.url()).toContain('/appeal-overview');

      const html = await response.text();
      expect(html).toBeDefined();

      responseHtml = html;
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });

    return responseHtml;
  }
}
