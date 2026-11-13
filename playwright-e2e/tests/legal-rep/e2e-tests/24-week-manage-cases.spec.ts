import { LegalRepApiClient } from '../../../api-requests/exui/legal-rep-api-client.js';
import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/config.utils.js';

test.describe('Verify a legal representative can submit an appeal and access it in ExUI', { tag: ['@e2e'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test(
    'Verify user can submit a new appeal and open its case in ExUI',
    { tag: ['@crossBrowser'] },
    async ({ exui_pages, newBrowserContextAndPage, exui_adminOfficerApiClient, exui_legalRepApiClient, exui_caseOfficerApiClient }) => {
      test.setTimeout(7 * 60 * 1000);

      const caseId = await test.step('Submit a new appeal', async () => {
        return exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
          appealType: 'Deprivation of citizenship',
          isAppellantInUk: 'Yes',
          appellantInUk: {
            isAppellantInDetention: 'No',
          },
          isAppellantStateless: 'No',
          nationality: 'Spanish',
          isApplicationInTime: 'Yes',
          doesApplicantHaveASponsor: 'No',
          hearingType: 'Decision with a hearing',
        });
      });

      await test.step('Add 24 week flag for e2e test and go to case overview page', async () => {
        await exui_caseOfficerApiClient.submitAddStatutoryTimeFrameEvent({
          caseId: caseId,
          reasonForAddingStatutoryTimeFrame: 'Adding 24 week flag for e2e test',
        });
        await exui_pages.caseOverview.goTo({ caseId });
        await exui_pages.caseOverview.verifyUserIsOnPage({});
        await expect(exui_pages.caseOverview.$static.stfFlag).toBeVisible();
      });

      const caseOfficerExuiPages =
        await test.step('Case officer: Select complete case review from next steps dropdown and submit event', async () => {
          const caseOfficerExuiPages = exui_pages;
          await caseOfficerExuiPages.caseOverview.goTo({ caseId: caseId });

          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Complete case review' });

          await caseOfficerExuiPages.completeCaseReview.verifyUserIsOnPage();
          await caseOfficerExuiPages.completeCaseReview.submitEvent();

          await caseOfficerExuiPages.completeCaseReviewConfirm.verifyUserIsOnPage();
          await caseOfficerExuiPages.completeCaseReviewConfirm.returnToCaseDetails();

          await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Complete case review' });

          return caseOfficerExuiPages;
        });

      const adminOfficerExuiPages = await test.step('Admin user: Lists case using next step dropdown', async () => {
        const adminOfficerNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'adminOfficer' });
        const adminOfficerExuiPages = await exui_pages.newPageContext({ pageContext: adminOfficerNewBrowserContextAndPage });

        await adminOfficerExuiPages.caseOverview.goTo({ caseId: caseId });

        await adminOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'List the case' });

        await adminOfficerExuiPages.listCase.verifyUserIsOnPage();
        await adminOfficerExuiPages.listCase.completePageAndContinue({
          listingLocation: 'Newport Tribunal Centre - Columbus House',
          remoteHearing: 'Yes',
          listingLengthHours: 0,
          listingLengthMinutes: 30,
          dateToSet: 'tomorrow',
          hourToSet: 13,
        });

        await adminOfficerExuiPages.listCaseListCaseRequirements24Week.verifyUserIsOnPage();
        await adminOfficerExuiPages.listCaseListCaseRequirements24Week.verifyAllTextOnPage();
        await adminOfficerExuiPages.listCaseListCaseRequirements24Week.completePageAndContinue();

        await adminOfficerExuiPages.listCaseSubmit.listCase();
        await adminOfficerExuiPages.listCaseConfirm.returnToCaseDetails();

        await adminOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
        await adminOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'List the case' });

        await test.step('Admin: Request respondent evidence using next steps dropdown after case is listed', async () => {
          await adminOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request respondent evidence' });

          await adminOfficerExuiPages.requestRespondentEvidence.verifyUserIsOnPage();
          await adminOfficerExuiPages.requestRespondentEvidence.continueOnToNextPage();

          await adminOfficerExuiPages.requestRespondentEvidenceSubmit.verifyUserIsOnPage();
          await adminOfficerExuiPages.requestRespondentEvidenceSubmit.sendDirection();

          await adminOfficerExuiPages.requestRespondentEvidenceConfirm.returnToCaseDetails();

          await adminOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent evidence' });
        });

        return adminOfficerExuiPages;
      });

      const homeOfficeUserExuiPages =
        await test.step('Home Office User: Select upload home office bundle from next steps dropdown and submit event', async () => {
          const homeOfficeUserNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'homeOfficeUser' });
          const homeOfficeUserExuiPages = await exui_pages.newPageContext({ pageContext: homeOfficeUserNewBrowserContextAndPage });

          await homeOfficeUserExuiPages.caseOverview.goTo({ caseId: caseId });

          await homeOfficeUserExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Upload Home Office bundle' });

          await homeOfficeUserExuiPages.uploadHomeOfficeBundle.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeBundle.completePageAndContinue({ description: 'Test upload of Home Office bundle' });

          await homeOfficeUserExuiPages.uploadHomeOfficeBundleSubmit.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeBundleSubmit.submitEvent();

          await homeOfficeUserExuiPages.uploadHomeOfficeBundleConfirm.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeBundleConfirm.returnToCaseDetails();

          await homeOfficeUserExuiPages.caseOverview.verifyUserIsOnPage({});
          await homeOfficeUserExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload Home Office bundle' });

          return homeOfficeUserExuiPages;
        });

      await test.step('Case Officer: Request case building', async () => {
        await caseOfficerExuiPages.caseOverview.page.bringToFront();
        await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
          expectedText: `
            The respondent has submitted their evidence.
            If it complies with the procedure rules and practice directions, direct the legal representative to build their case.
            If it does not comply, direct the respondent to make the appropriate changes.
          `,
        });

        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request case building' });

        await caseOfficerExuiPages.requestCaseBuilding.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestCaseBuilding.completePageAndContinue();

        await caseOfficerExuiPages.requestCaseBuildingSubmit.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestCaseBuildingSubmit.sendDirection();

        await caseOfficerExuiPages.requestCaseBuildingConfirm.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestCaseBuildingConfirm.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request case building' });
      });

      await test.step('Legal rep: Submits built case', async () => {
        await test.step('Legal rep: Submits built case', async () => {
          const legalRepNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'legalRepUser' });
          const legalRepExuiPages = await exui_pages.newPageContext({ pageContext: legalRepNewBrowserContextAndPage });

          await legalRepExuiPages.caseOverview.goTo({ caseId: caseId });

          await legalRepExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Build your case' });

          await legalRepExuiPages.buildCase.verifyUserIsOnPage();
          await legalRepExuiPages.buildCase.completePageAndContinue({
            appealSkeletonFileDescription: '24 week test argument',
            addAddtionalNewEvidence: 'No',
          });

          await legalRepExuiPages.buildCaseSubmit.verifyUserIsOnPage();
          await legalRepExuiPages.buildCaseSubmit.submitCase();

          await legalRepExuiPages.buildCaseConfirm.verifyUserIsOnPage();
          await legalRepExuiPages.buildCaseConfirm.returnToCaseDetails();

          await legalRepExuiPages.caseOverview.verifyUserIsOnPage({});
          await legalRepExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Build your case' });
        });
      });

      await test.step('Case Officer: Request hearing requirements', async () => {
        await caseOfficerExuiPages.caseOverview.page.bringToFront();
        await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
          expectedText: `
            The appellant has submitted their built case. You must now check the case. If it complies with the procedure rules and practice directions, send it to the Appellant/Legal Rep to request hearing requirements.
            Request hearing requirements
            If the appellant needs to make any changes, you can direct them to edit the case.
            Request case edit
          `,
        });

        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request hearing requirements' });

        await caseOfficerExuiPages.requestHearingRequirements.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestHearingRequirements.submitEvent();

        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request hearing requirements' });

        return caseOfficerExuiPages;
      });

      await test.step('Legal rep: Submits hearing requirements', async () => {
        const legalRepNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'legalRepUser' });
        const legalRepExuiPages = await exui_pages.newPageContext({ pageContext: legalRepNewBrowserContextAndPage });

        await legalRepExuiPages.caseOverview.goTo({ caseId: caseId });

        await legalRepExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Submit hearing requirements' });

        await legalRepExuiPages.draftHearingRequirementsDraftHearingRequirements.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsDraftHearingRequirements.continueOntoNextPage();

        await legalRepExuiPages.draftHearingRequirementsAttendTheHearing.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsAttendTheHearing.completePageAndContinue({ appellantAttendingTheHearing: 'No' });

        await legalRepExuiPages.draftHearingRequirementsOralEvidence.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsOralEvidence.completePageAndContinue({ appellantGivingOralEvidence: 'No' });

        await legalRepExuiPages.draftHearingRequirementsIsWitnessesAttending.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsIsWitnessesAttending.completePageAndContinue({ witnessesAttending: 'No' });

        await legalRepExuiPages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsIsEvidenceFromOutsideUkInCountry.completePageAndContinue({ evidenceFromOutsideUk: 'No' });

        await legalRepExuiPages.draftHearingRequirementsInterpreterNeeded.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsInterpreterNeeded.completePageAndContinue({ interpreterServicesNeeded: 'No' });

        await legalRepExuiPages.draftHearingRequirementsIsHearingRoomNeeded.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsIsHearingRoomNeeded.completePageAndContinue({ stepFreeAccessRequired: 'Yes' });

        await legalRepExuiPages.draftHearingRequirementsIsHearingLoopNeeded.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsIsHearingLoopNeeded.completePageAndContinue({ hearingLoopRequired: 'No' });

        await legalRepExuiPages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsSubmitHearingRequirementsAdditionalRequests.completePageAndContinue();

        await legalRepExuiPages.draftHearingRequirementsRemoteVideoCall.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsRemoteVideoCall.completePageAndContinue({
          remoteVideoCall: 'Yes',
          remoteVideoCallDescription: 'Test Remote Video Call details',
        });

        await legalRepExuiPages.draftHearingRequirementsPhysicalOrMentalHealthIssues.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsPhysicalOrMentalHealthIssues.completePageAndContinue({ healthConditionsPresent: 'No' });

        await legalRepExuiPages.draftHearingRequirementsPastExperiences.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsPastExperiences.completePageAndContinue({ pastExperiencesPresent: 'No' });

        await legalRepExuiPages.draftHearingRequirementsMultimediaEvidence.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsMultimediaEvidence.completePageAndContinue({ multimediaEvidence: 'No' });

        await legalRepExuiPages.draftHearingRequirementsSingleSexCourtRequired.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsSingleSexCourtRequired.completePageAndContinue({ singleSexCourtRequired: 'No' });

        await legalRepExuiPages.draftHearingRequirementsInCameraCourt.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsInCameraCourt.completePageAndContinue({ inCameraCourtRequired: 'No' });

        await legalRepExuiPages.hearingRequirementsAdditionalRequestsFinal.verifyUserIsOnPage();
        await legalRepExuiPages.hearingRequirementsAdditionalRequestsFinal.completePageAndContinue({ additionalRequests: 'No' });

        await legalRepExuiPages.draftHearingRequirementsSubmit.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsSubmit.submit();

        await legalRepExuiPages.draftHearingRequirementsConfirm.verifyUserIsOnPage();
        await legalRepExuiPages.draftHearingRequirementsConfirm.returnToCaseDetails();

        await legalRepExuiPages.caseOverview.verifyUserIsOnPage({});
        await legalRepExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Submit hearing requirements' });

        return legalRepExuiPages;
      });

      await test.step('Case Officer: Request hearing requirements', async () => {
        await caseOfficerExuiPages.caseOverview.page.bringToFront();
        await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
          expectedText: `
            You can view the hearing requirements and any requests for additional adjustments in the Hearing and appointment tab.
          `,
        });

        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Review hearing requirements' });

        await caseOfficerExuiPages.reviewHearingRequirements.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirements.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearing.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearing.completePageAndContinue({
          isRemoteHearingAllowed: 'Granted',
          description: 'Remote hearing granted for 24 week case type test',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsPersonalVulnerabilities.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsPersonalVulnerabilities.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsMultimediaEvidence.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsMultimediaEvidence.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsSingleSexCourt.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsSingleSexCourt.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsInCameraCourt.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsInCameraCourt.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsAddtionalRequirements.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAddtionalRequirements.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsHearingChannel.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsHearingChannel.completePageAndContinue({
          hearingChannel: 'Video',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloat.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloat.completePageAndContinue({
          isAppealSuitableToFloat: 'No',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsAdditionalIntructions.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAdditionalIntructions.completePageAndContinue({
          anyAddtionalIntructions: 'No',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsSubmit.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsSubmit.submitEvent();

        await caseOfficerExuiPages.reviewHearingRequirementsConfirm.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsConfirm.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review hearing requirements' });

        return caseOfficerExuiPages;
      });

      await test.step('Case officer: Request respondent review', async () => {
        await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
          expectedText: `
            The hearing requirements have been reviewed and recorded. You must now Request respondent review
          `,
        });
        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request respondent review' });

        await caseOfficerExuiPages.requestRespondentReview.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReview.continueOnToNextPage();

        await caseOfficerExuiPages.requestRespondentReviewSubmit.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewSubmit.sendDirection();

        await caseOfficerExuiPages.requestRespondentReviewConfirm.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewConfirm.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent review' });

        return caseOfficerExuiPages;
      });

      await test.step('Home Office User: Upload respondent review', async () => {
        const homeOfficeUserNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'homeOfficeUser' });
        const homeOfficeUserExuiPages = await exui_pages.newPageContext({ pageContext: homeOfficeUserNewBrowserContextAndPage });

        await homeOfficeUserExuiPages.caseOverview.goTo({ caseId: caseId });

        await homeOfficeUserExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Upload the appeal response' });

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseReviewOutcome.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseReviewOutcome.completePageAndContinue({
          appealReviewOutcome: 'Decision maintained',
        });

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponse.completePageAndContinue({
          description: 'Test Home Office response for 24 week E2E test',
        });

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmit.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmit.submitEvent();

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirm.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirm.returnToCaseDetails();

        await homeOfficeUserExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload the appeal response' });

        return homeOfficeUserExuiPages;
      });

      await test.step('Case officer: Force case - Prepare for hearing', async () => {
        await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
          expectedText: `
            Check the response uploaded by the respondent.
          `,
        });
        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Force case - prepare hearing' });

        await caseOfficerExuiPages.forceCaseToPrepareForHearing.verifyUserIsOnPage();
        await caseOfficerExuiPages.forceCaseToPrepareForHearing.verifyAllTextOnPage();
        await caseOfficerExuiPages.forceCaseToPrepareForHearing.submitEvent();

        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({
          eventSubmitted: 'Force case - prepare hearing',
        });

        return caseOfficerExuiPages;
      });

      await test.step('Case Officer: Create case summary', async () => {
        await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
          expectedText: `
            You must create a case summary for the judge to use at the hearing.
          `,
        });
        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Create case summary' });

        await caseOfficerExuiPages.createCaseSummary.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummary.completePageAndContinue({
          description: 'Case summary for s4 week E2E test',
        });

        await caseOfficerExuiPages.createCaseSummarySubmit.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummarySubmit.uploadDocument();

        await caseOfficerExuiPages.createCaseSummaryConfirm.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummaryConfirm.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({
          eventSubmitted: 'Create case summary',
        });

        return caseOfficerExuiPages;
      });

      await test.step('Case Officer: Select Generate hearing bundle from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Generate hearing bundle' });

        await caseOfficerExuiPages.generateHearingBundle.verifyUserIsOnPage();
        await caseOfficerExuiPages.generateHearingBundle.submitGenerateHearingBundleEvent();

        await caseOfficerExuiPages.generateHearingBundleConfirm.verifyUserIsOnPage();
        await caseOfficerExuiPages.generateHearingBundleConfirm.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Generate hearing bundle' });
      });

      await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
        await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'You can start to create the decision and reasons document.',
          timeoutInSeconds: 90_000,
        });
      });

      await test.step('Case Officer: Select Start decision and reasons from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Start decision and reasons' });

        await caseOfficerExuiPages.startDecisionAndReasons.verifyUserIsOnPage();
        await caseOfficerExuiPages.startDecisionAndReasons.completePageAndContinue({ caseIntroduction: 'This is a test case introduction' });

        await caseOfficerExuiPages.decisionAndReasonsStartedAppellantSummary.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedAppellantSummary.completePageAndContinue({
          appellantCaseSummary: 'This is a test appellant case summary',
        });

        await caseOfficerExuiPages.decisionAndReasonsStartedImmigrationHistory.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedImmigrationHistory.completePageAndContinue({ agreeToImmigrationHistory: 'Yes' });

        await caseOfficerExuiPages.decisionAndReasonsStartedScheduleOfIssues.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedScheduleOfIssues.completePageAndContinue({ agreeToScheduleOfIssues: 'Yes' });

        await caseOfficerExuiPages.decisionAndReasonsStartedSubmit.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedSubmit.saveCase();

        await caseOfficerExuiPages.decisionAndReasonsStartedConfirm.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedConfirm.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Start decision and reasons' });
      });

      const judgeUserExuiPages =
        await test.step('Judge User: Select Prepare Decision and Reasons from next steps dropdown and submit event', async () => {
          const juedgeUserNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'judgeUser' });
          const judgeUserExuiPages = await exui_pages.newPageContext({ pageContext: juedgeUserNewBrowserContextAndPage });

          await judgeUserExuiPages.caseOverview.goTo({ caseId: caseId });

          await judgeUserExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Prepare Decision and Reasons' });

          await judgeUserExuiPages.prepareDecisionAndReasonsAnonymityOrder.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsAnonymityOrder.completePageAndContinue({ anonymityOrderDirection: 'Yes' });

          await judgeUserExuiPages.prepareDecisionAndReasonsLegalRepresentatives.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsLegalRepresentatives.completePageAndContinue();

          await judgeUserExuiPages.prepareDecisionAndReasonsSubmit.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsSubmit.generateDecisionAndReasons();

          await judgeUserExuiPages.prepareDecisionAndReasonsConfirm.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsConfirm.returnToCaseDetails();

          await judgeUserExuiPages.caseOverview.verifyUserIsOnPage({});
          await judgeUserExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Prepare Decision and Reasons' });

          return judgeUserExuiPages;
        });

      await test.step('Judge User: Select Complete decision and reasons from next steps dropdown and submit event', async () => {
        await judgeUserExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Complete decision and reasons' });

        await judgeUserExuiPages.completeDecisionAndReasons.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasons.completePageAndContinue({ decision: 'Allowed' });

        await judgeUserExuiPages.completeDecisionAndReasonsUploadDecision.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsUploadDecision.completePageAndContinue({});

        await judgeUserExuiPages.completeDecisionAndReasonsSubmit.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsSubmit.uploadDecisionAndReasons();

        await judgeUserExuiPages.completeDecisionAndReasonsConfirm.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsConfirm.returnToCaseDetails();

        await judgeUserExuiPages.caseOverview.verifyUserIsOnPage({});
        await judgeUserExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Complete decision and reasons' });
      });
    },
  );
});
