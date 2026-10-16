import { APIRequestContext } from '@playwright/test';
import { BaseExuiApiClient } from './base-exui-api-client';
import { GenerateDecisionAndReasonsApi, sendDecisionAndReasonsApi } from './requests';
import { GenerateDecisionAndReasonsEventType, SendDecisionAndReasonsEventType, AddStatutoryTimeFrameEventType } from '../../exui-event-types';

export class JudgeApiClient extends BaseExuiApiClient {
  private generateDecisionAndReasonsApi: GenerateDecisionAndReasonsApi;
  private sendDecisionAndReasonsApi: sendDecisionAndReasonsApi;

  constructor(apiContext: APIRequestContext) {
    super(apiContext);
    this.generateDecisionAndReasonsApi = new GenerateDecisionAndReasonsApi(apiContext);
    this.sendDecisionAndReasonsApi = new sendDecisionAndReasonsApi(apiContext);
  }

  public async submitGenerateDecisionAndReasonsEvent(options: GenerateDecisionAndReasonsEventType): Promise<void> {
    await this.generateDecisionAndReasonsApi.submitEvent(options);
  }

  public async submitSendDecisionAndReasonsEvent(options: SendDecisionAndReasonsEventType): Promise<void> {
    await this.sendDecisionAndReasonsApi.submitEvent(options);
  }

  public async submitAddStatutoryTimeFrameEvent(options: AddStatutoryTimeFrameEventType): Promise<void> {
    await this.addStatutoryTimeFrame(options);
  }
}
