import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to add stf flag manually to an existing case', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_legalRepApiClient, exui_pages }) => {
    const caseId = await test.step('Legal rep Api: Submit a new appeal', async () => {
      const caseId = await exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
        'appealType': 'Deprivation of citizenship',
        'isAppellantInUk': 'Yes',
        'appellantInUk': {
            'isAppellantInDetention': 'No',
        },
        'isAppellantStateless': 'No',
        'nationality': 'Belgian',
        'isApplicationInTime': 'Yes',
        'doesApplicantHaveASponsor': 'No',
        'hearingType': 'Decision with a hearing'
      })
    return caseId
    });

    await test.step(`Case officer: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
      await exui_pages.caseOverview.refreshPageUntilExpectedTextIsVisible({ 'expectedText': 'Complete case review'})
    });
  });

  test('Verify case officer is able to add STF flag to an existing case', async ({ exui_pages, dataUtils }) => {
    await test.step('Select Add Statutory Timeframe event from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Add Statutory Timeframe' });
      await exui_pages.addStatutoryTimeFrame.verifyUserIsOnPage();
      await exui_pages.addStatutoryTimeFrame.verifyAllTextOnPage();
      await exui_pages.addStatutoryTimeFrame.completePageAndContinue({ 'reason': 'Adding STF flag for automated test' })

      await exui_pages.addStatutoryTimeFrameSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.addStatutoryTimeFrameSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.addStatutoryTimeFrameSubmit.$static.checkYourAnswersHeading).toBeVisible(),
        expect(exui_pages.addStatutoryTimeFrameSubmit.$static.checkInformationCarefullyText).toBeVisible(),
        expect(exui_pages.addStatutoryTimeFrameSubmit.$questionLocator('Reason')).toBeVisible(),
        expect(exui_pages.addStatutoryTimeFrameSubmit.$questionValueLocator('Reason')).toBeVisible(),
        expect(exui_pages.addStatutoryTimeFrameSubmit.$questionValueLocator('Reason')).toHaveText('Adding STF flag for automated test'),
        expect(exui_pages.addStatutoryTimeFrameSubmit.$changeAnswerToQuestionLocator('Reason')).toBeVisible(),
      ])
      await exui_pages.addStatutoryTimeFrameSubmit.submitEvent()

      await exui_pages.addStatutoryTimeFrameConfirm.verifyUserIsOnPage();
      await exui_pages.addStatutoryTimeFrameConfirm.verifyAllTextOnPage();
      await exui_pages.addStatutoryTimeFrameConfirm.returnToCaseDetails();
  });
  await test.step('Verify Statutory Timeframe flag has been added successfully on case overview page', async () => {
    await exui_pages.caseOverview.verifyUserIsOnPage({})
    await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({'eventSubmitted': 'Add Statutory Timeframe'})
    const expectedDate = await dataUtils.getDateFromToday({'dayOffset': 168})
    const expectedFormattedDate = new Date(expectedDate.year, expectedDate.month -1, expectedDate.day).toLocaleString('en-GB', {'day': 'numeric', 'month': 'short', 'year': 'numeric'}).replace('Sept', 'Sep')
    await expect(exui_pages.caseOverview.$static.stfFlag).toBeVisible()
    await expect(exui_pages.caseOverview.$static.stfFlag).toHaveText(`24 Week STF (${expectedFormattedDate})`)
  });

  await test.step('Verify case officer is able to remove STF flag to an existing case', async () => {
    await exui_pages.caseOverview.verifyUserIsOnPage({})
    const expectedDate = await dataUtils.getDateFromToday({'dayOffset': 168})
    const expectedFormattedDate = new Date(expectedDate.year, expectedDate.month -1, expectedDate.day).toLocaleString('en-GB', {'day': 'numeric', 'month': 'short', 'year': 'numeric'}).replace('Sept', 'Sep')
    await expect(exui_pages.caseOverview.$static.stfFlag).toBeVisible();
    await expect(exui_pages.caseOverview.$static.stfFlag).toHaveText(`24 Week STF (${expectedFormattedDate})`);
    await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Remove Statutory Timeframe'});
    await exui_pages.removeStatutoryTimeframe.verifyUserIsOnPage();
    await exui_pages.removeStatutoryTimeframe.verifyAllTextOnPage();
    await exui_pages.removeStatutoryTimeframe.completePageAndContinue({ 'reasonForRemoval': 'Removing stf for automated test', 'decisionMakerName': 'Test Case Officer'})

    await exui_pages.removeStatutoryTimeframeSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.pageHeading).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.checkYourAnswersHeading).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$static.checkInformationCarefullyText).toBeVisible(),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionLocator('Name of decision maker')).toBeVisible,
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionValueLocator('Name of decision maker')).toHaveText('Test Case Officer'),
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionLocator('Reason for removal of 24 week timeframe')).toBeVisible,
        expect(exui_pages.removeStatutoryTimeframeSubmit.$questionValueLocator('Reason for removal of 24 week timeframe')).toHaveText('Removing stf for automated test'),
      ])
    await exui_pages.removeStatutoryTimeframeSubmit.submitEvent()

    await exui_pages.removeStatutoryTimeFrameConfirm.verifyUserIsOnPage();
    await exui_pages.removeStatutoryTimeFrameConfirm.verifyAllTextOnPage();
    await exui_pages.removeStatutoryTimeFrameConfirm.returnToCaseDetails();
  });

  await test.step('Verify Statutory Timeframe flag has been removes successfully on case overview page', async () => {
    await exui_pages.caseOverview.verifyUserIsOnPage({})
    await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ 'eventSubmitted': 'Remove Statutory Timeframe'})
    await expect(exui_pages.caseOverview.$static.stfFlag).not.toBeVisible();
  })
});
});