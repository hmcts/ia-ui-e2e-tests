import {
  StartAppealOutOfCountry,
  StartAppealDetention,
  StartAppealSponsor,
  StartAppealDeportationOrder,
  StartAppealNewMatters,
  StartAppealHasOtherAppeals,
  StartAppealLegalRepresentativeDetails,
  StartAppealSponsorName,
  StartAppealSponsorAddress,
  StartAppealSponsorContactPreference,
  StartAppealSponsorAuthorisation,
  StartAppealRemovalDirections,
} from './appeal-master-data/index.js';
import {
  OutOfCountryDecisionTypeFlow,
  AppellantInDetentionFlow,
  AppellantNotInDetentionFlow,
  AppealTypeFlow,
  HearingTypeFlow,
} from '../../../user-flows/exui/api/appeal-master-new-appeal/index.js';
import { YesOrNoType, Nationality } from '../../../citizen-types.js';
import {
  OutOfCountryDecisionType,
  DetentionFacilityType,
  ExuiAppealType,
  RemissionTypeOption,
  HearingWihtoutFeeDecisionType,
  ExuiRemissionClaimType,
} from '../../../exui-event-types.js';

export type AppealMasterPayloadOptionsType = {
  isAppellantInUk: YesOrNoType;
  isAppellantStateless: YesOrNoType;
  doesApplicantHaveASponsor: YesOrNoType;
  appealType: ExuiAppealType;
  isApplicationInTime: YesOrNoType;
  nationality?: Nationality;
  appellantNotInUk?: {
    oocDecisionType: OutOfCountryDecisionType;
  };
  appellantInUk?: {
    isAppellantInDetention: YesOrNoType;
    detentionFacility?: DetentionFacilityType;
  };
  hearingType: HearingWihtoutFeeDecisionType;
  feeRemissionType?: RemissionTypeOption;
  feeRemissionClaimType?: ExuiRemissionClaimType;
};

export type AppealMasterPayloadDynamicDataType = {
  homeOfficeReferenceNumber: string;
  decisionDate: { day: number; month: number; year: number };
};

export class AppealMasterPayload {
  private outOfCountryDecisionTypeFlow = new OutOfCountryDecisionTypeFlow();
  private appellantInDetentionFlow = new AppellantInDetentionFlow();
  private appellantNotInDetentionFlow = new AppellantNotInDetentionFlow();
  private appealTypeFlow = new AppealTypeFlow();
  private hearingTypeFlow = new HearingTypeFlow();
  private startAppealOutOfCountry = new StartAppealOutOfCountry();
  private startAppealDetention = new StartAppealDetention();
  private startAppealSponsor = new StartAppealSponsor();
  private startAppealDeportationOrder = new StartAppealDeportationOrder();
  private startAppealNewMatters = new StartAppealNewMatters();
  private startAppealHasOtherAppeals = new StartAppealHasOtherAppeals();
  private startAppealLegalRepresentativeDetails = new StartAppealLegalRepresentativeDetails();
  private startAppealSponsorName = new StartAppealSponsorName();
  private startAppealSponsorAddress = new StartAppealSponsorAddress();
  private startAppealSponsorContactPreference = new StartAppealSponsorContactPreference();
  private startAppealSponsorAuthorisation = new StartAppealSponsorAuthorisation();
  private startAppealRemovalDirections = new StartAppealRemovalDirections();

