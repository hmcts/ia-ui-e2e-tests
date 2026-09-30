import { APIRequestContext } from '@playwright/test';
import { YourDetailsJourney } from '../../../../citizen-types';
import { DataUtils } from '../../../../utils';
import {
  InTheUkApi,
  OutOfCountryProtectionDepartureDateApi,
  OutOfCountryHrEeaApi,
  OutOfCountryHrInsideApi,
  AppealTypeApi,
  HomeOfficeReferenceNumberApi,
  ApplicantNameApi,
  ApplicantDobApi,
  ApplicantNationalityApi,
  DecisionLetterSentApi,
  DecisionLetterReceivedApi,
  UploadDecisionLetterApi,
  DeportationOrderApi,
  ContactPreferencesApi,
  OutOfCountryAddressApi,
  ManualAddressApi,
  HasSponsorOrNonLegalRepApi,
  IsSamePersonAsSponsorApi,
  NonLegalRepNameApi,
  NonLegalRepAddressApi,
  NonLegalRepContactDetailsApi,
  SponsorNameApi,
  SponsorAddressApi,
  SponsorContactPreferencesApi,
  SponsorAuthorisationApi,
} from '../../../../api-requests/citizen/index';

export type ApplicantDetailsType = {
  homeOfficeReference: number;
  applicantDetails: {
    givenNames: string[];
    familyName: string;
    dob: {
      day: number;
      month: number;
      year: number;
    };
    dateLeftUk?: string;
    decisionLetterDate: {
      day: number;
      month: number;
      year: number;
    };
    address: string;
    email?: string;
    phoneNumber?: string;
  };
  sponsorDetails?: {
    sponsorGivenNames: string[];
    sponsorFamilyName: string;
    sponsorAddress: string;
    sponsorEmail?: string;
    sponsorPhoneNumber?: string;
  };
  nonLegalRepDetails?: {
    nonLegalRepGivenNames: string[];
    nonLegalRepFamilyName: string;
    nonLegalRepAddress: string;
    nonLegalRepEmail: string;
    nonLegalRepPhoneNumber: string;
  };
};

