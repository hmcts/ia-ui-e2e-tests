import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify home office user is able to upload appeal response on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.homeOfficeUser.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Slovenian',
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
    });

    await test.step(`Home Office User: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify home office user is able to upload appeal response', async ({ exui_pages }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'The Appeal Skeleton Argument is ready to view in the documents tab.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          "Review the documents and add the Home Office's response, or make an application to withdraw.",
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
      ]);
    });

    await test.step('Select upload the appeal response from next steps drop down and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Upload the appeal response' });

      await exui_pages.uploadHomeOfficeAppealResponseReviewOutcome.verifyUserIsOnPage();
      await exui_pages.uploadHomeOfficeAppealResponseReviewOutcome.verifyAllTextOnPage();
      await exui_pages.uploadHomeOfficeAppealResponseReviewOutcome.completePageAndContinue({
        appealReviewOutcome: 'Decision maintained',
      });

      await exui_pages.uploadHomeOfficeAppealResponse.verifyUserIsOnPage();
      await exui_pages.uploadHomeOfficeAppealResponse.verifyAllTextOnPage();
      await exui_pages.uploadHomeOfficeAppealResponse.completePageAndContinue({});

      await exui_pages.uploadHomeOfficeAppealResponseSubmit.verifyUserIsOnPage();

      await Promise.all([
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$static.caseRecordHeading).toBeVisible(),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$static.checkYouAnswersHeading).toBeVisible(),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$static.checkInformationCarefullyText).toBeVisible(),
        // Verify outcome question and answer are displayed correctly on check your answers page
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$questionLocator('Outcome')).toBeVisible(),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$questionValueLocator('Outcome')).toHaveText('Decision maintained'),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$questionValueLocator('Outcome')).toBeVisible(),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$changeAnswerToQuestionLocator('Outcome')).toHaveText('Change'),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$changeAnswerToQuestionLocator('Outcome')).toBeVisible(),
        // Verify appeal response question and answer are displayed correctly on check your answers page
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$questionLocator('Upload the appeal response')).toBeVisible(),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$questionValueLocator('Upload the appeal response')).toHaveText(
          'Home_Office_Appeal_Reason.txt',
        ),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$questionValueLocator('Upload the appeal response')).toBeVisible(),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$changeAnswerToQuestionLocator('Upload the appeal response')).toHaveText(
          'Change',
        ),
        await expect(exui_pages.uploadHomeOfficeAppealResponseSubmit.$changeAnswerToQuestionLocator('Upload the appeal response')).toBeVisible(),
      ]);

      await exui_pages.uploadHomeOfficeAppealResponseSubmit.submitEvent();

      await exui_pages.uploadHomeOfficeAppealResponseConfirm.verifyUserIsOnPage();
      await exui_pages.uploadHomeOfficeAppealResponseConfirm.verifyAllTextOnPage();
      await exui_pages.uploadHomeOfficeAppealResponseConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload the appeal response' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText('The Tribunal will:'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          '• check that the Home Office response complies with the Procedure Rules and Practice Directions',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText('• inform you of any issues'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toHaveText(
          'Providing there are no issues, the response will be shared with the appellant.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(4)).toHaveText(
          'All parties will be notified when the Hearing Notice is ready.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(4)).toBeVisible(),
      ]);
    });
  });
});
