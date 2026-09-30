import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe(
  'Set of tests to verify judge user is able to prepare and complete decision and reasons on exui manage cases',
  { tag: ['@functional'] },
  () => {
    test.use({ storageState: config.exuiUsers.judgeUser.sessionFile });

    test.beforeEach(
      async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient, exui_adminOfficerApiClient, dataUtils }) => {
        const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
          const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
            appealType: 'European Economic Area',
            hasApplicantReceivedADeportationOrder: 'No',
            isApplicantStateless: false,
            nationality: 'Slovak',
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

        const caseId = await test.step(`Fetch exui case id via api call`, async () => {
          const caseId = await exui_caseOfficerApiClient.fetchCaseId({
            homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString(),
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

          await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({
            caseId: caseId,
          });

          await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
            doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
            appealReasons: {
              doYouWishToProvideSupportingEvidence: 'No',
              reasonWhyHomeOfficeDecisionIsWrong: 'Test reason why the Home Office decision is wrong',
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

          await cui_apiClient.commpleteAndSubmitHearingRequirementsJourneyViaApi({
            pathToTake: 'Minimal Path',
            caseId: caseId,
          });

          await exui_caseOfficerApiClient.submitReviewHearingRequirementsEvent({
            caseId: caseId,
            isRemoteHearingAllowed: 'Granted',
            grantOrRefuseAnyAdjustmentsRequested: 'Granted',
            isApplicationSuitableToFloat: 'Yes',
            anyAdditionalInstructions: 'Yes',
            hearingType: 'Video',
          });

          const hearingDate = await dataUtils.getDateFromToday({ dayOffset: 1 });
          await exui_adminOfficerApiClient.submitListCaseEvent({
            caseId: caseId,
            hearingDateAndTime: {
              day: hearingDate.day,
              month: hearingDate.month,
              year: hearingDate.year,
            },
            isRemoteHearing: 'No',
          });

          await exui_caseOfficerApiClient.submitCreateCaseSummaryEvent({ caseId: caseId });

          await exui_caseOfficerApiClient.submitGenerateHearingBundleEvent({ caseId: caseId });

          await exui_caseOfficerApiClient.submitDecisionAndReasonsStartedEvent({
            caseId: caseId,
            doYouAgreeWithImmigrationHistory: 'Yes',
            doYouAgreeWithscheduleOfIssuesAgreement: 'Yes',
          });
        });

        await test.step(`Judge user: Navigate to case overview page on exui`, async () => {
          await exui_pages.caseOverview.goTo({ caseId: caseId });
        });
      },
    );

    test('Verify judge user is able to prepare and complete decision and reasons', async ({ exui_pages, dataUtils }) => {
      await test.step('Verify correct next steps are displayed on case overview page', async () => {
        await Promise.all([
          expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText('Prepare the Decision and Reasons document'),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
        ]);
      });

      await test.step('Select Prepare Decision and Reasons from next steps dropdown and submit event', async () => {
        await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Prepare Decision and Reasons' });

        await exui_pages.prepareDecisionAndReasonsAnonymityOrder.verifyUserIsOnPage();
        await exui_pages.prepareDecisionAndReasonsAnonymityOrder.verifyAllTextOnPage();
        await exui_pages.prepareDecisionAndReasonsAnonymityOrder.completePageAndContinue({ anonymityOrderDirection: 'Yes' });

        const AppellantRepresentative = await dataUtils.generateRandomFirstAndLastNames({
          countOfFirstNamesToGenerate: 1,
          countOfLastNamesToGenerate: 1,
        });
        const RespondentRepresentative = await dataUtils.generateRandomFirstAndLastNames({
          countOfFirstNamesToGenerate: 1,
          countOfLastNamesToGenerate: 1,
        });

        await exui_pages.prepareDecisionAndReasonsLegalRepresentatives.verifyUserIsOnPage();
        await exui_pages.prepareDecisionAndReasonsLegalRepresentatives.verifyAllTextOnPage();
        await exui_pages.prepareDecisionAndReasonsLegalRepresentatives.completePageAndContinue({
          appellantRepresentative: `${AppellantRepresentative.firstNames[0]} ${AppellantRepresentative.lastNames[0]}`,
          respondentRepresentative: `${RespondentRepresentative.firstNames[0]} ${RespondentRepresentative.lastNames[0]}`,
        });

        await exui_pages.prepareDecisionAndReasonsSubmit.verifyUserIsOnPage();
        await Promise.all([
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$static.caseRecordHeading).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$static.checkYouAnswersHeading).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$static.checkInformationCarefullyText).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$static.anonymityDirectionHeading).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$static.legalRepresentativesHeading).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$questionLocator('Anonymity direction')).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$questionValueLocator('Anonymity direction')).toHaveText('Yes'),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$changeAnswerToQuestionLocator('Anonymity direction')).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$questionLocator('Legal representative for the appellant')).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$questionValueLocator('Legal representative for the appellant')).toHaveText(
            `${AppellantRepresentative.firstNames[0]} ${AppellantRepresentative.lastNames[0]}`,
          ),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$changeAnswerToQuestionLocator('Legal representative for the appellant')).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$questionLocator('Legal representative for the respondent')).toBeVisible(),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$questionValueLocator('Legal representative for the respondent')).toHaveText(
            `${RespondentRepresentative.firstNames[0]} ${RespondentRepresentative.lastNames[0]}`,
          ),
          expect(exui_pages.prepareDecisionAndReasonsSubmit.$changeAnswerToQuestionLocator('Legal representative for the respondent')).toBeVisible(),
        ]);
        await exui_pages.prepareDecisionAndReasonsSubmit.generateDecisionAndReasons();

        await exui_pages.prepareDecisionAndReasonsConfirm.verifyUserIsOnPage();
        await exui_pages.prepareDecisionAndReasonsConfirm.verifyAllTextOnPage();
        await exui_pages.prepareDecisionAndReasonsConfirm.returnToCaseDetails();
      });

      await test.step('Verify correct next steps are displayed once prepare decision and reasons event has been submitted', async () => {
        await exui_pages.caseOverview.verifyUserIsOnPage({});
        await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Prepare Decision and Reasons' });
        await Promise.all([
          expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText(
            'Go to the Documents tab to download and complete the Decision and Reasons document.',
          ),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText('You should then upload and send the completed document.'),
        ]);
      });

      await test.step('Select Complete decision and reasons from next steps dropdown and submit event', async () => {
        await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Complete decision and reasons' });

        await exui_pages.completeDecisionAndReasons.verifyUserIsOnPage();
        await exui_pages.completeDecisionAndReasons.verifyAllTextOnPage();
        await exui_pages.completeDecisionAndReasons.completePageAndContinue({ decision: 'Allowed' });

        await exui_pages.completeDecisionAndReasonsUploadDecision.verifyUserIsOnPage();
        await exui_pages.completeDecisionAndReasonsUploadDecision.verifyAllTextOnPage();
        await exui_pages.completeDecisionAndReasonsUploadDecision.completePageAndContinue({});

        await exui_pages.completeDecisionAndReasonsSubmit.verifyUserIsOnPage();
        await Promise.all([
          expect(exui_pages.completeDecisionAndReasonsSubmit.$static.caseRecordHeading).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$static.checkYouAnswersHeading).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$static.checkInformationCarefullyText).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$questionLocator('Decision')).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$questionValueLocator('Decision')).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$questionValueLocator('Decision')).toHaveText('Allowed'),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$changeAnswerToQuestionLocator('Decision')).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$questionLocator('Decision and reasons')).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$questionValueLocator('Decision and reasons')).toBeVisible(),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$questionValueLocator('Decision and reasons')).toHaveText('SendDecisionAndReasons.pdf'),
          expect(exui_pages.completeDecisionAndReasonsSubmit.$changeAnswerToQuestionLocator('Decision and reasons')).toBeVisible(),
        ]);
        await exui_pages.completeDecisionAndReasonsSubmit.uploadDecisionAndReasons();

        await exui_pages.completeDecisionAndReasonsConfirm.verifyUserIsOnPage();
        await exui_pages.completeDecisionAndReasonsConfirm.verifyAllTextOnPage();
        await exui_pages.completeDecisionAndReasonsConfirm.returnToCaseDetails();
      });

      await test.step('Verify correct next steps are displayed once complete decision and reasons event has been submitted', async () => {
        await exui_pages.caseOverview.verifyUserIsOnPage({});
        await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Complete decision and reasons' });
        await Promise.all([
          expect(exui_pages.caseOverview.$static.whatHappensNextHeading).toBeVisible(),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph).toBeVisible(),
          expect(exui_pages.caseOverview.$static.whatHappensNextParagraph).toHaveText('No further action required.'),
        ]);
      });
    });
  },
);
