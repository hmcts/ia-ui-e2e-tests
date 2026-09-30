import { Page } from '@playwright/test';

import {
  StartAppealPage,
  AppealOverviewPage,
  CaseListPage,
  AboutAppealPage,
  InTheUkPage,
  OutOfCountryProtectionDepartureDatePage,
  OutOfCountryHrEeaPage,
  OutOfCountryHrInsidePage,
  AppealTypePage,
  HomeOfficeReferenceNumberPage,
  ApplicantNamePage,
  ApplicantDobPage,
  ApplicantNationalityPage,
  DecisionLetterSentPage,
  DecisionLetterReceivedPage,
  UploadDecisionLetterPage,
  DeportationOrderPage,
  ContactPreferencesPage,
  OutOfCountryAddressPage,
  ApplicantAddressPage,
  SelectAddressPage,
  ManualAddressPage,
  HasSponsorOrNonLegalRepPage,
  SponsorNamePage,
  SponsorAddressPage,
  SponsorContactPreferencesPage,
  SponsorAuthorisationPage,
  IsSamePersonAsSponsorPage,
  NonLegalRepNamePage,
  NonLegalRepAddressPage,
  NonLegalRepContactDetailsPage,
  DecisionTypePage,
  PayNowPage,
  EqualityAndDiversityStartPage,
  FeeSupportPage,
  AsylumSupportPage,
  FeeWaiverPage,
  LocalAuthorityLetterPage,
  HelpWithFeesPage,
  LateAppealPage,
  NewAppealCheckAnswersPage,
  AppealDetailsSentPage,
  ConfirmationOfPaymentPage,
  HomeOfficeDecisionWrongPage,
  SupportingEvidencePage,
  ProvideSupportingEvidencePage,
  AppealReasonsCheckAnswersPage,
  AppealReasonsAnswerSentPage,
  AskForMoreTimePage,
  SupportingEvidenceMoreTimePage,
  ProvideSupportingEvidenceMoreTimePage,
  RequestMoreTimeSentPage,
  HearingNeedsPage,
  HearingWitnessesPage,
  HearingWitnessNamesPage,
  HearingOutsideUKPage,
  HearingAccessNeedsPage,
  HearingInterpreterPage,
  HearingInterpreterSupportAppellantWitnessesPage,
  HearingInterpreterTypesPage,
  HearingInterpreterSpokenLanguageSelectionPage,
  HearingInterpreterSignLanguageSelectionPage,
  HearingInterpreterTypesWitnessPage,
  HearingInterpreterSpokenLanguageSelectionWitnessPage,
  HearingInterpreterSignLanguageSelectionWitnessPage,
  HearingStepFreeAccessPage,
  HearingLoopPage,
  HearingOtherNeedsPage,
  HearingVideoAppointmentPage,
  HearingVideoAppointmentReasonsPage,
  HearingMultimediaEvidencePage,
  HearingMultimediaEvidenceEquipmentPage,
  HearingMultimediaEvidenceEquipmentReasonsPage,
  HearingSingleSexPage,
  HearingSingleSexTypePage,
  HearingSingleSexTypeMalePage,
  HearingSingleSexTypeFemalePage,
  HearingPrivatePage,
  HearingPrivateReasonPage,
  HearingPhysicalMentalHealthPage,
  HearingPhysicalMentalHealthReasonsPage,
  HearingPastExperiencesPage,
  HearingAnythingElseReasonsPage,
  HearingAnythingElsePage,
  HearingPastExperiencesReasonsPage,
  HearingDatesAvoidPage,
  HearingDatesAvoidEnterPage,
  HearingDatesAvoidReasonsPage,
  HearingCheckAnswersPage,
  HearingSuccessPage,
  FtpaReasonPage,
  FtpaEvidenceQuestionPage,
  FtpaEvidencePage,
  FtpaCheckAnswersPage,
  FtpaConfirmationPage,
} from './pages/index';

