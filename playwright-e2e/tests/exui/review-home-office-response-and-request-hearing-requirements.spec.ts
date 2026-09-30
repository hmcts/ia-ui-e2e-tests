import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe(
  'Set of tests to verify case officer is able to review home office response and request hearing requirements on exui manage cases',
  { tag: ['@functional'] },
  () => {
    test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

    test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
      const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
        const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
          appealType: 'European Economic Area',
          hasApplicantReceivedADeportationOrder: 'No',
          isApplicantStateless: false,
          nationality: 'Syrian',
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
      });

      await test.step(`Case Officer: Navigate to case overview page on exui`, async () => {
        await exui_pages.caseOverview.goTo({ caseId: caseId });
      });
    });

    test('Verify case officer is able to review home office response and request hearing requirements', async ({ exui_pages, dataUtils }) => {
      await test.step('Verify correct next steps are displayed on case overview page', async () => {
        await Promise.all([
          expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText('Check the response uploaded by the respondent.'),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),

          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
            'If it complies with the Procedure Rules and Practice Directions, direct the appellant to review the Home Office response.',
          ),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),

          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText(
            'If it does not comply, direct the respondent to make the appropriate changes.',
          ),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),
        ]);
      });

      await test.step('Select review home office response from next steps dropdown and submit event', async () => {
        await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Review Home Office response' });

        await exui_pages.reviewHomeOfficeResponse.verifyUserIsOnPage();
        await exui_pages.reviewHomeOfficeResponse.verifyAllTextOnPage();
        await exui_pages.reviewHomeOfficeResponse.continueOnToNextPage();

        await exui_pages.reviewHomeOfficeResponseSubmit.verifyUserIsOnPage();

        const expectedDate = await dataUtils.getDateFromToday({ dayOffset: 5 });
        const date = new Date(expectedDate.year, expectedDate.month - 1, expectedDate.day);
        const formattedExpectedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');

        await Promise.all([
          expect(exui_pages.reviewHomeOfficeResponseSubmit.$static.caseRecordHeading).toBeVisible(),
          expect(exui_pages.reviewHomeOfficeResponseSubmit.$static.checkYouAnswersHeading).toBeVisible(),
          expect(exui_pages.reviewHomeOfficeResponseSubmit.$static.checkInformationCarefullyText).toBeVisible(),
          // Verify explain the direction you are issuing question and answer are displayed correctly on check your answers page
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionLocator('Explain the direction you are issuing')).toBeVisible(),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionValueLocator('Explain the direction you are issuing'))
            .toHaveText(`The Home Office has replied to your Appeal Skeleton Argument and evidence. You should review their response.

# Next steps

Review the Home Office response. If you want to respond to what they have said, you should email the Tribunal.

If you do not respond by the date indicated below, the case will automatically go to hearing.`),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionValueLocator('Explain the direction you are issuing')).toBeVisible(),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$changeAnswerToQuestionLocator('Explain the direction you are issuing')).toHaveText(
            'Change',
          ),
          await expect(
            exui_pages.reviewHomeOfficeResponseSubmit.$changeAnswerToQuestionLocator('Explain the direction you are issuing'),
          ).toBeVisible(),
          // Verify who are you issuing the direction to question and answer are displayed correctly on check your answers page
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionLocator('Who are you giving the direction to?')).toBeVisible(),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionValueLocator('Who are you giving the direction to?')).toHaveText(
            'Appellant',
          ),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionValueLocator('Who are you giving the direction to?')).toBeVisible(),
          // Verify by what date must they comply question and answer are displayed correctly on check your answers page
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionLocator('By what date must they comply?')).toBeVisible(),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionValueLocator('By what date must they comply?')).toHaveText(
            formattedExpectedDate,
          ),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$questionValueLocator('By what date must they comply?')).toBeVisible(),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$changeAnswerToQuestionLocator('By what date must they comply?')).toHaveText(
            'Change',
          ),
          await expect(exui_pages.reviewHomeOfficeResponseSubmit.$changeAnswerToQuestionLocator('By what date must they comply?')).toBeVisible(),
        ]);

        await exui_pages.reviewHomeOfficeResponseSubmit.submitEvent();

        await exui_pages.reviewHomeOfficeResponseConfirm.verifyUserIsOnPage();
        await exui_pages.reviewHomeOfficeResponseConfirm.verifyAllTextOnPage();
        await exui_pages.reviewHomeOfficeResponseConfirm.returnToCaseDetails();
      });

      await test.step('Verify correct next steps are displayed once review home office response event has been submitted', async () => {
        await exui_pages.caseOverview.verifyUserIsOnPage({});
        await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review Home Office response' });

        await Promise.all([
          expect(exui_pages.caseOverview.$static.whatHappensNextHeading).toBeVisible(),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The appellant has been directed to review the Home Office response.',
          ),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(1)).toHaveText(
            'If they do not respond by the direction due date, the case automatically proceeds to a hearing.',
          ),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
        ]);
      });

      await test.step('Select request hearing requirements from next steps dropdown and submit event', async () => {
        await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request hearing requirements' });

        await exui_pages.requestHearingRequirements.verifyUserIsOnPage();
        await expect(exui_pages.requestHearingRequirements.$static.caseRecordHeading).toBeVisible();
        await exui_pages.requestHearingRequirements.submitEvent();
      });

      await test.step('Verify correct next steps are displayed once request hearing requirements event has been submitted', async () => {
        await exui_pages.caseOverview.verifyUserIsOnPage({});
        await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request hearing requirements' });

        await Promise.all([
          expect(exui_pages.caseOverview.$static.whatHappensNextHeading).toBeVisible(),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The appellant has been directed to submit their hearing requirements.',
          ),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(1)).toHaveText(
            'If the appellant does not comply by the date indicated in the direction, you can proceed to a hearing without requirements.',
          ),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
        ]);
      });
    });
  },
);
