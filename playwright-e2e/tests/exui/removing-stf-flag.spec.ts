import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to remove STF flag manually from an existing case', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_legalRepApiClient, exui_pages }) => {
    const caseId = await test.step('Legal rep API: Submit a new appeal', async () => {
      return exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
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
    });

    await test.step('Case officer: Navigate to case overview page on EXUI', async () => {
      await exui_pages.caseOverview.goTo({ caseId });
      await exui_pages.caseOverview.refreshPageUntilExpectedTextIsVisible({
        expectedText: 'Complete case review',
      });
    });

    await test.step('Case officer: Add STF flag to the case', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({
        eventToSelect: 'Add Statutory Timeframe',
      });
      await exui_pages.addStatutoryTimeFrame.verifyUserIsOnPage();
      await exui_pages.addStatutoryTimeFrame.completePageAndContinue({
        reason: 'Adding STF flag for automated removal of STF flag test',
      });
      await exui_pages.addStatutoryTimeFrameSubmit.submitEvent();
      await exui_pages.addStatutoryTimeFrameConfirm.returnToCaseDetails();
    });
  });

  test('Verify case officer is able to remove STF flag from an existing case', async ({ exui_pages, dataUtils }) => {
    await test.step('Verify the case has an STF flag', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await expect(exui_pages.caseOverview.$static.stfFlag).toBeVisible();
    });

    await test.step('Remove the STF flag', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({
        eventToSelect: 'Remove Statutory Timeframe',
      });
      await exui_pages.removeStatutoryTimeframe.verifyUserIsOnPage();
      await exui_pages.removeStatutoryTimeframe.verifyAllTextOnPage();
      await exui_pages.removeStatutoryTimeframe.completePageAndContinue({
        reasonForRemoval: 'Removing STF for automated test',
        decisionMakerName: 'Test Case Officer',
      });

      await exui_pages.removeStatutoryTimeframeSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.pageHeading).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.checkYourAnswersHeading).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.checkInformationCarefullyText).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionLocator('Name of decision maker')).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionValueLocator('Name of decision maker')).toHaveText(
          'Test Case Officer',
        ),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$changeAnswerToQuestionLocator('Name of decision maker')).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionLocator('Reason for removal of 24 week timeframe')).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionValueLocator('Reason for removal of 24 week timeframe')).toHaveText(
          'Removing STF for automated test',
        ),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$changeAnswerToQuestionLocator('Reason for removal of 24 week timeframe')).toBeVisible
      ]);

      await exui_pages.removeStatutoryTimeframeSubmit.submitEvent();
      await exui_pages.removeStatutoryTimeFrameConfirm.verifyUserIsOnPage();
      await exui_pages.removeStatutoryTimeFrameConfirm.verifyAllTextOnPage();
      await exui_pages.removeStatutoryTimeFrameConfirm.returnToCaseDetails();
    });

    await test.step('Verify the STF flag was removed successfully', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({
        eventSubmitted: 'Remove Statutory Timeframe',
      });
      await expect(exui_pages.caseOverview.$static.stfFlag).not.toBeVisible();
    });
  });
});