import { CardPaymentDetailsPage } from '../card-payment-details.po';
import { CardPaymentConfirmDetailsPage } from '../card-payment-confirm-details.po';

export class CuiPages {
  private readonly page: Page;

  public readonly startAppeal: StartAppealPage;
  public readonly appealOverview: AppealOverviewPage;
  public readonly caseList: CaseListPage;
  public readonly aboutAppeal: AboutAppealPage;
  public readonly inTheUk: InTheUkPage;
  public readonly outOfCountryProtectionDepartureDate: OutOfCountryProtectionDepartureDatePage;
  public readonly outOfCountryHrEea: OutOfCountryHrEeaPage;
  public readonly outOfCountryHrInside: OutOfCountryHrInsidePage;
  public readonly appealType: AppealTypePage;
  public readonly homeOfficeReferenceNumber: HomeOfficeReferenceNumberPage;
  public readonly applicantName: ApplicantNamePage;
  public readonly applicantDob: ApplicantDobPage;
  public readonly applicantNationality: ApplicantNationalityPage;
  public readonly decisionLetterSent: DecisionLetterSentPage;
  public readonly decisionLetterReceived: DecisionLetterReceivedPage;
  public readonly uploadDecisionLetter: UploadDecisionLetterPage;
  public readonly deportationOrder: DeportationOrderPage;
  public readonly contactPreferences: ContactPreferencesPage;
  public readonly outOfCountryAddress: OutOfCountryAddressPage;
  public readonly applicantAddress: ApplicantAddressPage;
  public readonly selectAddress: SelectAddressPage;
  public readonly manualAddress: ManualAddressPage;
  public readonly hasSponsorOrNonLegalRep: HasSponsorOrNonLegalRepPage;
  public readonly sponsorName: SponsorNamePage;
  public readonly sponsorAddress: SponsorAddressPage;
  public readonly sponsorContactPreferences: SponsorContactPreferencesPage;
  public readonly sponsorAuthorisation: SponsorAuthorisationPage;
  public readonly isSamePersonAsSponsor: IsSamePersonAsSponsorPage;
  public readonly nonLegalRepName: NonLegalRepNamePage;
  public readonly nonLegalRepAddress: NonLegalRepAddressPage;
  public readonly nonLegalRepAddressOutOfCountry: NonLegalRepAddressPage;
  public readonly nonLegalRepContactDetails: NonLegalRepContactDetailsPage;
  public readonly decisionType: DecisionTypePage;
  public readonly payNow: PayNowPage;
  public readonly equalityAndDiversityStart: EqualityAndDiversityStartPage;
  public readonly feeSupport: FeeSupportPage;
  public readonly asylumSupport: AsylumSupportPage;
  public readonly feeWaiver: FeeWaiverPage;
  public readonly localAuthorityLetter: LocalAuthorityLetterPage;
  public readonly helpWithFees: HelpWithFeesPage;
  public readonly lateAppeal: LateAppealPage;
  public readonly newAppealCheckAnswers: NewAppealCheckAnswersPage;
  public readonly appealDetailsSent: AppealDetailsSentPage;
  public readonly cardPaymentDetails: CardPaymentDetailsPage;
  public readonly cardPaymentConfirmDetails: CardPaymentConfirmDetailsPage;
  public readonly confirmationOfPayment: ConfirmationOfPaymentPage;
  public readonly homeOfficeDecisionWrong: HomeOfficeDecisionWrongPage;
  public readonly supportingEvidence: SupportingEvidencePage;
  public readonly provideSupportingEvidence: ProvideSupportingEvidencePage;
  public readonly appealReasonsCheckAnswers: AppealReasonsCheckAnswersPage;
  public readonly appealReasonsAnswerSent: AppealReasonsAnswerSentPage;
  public readonly askForMoreTime: AskForMoreTimePage;
  public readonly supportingEvidenceMoreTime: SupportingEvidenceMoreTimePage;
  public readonly provideSupportingEvidenceMoreTime: ProvideSupportingEvidenceMoreTimePage;
  public readonly requestMoreTimeSent: RequestMoreTimeSentPage;
  public readonly hearingNeeds: HearingNeedsPage;
  public readonly hearingWitnesses: HearingWitnessesPage;
  public readonly hearingWitnessNames: HearingWitnessNamesPage;
  public readonly hearingOutsideUK: HearingOutsideUKPage;
  public readonly hearingAccessNeeds: HearingAccessNeedsPage;
  public readonly hearingInterpreter: HearingInterpreterPage;
  public readonly hearingInterpreterSupportAppellantWitnesses: HearingInterpreterSupportAppellantWitnessesPage;
  public readonly hearingInterpreterTypes: HearingInterpreterTypesPage;
  public readonly hearingInterpreterSpokenLanguageSelection: HearingInterpreterSpokenLanguageSelectionPage;
  public readonly hearingInterpreterSignLanguageSelection: HearingInterpreterSignLanguageSelectionPage;
  public readonly hearingInterpreterTypesWitness: HearingInterpreterTypesWitnessPage;
  public readonly hearingInterpreterSpokenLanguageSelectionWitness: HearingInterpreterSpokenLanguageSelectionWitnessPage;
  public readonly hearingInterpreterSignLanguageSelectionWitness: HearingInterpreterSignLanguageSelectionWitnessPage;
  public readonly hearingStepFreeAccess: HearingStepFreeAccessPage;
  public readonly hearingLoop: HearingLoopPage;
  public readonly hearingOtherNeeds: HearingOtherNeedsPage;
  public readonly hearingVideoAppointment: HearingVideoAppointmentPage;
  public readonly hearingVideoAppointmentReasons: HearingVideoAppointmentReasonsPage;
  public readonly hearingMultimediaEvidence: HearingMultimediaEvidencePage;
  public readonly hearingMultimediaEvidenceEquipment: HearingMultimediaEvidenceEquipmentPage;
  public readonly hearingMultimediaEvidenceEquipmentReasons: HearingMultimediaEvidenceEquipmentReasonsPage;
  public readonly hearingSingleSex: HearingSingleSexPage;
  public readonly hearingSingleSexType: HearingSingleSexTypePage;
  public readonly hearingSingleSexTypeMale: HearingSingleSexTypeMalePage;
  public readonly hearingSingleSexTypeFemale: HearingSingleSexTypeFemalePage;
  public readonly hearingPrivate: HearingPrivatePage;
  public readonly hearingPrivateReason: HearingPrivateReasonPage;
  public readonly hearingPhysicalMentalHealth: HearingPhysicalMentalHealthPage;
  public readonly hearingPhysicalMentalHealthReasons: HearingPhysicalMentalHealthReasonsPage;
  public readonly hearingPastExperiences: HearingPastExperiencesPage;
  public readonly hearingAnythingElse: HearingAnythingElsePage;
  public readonly hearingAnythingElseReasons: HearingAnythingElseReasonsPage;
  public readonly hearingPastExperiencesReasons: HearingPastExperiencesReasonsPage;
  public readonly hearingDatesAvoid: HearingDatesAvoidPage;
  public readonly hearingDatesAvoidEnter: HearingDatesAvoidEnterPage;
  public readonly hearingDatesAvoidReasons: HearingDatesAvoidReasonsPage;
  public readonly hearingCheckAnswers: HearingCheckAnswersPage;
  public readonly hearingSuccess: HearingSuccessPage;
  public readonly ftpaReason: FtpaReasonPage;
  public readonly ftpaEvidenceQuestion: FtpaEvidenceQuestionPage;
  public readonly ftpaEvidence: FtpaEvidencePage;
  public readonly ftpaCheckAnswers: FtpaCheckAnswersPage;
  public readonly ftpaConfirmation: FtpaConfirmationPage;

