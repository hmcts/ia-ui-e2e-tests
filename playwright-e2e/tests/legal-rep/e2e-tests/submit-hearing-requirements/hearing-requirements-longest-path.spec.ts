import { expect, test } from '../../../../fixtures.js';
import { config } from '../../../../utils/config.utils.js';

test.describe('Set of tests to verify Legal Representative is able to submit hearing requirements via EXUI', { tag: ['@e2e'] }, () => {
test.use({ storageState: config.exuiUsers.legalRepUser.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, exui_legalRepApiClient, exui_homeOfficeUserApiClient, exui_pages, page, idam_signInPage }) => {
    const caseId = await test.step('Legal rep Api: Submit a new appeal', async () => {
      const caseId = await exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
        appealType: 'Deprivation of citizenship',
        isAppellantInUk: 'Yes',
        appellantInUk: {
          isAppellantInDetention: 'No',
        },
        isAppellantStateless: 'No',
        nationality: 'Belgian',
        isApplicationInTime: 'Yes',
        doesApplicantHaveASponsor: 'No',
        hearingType: 'Decision with a hearing',
      });
      return caseId;
    });

    await test.step('Progress the case to allow hearing requirements to be submitted', async () => {
      await exui_caseOfficerApiClient.submitCompleteCaseReviewEvent({ caseId });

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({ caseId: caseId });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test home office bundle upload via api 1',
      });

      await exui_caseOfficerApiClient.submitRequestCaseBuildingEvent({ caseId: caseId });

      await exui_legalRepApiClient.submitBuildYourCaseEvent({ 
        caseId: caseId,
        appealSkeletonFileDescription: 'Test Appeal Skeleton Argument',
        addAddtionalNewEvidence: 'No',
      });
    });

    await exui_caseOfficerApiClient.submitRequestRespondentReviewEvent({ caseId: caseId });

    await exui_homeOfficeUserApiClient.submitUploadHomeOfficeAppealResponseEvent({
      caseId: caseId,
      appealReviewOutcome: 'Decision maintained',
    })

    await exui_caseOfficerApiClient.submitRequestResponseReviewEvent({ caseId: caseId });

    await exui_caseOfficerApiClient.submitRequestHearingRequirementsEvent({ caseId: caseId });
    await exui_legalRepApiClient.verifyCaseIsInExpectedState({
      caseId: caseId,
      expectedStateName: 'Submit hearing requirements'
    })

    await test.step('Navigate to case overview page as legal rep', async () => {
      await exui_pages.caseOverview.goTo({ caseId });
      await exui_pages.caseOverview.verifyUserIsOnPage({})
    });

    await test.step('Verify correct next steps text is shown before submitting hearing requirements', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          "The appeal is now going to a hearing. You need to submit the appellant's hearing requirements."
        ),
      ])
    });
  });

  test('submits hearing requirements', async ({ exui_pages }) => {

    await test.step('Open the submit hearing requirements event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Submit hearing requirements' });
      
      await exui_pages.draftHearingRequirementsdraftHearingRequirements.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsdraftHearingRequirements.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsdraftHearingRequirements.continueOntoNextPage();

      await exui_pages.draftHearingRequirementsattendTheHearing.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsattendTheHearing.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsattendTheHearing.completePageAndContinue({ appellantAttendingTheHearing: 'Yes' });

      await exui_pages.draftHearingRequirementsOralEvidence.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsOralEvidence.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsOralEvidence.completePageAndContinue({ appellantGivingOralEvidence: 'Yes' });

      await exui_pages.draftHearingRequirementsisWitnessesAttending.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsisWitnessesAttending.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsisWitnessesAttending.completePageAndContinue({
        witnessesAttending: 'Yes',
        witness: {
          givenNames: 'Test Witness',
          familyName: '1',
        },
      });

      await exui_pages.draftHearingRequirementsisEvidenceFromOutsideUkInCountry.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsisEvidenceFromOutsideUkInCountry.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsisEvidenceFromOutsideUkInCountry.completePageAndContinue({ evidenceFromOutsideUk: 'Yes' });

      //Appellant Interpreter details
      await exui_pages.draftHearingRequirementsInterpreterNeeded.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsInterpreterNeeded.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsInterpreterNeeded.completePageAndContinue({ interpreterServicesNeeded: 'Yes' });

      await exui_pages.draftHearingRequirementsappellantInterpreterLanguageCategory.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsappellantInterpreterLanguageCategory.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsappellantInterpreterLanguageCategory.completePageAndContinue({
        interpreterTypes: ['signLanguageInterpreter', 'spokenLanguageInterpreter'],
      });

      await exui_pages.draftHearingRequirementsappellantInterpreterSpokenLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsappellantInterpreterSpokenLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsappellantInterpreterSpokenLanguage.completePageAndContinue({ manualLanguage: 'Portuguese' });

      await exui_pages.draftHearingRequirementsappellantInterpreterSignLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsappellantInterpreterSignLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsappellantInterpreterSignLanguage.completePageAndContinue({ signLanguage: "British Sign Language (BSL)" });

      //Witness Interpreter details
      await exui_pages.draftHearingRequirementsisAnyWitnessInterpreterRequired.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsisAnyWitnessInterpreterRequired.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsisAnyWitnessInterpreterRequired.completePageAndContinue({ witnessInterpreterRequired: 'Yes' });

      await exui_pages.draftHearingRequirementswhichWitnessRequiresInterpreter.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementswhichWitnessRequiresInterpreter.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementswhichWitnessRequiresInterpreter.completePageAndContinue({ witnessInterpreterTypes: [
        ['spokenLanguageInterpreter', 'signLanguageInterpreter'],
      ]})

      await exui_pages.draftHearingRequirementswitness1InterpreterSpokenLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementswitness1InterpreterSpokenLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementswitness1InterpreterSpokenLanguage.completePageAndContinue({ spokenLanguage: 'Arabic' });

      await exui_pages.draftHearingRequirementswitness1InterpreterSignLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementswitness1InterpreterSignLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementswitness1InterpreterSignLanguage.completePageAndContinue({ manualLanguage: 'Test manual language' });

      await exui_pages.draftHearingRequirementsisHearingRoomNeeded.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsisHearingRoomNeeded.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsisHearingRoomNeeded.completePageAndContinue({ stepFreeAccessRequired: 'No' });

      await exui_pages.draftHearingRequirementsisHearingLoopNeeded.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsisHearingLoopNeeded.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsisHearingLoopNeeded.completePageAndContinue({ hearingLoopRequired: 'No' });

      await exui_pages.draftHearingRequirementssubmitHearingRequirementsAdditionalRequests.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementssubmitHearingRequirementsAdditionalRequests.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementssubmitHearingRequirementsAdditionalRequests.completePageAndContinue();

      await exui_pages.draftHearingRequirementsremoteVideoCall.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsremoteVideoCall.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsremoteVideoCall.completePageAndContinue({ 
        'remoteVideoCall': 'Yes', 
        'remoteVideoCallDescription': 'Test Remote Video Call details' 
      });

      await exui_pages.draftHearingRequirementsphysicalOrMentalHealthIssues.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsphysicalOrMentalHealthIssues.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsphysicalOrMentalHealthIssues.completePageAndContinue({ 
        'healthConditionsPresent': 'Yes', 
        'healthConditionsDescription': 'Test Health Conditions Description' 
      });

      await exui_pages.draftHearingRequirementsPastExperiences.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsPastExperiences.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsPastExperiences.completePageAndContinue({ 
        'pastExperiencesPresent': 'Yes', 
        'pastExperiencesDescription': 'Test Past Experiences Description' 
      });

      await exui_pages.draftHearingRequirementsMultimediaEvidence.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsMultimediaEvidence.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsMultimediaEvidence.completePageAndContinue({ 
        'multimediaEvidence': 'Yes', 
        'multimediaEvidenceDescription': 'Test Past Experiences Description' 
      });

      await exui_pages.draftHearingRequirementsSingleSexCourtRequired.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsSingleSexCourtRequired.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsSingleSexCourtRequired.completePageAndContinue({ singleSexCourtRequired: 'Yes' });

      await exui_pages.draftHearingRequirementssingleSexCourtType.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementssingleSexCourtType.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementssingleSexCourtType.completePageAndContinue({ 
        'singleSexCourtType': 'All male', 
        'reason': 'Test reason for all-male court' 
      });

      await exui_pages.draftHearingRequirementsInCameraCourt.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsInCameraCourt.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsInCameraCourt.completePageAndContinue({
        'inCameraCourtRequired': 'Yes',
        'inCameraCourtDescription': 'Test In Caera Court description'
      });

      await exui_pages.hearingRequirementsAdditionalRequestsFinal.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsAdditionalRequestsFinal.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsAdditionalRequestsFinal.completePageAndContinue({
        'additionalRequests': 'Yes',
        'additionalRequestsDescription': 'Test Additional Requests'
      });

      await exui_pages.draftHearingRequirementsDatesToAvoid.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsDatesToAvoid.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsDatesToAvoid.completePageAndContinue({
        'datesToAvoid': 'Yes',
        'dates': [
          {
            day: '15',
            month: '01',
            year: '2026',
            reason: 'Test date to avoid',
          },
        ],
      });

      await exui_pages.draftHearingRequirementsSubmit.verifyUserIsOnPage();

      const summaryRows = [
        { question: 'Will the appellant attend the hearing?', values: ['Yes'] },
        { question: 'Will the appellant give oral evidence at the hearing?', values: ['Yes'] },
        { question: 'Will any witnesses attend the hearing?', values: ['Yes'] },
        { question: 'Witness details', values: ['Test Witness', '1'] },
        {
          question: 'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?',
          values: ['Yes'],
        },
        { question: 'Will the appellant need a spoken or sign language interpreter at the hearing?', values: ['Yes'] },
        {
          question: 'What kind of interpreter will the appellant need?',
          values: ['Spoken language interpreter', 'Sign language interpreter'],
        },
        { question: 'Tell us which spoken language is needed for the appellant', values: ['Portuguese'] },
        { question: 'Tell us which sign language is needed for the appellant', values: ['British Sign Language (BSL)'] },
        { question: 'Will any of the witnesses require a spoken or sign language interpreter at the hearing?', values: ['Yes'] },
        {
          question: 'What kind of interpreter does Test Witness 1 need?',
          values: ['Spoken language interpreter', 'Sign language interpreter'],
        },
        { question: 'Which spoken language interpreter is needed for Test Witness 1?', values: ['Arabic'] },
        { question: 'Which sign language is needed for Test Witness 1?', values: ['Test manual language'] },
        { question: 'Do you need a hearing room with step-free access?', values: ['No'] },
        { question: 'Do you need a hearing loop?', values: ['No'] },
        {
          question: "Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?",
          values: ['Yes'],
        },
        { question: 'Explain in detail anything you would like the Tribunal to consider', values: ['Test Remote Video Call details'] },
        {
          question: 'Does the appellant have any physical or mental health issues that may impact them on the day?',
          values: ['Yes'],
        },
        {
          question: 'Explain in detail how any physical or mental health issues may affect them on the day.',
          values: ['Test Health Conditions Description'],
        },
        { question: 'Has the appellant had any past experiences that may impact them on the day?', values: ['Yes'] },
        {
          question: 'Explain in detail how any past experiences may affect them on the day?',
          values: ['Test Past Experiences Description'],
        },
        { question: 'Do you have multimedia evidence?', values: ['Yes'] },
        {
          question:
            "You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it.",
          values: ['Test Past Experiences Description'],
        },
        { question: 'Does the appellant need a single-sex court?', values: ['Yes'] },
        { question: 'What type of court do they need?', values: ['All male'] },
        { question: 'Explain in detail why the appellant needs a single-sex court.', values: ['Test reason for all-male court'] },
        { question: 'Does the appellant need an in camera court?', values: ['Yes'] },
        { question: 'Explain in detail why the appellant needs an in camera court.', values: ['Test In Caera Court description'] },
        { question: 'Is there anything else you would like to request?', values: ['Yes'] },
        { question: 'Provide details of any additional requests and why they are necessary.', values: ['Test Additional Requests'] },
        {
          question: 'Are there any dates that the appellant or their on-day representation cannot attend?',
          values: ['Yes'],
        },
        { question: 'Dates to avoid', values: ['15 Jan 2026', 'Test date to avoid'] },
      ] as const satisfies ReadonlyArray<{
        question: Parameters<typeof exui_pages.draftHearingRequirementsSubmit.$questionLocator>[0];
        values: readonly string[];
      }>;

      await Promise.all([
        expect(exui_pages.draftHearingRequirementsSubmit.$static.checkYourAnswersHeading).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$static.checkInformationCarefullyText).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$static.checkYourAnswersTable).toBeVisible(),
        ...summaryRows.flatMap(({ question, values }) => {
          const questionLocator = exui_pages.draftHearingRequirementsSubmit.$questionLocator(question);
          const valueLocator = exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(question);
          const changeAnswerToQuestionLocator = exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(question);

          return [expect(questionLocator).toBeVisible(), expect(changeAnswerToQuestionLocator).toBeVisible(), ...values.map((value) => expect(valueLocator).toHaveText(value), expect(valueLocator).toBeVisible())];
        }),
      ]);

      await exui_pages.draftHearingRequirementsSubmit.submit();

      await exui_pages.draftHearingRequirementsConfirm.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsConfirm.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsConfirm.returnToCaseDetails();

    await test.step('Verify event has successfully been submitted and correct next steps have been shown', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Submit hearing requirements' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          "The case officer is reviewing the hearing requirements. Once the requirements have been agreed with the Tribunal, the case will be listed and you will receive a notification with the hearing notice."
        ),
      ])
    });
  });
})});
