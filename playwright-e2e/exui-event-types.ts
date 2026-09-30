import { AppealType, Nationality, YesOrNoType } from './citizen-types';

export type RemissionDecisionType = 'approved' | 'partiallyApproved' | 'rejected';
export type HomeOfficeAppealReviewOutcomeType = 'Decision maintained' | 'Decision withdrawn';
export type GrantedOrRefusedType = 'Granted' | 'Refused';
export type HearingChannelType = 'In Person' | 'Not in Attendance' | 'On the Papers' | 'Telephone' | 'Video';
export type RaiseQueryOptionType =
  | 'How can I obtain access to my case on MyHMCTS?'
  | 'How do I request that a hearing be converted to CVP?'
  | 'What should I do if I have not received my CVP hearing link?'
  | 'Has my B1 form been received?'
  | 'Has my adjournment request been received?'
  | 'Has my hearing bundle been received?'
  | 'Is my hearing scheduled to proceed as planned?'
  | 'How can instructed counsel obtain hearing details?'
  | 'Follow-up on an existing query'
  | 'Raise a new query';

export type RemissionDecisionEventType = {
  caseId: string;
  decision: RemissionDecisionType;
  amountRemitted?: number;
  amountLeftToPay?: number;
  reason?: string;
};

export type RequestRespondentEvidenceEventType = {
  caseId: string;
  sendDirectionDateDue?: {
    day: number;
    month: number;
    year: number;
  };
  sendDirectionExplanation?: string;
};

export type RequestReasonsForAppealEventType = RequestRespondentEvidenceEventType;
export type RequestRespondentReviewEventType = RequestRespondentEvidenceEventType;
export type RequestResponseReviewEventType = RequestRespondentEvidenceEventType;

export type UploadHomeOfficeBundleEventType = {
  caseId: string;
  nameOfFileToUpload?: string;
  description: string;
};

export type UploadHomeOfficeAppealResponseEventType = {
  caseId: string;
  appealReviewOutcome: HomeOfficeAppealReviewOutcomeType;
  nameOfFileToUpload?: string;
  homeOfficeAppealResponseDescription?: string;
};

export type CreateCaseSummaryEventType = {
  caseId: string;
  nameOfFileToUpload?: string;
  description?: string;
};

export type SendDirectionEventType = {
  caseId: string;
  explinationOfDirection: string;
  whoToSendDirectionTo: 'Legal representative' | 'Respondent' | 'Legal representative and Respondent' | 'Appellant' | 'Appellant and Respondent';
  dateDirectionIsDue: {
    day: number;
    month: number;
    year: number;
  };
};

export type ReviewHearingRequirementsEventType = {
  caseId: string;
  isRemoteHearingAllowed: GrantedOrRefusedType;
  grantOrRefuseAnyAdjustmentsRequested: GrantedOrRefusedType;
  isApplicationSuitableToFloat: YesOrNoType;
  anyAdditionalInstructions: YesOrNoType;
  hearingType: HearingChannelType;
};

export type RequestAHearingEventType = {
  caseId: string;
  hearingType: 'Bail' | 'Case Management Review' | 'Costs' | 'Substantive';
  hearingChannel: 'In Person' | 'Telephone' | 'Video';
  courtLocation: 'Newport';
  numberOfPhysicalAttendees: number;
};

export type ListCaseEventType = {
  caseId: string;
  isRemoteHearing: YesOrNoType;
  hearingDateAndTime: { day: number; month: number; year: number; hour?: number; minute?: number };
};

export type DecisionAndReasonsStartedEventType = {
  caseId: string;
  doYouAgreeWithImmigrationHistory: YesOrNoType;
  doYouAgreeWithscheduleOfIssuesAgreement: YesOrNoType;
  caseSummary?: string;
  caseIntro?: string;
};

export type GenerateDecisionAndReasonsEventType = {
  caseId: string;
  anonymityOrder: YesOrNoType;
  appellantRepresentative?: string;
  respondentRepresentative?: string;
};

export type SendDecisionAndReasonsEventType = {
  caseId: string;
  isDecisionAllowed: 'Allowed' | 'Dismissed';
  nameOfFileToUpload?: string;
};

export type ExuiCreateCaseType = {
  jurisdiction: 'Immigration & Asylum' | 'Manage probate application' | 'Family Divorce' | 'Civil' | 'Public Law';
  caseType: 'Appeal* master' | 'Bail* master' | 'Appeal-864' | 'AppealDIAC-864-hmc-pre' | 'Asylum-hmc-int-spike';
};
export type DetentionFacilityType = 'Immigration removal centre' | 'Prison' | 'Other';
export type ImmigrationRemovalCentreNameType =
  | 'Brook House'
  | 'Campsfield House'
  | 'Colnbrook'
  | 'Derwentside'
  | 'Dungavel'
  | 'Harmondsworth'
  | 'Swinderby'
  | 'Tinsley House'
  | "Yarl's Wood";
