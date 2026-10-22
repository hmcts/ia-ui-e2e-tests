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

      //Appellant Interpreter details
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

      await exui_pages.hearingRequirementsSignLanguageInterpreterDetails.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsSignLanguageInterpreterDetails.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsSignLanguageInterpreterDetails.completePageAndContinue({ signLanguage: "British Sign Language (BSL)" });

      //Witness Interpreter details
      await exui_pages.hearingRequirementsInterpreterNeededForWitness.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsInterpreterNeededForWitness.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsInterpreterNeededForWitness.completePageAndContinue({ witnessInterpreterRequired: 'Yes' });

      await exui_pages.hearingRequirementsTypeOfWitnessInterpreter.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsTypeOfWitnessInterpreter.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsTypeOfWitnessInterpreter.completePageAndContinue({ witnessInterpreterTypes: [
        ['spokenLanguageInterpreter', 'signLanguageInterpreter'],
      ]})

      await exui_pages.hearingRequirementsWitnessSpokenLanguageInterpreterDetails.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsWitnessSpokenLanguageInterpreterDetails.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsWitnessSpokenLanguageInterpreterDetails.completePageAndContinue({ spokenLanguage: 'Arabic' });

      await exui_pages.hearingRequirementsWitnessSignLanguageInterpreterDetails.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsWitnessSignLanguageInterpreterDetails.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsWitnessSignLanguageInterpreterDetails.completePageAndContinue({ manualLanguage: 'Test manual language' });
      })

      await exui_pages.hearingRequirementsStepFreeAccess.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsStepFreeAccess.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsStepFreeAccess.completePageAndContinue({ stepFreeAccessRequired: 'No' });

      await exui_pages.hearingRequirementsHearingLoop.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsHearingLoop.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsHearingLoop.completePageAndContinue({ hearingLoopRequired: 'No' });

      await exui_pages.hearingRequirementsAdditionalRequests.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsAdditionalRequests.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsAdditionalRequests.completePageAndContinue();

      await exui_pages.hearingRequirementsVideoHearings.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsVideoHearings.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsVideoHearings.completePageAndContinue({ 
        'remoteVideoCall': 'Yes', 
        'remoteVideoCallDescription': 'Test Remote Video Call details' 
      });

      await exui_pages.hearingRequirementsHealthConditions.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsHealthConditions.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsHealthConditions.completePageAndContinue({ 
        'healthConditionsPresent': 'Yes', 
        'healthConditionsDescription': 'Test Health Conditions Description' 
      });

      await exui_pages.hearingRequirementsPastExperiences.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsPastExperiences.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsPastExperiences.completePageAndContinue({ 
        'pastExperiencesPresent': 'Yes', 
        'pastExperiencesDescription': 'Test Past Experiences Description' 
      });

      await exui_pages.hearingRequirementsMultimediaEvidence.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsMultimediaEvidence.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsMultimediaEvidence.completePageAndContinue({ 
        'multimediaEvidence': 'Yes', 
        'multimediaEvidenceDescription': 'Test Past Experiences Description' 
      });

      await exui_pages.hearingRequirementsSingleSexCourtRequired.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsSingleSexCourtRequired.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsSingleSexCourtRequired.completePageAndContinue({ singleSexCourtRequired: 'Yes' });

      await exui_pages.hearingRequirementsWhichSingleSexCourtRequired.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsWhichSingleSexCourtRequired.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsWhichSingleSexCourtRequired.completePageAndContinue({ 
        'singleSexCourtType': 'All male', 
        'reason': 'Test reason for all-male court' 
      });

      await exui_pages.hearingRequirementsInCameraCourt.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsInCameraCourt.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsInCameraCourt.completePageAndContinue({
        'inCameraCourtRequired': 'Yes',
        'inCameraCourtDescription': 'Test In Caera Court description'
      });

      await exui_pages.hearingRequirementsAdditionalRequestsFinal.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsAdditionalRequestsFinal.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsAdditionalRequestsFinal.completePageAndContinue({
        'additionalRequests': 'Yes',
        'additionalRequestsDescription': 'Test Additional Requests'
      });

      await exui_pages.hearingRequirementsDatesToAvoid.verifyUserIsOnPage();
      await exui_pages.hearingRequirementsDatesToAvoid.verifyAllTextOnPage();
      await exui_pages.hearingRequirementsDatesToAvoid.completePageAndContinue({
        'datesToAvoid': 'Yes',
        'dates': [
          {
            day: '15',
            month: '01',
            year: '2026',
            reason: 'Test date to avoid',
          },
        ],
      });

    });
  });
  