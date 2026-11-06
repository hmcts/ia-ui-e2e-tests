import { test, expect } from '../../../../fixtures.js';
import { sharedHearingRequirementsSetup } from './shared-hearing-requirements-setup.js';

test.describe('Set of tests to verify user is able to submit answers to hearing requirements via UI', { tag: ['@e2e'] }, () => {
  sharedHearingRequirementsSetup();

  test(
    'Verify user is able to submit response to hearing requirements by taking shortest path',
    { tag: ['@crossBrowser'] },
    async ({ cui_pages }) => {
      await test.step('Provide response to hearing witness section of journey', async () => {
        await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.witnessLink);

        await cui_pages.hearingWitnesses.verifyUserIsOnPage();
        await cui_pages.hearingWitnesses.verifyAllTextOnPage();
        await cui_pages.hearingWitnesses.completePageAndContinue({ doesApplicantHaveAWitness: 'No' });

        await cui_pages.hearingOutsideUK.verifyUserIsOnPage();
        await cui_pages.hearingOutsideUK.verifyAllTextOnPage();
        await cui_pages.hearingOutsideUK.completePageAndContinue({ doesApplicantHaveAWitness: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Provide response to access needs section of journey', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.accessNeedsLink);

        await cui_pages.hearingAccessNeeds.verifyUserIsOnPage();
        await cui_pages.hearingAccessNeeds.verifyAllTextOnPage();
        await cui_pages.hearingAccessNeeds.continueOnToNextPage();

        await cui_pages.hearingInterpreter.verifyUserIsOnPage();
        await cui_pages.hearingInterpreter.verifyAllTextOnPage();
        await cui_pages.hearingInterpreter.completePageAndContinue({ doYouRequireAInterpreterAtHearing: 'No' });

        await cui_pages.hearingStepFreeAccess.verifyUserIsOnPage();
        await cui_pages.hearingStepFreeAccess.verifyAllTextOnPage();
        await cui_pages.hearingStepFreeAccess.completePageAndContinue({ willYouOrWitnessRequireStepFreeAccess: 'No' });

        await cui_pages.hearingLoop.verifyUserIsOnPage();
        await cui_pages.hearingLoop.verifyAllTextOnPage();
        await cui_pages.hearingLoop.completePageAndContinue({ willYouOrWitnessNeedHearingLoop: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Provide response to other needs section of journey', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.otherNeedsLink);

        await cui_pages.hearingOtherNeeds.verifyUserIsOnPage();
        await cui_pages.hearingOtherNeeds.verifyAllTextOnPage();
        await cui_pages.hearingOtherNeeds.continueOnToNextPage();

        await cui_pages.hearingVideoAppointment.verifyUserIsOnPage();
        await cui_pages.hearingVideoAppointment.verifyAllTextOnPage();
        await cui_pages.hearingVideoAppointment.completePageAndContinue({
          areYouAbleToJoinHearingViaVideoCall: 'Yes',
        });

        await cui_pages.hearingMultimediaEvidence.verifyUserIsOnPage();
        await cui_pages.hearingMultimediaEvidence.verifyAllTextOnPage();
        await cui_pages.hearingMultimediaEvidence.completePageAndContinue({ willYouBringVideoOrAudioEvidence: 'No' });

        await cui_pages.hearingSingleSex.verifyUserIsOnPage();
        await cui_pages.hearingSingleSex.verifyAllTextOnPage();
        await cui_pages.hearingSingleSex.completePageAndContinue({ willYouNeedAllFemaleOrMaleHearing: 'No' });

        await cui_pages.hearingPrivate.verifyUserIsOnPage();
        await cui_pages.hearingPrivate.verifyAllTextOnPage();
        await cui_pages.hearingPrivate.completePageAndContinue({ willYouNeedAPrivateHearing: 'No' });

        await cui_pages.hearingPhysicalMentalHealth.verifyUserIsOnPage();
        await cui_pages.hearingPhysicalMentalHealth.verifyAllTextOnPage();
        await cui_pages.hearingPhysicalMentalHealth.completePageAndContinue({
          anyPhysicalOrMentalHealthConditions: 'No',
        });

        await cui_pages.hearingPastExperiences.verifyUserIsOnPage();
        await cui_pages.hearingPastExperiences.verifyAllTextOnPage();
        await cui_pages.hearingPastExperiences.completePageAndContinue({
          anyPastExperienceThatMayAffectHearing: 'No',
        });

        await cui_pages.hearingAnythingElse.verifyUserIsOnPage();
        await cui_pages.hearingAnythingElse.verifyAllTextOnPage();
        await cui_pages.hearingAnythingElse.completePageAndContinue({ needAnythingElse: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Provide response to dates to avoid section of journey', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.datesToAvoidLink);

        await cui_pages.hearingDatesAvoid.verifyUserIsOnPage({ urlPath: 'hearing-dates-avoid' });
        await cui_pages.hearingDatesAvoid.verifyAllTextOnPage();
        await cui_pages.hearingDatesAvoid.completePageAndContinue({ anyDatesToAvoid: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Verify user is able to see their answers on check your answers page', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.checkAndSendLink);

        await cui_pages.hearingCheckAnswers.verifyUserIsOnPage();
        await Promise.all([
          // Verify correct number of question and answers
          expect(cui_pages.hearingCheckAnswers.$static.questionLabel).toHaveCount(12),
          ...Array.from({ length: 12 }, (_, i) => expect(cui_pages.hearingCheckAnswers.$static.questionLabel.nth(i)).toBeVisible()),
          expect(cui_pages.hearingCheckAnswers.$static.answerLabel).toHaveCount(12),
          ...Array.from({ length: 12 }, (_, i) => expect(cui_pages.hearingCheckAnswers.$static.answerLabel.nth(i)).toBeVisible()),

          // Verify witness section headings
          expect(cui_pages.hearingCheckAnswers.$static.witnessesHeadingLevel2).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$static.witnessesHeadingLevel3).toBeVisible(),
          // Verify 1st question and answer pair within witness section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willAnyWitnessesComeToHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
          // Verify 2nd question and answer pair within witness section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
          // Verify locator to change answer to both questions is visisble
          expect(cui_pages.hearingCheckAnswers.$interactive.changeAnswerForWillAnyWitnessesComeToHearingLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessAttendOutsideUklink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify access needs section
          expect(cui_pages.hearingCheckAnswers.$static.accessNeedsHeadingLevel2).toBeVisible(),

          // Verify interpreter support section
          expect(cui_pages.hearingCheckAnswers.$static.interpreterHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within interpreter support section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedanInterpreter')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedanInterpreter')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedanInterpreter')).toBeVisible(),
          // Verify locator to change answer to interpreter support section
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedanInterpreterLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify step free access heading
          expect(cui_pages.hearingCheckAnswers.$static.stepFreeAccessHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within step free access section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
          // Verify locator to change answer to step free access question is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessNeedStepFreeAccessLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify hearing loop heading
          expect(cui_pages.hearingCheckAnswers.$static.hearingLoopHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within hearing loop section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
          // Verify locator to change answer to hearing loop question is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessRequireHearingLoopLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify other needs section
          expect(cui_pages.hearingCheckAnswers.$static.otherNeedsLevel2Heading).toBeVisible(),

          // Verify multimedia evidence section
          expect(cui_pages.hearingCheckAnswers.$static.multiMediaEvidenceLevel3Heading).toBeVisible(),
          // Verify question and answer pair within multimedia evidence section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
          // Verify locator to change answer to multimedia evidence question is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouBringVideoOrAudioEvidenceLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify all female or male section
          expect(cui_pages.hearingCheckAnswers.$static.allFemaleOrMaleLevel3Heading).toBeVisible(),
          // Verify question and answer pair within all female or male section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
          // Verify locator to change answer to question within all female or male section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAllFemaleOrMaleHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify private hearing section
          expect(cui_pages.hearingCheckAnswers.$static.privateHearingLevel3Heading).toBeVisible(),
          // Verify question and answer pair within private hearing section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAPrivateHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAPrivateHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAPrivateHearing')).toBeVisible(),
          // Verify locator to change answer to question within private hearing section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAPrivateHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify physical or mental health conditions section
          expect(cui_pages.hearingCheckAnswers.$static.physicalOrMentalHealthLevel3Heading).toBeVisible(),
          // Verify question and answer pair within physical or mental health conditions section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
          // Verify locator to change answer to question within physical or mental health conditions section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeDoYouHaveAnyPhysicalOrMentalHealthConditionsLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify past experience that may affect hearing section
          expect(cui_pages.hearingCheckAnswers.$static.pastExperiencesLevel3Heading).toBeVisible(),
          // Verify question and answer pair within past experience that may affect hearing section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('haveYouHadAnyPastExperiences')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
          // Verify locator to change answer to question within past experience that may affect hearing section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeHaveYouHadAnyPastExperiencesLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify anything else section
          expect(cui_pages.hearingCheckAnswers.$static.anythingElseLevel3Heading).toBeVisible(),
          // Verify question and answer pair within anything else section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
          // Verify locator to change answer to question within anything else section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAnythingElseAtHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify dates to avoid section
          expect(cui_pages.hearingCheckAnswers.$static.datesToAvoidLevel2Heading).toBeVisible(),
          // Verify question and answer pair within dates to avoid section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
          // Verify locator to change answer to question within dates to avoid section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeAreThereAnyDatesYouCannotAttendLink).toBeVisible(),
        ]);
      });

      await test.step('Verify user is able to submit their hearing requirements', async () => {
        await cui_pages.hearingCheckAnswers.submitAnswers();

        await cui_pages.hearingSuccess.verifyUserIsOnPage();
        await cui_pages.hearingSuccess.verifyAllTextOnPage();
      });
    },
  );
});
