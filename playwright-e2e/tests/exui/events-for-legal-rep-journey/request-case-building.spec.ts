import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to request case building on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, exui_legalRepApiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const caseId = await test.step('Legal Rep Api: Submit a new appeal', async () => {
      const caseId = await exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
        appealType: 'Deprivation of citizenship',
        isAppellantInUk: 'Yes',
        appellantInUk: {
          isAppellantInDetention: 'No',
        },
        doesApplicantHaveASponsor: 'No',
        hearingType: 'Decision with a hearing',
        isAppellantStateless: 'No',
        isApplicationInTime: 'Yes',
        nationality: 'Solomon Islander',
      });

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
    });

    await test.step(`Case Officer: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify case officer is able to request case building', async ({ exui_pages, dataUtils }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText('The respondent has submitted their evidence.'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText(
          'If it complies with the procedure rules and practice directions, direct the legal representative to build their case.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText(
          'If it does not comply, direct the respondent to make the appropriate changes.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),
      ]);
    });

    await test.step('Select Request case building from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request case building' });

      await exui_pages.requestCaseBuilding.verifyUserIsOnPage();
      await exui_pages.requestCaseBuilding.verifyAllTextOnPage();
      await exui_pages.requestCaseBuilding.completePageAndContinue();

      await exui_pages.requestCaseBuildingSubmit.verifyUserIsOnPage();
      const expectedDate = (
        await dataUtils.getDateFromToday({ dayOffset: 42, formattingOptions: { day: 'numeric', month: 'short', year: 'numeric' } })
      ).formattedDate;

      await Promise.all([
        expect(exui_pages.requestCaseBuildingSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$static.checkYouAnswersHeading).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$static.checkInformationCarefullyText).toBeVisible(),

        expect(exui_pages.requestCaseBuildingSubmit.$questionLocator('Explain the direction you are issuing')).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$questionValueLocator('Explain the direction you are issuing')).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$questionValueLocator('Explain the direction you are issuing')).toHaveText(
          `
          You must now build your case to enable the respondent to conduct a thorough review of the appeal.

The appellant and their representative are reminded that they have an obligation under Rule 2(4) of the Procedural Rules to help the Tribunal further the overriding objective to deal with cases fairly and justly; and to cooperate with the Tribunal generally.

By the date indicated below the appellant is directed to:
- upload an Appeal Skeleton Argument (“ASA”). The form and content of this ASA must comply with the terms of Practice Direction (1.11.2024) Part 3, sections 7.1 – 7.2; 7.6 – 7.8; and 16.2. Specifically, the ASA must
   - be no more than 12 pages of numbered paragraphs.
   - be set out in three distinct parts, to include:
      - a concise summary of the appellant’s case;
      - a schedule of the disputed issues;
      - the appellant’s brief submissions on each of those issues, which explain (with reference to the decision under challenge; the evidence and appropriate legal authority) why the issues should be resolved in the appellant’s favour; and
      - the name of the author of the ASA and the date on which it was prepared.
- If the appellant’s application was made on or after 28 June 2022, the appellant’s brief submissions within the ASA must also expressly address the applicable provisions of the Nationality and Borders Act 2022 (including the different stages of the assessment set out at section 32 of NABA 2022).
- The appellant must, by the same date, upload an indexed bundle of all evidence to be relied on in the appeal including witness statements and all evidence relevant to the issues in dispute as set out within the ASA and which has not been included in the respondent’s bundle. This bundle, together with any witness statements; expert evidence or country information evidence included, must comply with Practice Direction (1.11.2024) Part 3, sections 7.1, 7.2, 7.9, 8, 9 and 10.

Parties must ensure they conduct proceedings with procedural rigour. The Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction of 01.11.24.
          `,
        ),
        expect(exui_pages.requestCaseBuildingSubmit.$changeAnswerToQuestionLocator('Explain the direction you are issuing')).toBeVisible(),

        expect(exui_pages.requestCaseBuildingSubmit.$questionLocator('Who are you giving the direction to?')).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$questionValueLocator('Who are you giving the direction to?')).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$questionValueLocator('Who are you giving the direction to?')).toHaveText('Legal representative'),
        expect(exui_pages.requestCaseBuildingSubmit.$changeAnswerToQuestionLocator('Who are you giving the direction to?')).not.toBeAttached(),

        expect(exui_pages.requestCaseBuildingSubmit.$questionLocator('By what date must they comply?')).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$questionValueLocator('By what date must they comply?')).toBeVisible(),
        expect(exui_pages.requestCaseBuildingSubmit.$questionValueLocator('By what date must they comply?')).toHaveText(expectedDate),
        expect(exui_pages.requestCaseBuildingSubmit.$changeAnswerToQuestionLocator('By what date must they comply?')).toBeVisible(),
      ]);
      await exui_pages.requestCaseBuildingSubmit.sendDirection();

      await exui_pages.requestCaseBuildingConfirm.verifyUserIsOnPage();
      await exui_pages.requestCaseBuildingConfirm.verifyAllTextOnPage();
      await exui_pages.requestCaseBuildingConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request case building' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),

        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'Wait for the appellant to submit their built case. If they ask for a time extension, you can respond by changing the due date on the direction.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText('Change the direction due date'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
      ]);
    });
  });
});
