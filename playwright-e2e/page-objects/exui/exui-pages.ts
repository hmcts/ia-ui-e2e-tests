import { Page } from '@playwright/test';
import {
  CaseListPage,
  CardPaymentConfirmationPage,
  CaseOverviewPage,
  CreateCasePage,
  StartAppealAppealTypePage,
  StartAppealAppealGroundsHumanRightsRefusalPage,
  StartAppealAppealGroundsEuRefusalPage,
  StartAppealAppealGroundsDeprivationPage,
  StartAppealAppealGroundsProtectionPage,
  StartAppealAppealGroundsRevocationPage,
  StartAppealOutOfCountryPage,
  StartAppealOocAppellantAddressPage,
  StartAppealOocHomeOfficeReferenceNumberPage,
  StartAppealDepartureDatePage,
  StartAppealOutOfCountryDecisionTypePage,
  StartAppealDetentionPage,
  StartAppealDeportationOrderPage,
  StartAppealCustodialSentencePage,
  StartAppealRemovalDirectionsPage,
  StartAppealNewMattersPage,
  StartAppealHasOtherAppealsPage,
  StartAppealOtherAppealsPage,
  StartAppealLegalRepresentativeDetailsPage,
  StartAppealHearingFeeDecisionPage,
  StartAppealRpDcAppealHearingOptionPage,
  StartAppealPaymentOptionsPage,
  StartAppealRemissionTypePage,
  StartAppealHelpWithFeesPage,
  StartAppealDetentionFacilityPage,
  StartAppealIrcNamePage,
  StartAppealPrisonNamePage,
  StartAppealRemissionClaimPage,
  StartAppealRemissionAsylumSupportPage,
  StartAppealLegalAidPage,
  StartAppealSection17Page,
  StartAppealSection20Page,
  StartAppealHomeOfficeWaiverPage,
  StartAppealExceptionalCircumstancesRemissionPage,
  StartAppealAppellantBailApplicationPage,
  StartAppealAppellantBasicDetailsPage,
  StartAppealAppellantNationalitiesPage,
  StartAppealAppellantAddressPage,
  StartAppealAppellantContactPreferencePage,
  StartAppealHomeOfficeReferenceNumberPage,
  StartAppealHomeOfficeDecisionLetterPage,
  StartAppealEntryClearanceDecisionLetterPage,
  StartAppealUploadTheNoticeOfDecisionPage,
  StartAppealSponsorPage,
  StartAppealSponsorAuthorisationPage,
  StartAppealSponsorNamePage,
  StartAppealSponsorAddressPage,
  StartAppealSponsorContactPreferencePage,
  StartAppealSubmitPage,
  StartAppealConfirmPage,
  RecordRemissionDecisionPage,
  RecordRemissionDecisionDetailsPage,
  RecordRemissionDecisionSubmitPage,
  RecordRemissionDecisionConfirmPage,
  RequestRespondentEvidencePage,
  RequestRespondentEvidenceSubmitPage,
  RequestRespondentEvidenceConfirmPage,
  UploadHomeOfficeBundlePage,
  UploadHomeOfficeBundleSubmitPage,
  UploadHomeOfficeBundleConfirmPage,
  AipRequestAppealReasonsPage,
  AipRequestAppealReasonsSubmitPage,
  AipRequestAppealReasonsConfirmPage,
  RequestRespondentReviewPage,
  RequestRespondentReviewSubmitPage,
  RequestRespondentReviewConfirmPage,
  UploadHomeOfficeAppealResponseReviewOutcomePage,
  UploadHomeOfficeAppealResponsePage,
  UploadHomeOfficeAppealResponseSubmitPage,
  UploadHomeOfficeAppealResponseConfirmPage,
  ReviewHomeOfficeResponsePage,
  ReviewHomeOfficeResponseSubmitPage,
  ReviewHomeOfficeResponseConfirmPage,
  RequestHearingRequirementsPage,
  ReviewHearingRequirementsPage,
  ReviewHearingRequirementsRemoteHearingPage,
  ReviewHearingRequirementsPersonalVulnerabilitiesPage,
  ReviewHearingRequirementsMultimediaEvidencePage,
  ReviewHearingRequirementsSingleSexCourtPage,
  ReviewHearingRequirementsInCameraCourtPage,
  ReviewHearingRequirementsAddtionalRequirementsPage,
  ReviewHearingRequirementsHearingChannelPage,
  ReviewHearingRequirementsAppealSuitableToFloatPage,
  ReviewHearingRequirementsAdditionalIntructionsPage,
  ReviewHearingRequirementsSubmitPage,
  ReviewHearingRequirementsConfirmPage,
  HearingsPage,
  HearingRequirementsPage,
  HearingFacilitiesPage,
  HearingStagePage,
  HearingAttendancePage,
  HearingVenuePage,
  HearingWelshPage,
  HearingJudgePage,
  HearingPanelPage,
  HearingTimingPage,
  HearingLinkPage,
  HearingAdditionalInstructionsPage,
  HearingCreateEditSummaryPage,
  HearingConfirmationPage,
  ServiceRequestTabPage,
  ListCasePage,
  ListCaseSubmitPage,
  ListCaseConfirmPage,
  CreateCaseSummaryPage,
  CreateCaseSummarySubmitPage,
  CreateCaseSummaryConfirmPage,
  CompleteCaseReviewPage,
  CompleteCaseReviewConfirmPage,
  GenerateHearingBundlePage,
  GenerateHearingBundleConfirmPage,
  StartDecisionAndReasonsPage,
  DecisionAndReasonsStartedAppellantSummaryPage,
  DecisionAndReasonsStartedImmigrationHistoryPage,
  DecisionAndReasonsStartedScheduleOfIssuesPage,
  DecisionAndReasonsStartedSubmitPage,
  DecisionAndReasonsStartedConfirmPage,
  PrepareDecisionAndReasonsAnonymityOrderPage,
  PrepareDecisionAndReasonsLegalRepresentativesPage,
  PrepareDecisionAndReasonsSubmitPage,
  PrepareDecisionAndReasonsConfirmPage,
  CompleteDecisionAndReasonsPage,
  CompleteDecisionAndReasonsUploadDecisionPage,
  CompleteDecisionAndReasonsSubmitPage,
  CompleteDecisionAndReasonsConfirmPage,
  DecideFtpaApplicationPage,
  DecideFtpaApplicationAppellantOutcomeDecisionPage,
  DecideFtpaApplicationDecisionAndReasonsDocumentPage,
  DecideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage,
  DecideFtpaApplicationAppellantDecisionReasonNotesPage,
  DecideFtpaApplicationSubmitPage,
  DecideFtpaApplicationConfirmPage,
  GenerateUpperTribunalBundleSubmitPage,
  GenerateUpperTribunalBundleConfirmPage,
  RequestHomeOfficeDataPage,
  RequestHomeOfficeDataSubmitPage,
  RequestHomeOfficeDataConfirmPage,
  QueryPage,
  RaiseAQueryPage,
  RespondToAQueryPage,
  RespondToAQuerySubmitPage,
  RespondToAQueryConfirmPage,
  RaiseQuerySubmitPage,
  RaiseQueryConfirmPage,
  SubmitAppealDeclarationPage,
  SubmitAppealSubmissionOutOfTimePage,
  SubmitAppealConfirmPage,
  GenerateServiceRequestCreateAServiceRequestPage,
  GenerateServiceRequestConfirmPage,
  ValidationPage,
  QueriesTabPage,
  QueriesTabQueryDetailsPage,
  TasksTabPage,
} from './pages/index';
import { CardPaymentDetailsPage } from '../card-payment-details.po';
import { CardPaymentConfirmDetailsPage } from '../card-payment-confirm-details.po';

