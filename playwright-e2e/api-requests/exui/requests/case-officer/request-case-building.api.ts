import { APIRequestContext } from '@playwright/test';
import { RequestCaseBuildingEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class RequestCaseBuildingApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'requestCaseBuilding';

  public async submitEvent(options: RequestCaseBuildingEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = [
      'appellantInDetention',
      'isAdmin',
      'isNotificationTurnedOff',
      'sendDirectionDateDue',
      'sendDirectionExplanation',
      'sendDirectionParties',
    ];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, string>, key) => {
      if (key === 'sendDirectionDateDue' && options.sendDirectionDateDue) {
        const { day, month, year } = options.sendDirectionDateDue;
        const yyyy = year.toString();
        const mm = month.toString().padStart(2, '0');
        const dd = day.toString().padStart(2, '0');

        acc[key] = `${yyyy}-${mm}-${dd}`;
      } else if (key === 'sendDirectionExplanation' && options.sendDirectionExplanation) acc[key] = options.sendDirectionExplanation;
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
