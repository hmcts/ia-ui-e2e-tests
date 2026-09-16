import { APIRequestContext } from '@playwright/test';
import { exui_submitEvent, exui_triggerEvent } from '../../../../utils/api-requests-utils';

export class SubmitAppealApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'submitAppeal';

  public async submitEvent(options: { caseId: string }): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = [
      'appealType',
      'appellantInDetention',
      'feeAmountGbp',
      'helpWithFeesOption',
      'isAdmin',
      'isNotificationTurnedOff',
      'legalRepDeclaration',
      'paAppealTypePaymentOption',
      'remissionClaim',
      'remissionOption',
      'remissionType',
    ];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'legalRepDeclaration') acc[key] = ['hasDeclared'];
      else acc[key] = triggerResponse.rawCaseData[key];
      return acc;
    }, {});

    await exui_submitEvent({
      apiContext: this.apiContext,
      caseId: options.caseId,
      eventName: this.eventName,
      eventToken: triggerResponse.eventToken,
      payload: finalData,
    });
  }
}