  public async buildAppealMasterPayload(appealData: AppealMasterPayloadOptionsType & AppealMasterPayloadDynamicDataType): Promise<JSON> {
    const finalPayload: any = {};

    const addToFinalPayload = (data: object): void => {
      Object.assign(finalPayload, data);
    };

    addToFinalPayload(await this.startAppealOutOfCountry.isAppellantLivingInUk(appealData.isAppellantInUk));

    switch (appealData.isAppellantInUk) {
      case 'No':
        if (!appealData.appellantNotInUk) {
          throw new Error('appellantNotInUk is required when isAppellantInUk is "No"');
        }

        addToFinalPayload(
          await this.outOfCountryDecisionTypeFlow.buildPayload({
            isAppellantStateless: appealData.isAppellantStateless,
            oocDecisionType: appealData.appellantNotInUk.oocDecisionType,
            nationality: appealData.nationality,
            homeOfficeReferenceNumber: appealData.homeOfficeReferenceNumber,
          }),
        );
        break;
      case 'Yes':
        if (!appealData.appellantInUk) {
          throw new Error('appellantInUk is required when isAppellantInUk is "Yes"');
        }
        addToFinalPayload(await this.startAppealDetention.isAppellantInDetention(appealData.appellantInUk.isAppellantInDetention));

        switch (appealData.appellantInUk.isAppellantInDetention) {
          case 'Yes':
            if (!appealData.appellantInUk.detentionFacility) {
              throw new Error('detentionFacility is required when isAppellantInDetention is "Yes"');
            }
            addToFinalPayload(
              await this.appellantInDetentionFlow.buildPayload({
                detentionFacility: appealData.appellantInUk.detentionFacility,
                isAppellantStateless: appealData.isAppellantStateless,
                nationality: appealData.nationality,
                homeOfficeReferenceNumber: appealData.homeOfficeReferenceNumber,
              }),
            );
            break;
          case 'No':
            addToFinalPayload(
              await this.appellantNotInDetentionFlow.buildPayload({
                isAppellantStateless: appealData.isAppellantStateless,
                nationality: appealData.nationality,
                homeOfficeReferenceNumber: appealData.homeOfficeReferenceNumber,
              }),
            );
            break;
        }
        break;
    }

    addToFinalPayload(
      await this.appealTypeFlow.buildPayload({
        appealType: appealData.appealType,
        isAppellantInUk: appealData.isAppellantInUk,
        oocDecisionType: appealData.appellantNotInUk?.oocDecisionType,
        decisionDate: appealData.decisionDate,
      }),
    );

    addToFinalPayload(await this.startAppealSponsor.hasSponsor(appealData.doesApplicantHaveASponsor));

    if (appealData.doesApplicantHaveASponsor === 'Yes') {
      addToFinalPayload(await this.startAppealSponsorName.sponsorName({ sponsorGivenNames: 'Jane', sponsorFamilyName: 'Doe' }));
      addToFinalPayload(await this.startAppealSponsorAddress.sponsorAddress({ AddressLine1: '123 Main St', PostTown: 'London', PostCode: 'E1 6AN' }));
      addToFinalPayload(
        await this.startAppealSponsorContactPreference.sponsorContactPreference({ contactPreference: 'Text message', phoneNumber: '07222222222' }),
      );
      addToFinalPayload(await this.startAppealSponsorAuthorisation.sponsorAuthorisation('Yes'));
    }

    addToFinalPayload(await this.startAppealDeportationOrder.deportationOrder('Yes'));

    if (appealData.appellantInUk?.isAppellantInDetention === 'Yes') {
      addToFinalPayload(
        await this.startAppealRemovalDirections.removalDirections({
          removalOrderOptions: 'Yes',
          removalOrderDate: { day: 1, month: 1, year: 2023, hour: 12, minute: 15 },
        }),
      );
    }

    addToFinalPayload(await this.startAppealNewMatters.newMatters({ hasNewMatters: 'Yes', newMattersDescription: 'Test new matters description' }));

    addToFinalPayload(await this.startAppealHasOtherAppeals.hasOtherAppeals('No'));

    addToFinalPayload(
      await this.startAppealLegalRepresentativeDetails.legalRepresentativeDetails({
        legalRepCompany: 'Test Legal Rep Company',
        legalRepName: 'Test Legal Rep Name',
        legalRepFamilyName: 'Test Legal Rep Family Name',
        legalRepMobilePhoneNumber: '07333333333',
        legalRepReferenceNumber: 'LR123456',
      }),
    );

    addToFinalPayload(
      await this.hearingTypeFlow.buildPayload({
        appealType: appealData.appealType,
        hearingType: appealData.hearingType,
        feeRemissionType: appealData.feeRemissionType,
        feeRemissionClaimType: appealData.feeRemissionClaimType,
      }),
    );

    return finalPayload;
  }
}
