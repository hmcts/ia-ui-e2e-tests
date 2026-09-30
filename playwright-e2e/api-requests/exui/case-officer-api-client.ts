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
  }

  public async submitCompleteCaseReviewEvent(options: { caseId: string }): Promise<void> {
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
    await expect(async () => {
      const caseData = await this.fetchCaseOverviewData({ caseId: options.caseId });
      const caseDataString = JSON.stringify(caseData);

      const hasInstructionText = caseDataString.includes('You can start to create the decision and reasons document');

      expect(hasInstructionText, `Waiting for "Decision and Reasons" event to be available on case ${options.caseId}`).toBeTruthy();
    }).toPass({
      timeout: 60_000,
      intervals: [2_000],
    });

    await this.decisionAndReasonsStartedApi.submitEvent(options);
  }
}
