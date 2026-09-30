import { APIRequestContext, expect } from '@playwright/test';

export type StartAppealResponseDataType = {
  caseId: string;
};

export class StartAppealApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitEvent(options: { caseType: 'Asylum' | 'Bail'; payloadToSubmit: JSON }): Promise<StartAppealResponseDataType> {
    const eventName = options.caseType === 'Bail' ? 'startApplication' : 'startAppeal';
    let eventToken: string | undefined;

    await expect(async () => {
      const triggerResponse = await this.apiContext.get(
        `data/internal/case-types/${options.caseType}/event-triggers/${eventName}?ignore-warning=false`,
        {
          headers: {
            accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-start-case-trigger.v2+json;charset=UTF-8',
            experimental: 'true',
          },
        },
      );

      await expect(triggerResponse, { message: `Verify response when triggering event ${eventName} is successful` }).toBeOK();
      const responseBody = await triggerResponse.json();
      let eventTokenInPayload = responseBody.event_token;
      expect(eventTokenInPayload, { message: `Verify event token is defined when triggering event ${eventName}` }).toBeDefined();

      eventToken = eventTokenInPayload;
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });

    const submissionResponse = await this.apiContext.post(`data/case-types/${options.caseType}/cases?ignore-warning=false`, {
      timeout: 30_000,
      headers: {
        accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.create-case.v2+json;charset=UTF-8',
        experimental: 'true',
      },
      data: {
        data: options.payloadToSubmit,
        draft_id: null,
        event: { id: eventName, summary: '', description: '' },
        event_token: eventToken,
        ignore_warning: false,
      },
    });

    await expect(submissionResponse, { message: `Verify event submission is successful for event ${eventName}` }).toBeOK();

    const responseBody = await submissionResponse.json();

    const caseId = responseBody.id;
    expect(caseId, { message: `Verify case ID is defined after submitting event ${eventName}` }).toBeDefined();
    return { caseId };
  }
}
