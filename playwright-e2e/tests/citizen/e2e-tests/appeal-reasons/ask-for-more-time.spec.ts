import { test, expect } from '../../../../fixtures.js';
import { sharedAppealReasonsSetup } from './shared-appeal-reasons-setup.js';

test.describe('Set of tests to verify user is able to submit answers to appeal reasons via UI', { tag: ['@e2e'] }, () => {
  sharedAppealReasonsSetup();

  test('Verify user is able to ask for time when responding to appeal reasons', async ({ cui_pages }) => {
    await test.step('Ask for more time for appeal reasons', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.askForMoreTimeLink);

      await cui_pages.askForMoreTime.verifyUserIsOnPage();
      await cui_pages.askForMoreTime.verifyAllTextOnPage();
      await cui_pages.askForMoreTime.completePageAndContinue({
        howMuchAndWhyMoreTimeNeeded: 'Test reason for why more time is needed and how much time is needed.',
      });

      await cui_pages.supportingEvidenceMoreTime.verifyUserIsOnPage();
      await cui_pages.supportingEvidenceMoreTime.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'Yes' });

      await cui_pages.provideSupportingEvidenceMoreTime.verifyUserIsOnPage();
      await cui_pages.provideSupportingEvidenceMoreTime.verifyAllTextOnPage();
      await cui_pages.provideSupportingEvidenceMoreTime.completePageAndContinue({});
    });

    await test.step('Verify user is able to see their request for more time answer on the check your answers page', async () => {
      await cui_pages.appealReasonsCheckAnswers.verifyUserIsOnPage({ urlPath: 'check-answer-more-time' });

      await Promise.all([
        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowLabel).toHaveText('Question'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowValue).toHaveText('How much time do you need and why do you need it?'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowLabel).toHaveText('Answer'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowValue).toHaveText(
          'Test reason for why more time is needed and how much time is needed.',
        ),
        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeAnswerLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeAnswerLink).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowLabel).toHaveText('Supporting evidence'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowValue).toHaveText(
          'Provide_Supporting_Evidence_For_More_Time.txt',
        ),
        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeSupportingEvidenceLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeSupportingEvidenceLink).toBeVisible(),
      ]);
    });

    await test.step('Verify user is able to submit request for more time successfully', async () => {
      await cui_pages.appealReasonsCheckAnswers.submitAnswer();
      await cui_pages.requestMoreTimeSent.verifyUserIsOnPage();

      await Promise.all([
        expect(cui_pages.requestMoreTimeSent.$static.whatHappensNextHeading).toBeVisible(),

        expect(cui_pages.requestMoreTimeSent.$static.whatHappensNextBulletPoint1).toHaveText(
          'A Tribunal Caseworker should contact you within five working days to tell you if you have more time but it might take longer than that',
        ),
        expect(cui_pages.requestMoreTimeSent.$static.whatHappensNextBulletPoint1).toBeVisible(),

        expect(cui_pages.requestMoreTimeSent.$static.whatHappensNextBulletPoint2).toHaveText(
          'You might not get more time. You should still respond to the Tribunal by the date you were given if you can',
        ),
        expect(cui_pages.requestMoreTimeSent.$static.whatHappensNextBulletPoint2).toBeVisible(),

        expect(cui_pages.requestMoreTimeSent.$static.thingsYouCanNowDoHeading).toBeVisible(),

        expect(cui_pages.requestMoreTimeSent.$static.thingsYouCanNowDoBulletPoint1).toHaveText(
          'Read more about appealing an immigration or asylum decision',
        ),
        expect(cui_pages.requestMoreTimeSent.$static.thingsYouCanNowDoBulletPoint1).toBeVisible(),

        expect(cui_pages.requestMoreTimeSent.$static.thingsYouCanNowDoBulletPoint2).toHaveText(
          'Find organisations that can help you with your appeal',
        ),
        expect(cui_pages.requestMoreTimeSent.$static.thingsYouCanNowDoBulletPoint2).toBeVisible(),
      ]);
    });
  });
});
