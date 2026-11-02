import { APIRequestContext, expect } from '@playwright/test';
import { CasesListApi } from '../index';

export class CreateNewAppealApi {
  private apiContext: APIRequestContext;
  private casesListApi: CasesListApi;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
    this.casesListApi = new CasesListApi(apiContext);
  }

  public async post(): Promise<void> {
    const casesList = await this.casesListApi.get();
    const csrfToken = casesList.match(/name="_csrf"\s+value="([^"]+)"/)?.[1];

    if (!csrfToken) {
      throw new Error('CSRF token not found in cases-list HTML');
    }

    await expect(async () => {
      const response = await this.apiContext.post('create-new-appeal', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        form: {
          _csrf: csrfToken,
          'Create new appeal': '',
        },
      });

      await expect(response).toBeOK();
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });
  }
}
