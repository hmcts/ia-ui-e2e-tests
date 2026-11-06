import { test, expect } from '../../../../fixtures.js';
import { sharedAppealReasonsSetup } from './shared-appeal-reasons-setup.js';

test.describe('Set of tests to verify user is able to submit answers to appeal reasons via UI', { tag: ['@e2e'] }, () => {
  sharedAppealReasonsSetup();

  test('Verify user is able to submit answers to appeal reasons after requesting for more time', async ({ cui_pages }) => {
    await test.step('Ask for more time for appeal reasons', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.askForMoreTimeLink);

      await cui_pages.askForMoreTime.verifyUserIsOnPage();
      await cui_pages.askForMoreTime.completePageAndContinue({
        howMuchAndWhyMoreTimeNeeded: 'Test reason for why more time is needed and how much time is needed.',
      });

      await cui_pages.supportingEvidenceMoreTime.verifyUserIsOnPage();
      await cui_pages.supportingEvidenceMoreTime.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'No' });
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

        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowLabel).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowValue).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeSupportingEvidenceLink).toBeHidden(),
      ]);
    });

    await test.step('Submit request for more time and return to appeal overview page', async () => {
      await cui_pages.appealReasonsCheckAnswers.submitAnswer();

      await cui_pages.requestMoreTimeSent.verifyUserIsOnPage();
      await cui_pages.requestMoreTimeSent.navigationClick(cui_pages.requestMoreTimeSent.$interactive.seeYourAppealProgressButton);

      await cui_pages.appealOverview.verifyUserIsOnPage();
    });

    await test.step('Provide a response to appeal reasons', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

      await cui_pages.homeOfficeDecisionWrong.verifyUserIsOnPage();
      await cui_pages.homeOfficeDecisionWrong.completePageAndContinue({
        reasonWhyHomeOfficeDecisionIsWrong: 'The home office is wrong test reason',
      });

      await cui_pages.supportingEvidence.verifyUserIsOnPage();
      await cui_pages.supportingEvidence.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'No' });
    });

    await test.step('Verify user is able to see their answers on the check your answers page', async () => {
      await cui_pages.appealReasonsCheckAnswers.verifyUserIsOnPage({ urlPath: 'check-answer' });

      await Promise.all([
        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowLabel).toHaveText('Question'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowValue).toHaveText('Why do you think the Home Office decision is wrong?'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.questionTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowLabel).toHaveText('Answer'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowValue).toHaveText('The home office is wrong test reason'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.answerTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeAnswerLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeAnswerLink).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowLabel).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowValue).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeSupportingEvidenceLink).toBeHidden(),
      ]);
    });

    await test.step('Verify user is able to submit their appeal reasons answers successfully', async () => {
      await cui_pages.appealReasonsCheckAnswers.submitAnswer();
      await cui_pages.appealReasonsAnswerSent.verifyUserIsOnPage();
    });
  });
});