  constructor(page: Page) {
    this.page = page;

    this.startAppeal = new StartAppealPage(page);
    this.appealOverview = new AppealOverviewPage(page);
    this.caseList = new CaseListPage(page);
    this.aboutAppeal = new AboutAppealPage(page);
    this.inTheUk = new InTheUkPage(page);
    this.outOfCountryProtectionDepartureDate = new OutOfCountryProtectionDepartureDatePage(page);
    this.outOfCountryHrEea = new OutOfCountryHrEeaPage(page);
    this.outOfCountryHrInside = new OutOfCountryHrInsidePage(page);
    this.appealType = new AppealTypePage(page);
    this.homeOfficeReferenceNumber = new HomeOfficeReferenceNumberPage(page);
    this.applicantName = new ApplicantNamePage(page);
    this.applicantDob = new ApplicantDobPage(page);
    this.applicantNationality = new ApplicantNationalityPage(page);
    this.decisionLetterSent = new DecisionLetterSentPage(page);
    this.decisionLetterReceived = new DecisionLetterReceivedPage(page);
    this.uploadDecisionLetter = new UploadDecisionLetterPage(page);
    this.deportationOrder = new DeportationOrderPage(page);
    this.contactPreferences = new ContactPreferencesPage(page);
    this.outOfCountryAddress = new OutOfCountryAddressPage(page);
    this.applicantAddress = new ApplicantAddressPage(page);
    this.selectAddress = new SelectAddressPage(page);
    this.manualAddress = new ManualAddressPage(page);
    this.hasSponsorOrNonLegalRep = new HasSponsorOrNonLegalRepPage(page);
    this.sponsorName = new SponsorNamePage(page);
    this.sponsorAddress = new SponsorAddressPage(page);
    this.sponsorContactPreferences = new SponsorContactPreferencesPage(page);
    this.sponsorAuthorisation = new SponsorAuthorisationPage(page);
    this.isSamePersonAsSponsor = new IsSamePersonAsSponsorPage(page);
    this.nonLegalRepName = new NonLegalRepNamePage(page);
    this.nonLegalRepAddress = new NonLegalRepAddressPage(page);
    this.nonLegalRepAddressOutOfCountry = new NonLegalRepAddressPage(page);
    this.nonLegalRepContactDetails = new NonLegalRepContactDetailsPage(page);
    this.decisionType = new DecisionTypePage(page);
    this.payNow = new PayNowPage(page);
    this.equalityAndDiversityStart = new EqualityAndDiversityStartPage(page);
    this.feeSupport = new FeeSupportPage(page);
    this.asylumSupport = new AsylumSupportPage(page);
    this.feeWaiver = new FeeWaiverPage(page);
    this.localAuthorityLetter = new LocalAuthorityLetterPage(page);
    this.helpWithFees = new HelpWithFeesPage(page);
    this.lateAppeal = new LateAppealPage(page);
    this.newAppealCheckAnswers = new NewAppealCheckAnswersPage(page);
    this.appealDetailsSent = new AppealDetailsSentPage(page);
    this.cardPaymentDetails = new CardPaymentDetailsPage(page);
    this.cardPaymentConfirmDetails = new CardPaymentConfirmDetailsPage(page);
    this.confirmationOfPayment = new ConfirmationOfPaymentPage(page);
    this.homeOfficeDecisionWrong = new HomeOfficeDecisionWrongPage(page);
    this.supportingEvidence = new SupportingEvidencePage(page);
    this.provideSupportingEvidence = new ProvideSupportingEvidencePage(page);
    this.appealReasonsCheckAnswers = new AppealReasonsCheckAnswersPage(page);
    this.appealReasonsAnswerSent = new AppealReasonsAnswerSentPage(page);
    this.askForMoreTime = new AskForMoreTimePage(page);
    this.supportingEvidenceMoreTime = new SupportingEvidenceMoreTimePage(page);
    this.provideSupportingEvidenceMoreTime = new ProvideSupportingEvidenceMoreTimePage(page);
    this.requestMoreTimeSent = new RequestMoreTimeSentPage(page);
    this.hearingNeeds = new HearingNeedsPage(page);
    this.hearingWitnesses = new HearingWitnessesPage(page);
    this.hearingWitnessNames = new HearingWitnessNamesPage(page);
    this.hearingOutsideUK = new HearingOutsideUKPage(page);
    this.hearingAccessNeeds = new HearingAccessNeedsPage(page);
    this.hearingInterpreter = new HearingInterpreterPage(page);
    this.hearingInterpreterSupportAppellantWitnesses = new HearingInterpreterSupportAppellantWitnessesPage(page);
    this.hearingInterpreterTypes = new HearingInterpreterTypesPage(page);
    this.hearingInterpreterSpokenLanguageSelection = new HearingInterpreterSpokenLanguageSelectionPage(page);
    this.hearingInterpreterSignLanguageSelection = new HearingInterpreterSignLanguageSelectionPage(page);
    this.hearingInterpreterTypesWitness = new HearingInterpreterTypesWitnessPage(page);
    this.hearingInterpreterSpokenLanguageSelectionWitness = new HearingInterpreterSpokenLanguageSelectionWitnessPage(page);
    this.hearingInterpreterSignLanguageSelectionWitness = new HearingInterpreterSignLanguageSelectionWitnessPage(page);
    this.hearingStepFreeAccess = new HearingStepFreeAccessPage(page);
    this.hearingLoop = new HearingLoopPage(page);
    this.hearingOtherNeeds = new HearingOtherNeedsPage(page);
    this.hearingVideoAppointment = new HearingVideoAppointmentPage(page);
    this.hearingVideoAppointmentReasons = new HearingVideoAppointmentReasonsPage(page);
    this.hearingMultimediaEvidence = new HearingMultimediaEvidencePage(page);
    this.hearingMultimediaEvidenceEquipment = new HearingMultimediaEvidenceEquipmentPage(page);
    this.hearingMultimediaEvidenceEquipmentReasons = new HearingMultimediaEvidenceEquipmentReasonsPage(page);
    this.hearingSingleSex = new HearingSingleSexPage(page);
    this.hearingSingleSexType = new HearingSingleSexTypePage(page);
    this.hearingSingleSexTypeMale = new HearingSingleSexTypeMalePage(page);
    this.hearingSingleSexTypeFemale = new HearingSingleSexTypeFemalePage(page);
    this.hearingPrivate = new HearingPrivatePage(page);
    this.hearingPrivateReason = new HearingPrivateReasonPage(page);
    this.hearingPhysicalMentalHealth = new HearingPhysicalMentalHealthPage(page);
    this.hearingPhysicalMentalHealthReasons = new HearingPhysicalMentalHealthReasonsPage(page);
    this.hearingPastExperiences = new HearingPastExperiencesPage(page);
    this.hearingAnythingElse = new HearingAnythingElsePage(page);
    this.hearingAnythingElseReasons = new HearingAnythingElseReasonsPage(page);
    this.hearingPastExperiencesReasons = new HearingPastExperiencesReasonsPage(page);
    this.hearingDatesAvoid = new HearingDatesAvoidPage(page);
    this.hearingDatesAvoidEnter = new HearingDatesAvoidEnterPage(page);
    this.hearingDatesAvoidReasons = new HearingDatesAvoidReasonsPage(page);
    this.hearingCheckAnswers = new HearingCheckAnswersPage(page);
    this.hearingSuccess = new HearingSuccessPage(page);
    this.ftpaReason = new FtpaReasonPage(page);
    this.ftpaEvidenceQuestion = new FtpaEvidenceQuestionPage(page);
    this.ftpaEvidence = new FtpaEvidencePage(page);
    this.ftpaCheckAnswers = new FtpaCheckAnswersPage(page);
    this.ftpaConfirmation = new FtpaConfirmationPage(page);
  }

  /**
   * Creates a new CuiPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newPageContext(options: { pageContext: Page }): Promise<CuiPages> {
    return new CuiPages(options.pageContext);
  }
}
