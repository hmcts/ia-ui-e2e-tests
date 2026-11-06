import { test, expect } from '../../../../fixtures.js';

export function sharedLegalRepHearingRequirementsSetup() {
  test.beforeEach(async ({ exui_caseOfficerApiClient, exui_legalRepApiClient, exui_homeOfficeUserApiClient, exui_pages }) => {
    const caseId = await test.step('Legal rep Api: Submit a new appeal', async () => {
      const caseId = await exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
        appealType: 'Deprivation of citizenship',
        isAppellantInUk: 'Yes',
        appellantInUk: {
          isAppellantInDetention: 'No',
        },
        isAppellantStateless: 'No',
        nationality: 'Belgian',
        isApplicationInTime: 'Yes',
        doesApplicantHaveASponsor: 'No',
        hearingType: 'Decision with a hearing',
      });
      return caseId;
    });

    await test.step('Progress the case to allow hearing requirements to be submitted', async () => {
      await exui_caseOfficerApiClient.submitCompleteCaseReviewEvent({ caseId });

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({ caseId: caseId });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test home office bundle upload via api 1',
      });

      await exui_caseOfficerApiClient.submitRequestCaseBuildingEvent({ caseId: caseId });

      await exui_legalRepApiClient.submitBuildYourCaseEvent({
        caseId: caseId,
        appealSkeletonFileDescription: 'Test Appeal Skeleton Argument',
        addAddtionalNewEvidence: 'No',
      });

      await exui_caseOfficerApiClient.submitRequestRespondentReviewEvent({ caseId: caseId });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeAppealResponseEvent({
        caseId: caseId,
        appealReviewOutcome: 'Decision maintained',
      });

      await exui_caseOfficerApiClient.submitRequestResponseReviewEvent({ caseId: caseId });

      await exui_caseOfficerApiClient.submitRequestHearingRequirementsEvent({ caseId: caseId });

      await exui_legalRepApiClient.verifyCaseIsInExpectedState({
        caseId: caseId,
        expectedStateName: 'Submit hearing requirements',
      });
    });

    await test.step('Navigate to case overview page as legal rep', async () => {
      await exui_pages.caseOverview.goTo({ caseId });
    });

    await test.step('Verify correct next steps text is shown before submitting hearing requirements', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          "The appeal is now going to a hearing. You need to submit the appellant's hearing requirements.",
        ),
      ]);
    });
  });
}
