import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/config.utils.js';

test.describe(
  'Set of tests to verify user is able to carry out events on ExUI manage cases to progress the citizen journey to its end',
  { tag: ['@e2e'] },
  () => {
    test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

    test(
      'Verify user is able to progress citizen journey through to appeal being decided by a judge',
      { tag: ['@crossBrowser'] },
      async ({ cui_apiClient, newBrowserContextAndPage, exui_pages, exui_adminOfficerApiClient, dataUtils }) => {
        test.setTimeout(7 * 60 * 1000);

        const appealDetails = await test.step('Citizen Api: Submit a new appeal with fee remission', async () => {
          const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
            appealType: 'EU Settlement Scheme',
            hasApplicantReceivedADeportationOrder: 'No',
            isApplicantStateless: false,
            nationality: 'Sri Lankan',
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

        const caseId = await exui_adminOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });

        const caseOfficerExuiPages =
          await test.step('Case Officer: Select Complete case review from next steps dropdown and submit event', async () => {
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

        await test.step('Case Officer: Select Request respondent review from next steps dropdown and submit event', async () => {
          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request respondent evidence' });

          await caseOfficerExuiPages.requestRespondentEvidence.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentEvidence.continueOnToNextPage();

          await caseOfficerExuiPages.requestRespondentEvidenceSubmit.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentEvidenceSubmit.sendDirection();

          await caseOfficerExuiPages.requestRespondentEvidenceConfirm.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentEvidenceConfirm.returnToCaseDetails();

          await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent evidence' });
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

        await test.step('Case Officer: Refresh application overview page until expected next steps has been shown', async () => {
          await caseOfficerExuiPages.caseOverview.page.bringToFront();
          await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
            expectedText: 'The respondent has submitted their evidence.',
          });
        });

        await test.step('Case Officer: Select Aip - request appeal reasons from next step dropdown and submit event', async () => {
          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'AiP - Request Appeal Reasons' });

          await caseOfficerExuiPages.aipRequestAppealReasons.verifyUserIsOnPage();
          await caseOfficerExuiPages.aipRequestAppealReasons.continueOnToNextPage();

          await caseOfficerExuiPages.aipRequestAppealReasonsSubmit.verifyUserIsOnPage();
          await caseOfficerExuiPages.aipRequestAppealReasonsSubmit.sendDirection();

          await caseOfficerExuiPages.aipRequestAppealReasonsConfirm.verifyUserIsOnPage();
          await caseOfficerExuiPages.aipRequestAppealReasonsConfirm.returnToCaseDetails();

          await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'AiP - Request Appeal Reasons' });
        });

        await test.step('Citizen Api: Submit appeal reasons', async () => {
          await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
            doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
            appealReasons: {
              reasonWhyHomeOfficeDecisionIsWrong: 'The home office decision is wrong test reason ',
              doYouWishToProvideSupportingEvidence: 'No',
            },
            caseId: caseId,
          });
        });

        await test.step('Case Officer: Refresh application overview page until expected next step has been shown', async () => {
          await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
            expectedText: "Review the appellant's case in the appeal tab.",
          });
        });

        await test.step('Case Officer: Select request respondent review from next steps dropdown and submit event', async () => {
          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request respondent review' });

          await caseOfficerExuiPages.requestRespondentReview.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentReview.continueOnToNextPage();

          await caseOfficerExuiPages.requestRespondentReviewSubmit.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentReviewSubmit.sendDirection();

          await caseOfficerExuiPages.requestRespondentReviewConfirm.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentReviewConfirm.returnToCaseDetails();

          await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent review' });
        });

        await test.step('Home Office User: Refresh application overview page until expected next step is shown', async () => {
          await homeOfficeUserExuiPages.caseOverview.page.bringToFront();
          await homeOfficeUserExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
            expectedText: 'The Appeal Skeleton Argument is ready to view in the documents tab.',
          });
        });

        await test.step('Home Office User: Select upload the appeal response from next steps drop down and submit event', async () => {
          await homeOfficeUserExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Upload the appeal response' });

          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseReviewOutcome.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseReviewOutcome.completePageAndContinue({
            appealReviewOutcome: 'Decision maintained',
          });

          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponse.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponse.completePageAndContinue({});

          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmit.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmit.submitEvent();

          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirm.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirm.returnToCaseDetails();

          await homeOfficeUserExuiPages.caseOverview.verifyUserIsOnPage({});
          await homeOfficeUserExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload the appeal response' });
        });

        await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
          await caseOfficerExuiPages.caseOverview.page.bringToFront();
          await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
            expectedText: 'Check the response uploaded by the respondent.',
          });
        });

        await test.step('Case Officer: Select review home office response from next steps dropdown and submit event', async () => {
          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Review Home Office response' });

          await caseOfficerExuiPages.reviewHomeOfficeResponse.verifyUserIsOnPage();
          await caseOfficerExuiPages.reviewHomeOfficeResponse.continueOnToNextPage();

          await caseOfficerExuiPages.reviewHomeOfficeResponseSubmit.verifyUserIsOnPage();
          await caseOfficerExuiPages.reviewHomeOfficeResponseSubmit.submitEvent();

          await caseOfficerExuiPages.reviewHomeOfficeResponseConfirm.verifyUserIsOnPage();
          await caseOfficerExuiPages.reviewHomeOfficeResponseConfirm.returnToCaseDetails();

          await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review Home Office response' });
        });

        await test.step('Case Officer: Select request hearing requirements from next steps dropdown and submit event', async () => {
          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Request hearing requirements' });

          await caseOfficerExuiPages.requestHearingRequirements.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestHearingRequirements.submitEvent();

          await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request hearing requirements' });
        });

        await test.step('Citizen Api: Submit hearing requirements', async () => {
          await cui_apiClient.commpleteAndSubmitHearingRequirementsJourneyViaApi({ pathToTake: 'Minimal Path', caseId: caseId });
        });

        await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
          await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
            expectedText: 'You can view the hearing requirements and any requests for additional adjustments in the Hearing and appointment tab.',
          });
        });

        await test.step('Case Officer: Select review hearing requirements from next steps dropdown and submit event', async () => {
          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Review hearing requirements' });

          await caseOfficerExuiPages.reviewHearingRequirements.verifyUserIsOnPage();
          await caseOfficerExuiPages.reviewHearingRequirements.continueOntoNextPage();

          await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearing.verifyUserIsOnPage();
          await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearing.completePageAndContinue({
            isRemoteHearingAllowed: 'Granted',
            description: 'Granted request for remote hearing',
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
          await caseOfficerExuiPages.reviewHearingRequirementsHearingChannel.completePageAndContinue({ hearingChannel: 'Video' });

          await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloat.verifyUserIsOnPage();
          await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloat.completePageAndContinue({
            isAppealSuitableToFloat: 'Yes',
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
        });

        const adminOfficerExuiPages = await test.step('Admin user: Select list case from next steps dropdown and submit event', async () => {
          const adminOfficerNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'adminOfficer' });
          const adminOfficerExuiPages = await exui_pages.newPageContext({ pageContext: adminOfficerNewBrowserContextAndPage });

          await adminOfficerExuiPages.caseOverview.goTo({ caseId: caseId });

          await adminOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'List the case' });

          await adminOfficerExuiPages.listCase.verifyUserIsOnPage();
          await adminOfficerExuiPages.listCase.completePageAndContinue({
            listingLocation: 'Newport Tribunal Centre - Columbus House',
            remoteHearing: 'Yes',
            dateToSet: 'tomorrow',
            hourToSet: 13,
          });

          await adminOfficerExuiPages.listCaseSubmit.verifyUserIsOnPage();
          await adminOfficerExuiPages.listCaseSubmit.listCase();

          await adminOfficerExuiPages.listCaseConfirm.verifyUserIsOnPage();
          await adminOfficerExuiPages.listCaseConfirm.returnToCaseDetails();

          await adminOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await adminOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'List the case' });

          return adminOfficerExuiPages;
        });

        await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
          await caseOfficerExuiPages.caseOverview.page.bringToFront();
          await caseOfficerExuiPages.caseOverview.refreshPageUntilExpectedTextIsVisible({
            expectedText: 'You must create a case summary for the judge to use at the hearing.',
          });
        });

        await test.step('Case Officer: Select Create case summary from next steps dropdown and submit event', async () => {
          await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Create case summary' });

          await caseOfficerExuiPages.createCaseSummary.verifyUserIsOnPage();
          await caseOfficerExuiPages.createCaseSummary.completePageAndContinue({});

          await caseOfficerExuiPages.createCaseSummarySubmit.verifyUserIsOnPage();
          await caseOfficerExuiPages.createCaseSummarySubmit.uploadDocument();

          await caseOfficerExuiPages.createCaseSummaryConfirm.verifyUserIsOnPage();
          await caseOfficerExuiPages.createCaseSummaryConfirm.returnToCaseDetails();

          await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Create case summary' });
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
  },
);
