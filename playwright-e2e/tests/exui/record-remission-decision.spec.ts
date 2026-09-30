import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify admin user is able to record a remission decision on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.adminOfficer.sessionFile });

  test.beforeEach(async ({ exui_adminOfficerApiClient, cui_apiClient, exui_pages }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new appeal with fee remission', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'EU Settlement Scheme',
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
        whetherApplicantHasToPayAFee: 'I got a fee waiver from the Home Office for my application to stay in the UK',
        appealSubmissionType: 'Non-Pay Appeal',
      });
      return appealDetails;
    });

    await test.step(`Admin officer: Navigate to case overview page on exui`, async () => {
      const caseId = await exui_adminOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify admin officer is able to approve a remission decision', async ({ exui_pages }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'An appeal has been submitted with a remission application. You need to review the remission details in the appeal tab.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          'If you need more information to make a decision, you can contact the appellant.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText('You then need to record your remission decision.'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),
      ]);
    });

    await test.step('Select record remission decision from next steps dropdown and approve fee remission', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Record remission decision' });

      await exui_pages.recordRemissionDecision.verifyUserIsOnPage();
      await exui_pages.recordRemissionDecision.verifyAllTextOnPage();
      await exui_pages.recordRemissionDecision.completePageAndContinue({ remissionDecision: 'approved' });

      await exui_pages.recordRemissionDecisionDetails.verifyUserIsOnPage();
      await exui_pages.recordRemissionDecisionDetails.verifyAllTextOnPage();
      await exui_pages.recordRemissionDecisionDetails.completePageAndContinue({ amountRemitted: 144, amountLeftToPay: 0 });

      await exui_pages.recordRemissionDecisionSubmit.verifyUserIsOnPage();
      await Promise.all([
        await expect(exui_pages.recordRemissionDecisionSubmit.$static.caseRecordHeading).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$static.checkYourAnswersHeading).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$static.checkInformationText).toBeVisible(),
        // Verify decision question and answer are displayed correctly on check your answers page
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionLocator('Decision')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionValueLocator('Decision')).toHaveText('Approved'),
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionValueLocator('Decision')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$changeAnswerToQuestionLocator('Decision')).toHaveText('Change'),
        await expect(exui_pages.recordRemissionDecisionSubmit.$changeAnswerToQuestionLocator('Decision')).toBeVisible(),
        // Verify amount remitted question and answer are displayed correctly on check your answers page
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionLocator('Amount remitted')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionValueLocator('Amount remitted')).toHaveText('£144.00'),
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionValueLocator('Amount remitted')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$changeAnswerToQuestionLocator('Amount remitted')).toHaveText('Change'),
        await expect(exui_pages.recordRemissionDecisionSubmit.$changeAnswerToQuestionLocator('Amount remitted')).toBeVisible(),
        // Verify amount left to pay question and answer are displayed correctly on check your answers page
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionLocator('Amount left to pay')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionValueLocator('Amount left to pay')).toHaveText('£0.00'),
        await expect(exui_pages.recordRemissionDecisionSubmit.$questionValueLocator('Amount left to pay')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmit.$changeAnswerToQuestionLocator('Amount left to pay')).toHaveText('Change'),
        await expect(exui_pages.recordRemissionDecisionSubmit.$changeAnswerToQuestionLocator('Amount left to pay')).toBeVisible(),
      ]);

      await exui_pages.recordRemissionDecisionSubmit.submitRecordDecision();

      await exui_pages.recordRemissionDecisionConfirm.verifyUserIsOnPage();
      await exui_pages.recordRemissionDecisionConfirm.verifyAllTextOnPage({ remissionDecision: 'approved' });
      await exui_pages.recordRemissionDecisionConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Record remission decision' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.whatHappensNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toHaveText(
          "The Tribunal Caseworker will review the appeal and decide if it's valid.",
        ),
        expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
      ]);
    });
  });
});
