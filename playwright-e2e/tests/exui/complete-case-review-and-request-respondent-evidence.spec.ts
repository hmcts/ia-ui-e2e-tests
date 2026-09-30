import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to request respondent evidence on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'South Sudanese',
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

    await test.step(`Case officer: Navigate to case overview page on exui`, async () => {
      const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify case officer is able to request respondent evidence', async ({ exui_pages, dataUtils }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          'You must review the appeal in the documents tab. If the appeal is valid, you must run the Complete case review event which will validate the case and then run the Request respondent evidence event to tell the respondent to supply their evidence.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
      ]);
    });

    await test.step('Select complete case review from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Complete case review' });

      await exui_pages.completeCaseReview.verifyUserIsOnPage();
      await exui_pages.completeCaseReview.verifyAllTextOnPage();
      await exui_pages.completeCaseReview.submitEvent();

      await exui_pages.completeCaseReviewConfirm.verifyUserIsOnPage();
      await exui_pages.completeCaseReviewConfirm.verifyAllTextOnPage();
      await exui_pages.completeCaseReviewConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Complete case review' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          'You must review the appeal in the documents tab. If the appeal is valid, you must run the Complete case review event which will validate the case and then run the Request respondent evidence event to tell the respondent to supply their evidence.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
      ]);
    });

    await test.step('Select request respondent evidence from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request respondent evidence' });

      await exui_pages.requestRespondentEvidence.verifyUserIsOnPage();
      await exui_pages.requestRespondentEvidence.verifyAllTextOnPage();
      await exui_pages.requestRespondentEvidence.continueOnToNextPage();

      await exui_pages.requestRespondentEvidenceSubmit.verifyUserIsOnPage();
      const expectedDate = await dataUtils.getDateFromToday({ dayOffset: 14 });
      const date = new Date(expectedDate.year, expectedDate.month - 1, expectedDate.day);
      const formattedExpectedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');

      await Promise.all([
        expect(exui_pages.requestRespondentEvidenceSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.requestRespondentEvidenceSubmit.$static.checkYouAnswersHeading).toBeVisible(),
        expect(exui_pages.requestRespondentEvidenceSubmit.$static.checkInformationCarefullyText).toBeVisible(),
        // Verify explain the direction question and answer is correct
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionLocator('Explain the direction you are issuing')).toBeVisible(),
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionValueLocator('Explain the direction you are issuing'))
          .toHaveText(`A notice of appeal has been lodged against this decision.

By the date indicated below the respondent is directed to supply the documents:

The bundle must comply with (i) Rule 23 or Rule 24 of the Tribunal Procedure Rules 2014 (as applicable) and (ii) Practice Direction (1.11.2024) Part 3, sections 7.1 - 7.4. Specifically, the bundle must contain:

- the notice of decision appealed against.
- any other document provided to the appellant giving reasons for that decision.
- any evidence or material relevant to the disputed issues.
- any statements of evidence.
- the application form.
- any record of interview with the appellant in relation to the decision being appealed.
- any previous decision(s) of the Tribunal and Upper Tribunal (IAC) relating to the appellant.
- any other unpublished documents on which you rely.
- the notice of any other appealable decision made in relation to the appellant.

Where the appeal involves deportation, you must also include the following evidence:

- a copy of the Certificate of Conviction.
- a copy of any indictment/charge.
- a transcript of the Sentencing Judge's Remarks.
- a copy of any Pre-Sentence Report.
- a copy of the appellant's criminal record.
- a copy of any Parole Report or other document relating to the appellant's period in custody and/or release.
- a copy of any mental health report.

Parties must ensure they conduct proceedings with procedural rigour. The Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction of 01.11.24.`),
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionValueLocator('Explain the direction you are issuing')).toBeVisible(),
        expect(exui_pages.requestRespondentEvidenceSubmit.$changeAnswerToQuestionLocator('Explain the direction you are issuing')).toHaveText(
          'Change',
        ),
        expect(exui_pages.requestRespondentEvidenceSubmit.$changeAnswerToQuestionLocator('Explain the direction you are issuing')).toBeVisible(),
        // Verify who are you giving the direction to question and answer is correct
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionLocator('Who are you giving the direction to?')).toBeVisible(),
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionValueLocator('Who are you giving the direction to?')).toHaveText('Respondent'),
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionValueLocator('Who are you giving the direction to?')).toBeVisible(),
        // Verify by what date must they comply question and answer is correct
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionLocator('By what date must they comply?')).toBeVisible(),
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionValueLocator('By what date must they comply?')).toHaveText(formattedExpectedDate),
        expect(exui_pages.requestRespondentEvidenceSubmit.$questionValueLocator('By what date must they comply?')).toBeVisible(),
        expect(exui_pages.requestRespondentEvidenceSubmit.$changeAnswerToQuestionLocator('By what date must they comply?')).toHaveText('Change'),
        expect(exui_pages.requestRespondentEvidenceSubmit.$changeAnswerToQuestionLocator('By what date must they comply?')).toBeVisible(),
      ]);

      await exui_pages.requestRespondentEvidenceSubmit.sendDirection();

      await exui_pages.requestRespondentEvidenceConfirm.verifyUserIsOnPage();
      await exui_pages.requestRespondentEvidenceConfirm.verifyAllTextOnPage();
      await exui_pages.requestRespondentEvidenceConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent evidence' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.whatHappensNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toHaveText('The Home Office will prepare their bundle.'),
        expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
      ]);
    });
  });
});
