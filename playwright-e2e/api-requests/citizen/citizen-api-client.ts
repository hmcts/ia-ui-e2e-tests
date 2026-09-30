import { expect } from '@playwright/test';
import { ApiContext } from '../api-context';
import { AppealData, AppealReasonsFlowType, HearingRequestsFlowType } from '../../citizen-types';
import { ApplicantDetailsType } from '../../user-flows/citizen/api';
import { AppealOverviewApi, HearingCheckAnswersApi, CreateNewAppealApi } from './index';
import { load } from 'cheerio';

import {
  YourDetailsUserFlowApi,
  DecisionTypeUserFlowApi,
  FeeSupportUserFlowApi,
  CheckAndSendUserFlowApi,
  AppealReasonsUserFlowApi,
  HearingWitnessUserFlowApi,
  HearingWitnessFlowReturnType,
  HearingAccessNeedsUserFlowApi,
  HearingAccessNeedsFlowReturnType,
  HearingOtherNeedsUserFlowApi,
  HearingOtherNeedsFlowReturnType,
  HearingDatesToAvoidUserFlowApi,
  HearingDatesToAvoidFlowReturnType,
} from '../../user-flows/citizen/api';

export class CitizenApiClient {
  private readonly apiContext: ApiContext;

  private newAppealDetails: ApplicantDetailsType | undefined;

  private hearingRequirementDetails:
    | {
        hearingWitnessFlow: HearingWitnessFlowReturnType;
        hearingAccessNeedsFlow: HearingAccessNeedsFlowReturnType;
        hearingOtherNeedsFlow: HearingOtherNeedsFlowReturnType;
        hearingDatesToAvoidFlow: HearingDatesToAvoidFlowReturnType;
      }
    | undefined;

  private cui_yourDetailsUserFlowApi!: YourDetailsUserFlowApi;
  private cui_decisionTypeUserFlowApi!: DecisionTypeUserFlowApi;
  private cui_feeSupportUserFlowApi!: FeeSupportUserFlowApi;
  private cui_checkAndSendUserFlowApi!: CheckAndSendUserFlowApi;
  private cui_appealReasonsFlowApi!: AppealReasonsUserFlowApi;
  private cui_appealOverviewApi!: AppealOverviewApi;
  private cui_hearingWitnessUserFlowApi!: HearingWitnessUserFlowApi;
  private cui_hearingAccessNeedsUserFlowApi!: HearingAccessNeedsUserFlowApi;
  private cui_hearingOtherNeedsUserFlowApi!: HearingOtherNeedsUserFlowApi;
  private cui_hearingDatesToAvoidUserFlowApi!: HearingDatesToAvoidUserFlowApi;
  private cui_hearingCheckAnswersApi!: HearingCheckAnswersApi;
  private cui_createNewAppealApi!: CreateNewAppealApi;

  constructor(
    private readonly username: string,
    private readonly password: string,
  ) {
    this.apiContext = new ApiContext();
  }

  public async init(): Promise<void> {
    const apiContext = await this.apiContext.createCitizenSiteApiContext({
      userName: this.username,
      password: this.password,
    });

    this.cui_yourDetailsUserFlowApi = new YourDetailsUserFlowApi(apiContext);
    this.cui_decisionTypeUserFlowApi = new DecisionTypeUserFlowApi(apiContext);
    this.cui_feeSupportUserFlowApi = new FeeSupportUserFlowApi(apiContext);
    this.cui_checkAndSendUserFlowApi = new CheckAndSendUserFlowApi(apiContext);
    this.cui_appealReasonsFlowApi = new AppealReasonsUserFlowApi(apiContext);
    this.cui_appealOverviewApi = new AppealOverviewApi(apiContext);
    this.cui_hearingWitnessUserFlowApi = new HearingWitnessUserFlowApi(apiContext);
    this.cui_hearingAccessNeedsUserFlowApi = new HearingAccessNeedsUserFlowApi(apiContext);
    this.cui_hearingOtherNeedsUserFlowApi = new HearingOtherNeedsUserFlowApi(apiContext);
    this.cui_hearingDatesToAvoidUserFlowApi = new HearingDatesToAvoidUserFlowApi(apiContext);
    this.cui_hearingCheckAnswersApi = new HearingCheckAnswersApi(apiContext);
    this.cui_createNewAppealApi = new CreateNewAppealApi(apiContext);
  }

