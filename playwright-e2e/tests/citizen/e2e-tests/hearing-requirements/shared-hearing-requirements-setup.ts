import { test } from '../../../../fixtures.js';

export function sharedHearingRequirementsSetup() {
  test.beforeEach(async ({ citizenUser, cui_login, cui_apiClient, exui_caseOfficerApiClient, exui_homeOfficeUserApiClient, cui_pages }) => {
    const detailsOfNewAppeal = await test.step('Submit a new appeal via Api', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Bolivian',
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

    const caseId = await exui_caseOfficerApiClient.fetchCaseId({
      homeOfficeReferenceNumber: detailsOfNewAppeal.homeOfficeReference.toString(),
    });

    await test.step('Progress journey via citizen and exui api calls in order to allow appellant to submit their hearing requirements', async () => {
      await exui_caseOfficerApiClient.submitCompleteCaseReviewEvent({ caseId: caseId });

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({ caseId: caseId });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test home office bundle upload via api 1',
      });

      await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({ caseId: caseId });

      await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
        doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
        appealReasons: {
          reasonWhyHomeOfficeDecisionIsWrong: 'Test reason why Home Office decision is wrong',
          doYouWishToProvideSupportingEvidence: 'No',
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
    });

    await test.step('Verify application is in the correct state to submit hearing requirements before logging in', async () => {
      await cui_apiClient.verifyAppealIsInExpectedStateViaAppealOverviewApi({
        expectedTextToBeOnAppealOverview: 'Your appeal is going to hearing',
        caseId: caseId,
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Navigate to appeal overview page', async () => {
      await cui_pages.caseList.viewExistingApplication({ searchTerm: caseId });
      await cui_pages.appealOverview.verifyUserIsOnPage();
    });
  });
}
