import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify user is able to submit answers to appeal reasons via UI', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ citizenUser, cui_login, cui_apiClient, exui_caseOfficerApiClient, exui_homeOfficeUserApiClient, cui_pages }) => {
    const detailsOfNewAppeal = await test.step('Submit a new appeal via Api', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Belgian',
        isUserInTheUk: 'Yes',
        sponsorDetails: {
          doesApplicantHaveASponsor: 'No',
          doesApplicantHaveANonLegalRepSponsor: 'No',
        },
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        isApplicationInTime: true,
        whetherApplicantHasToPayAFee: 'None of these statements apply to me',
        appealSubmissionType: 'Pay Appeal',
      });
      return appealDetails;
    });

    const caseId = await exui_caseOfficerApiClient.fetchCaseId({
      homeOfficeReferenceNumber: detailsOfNewAppeal.homeOfficeReference.toString(),
    });

    await test.step('Progress journey via exui api calls in order to allow appellant to submit their appeal reasons', async () => {
      await exui_caseOfficerApiClient.submitCompleteCaseReviewEvent({ caseId: caseId });

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({ caseId: caseId });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test home office bundle upload via api 1',
      });

      await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({ caseId: caseId });
    });

    await test.step('Verify application is in the correct state to submit response to appeal reasons before logging in', async () => {
      await cui_apiClient.verifyAppealIsInExpectedStateViaAppealOverviewApi({
        expectedTextToBeOnAppealOverview: 'Tell us why you think the Home Office decision to refuse your claim is wrong.',
        caseId: caseId,
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Navigate to appeal overview page', async () => {
      await cui_pages.caseList.viewExistingApplication({ searchTerm: caseId });
    });
  });

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

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;

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
