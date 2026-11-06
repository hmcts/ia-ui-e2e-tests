import { expect, test } from '../../../../fixtures.js';
import { sharedLegalRepHearingRequirementsSetup } from './shared-hearing-requirements-setup.js';
import { config } from '../../../../utils/config.utils.js';

test.describe(
  'Set of tests to verify Legal Representative is able to submit hearing requirements via EXUI using the sortest path',
  { tag: ['@e2e'] },
  () => {
    test.use({ storageState: config.exuiUsers.legalRepUser.sessionFile });

    sharedLegalRepHearingRequirementsSetup();

    test('Verify legal rep user is able to submit their hearing requirements taking the shortest path', async ({ exui_pages }) => {
      await test.step('Select Submit hearing requirements from next steps dropdown and submit event', async () => {
        await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Submit hearing requirements' });

        await exui_pages.draftHearingRequirementsDraftHearingRequirements.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsDraftHearingRequirements.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsDraftHearingRequirements.continueOntoNextPage();

        await exui_pages.draftHearingRequirementsAttendTheHearing.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsAttendTheHearing.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsAttendTheHearing.completePageAndContinue({ appellantAttendingTheHearing: 'No' });

        await exui_pages.draftHearingRequirementsOralEvidence.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsOralEvidence.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsOralEvidence.completePageAndContinue({ appellantGivingOralEvidence: 'No' });

        await exui_pages.draftHearingRequirementsIsWitnessesAttending.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsIsWitnessesAttending.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsIsWitnessesAttending.completePageAndContinue({ witnessesAttending: 'No' });

        await exui_pages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.completePageAndContinue({ evidenceFromOutsideUk: 'No' });

        //Appellant Interpreter details
        await exui_pages.draftHearingRequirementsInterpreterNeeded.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsInterpreterNeeded.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsInterpreterNeeded.completePageAndContinue({ interpreterServicesNeeded: 'No' });

        await exui_pages.draftHearingRequirementsIsHearingRoomNeeded.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsIsHearingRoomNeeded.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsIsHearingRoomNeeded.completePageAndContinue({ stepFreeAccessRequired: 'Yes' });

        await exui_pages.draftHearingRequirementsIsHearingLoopNeeded.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsIsHearingLoopNeeded.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsIsHearingLoopNeeded.completePageAndContinue({ hearingLoopRequired: 'No' });

        await exui_pages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.completePageAndContinue();

        await exui_pages.draftHearingRequirementsRemoteVideoCall.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsRemoteVideoCall.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsRemoteVideoCall.completePageAndContinue({
          remoteVideoCall: 'Yes',
          remoteVideoCallDescription: 'Test Remote Video Call details',
        });

        await exui_pages.draftHearingRequirementsPhysicalOrMentalHealthIssues.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsPhysicalOrMentalHealthIssues.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsPhysicalOrMentalHealthIssues.completePageAndContinue({ healthConditionsPresent: 'No' });

        await exui_pages.draftHearingRequirementsPastExperiences.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsPastExperiences.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsPastExperiences.completePageAndContinue({ pastExperiencesPresent: 'No' });

        await exui_pages.draftHearingRequirementsMultimediaEvidence.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsMultimediaEvidence.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsMultimediaEvidence.completePageAndContinue({ multimediaEvidence: 'No' });

        await exui_pages.draftHearingRequirementsSingleSexCourtRequired.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsSingleSexCourtRequired.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsSingleSexCourtRequired.completePageAndContinue({ singleSexCourtRequired: 'No' });

        await exui_pages.draftHearingRequirementsInCameraCourt.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsInCameraCourt.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsInCameraCourt.completePageAndContinue({ inCameraCourtRequired: 'No' });

        await exui_pages.hearingRequirementsAdditionalRequestsFinal.verifyUserIsOnPage();
        await exui_pages.hearingRequirementsAdditionalRequestsFinal.verifyAllTextOnPage();
        await exui_pages.hearingRequirementsAdditionalRequestsFinal.completePageAndContinue({ additionalRequests: 'No' });

        await exui_pages.draftHearingRequirementsDatesToAvoid.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsDatesToAvoid.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsDatesToAvoid.completePageAndContinue({ datesToAvoid: 'No' });

        await exui_pages.draftHearingRequirementsSubmit.verifyUserIsOnPage();
        await Promise.all([
          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will the appellant attend the hearing?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant attend the hearing?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant attend the hearing?')).toHaveText('No'),
          expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will the appellant attend the hearing?')).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will the appellant give oral evidence at the hearing?')).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant give oral evidence at the hearing?'),
          ).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will the appellant give oral evidence at the hearing?')).toHaveText(
            'No',
          ),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will the appellant give oral evidence at the hearing?'),
          ).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Will any witnesses attend the hearing?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will any witnesses attend the hearing?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Will any witnesses attend the hearing?')).toHaveText('No'),
          expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Will any witnesses attend the hearing?')).toBeVisible(),

          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionLocator(
              'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?',
            ),
          ).toHaveText('No'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(
              'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?',
            ),
          ).toBeVisible(),

          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionLocator(
              'Will the appellant need a spoken or sign language interpreter at the hearing?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Will the appellant need a spoken or sign language interpreter at the hearing?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Will the appellant need a spoken or sign language interpreter at the hearing?',
            ),
          ).toHaveText('No'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(
              'Will the appellant need a spoken or sign language interpreter at the hearing?',
            ),
          ).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Do you need a hearing room with step-free access?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing room with step-free access?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing room with step-free access?')).toHaveText(
            'Yes',
          ),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Do you need a hearing room with step-free access?'),
          ).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Do you need a hearing loop?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing loop?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you need a hearing loop?')).toHaveText('No'),
          expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Do you need a hearing loop?')).toBeVisible(),

          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionLocator(
              "Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?",
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              "Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?",
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              "Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?",
            ),
          ).toHaveText('Yes'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(
              "Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?",
            ),
          ).toBeVisible(),

          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionLocator('Explain in detail anything you would like the Tribunal to consider'),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail anything you would like the Tribunal to consider'),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Explain in detail anything you would like the Tribunal to consider'),
          ).toHaveText('Test Remote Video Call details'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(
              'Explain in detail anything you would like the Tribunal to consider',
            ),
          ).toBeVisible(),

          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionLocator(
              'Does the appellant have any physical or mental health issues that may impact them on the day?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Does the appellant have any physical or mental health issues that may impact them on the day?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Does the appellant have any physical or mental health issues that may impact them on the day?',
            ),
          ).toHaveText('No'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(
              'Does the appellant have any physical or mental health issues that may impact them on the day?',
            ),
          ).toBeVisible(),

          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionLocator('Has the appellant had any past experiences that may impact them on the day?'),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Has the appellant had any past experiences that may impact them on the day?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Has the appellant had any past experiences that may impact them on the day?',
            ),
          ).toHaveText('No'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(
              'Has the appellant had any past experiences that may impact them on the day?',
            ),
          ).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Do you have multimedia evidence?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you have multimedia evidence?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Do you have multimedia evidence?')).toHaveText('No'),
          expect(exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Do you have multimedia evidence?')).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Does the appellant need a single-sex court?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need a single-sex court?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need a single-sex court?')).toHaveText('No'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Does the appellant need a single-sex court?'),
          ).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Does the appellant need an in camera court?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need an in camera court?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Does the appellant need an in camera court?')).toHaveText('No'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Does the appellant need an in camera court?'),
          ).toBeVisible(),

          expect(exui_pages.draftHearingRequirementsSubmit.$questionLocator('Is there anything else you would like to request?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Is there anything else you would like to request?')).toBeVisible(),
          expect(exui_pages.draftHearingRequirementsSubmit.$questionValueLocator('Is there anything else you would like to request?')).toHaveText(
            'No',
          ),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Is there anything else you would like to request?'),
          ).toBeVisible(),

          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionLocator(
              'Are there any dates that the appellant or their on-day representation cannot attend?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Are there any dates that the appellant or their on-day representation cannot attend?',
            ),
          ).toBeVisible(),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$questionValueLocator(
              'Are there any dates that the appellant or their on-day representation cannot attend?',
            ),
          ).toHaveText('No'),
          expect(
            exui_pages.draftHearingRequirementsSubmit.$changeAnswerToQuestionLocator(
              'Are there any dates that the appellant or their on-day representation cannot attend?',
            ),
          ).toBeVisible(),
        ]);

        await exui_pages.draftHearingRequirementsSubmit.submit();

        await exui_pages.draftHearingRequirementsConfirm.verifyUserIsOnPage();
        await exui_pages.draftHearingRequirementsConfirm.verifyAllTextOnPage();
        await exui_pages.draftHearingRequirementsConfirm.returnToCaseDetails();
      });

      await test.step('Verify event has successfully been submitted and correct next steps have been shown', async () => {
        await exui_pages.caseOverview.verifyUserIsOnPage({});
        await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Submit hearing requirements' });

        await Promise.all([
          expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
            'The case officer is reviewing the hearing requirements. Once the requirements have been agreed with the Tribunal, the case will be listed and you will receive a notification with the hearing notice.',
          ),
        ]);
      });
    });
  },
);
