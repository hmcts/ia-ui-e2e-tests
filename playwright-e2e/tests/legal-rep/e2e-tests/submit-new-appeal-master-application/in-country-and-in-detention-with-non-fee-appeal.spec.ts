import { test, expect } from '../../../../fixtures.js';
import { config } from '../../../../utils/config.utils.js';

test.describe('Tests to verify legal rep is able to submit new appeal on exui', { tag: ['@e2e'] }, () => {
  test.use({ storageState: config.exuiUsers.legalRepUser.sessionFile });

  test('Verify legal rep user is able to submit in country appeal whilst in detention that has no sponsor, the appeal is in time for a non fee appeal', async ({
    exui_pages,
    dataUtils,
  }) => {
    await test.step('Navigate to create case page', async () => {
      await exui_pages.createCase.goTo();
      await exui_pages.createCase.verifyAllTextOnPage();
    });

    await test.step('Start creation of new appeal master appeal', async () => {
      await exui_pages.createCase.completePageAndContinue({
        jurisdiction: 'Immigration & Asylum',
        caseType: 'Appeal* master',
      });

      await exui_pages.startAppealOutOfCountry.verifyUserIsOnPage();
    });

    const dynamicTestData = await test.step('Fill in appeal details', async () => {
      await exui_pages.startAppealOutOfCountry.completePageAndContinue({ isAppellantInUk: 'Yes' });

      await exui_pages.startAppealDetention.verifyUserIsOnPage();
      await exui_pages.startAppealDetention.verifyAllTextOnPage();
      await exui_pages.startAppealDetention.completePageAndContinue({ isAppellantInDetention: 'Yes' });

      await exui_pages.startAppealDetentionFacility.verifyUserIsOnPage();
      await exui_pages.startAppealDetentionFacility.verifyAllTextOnPage();
      await exui_pages.startAppealDetentionFacility.completePageAndContinue({ detentionFacility: 'Immigration removal centre' });

      await exui_pages.startAppealIrcName.verifyUserIsOnPage();
      await exui_pages.startAppealIrcName.verifyAllTextOnPage();
      await exui_pages.startAppealIrcName.completePageAndContinue({ ircName: 'Colnbrook' });

      await exui_pages.startAppealAppellantBailApplication.verifyUserIsOnPage();
      await exui_pages.startAppealAppellantBailApplication.verifyAllTextOnPage();
      await exui_pages.startAppealAppellantBailApplication.completePageAndContinue({
        pendingBailApplication: 'Yes',
        bailApplicationNumber: 'AB/01234',
      });

      await exui_pages.startAppealHomeOfficeReferenceNumber.verifyUserIsOnPage();
      await exui_pages.startAppealHomeOfficeReferenceNumber.verifyAllTextOnPage();
      const homeOfficeReferenceNumber = `HOR${await dataUtils.generateRandomNumber({ digitLength: 7 })}`;
      await exui_pages.startAppealHomeOfficeReferenceNumber.completePageAndContinue({ homeOfficeReferenceNumber: homeOfficeReferenceNumber });

      await exui_pages.startAppealAppellantBasicDetails.verifyUserIsOnPage();
      await exui_pages.startAppealAppellantBasicDetails.verifyAllTextOnPage();
      await exui_pages.startAppealAppellantBasicDetails.completePageAndContinue({
        appellantTitle: 'Mr',
        appellantGivenNames: 'John',
        appellantFamilyName: 'Doe',
        appellantDateOfBirth: {
          day: 1,
          month: 1,
          year: 1990,
        },
      });

      await exui_pages.startAppealAppellantNationalities.verifyUserIsOnPage();
      await exui_pages.startAppealAppellantNationalities.verifyAllTextOnPage();
      await exui_pages.startAppealAppellantNationalities.completePageAndContinue({
        nationalityStatus: 'Has a nationality',
        nationality: 'Spanish',
      });

      await exui_pages.startAppealAppealType.verifyUserIsOnPage();
      await exui_pages.startAppealAppealType.verifyAllTextOnPage();
      await exui_pages.startAppealAppealType.completePageAndContinue({
        appealType: 'Deprivation of citizenship',
      });

      await exui_pages.startAppealAppealGroundsDeprivation.verifyUserIsOnPage();
      await exui_pages.startAppealAppealGroundsDeprivation.verifyAllTextOnPage();
      await exui_pages.startAppealAppealGroundsDeprivation.completePageAndContinue({
        groundsForAppeal: [
          'Deprivation would have a disproportionate effect',
          'The decision is unlawful because discretion should have been exercised differently',
        ],
        humanRightsGroundsForAppeal: 'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998',
      });

      await exui_pages.startAppealHomeOfficeDecisionLetter.verifyUserIsOnPage();
      await exui_pages.startAppealHomeOfficeDecisionLetter.verifyAllTextOnPage();
      const InTimeDecisionDate = await dataUtils.getDateFromToday({ dayOffset: -5 });
      await exui_pages.startAppealHomeOfficeDecisionLetter.completePageAndContinue({
        homeOfficeDecisionDate: { day: InTimeDecisionDate.day, month: InTimeDecisionDate.month, year: InTimeDecisionDate.year },
      });

      await exui_pages.startAppealUploadTheNoticeOfDecision.verifyUserIsOnPage();
      await exui_pages.startAppealUploadTheNoticeOfDecision.verifyAllTextOnPage();
      await exui_pages.startAppealUploadTheNoticeOfDecision.completePageAndContinue({ description: 'Test notice of decision file uploaded' });

      await exui_pages.startAppealSponsor.verifyUserIsOnPage();
      await exui_pages.startAppealSponsor.verifyAllTextOnPage();
      await exui_pages.startAppealSponsor.completePageAndContinue({
        hasSponsor: 'No',
      });

      await exui_pages.startAppealDeportationOrder.verifyUserIsOnPage();
      await exui_pages.startAppealDeportationOrder.verifyAllTextOnPage();
      await exui_pages.startAppealDeportationOrder.completePageAndContinue({
        deportationOrder: 'No',
      });

      await exui_pages.startAppealRemovalDirections.verifyUserIsOnPage();
      await exui_pages.startAppealRemovalDirections.verifyAllTextOnPage();
      const RemovalDirectionsDate = await dataUtils.getDateFromToday({ dayOffset: 5 });
      await exui_pages.startAppealRemovalDirections.completePageAndContinue({
        removalDirections: 'Yes',
        removalDirectionsDateTime: {
          day: RemovalDirectionsDate.day,
          month: RemovalDirectionsDate.month,
          year: RemovalDirectionsDate.year,
          hour: 13,
          minute: 15,
          second: 0,
        },
      });

      await exui_pages.startAppealNewMatters.verifyUserIsOnPage();
      await exui_pages.startAppealNewMatters.verifyAllTextOnPage();
      await exui_pages.startAppealNewMatters.completePageAndContinue({
        hasNewMatters: 'No',
      });

      await exui_pages.startAppealHasOtherAppeals.verifyUserIsOnPage();
      await exui_pages.startAppealHasOtherAppeals.verifyAllTextOnPage();
      await exui_pages.startAppealHasOtherAppeals.completePageAndContinue({
        hasOtherAppeals: "I'm not sure",
      });

      await exui_pages.startAppealLegalRepresentativeDetails.verifyUserIsOnPage();
      await exui_pages.startAppealLegalRepresentativeDetails.verifyAllTextOnPage();
      await exui_pages.startAppealLegalRepresentativeDetails.completePageAndContinue({
        legalRepGivenNames: 'John',
        legalRepFamilyName: 'Smith',
        legalRepCompany: 'Test Legal Rep Organisation',
        legalRepMobilePhoneNumber: '07333333333',
        legalRepReferenceNumber: 'Test Legal Rep Reference Number',
      });

      await exui_pages.startAppealRpDcAppealHearingOption.verifyUserIsOnPage();
      await exui_pages.startAppealRpDcAppealHearingOption.verifyAllTextOnPage();
      await exui_pages.startAppealRpDcAppealHearingOption.completePageAndContinue({ appealHearingOption: 'Decision with a hearing' });

      return {
        homeOfficeReferenceNumber: homeOfficeReferenceNumber,
        outOfTimeDecisionDate: {
          day: InTimeDecisionDate.day,
          month: InTimeDecisionDate.month,
          year: InTimeDecisionDate.year,
        },
        removalDirectionsDate: {
          day: RemovalDirectionsDate.day,
          month: RemovalDirectionsDate.month,
          year: RemovalDirectionsDate.year,
        },
      };
    });

    await test.step('Verify correct details are displayed on check your answers page', async () => {
      await exui_pages.startAppealSubmit.verifyUserIsOnPage();
      await expect(exui_pages.startAppealSubmit.$static.checkYouAnswersHeading).toBeVisible();
      await expect(exui_pages.startAppealSubmit.$static.checkInformationCarefullyText).toBeVisible();

      const homeOfficeDecisionDate = new Date(
        dynamicTestData.outOfTimeDecisionDate.year,
        dynamicTestData.outOfTimeDecisionDate.month - 1,
        dynamicTestData.outOfTimeDecisionDate.day,
      );
      const formattedHomeOfficeDecisionDate = homeOfficeDecisionDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).replace('Sept', 'Sep');

      const removalDirectionsDate = new Date(
        dynamicTestData.removalDirectionsDate.year,
        dynamicTestData.removalDirectionsDate.month - 1,
        dynamicTestData.removalDirectionsDate.day,
      );
      const formattedRemovalDirectionsDate = removalDirectionsDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).replace('Sept', 'Sep');

      await Promise.all([
        expect(exui_pages.startAppealSubmit.$questionLocator('Is the appellant currently living in the United Kingdom?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Is the appellant currently living in the United Kingdom?')).toHaveText('Yes'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Is the appellant currently living in the United Kingdom?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Is the appellant currently living in the United Kingdom?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Is the appellant currently in detention?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Is the appellant currently in detention?')).toHaveText('Yes'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Is the appellant currently in detention?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Is the appellant currently in detention?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Detention facility')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Detention facility')).toHaveText('Immigration removal centre'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Detention facility')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Detention facility')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Immigration removal centre name')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Immigration removal centre name')).toHaveText('Colnbrook'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Immigration removal centre name')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Immigration removal centre name')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Does the appellant have a pending bail application?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does the appellant have a pending bail application?')).toHaveText('Yes'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does the appellant have a pending bail application?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Does the appellant have a pending bail application?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator("What is the appellant's bail application number?")).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator("What is the appellant's bail application number?")).toHaveText('AB/01234'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator("What is the appellant's bail application number?")).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator("What is the appellant's bail application number?")).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Home Office UAN or GWF reference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Home Office UAN or GWF reference')).toHaveText(
          dynamicTestData.homeOfficeReferenceNumber,
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Home Office UAN or GWF reference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Home Office UAN or GWF reference')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Title')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Title')).toHaveText('Mr'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Title')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Title')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Given names').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(0)).toHaveText('John'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Given names').nth(0)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Family name').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(0)).toHaveText('Doe'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Family name').nth(0)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Date of birth')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Date of birth')).toHaveText('1 Jan 1990'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Date of birth')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Date of birth')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Nationality').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Nationality').nth(0)).toHaveText('Has a nationality'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Nationality').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Nationality').nth(0)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Nationality').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Nationality').nth(1)).toHaveText(
          `
            Nationality 1
            Nationality
            Spanish
            `,
          { useInnerText: true },
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Nationality').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Nationality').nth(1)).toBeVisible,

        expect(exui_pages.startAppealSubmit.$questionLocator('Type of appeal')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Type of appeal')).toHaveText('Deprivation of citizenship'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Type of appeal')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Type of appeal')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Select at least one of the options below')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Select at least one of the options below').nth(0)).toHaveText(
          `
            Select at least one of the options below
            Deprivation would have a disproportionate effect
            The decision is unlawful because discretion should have been exercised differently
            `,
          { useInnerText: true },
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Select at least one of the options below').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Select at least one of the options below')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Check the box if this statement also applies')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Check the box if this statement also applies').nth(0)).toHaveText(
          `
            Check the box if this statement also applies
            Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998
            `,
          { useInnerText: true },
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Check the box if this statement also applies').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Check the box if this statement also applies')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Home Office decision date')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Home Office decision date')).toHaveText(formattedHomeOfficeDecisionDate),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Home Office decision date')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Home Office decision date')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Notice of Decision')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Notice of Decision').nth(0)).toHaveText(
          `
            Notice of Decision 1
            Document
            Upload_The_Notice_Of_Decision.txt
            Describe the document
            Test notice of decision file uploaded
            `,
          { useInnerText: true },
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Notice of Decision').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Notice of Decision')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Does the appellant have a sponsor?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does the appellant have a sponsor?')).toHaveText('No'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does the appellant have a sponsor?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Does the appellant have a sponsor?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Has a deportation order been made against the appellant?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Has a deportation order been made against the appellant?')).toHaveText('No'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Has a deportation order been made against the appellant?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Has a deportation order been made against the appellant?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Are removal directions currently set for the appellant?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Are removal directions currently set for the appellant?')).toHaveText('Yes'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Are removal directions currently set for the appellant?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Are removal directions currently set for the appellant?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('What date and time is set for the removal?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('What date and time is set for the removal?')).toHaveText(
          `${formattedRemovalDirectionsDate}, 1:15:00 PM`,
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('What date and time is set for the removal?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('What date and time is set for the removal?')).toBeVisible(),

        expect(
          exui_pages.startAppealSubmit.$questionLocator(
            'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?',
          ),
        ).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator(
            'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?',
          ),
        ).toHaveText('No'),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator(
            'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?',
          ),
        ).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator(
            'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?',
          ),
        ).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Has the appellant appealed against any other UK immigration decision?')).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator('Has the appellant appealed against any other UK immigration decision?'),
        ).toHaveText("I'm not sure"),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator('Has the appellant appealed against any other UK immigration decision?'),
        ).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Has the appellant appealed against any other UK immigration decision?'),
        ).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Company')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Company')).toHaveText('Test Legal Rep Organisation'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Company')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Company')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Given names').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(1)).toHaveText('John'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Given names').nth(1)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Family name').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(1)).toHaveText('Smith'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Family name').nth(1)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Contact number')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Contact number')).toHaveText('07333333333'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Contact number')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Contact number')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Own reference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Own reference')).toHaveText('Test Legal Rep Reference Number'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Own reference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Own reference')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('How does the appellant want the appeal to be decided?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('How does the appellant want the appeal to be decided?')).toHaveText(
          'Decision with a hearing',
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('How does the appellant want the appeal to be decided?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('How does the appellant want the appeal to be decided?')).toBeVisible(),
      ]);
    });

    await test.step('Submit details in order to create draft application', async () => {
      await exui_pages.startAppealSubmit.saveAndContinue();

      await exui_pages.startAppealConfirm.verifyUserIsOnPage();
      await exui_pages.startAppealConfirm.verifyAllTextOnPage();
      await exui_pages.startAppealConfirm.returnToCaseDetails();

      await exui_pages.caseOverview.verifyUserIsOnPage({});
    });

    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toHaveText('You still need to submit your appeal.'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toHaveText('Submit your appeal'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toHaveText('You can also review and edit your appeal.'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(2)).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toHaveText('Edit appeal'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toBeVisible(),
      ]);
    });

    await test.step('Select submit your appeal from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Submit your appeal' });

      await exui_pages.submitAppealDeclaration.verifyUserIsOnPage();
      await exui_pages.submitAppealDeclaration.verifyAllTextOnPage();
      await exui_pages.submitAppealDeclaration.submitAppeal({ hasFeeToPay: false });

      await exui_pages.submitAppealConfirm.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.submitAppealConfirm.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.submitAppealConfirm.$static.yourAppealHasBeenSubmittedHeading).toBeVisible(),
        expect(exui_pages.submitAppealConfirm.$static.whatHappensNextHeading).toBeVisible(),
        expect(exui_pages.submitAppealConfirm.$static.whatHappensNextParagraph).toHaveText(
          'You will receive an email confirming that this appeal has been submitted successfully.',
        ),
        expect(exui_pages.submitAppealConfirm.$static.whatHappensNextParagraph).toBeVisible(),
      ]);
      await exui_pages.submitAppealConfirm.returnToCaseDetails();
    });

    await test.step('Verify event has successfully been submitted and correct next steps have been shown', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Submit your appeal' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          "You have submitted your appeal. A Tribunal Caseworker will now review your appeal. You don't need to do anything else right now.",
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
      ]);
    });
  });
});
