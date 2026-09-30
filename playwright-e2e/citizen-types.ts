export type YesOrNoType = 'Yes' | 'No';
export type decisionWithOrWithoutHearingType = 'decisionWithHearing' | 'decisionWithoutHearing';
export type payForAppealNowOrLaterType = 'payNow' | 'payLater';

export type YourDetailsJourney = {
  isUserInTheUk: YesOrNoType;
  appealType: AppealType;
  isApplicantStateless: boolean;
  isApplicationInTime: boolean;
  nationality?: Nationality;
  hasApplicantReceivedADeportationOrder: YesOrNoType;
  sponsorDetails: {
    doesApplicantHaveASponsor: YesOrNoType;
    doesApplicantHaveANonLegalRepSponsor: YesOrNoType;
    isSponsorAndNonLegalRepTheSamePerson?: YesOrNoType;
  };
};

export type DecisionTypeJourney = {
  appealType: AppealType;
  decisionWithOrWithoutHearing: decisionWithOrWithoutHearingType;
  payForAppealNowOrLater?: payForAppealNowOrLaterType;
};

export type FeeSupportJourney = {
  whetherApplicantHasToPayAFee: FeeSupportType;
};

export type CheckAndSendJourney = {
  isApplicationInTime: boolean;
  appealSubmissionType: 'Non-Pay Appeal' | 'Pay Appeal';
};

export type AppealData = YourDetailsJourney &
  DecisionTypeJourney &
  CheckAndSendJourney & {
    whetherApplicantHasToPayAFee?: FeeSupportType;
  };

export type AppealReasonsFlowType = {
  caseId: string;
  doesApplicantRequireMoreTimeToSubmitAppealReasons: boolean;
  appealReasons?: {
    reasonWhyHomeOfficeDecisionIsWrong: string;
    doYouWishToProvideSupportingEvidence: YesOrNoType;
  };
  askForMoreTime?: {
    howMuchAndWhyMoreTimeNeeded: string;
    doYouWishToProvideSupportingEvidence: YesOrNoType;
  };
};

export type HearingRequestsFlowType = {
  pathToTake: 'Minimal Path' | 'Maximum Path';
  caseId: string;
};

export type AppealType =
  | 'Protection'
  | 'Human Rights'
  | 'European Economic Area'
  | 'Revocation of Protection Status'
  | 'Deprivation of Citizenship'
  | 'EU Settlement Scheme';

export type Nationality =
  | 'Afghan'
  | 'Albanian'
  | 'Barbadian'
  | 'Belarusian'
  | 'Belgian'
  | 'Belizean'
  | 'Beninese'
  | 'Bermudian'
  | 'Bhutanese'
  | 'Bolivian'
  | 'Citizen of Bosnia and Herzegovina'
  | 'English'
  | 'Equatorial Guinean'
  | 'Singaporean'
  | 'Slovak'
  | 'Slovenian'
  | 'Solomon Islander'
  | 'Somali'
  | 'South African'
  | 'South Korean'
  | 'South Sudanese'
  | 'Spanish'
  | 'Sri Lankan'
  | 'St Helenian'
  | 'St Lucian'
  | 'Sudanese'
  | 'Surinamese'
  | 'Swazi'
  | 'Swedish'
  | 'Swiss'
  | 'Syrian'
  | 'Taiwanese'
  | 'Tajik'
  | 'Tanzanian'
  | 'Thai';

export type FeeSupportType =
  | 'I get asylum support from the Home Office'
  | 'I got a fee waiver from the Home Office for my application to stay in the UK'
  | 'I am under 18 and get housing or other support from the local authority'
  | 'I am the parent, guardian or sponsor of someone under 18 who gets housing or other support from the local authority'
  | 'None of these statements apply to me';

export type WhoNeedsInterpretorType =
  | 'Interpreter for applicant'
  | 'Interpreter for one or more witness'
  | 'Interpretor for applicant and witness'
  | 'No interpretor required';

export type InterpretorSupportType = 'Spoken language interpreter' | 'Sign language interpreter' | 'Spoken and sign language interpretor';

export const LANGUAGE_NAME_TO_CODE = {
  English: 'eng',
  Arabic: 'ara',
  Urdu: 'urd',
  French: 'fra',
  Spanish: 'spa',
  Somali: 'som',
  Polish: 'pol',
  Portuguese: 'por',
  Bengali: 'ben',
  Mandarin: 'cmn',
} as const;

export type LanguagesType = keyof typeof LANGUAGE_NAME_TO_CODE;

export const SIGN_LANGUAGE_NAME_TO_CODE = {
  'American Sign Language (ASL)': 'ase',
  'British Sign Language (BSL)': 'bfi',
  'Deaf Relay': 'sign-dfr',
  'Deafblind manual alphabet': 'sign-dma',
  'Hands on signing': 'sign-hos',
  'International Sign (IS)': 'ils',
  Lipspeaker: 'sign-lps',
  Makaton: 'sign-mkn',
  Notetaker: 'sign-ntr',
  'Palantypist / Speech to text': 'sign-pst',
  'Speech Supported English (SSE)': 'sign-sse',
  'Visual frame signing': 'sign-vfs',
} as const;

export type SignLanguagesType = keyof typeof SIGN_LANGUAGE_NAME_TO_CODE;

export type AllMaleOrFemaleHearingType = 'All male' | 'All female';