export class ExuiPages {
  private readonly page: Page;

  public readonly caseList: CaseListPage;
  public readonly cardPaymentConfirmation: CardPaymentConfirmationPage;
  public readonly caseOverview: CaseOverviewPage;
  public readonly createCase: CreateCasePage;
  public readonly startAppealAppealType: StartAppealAppealTypePage;
  public readonly startAppealAppealGroundsHumanRightsRefusal: StartAppealAppealGroundsHumanRightsRefusalPage;
  public readonly startAppealAppealGroundsEuRefusal: StartAppealAppealGroundsEuRefusalPage;
  public readonly startAppealAppealGroundsDeprivation: StartAppealAppealGroundsDeprivationPage;
  public readonly startAppealAppealGroundsProtection: StartAppealAppealGroundsProtectionPage;
  public readonly startAppealAppealGroundsRevocation: StartAppealAppealGroundsRevocationPage;
  public readonly startAppealOutOfCountry: StartAppealOutOfCountryPage;
  public readonly startAppealOocAppellantAddress: StartAppealOocAppellantAddressPage;
  public readonly startAppealOocHomeOfficeReferenceNumber: StartAppealOocHomeOfficeReferenceNumberPage;
  public readonly startAppealDepartureDate: StartAppealDepartureDatePage;
  public readonly startAppealOutOfCountryDecisionType: StartAppealOutOfCountryDecisionTypePage;
  public readonly startAppealDetention: StartAppealDetentionPage;
  public readonly startAppealDeportationOrder: StartAppealDeportationOrderPage;
  public readonly startAppealCustodialSentence: StartAppealCustodialSentencePage;
  public readonly startAppealRemovalDirections: StartAppealRemovalDirectionsPage;
  public readonly startAppealNewMatters: StartAppealNewMattersPage;
  public readonly startAppealHasOtherAppeals: StartAppealHasOtherAppealsPage;
  public readonly startAppealOtherAppeals: StartAppealOtherAppealsPage;
  public readonly startAppealLegalRepresentativeDetails: StartAppealLegalRepresentativeDetailsPage;
  public readonly startAppealHearingFeeDecision: StartAppealHearingFeeDecisionPage;
  public readonly startAppealRpDcAppealHearingOption: StartAppealRpDcAppealHearingOptionPage;
  public readonly startAppealPaymentOptions: StartAppealPaymentOptionsPage;
  public readonly startAppealRemissionType: StartAppealRemissionTypePage;
  public readonly startAppealHelpWithFees: StartAppealHelpWithFeesPage;
  public readonly startAppealDetentionFacility: StartAppealDetentionFacilityPage;
  public readonly startAppealIrcName: StartAppealIrcNamePage;
  public readonly startAppealPrisonName: StartAppealPrisonNamePage;
  public readonly startAppealRemissionClaim: StartAppealRemissionClaimPage;
  public readonly startAppealRemissionAsylumSupport: StartAppealRemissionAsylumSupportPage;
  public readonly startAppealLegalAid: StartAppealLegalAidPage;
  public readonly startAppealSection17: StartAppealSection17Page;
  public readonly startAppealSection20: StartAppealSection20Page;
  public readonly startAppealHomeOfficeWaiver: StartAppealHomeOfficeWaiverPage;
  public readonly startAppealExceptionalCircumstancesRemission: StartAppealExceptionalCircumstancesRemissionPage;
  public readonly startAppealAppellantBailApplication: StartAppealAppellantBailApplicationPage;
  public readonly startAppealAppellantBasicDetails: StartAppealAppellantBasicDetailsPage;
  public readonly startAppealAppellantNationalities: StartAppealAppellantNationalitiesPage;
  public readonly startAppealAppellantAddress: StartAppealAppellantAddressPage;
  public readonly startAppealAppellantContactPreference: StartAppealAppellantContactPreferencePage;
  public readonly startAppealHomeOfficeReferenceNumber: StartAppealHomeOfficeReferenceNumberPage;
  public readonly startAppealHomeOfficeDecisionLetter: StartAppealHomeOfficeDecisionLetterPage;
  public readonly startAppealEntryClearanceDecisionLetter: StartAppealEntryClearanceDecisionLetterPage;
  public readonly startAppealUploadTheNoticeOfDecision: StartAppealUploadTheNoticeOfDecisionPage;
  public readonly startAppealSponsor: StartAppealSponsorPage;
  public readonly startAppealSponsorAuthorisation: StartAppealSponsorAuthorisationPage;
  public readonly startAppealSponsorName: StartAppealSponsorNamePage;
  public readonly startAppealSponsorAddress: StartAppealSponsorAddressPage;
  public readonly startAppealSponsorContactPreference: StartAppealSponsorContactPreferencePage;
  public readonly startAppealSubmit: StartAppealSubmitPage;
  public readonly startAppealConfirm: StartAppealConfirmPage;
  public readonly recordRemissionDecision: RecordRemissionDecisionPage;
  public readonly recordRemissionDecisionDetails: RecordRemissionDecisionDetailsPage;
  public readonly recordRemissionDecisionSubmit: RecordRemissionDecisionSubmitPage;
  public readonly recordRemissionDecisionConfirm: RecordRemissionDecisionConfirmPage;
  public readonly requestRespondentEvidence: RequestRespondentEvidencePage;
  public readonly requestRespondentEvidenceSubmit: RequestRespondentEvidenceSubmitPage;
  public readonly requestRespondentEvidenceConfirm: RequestRespondentEvidenceConfirmPage;
  public readonly uploadHomeOfficeBundle: UploadHomeOfficeBundlePage;
  public readonly uploadHomeOfficeBundleSubmit: UploadHomeOfficeBundleSubmitPage;
  public readonly uploadHomeOfficeBundleConfirm: UploadHomeOfficeBundleConfirmPage;
  public readonly aipRequestAppealReasons: AipRequestAppealReasonsPage;
  public readonly aipRequestAppealReasonsSubmit: AipRequestAppealReasonsSubmitPage;
  public readonly aipRequestAppealReasonsConfirm: AipRequestAppealReasonsConfirmPage;
  public readonly requestRespondentReview: RequestRespondentReviewPage;
  public readonly requestRespondentReviewSubmit: RequestRespondentReviewSubmitPage;
  public readonly requestRespondentReviewConfirm: RequestRespondentReviewConfirmPage;
  public readonly uploadHomeOfficeAppealResponseReviewOutcome: UploadHomeOfficeAppealResponseReviewOutcomePage;
  public readonly uploadHomeOfficeAppealResponse: UploadHomeOfficeAppealResponsePage;
  public readonly uploadHomeOfficeAppealResponseSubmit: UploadHomeOfficeAppealResponseSubmitPage;
  public readonly uploadHomeOfficeAppealResponseConfirm: UploadHomeOfficeAppealResponseConfirmPage;
  public readonly reviewHomeOfficeResponse: ReviewHomeOfficeResponsePage;
  public readonly reviewHomeOfficeResponseSubmit: ReviewHomeOfficeResponseSubmitPage;
  public readonly reviewHomeOfficeResponseConfirm: ReviewHomeOfficeResponseConfirmPage;
  public readonly requestHearingRequirements: RequestHearingRequirementsPage;
  public readonly reviewHearingRequirements: ReviewHearingRequirementsPage;
  public readonly reviewHearingRequirementsRemoteHearing: ReviewHearingRequirementsRemoteHearingPage;
  public readonly reviewHearingRequirementsPersonalVulnerabilities: ReviewHearingRequirementsPersonalVulnerabilitiesPage;
  public readonly reviewHearingRequirementsMultimediaEvidence: ReviewHearingRequirementsMultimediaEvidencePage;
  public readonly reviewHearingRequirementsSingleSexCourt: ReviewHearingRequirementsSingleSexCourtPage;
  public readonly reviewHearingRequirementsInCameraCourt: ReviewHearingRequirementsInCameraCourtPage;
  public readonly reviewHearingRequirementsAddtionalRequirements: ReviewHearingRequirementsAddtionalRequirementsPage;
  public readonly reviewHearingRequirementsHearingChannel: ReviewHearingRequirementsHearingChannelPage;
  public readonly reviewHearingRequirementsAppealSuitableToFloat: ReviewHearingRequirementsAppealSuitableToFloatPage;
  public readonly reviewHearingRequirementsAdditionalIntructions: ReviewHearingRequirementsAdditionalIntructionsPage;
  public readonly reviewHearingRequirementsSubmit: ReviewHearingRequirementsSubmitPage;
  public readonly reviewHearingRequirementsConfirm: ReviewHearingRequirementsConfirmPage;
  public readonly hearings: HearingsPage;
  public readonly hearingRequirements: HearingRequirementsPage;
  public readonly hearingFacilities: HearingFacilitiesPage;
  public readonly hearingStage: HearingStagePage;
  public readonly hearingAttendance: HearingAttendancePage;
  public readonly hearingVenue: HearingVenuePage;
  public readonly hearingWelsh: HearingWelshPage;
  public readonly hearingJudge: HearingJudgePage;
  public readonly hearingPanel: HearingPanelPage;
  public readonly hearingTiming: HearingTimingPage;
  public readonly hearingLink: HearingLinkPage;
  public readonly hearingAdditionalInstructions: HearingAdditionalInstructionsPage;
  public readonly hearingCreateEditSummary: HearingCreateEditSummaryPage;
  public readonly hearingConfirmation: HearingConfirmationPage;
  public readonly serviceRequestTab: ServiceRequestTabPage;
  public readonly listCase: ListCasePage;
  public readonly listCaseSubmit: ListCaseSubmitPage;
  public readonly listCaseConfirm: ListCaseConfirmPage;
  public readonly createCaseSummary: CreateCaseSummaryPage;
  public readonly createCaseSummarySubmit: CreateCaseSummarySubmitPage;
  public readonly createCaseSummaryConfirm: CreateCaseSummaryConfirmPage;
  public readonly completeCaseReview: CompleteCaseReviewPage;
  public readonly completeCaseReviewConfirm: CompleteCaseReviewConfirmPage;
  public readonly generateHearingBundle: GenerateHearingBundlePage;
  public readonly generateHearingBundleConfirm: GenerateHearingBundleConfirmPage;
  public readonly startDecisionAndReasons: StartDecisionAndReasonsPage;
  public readonly decisionAndReasonsStartedAppellantSummary: DecisionAndReasonsStartedAppellantSummaryPage;
  public readonly decisionAndReasonsStartedImmigrationHistory: DecisionAndReasonsStartedImmigrationHistoryPage;
  public readonly decisionAndReasonsStartedScheduleOfIssues: DecisionAndReasonsStartedScheduleOfIssuesPage;
  public readonly decisionAndReasonsStartedSubmit: DecisionAndReasonsStartedSubmitPage;
  public readonly decisionAndReasonsStartedConfirm: DecisionAndReasonsStartedConfirmPage;
  public readonly prepareDecisionAndReasonsAnonymityOrder: PrepareDecisionAndReasonsAnonymityOrderPage;
  public readonly prepareDecisionAndReasonsLegalRepresentatives: PrepareDecisionAndReasonsLegalRepresentativesPage;
  public readonly prepareDecisionAndReasonsSubmit: PrepareDecisionAndReasonsSubmitPage;
  public readonly prepareDecisionAndReasonsConfirm: PrepareDecisionAndReasonsConfirmPage;
  public readonly completeDecisionAndReasons: CompleteDecisionAndReasonsPage;
  public readonly completeDecisionAndReasonsUploadDecision: CompleteDecisionAndReasonsUploadDecisionPage;
  public readonly completeDecisionAndReasonsSubmit: CompleteDecisionAndReasonsSubmitPage;
  public readonly completeDecisionAndReasonsConfirm: CompleteDecisionAndReasonsConfirmPage;
  public readonly decideFtpaApplication: DecideFtpaApplicationPage;
  public readonly decideFtpaApplicationAppellantOutcomeDecision: DecideFtpaApplicationAppellantOutcomeDecisionPage;
  public readonly decideFtpaApplicationDecisionAndReasonsDocument: DecideFtpaApplicationDecisionAndReasonsDocumentPage;
  public readonly decideFtpaApplicationAppellantNoticeOfDecisionSetAside: DecideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage;
  public readonly decideFtpaApplicationAppellantDecisionReasonNotes: DecideFtpaApplicationAppellantDecisionReasonNotesPage;
  public readonly decideFtpaApplicationSubmit: DecideFtpaApplicationSubmitPage;
  public readonly decideFtpaApplicationConfirm: DecideFtpaApplicationConfirmPage;
  public readonly generateUpperTribunalBundleSubmit: GenerateUpperTribunalBundleSubmitPage;
  public readonly generateUpperTribunalBundleConfirm: GenerateUpperTribunalBundleConfirmPage;
  public readonly requestHomeOfficeData: RequestHomeOfficeDataPage;
  public readonly requestHomeOfficeDataSubmit: RequestHomeOfficeDataSubmitPage;
  public readonly requestHomeOfficeDataConfirm: RequestHomeOfficeDataConfirmPage;
  public readonly query: QueryPage;
  public readonly raiseAQuery: RaiseAQueryPage;
  public readonly respondToAQuery: RespondToAQueryPage;
  public readonly respondToAQuerySubmit: RespondToAQuerySubmitPage;
  public readonly respondToAQueryConfirm: RespondToAQueryConfirmPage;
  public readonly raiseQuerySubmit: RaiseQuerySubmitPage;
  public readonly raiseQueryConfirm: RaiseQueryConfirmPage;
  public readonly submitAppealDeclaration: SubmitAppealDeclarationPage;
  public readonly submitAppealSubmissionOutOfTime: SubmitAppealSubmissionOutOfTimePage;
  public readonly submitAppealConfirm: SubmitAppealConfirmPage;
  public readonly generateServiceRequestCreateAServiceRequest: GenerateServiceRequestCreateAServiceRequestPage;
  public readonly generateServiceRequestConfirm: GenerateServiceRequestConfirmPage;
  public readonly validation: ValidationPage;
  public readonly cardPaymentDetails: CardPaymentDetailsPage;
  public readonly cardPaymentConfirmDetails: CardPaymentConfirmDetailsPage;
  public readonly queriesTab: QueriesTabPage;
  public readonly queriesTabQueryDetails: QueriesTabQueryDetailsPage;
  public readonly tasksTab: TasksTabPage;