  public async completeAndSubmitNewAppealJourneyViaApi(appealData: AppealData): Promise<ApplicantDetailsType> {
    await this.cui_createNewAppealApi.get();

    const applicantDetails = await this.cui_yourDetailsUserFlowApi.submitYourDetailsFlowViaApi({
      isUserInTheUk: appealData.isUserInTheUk,
      appealType: appealData.appealType,
      isApplicantStateless: appealData.isApplicantStateless,
      isApplicationInTime: appealData.isApplicationInTime,
      nationality: appealData.nationality,
      hasApplicantReceivedADeportationOrder: appealData.hasApplicantReceivedADeportationOrder,
      sponsorDetails: {
        doesApplicantHaveASponsor: appealData.sponsorDetails.doesApplicantHaveASponsor,
        doesApplicantHaveANonLegalRepSponsor: appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor,
        isSponsorAndNonLegalRepTheSamePerson: appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson,
      },
    });

    await this.cui_decisionTypeUserFlowApi.submitDecisionTypeFlowViaApi({
      appealType: appealData.appealType,
      decisionWithOrWithoutHearing: appealData.decisionWithOrWithoutHearing,
      payForAppealNowOrLater: appealData.payForAppealNowOrLater,
    });
    if (appealData.appealType !== 'Deprivation of Citizenship' && appealData.appealType !== 'Revocation of Protection Status') {
      if (!appealData.whetherApplicantHasToPayAFee) {
        throw new Error('Fee support information is required for this appeal type.');
      }

      await this.cui_feeSupportUserFlowApi.submitFeeSupportFlowViaApi({
        whetherApplicantHasToPayAFee: appealData.whetherApplicantHasToPayAFee,
      });
    }

    await this.cui_checkAndSendUserFlowApi.submitCheckAndSendFlowViaApi({
      isApplicationInTime: appealData.isApplicationInTime,
      appealSubmissionType: appealData.appealSubmissionType,
    });

    this.newAppealDetails = applicantDetails;
    return applicantDetails;
  }

  public async verifyAppealIsInExpectedStateViaAppealOverviewApi(options: {
    expectedTextToBeOnAppealOverview: string;
    caseId: string;
  }): Promise<void> {
    await expect(async () => {
      await this.init();

      const appealOverviewResponse = await this.cui_appealOverviewApi.get({ caseId: options.caseId });

      const $ = load(appealOverviewResponse);

      const textContent = $('body').text().replace(/\s+/g, ' ').trim();

      expect(textContent, {
        message: `Verify upon re-intialising user login, applicant is able to view next steps: ${options.expectedTextToBeOnAppealOverview}`,
      }).toContain(options.expectedTextToBeOnAppealOverview);
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });
  }

  public async completeAndSubmitAppealReasonsJourneyViaApi(appealReasonsFlowData: AppealReasonsFlowType): Promise<void> {
    await this.verifyAppealIsInExpectedStateViaAppealOverviewApi({
      expectedTextToBeOnAppealOverview: 'Tell us why you think the Home Office decision to refuse your claim is wrong.',
      caseId: appealReasonsFlowData.caseId,
    });

    await this.cui_appealReasonsFlowApi.submitAppealReasonsFlowViaApi(appealReasonsFlowData);
  }

  public async commpleteAndSubmitHearingRequirementsJourneyViaApi(hearingRequestsFlow: HearingRequestsFlowType): Promise<{
    hearingWitnessFlow: HearingWitnessFlowReturnType;
    hearingAccessNeedsFlow: HearingAccessNeedsFlowReturnType;
    hearingOtherNeedsFlow: HearingOtherNeedsFlowReturnType;
    hearingDatesToAvoidFlow: HearingDatesToAvoidFlowReturnType;
  }> {
    await this.verifyAppealIsInExpectedStateViaAppealOverviewApi({
      expectedTextToBeOnAppealOverview: 'Your appeal is going to hearing',
      caseId: hearingRequestsFlow.caseId,
    });

    const hearingWitnessFlow = await this.cui_hearingWitnessUserFlowApi.submitHearingWitnessFlowViaApi(hearingRequestsFlow);
    const hearingAccessNeedsFlow = await this.cui_hearingAccessNeedsUserFlowApi.submitHearingAccessNeedsFlowViaApi(hearingRequestsFlow);
    const hearingOtherNeedsFlow = await this.cui_hearingOtherNeedsUserFlowApi.submitHearingOtherNeedsFlowViaApi(hearingRequestsFlow);
    const hearingDatesToAvoidFlow = await this.cui_hearingDatesToAvoidUserFlowApi.submitHearingDatesToAvoidFlowViaApi(hearingRequestsFlow);
    await this.cui_hearingCheckAnswersApi.submitForm();

    this.hearingRequirementDetails = {
      hearingWitnessFlow,
      hearingAccessNeedsFlow,
      hearingOtherNeedsFlow,
      hearingDatesToAvoidFlow,
    };

    return {
      hearingWitnessFlow,
      hearingAccessNeedsFlow,
      hearingOtherNeedsFlow,
      hearingDatesToAvoidFlow,
    };
  }

  public async getNewAppealDetails(): Promise<ApplicantDetailsType> {
    if (!this.newAppealDetails) {
      throw new Error('No appeal data submitted via api. Please submit appeal data via api before attempting to retrieve it.');
    }
    return this.newAppealDetails;
  }

  public async getHearingRequirementDetails(): Promise<{
    hearingWitnessFlow: HearingWitnessFlowReturnType;
    hearingAccessNeedsFlow: HearingAccessNeedsFlowReturnType;
    hearingOtherNeedsFlow: HearingOtherNeedsFlowReturnType;
    hearingDatesToAvoidFlow: HearingDatesToAvoidFlowReturnType;
  }> {
    if (!this.hearingRequirementDetails) {
      throw new Error(
        'No hearing requirement data submitted via api. Please submit hearing requirement data via api before attempting to retrieve it.',
      );
    }
    return this.hearingRequirementDetails;
  }
}