export class YourDetailsUserFlowApi {
  private cui_inTheUkApi: InTheUkApi;
  private cui_outOfCountryProtectionDepartureDateApi: OutOfCountryProtectionDepartureDateApi;
  private cui_outOfCountryHrEeaApi: OutOfCountryHrEeaApi;
  private cui_outOfCountryHrInsideApi: OutOfCountryHrInsideApi;
  private cui_appealTypeApi: AppealTypeApi;
  private cui_homeOfficeReferenceNumberApi: HomeOfficeReferenceNumberApi;
  private cui_applicantNameApi: ApplicantNameApi;
  private cui_applicantDobApi: ApplicantDobApi;
  private cui_applicantNationalityApi: ApplicantNationalityApi;
  private cui_decisionLetterSentApi: DecisionLetterSentApi;
  private cui_decisionLetterReceivedApi: DecisionLetterReceivedApi;
  private cui_uploadDecisionLetterApi: UploadDecisionLetterApi;
  private cui_deportationOrderApi: DeportationOrderApi;
  private cui_contactPreferencesApi: ContactPreferencesApi;
  private cui_outOfCountryAddressApi: OutOfCountryAddressApi;
  private cui_manualAddressApi: ManualAddressApi;
  private cui_hasSponsorOrNonLegalRepApi: HasSponsorOrNonLegalRepApi;
  private cui_isSamePersonAsSponsorApi: IsSamePersonAsSponsorApi;
  private cui_nonLegalRepNameApi: NonLegalRepNameApi;
  private cui_nonLegalRepAddressApi: NonLegalRepAddressApi;
  private cui_nonLegalRepContactDetailsApi: NonLegalRepContactDetailsApi;
  private cui_sponsorNameApi: SponsorNameApi;
  private cui_sponsorAddressApi: SponsorAddressApi;
  private cui_sponsorContactPreferencesApi: SponsorContactPreferencesApi;
  private cui_sponsorAuthorisationApi: SponsorAuthorisationApi;
  private dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.cui_inTheUkApi = new InTheUkApi(apiContext);
    this.cui_outOfCountryProtectionDepartureDateApi = new OutOfCountryProtectionDepartureDateApi(apiContext);
    this.cui_outOfCountryHrEeaApi = new OutOfCountryHrEeaApi(apiContext);
    this.cui_outOfCountryHrInsideApi = new OutOfCountryHrInsideApi(apiContext);
    this.cui_appealTypeApi = new AppealTypeApi(apiContext);
    this.cui_homeOfficeReferenceNumberApi = new HomeOfficeReferenceNumberApi(apiContext);
    this.cui_applicantNameApi = new ApplicantNameApi(apiContext);
    this.cui_applicantDobApi = new ApplicantDobApi(apiContext);
    this.cui_applicantNationalityApi = new ApplicantNationalityApi(apiContext);
    this.cui_decisionLetterSentApi = new DecisionLetterSentApi(apiContext);
    this.cui_decisionLetterReceivedApi = new DecisionLetterReceivedApi(apiContext);
    this.cui_uploadDecisionLetterApi = new UploadDecisionLetterApi(apiContext);
    this.cui_deportationOrderApi = new DeportationOrderApi(apiContext);
    this.cui_contactPreferencesApi = new ContactPreferencesApi(apiContext);
    this.cui_outOfCountryAddressApi = new OutOfCountryAddressApi(apiContext);
    this.cui_manualAddressApi = new ManualAddressApi(apiContext);
    this.cui_hasSponsorOrNonLegalRepApi = new HasSponsorOrNonLegalRepApi(apiContext);
    this.cui_isSamePersonAsSponsorApi = new IsSamePersonAsSponsorApi(apiContext);
    this.cui_nonLegalRepNameApi = new NonLegalRepNameApi(apiContext);
    this.cui_nonLegalRepAddressApi = new NonLegalRepAddressApi(apiContext);
    this.cui_nonLegalRepContactDetailsApi = new NonLegalRepContactDetailsApi(apiContext);
    this.cui_sponsorNameApi = new SponsorNameApi(apiContext);
    this.cui_sponsorAddressApi = new SponsorAddressApi(apiContext);
    this.cui_sponsorContactPreferencesApi = new SponsorContactPreferencesApi(apiContext);
    this.cui_sponsorAuthorisationApi = new SponsorAuthorisationApi(apiContext);
  }

  public async submitYourDetailsFlowViaApi(appealData: YourDetailsJourney): Promise<ApplicantDetailsType> {
    await this.cui_inTheUkApi.submitForm({ isUserInTheUk: appealData.isUserInTheUk });
    await this.cui_appealTypeApi.submitForm({ appealType: appealData.appealType });

    let dateLeftUk;
    if (appealData.isUserInTheUk === 'No') {
      switch (appealData.appealType) {
        case 'Protection':
          dateLeftUk = await this.dataUtils.getDateFromToday({ yearOffset: -2 });
          await this.cui_outOfCountryProtectionDepartureDateApi.submitForm({ day: dateLeftUk.day, month: dateLeftUk.month, year: dateLeftUk.year });
          break;
        case 'Human Rights':
          await this.cui_outOfCountryHrEeaApi.submitForm({ outsideUkWhenApplicationMade: 'No' });

          dateLeftUk = await this.dataUtils.getDateFromToday({ yearOffset: -2 });

          await this.cui_outOfCountryHrInsideApi.submitForm({ day: dateLeftUk.day, month: dateLeftUk.month, year: dateLeftUk.year });
          break;
        case 'European Economic Area':
          await this.cui_outOfCountryHrEeaApi.submitForm({ outsideUkWhenApplicationMade: 'No' });
          break;
      }
    }

    const homeOfficeReference = await this.dataUtils.generateRandomNumber({ digitLength: 9 });
    await this.cui_homeOfficeReferenceNumberApi.submitForm({ homeOfficeReference: homeOfficeReference });

    const ApplicantName = await this.dataUtils.generateRandomFirstAndLastNames({
      countOfFirstNamesToGenerate: 1,
      countOfLastNamesToGenerate: 1,
    });
    await this.cui_applicantNameApi.submitForm({ givenNames: ApplicantName.firstNames, familyName: ApplicantName.lastNames[0] });

    const applicantDob = await this.dataUtils.getDateFromToday({ yearOffset: -35 });
    await this.cui_applicantDobApi.submitForm({ day: applicantDob.day, month: applicantDob.month, year: applicantDob.year });

    if (appealData.isApplicantStateless && appealData.nationality) {
      throw new Error(
        'Applicant can not be stateless and have a nationality defined at the same time. Please provide either isApplicantStateless as true or nationality, but not both.',
      );
    }

    if (appealData.isApplicantStateless) {
      await this.cui_applicantNationalityApi.submitForm({ stateless: appealData.isApplicantStateless });
    } else {
      if (!appealData.nationality) {
        throw new Error('Nationality is required when applicant is not stateless');
      }
      await this.cui_applicantNationalityApi.submitForm({ stateless: false, nationality: appealData.nationality });
    }

    let decisionLetterDate;
    if (appealData.isApplicationInTime) {
      decisionLetterDate = await this.dataUtils.getDateFromToday({
        dayOffset: -5,
      });
    } else {
      decisionLetterDate = await this.dataUtils.getDateFromToday({
        dayOffset: -40,
      });
    }

    switch (appealData.isUserInTheUk) {
      case 'Yes':
        await this.cui_decisionLetterSentApi.submitForm({
          day: decisionLetterDate.day,
          month: decisionLetterDate.month,
          year: decisionLetterDate.year,
        });
        break;

      case 'No':
        await this.cui_decisionLetterReceivedApi.submitForm({
          day: decisionLetterDate.day,
          month: decisionLetterDate.month,
          year: decisionLetterDate.year,
        });
        break;

      default:
        throw new Error(`Invalid isUserInTheUk value: ${appealData.isUserInTheUk}`);
    }

    await this.cui_uploadDecisionLetterApi.submitForm({});
    await this.cui_deportationOrderApi.submitForm({ deportationOrderReceived: appealData.hasApplicantReceivedADeportationOrder });

    const applicantContactDetails = await this.dataUtils.generateContactDetails('Email and Phone');
    await this.cui_contactPreferencesApi.submitForm({
      contactPreference: 'Email and Phone',
      applicantEmail: applicantContactDetails.email,
      applicantPhoneNumber: applicantContactDetails.phone,
    });

    const applicantAddress = '123 Example Street, Example Town, EX4 2PL';
    switch (appealData.isUserInTheUk) {
      case 'Yes':
        const manualAddress = applicantAddress.split(', ');
        await this.cui_manualAddressApi.submitForm({ addressLine1: manualAddress[0], townOrCity: manualAddress[1], postCode: manualAddress[2] });
        break;

      case 'No':
        await this.cui_outOfCountryAddressApi.submitForm({ applicantAddress: applicantAddress });
        break;

      default:
        throw new Error(`Invalid isUserInTheUk value: ${appealData.isUserInTheUk}`);
    }

    await this.cui_hasSponsorOrNonLegalRepApi.submitForm({
      doesApplicantHaveASponsor: appealData.sponsorDetails.doesApplicantHaveASponsor,
      doesApplicantHaveANonLegalRepresentative: appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor,
    });

    const nonLegalRepSponsorName = await this.dataUtils.generateRandomFirstAndLastNames({
      countOfFirstNamesToGenerate: 1,
      countOfLastNamesToGenerate: 1,
    });
    const nonLegalRepSponsorAddress = '456 Fake Street, Faketown, FK1 2AB';
    const nonLegalSponsorContactDetails = await this.dataUtils.generateContactDetails('Email and Phone');

    const sponsorName = await this.dataUtils.generateRandomFirstAndLastNames({
      countOfFirstNamesToGenerate: 1,
      countOfLastNamesToGenerate: 1,
    });
    const sponsorAddress = '123 Fake Street, Faketown, FK1 2AB';
    const sponsorContactDetails = await this.dataUtils.generateContactDetails('Email and Phone');

    if (
      appealData.sponsorDetails.doesApplicantHaveASponsor === 'Yes' &&
      appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor === 'Yes' &&
      appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson === undefined
    ) {
      throw new Error('You must specify if the sponsor and non-legal representative are the same person (isSponsorAndNonLegalRepTheSamePerson)');
    }

    if (
      appealData.sponsorDetails.doesApplicantHaveASponsor === 'Yes' &&
      appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor === 'Yes' &&
      appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson === 'Yes'
    ) {
      await this.cui_isSamePersonAsSponsorApi.submitForm({
        isSponsorAndNonLegalRepresentativeTheSamePerson: appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson,
      });

      await this.cui_nonLegalRepNameApi.submitForm({
        givenNames: nonLegalRepSponsorName.firstNames,
        familyName: nonLegalRepSponsorName.lastNames[0],
      });
      const nonLegalRepAddress = nonLegalRepSponsorAddress.split(', ');
      await this.cui_nonLegalRepAddressApi.submitForm({
        isSponsorAndNonLegalRepTheSamePerson: appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson,
        addressLine1: nonLegalRepAddress[0],
        townOrCity: nonLegalRepAddress[1],
        postCode: nonLegalRepAddress[2],
      });
      if (!nonLegalSponsorContactDetails.email || !nonLegalSponsorContactDetails.phone) {
        throw new Error('Non-legal representative sponsor must have both email and phone contact details');
      }
      await this.cui_nonLegalRepContactDetailsApi.submitForm({
        nlrEmail: nonLegalSponsorContactDetails.email,
        nlrPhoneNumber: nonLegalSponsorContactDetails.phone,
      });
    } else if (
      appealData.sponsorDetails.doesApplicantHaveASponsor === 'Yes' &&
      appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor === 'Yes' &&
      appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson === 'No'
    ) {
      await this.cui_isSamePersonAsSponsorApi.submitForm({
        isSponsorAndNonLegalRepresentativeTheSamePerson: appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson,
      });
    }

    if (
      appealData.sponsorDetails.doesApplicantHaveASponsor === 'No' ||
      appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor === 'No' ||
      appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson === 'No'
    ) {
      if (appealData.sponsorDetails.doesApplicantHaveASponsor === 'Yes') {
        await this.cui_sponsorNameApi.submitForm({ givenNames: sponsorName.firstNames, familyName: sponsorName.lastNames[0] });

        const address = sponsorAddress.split(', ');
        await this.cui_sponsorAddressApi.submitForm({ addressLine1: address[0], townOrCity: address[1], postCode: address[2] });

        await this.cui_sponsorContactPreferencesApi.submitForm({
          contactPreference: 'Email and Phone',
          sponsorEmail: sponsorContactDetails.email,
          sponsorPhoneNumber: sponsorContactDetails.phone,
        });

        await this.cui_sponsorAuthorisationApi.submitForm({ allowSponsorToSeeAppealInformation: 'Yes' });
      }

      if (appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor === 'Yes') {
        await this.cui_nonLegalRepNameApi.submitForm({
          givenNames: nonLegalRepSponsorName.firstNames,
          familyName: nonLegalRepSponsorName.lastNames[0],
        });
        const nonLegalRepAddress = nonLegalRepSponsorAddress.split(', ');
        await this.cui_nonLegalRepAddressApi.submitForm({
          isSponsorAndNonLegalRepTheSamePerson: 'No',
          addressLine1: nonLegalRepAddress[0],
          townOrCity: nonLegalRepAddress[1],
          postCode: nonLegalRepAddress[2],
        });
        if (!nonLegalSponsorContactDetails.email || !nonLegalSponsorContactDetails.phone) {
          throw new Error('Non-legal representative sponsor must have both email and phone contact details');
        }
        await this.cui_nonLegalRepContactDetailsApi.submitForm({
          nlrEmail: nonLegalSponsorContactDetails.email,
          nlrPhoneNumber: nonLegalSponsorContactDetails.phone,
        });
      }
    }

    return {
      homeOfficeReference,
      applicantDetails: {
        givenNames: ApplicantName.firstNames,
        familyName: ApplicantName.lastNames[0],
        dob: {
          day: applicantDob.day,
          month: applicantDob.month,
          year: applicantDob.year,
        },
        dateLeftUk: appealData.isUserInTheUk === 'No' && dateLeftUk ? `${dateLeftUk.day}/${dateLeftUk.month}/${dateLeftUk.year}` : undefined,
        decisionLetterDate: decisionLetterDate,
        address: applicantAddress,
        email: applicantContactDetails.email,
        phoneNumber: applicantContactDetails.phone,
      },
      sponsorDetails:
        appealData.sponsorDetails.doesApplicantHaveASponsor === 'Yes' && appealData.sponsorDetails.isSponsorAndNonLegalRepTheSamePerson === 'No'
          ? {
              sponsorGivenNames: sponsorName.firstNames,
              sponsorFamilyName: sponsorName.lastNames[0],
              sponsorAddress: sponsorAddress,
              sponsorEmail: sponsorContactDetails.email,
              sponsorPhoneNumber: sponsorContactDetails.phone,
            }
          : undefined,
      nonLegalRepDetails:
        appealData.sponsorDetails.doesApplicantHaveANonLegalRepSponsor === 'Yes'
          ? {
              nonLegalRepGivenNames: nonLegalRepSponsorName.firstNames,
              nonLegalRepFamilyName: nonLegalRepSponsorName.lastNames[0],
              nonLegalRepAddress: nonLegalRepSponsorAddress,
              nonLegalRepEmail: nonLegalSponsorContactDetails.email!,
              nonLegalRepPhoneNumber: nonLegalSponsorContactDetails.phone!,
            }
          : undefined,
    };
  }
}
