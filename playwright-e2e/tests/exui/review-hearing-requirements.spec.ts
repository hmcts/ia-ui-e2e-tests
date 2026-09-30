import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to review hearing requirements on exui manage cases', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Tanzanian',
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
      const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });
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
        pathToTake: 'Maximum Path',
        caseId: caseId,
      });
    });

    await test.step(`Case Officer: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });
  });

  test('Verify case officer is able to review hearing requirements', async ({ exui_pages, cui_apiClient }) => {
    const hearingRequirementDetails = await cui_apiClient.getHearingRequirementDetails();

    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toContainText(
          'You can view the hearing requirements and any requests for additional adjustments in the Hearing and appointment tab.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toContainText(
          'If you need more information, direct the appellant to answer clarifying questions.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toContainText(
          'If you do not need more information, review and record the hearing requirements and any additional adjustments.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });

    await test.step('Select review hearing requirements from next steps dropdown and verify details of review hearing requirements page', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Review hearing requirements' });

      await exui_pages.reviewHearingRequirements.verifyUserIsOnPage();

      await expect(async () => {
        await Promise.all([
          expect(exui_pages.reviewHearingRequirements.$questionLocator('willTheAppellantAttendTheHearing')).toBeHidden(),
          expect(exui_pages.reviewHearingRequirements.$questionValueLocator('willTheAppellantAttendTheHearing')).toBeHidden(),

          expect(exui_pages.reviewHearingRequirements.$questionLocator('willAppellantGiveOralEvidence')).toBeHidden(),
          expect(exui_pages.reviewHearingRequirements.$questionValueLocator('willAppellantGiveOralEvidence')).toBeHidden(),
        ]);
      }).toFail({ bugId: 'To be raised' });

      await Promise.all([
        expect(exui_pages.reviewHearingRequirements.$static.caseRecordHeading).toBeVisible(),

        expect(exui_pages.reviewHearingRequirements.$static.hearingrequirementsDescription).toHaveText(
          "Review the appellant's hearing requirements and select length of hearing.",
        ),
        expect(exui_pages.reviewHearingRequirements.$static.hearingrequirementsDescription).toBeVisible(),

        expect(exui_pages.reviewHearingRequirements.$questionLocator('willAnyWitnessesAttendTheHearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$questionValueLocator('willAnyWitnessesAttendTheHearing')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirements.$questionLocator('witnessDetails')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$questionValueLocator('witnessDetails')).toHaveText(
          `Name		${hearingRequirementDetails.hearingWitnessFlow.witnessName}`,
        ),

        expect(exui_pages.reviewHearingRequirements.$questionLocator('willApellantOrAnyOneElseGiveOralEvidenceOutsideUk')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$questionValueLocator('willApellantOrAnyOneElseGiveOralEvidenceOutsideUk')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirements.$questionLocator('doYouNeedAnyInterpreterServices')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$questionValueLocator('doYouNeedAnyInterpreterServices')).toHaveText('Yes'),

        exui_pages.reviewHearingRequirements.verifyAppellantAndOrWitnessesInterpreterRequirements({
          appellantSignLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSignInterpretorLanguage,
          appellantSpokenLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSpokenInterpretorLanguage,
          witnessNames: hearingRequirementDetails.hearingWitnessFlow.witnessName,
          witnessSignLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSignInterpretorLanguage,
          witnessSpokenlanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSpokenInterpretorLanguage,
        }),

        expect(exui_pages.reviewHearingRequirements.$questionLocator('willAnyWitnessesRequireInterpreterServices')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$questionValueLocator('willAnyWitnessesRequireInterpreterServices')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirements.$questionLocator('doYouNeedRoomWithStepFreeAccess')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$questionValueLocator('doYouNeedRoomWithStepFreeAccess')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirements.$questionLocator('doYouNeedHearingLoop')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$questionValueLocator('doYouNeedHearingLoop')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirements.$static.listingLengthHeading).toBeVisible(),

        expect(exui_pages.reviewHearingRequirements.$static.listingLengthHoursLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$static.listingLengthHoursLabel).toHaveText('Hours'),

        expect(exui_pages.reviewHearingRequirements.$inputs.listingLengthHoursInput).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$inputs.listingLengthHoursInput).toHaveValue('2'),

        expect(exui_pages.reviewHearingRequirements.$static.listingLengthMinutesLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$static.listingLengthMinutesLabel).toHaveText('Minutes'),

        expect(exui_pages.reviewHearingRequirements.$inputs.listingLengthMinutesInput).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$inputs.listingLengthMinutesInput).toHaveValue('0'),

        expect(exui_pages.reviewHearingRequirements.$static.continueToSeeAddtionalAdjustmentsText).toBeVisible(),
        expect(exui_pages.reviewHearingRequirements.$static.continueToSeeAddtionalAdjustmentsText).toHaveText(
          'Continue to see requests for additional adjustments.',
        ),
      ]);

      await exui_pages.reviewHearingRequirements.continueOntoNextPage();
    });

    await test.step('Verify details of remote hearing page', async () => {
      await exui_pages.reviewHearingRequirementsRemoteHearing.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsRemoteHearing.verifyAllTextAndAnswersOnPage({
        anythingForTribunalToConsider: 'No',
      });
      await exui_pages.reviewHearingRequirementsRemoteHearing.completePageAndContinue({
        isRemoteHearingAllowed: 'Granted',
        description: 'Granted request for remote hearing',
      });
    });

    await test.step('Verify details of personal vulnerabilities page', async () => {
      await exui_pages.reviewHearingRequirementsPersonalVulnerabilities.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsPersonalVulnerabilities.verifyAllTextAndAnswersOnPage({
        doesAppellantHavePhysicalOrMentalHealthIssues: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.howManyPhysicalOrMentalHealthConditions,
      });
      await exui_pages.reviewHearingRequirementsPersonalVulnerabilities.completePageAndContinue({
        isVulnerabilitiesAllowed: 'Granted',
        description: 'Granted request for vulnerabilities',
      });
    });

    await test.step('Verify details of multi media evidence page', async () => {
      await exui_pages.reviewHearingRequirementsMultimediaEvidence.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsMultimediaEvidence.verifyAllTextAndAnswersOnPage({
        doYouHaveMultimediaEvidence: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonUnableToBringEquipment,
      });
      await exui_pages.reviewHearingRequirementsMultimediaEvidence.completePageAndContinue({
        isMultimediaAllowed: 'Granted',
        description: 'Granted request for multimedia evidence',
      });
    });

    await test.step('Verify details of single sex court page', async () => {
      await exui_pages.reviewHearingRequirementsSingleSexCourt.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsSingleSexCourt.verifyAllTextAndAnswersOnPage({
        doesAppellantNeedSingleSexCourt: 'Yes',
        typeOfCourt: hearingRequirementDetails.hearingOtherNeedsFlow.allMaleOrFemaleHearing!,
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonForSingleSexHearing,
      });
      await exui_pages.reviewHearingRequirementsSingleSexCourt.completePageAndContinue({
        isSingleSexCourtAllowed: 'Granted',
        description: 'Granted request for single sex court',
      });
    });

    await test.step('Verify details of in camera court page', async () => {
      await exui_pages.reviewHearingRequirementsInCameraCourt.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsInCameraCourt.verifyAllTextAndAnswersOnPage({
        doesAppellantNeedInCameraCourt: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonForPrivateHearing,
      });
      await exui_pages.reviewHearingRequirementsInCameraCourt.completePageAndContinue({
        isInCameraCourtAllowed: 'Granted',
        description: 'Granted request for in camera court',
      });
    });

    await test.step('Verify details of addtional requirements page', async () => {
      await exui_pages.reviewHearingRequirementsAddtionalRequirements.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsAddtionalRequirements.verifyAllTextAndAnswersOnPage({
        wouldYouLikeToRequestAddtionalRequirements: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.needAnythingElseDetails,
      });
      await exui_pages.reviewHearingRequirementsAddtionalRequirements.completePageAndContinue({
        isAdditionalAdjustmentAllowed: 'Granted',
        description: 'Granted request for additional requirements',
      });
    });

    await test.step('Verify details of hearing channel page', async () => {
      await exui_pages.reviewHearingRequirementsHearingChannel.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsHearingChannel.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsHearingChannel.completePageAndContinue({ hearingChannel: 'Video' });
    });

    await test.step('Verify details of appeal suitable to float page', async () => {
      await exui_pages.reviewHearingRequirementsAppealSuitableToFloat.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsAppealSuitableToFloat.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsAppealSuitableToFloat.completePageAndContinue({
        isAppealSuitableToFloat: 'Yes',
      });
    });

    await test.step('Verify details of addtional instructions page', async () => {
      await exui_pages.reviewHearingRequirementsAdditionalIntructions.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsAdditionalIntructions.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsAdditionalIntructions.completePageAndContinue({
        anyAddtionalIntructions: 'Yes',
        instruction: 'Please ensure the hearing is listed in a building with step free access',
      });
    });

    await test.step('Verify details of submission page and submit event', async () => {
      await exui_pages.reviewHearingRequirementsSubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.listingLengthTableHeading).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.hoursLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.hoursValue).toHaveText('2'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.hoursValue).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.minutesLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.minutesValue).toHaveText('0'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$static.minutesValue).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Listing length')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Listing length')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Remote hearing decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Remote hearing decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Remote hearing decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Remote hearing decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Remote hearing decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Remote hearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Remote hearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Remote hearing')).toHaveText('Granted request for remote hearing'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Remote hearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Remote hearing')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Vulnerabilities decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Vulnerabilities decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Vulnerabilities decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Vulnerabilities decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Vulnerabilities decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Adjustments to accommodate vulnerabilities')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Adjustments to accommodate vulnerabilities')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Adjustments to accommodate vulnerabilities')).toHaveText(
          'Granted request for vulnerabilities',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Adjustments to accommodate vulnerabilities')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Adjustments to accommodate vulnerabilities')).toHaveText(
          'Change',
        ),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Multimedia decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Multimedia decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Multimedia decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Multimedia decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Multimedia decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Multimedia equipment')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Multimedia equipment')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Multimedia equipment')).toHaveText(
          'Granted request for multimedia evidence',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Multimedia equipment')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Multimedia equipment')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Single-sex court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Single-sex court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Single-sex court decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Single-sex court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Single-sex court decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Single-sex court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Single-sex court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Single-sex court')).toHaveText(
          'Granted request for single sex court',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Single-sex court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Single-sex court')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('In camera court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('In camera court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('In camera court decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('In camera court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('In camera court decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('In camera court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('In camera court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('In camera court')).toHaveText('Granted request for in camera court'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('In camera court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('In camera court')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Other adjustments decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Other adjustments decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Other adjustments decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Other adjustments decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Other adjustments decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Other adjustments')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Other adjustments')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Other adjustments')).toHaveText(
          'Granted request for additional requirements',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Other adjustments')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Other adjustments')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('What type of hearing is required?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('What type of hearing is required?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('What type of hearing is required?')).toHaveText('Video'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('What type of hearing is required?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('What type of hearing is required?')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Is the appeal suitable to float?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Is the appeal suitable to float?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Is the appeal suitable to float?')).toHaveText('Yes'),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Is the appeal suitable to float?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Is the appeal suitable to float?')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Are there any additional instructions for the hearing?')).toBeVisible(),
        expect(
          exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Are there any additional instructions for the hearing?'),
        ).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Are there any additional instructions for the hearing?')).toHaveText(
          'Yes',
        ),
        expect(
          exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Are there any additional instructions for the hearing?'),
        ).toBeVisible(),
        expect(
          exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Are there any additional instructions for the hearing?'),
        ).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmit.$questionLocator('Additional Instructions')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Additional Instructions')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$questionValueLocator('Additional Instructions')).toHaveText(
          'Please ensure the hearing is listed in a building with step free access',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Additional Instructions')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmit.$changeAnswerToQuestionLocator('Additional Instructions')).toHaveText('Change'),
      ]);

      /*       await exui_pages.reviewHearingRequirementsSubmit.submitEvent();

      await exui_pages.reviewHearingRequirementsConfirm.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsConfirm.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsConfirm.returnToCaseDetails(); */
    });

    /*     await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review hearing requirements' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.whatHappensNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toContainText(
          'The agreed hearing requirements and adjustments have been recorded.',
        ),
        expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toContainText('The listing team will now list the case.'),
        expect(exui_pages.caseOverview.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
      ]);
    }); */
  });
});
