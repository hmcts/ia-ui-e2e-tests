import { APIRequestContext, expect } from '@playwright/test';
import { CaseListApi, CaseDataApi, StatutoryTimeFrameApi } from './requests/index';
import { fetchedCaseInformation } from './requests/case-list.api';
import { AddStatutoryTimeFrameEventType } from '../../exui-event-types';

type ExpectedApplicationStates =
  | 'Appeal started'
  | 'Appeal submitted'
  | 'Awaiting respondent evidence'
  | 'Pre hearing'
  | 'Case building'
  | 'Case under review'
  | 'Submit hearing requirements';

export abstract class BaseExuiApiClient {
  private exui_caseListApi: CaseListApi;
  private exui_caseDataApi: CaseDataApi;
  private exui_statutoryTimeFrameApi: StatutoryTimeFrameApi;

  constructor(apiContext: APIRequestContext) {
    this.exui_caseListApi = new CaseListApi(apiContext);
    this.exui_caseDataApi = new CaseDataApi(apiContext);
    this.exui_statutoryTimeFrameApi = new StatutoryTimeFrameApi(apiContext);
  }

  public async searchForACaseList(option: { homeOfficeReferenceNumber: string }): Promise<fetchedCaseInformation> {
    const caseData = await this.exui_caseListApi.searchForCase({ homeOfficeReferenceNumber: option.homeOfficeReferenceNumber });
    return caseData;
  }

  public async fetchCaseId(option: { homeOfficeReferenceNumber: string }): Promise<string> {
    const caseData = this.searchForACaseList({ homeOfficeReferenceNumber: option.homeOfficeReferenceNumber });
    return caseData.then((caseData) => caseData.caseId);
  }

  public async fetchAppealReference(option: { homeOfficeReferenceNumber: string }): Promise<string> {
    const caseData = this.searchForACaseList({ homeOfficeReferenceNumber: option.homeOfficeReferenceNumber });
    return caseData.then((caseData) => caseData.appealReference);
  }

  private async fetchCaseOverviewData(option: { caseId: string }): Promise<JSON> {
    const caseData = await this.exui_caseDataApi.fetchCaseData({ caseId: option.caseId });
    return caseData;
  }

  public async verifyCaseIsInExpectedState(options: {
    caseId: string;
    expectedStateName: ExpectedApplicationStates | ExpectedApplicationStates[];
  }): Promise<void> {
    await expect(async () => {
      const caseData = await this.fetchCaseOverviewData({ caseId: options.caseId });
      const actualState = (caseData as any).state.name;

      if (Array.isArray(options.expectedStateName)) {
        expect(options.expectedStateName, {
          message: `Expected state to be one of ${JSON.stringify(options.expectedStateName)}, but got "${actualState}"`,
        }).toEqual(expect.arrayContaining([actualState]));
      } else {
        expect(actualState, {
          message: `Expected ${options.expectedStateName} but got ${actualState}`,
        }).toBe(options.expectedStateName);
      }
    }).toPass({
      timeout: 60_000,
      intervals: [2_000],
    });
  }

  protected async addStatutoryTimeFrame(options: AddStatutoryTimeFrameEventType): Promise<void> {
    await this.verifyCaseIsInExpectedState({
      caseId: options.caseId,
      expectedStateName: ['Appeal submitted', 'Awaiting respondent evidence'],
    });
    await this.exui_statutoryTimeFrameApi.submitEvent(options);
  }
}