  constructor(page: Page) {
    this.page = page;
    this.caseList = new CaseListPage(this.page);
    this.cardPaymentConfirmation = new CardPaymentConfirmationPage(this.page);
    this.caseOverview = new CaseOverviewPage(this.page);
    this.createCase = new CreateCasePage(this.page);
    this.startAppealAppealType = new StartAppealAppealTypePage(this.page);
    this.startAppealAppealGroundsHumanRightsRefusal = new StartAppealAppealGroundsHumanRightsRefusalPage(this.page);
    this.startAppealAppealGroundsEuRefusal = new StartAppealAppealGroundsEuRefusalPage(this.page);
    this.startAppealAppealGroundsDeprivation = new StartAppealAppealGroundsDeprivationPage(this.page);
    this.startAppealAppealGroundsProtection = new StartAppealAppealGroundsProtectionPage(this.page);
    this.startAppealAppealGroundsRevocation = new StartAppealAppealGroundsRevocationPage(this.page);
    this.startAppealOutOfCountry = new StartAppealOutOfCountryPage(this.page);
    this.startAppealOocAppellantAddress = new StartAppealOocAppellantAddressPage(this.page);
    this.startAppealOocHomeOfficeReferenceNumber = new StartAppealOocHomeOfficeReferenceNumberPage(this.page);
    this.startAppealDepartureDate = new StartAppealDepartureDatePage(this.page);
    this.startAppealOutOfCountryDecisionType = new StartAppealOutOfCountryDecisionTypePage(this.page);
    this.startAppealDetention = new StartAppealDetentionPage(this.page);
    this.startAppealDeportationOrder = new StartAppealDeportationOrderPage(this.page);
    this.startAppealCustodialSentence = new StartAppealCustodialSentencePage(this.page);
    this.startAppealRemovalDirections = new StartAppealRemovalDirectionsPage(this.page);
    this.startAppealNewMatters = new StartAppealNewMattersPage(this.page);
    this.startAppealHasOtherAppeals = new StartAppealHasOtherAppealsPage(this.page);
    this.startAppealOtherAppeals = new StartAppealOtherAppealsPage(this.page);
    this.startAppealLegalRepresentativeDetails = new StartAppealLegalRepresentativeDetailsPage(this.page);
    this.startAppealHearingFeeDecision = new StartAppealHearingFeeDecisionPage(this.page);
    this.startAppealRpDcAppealHearingOption = new StartAppealRpDcAppealHearingOptionPage(this.page);
    this.startAppealPaymentOptions = new StartAppealPaymentOptionsPage(this.page);
    this.startAppealRemissionType = new StartAppealRemissionTypePage(this.page);
    this.startAppealHelpWithFees = new StartAppealHelpWithFeesPage(this.page);
    this.startAppealDetentionFacility = new StartAppealDetentionFacilityPage(this.page);
    this.startAppealIrcName = new StartAppealIrcNamePage(this.page);
    this.startAppealPrisonName = new StartAppealPrisonNamePage(this.page);
    this.startAppealRemissionClaim = new StartAppealRemissionClaimPage(this.page);
    this.startAppealRemissionAsylumSupport = new StartAppealRemissionAsylumSupportPage(this.page);
    this.startAppealLegalAid = new StartAppealLegalAidPage(this.page);
    this.startAppealSection17 = new StartAppealSection17Page(this.page);
    this.startAppealSection20 = new StartAppealSection20Page(this.page);
    this.startAppealHomeOfficeWaiver = new StartAppealHomeOfficeWaiverPage(this.page);
    this.startAppealExceptionalCircumstancesRemission = new StartAppealExceptionalCircumstancesRemissionPage(this.page);
    this.startAppealAppellantBailApplication = new StartAppealAppellantBailApplicationPage(this.page);
    this.startAppealAppellantBasicDetails = new StartAppealAppellantBasicDetailsPage(this.page);
    this.startAppealAppellantNationalities = new StartAppealAppellantNationalitiesPage(this.page);
    this.startAppealAppellantAddress = new StartAppealAppellantAddressPage(this.page);
    this.startAppealAppellantContactPreference = new StartAppealAppellantContactPreferencePage(this.page);
    this.startAppealHomeOfficeReferenceNumber = new StartAppealHomeOfficeReferenceNumberPage(this.page);
    this.startAppealHomeOfficeDecisionLetter = new StartAppealHomeOfficeDecisionLetterPage(this.page);
    this.startAppealEntryClearanceDecisionLetter = new StartAppealEntryClearanceDecisionLetterPage(this.page);
    this.startAppealUploadTheNoticeOfDecision = new StartAppealUploadTheNoticeOfDecisionPage(this.page);
    this.startAppealSponsor = new StartAppealSponsorPage(this.page);
    this.startAppealSponsorAuthorisation = new StartAppealSponsorAuthorisationPage(this.page);
    this.startAppealSponsorName = new StartAppealSponsorNamePage(this.page);
    this.startAppealSponsorAddress = new StartAppealSponsorAddressPage(this.page);
    this.startAppealSponsorContactPreference = new StartAppealSponsorContactPreferencePage(this.page);
    this.startAppealSubmit = new StartAppealSubmitPage(this.page);
    this.startAppealConfirm = new StartAppealConfirmPage(this.page);
    this.recordRemissionDecision = new RecordRemissionDecisionPage(this.page);
    this.recordRemissionDecisionDetails = new RecordRemissionDecisionDetailsPage(this.page);
    this.recordRemissionDecisionSubmit = new RecordRemissionDecisionSubmitPage(this.page);
    this.recordRemissionDecisionConfirm = new RecordRemissionDecisionConfirmPage(this.page);
    this.requestRespondentEvidence = new RequestRespondentEvidencePage(this.page);
    this.requestRespondentEvidenceSubmit = new RequestRespondentEvidenceSubmitPage(this.page);
    this.requestRespondentEvidenceConfirm = new RequestRespondentEvidenceConfirmPage(this.page);
    this.uploadHomeOfficeBundle = new UploadHomeOfficeBundlePage(this.page);
    this.uploadHomeOfficeBundleSubmit = new UploadHomeOfficeBundleSubmitPage(this.page);
    this.uploadHomeOfficeBundleConfirm = new UploadHomeOfficeBundleConfirmPage(this.page);
    this.aipRequestAppealReasons = new AipRequestAppealReasonsPage(this.page);
    this.aipRequestAppealReasonsSubmit = new AipRequestAppealReasonsSubmitPage(this.page);
    this.aipRequestAppealReasonsConfirm = new AipRequestAppealReasonsConfirmPage(this.page);
    this.requestRespondentReview = new RequestRespondentReviewPage(this.page);
    this.requestRespondentReviewSubmit = new RequestRespondentReviewSubmitPage(this.page);
    this.requestRespondentReviewConfirm = new RequestRespondentReviewConfirmPage(this.page);
    this.uploadHomeOfficeAppealResponseReviewOutcome = new UploadHomeOfficeAppealResponseReviewOutcomePage(this.page);
    this.uploadHomeOfficeAppealResponse = new UploadHomeOfficeAppealResponsePage(this.page);
    this.uploadHomeOfficeAppealResponseSubmit = new UploadHomeOfficeAppealResponseSubmitPage(this.page);
    this.uploadHomeOfficeAppealResponseConfirm = new UploadHomeOfficeAppealResponseConfirmPage(this.page);
    this.reviewHomeOfficeResponse = new ReviewHomeOfficeResponsePage(this.page);
    this.reviewHomeOfficeResponseSubmit = new ReviewHomeOfficeResponseSubmitPage(this.page);
    this.reviewHomeOfficeResponseConfirm = new ReviewHomeOfficeResponseConfirmPage(this.page);
    this.requestHearingRequirements = new RequestHearingRequirementsPage(this.page);
    this.reviewHearingRequirements = new ReviewHearingRequirementsPage(this.page);
    this.reviewHearingRequirementsRemoteHearing = new ReviewHearingRequirementsRemoteHearingPage(this.page);
    this.reviewHearingRequirementsPersonalVulnerabilities = new ReviewHearingRequirementsPersonalVulnerabilitiesPage(this.page);
    this.reviewHearingRequirementsMultimediaEvidence = new ReviewHearingRequirementsMultimediaEvidencePage(this.page);
    this.reviewHearingRequirementsSingleSexCourt = new ReviewHearingRequirementsSingleSexCourtPage(this.page);
    this.reviewHearingRequirementsInCameraCourt = new ReviewHearingRequirementsInCameraCourtPage(this.page);
    this.reviewHearingRequirementsAddtionalRequirements = new ReviewHearingRequirementsAddtionalRequirementsPage(this.page);
    this.reviewHearingRequirementsHearingChannel = new ReviewHearingRequirementsHearingChannelPage(this.page);
    this.reviewHearingRequirementsAppealSuitableToFloat = new ReviewHearingRequirementsAppealSuitableToFloatPage(this.page);
    this.reviewHearingRequirementsAdditionalIntructions = new ReviewHearingRequirementsAdditionalIntructionsPage(this.page);
    this.reviewHearingRequirementsSubmit = new ReviewHearingRequirementsSubmitPage(this.page);
    this.reviewHearingRequirementsConfirm = new ReviewHearingRequirementsConfirmPage(this.page);
    this.hearings = new HearingsPage(this.page);
    this.hearingRequirements = new HearingRequirementsPage(this.page);
    this.hearingFacilities = new HearingFacilitiesPage(this.page);
    this.hearingStage = new HearingStagePage(this.page);
    this.hearingAttendance = new HearingAttendancePage(this.page);
    this.hearingVenue = new HearingVenuePage(this.page);
    this.hearingWelsh = new HearingWelshPage(this.page);
    this.hearingJudge = new HearingJudgePage(this.page);
    this.hearingPanel = new HearingPanelPage(this.page);
    this.hearingTiming = new HearingTimingPage(this.page);
    this.hearingLink = new HearingLinkPage(this.page);
    this.hearingAdditionalInstructions = new HearingAdditionalInstructionsPage(this.page);
    this.hearingCreateEditSummary = new HearingCreateEditSummaryPage(this.page);
    this.hearingConfirmation = new HearingConfirmationPage(this.page);
    this.serviceRequestTab = new ServiceRequestTabPage(this.page);
    this.listCase = new ListCasePage(this.page);
    this.listCaseSubmit = new ListCaseSubmitPage(this.page);
    this.listCaseConfirm = new ListCaseConfirmPage(this.page);
    this.createCaseSummary = new CreateCaseSummaryPage(this.page);
    this.createCaseSummarySubmit = new CreateCaseSummarySubmitPage(this.page);
    this.createCaseSummaryConfirm = new CreateCaseSummaryConfirmPage(this.page);
    this.completeCaseReview = new CompleteCaseReviewPage(this.page);
    this.completeCaseReviewConfirm = new CompleteCaseReviewConfirmPage(this.page);
    this.generateHearingBundle = new GenerateHearingBundlePage(this.page);
    this.generateHearingBundleConfirm = new GenerateHearingBundleConfirmPage(this.page);
    this.startDecisionAndReasons = new StartDecisionAndReasonsPage(this.page);
    this.decisionAndReasonsStartedAppellantSummary = new DecisionAndReasonsStartedAppellantSummaryPage(this.page);
    this.decisionAndReasonsStartedImmigrationHistory = new DecisionAndReasonsStartedImmigrationHistoryPage(this.page);
    this.decisionAndReasonsStartedScheduleOfIssues = new DecisionAndReasonsStartedScheduleOfIssuesPage(this.page);
    this.decisionAndReasonsStartedSubmit = new DecisionAndReasonsStartedSubmitPage(this.page);
    this.decisionAndReasonsStartedConfirm = new DecisionAndReasonsStartedConfirmPage(this.page);
    this.prepareDecisionAndReasonsAnonymityOrder = new PrepareDecisionAndReasonsAnonymityOrderPage(this.page);
    this.prepareDecisionAndReasonsLegalRepresentatives = new PrepareDecisionAndReasonsLegalRepresentativesPage(this.page);
    this.prepareDecisionAndReasonsSubmit = new PrepareDecisionAndReasonsSubmitPage(this.page);
    this.prepareDecisionAndReasonsConfirm = new PrepareDecisionAndReasonsConfirmPage(this.page);
    this.completeDecisionAndReasons = new CompleteDecisionAndReasonsPage(this.page);
    this.completeDecisionAndReasonsUploadDecision = new CompleteDecisionAndReasonsUploadDecisionPage(this.page);
    this.completeDecisionAndReasonsSubmit = new CompleteDecisionAndReasonsSubmitPage(this.page);
    this.completeDecisionAndReasonsConfirm = new CompleteDecisionAndReasonsConfirmPage(this.page);
    this.decideFtpaApplication = new DecideFtpaApplicationPage(this.page);
    this.decideFtpaApplicationAppellantOutcomeDecision = new DecideFtpaApplicationAppellantOutcomeDecisionPage(this.page);
    this.decideFtpaApplicationDecisionAndReasonsDocument = new DecideFtpaApplicationDecisionAndReasonsDocumentPage(this.page);
    this.decideFtpaApplicationAppellantNoticeOfDecisionSetAside = new DecideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage(this.page);
    this.decideFtpaApplicationAppellantDecisionReasonNotes = new DecideFtpaApplicationAppellantDecisionReasonNotesPage(this.page);
    this.decideFtpaApplicationSubmit = new DecideFtpaApplicationSubmitPage(this.page);
    this.decideFtpaApplicationConfirm = new DecideFtpaApplicationConfirmPage(this.page);
    this.generateUpperTribunalBundleSubmit = new GenerateUpperTribunalBundleSubmitPage(this.page);
    this.generateUpperTribunalBundleConfirm = new GenerateUpperTribunalBundleConfirmPage(this.page);
    this.requestHomeOfficeData = new RequestHomeOfficeDataPage(this.page);
    this.requestHomeOfficeDataSubmit = new RequestHomeOfficeDataSubmitPage(this.page);
    this.requestHomeOfficeDataConfirm = new RequestHomeOfficeDataConfirmPage(this.page);
    this.query = new QueryPage(this.page);
    this.raiseAQuery = new RaiseAQueryPage(this.page);
    this.respondToAQuery = new RespondToAQueryPage(this.page);
    this.respondToAQuerySubmit = new RespondToAQuerySubmitPage(this.page);
    this.respondToAQueryConfirm = new RespondToAQueryConfirmPage(this.page);
    this.raiseQuerySubmit = new RaiseQuerySubmitPage(this.page);
    this.raiseQueryConfirm = new RaiseQueryConfirmPage(this.page);
    this.submitAppealDeclaration = new SubmitAppealDeclarationPage(this.page);
    this.submitAppealSubmissionOutOfTime = new SubmitAppealSubmissionOutOfTimePage(this.page);
    this.submitAppealConfirm = new SubmitAppealConfirmPage(this.page);
    this.generateServiceRequestCreateAServiceRequest = new GenerateServiceRequestCreateAServiceRequestPage(this.page);
    this.generateServiceRequestConfirm = new GenerateServiceRequestConfirmPage(this.page);
    this.validation = new ValidationPage(this.page);
    this.cardPaymentDetails = new CardPaymentDetailsPage(this.page);
    this.cardPaymentConfirmDetails = new CardPaymentConfirmDetailsPage(this.page);
    this.queriesTab = new QueriesTabPage(this.page);
    this.queriesTabQueryDetails = new QueriesTabQueryDetailsPage(this.page);
    this.tasksTab = new TasksTabPage(this.page);
  }

  /**
   * Creates a new ExuiPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newPageContext(options: { pageContext: Page }): Promise<ExuiPages> {
    return new ExuiPages(options.pageContext);
  }
}
