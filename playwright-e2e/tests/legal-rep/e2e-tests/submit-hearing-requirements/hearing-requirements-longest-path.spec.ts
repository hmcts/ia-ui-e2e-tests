import { expect, test } from '../../../../fixtures.js';
import { config } from '../../../../utils/config.utils.js';

test.describe('Set of tests to verify Legal Representative is able to submit hearing requirements via EXUI', { tag: ['@e2e'] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ exui_caseOfficerApiClient, exui_legalRepApiClient, exui_homeOfficeUserApiClient, exui_pages, page, idam_signInPage }) => {
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
    });

    await exui_caseOfficerApiClient.submitRequestRespondentReviewEvent({ caseId: caseId });

    await exui_homeOfficeUserApiClient.submitUploadHomeOfficeAppealResponseEvent({
      caseId: caseId,
      appealReviewOutcome: 'Decision maintained',
    })

    await exui_caseOfficerApiClient.submitRequestResponseReviewEvent({ caseId: caseId });

    await exui_caseOfficerApiClient.submitRequestHearingRequirementsEvent({ caseId: caseId });

    await test.step('Log in to EXUI as the legal representative', async () => {
      await page.goto(config.urls.exuiDefaultUrl);
      await idam_signInPage.exuiSignIn(config.exuiUsers.legalRepUser.username, config.exuiUsers.legalRepUser.password);
      await expect(page.getByRole('heading', { name: 'Case list' })).toBeVisible({ timeout: 60_000 });
    });

    await exui_pages.caseOverview.goTo({ caseId });
  });

  test('submits hearing requirements', async ({ exui_pages }) => {
    await test.step('Open the submit hearing requirements event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Submit hearing requirements' });
      
      await exui_pages.submitHearingRequirements.verifyUserIsOnPage();
      await exui_pages.submitHearingRequirements.verifyAllTextOnPage();
      await exui_pages.submitHearingRequirements.continueOntoNextPage();

      await exui_pages.hearingRequirementsAttendance.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsAttendance.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsAttendance.completePageAndContinue({ appellantAttendingTheHearing: 'Yes' });

      await exui_pages.hearingRequirementsOralEvidence.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsOralEvidence.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsOralEvidence.completePageAndContinue({ appellantGivingOralEvidence: 'Yes' });

      await exui_pages.submitHearingRequirementsWitness.verifyUserIsOnPage();
      await exui_pages.submitHearingRequirementsWitness.verifyAllTextOnPage();
      await exui_pages.submitHearingRequirementsWitness.completePageAndContinue({
        witnessesAttending: 'Yes',
        witness: {
          givenNames: 'Test Witness',
          familyName: '1',
        },
      });

      await exui_pages.hearingRequirementsOralEvidenceOutsideUk.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsOralEvidenceOutsideUk.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsOralEvidenceOutsideUk.completePageAndContinue({ evidenceFromOutsideUk: 'Yes' });

      await exui_pages.hearingRequirementsInterpreterNeeded.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsInterpreterNeeded.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsInterpreterNeeded.completePageAndContinue({ interpreterServicesNeeded: 'Yes' });

      await exui_pages.hearingRequirementsTypeOfInterpreter.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsTypeOfInterpreter.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsTypeOfInterpreter.completePageAndContinue({
        interpreterTypes: ['signLanguageInterpreter', 'spokenLanguageInterpreter'],
      });

      await exui_pages.hearingRequirementsSpokenLanguageInterpreterDetails.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsSpokenLanguageInterpreterDetails.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsSpokenLanguageInterpreterDetails.completePageAndContinue({ manualLanguage: 'Portuguese' });

    });
  });
});