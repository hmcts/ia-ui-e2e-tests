import { APIRequestContext } from '@playwright/test';
import { CaseListApi, CaseDataApi } from './requests/index';
import { fetchedCaseInformation } from './requests/case-list.api';

export abstract class BaseExuiApiClient {
  private exui_caseListApi: CaseListApi;
  private exui_caseDataApi: CaseDataApi;

  constructor(apiContext: APIRequestContext) {
    this.exui_caseListApi = new CaseListApi(apiContext);
    this.exui_caseDataApi = new CaseDataApi(apiContext);
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

  public async fetchCaseOverviewData(option: { caseId: string }): Promise<JSON> {
    const caseData = await this.exui_caseDataApi.fetchCaseData({ caseId: option.caseId });
    return caseData;
  }
}
