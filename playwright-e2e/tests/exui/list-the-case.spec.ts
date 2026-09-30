import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify admin user is able to list a case for hearing on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.adminOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Slovak',
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

    await test.step('Progress case via api', async () => {
      await exui_caseOfficerApiClient.submitCompleteCaseReviewEvent({ caseId: caseId });

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({
        caseId: caseId,
      });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test upload of Home Office bundle',
      });

      await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({
        caseId: caseId,
      });

      await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
        doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
        appealReasons: {
          doYouWishToProvideSupportingEvidence: 'No',
          reasonWhyHomeOfficeDecisionIsWrong: 'Test reason why the Home Office decision is wrong',
        },
        caseId: caseId,
      });

      await exui_caseOfficerApiClient.submitRequestRespondentReviewEvent({
        caseId: caseId,
      });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeAppealResponseEvent({
        caseId: caseId,
        appealReviewOutcome: 'Decision maintained',
      });

      await exui_caseOfficerApiClient.submitRequestResponseReviewEvent({
        caseId: caseId,
      });

      await exui_caseOfficerApiClient.submitRequestHearingRequirementsEvent({
        caseId: caseId,
      });

      await cui_apiClient.commpleteAndSubmitHearingRequirementsJourneyViaApi({
        pathToTake: 'Minimal Path',
        caseId: caseId,
      });

      await exui_caseOfficerApiClient.submitReviewHearingRequirementsEvent({
        caseId: caseId,
        isRemoteHearingAllowed: 'Granted',
        grantOrRefuseAnyAdjustmentsRequested: 'Granted',
        isApplicationSuitableToFloat: 'Yes',
        anyAdditionalInstructions: 'Yes',
        hearingType: 'Video',
      });
    });

    await test.step(`Admin User: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify admin user is able to list a case', async ({ exui_pages, dataUtils }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        await expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        await expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toContainText(
          'The agreed hearing requirements and dates to avoid are available to view in the Hearing and appointment tab. You should request a hearing from the Hearings tab.',
        ),
        await expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });

    await test.step('Select list case from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'List the case' });

      await exui_pages.listCase.verifyUserIsOnPage();
      await exui_pages.listCase.verifyAllTextOnPage();
      const listingReference = await exui_pages.listCase.completePageAndContinue({
        listingLocation: 'Newport Tribunal Centre - Columbus House',
        remoteHearing: 'Yes',
        dateToSet: 'tomorrow',
        hourToSet: 13,
      });

      const dateResult = await dataUtils.getDateFromToday({ dayOffset: 1 });
      const expectedDate = `${dateResult.day} ${new Date(dateResult.year, dateResult.month - 1)
        .toLocaleString('en-GB', { month: 'short' })
        .replace('Sept', 'Sep')} ${dateResult.year}`;
      await exui_pages.listCaseSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.listCaseSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$static.checkYouAnswersHeading).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$static.checkInformationCarefullyText).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$questionLocator('Listing reference')).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$questionValueLocator('Listing reference')).toHaveText(listingReference),
        expect(exui_pages.listCaseSubmit.$questionLocator('Listing location')).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$questionValueLocator('Listing location')).toHaveText('Newport Tribunal Centre - Columbus House'),
        expect(exui_pages.listCaseSubmit.$questionLocator('Will the hearing be held remotely?')).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$questionValueLocator('Will the hearing be held remotely?')).toHaveText('Yes'),
        expect(exui_pages.listCaseSubmit.$static.listingLengthText).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$static.listingLengthTableHeading).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$static.hoursLabel).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$static.hoursValue).toHaveText('2'),
        expect(exui_pages.listCaseSubmit.$static.hoursValue).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$static.minutesLabel).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$static.minutesValue).toHaveText('0'),
        expect(exui_pages.listCaseSubmit.$static.minutesValue).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$questionLocator('Date and time')).toBeVisible(),
        expect(exui_pages.listCaseSubmit.$questionValueLocator('Date and time')).toHaveText(`${expectedDate}, 1:00:00 PM`),
      ]);
      await exui_pages.listCaseSubmit.listCase();

      await exui_pages.listCaseConfirm.verifyUserIsOnPage();
      await exui_pages.listCaseConfirm.verifyAllTextOnPage();
      await exui_pages.listCaseConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'List the case' });
      await Promise.all([
        await expect(exui_pages.caseOverview.$static.whatHappensNextHeading).toBeVisible(),
        await expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
        await expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toHaveText(
          'The Notice of Hearing will be sent to all parties.',
        ),
      ]);
    });
  });
});