export type PrisonNameType =
  | 'HM Prison Addiewell'
  | 'HM Prison Aylesbury'
  | 'HM Prison Belmarsh'
  | 'HM Prison Berwyn'
  | 'HM Prison Birmingham'
  | 'HM Prison Camp Hill'
  | 'HM Prison Cardiff'
  | 'HM Prison Dartmoor'
  | 'HM Prison Deerbolt'
  | 'HM Prison East Sutton Park'
  | 'HM Prison Eastwood Park'
  | 'HM Prison Featherstone'
  | 'HM Prison Feltham'
  | 'HM Prison Garth'
  | 'HM Prison Gartree'
  | 'HMP/YOI Hatfield (Main site)'
  | 'HMP/YOI Hatfield (Lakes site)'
  | 'HM Prison Inverness'
  | 'HM Prison Isle of Wight'
  | 'HM Prison Kennet'
  | 'HM Prison Kilmarnock'
  | 'HM Prison Lancaster'
  | 'HM Prison Lancaster Farms'
  | 'HM Prison Magilligan'
  | 'HM Prison Maghaberry'
  | 'HM Prison New Hall'
  | 'HM Prison North Sea Camp'
  | 'HM Prison Onley'
  | 'HM Prison Oakwood'
  | 'HM Prison Parc'
  | 'HM Prison Parkhurst'
  | 'HM Prison Ranby'
  | 'HM Prison Reading'
  | 'HM Prison Send'
  | 'HM Prison Shepton Mallet'
  | 'HM Prison Thameside'
  | 'HM Prison The Mount'
  | 'HM Prison Wakefield'
  | 'HM Prison Wandsworth';
export type PendingBailApplicationType = 'Yes' | 'Yes, but the bail application number was not provided' | 'No' | "I'm not sure";
export type ExuiAppealType =
  | 'Refusal of a human rights claim'
  | 'Refusal of application under the EEA regulations'
  | 'Deprivation of citizenship'
  | 'Refusal of protection claim'
  | 'Revocation of a protection status'
  | 'Refusal of application under the EU Settlement Scheme';
export type ExuiAppealGroundsHumanRightsRefusalType = 'The decision is unlawful under section 6 of the Human Rights Act 1998';
export type ExuiAppealGroundsEuRefusalType = "The decision breaches the appellant's rights under the EEA regulations";
export type ExuiAppealGroundsDeprivationType =
  | 'Deprivation would have a disproportionate effect'
  | 'The decision is unlawful because discretion should have been exercised differently';
export type ExuiAppealGroundsDeprivationHumanRightsType =
  'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998';
export type ExuiAppealGroundsProtectionType =
  | "Removing the appellant from the UK would breach the UK's obligation in relation to persons eligible for a grant of humanitarian protection"
  | "Removing the appellant from the UK would breach the UK's obligation under the Refugee Convention";
export type ExuiAppealGroundsProtectionHumanRightsType =
  'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998';
export type ExuiAppealGroundsRevocationType =
  | "Revocation of the appellant's protection status breaches the United Kingdom's obligations in relation to persons eligible for humanitarian protection"
  | "Revocation of the appellant's protection status breaches the United Kingdom's obligations under the Refugee Convention";
export type ExuiRemissionClaimType =
  | 'The appellant receives Asylum Support'
  | 'The appellant receives Legal Aid'
  | 'The appellant receives (or has parental responsibility for a person who receives) benefit services or accommodation provided by a local authority under section 17 of the Children Act 1989, section 22 of the Children (Scotland) Act 1995, article 18 of the Children (Northern Ireland) Order 1995 or section 37 of the Social Services and Well-being (Wales) Act 2014'
  | "The appellant's accommodation is being provided by a local authority under section 20 of the Children Act 1989, section 25 of the Children (Scotland) Act 1995, article 21 of the Children (Northern Ireland) Order 1995 or section 76 of the Social Services and Well-being (Wales) Act 2014"
  | 'The Home Office waived the fee for the application this appeal relates to';
export type OutOfCountryDecisionType =
  | 'A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016'
  | 'A decision to refuse a protection or human rights claim where your client may only apply after leaving the UK'
  | 'A decision either 1) to remove your client from the UK under the Immigration (European Economic Area) Regulations 2016, where they are currently outside the UK or 2) to deprive your client of British citizenship, where they are currently outside the UK'
  | 'A decision to refuse a permit to enter the UK or entry clearance under the immigration rules and/or the EU Settlement Scheme.';
export type SponsorContactPreferenceType = 'Email' | 'Text message';
export type HasOtherAppealsType = 'Yes' | 'Yes, but an appeal number was not provided' | 'No' | "I'm not sure";
export type HearingFeeDecisionType =
  | 'Decision with a hearing. The fee for this type of appeal is £144'
  | 'Decision without a hearing. The fee for this type of appeal is £82';
export type StartAppealPaymentOptionType = 'Pay Now' | 'Pay Later';
export type HearingWihtoutFeeDecisionType = 'Decision with a hearing' | 'Decision without a hearing';
export type RemissionTypeOption =
  | 'The appellant is not eligible for a fee remission'
  | 'The appellant has a remission, e.g. Asylum support, Legal Aid, Home Office waiver, Section 17/20'
  | 'The appellant has applied for help with fees'
  | 'The appellant wants to apply for an Exceptional Circumstances Remission';
