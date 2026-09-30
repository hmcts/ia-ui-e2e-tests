import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to request respondent review on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Sudanese',
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
    });

    await test.step(`Case Officer: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify case officer is able to request respondent review', async ({ exui_pages, dataUtils }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText("Review the appellant's case in the appeal tab."),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          'If you believe the case is ready to proceed you should direct the respondent to review it.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText(
          "If you don't think it is ready, you should direct the appellant to answer clarifying questions or attend a case management appointment.",
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toHaveText('You can do this from the directions tab.'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toBeVisible(),
      ]);
    });

    await test.step('Select request respondent review from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request respondent review' });

      await exui_pages.requestRespondentReview.verifyUserIsOnPage();
      await exui_pages.requestRespondentReview.verifyAllTextOnPage();
      await exui_pages.requestRespondentReview.continueOnToNextPage();

      await exui_pages.requestRespondentReviewSubmit.verifyUserIsOnPage();

      const expectedDate = await dataUtils.getDateFromToday({ dayOffset: 14 });
      const date = new Date(expectedDate.year, expectedDate.month - 1, expectedDate.day);
      const formattedExpectedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');

      await Promise.all([
        expect(exui_pages.requestRespondentReviewSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.requestRespondentReviewSubmit.$static.checkYouAnswersHeading).toBeVisible(),
        expect(exui_pages.requestRespondentReviewSubmit.$static.checkInformationCarefullyText).toBeVisible(),

        expect(exui_pages.requestRespondentReviewSubmit.$static.directionYouAreIssuingQuestion).toHaveText('Explain the direction you are issuing'),
        expect(exui_pages.requestRespondentReviewSubmit.$static.directionYouAreIssuingQuestion).toBeVisible(),
        expect(exui_pages.requestRespondentReviewSubmit.$static.directionYouAreIssuingValue)
          .toHaveText(`By the date below you must review the appellant’s ASA and bundle.
      The review must comply with (i) Rule 24A (3) of the Tribunal Procedure Rules 2014 and (ii) Practice Direction (1.11.2024) Part 2, section 2.1 (e), Part 3, sections 7.11 – 7.12. Specifically, the review must:
      
      - be meaningful.
      - explain whether you agree that the schedule of disputed issues is correct. If not, the review must set out the correct list of disputed issues, including whether there are any further issues that the respondent wishes to raise.
      - state whether you oppose or accept the appellant’s position on each issue and why.
      - cross-reference your submissions to paragraphs in the decision under appeal, pages in the respondent’s bundle, any country information evidence schedule, and/or any additional evidence relied upon.
      - specify which, if any, witnesses you intend to cross-examine and if you do not intend to cross-examine a witness, outline any objections to that witness’s statement being read by a judge.
      - address whether the appeal should be allowed on any ground if the appellant and/or their key witnesses are found to be credible according to the applicable standard of proof.
      - identify whether you are prepared to withdraw the decision (or part of it).
      - state whether the appeal can be resolved without a hearing.
      - not exceed 6 pages unless reasons are submitted in an accompanying application.
      - not contain standard or pro-forma paragraphs.
      - provide the name of the author of the review and the date.
      
      Parties must ensure they conduct proceedings with procedural rigour. The Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction of 01.11.24.`),
        expect(exui_pages.requestRespondentReviewSubmit.$static.directionYouAreIssuingValue).toBeVisible(),

        expect(exui_pages.requestRespondentReviewSubmit.$static.whoAreYouGivingDirectionToQuestion).toHaveText(
          'Who are you giving the direction to?',
        ),
        expect(exui_pages.requestRespondentReviewSubmit.$static.whoAreYouGivingDirectionToQuestion).toBeVisible(),
        expect(exui_pages.requestRespondentReviewSubmit.$static.whoAreYouGivingDirectionToValue).toHaveText('Respondent'),
        expect(exui_pages.requestRespondentReviewSubmit.$static.whoAreYouGivingDirectionToValue).toBeVisible(),

        expect(exui_pages.requestRespondentReviewSubmit.$static.byWhatDateMustTheyComplyQuestion).toHaveText('By what date must they comply?'),
        expect(exui_pages.requestRespondentReviewSubmit.$static.byWhatDateMustTheyComplyQuestion).toBeVisible(),
        expect(exui_pages.requestRespondentReviewSubmit.$static.byWhatDateMustTheyComplyValue).toHaveText(formattedExpectedDate),
        expect(exui_pages.requestRespondentReviewSubmit.$static.byWhatDateMustTheyComplyValue).toBeVisible(),

        expect(exui_pages.requestRespondentReviewSubmit.$interactive.changeDirectionYouAreIssuingButton).toHaveText('Change'),
        expect(exui_pages.requestRespondentReviewSubmit.$interactive.changeDirectionYouAreIssuingButton).toBeVisible(),
        expect(exui_pages.requestRespondentReviewSubmit.$interactive.changeByWhatDateMustTheyComplyButton).toHaveText('Change'),
        expect(exui_pages.requestRespondentReviewSubmit.$interactive.changeByWhatDateMustTheyComplyButton).toBeVisible(),
      ]);

      await exui_pages.requestRespondentReviewSubmit.sendDirection();

      await exui_pages.requestRespondentReviewConfirm.verifyUserIsOnPage();
      await exui_pages.requestRespondentReviewConfirm.verifyAllTextOnPage();
      await exui_pages.requestRespondentReviewConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent review' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          "The respondent is reviewing the case, you'll be notified when their response has been uploaded.",
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });
  });
});
