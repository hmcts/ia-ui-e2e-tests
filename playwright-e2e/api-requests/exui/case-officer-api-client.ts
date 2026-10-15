import { APIRequestContext, expect } from '@playwright/test';
import { BaseExuiApiClient } from './base-exui-api-client';
import {
  RequestRespondentEvidenceApi,
  SendDirectionApi,
  RequestReasonsForAppealApi,
  RequestRespondentReviewApi,
  RequestResponseReviewApi,
  RequestHearingRequirementsApi,
  ReviewHearingRequirementsApi,
  CreateCaseSummaryApi,
  GenerateHearingBundleApi,
  DecisionAndReasonsStartedApi,
  CompleteCaseReviewApi,
  RequestCaseBuildingApi,
} from './requests/index';
import {
  RequestRespondentEvidenceEventType,
  SendDirectionEventType,
  RequestReasonsForAppealEventType,
  RequestRespondentReviewEventType,
  RequestResponseReviewEventType,
  ReviewHearingRequirementsEventType,
  CreateCaseSummaryEventType,
  DecisionAndReasonsStartedEventType,
  RequestCaseBuildingEventType,
  AddStatutoryTimeFrameEventType,
} from '../../exui-event-types';

export class CaseOfficerApiClient extends BaseExuiApiClient {
  private requestRespondentEvidenceApi: RequestRespondentEvidenceApi;
  private sendDirectionApi: SendDirectionApi;
  private requestReasonsForAppealApi: RequestReasonsForAppealApi;
  private requestRespondentReviewApi: RequestRespondentReviewApi;
  private requestResponseReviewApi: RequestResponseReviewApi;
  private requestHearingRequirementsApi: RequestHearingRequirementsApi;
  private reviewHearingRequirementsApi: ReviewHearingRequirementsApi;
  private createCaseSummaryApi: CreateCaseSummaryApi;
  private generateHearingBundleApi: GenerateHearingBundleApi;
  private decisionAndReasonsStartedApi: DecisionAndReasonsStartedApi;
  private completeCaseReviewApi: CompleteCaseReviewApi;
  private requestCaseBuildingApi: RequestCaseBuildingApi;

  constructor(apiContext: APIRequestContext) {
    super(apiContext);
    this.requestRespondentEvidenceApi = new RequestRespondentEvidenceApi(apiContext);
    this.sendDirectionApi = new SendDirectionApi(apiContext);
    this.requestReasonsForAppealApi = new RequestReasonsForAppealApi(apiContext);
    this.requestRespondentReviewApi = new RequestRespondentReviewApi(apiContext);
    this.requestResponseReviewApi = new RequestResponseReviewApi(apiContext);
    this.requestHearingRequirementsApi = new RequestHearingRequirementsApi(apiContext);
    this.reviewHearingRequirementsApi = new ReviewHearingRequirementsApi(apiContext);
    this.createCaseSummaryApi = new CreateCaseSummaryApi(apiContext);
    this.generateHearingBundleApi = new GenerateHearingBundleApi(apiContext);
    this.decisionAndReasonsStartedApi = new DecisionAndReasonsStartedApi(apiContext);
    this.completeCaseReviewApi = new CompleteCaseReviewApi(apiContext);
    this.requestCaseBuildingApi = new RequestCaseBuildingApi(apiContext);
  }

  public async submitCompleteCaseReviewEvent(options: { caseId: string }): Promise<void> {
    await this.verifyCaseIsInExpectedState({
      caseId: options.caseId,
      expectedStateName: 'Appeal submitted',
    });
    await this.completeCaseReviewApi.submitEvent(options);
  }

  public async submitRequestRespondentEvidenceEvent(options: RequestRespondentEvidenceEventType): Promise<void> {
    await this.requestRespondentEvidenceApi.submitEvent(options);
  }

  public async submitSendDirectionEvent(options: SendDirectionEventType): Promise<void> {
    await this.sendDirectionApi.submitEvent(options);
  }

  public async submitRequestReasonsForAppealEvent(options: RequestReasonsForAppealEventType): Promise<void> {
    await this.requestReasonsForAppealApi.submitEvent(options);
  }

  public async submitRequestRespondentReviewEvent(options: RequestRespondentReviewEventType): Promise<void> {
    await this.requestRespondentReviewApi.submitEvent(options);
  }

  public async submitRequestResponseReviewEvent(options: RequestResponseReviewEventType): Promise<void> {
    await this.requestResponseReviewApi.submitEvent(options);
  }

  public async submitRequestHearingRequirementsEvent(options: { caseId: string }): Promise<void> {
    await this.requestHearingRequirementsApi.submitEvent(options);
  }

  public async submitReviewHearingRequirementsEvent(options: ReviewHearingRequirementsEventType): Promise<void> {
    await this.reviewHearingRequirementsApi.submitEvent(options);
  }

  public async submitCreateCaseSummaryEvent(options: CreateCaseSummaryEventType): Promise<void> {
    await this.createCaseSummaryApi.submitEvent(options);
  }

  public async submitGenerateHearingBundleEvent(options: { caseId: string }): Promise<void> {
    await this.generateHearingBundleApi.submitEvent(options);
  }

  public async submitDecisionAndReasonsStartedEvent(options: DecisionAndReasonsStartedEventType): Promise<void> {
    await this.verifyCaseIsInExpectedState({
      caseId: options.caseId,
      expectedStateName: 'Pre hearing',
    });

    await this.decisionAndReasonsStartedApi.submitEvent(options);
  }

  public async submitRequestCaseBuildingEvent(options: RequestCaseBuildingEventType): Promise<void> {
    await this.requestCaseBuildingApi.submitEvent(options);
  }

  public async submitAddStatutoryTimeFrameEvent(options: AddStatutoryTimeFrameEventType): Promise<void> {
    await this.addStatutoryTimeFrame(options);
  }
}
