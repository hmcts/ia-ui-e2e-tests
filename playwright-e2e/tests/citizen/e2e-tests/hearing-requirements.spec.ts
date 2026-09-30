import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify user is able to submit answers to hearing requirements via UI', { tag: ['@e2e'] }, () => {
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

  test(
    'Verify user is able to submit response to hearing requirements by taking shortest path',
    { tag: ['@crossBrowser'] },
    async ({ cui_pages }) => {
      await test.step('Provide response to hearing witness section of journey', async () => {
        await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.witnessLink);

        await cui_pages.hearingWitnesses.verifyUserIsOnPage();
        await cui_pages.hearingWitnesses.verifyAllTextOnPage();
        await cui_pages.hearingWitnesses.completePageAndContinue({ doesApplicantHaveAWitness: 'No' });

        await cui_pages.hearingOutsideUK.verifyUserIsOnPage();
        await cui_pages.hearingOutsideUK.verifyAllTextOnPage();
        await cui_pages.hearingOutsideUK.completePageAndContinue({ doesApplicantHaveAWitness: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Provide response to access needs section of journey', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.accessNeedsLink);

        await cui_pages.hearingAccessNeeds.verifyUserIsOnPage();
        await cui_pages.hearingAccessNeeds.verifyAllTextOnPage();
        await cui_pages.hearingAccessNeeds.continueOnToNextPage();

        await cui_pages.hearingInterpreter.verifyUserIsOnPage();
        await cui_pages.hearingInterpreter.verifyAllTextOnPage();
        await cui_pages.hearingInterpreter.completePageAndContinue({ doYouRequireAInterpreterAtHearing: 'No' });

        await cui_pages.hearingStepFreeAccess.verifyUserIsOnPage();
        await cui_pages.hearingStepFreeAccess.verifyAllTextOnPage();
        await cui_pages.hearingStepFreeAccess.completePageAndContinue({ willYouOrWitnessRequireStepFreeAccess: 'No' });

        await cui_pages.hearingLoop.verifyUserIsOnPage();
        await cui_pages.hearingLoop.verifyAllTextOnPage();
        await cui_pages.hearingLoop.completePageAndContinue({ willYouOrWitnessNeedHearingLoop: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Provide response to other needs section of journey', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.otherNeedsLink);

        await cui_pages.hearingOtherNeeds.verifyUserIsOnPage();
        await cui_pages.hearingOtherNeeds.verifyAllTextOnPage();
        await cui_pages.hearingOtherNeeds.continueOnToNextPage();

        await cui_pages.hearingVideoAppointment.verifyUserIsOnPage();
        await cui_pages.hearingVideoAppointment.verifyAllTextOnPage();
        await cui_pages.hearingVideoAppointment.completePageAndContinue({
          areYouAbleToJoinHearingViaVideoCall: 'Yes',
        });

        await cui_pages.hearingMultimediaEvidence.verifyUserIsOnPage();
        await cui_pages.hearingMultimediaEvidence.verifyAllTextOnPage();
        await cui_pages.hearingMultimediaEvidence.completePageAndContinue({ willYouBringVideoOrAudioEvidence: 'No' });

        await cui_pages.hearingSingleSex.verifyUserIsOnPage();
        await cui_pages.hearingSingleSex.verifyAllTextOnPage();
        await cui_pages.hearingSingleSex.completePageAndContinue({ willYouNeedAllFemaleOrMaleHearing: 'No' });

        await cui_pages.hearingPrivate.verifyUserIsOnPage();
        await cui_pages.hearingPrivate.verifyAllTextOnPage();
        await cui_pages.hearingPrivate.completePageAndContinue({ willYouNeedAPrivateHearing: 'No' });

        await cui_pages.hearingPhysicalMentalHealth.verifyUserIsOnPage();
        await cui_pages.hearingPhysicalMentalHealth.verifyAllTextOnPage();
        await cui_pages.hearingPhysicalMentalHealth.completePageAndContinue({
          anyPhysicalOrMentalHealthConditions: 'No',
        });

        await cui_pages.hearingPastExperiences.verifyUserIsOnPage();
        await cui_pages.hearingPastExperiences.verifyAllTextOnPage();
        await cui_pages.hearingPastExperiences.completePageAndContinue({
          anyPastExperienceThatMayAffectHearing: 'No',
        });

        await cui_pages.hearingAnythingElse.verifyUserIsOnPage();
        await cui_pages.hearingAnythingElse.verifyAllTextOnPage();
        await cui_pages.hearingAnythingElse.completePageAndContinue({ needAnythingElse: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Provide response to dates to avoid section of journey', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.datesToAvoidLink);

        await cui_pages.hearingDatesAvoid.verifyUserIsOnPage({ urlPath: 'hearing-dates-avoid' });
        await cui_pages.hearingDatesAvoid.verifyAllTextOnPage();
        await cui_pages.hearingDatesAvoid.completePageAndContinue({ anyDatesToAvoid: 'No' });

        await cui_pages.hearingNeeds.verifyUserIsOnPage();
      });

      await test.step('Verify user is able to see their answers on check your answers page', async () => {
        await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.checkAndSendLink);

        await cui_pages.hearingCheckAnswers.verifyUserIsOnPage();
        await Promise.all([
          // Verify correct number of question and answers
          expect(cui_pages.hearingCheckAnswers.$static.questionLabel).toHaveCount(12),
          ...Array.from({ length: 12 }, (_, i) => expect(cui_pages.hearingCheckAnswers.$static.questionLabel.nth(i)).toBeVisible()),
          expect(cui_pages.hearingCheckAnswers.$static.answerLabel).toHaveCount(12),
          ...Array.from({ length: 12 }, (_, i) => expect(cui_pages.hearingCheckAnswers.$static.answerLabel.nth(i)).toBeVisible()),

          // Verify witness section headings
          expect(cui_pages.hearingCheckAnswers.$static.witnessesHeadingLevel2).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$static.witnessesHeadingLevel3).toBeVisible(),
          // Verify 1st question and answer pair within witness section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willAnyWitnessesComeToHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
          // Verify 2nd question and answer pair within witness section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
          // Verify locator to change answer to both questions is visisble
          expect(cui_pages.hearingCheckAnswers.$interactive.changeAnswerForWillAnyWitnessesComeToHearingLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessAttendOutsideUklink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify access needs section
          expect(cui_pages.hearingCheckAnswers.$static.accessNeedsHeadingLevel2).toBeVisible(),

          // Verify interpreter support section
          expect(cui_pages.hearingCheckAnswers.$static.interpreterHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within interpreter support section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedanInterpreter')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedanInterpreter')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedanInterpreter')).toBeVisible(),
          // Verify locator to change answer to interpreter support section
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedanInterpreterLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify step free access heading
          expect(cui_pages.hearingCheckAnswers.$static.stepFreeAccessHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within step free access section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
          // Verify locator to change answer to step free access question is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessNeedStepFreeAccessLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify hearing loop heading
          expect(cui_pages.hearingCheckAnswers.$static.hearingLoopHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within hearing loop section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
          // Verify locator to change answer to hearing loop question is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessRequireHearingLoopLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify other needs section
          expect(cui_pages.hearingCheckAnswers.$static.otherNeedsLevel2Heading).toBeVisible(),

          // Verify multimedia evidence section
          expect(cui_pages.hearingCheckAnswers.$static.multiMediaEvidenceLevel3Heading).toBeVisible(),
          // Verify question and answer pair within multimedia evidence section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
          // Verify locator to change answer to multimedia evidence question is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouBringVideoOrAudioEvidenceLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify all female or male section
          expect(cui_pages.hearingCheckAnswers.$static.allFemaleOrMaleLevel3Heading).toBeVisible(),
          // Verify question and answer pair within all female or male section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
          // Verify locator to change answer to question within all female or male section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAllFemaleOrMaleHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify private hearing section
          expect(cui_pages.hearingCheckAnswers.$static.privateHearingLevel3Heading).toBeVisible(),
          // Verify question and answer pair within private hearing section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAPrivateHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAPrivateHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAPrivateHearing')).toBeVisible(),
          // Verify locator to change answer to question within private hearing section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAPrivateHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify physical or mental health conditions section
          expect(cui_pages.hearingCheckAnswers.$static.physicalOrMentalHealthLevel3Heading).toBeVisible(),
          // Verify question and answer pair within physical or mental health conditions section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
          // Verify locator to change answer to question within physical or mental health conditions section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeDoYouHaveAnyPhysicalOrMentalHealthConditionsLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify past experience that may affect hearing section
          expect(cui_pages.hearingCheckAnswers.$static.pastExperiencesLevel3Heading).toBeVisible(),
          // Verify question and answer pair within past experience that may affect hearing section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('haveYouHadAnyPastExperiences')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
          // Verify locator to change answer to question within past experience that may affect hearing section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeHaveYouHadAnyPastExperiencesLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify anything else section
          expect(cui_pages.hearingCheckAnswers.$static.anythingElseLevel3Heading).toBeVisible(),
          // Verify question and answer pair within anything else section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
          // Verify locator to change answer to question within anything else section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAnythingElseAtHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify dates to avoid section
          expect(cui_pages.hearingCheckAnswers.$static.datesToAvoidLevel2Heading).toBeVisible(),
          // Verify question and answer pair within dates to avoid section
          expect(cui_pages.hearingCheckAnswers.$questionLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswers.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
          // Verify locator to change answer to question within dates to avoid section is visible
          expect(cui_pages.hearingCheckAnswers.$interactive.changeAreThereAnyDatesYouCannotAttendLink).toBeVisible(),
        ]);
      });

      await test.step('Verify user is able to submit their hearing requirements', async () => {
        await cui_pages.hearingCheckAnswers.submitAnswers();

        await cui_pages.hearingSuccess.verifyUserIsOnPage();
        await cui_pages.hearingSuccess.verifyAllTextOnPage();
      });
    },
  );

  test('Verify user is able to submit response to hearing requirements by taking longest path', async ({ cui_pages, dataUtils }) => {
    const witnessData = await test.step('Provide response to hearing witness section of journey', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

      await cui_pages.hearingNeeds.verifyUserIsOnPage();
      await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.witnessLink);

      await cui_pages.hearingWitnesses.verifyUserIsOnPage();
      await cui_pages.hearingWitnesses.completePageAndContinue({ doesApplicantHaveAWitness: 'Yes' });

      const witnessName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.hearingWitnessNames.verifyUserIsOnPage();
      await cui_pages.hearingWitnessNames.verifyAllTextOnPage();
      await cui_pages.hearingWitnessNames.completePageAndContinue({
        givenNames: witnessName.firstNames[0],
        familyName: witnessName.lastNames[0],
      });

      await cui_pages.hearingOutsideUK.verifyUserIsOnPage();
      await cui_pages.hearingOutsideUK.completePageAndContinue({ doesApplicantHaveAWitness: 'Yes' });

      await cui_pages.hearingNeeds.verifyUserIsOnPage();
      return witnessName;
    });

    await test.step('Provide response to access needs section of journey', async () => {
      await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.accessNeedsLink);

      await cui_pages.hearingAccessNeeds.verifyUserIsOnPage();
      await cui_pages.hearingAccessNeeds.continueOnToNextPage();

      await cui_pages.hearingInterpreterSupportAppellantWitnesses.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterSupportAppellantWitnesses.verifyAllTextOnPage();
      await cui_pages.hearingInterpreterSupportAppellantWitnesses.completePageAndContinue({
        typeOfSupport: 'Interpretor for applicant and witness',
      });

      await cui_pages.hearingInterpreterTypes.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterTypes.verifyAllTextOnPage();
      await cui_pages.hearingInterpreterTypes.completePageAndContinue({
        typeOfInterpretor: 'Spoken and sign language interpretor',
      });

      await cui_pages.hearingInterpreterSpokenLanguageSelection.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterSpokenLanguageSelection.verifyAllTextOnPage();
      await cui_pages.hearingInterpreterSpokenLanguageSelection.completePageAndContinue({
        languageToInterpretPreference: 'Select language from dropdown',
        selectLanguageFromDropdown: 'Mandarin',
      });

      await cui_pages.hearingInterpreterSignLanguageSelection.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterSignLanguageSelection.verifyAllTextOnPage();
      await cui_pages.hearingInterpreterSignLanguageSelection.completePageAndContinue({
        languageToInterpretPreference: 'Select sign language from dropdown',
        selectSignLanguageFromDropdown: 'British Sign Language (BSL)',
      });

      await cui_pages.hearingInterpreterTypesWitness.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterTypesWitness.verifyAllTextOnPage();
      await cui_pages.hearingInterpreterTypesWitness.completePageAndContinue({
        typeOfInterpretor: 'Spoken and sign language interpretor',
      });

      await cui_pages.hearingInterpreterSpokenLanguageSelectionWitness.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterSpokenLanguageSelectionWitness.verifyAllTextOnPage();
      await cui_pages.hearingInterpreterSpokenLanguageSelectionWitness.completePageAndContinue({
        languageToInterpretPreference: 'Select language from dropdown',
        selectLanguageFromDropdown: 'Portuguese',
      });

      await cui_pages.hearingInterpreterSignLanguageSelectionWitness.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterSignLanguageSelectionWitness.verifyAllTextOnPage();
      await cui_pages.hearingInterpreterSignLanguageSelectionWitness.completePageAndContinue({
        languageToInterpretPreference: 'Select sign language from dropdown',
        selectSignLanguageFromDropdown: 'Visual frame signing',
      });

      await cui_pages.hearingStepFreeAccess.verifyUserIsOnPage();
      await cui_pages.hearingStepFreeAccess.completePageAndContinue({ willYouOrWitnessRequireStepFreeAccess: 'Yes' });

      await cui_pages.hearingLoop.verifyUserIsOnPage();
      await cui_pages.hearingLoop.completePageAndContinue({ willYouOrWitnessNeedHearingLoop: 'Yes' });

      await cui_pages.hearingNeeds.verifyUserIsOnPage();
    });

    await test.step('Provide response to other needs section of journey', async () => {
      await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.otherNeedsLink);

      await cui_pages.hearingOtherNeeds.verifyUserIsOnPage();
      await cui_pages.hearingOtherNeeds.continueOnToNextPage();

      await cui_pages.hearingVideoAppointment.verifyUserIsOnPage();
      await cui_pages.hearingVideoAppointment.completePageAndContinue({ areYouAbleToJoinHearingViaVideoCall: 'No' });

      await cui_pages.hearingVideoAppointmentReasons.verifyUserIsOnPage();
      await cui_pages.hearingVideoAppointmentReasons.completePageAndContinue({
        reasonUnableToJoinVideoCall: 'I do not have access to a device that can join a video call',
      });

      await cui_pages.hearingMultimediaEvidence.verifyUserIsOnPage();
      await cui_pages.hearingMultimediaEvidence.completePageAndContinue({ willYouBringVideoOrAudioEvidence: 'Yes' });

      await cui_pages.hearingMultimediaEvidenceEquipment.verifyUserIsOnPage();
      await cui_pages.hearingMultimediaEvidenceEquipment.verifyAllTextOnPage();
      await cui_pages.hearingMultimediaEvidenceEquipment.completePageAndContinue({
        willYouBringEquipmentToPlayEvidence: 'No',
      });

      await cui_pages.hearingMultimediaEvidenceEquipmentReasons.verifyUserIsOnPage();
      await cui_pages.hearingMultimediaEvidenceEquipmentReasons.completePageAndContinue({
        reasonUnableToBringEquipment: 'I do not have access to the equipment needed to play the evidence',
      });

      await cui_pages.hearingSingleSex.verifyUserIsOnPage();
      await cui_pages.hearingSingleSex.completePageAndContinue({ willYouNeedAllFemaleOrMaleHearing: 'Yes' });

      await cui_pages.hearingSingleSexType.verifyUserIsOnPage();
      await cui_pages.hearingSingleSexType.verifyAllTextOnPage();
      await cui_pages.hearingSingleSexType.completePageAndContinue({ typeOfHearing: 'All male' });

      await cui_pages.hearingSingleSexTypeMale.verifyUserIsOnPage();
      await cui_pages.hearingSingleSexTypeMale.completePageAndContinue({
        reasonForAllMaleHearing: 'Test reason for all male hearing.',
      });

      await cui_pages.hearingPrivate.verifyUserIsOnPage();
      await cui_pages.hearingPrivate.completePageAndContinue({ willYouNeedAPrivateHearing: 'Yes' });

      await cui_pages.hearingPrivateReason.verifyUserIsOnPage();
      await cui_pages.hearingPrivateReason.completePageAndContinue({
        reasonForPrivateHearing: 'Test reason for private hearing.',
      });

      await cui_pages.hearingPhysicalMentalHealth.verifyUserIsOnPage();
      await cui_pages.hearingPhysicalMentalHealth.completePageAndContinue({
        anyPhysicalOrMentalHealthConditions: 'Yes',
      });

      await cui_pages.hearingPhysicalMentalHealthReasons.verifyUserIsOnPage();
      await cui_pages.hearingPhysicalMentalHealthReasons.completePageAndContinue({
        howManyPhysicalOrMentalHealthConditions: 'Test reason for physical or mental health condition.',
      });

      await cui_pages.hearingPastExperiences.verifyUserIsOnPage();
      await cui_pages.hearingPastExperiences.completePageAndContinue({
        anyPastExperienceThatMayAffectHearing: 'Yes',
      });

      await cui_pages.hearingPastExperiencesReasons.verifyUserIsOnPage();
      await cui_pages.hearingPastExperiencesReasons.completePageAndContinue({
        howManyPastExpereincesThatMayAffectHearing: 'Test reason for past experience that may affect hearing.',
      });

      await cui_pages.hearingAnythingElse.verifyUserIsOnPage();
      await cui_pages.hearingAnythingElse.completePageAndContinue({ needAnythingElse: 'Yes' });

      await cui_pages.hearingAnythingElseReasons.verifyUserIsOnPage();
      await cui_pages.hearingAnythingElseReasons.completePageAndContinue({
        whatAndWhyYouNeedIt: 'Test reason for anything else.',
      });

      await cui_pages.hearingNeeds.verifyUserIsOnPage();
    });

    const dateToAvoid = await test.step('Provide response to dates to avoid section of journey', async () => {
      await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.datesToAvoidLink);

      await cui_pages.hearingDatesAvoid.verifyUserIsOnPage({ urlPath: 'hearing-dates-avoid' });
      await cui_pages.hearingDatesAvoid.completePageAndContinue({ anyDatesToAvoid: 'Yes' });

      const dateToAvoid = await dataUtils.getDateFromToday({ dayOffset: 10 });
      await cui_pages.hearingDatesAvoidEnter.verifyUserIsOnPage();
      await cui_pages.hearingDatesAvoidEnter.verifyAllTextOnPage();
      await cui_pages.hearingDatesAvoidEnter.completePageAndContinue({
        day: dateToAvoid.day,
        month: dateToAvoid.month,
        year: dateToAvoid.year,
      });

      await cui_pages.hearingDatesAvoidReasons.verifyUserIsOnPage();
      await cui_pages.hearingDatesAvoidReasons.completePageAndContinue({
        reasonForAvoidingDate: 'Test reason for avoiding date.',
      });

      await cui_pages.hearingDatesAvoid.verifyUserIsOnPage({ urlPath: 'hearing-dates-avoid-new' });
      await cui_pages.hearingDatesAvoid.completePageAndContinue({ anyDatesToAvoid: 'No' });

      await cui_pages.hearingNeeds.verifyUserIsOnPage();
      return dateToAvoid.full;
    });

    await test.step('Verify user is able to see their answers on check your answers page', async () => {
      await cui_pages.hearingNeeds.navigationClick(cui_pages.hearingNeeds.$interactive.checkAndSendLink);

      await cui_pages.hearingCheckAnswers.verifyUserIsOnPage();
      await Promise.all([
        // Verify correct number of question and answers
        expect(cui_pages.hearingCheckAnswers.$static.questionLabel).toHaveCount(27),
        ...Array.from({ length: 27 }, (_, i) => expect(cui_pages.hearingCheckAnswers.$static.questionLabel.nth(i)).toBeVisible()),
        expect(cui_pages.hearingCheckAnswers.$static.answerLabel).toHaveCount(27),
        ...Array.from({ length: 27 }, (_, i) => expect(cui_pages.hearingCheckAnswers.$static.answerLabel.nth(i)).toBeVisible()),

        // Verify witness section headings
        expect(cui_pages.hearingCheckAnswers.$static.witnessesHeadingLevel2).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$static.witnessesHeadingLevel3).toBeVisible(),
        // Verify 1st question and answer pair within witness section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willAnyWitnessesComeToHearing')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
        // Verify 2nd question and answer pair within witness section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('witnessesNames')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('witnessesNames')).toHaveText(
          `${witnessData.firstNames[0]} ${witnessData.lastNames[0]}`,
        ),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('witnessesNames')).toBeVisible(),
        // Verify 3rd question and answer pair within witness section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
        // Verify locator to change answer to all 3 questions is visisble
        expect(cui_pages.hearingCheckAnswers.$interactive.changeAnswerForWillAnyWitnessesComeToHearingLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWitnessesNamesLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessAttendOutsideUklink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify access needs section
        expect(cui_pages.hearingCheckAnswers.$static.accessNeedsHeadingLevel2).toBeVisible(),

        // Verify interpreter support section
        expect(cui_pages.hearingCheckAnswers.$static.interpreterHeadingLevel3).toBeVisible(),

        // Verify 1st question and answer pair within acesss needs section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('whoAreYouRequestingInterpreterSupportFor')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whoAreYouRequestingInterpreterSupportFor')).toHaveText(
          'Interpreter support for me personallyInterpreter support for one or more witnesses',
        ),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whoAreYouRequestingInterpreterSupportFor')).toBeVisible(),
        // Verify 2nd question and answer pair within acesss needs section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('whatKindOfInterpreterWillApplicantNeed')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whatKindOfInterpreterWillApplicantNeed')).toHaveText(
          'Spoken language interpreterSign language interpreter',
        ),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whatKindOfInterpreterWillApplicantNeed')).toBeVisible(),
        // Verify 3rd question and answer pair within acesss needs section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('applicantSpokenLanguageRequirement')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('applicantSpokenLanguageRequirement')).toHaveText('Mandarin'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('applicantSpokenLanguageRequirement')).toBeVisible(),
        // Verify 4th question and answer pair within acesss needs section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('applicantSignLanguageRequirement')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('applicantSignLanguageRequirement')).toHaveText('British Sign Language (BSL)'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('applicantSignLanguageRequirement')).toBeVisible(),
        // Verify 5th question and answer pair within acesss needs section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('whatKindOfInterpreterWillWitnessNeed')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whatKindOfInterpreterWillWitnessNeed')).toHaveText(
          'Spoken language interpreterSign language interpreter',
        ),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whatKindOfInterpreterWillWitnessNeed')).toBeVisible(),
        // Verify 6th question and answer pair within acesss needs section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('witnessSpokenLanguageRequirement')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('witnessSpokenLanguageRequirement')).toHaveText('Portuguese'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('witnessSpokenLanguageRequirement')).toBeVisible(),
        // Verify 7th question and answer pair within acesss needs section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('witnessSignLanguageRequirement')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('witnessSignLanguageRequirement')).toHaveText('Visual frame signing'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('witnessSignLanguageRequirement')).toBeVisible(),
        // Verify locator to change answer to all 7 interpreter questions is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWhoAreYouRequestingInterpreterSupportForLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWhatKindOfInterpreterWillApplicantNeedLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeApplicantSpokenLanguageRequirementLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeApplicantSignLanguageRequirementLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWhatKindOfInterpreterWillWitnessNeedLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWitnessSpokenLanguageRequirementLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWitnessSignLanguageRequirementLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify step free access heading
        expect(cui_pages.hearingCheckAnswers.$static.stepFreeAccessHeadingLevel3).toBeVisible(),
        // Verify question and answer pair within step free access section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
        // Verify locator to change answer to step free access question is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessNeedStepFreeAccessLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify hearing loop heading
        expect(cui_pages.hearingCheckAnswers.$static.hearingLoopHeadingLevel3).toBeVisible(),
        // Verify question and answer pair within hearing loop section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
        // Verify locator to change answer to hearing loop question is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouOrWitnessRequireHearingLoopLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify other needs section
        expect(cui_pages.hearingCheckAnswers.$static.otherNeedsLevel2Heading).toBeVisible(),

        // Verify multimedia evidence section
        expect(cui_pages.hearingCheckAnswers.$static.multiMediaEvidenceLevel3Heading).toBeVisible(),
        // Verify 1st question and answer pair within multimedia evidence section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
        // Verify 2nd question and answer pair within multimedia evidence section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouBringEquipmentToPlayEvidence')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringEquipmentToPlayEvidence')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouBringEquipmentToPlayEvidence')).toBeVisible(),
        // Verify 3rd question and answer pair within multimedia evidence section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('whyUnableToBringEquipmentToPlayEvidence')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whyUnableToBringEquipmentToPlayEvidence')).toHaveText(
          'I do not have access to the equipment needed to play the evidence',
        ),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whyUnableToBringEquipmentToPlayEvidence')).toBeVisible(),
        // Verify locator to change answer to all three multimedia evidence questions is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouBringVideoOrAudioEvidenceLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouBringEquipmentToPlayEvidenceLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWhyUnableToBringEquipmentToPlayEvidenceLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify all female or male section
        expect(cui_pages.hearingCheckAnswers.$static.allFemaleOrMaleLevel3Heading).toBeVisible(),
        // Verify 1st question and answer pair within all female or male section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
        // Verify 2nd question and answer pair within all female or male section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('whatTypeOfHearingDoYouNeed')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whatTypeOfHearingDoYouNeed')).toHaveText('All male'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whatTypeOfHearingDoYouNeed')).toBeVisible(),
        // Verify 3rd question and answer pair within all female or male section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('whyYouNeedAllMaleHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whyYouNeedAllMaleHearing')).toHaveText('Test reason for all male hearing.'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whyYouNeedAllMaleHearing')).toBeVisible(),
        // Verify locator to change answer to all three questions within all female or male section is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAllFemaleOrMaleHearingLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWhatTypeOfHearingDoYouNeedLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWhyYouNeedAllMaleHearingLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify private hearing section
        expect(cui_pages.hearingCheckAnswers.$static.privateHearingLevel3Heading).toBeVisible(),
        // Verify 1st question and answer pair within private hearing section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAPrivateHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAPrivateHearing')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAPrivateHearing')).toBeVisible(),
        // Verify 2nd question and answer pair within private hearing section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('whyYouNeedAPrivateHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whyYouNeedAPrivateHearing')).toHaveText('Test reason for private hearing.'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('whyYouNeedAPrivateHearing')).toBeVisible(),
        // Verify locator to change answer to both questions within private hearing section is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAPrivateHearingLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWhyYouNeedAPrivateHearingLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify physical or mental health conditions section
        expect(cui_pages.hearingCheckAnswers.$static.physicalOrMentalHealthLevel3Heading).toBeVisible(),
        // Verify 1st question and answer pair within physical or mental health conditions section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
        // Verify 2nd question and answer pair within physical or mental health conditions section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('howManyPhysicalOrMentalHealthConditionsDoYouHave')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('howManyPhysicalOrMentalHealthConditionsDoYouHave')).toHaveText(
          'Test reason for physical or mental health condition.',
        ),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('howManyPhysicalOrMentalHealthConditionsDoYouHave')).toBeVisible(),
        // Verify locator to change answer to both questions within physical or mental health conditions section is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeDoYouHaveAnyPhysicalOrMentalHealthConditionsLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeHowManyPhysicalOrMentalHealthConditionsDoYouHaveLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify past experience that may affect hearing section
        expect(cui_pages.hearingCheckAnswers.$static.pastExperiencesLevel3Heading).toBeVisible(),
        // Verify 1st question and answer pair within past experience that may affect hearing section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('haveYouHadAnyPastExperiences')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
        // Verify 2nd question and answer pair within past experience that may affect hearing section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('tellUsAboutYourPastExperiences')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('tellUsAboutYourPastExperiences')).toHaveText(
          'Test reason for past experience that may affect hearing.',
        ),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('tellUsAboutYourPastExperiences')).toBeVisible(),
        // Verify locator to change answer to both questions within past experience that may affect hearing section is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeHaveYouHadAnyPastExperiencesLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeTellUsAboutYourPastExperiencesLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify anything else section
        expect(cui_pages.hearingCheckAnswers.$static.anythingElseLevel3Heading).toBeVisible(),
        // Verify 1st question and answer pair within anything else section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
        // Verify 2nd question and answer pair within anything else section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('tellUsWhatAndWhyYouNeedIt')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('tellUsWhatAndWhyYouNeedIt')).toHaveText('Test reason for anything else.'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('tellUsWhatAndWhyYouNeedIt')).toBeVisible(),
        // Verify locator to change answer to both questions within anything else section is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeWillYouNeedAnythingElseAtHearingLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeTellUsWhatAndWhyYouNeedItLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify dates to avoid section
        expect(cui_pages.hearingCheckAnswers.$static.datesToAvoidLevel2Heading).toBeVisible(),
        // Verify 1st question and answer pair within dates to avoid section
        expect(cui_pages.hearingCheckAnswers.$questionLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toHaveText('Yes'),
        expect(cui_pages.hearingCheckAnswers.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
        // Verify 2nd question and answer pair within dates to avoid section
        expect(cui_pages.hearingCheckAnswers.$static.dateLabel).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$static.dateValue).toHaveText(dateToAvoid),
        expect(cui_pages.hearingCheckAnswers.$static.dateValue).toBeVisible(),

        expect(cui_pages.hearingCheckAnswers.$static.dateReasonLabel).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$static.dateReasonValue).toHaveText('Test reason for avoiding date.'),
        expect(cui_pages.hearingCheckAnswers.$static.dateReasonValue).toBeVisible(),
        // Verify locator to change answer to both questions within dates to avoid section is visible
        expect(cui_pages.hearingCheckAnswers.$interactive.changeAreThereAnyDatesYouCannotAttendLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswers.$interactive.changeDateToAvoidLink).toBeVisible(),
      ]);
    });

    await test.step('Verify user is able to submit their hearing requirements', async () => {
      await cui_pages.hearingCheckAnswers.submitAnswers();

      await cui_pages.hearingSuccess.verifyUserIsOnPage();
      await cui_pages.hearingSuccess.verifyAllTextOnPage();
    });
  });
});
