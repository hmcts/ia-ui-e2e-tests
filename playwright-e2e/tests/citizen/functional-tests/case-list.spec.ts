import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify functionality of case list page on citizen ui', { tag: ['@functional'] }, () => {
  test('Verify correct information is displayed on case list page for a draft application', async ({ citizenUser, cui_login, cui_pages }) => {
    await test.step('Create a draft application', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
      await cui_pages.caseList.verifyNoAppealsTextOnPage();
      await cui_pages.caseList.createNewAppeal();
      await cui_pages.appealOverview.verifyUserIsOnPage();
    });

    await test.step('Navigate to case list page', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.backToYourAppealsButton);
      await cui_pages.caseList.verifyUserIsOnPage();
    });

    await test.step('Verify correct information is displayed', async () => {
      await cui_pages.caseList.verifyAppealDetails({
        appealReference: 'DRAFT',
        caseReference: /^\d{16}$/,
        applicantName: `${citizenUser.forename} ${citizenUser.surname}`,
        appealStatus: 'DRAFT',
      });
    });
  });

  test('Verify correct information is displayed on case list page for a submitted application that has not been paid for via fee remission', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_pages,
    exui_caseOfficerApiClient,
  }) => {
    const appealDetails = await test.step('Submit an application via Api that has not been paid for using fee remission', async () => {
      return await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        isUserInTheUk: 'Yes',
        appealType: 'Human Rights',
        isApplicantStateless: false,
        isApplicationInTime: true,
        nationality: 'Sudanese',
        hasApplicantReceivedADeportationOrder: 'No',
        sponsorDetails: {
          doesApplicantHaveASponsor: 'No',
          doesApplicantHaveANonLegalRepSponsor: 'No',
        },
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        whetherApplicantHasToPayAFee: 'I got a fee waiver from the Home Office for my application to stay in the UK',
        appealSubmissionType: 'Non-Pay Appeal',
      });
    });

    await test.step('Login to citizen ui', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Verify correct information is displayed', async () => {
      const caseInformation = await exui_caseOfficerApiClient.searchForACaseList({
        homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString(),
      });
      await cui_pages.caseList.verifyAppealDetails({
        appealReference: caseInformation.appealReference,
        caseReference: caseInformation.caseId,
        applicantName: `${appealDetails.applicantDetails.givenNames.join(' ')} ${appealDetails.applicantDetails.familyName}`,
        appealStatus: 'Payment pending',
      });
    });
  });
});
