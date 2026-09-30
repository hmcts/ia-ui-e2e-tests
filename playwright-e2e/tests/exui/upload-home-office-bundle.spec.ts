import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify home officer user is able to upload home office bundle on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.homeOfficeUser.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Beninese',
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
    });

    await test.step(`Home Officer User: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify home office user is able to upload home office bundle', async ({ exui_pages }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'An appeal against the Home Office decision in this case has been submitted. You can view the appeal form in the documents tab.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          'If you accept that there is a right of appeal you should upload the Home Office bundle.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText(
          'If you consider the appeal is not valid, you should contact the Tribunal and the appellant with your reasons.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),
      ]);
      return exui_pages;
    });

    await test.step('Select upload home office bundle from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Upload Home Office bundle' });

      await exui_pages.uploadHomeOfficeBundle.verifyUserIsOnPage();
      await exui_pages.uploadHomeOfficeBundle.verifyAllTextOnPage();
      await exui_pages.uploadHomeOfficeBundle.completePageAndContinue({ description: 'Test upload of Home Office bundle' });

      await exui_pages.uploadHomeOfficeBundleSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.checkYourAnswersHeading).toBeVisible(),

        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.checkInformationText).toHaveText('Check the information below carefully.'),
        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.checkInformationText).toBeVisible(),

        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.uploadHomeOfficeBundleText).toBeVisible(),

        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.tableTitle).toHaveText('Upload Home Office bundle 1'),
        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.tableTitle).toBeVisible(),

        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.uploadAFileLabel).toBeVisible(),
        expect(exui_pages.uploadHomeOfficeBundleSubmit.page.getByRole('button', { name: 'Home_Office_Bundle.txt', exact: true })).toBeVisible(),

        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.describeTheDocumentLabel).toBeVisible(),
        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.describeTheDocumentValue).toHaveText('Test upload of Home Office bundle'),
        expect(exui_pages.uploadHomeOfficeBundleSubmit.$static.describeTheDocumentValue).toBeVisible(),

        expect(exui_pages.uploadHomeOfficeBundleSubmit.$interactive.changeUplaodHomeOfficeBundleButton).toHaveText('Change'),
        expect(exui_pages.uploadHomeOfficeBundleSubmit.$interactive.changeUplaodHomeOfficeBundleButton).toBeVisible(),
      ]);

      await exui_pages.uploadHomeOfficeBundleSubmit.submitEvent();

      await exui_pages.uploadHomeOfficeBundleConfirm.verifyUserIsOnPage();
      await exui_pages.uploadHomeOfficeBundleConfirm.verifyAllTextOnPage();
      await exui_pages.uploadHomeOfficeBundleConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload Home Office bundle' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText('The Tribunal will:'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextBulletPoint.nth(0)).toHaveText(
          'check that the bundle complies with the Procedural Rules and Practice Directions',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextBulletPoint.nth(0)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextBulletPoint.nth(1)).toHaveText('inform you of any issues'),
        expect(exui_pages.caseOverview.$static.doThisNextBulletPoint.nth(1)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          'The Home Office will be notified when the Appeal Skeleton Argument is ready to review.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
      ]);
    });
  });
});
