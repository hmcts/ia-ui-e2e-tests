import { APIRequestContext } from '@playwright/test';
import { BaseExuiApiClient } from './base-exui-api-client';
import { RemissionDecisionApi, RequestAHearingApi, ListCaseApi } from './requests/index';
import { RemissionDecisionEventType, RequestAHearingEventType, ListCaseEventType, AddStatutoryTimeFrameEventType } from '../../exui-event-types';

export class AdminOfficerApiClient extends BaseExuiApiClient {
  private remissionDecisionApi: RemissionDecisionApi;
  private requestAHearingApi: RequestAHearingApi;
  private listCaseApi: ListCaseApi;

  constructor(apiContext: APIRequestContext) {
    super(apiContext);
    this.remissionDecisionApi = new RemissionDecisionApi(apiContext);
    this.requestAHearingApi = new RequestAHearingApi(apiContext);
    this.listCaseApi = new ListCaseApi(apiContext);
  }

  public async submitRemissionDecisionEvent(options: RemissionDecisionEventType): Promise<void> {
    await this.remissionDecisionApi.submitEvent(options);
  }

  public async submitRequestAHearingEvent(options: RequestAHearingEventType): Promise<string> {
    const hearingId = await this.requestAHearingApi.submitRequestForHearing(options);
    return hearingId;
  }

  public async submitListCaseEvent(options: ListCaseEventType): Promise<void> {
    await this.listCaseApi.submitEvent(options);
  }

  public async submitAddStatutoryTimeFrameEvent(options: AddStatutoryTimeFrameEventType): Promise<void> {
    await this.addStatutoryTimeFrame(options);
  }
}
