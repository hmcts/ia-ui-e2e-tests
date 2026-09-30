import { APIRequestContext, expect } from '@playwright/test';

export interface fetchedCaseInformation {
  caseId: string;
  appealReference: string;
}

export class CaseListApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async searchForCase(options: { homeOfficeReferenceNumber: string }): Promise<fetchedCaseInformation> {
    let caseId: string;
    let appealReference: string;

    await expect(async () => {
      const response = await this.apiContext.post('/data/internal/searchCases', {
        params: {
          ctid: 'Asylum',
          use_case: 'WORKBASKET',
          view: 'WORKBASKET',
          page: '1',
          'case.homeOfficeReferenceNumber': options.homeOfficeReferenceNumber,
        },
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        data: {
          size: 25,
        },
      });
      await expect(response).toBeOK();

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('results');
      expect(Array.isArray(responseBody.results)).toBe(true);
      expect(responseBody.results).toHaveLength(1);

      caseId = responseBody.results[0].case_id;
      appealReference = responseBody.results[0].case_fields.appealReferenceNumber;
      expect(caseId).toBeDefined();
      expect(appealReference).toBeDefined();
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });

    return {
      caseId: caseId!,
      appealReference: appealReference!,
    };
  }
}
