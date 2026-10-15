import { test, expect } from '../../../../fixtures.js';
import { config } from '../../../../utils/config.utils.js';

test.describe('Test to verify legal rep is able to submit build your case event on exui', { tag: ['@e2e'] }, () => {
  test.use({ storageState: config.exuiUsers.legalRepUser.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, exui_legalRepApiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const caseId = await test.step('Legal Rep Api: Submit a new appeal', async () => {
      return await exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
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

      await exui_caseOfficerApiClient.submitRequestCaseBuildingEvent({
        caseId: caseId,
      });

      await exui_legalRepApiClient.verifyCaseIsInExpectedState({
        caseId: caseId,
        expectedStateName: 'Case building',
      });
    });

    await test.step(`Legal Rep: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify legal rep user is able to submit event for building case to allow for the e2e journey to proceed', async ({ exui_pages }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
          'The respondent evidence is now available in the documents tab. You now need to build your case.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText('Build your case'),
      ]);
    });

    await test.step('Select Build your case from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Build your case' });

      await exui_pages.buildCase.verifyUserIsOnPage();
      await exui_pages.buildCase.verifyAllTextOnPage();
      await exui_pages.buildCase.completePageAndContinue({
        appealSkeletonFileDescription: 'Test description for appeal skeleton argument',
        addAddtionalNewEvidence: 'Yes',
        newEvidenceFileDescription: 'Test description for new evidence',
      });

      await exui_pages.buildCaseSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.buildCaseSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$static.checkYouAnswersHeading).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$static.checkInformationCarefullyText).toBeVisible(),

        expect(exui_pages.buildCaseSubmit.$questionLocator('Appeal skeleton argument')).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$questionValueLocator('Appeal skeleton argument')).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$questionValueLocator('Appeal skeleton argument')).toHaveText('Appeal_Skeleton_Argument.pdf'),
        expect(exui_pages.buildCaseSubmit.$changeAnswerToQuestionLocator('Appeal skeleton argument')).toBeVisible(),

        expect(exui_pages.buildCaseSubmit.$questionLocator('Describe the document')).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$questionValueLocator('Describe the document')).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$questionValueLocator('Describe the document')).toHaveText('Test description for appeal skeleton argument'),
        expect(exui_pages.buildCaseSubmit.$changeAnswerToQuestionLocator('Describe the document')).toBeVisible(),

        expect(exui_pages.buildCaseSubmit.$questionLocator('Evidence')).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$questionValueLocator('Evidence').nth(0)).toBeVisible(),
        expect(exui_pages.buildCaseSubmit.$questionValueLocator('Evidence').nth(0)).toHaveText(
          `
          Evidence 1
          Document
          New_Evidence.pdf
          Describe the document
          Test description for new evidence
          `,
          { useInnerText: true },
        ),
        expect(exui_pages.buildCaseSubmit.$changeAnswerToQuestionLocator('Evidence')).toBeVisible(),
      ]);

      await exui_pages.buildCaseSubmit.submitCase();

      await exui_pages.buildCaseConfirm.verifyUserIsOnPage();
      await exui_pages.buildCaseConfirm.verifyAllTextOnPage();
      await exui_pages.buildCaseConfirm.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Build your case' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          "Your case is now under review. You'll get an email telling you what happens next.",
        ),
      ]);
    });
  });
});
