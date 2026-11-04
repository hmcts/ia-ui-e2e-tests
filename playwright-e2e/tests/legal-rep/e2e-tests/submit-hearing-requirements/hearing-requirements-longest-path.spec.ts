import { expect, test } from '../../../../fixtures.js';
import { config } from '../../../../utils/config.utils.js';

test.describe('Set of tests to verify Legal Representative is able to submit hearing requirements via EXUI', { tag: ['@e2e'] }, () => {
test.use({ storageState: config.exuiUsers.legalRepUser.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, exui_legalRepApiClient, exui_homeOfficeUserApiClient, exui_pages }) => {
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
      
      await exui_pages.draftHearingRequirementsDraftHearingRequirements.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsDraftHearingRequirements.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsDraftHearingRequirements.continueOntoNextPage();

      await exui_pages.draftHearingRequirementsAttendTheHearing.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsAttendTheHearing.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsAttendTheHearing.completePageAndContinue({ appellantAttendingTheHearing: 'Yes' });

      await exui_pages.draftHearingRequirementsOralEvidence.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsOralEvidence.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsOralEvidence.completePageAndContinue({ appellantGivingOralEvidence: 'Yes' });

      await exui_pages.draftHearingRequirementsIsWitnessesAttending.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsIsWitnessesAttending.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsIsWitnessesAttending.completePageAndContinue({
        witnessesAttending: 'Yes',
        witness: {
          givenNames: 'Test Witness',
          familyName: '1',
        },
      });

      await exui_pages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.completePageAndContinue({ evidenceFromOutsideUk: 'Yes' });

      //Appellant Interpreter details
      await exui_pages.draftHearingRequirementsInterpreterNeeded.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsInterpreterNeeded.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsInterpreterNeeded.completePageAndContinue({ interpreterServicesNeeded: 'Yes' });

      await exui_pages.draftHearingRequirementsAppellantInterpreterLanguageCategory.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsAppellantInterpreterLanguageCategory.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsAppellantInterpreterLanguageCategory.completePageAndContinue({
        interpreterTypes: ['signLanguageInterpreter', 'spokenLanguageInterpreter'],
      });

      await exui_pages.draftHearingRequirementsAppellantInterpreterSpokenLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsAppellantInterpreterSpokenLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsAppellantInterpreterSpokenLanguage.completePageAndContinue({ manualLanguage: 'Portuguese' });

      await exui_pages.draftHearingRequirementsAppellantInterpreterSignLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsAppellantInterpreterSignLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsAppellantInterpreterSignLanguage.completePageAndContinue({ signLanguage: "British Sign Language (BSL)" });

      //Witness Interpreter details
      await exui_pages.draftHearingRequirementsIsAnyWitnessInterpreterRequired.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsIsAnyWitnessInterpreterRequired.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsIsAnyWitnessInterpreterRequired.completePageAndContinue({ witnessInterpreterRequired: 'Yes' });

      await exui_pages.draftHearingRequirementsWhichWitnessRequiresInterpreter.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsWhichWitnessRequiresInterpreter.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsWhichWitnessRequiresInterpreter.completePageAndContinue({ witnessInterpreterTypes: [
        ['spokenLanguageInterpreter', 'signLanguageInterpreter'],
      ]})

      await exui_pages.draftHearingRequirementsWitness1InterpreterSpokenLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsWitness1InterpreterSpokenLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsWitness1InterpreterSpokenLanguage.completePageAndContinue({ spokenLanguage: 'Arabic' });

      await exui_pages.draftHearingRequirementsWitness1InterpreterSignLanguage.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsWitness1InterpreterSignLanguage.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsWitness1InterpreterSignLanguage.completePageAndContinue({ manualLanguage: 'Test manual language' });

      await exui_pages.draftHearingRequirementsIsHearingRoomNeeded.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsIsHearingRoomNeeded.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsIsHearingRoomNeeded.completePageAndContinue({ stepFreeAccessRequired: 'No' });

      await exui_pages.draftHearingRequirementsIsHearingLoopNeeded.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsIsHearingLoopNeeded.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsIsHearingLoopNeeded.completePageAndContinue({ hearingLoopRequired: 'No' });

      await exui_pages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.completePageAndContinue();

      await exui_pages.draftHearingRequirementsRemoteVideoCall.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsRemoteVideoCall.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsRemoteVideoCall.completePageAndContinue({ 
        'remoteVideoCall': 'Yes', 
        'remoteVideoCallDescription': 'Test Remote Video Call details' 
      });

      await exui_pages.draftHearingRequirementsPhysicalOrMentalHealthIssues.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsPhysicalOrMentalHealthIssues.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsPhysicalOrMentalHealthIssues.completePageAndContinue({ 
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

      await exui_pages.draftHearingRequirementsSingleSexCourtType.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsSingleSexCourtType.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsSingleSexCourtType.completePageAndContinue({ 
        'singleSexCourtType': 'All male', 
        'reason': 'Test reason for all-male court' 
      });

      await exui_pages.draftHearingRequirementsInCameraCourt.verifyUserIsOnPage();
      await exui_pages.draftHearingRequirementsInCameraCourt.verifyAllTextOnPage();
      await exui_pages.draftHearingRequirementsInCameraCourt.completePageAndContinue({
        'inCameraCourtRequired': 'Yes',
        'inCameraCourtDescription': 'Test In Camera Court description'
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
      await Promise.all([
        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will the appellant attend the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant attend the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant attend the hearing?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will the appellant attend the hearing?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will the appellant give oral evidence at the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant give oral evidence at the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant give oral evidence at the hearing?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will the appellant give oral evidence at the hearing?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will any witnesses attend the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will any witnesses attend the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will any witnesses attend the hearing?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will any witnesses attend the hearing?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Witness details')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Witness details').nth(0)).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Witness details').nth(0),).toHaveText(
        `
        Witness details 1
        Given names
        Test Witness
        Family name
        1
        `,
        { useInnerText: true },
        ),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will any witnesses attend the hearing?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will the appellant need a spoken or sign language interpreter at the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant need a spoken or sign language interpreter at the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant need a spoken or sign language interpreter at the hearing?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will the appellant need a spoken or sign language interpreter at the hearing?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('What kind of interpreter will the appellant need?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('What kind of interpreter will the appellant need?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit
          .$questionValueLocator('What kind of interpreter will the appellant need?')
          .nth(0)).toHaveText(
          `
          Multi selection table
          Value
          Sign language interpreter
          Spoken language interpreter
          `,
          { useInnerText: true }
        ),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will the appellant need a spoken or sign language interpreter at the hearing?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Tell us which spoken language is needed for the appellant')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Tell us which spoken language is needed for the appellant').nth(0)).toBeVisible(),
        expect(
          exui_pages.draftHearingRequirementsSubmit
          .$questionValueLocator('Tell us which spoken language is needed for the appellant')
          .locator(
          '.complex-panel-table .multi-select-list-field-table tbody td > span.text-16, ' +
          '.complex-panel-table .grey-bar ccd-read-text-field > span.text-16',
          ),
          ).toHaveText(['Enter the language manually', 'Portuguese']),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Tell us which spoken language is needed for the appellant')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Tell us which sign language is needed for the appellant')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Tell us which sign language is needed for the appellant').nth(0)).toBeVisible(),
        expect(
          exui_pages.draftHearingRequirementsSubmit
          .$questionValueLocator('Tell us which sign language is needed for the appellant')
          .locator('.complex-panel-table .grey-bar ccd-read-dynamic-list-field > span.text-16'),
          ).toHaveText('British Sign Language (BSL)'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Tell us which sign language is needed for the appellant')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will any of the witnesses require a spoken or sign language interpreter at the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will any of the witnesses require a spoken or sign language interpreter at the hearing?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will any of the witnesses require a spoken or sign language interpreter at the hearing?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will any of the witnesses require a spoken or sign language interpreter at the hearing?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('What kind of interpreter does Test Witness 1 need?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('What kind of interpreter does Test Witness 1 need?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit
          .$questionValueLocator('What kind of interpreter does Test Witness 1 need?')
          .nth(0)).toHaveText(
          `
          Multi selection table
          Value
          Spoken language interpreter
          Sign language interpreter
          `,
          { useInnerText: true }
        ),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('What kind of interpreter does Test Witness 1 need?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Which spoken language interpreter is needed for Test Witness 1?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Which spoken language interpreter is needed for Test Witness 1?').nth(0)).toBeVisible(),
        expect(
        exui_pages.draftHearingRequirementsSubmit
        .$questionValueLocator('Which spoken language interpreter is needed for Test Witness 1?')
        .locator('.complex-panel-table .grey-bar ccd-read-dynamic-list-field > span.text-16'),
        ).toHaveText('Arabic'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Which spoken language interpreter is needed for Test Witness 1?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Which sign language is needed for Test Witness 1?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Which sign language is needed for Test Witness 1?').nth(0)).toBeVisible(),
        expect(
          exui_pages.draftHearingRequirementsSubmit
          .$questionValueLocator('Which sign language is needed for Test Witness 1?')
          .locator(
          '.complex-panel-table .multi-select-list-field-table tbody td > span.text-16, ' +
          '.complex-panel-table .grey-bar ccd-read-text-field > span.text-16',
          ),
          ).toHaveText(['Enter the language manually', 'Test manual language']),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Which sign language is needed for Test Witness 1?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Do you need a hearing room with step-free access?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing room with step-free access?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing room with step-free access?')).toHaveText('No'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Do you need a hearing room with step-free access?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Do you need a hearing loop?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing loop?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing loop?')).toHaveText('No'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Do you need a hearing loop?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator("Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?")).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator("Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?")).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator("Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?")).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator("Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?")).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Explain in detail anything you would like the Tribunal to consider')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail anything you would like the Tribunal to consider')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail anything you would like the Tribunal to consider')).toHaveText('Test Remote Video Call details'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Explain in detail anything you would like the Tribunal to consider')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Does the appellant have any physical or mental health issues that may impact them on the day?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant have any physical or mental health issues that may impact them on the day?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant have any physical or mental health issues that may impact them on the day?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Does the appellant have any physical or mental health issues that may impact them on the day?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Explain in detail how any physical or mental health issues may affect them on the day.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail how any physical or mental health issues may affect them on the day.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail how any physical or mental health issues may affect them on the day.')).toHaveText('Test Health Conditions Description'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Explain in detail how any physical or mental health issues may affect them on the day.')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Has the appellant had any past experiences that may impact them on the day?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Has the appellant had any past experiences that may impact them on the day?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Has the appellant had any past experiences that may impact them on the day?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Has the appellant had any past experiences that may impact them on the day?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Explain in detail how any past experiences may affect them on the day?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail how any past experiences may affect them on the day?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail how any past experiences may affect them on the day?')).toHaveText('Test Past Experiences Description'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Explain in detail how any past experiences may affect them on the day?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Do you have multimedia evidence?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you have multimedia evidence?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you have multimedia evidence?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Do you have multimedia evidence?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator("You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it.")).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator("You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it.")).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator("You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it.")).toHaveText('Test Past Experiences Description'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator("You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it.")).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Does the appellant need a single-sex court?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need a single-sex court?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need a single-sex court?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Does the appellant need a single-sex court?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('What type of court do they need?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('What type of court do they need?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('What type of court do they need?')).toHaveText('All male'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('What type of court do they need?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Explain in detail why the appellant needs a single-sex court.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail why the appellant needs a single-sex court.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail why the appellant needs a single-sex court.')).toHaveText('Test reason for all-male court'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Explain in detail why the appellant needs a single-sex court.')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Does the appellant need an in camera court?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need an in camera court?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need an in camera court?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Does the appellant need an in camera court?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Explain in detail why the appellant needs an in camera court.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail why the appellant needs an in camera court.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail why the appellant needs an in camera court.')).toHaveText('Test In Camera Court description'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Explain in detail why the appellant needs an in camera court.')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Is there anything else you would like to request?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Is there anything else you would like to request?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Is there anything else you would like to request?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Is there anything else you would like to request?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Provide details of any additional requests and why they are necessary.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Provide details of any additional requests and why they are necessary.')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Provide details of any additional requests and why they are necessary.')).toHaveText('Test Additional Requests'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Provide details of any additional requests and why they are necessary.')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Are there any dates that the appellant or their on-day representation cannot attend?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Are there any dates that the appellant or their on-day representation cannot attend?')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Are there any dates that the appellant or their on-day representation cannot attend?')).toHaveText('Yes'),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Are there any dates that the appellant or their on-day representation cannot attend?')).toBeVisible(),

        expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Dates to avoid')).toBeVisible(),
        expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Dates to avoid')).toBeVisible(),
        expect(
          exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Dates to avoid').nth(0),
        ).toHaveText(
          `
          Dates to avoid 1
          Date
          15 Jan 2026
          Reason
          Test date to avoid
          `,
          { useInnerText: true },
        ),
        expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Dates to avoid')).toBeVisible(),
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
        ]);
      });
    });
  });
});
