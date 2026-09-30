import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to request home office data on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages }) => {
    const appealDetails = await test.step('Citizen Api: Submit a appeal of type revocation of protection status', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'Revocation of Protection Status',
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
        appealSubmissionType: 'Non-Pay Appeal',
      });
      return appealDetails;
    });

    await test.step(`Case officer: Navigate to case overview page on exui`, async () => {
      const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify case officer is able to request home office data', async ({ exui_pages, cui_apiClient }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'You must review the appeal data and cross reference it with Home Office data in the Validation tab. If the appeal is valid, you must run the Complete case review event which will validate the case and then run the Request respondent evidence event to tell the respondent to supply their evidence.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });

    await test.step('Select validation tab and confirm correct text is shown', async () => {
      await exui_pages.caseOverview.navigateToTab({ tabToSelect: 'Validation' });

      await exui_pages.validation.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.validation.$static.serviceHasBeenUnableToRetrieveDataText).toBeVisible(),
        expect(exui_pages.validation.$static.serviceHasBeenUnableToRetrieveDataText).toHaveText(
          'Note: The service has been unable to retrieve the Home Office information about this appeal because the Home Office Reference/Case ID, data of birth or name submitted by the appellant do not match the details stored by the Home Office',
        ),
        expect(exui_pages.validation.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.validation.$static.doThisNextBuletPoints.nth(0)).toBeVisible(),
        expect(exui_pages.validation.$static.doThisNextBuletPoints.nth(0)).toHaveText('Contact the Home Office to get the correct details'),
        expect(exui_pages.validation.$static.doThisNextBuletPoints.nth(1)).toBeVisible(),
        expect(exui_pages.validation.$static.doThisNextBuletPoints.nth(1)).toHaveText('Use Edit appeal to update the details as required'),
        expect(exui_pages.validation.$static.doThisNextBuletPoints.nth(2)).toBeVisible(),
        expect(exui_pages.validation.$static.doThisNextBuletPoints.nth(2)).toHaveText(
          'Request Home Office data to match the appellant details with the Home Office details',
        ),
      ]);
    });

    await test.step('Select request home office data from next steps dropdown and submit event', async () => {
      const applicationDetails = await cui_apiClient.getNewAppealDetails();
      const appellantName = `${applicationDetails.applicantDetails.givenNames.join(' ')} ${applicationDetails.applicantDetails.familyName}`;
      const appellantDob = new Date(
        applicationDetails.applicantDetails.dob.year,
        applicationDetails.applicantDetails.dob.month - 1,
        applicationDetails.applicantDetails.dob.day,
      );
      const formattedDob = appellantDob.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');

      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request Home Office data' });

      await exui_pages.requestHomeOfficeData.verifyUserIsOnPage();
      await exui_pages.requestHomeOfficeData.verifyAppellantDetails({
        appellantName: appellantName,
        appellantDob: formattedDob,
      });
      await exui_pages.requestHomeOfficeData.continueOnToNextPage();

      await exui_pages.requestHomeOfficeDataSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.requestHomeOfficeDataSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.requestHomeOfficeDataSubmit.$static.checkYourAnswersHeading).toBeVisible(),
        expect(exui_pages.requestHomeOfficeDataSubmit.$static.checkInformationText).toBeVisible(),
        expect(exui_pages.requestHomeOfficeDataSubmit.$static.makeASelectionQuestion).toBeVisible(),
        expect(exui_pages.requestHomeOfficeDataSubmit.$static.makeASelectionValue).toBeVisible(),
        expect(exui_pages.requestHomeOfficeDataSubmit.$static.makeASelectionValue).toHaveText('No Match'),
        expect(exui_pages.requestHomeOfficeDataSubmit.$interactive.changeAnswerToMakeASelectionButton).toBeVisible(),
        expect(exui_pages.requestHomeOfficeDataSubmit.$interactive.changeAnswerToMakeASelectionButton).toHaveText('Change'),
      ]);
      await exui_pages.requestHomeOfficeDataSubmit.requestHomeOfficeData();

      await exui_pages.requestHomeOfficeDataConfirm.verifyUserIsOnPage();
      await exui_pages.requestHomeOfficeDataConfirm.verifyAllTextOnPage();
      await exui_pages.requestHomeOfficeDataConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted on case overview page', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request Home Office data' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'You must review the appeal data and cross reference it with Home Office data in the Validation tab. If the appeal is valid, you must run the Complete case review event which will validate the case and then run the Request respondent evidence event to tell the respondent to supply their evidence.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });

    await test.step('Select validation tab and verify data received from home office', async () => {
      const applicationDetails = await cui_apiClient.getNewAppealDetails();
      const givenNames = applicationDetails.applicantDetails.givenNames.join(' ');
      const familyName = applicationDetails.applicantDetails.familyName;
      const appellantDob = new Date(
        applicationDetails.applicantDetails.dob.year,
        applicationDetails.applicantDetails.dob.month - 1,
        applicationDetails.applicantDetails.dob.day,
      );
      const formattedDob = appellantDob.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');
      const decisionDate = new Date(
        applicationDetails.applicantDetails.decisionLetterDate.year,
        applicationDetails.applicantDetails.decisionLetterDate.month - 1,
        applicationDetails.applicantDetails.decisionLetterDate.day,
      );
      const formattedDecisionDate = decisionDate
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        .replace('Sept', 'Sep');

      await exui_pages.caseOverview.navigateToTab({ tabToSelect: 'Validation' });

      await exui_pages.validation.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.validation.$static.appealValidationHeading).toBeVisible(),
        expect(exui_pages.validation.$static.thereAreNoMatchingDetailsForAppellantText).toBeVisible(),
        expect(exui_pages.validation.$static.thereAreNoMatchingDetailsForAppellantText).toHaveText(
          'There are no matching details for this appellant. You can contact the Home Office if you need more information to validate the appeal.',
        ),
        // Verify appellant details are displayed on the page
        expect(exui_pages.validation.$static.appellantDetailsHeading).toBeVisible(),
        // Verify given name table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('Given name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Given name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Given name')).toHaveText(givenNames),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Given name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Given name')).toHaveText('No match'),
        // Verify family name table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('Family name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Family name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Family name')).toHaveText(familyName),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Family name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Family name')).toHaveText('No match'),
        // Verify full name table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('Full name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Full name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Full name')).toHaveText(`${givenNames} ${familyName}`),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Full name')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Full name')).toHaveText('No match'),
        // Verify gender table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('Gender')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Gender')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Gender')).toBeEmpty(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Gender')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Gender')).toHaveText('No match'),
        // Verify date of birth table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('Date of birth')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Date of birth')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Date of birth')).toHaveText(formattedDob),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Date of birth')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Date of birth')).toHaveText('No match'),
        // Verify HO role table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('HO role')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO role')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO role')).toBeEmpty(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('HO role')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('HO role')).toHaveText('No match'),
        // Verify HO sub-role table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('HO sub-role')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO sub-role')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO sub-role')).toBeEmpty(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('HO sub-role')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('HO sub-role')).toHaveText('No match'),
        // Verify nationality table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('Nationality')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Nationality')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('Nationality')).toHaveText('Slovenia'),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Nationality')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsResultLocator('Nationality')).toHaveText('No match'),
        // Verify application details are displayed correctly on the page
        expect(exui_pages.validation.$static.applicationDetailsHeading).toBeVisible(),
        // Verify HO reference table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('HO reference')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO reference')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO reference')).toHaveText(applicationDetails.homeOfficeReference.toString()),
        // Verify HO decision table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('HO decision')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision')).toBeEmpty(),
        // Verify HO decision date table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('HO decision date')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision date')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision date')).toHaveText(formattedDecisionDate),
        // Verify HO decision sent table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('HO decision sent')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision sent')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision sent')).toHaveText(formattedDecisionDate),
        // Verify HO decision communication table row is displayed correctly on the page
        expect(exui_pages.validation.$appellantDetailsLocator('HO decision communication')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision communication')).toBeVisible(),
        expect(exui_pages.validation.$appellantDetailsValueLocator('HO decision communication')).toBeEmpty(),
      ]);
    });
  });
});
