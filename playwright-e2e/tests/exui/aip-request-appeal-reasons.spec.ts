import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to request appeal reasons on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Albanian',
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

    const caseId = await test.step(`Fetch exui case id via api call`, async () => {
      const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });
      return caseId;
    });

    await test.step('Progress case via exui api', async () => {
      await exui_caseOfficerApiClient.submitCompleteCaseReviewEvent({ caseId: caseId });

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({
        caseId: caseId,
      });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test upload of Home Office bundle',
      });
    });

    await test.step(`Case Officer: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify case officer is able to request aip appeal reasons', async ({ exui_pages, dataUtils }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText('The respondent has submitted their evidence.'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          'If it complies with the procedure rules and practice directions, direct the appellant to submit their Appeal Reasons.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText(
          'If it does not comply, direct the respondent to make the appropriate changes.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),
      ]);
    });

    await test.step('Select Aip - request appeal reasons from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'AiP - Request Appeal Reasons' });

      await exui_pages.aipRequestAppealReasons.verifyUserIsOnPage();
      await exui_pages.aipRequestAppealReasons.verifyAllTextOnPage();
      await exui_pages.aipRequestAppealReasons.continueOnToNextPage();

      await exui_pages.aipRequestAppealReasonsSubmit.verifyUserIsOnPage();

      const expectedDate = await dataUtils.getDateFromToday({ dayOffset: 28 });
      const date = new Date(expectedDate.year, expectedDate.month - 1, expectedDate.day);
      const formattedExpectedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');

      await Promise.all([
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.checkYouAnswersHeading).toBeVisible(),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.checkInformationCarefullyText).toBeVisible(),

        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.directionYouAreIssuingQuestion).toHaveText('Explain the direction you are issuing'),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.directionYouAreIssuingQuestion).toBeVisible(),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.directionYouAreIssuingValue).toHaveText(
          'You must now tell us why you think the Home Office decision to refuse your claim is wrong.',
        ),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.directionYouAreIssuingValue).toBeVisible(),

        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.whoAreYouGivingDirectionToQuestion).toHaveText(
          'Who are you giving the direction to?',
        ),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.whoAreYouGivingDirectionToQuestion).toBeVisible(),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.whoAreYouGivingDirectionToValue).toHaveText('Appellant'),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.whoAreYouGivingDirectionToValue).toBeVisible(),

        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.byWhatDateMustTheyComplyQuestion).toHaveText('By what date must they comply?'),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.byWhatDateMustTheyComplyQuestion).toBeVisible(),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.byWhatDateMustTheyComplyValue).toHaveText(formattedExpectedDate),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$static.byWhatDateMustTheyComplyValue).toBeVisible(),

        expect(exui_pages.aipRequestAppealReasonsSubmit.$interactive.changeByWhatDateMustTheyComplyButton).toHaveText('Change'),
        expect(exui_pages.aipRequestAppealReasonsSubmit.$interactive.changeByWhatDateMustTheyComplyButton).toBeVisible(),
      ]);

      await exui_pages.aipRequestAppealReasonsSubmit.sendDirection();

      await exui_pages.aipRequestAppealReasonsConfirm.verifyUserIsOnPage();
      await exui_pages.aipRequestAppealReasonsConfirm.verifyAllTextOnPage();
      await exui_pages.aipRequestAppealReasonsConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'AiP - Request Appeal Reasons' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'The appellant has been directed to submit their Appeal Reasons. You will be notified when it is ready to review.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });
  });
});
