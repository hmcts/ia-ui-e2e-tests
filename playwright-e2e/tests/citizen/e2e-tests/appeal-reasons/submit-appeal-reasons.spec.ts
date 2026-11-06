import { test, expect } from '../../../../fixtures.js';
import { sharedAppealReasonsSetup } from './shared-appeal-reasons-setup.js';

test.describe('Set of tests to verify user is able to submit answers to appeal reasons via UI', { tag: ['@e2e'] }, () => {
  sharedAppealReasonsSetup();

  test('Verify user is able to submit answers to appeal reasons via the UI', { tag: ['@crossBrowser'] }, async ({ cui_pages, dataUtils }) => {
    await test.step('Provide a response to appeal reasons', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

      await cui_pages.homeOfficeDecisionWrong.verifyUserIsOnPage();
      await cui_pages.homeOfficeDecisionWrong.verifyAllTextOnPage();
      await cui_pages.homeOfficeDecisionWrong.completePageAndContinue({
        reasonWhyHomeOfficeDecisionIsWrong: 'The home office is wrong test reason',
      });

      await cui_pages.supportingEvidence.verifyUserIsOnPage();
      await cui_pages.supportingEvidence.verifyAllTextOnPage();
      await cui_pages.supportingEvidence.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'Yes' });

      await cui_pages.provideSupportingEvidence.verifyUserIsOnPage();
      await cui_pages.provideSupportingEvidence.verifyAllTextOnPage();
      await cui_pages.provideSupportingEvidence.completePageAndContinue({});
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

        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowLabel).toHaveText('Supporting evidence'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowValue).toHaveText('Provide_Supporting_Evidence.txt'),
        expect(cui_pages.appealReasonsCheckAnswers.$static.supportingEvidenceTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeSupportingEvidenceLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswers.$interactive.changeSupportingEvidenceLink).toBeVisible(),
      ]);
    });

    await test.step('Verify user is able to submit their appeal reasons answers successfully', async () => {
      await cui_pages.appealReasonsCheckAnswers.submitAnswer();
      await cui_pages.appealReasonsAnswerSent.verifyUserIsOnPage();

      const expectedDate = (
        await dataUtils.getDateFromToday({ dayOffset: 14, formattingOptions: { day: '2-digit', month: 'long', year: 'numeric' } })
      ).formattedDate;

      await Promise.all([
        expect(cui_pages.appealReasonsAnswerSent.$static.whatHappensNextHeading).toBeVisible(),

        expect(cui_pages.appealReasonsAnswerSent.$static.whatHappensNextFirstBulletPoint).toHaveText(
          'A Tribunal Caseworker will look at your answer and contact you to tell you what to do next',
        ),
        expect(cui_pages.appealReasonsAnswerSent.$static.whatHappensNextFirstBulletPoint).toBeVisible(),

        expect(cui_pages.appealReasonsAnswerSent.$static.whatHappensNextSecondBulletPoint).toHaveText(
          `This should be by ${expectedDate} but it may take longer than that`,
        ),
        expect(cui_pages.appealReasonsAnswerSent.$static.whatHappensNextSecondBulletPoint).toBeVisible(),

        expect(cui_pages.appealReasonsAnswerSent.$static.ifYouHaveQuestionsParagraph).toHaveText(
          'If you have any questions about the appeal process, call the Tribunal on 0300 123 1711 or email contactia@justice.gov.uk',
        ),
        expect(cui_pages.appealReasonsAnswerSent.$static.ifYouHaveQuestionsParagraph).toBeVisible(),
      ]);
    });
  });
});
