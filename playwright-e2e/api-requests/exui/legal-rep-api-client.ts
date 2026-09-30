import { APIRequestContext } from '@playwright/test';
import { BaseExuiApiClient } from './base-exui-api-client';
import {
  StartAppealApi,
  StartAppealResponseDataType,
  SubmitAppealApi,
  CreateServiceRequestApi,
  PaymentGroupsApi,
  CardPaymentApi,
} from './requests/index';
import { AppealMasterPayload, AppealMasterPayloadOptionsType } from './new-appeal-payload-builder/appeal-master-payload';
import { DataUtils } from '../../utils/data.utils.js';

export class LegalRepApiClient extends BaseExuiApiClient {
  private startAppealApi: StartAppealApi;
  private submitAppealApi: SubmitAppealApi;
  private createServiceRequestApi: CreateServiceRequestApi;
  private appealMasterPayload = new AppealMasterPayload();
  private paymentGroupsApi: PaymentGroupsApi;
  private cardPaymentApi: CardPaymentApi;
  private dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    super(apiContext);
    this.startAppealApi = new StartAppealApi(apiContext);
    this.submitAppealApi = new SubmitAppealApi(apiContext);
    this.createServiceRequestApi = new CreateServiceRequestApi(apiContext);
    this.cardPaymentApi = new CardPaymentApi(apiContext);
    this.paymentGroupsApi = new PaymentGroupsApi(apiContext);
  }

  public async createDraftAppealMasterApplication(appealData: AppealMasterPayloadOptionsType): Promise<StartAppealResponseDataType> {
    const HomeOfficeReferenceNumber = `HOR${await this.dataUtils.generateRandomNumber({ digitLength: 7 })}`;
    let decisionDate: { day: number; month: number; year: number };

    if (appealData.isApplicationInTime === 'Yes') {
      const inTimeDecisionDate = await this.dataUtils.getDateFromToday({ dayOffset: -5 });
      decisionDate = {
        day: inTimeDecisionDate.day,
        month: inTimeDecisionDate.month,
        year: inTimeDecisionDate.year,
      };
    } else {
      const outOfTimeDecisionDate = await this.dataUtils.getDateFromToday({ monthOffset: -2 });
      decisionDate = {
        day: outOfTimeDecisionDate.day,
        month: outOfTimeDecisionDate.month,
        year: outOfTimeDecisionDate.year,
      };
    }

    const appealMasterPayload = await this.appealMasterPayload.buildAppealMasterPayload({
      ...appealData,
      homeOfficeReferenceNumber: HomeOfficeReferenceNumber,
      decisionDate: decisionDate,
    });

    const caseId = await this.startAppealApi.submitEvent({ caseType: 'Asylum', payloadToSubmit: appealMasterPayload });
    return caseId;
  }

  public async createAndSubmitAppealMasterApplication(appealData: AppealMasterPayloadOptionsType): Promise<string> {
    const response = await this.createDraftAppealMasterApplication(appealData);
    const caseId = response.caseId;

    await this.submitAppealApi.submitEvent({ caseId: caseId });

    if (
      appealData.appealType !== 'Deprivation of citizenship' &&
      appealData.appealType !== 'Revocation of a protection status' &&
      appealData.feeRemissionType === 'The appellant is not eligible for a fee remission'
    ) {
      await this.createServiceRequestApi.submitEvent({ caseId: caseId });
      const paymentDetails = await this.paymentGroupsApi.get({ caseId: caseId });
      await this.cardPaymentApi.submitPayment({ serviceRequestReference: paymentDetails.payment_group_reference, amount: paymentDetails.amount_due });
    }

    return caseId;
  }
}
