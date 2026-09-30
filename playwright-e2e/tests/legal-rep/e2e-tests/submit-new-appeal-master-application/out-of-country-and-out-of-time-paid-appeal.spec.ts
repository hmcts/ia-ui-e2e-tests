import { test, expect } from '../../../../fixtures.js';
import { config } from '../../../../utils/config.utils.js';

test.describe('Tests to verify legal rep is able to submit new appeal on exui', { tag: ['@e2e'] }, () => {
  test.use({ storageState: config.exuiUsers.legalRepUser.sessionFile });

  test('Verify legal rep user is able to submit a new out of country appeal that has a sponsor, is out of time and pays for the appeal', async ({
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
      await exui_pages.startAppealOutOfCountry.completePageAndContinue({ isAppellantInUk: 'No' });

      await exui_pages.startAppealOutOfCountryDecisionType.verifyUserIsOnPage();
      await exui_pages.startAppealOutOfCountryDecisionType.verifyAllTextOnPage();
      await exui_pages.startAppealOutOfCountryDecisionType.completePageAndContinue({
        outOfCountryDecisionType:
          'A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016',
      });

      await exui_pages.startAppealOocHomeOfficeReferenceNumber.verifyUserIsOnPage();
      await exui_pages.startAppealOocHomeOfficeReferenceNumber.verifyAllTextOnPage();
      const homeOfficeReferenceNumber = `HOR${await dataUtils.generateRandomNumber({ digitLength: 7 })}`;
      await exui_pages.startAppealOocHomeOfficeReferenceNumber.completePageAndContinue({
        homeOfficeReferenceNumber: homeOfficeReferenceNumber,
      });

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
        nationalityStatus: 'Stateless',
      });

      await exui_pages.startAppealOocAppellantAddress.verifyUserIsOnPage();
      await exui_pages.startAppealOocAppellantAddress.verifyAllTextOnPage();
      await exui_pages.startAppealOocAppellantAddress.completePageAndContinue({
        hasCorrespondenceAddressOutsideUk: 'Yes',
        outOfCountryAddress: '123 Main St, London, SW1A 1AA',
      });

      await exui_pages.startAppealAppellantContactPreference.verifyUserIsOnPage();
      await exui_pages.startAppealAppellantContactPreference.verifyAllTextOnPage();
      await exui_pages.startAppealAppellantContactPreference.completePageAndContinue({
        contactPreference: 'Email',
        emailAddress: 'Test@hmcts.net',
      });

      await exui_pages.startAppealAppealType.verifyUserIsOnPage();
      await exui_pages.startAppealAppealType.verifyAllTextOnPage();
      await exui_pages.startAppealAppealType.completePageAndContinue({
        appealType: 'Refusal of protection claim',
      });

      await exui_pages.startAppealAppealGroundsProtection.verifyUserIsOnPage();
      await exui_pages.startAppealAppealGroundsProtection.verifyAllTextOnPage();
      await exui_pages.startAppealAppealGroundsProtection.completePageAndContinue({
        groundsForAppeal: [
          "Removing the appellant from the UK would breach the UK's obligation in relation to persons eligible for a grant of humanitarian protection",
          "Removing the appellant from the UK would breach the UK's obligation under the Refugee Convention",
        ],
        humanRightsGroundsForAppeal: 'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998',
      });

      await exui_pages.startAppealEntryClearanceDecisionLetter.verifyUserIsOnPage();
      await exui_pages.startAppealEntryClearanceDecisionLetter.verifyAllTextOnPage();
      const OutOfTimeDecisionDate = await dataUtils.getDateFromToday({ monthOffset: -2 });
      await exui_pages.startAppealEntryClearanceDecisionLetter.completePageAndContinue({
        entryClearanceDecisionDate: {
          day: OutOfTimeDecisionDate.day,
          month: OutOfTimeDecisionDate.month,
          year: OutOfTimeDecisionDate.year,
        },
      });

      await exui_pages.startAppealUploadTheNoticeOfDecision.verifyUserIsOnPage();
      await exui_pages.startAppealUploadTheNoticeOfDecision.verifyAllTextOnPage();
      await exui_pages.startAppealUploadTheNoticeOfDecision.completePageAndContinue({ description: 'Test notice of decision file uploaded' });

      await exui_pages.startAppealSponsor.verifyUserIsOnPage();
      await exui_pages.startAppealSponsor.verifyAllTextOnPage();
      await exui_pages.startAppealSponsor.completePageAndContinue({
        hasSponsor: 'Yes',
      });

      await exui_pages.startAppealSponsorName.verifyUserIsOnPage();
      await exui_pages.startAppealSponsorName.verifyAllTextOnPage();
      await exui_pages.startAppealSponsorName.completePageAndContinue({
        sponsorGivenNames: 'Jane',
        sponsorFamilyName: 'Doe',
      });

      await exui_pages.startAppealSponsorAddress.verifyUserIsOnPage();
      await exui_pages.startAppealSponsorAddress.verifyAllTextOnPage();
      await exui_pages.startAppealSponsorAddress.completePageAndContinue({
        addressPreference: 'Post Code Search',
        postCode: 'E1 6AN',
      });

      await exui_pages.startAppealSponsorContactPreference.verifyUserIsOnPage();
      await exui_pages.startAppealSponsorContactPreference.verifyAllTextOnPage();
      await exui_pages.startAppealSponsorContactPreference.completePageAndContinue({
        sponsorContactPreference: 'Text message',
        sponsorMobileNumber: '07222222222',
      });

      await exui_pages.startAppealSponsorAuthorisation.verifyUserIsOnPage();
      await exui_pages.startAppealSponsorAuthorisation.verifyAllTextOnPage();
      await exui_pages.startAppealSponsorAuthorisation.completePageAndContinue({
        sponsorAuthorisation: 'Yes',
      });

      await exui_pages.startAppealDeportationOrder.verifyUserIsOnPage();
      await exui_pages.startAppealDeportationOrder.verifyAllTextOnPage();
      await exui_pages.startAppealDeportationOrder.completePageAndContinue({
        deportationOrder: 'Yes',
      });

      await exui_pages.startAppealNewMatters.verifyUserIsOnPage();
      await exui_pages.startAppealNewMatters.verifyAllTextOnPage();
      await exui_pages.startAppealNewMatters.completePageAndContinue({
        hasNewMatters: 'Yes',
        newMattersExplanation: 'Test new matters description',
      });

      await exui_pages.startAppealHasOtherAppeals.verifyUserIsOnPage();
      await exui_pages.startAppealHasOtherAppeals.verifyAllTextOnPage();
      await exui_pages.startAppealHasOtherAppeals.completePageAndContinue({
        hasOtherAppeals: 'Yes, but an appeal number was not provided',
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

      await exui_pages.startAppealHearingFeeDecision.verifyUserIsOnPage();
      await exui_pages.startAppealHearingFeeDecision.verifyAllTextOnPage();
      await exui_pages.startAppealHearingFeeDecision.completePageAndContinue({
        hearingFeeDecision: 'Decision with a hearing. The fee for this type of appeal is £144',
      });

      await exui_pages.startAppealRemissionType.verifyUserIsOnPage();
      await exui_pages.startAppealRemissionType.verifyAllTextOnPage();
      await exui_pages.startAppealRemissionType.completePageAndContinue({
        remissionType: 'The appellant is not eligible for a fee remission',
      });

      await exui_pages.startAppealPaymentOptions.verifyUserIsOnPage();
      await exui_pages.startAppealPaymentOptions.verifyAllTextOnPage();
      await exui_pages.startAppealPaymentOptions.completePageAndContinue({
        paymentOption: 'Pay Now',
      });

      return {
        homeOfficeReferenceNumber: homeOfficeReferenceNumber,
        outOfTimeDecisionDate: {
          day: OutOfTimeDecisionDate.day,
          month: OutOfTimeDecisionDate.month,
          year: OutOfTimeDecisionDate.year,
        },
      };
    });

    await test.step('Verify correct details are displayed on check your answers page', async () => {
      await exui_pages.startAppealSubmit.verifyUserIsOnPage();
      await expect(exui_pages.startAppealSubmit.$static.checkYouAnswersHeading).toBeVisible();
      await expect(exui_pages.startAppealSubmit.$static.checkInformationCarefullyText).toBeVisible();

      const entryClearanceDecisionDate = new Date(
        dynamicTestData.outOfTimeDecisionDate.year,
        dynamicTestData.outOfTimeDecisionDate.month - 1,
        dynamicTestData.outOfTimeDecisionDate.day,
      );
      const formattedEntryClearanceDecisionDate = entryClearanceDecisionDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).replace('Sept', 'Sep');

      await Promise.all([
        expect(exui_pages.startAppealSubmit.$questionLocator('Is the appellant currently living in the United Kingdom?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Is the appellant currently living in the United Kingdom?')).toHaveText('No'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Is the appellant currently living in the United Kingdom?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Is the appellant currently living in the United Kingdom?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('What type of decision are you appealing?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('What type of decision are you appealing?')).toHaveText(
          'A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016',
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('What type of decision are you appealing?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('What type of decision are you appealing?')).toBeVisible(),

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

        expect(exui_pages.startAppealSubmit.$questionLocator('Nationality')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Nationality')).toHaveText('Stateless'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Nationality')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Nationality')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Does your client have a correspondence address outside the UK?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does your client have a correspondence address outside the UK?')).toHaveText(
          'Yes',
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does your client have a correspondence address outside the UK?')).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Does your client have a correspondence address outside the UK?'),
        ).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Enter the address')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Enter the address')).toHaveText('123 Main St, London, SW1A 1AA'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Enter the address')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Enter the address')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Communication Preference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Communication Preference')).toHaveText('Email'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Communication Preference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Communication Preference')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator("Appellant's email address")).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator("Appellant's email address")).toHaveText('Test@hmcts.net'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator("Appellant's email address")).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator("Appellant's email address")).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Type of appeal')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Type of appeal')).toHaveText('Refusal of protection claim'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Type of appeal')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Type of appeal')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Select at least one of the options below')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Select at least one of the options below').nth(0)).toHaveText(
          `
          Select at least one of the options below
          Removing the appellant from the UK would breach the UK's obligation in relation to persons eligible for a grant of humanitarian protection
          Removing the appellant from the UK would breach the UK's obligation under the Refugee Convention
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

        expect(exui_pages.startAppealSubmit.$questionLocator('Date of entry clearance decision')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Date of entry clearance decision')).toHaveText(
          formattedEntryClearanceDecisionDate,
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Date of entry clearance decision')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Date of entry clearance decision')).toBeVisible(),

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
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does the appellant have a sponsor?')).toHaveText('Yes'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Does the appellant have a sponsor?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Does the appellant have a sponsor?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Given names').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(1)).toHaveText('Jane'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Given names').nth(1)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Family name').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(1)).toHaveText('Doe'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(1)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Family name').nth(1)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Address')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Address').nth(0)).toHaveText(
          `
          Address
          Building and Street
          6 Brushfield Street
          Town or City
          London
          Postcode/Zipcode
          E1 6AN
          Country
          United Kingdom
          `,
          { useInnerText: true },
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Address').nth(0)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Address')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Contact details')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Contact details')).toHaveText('Text message'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Contact details')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Contact details')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Mobile phone number')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Mobile phone number')).toHaveText('07222222222'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Mobile phone number')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Mobile phone number')).toBeVisible(),

        expect(
          exui_pages.startAppealSubmit.$questionLocator(
            'Does the appellant give authorisation for the sponsor to access information relating to the appeal?',
          ),
        ).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator(
            'Does the appellant give authorisation for the sponsor to access information relating to the appeal?',
          ),
        ).toHaveText('Yes'),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator(
            'Does the appellant give authorisation for the sponsor to access information relating to the appeal?',
          ),
        ).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator(
            'Does the appellant give authorisation for the sponsor to access information relating to the appeal?',
          ),
        ).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Has a deportation order been made against the appellant?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Has a deportation order been made against the appellant?')).toHaveText('Yes'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Has a deportation order been made against the appellant?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Has a deportation order been made against the appellant?')).toBeVisible(),

        expect(
          exui_pages.startAppealSubmit.$questionLocator(
            'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?',
          ),
        ).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator(
            'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?',
          ),
        ).toHaveText('Yes'),
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

        expect(exui_pages.startAppealSubmit.$questionLocator('Explain these new matters and their relevance to the appeal')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Explain these new matters and their relevance to the appeal')).toHaveText(
          'Test new matters description',
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Explain these new matters and their relevance to the appeal')).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Explain these new matters and their relevance to the appeal'),
        ).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Has the appellant appealed against any other UK immigration decision?')).toBeVisible(),
        expect(
          exui_pages.startAppealSubmit.$questionValueLocator('Has the appellant appealed against any other UK immigration decision?'),
        ).toHaveText('Yes, but an appeal number was not provided'),
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

        expect(exui_pages.startAppealSubmit.$questionLocator('Given names').nth(2)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(2)).toHaveText('John'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Given names').nth(2)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Given names').nth(2)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Family name').nth(2)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(2)).toHaveText('Smith'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Family name').nth(2)).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Family name').nth(2)).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Contact number')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Contact number')).toHaveText('07333333333'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Contact number')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Contact number')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Own reference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Own reference')).toHaveText('Test Legal Rep Reference Number'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Own reference')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Own reference')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('How do you want the appeal to be decided?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('How do you want the appeal to be decided?')).toHaveText(
          'Decision with a hearing. The fee for this type of appeal is £144',
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('How do you want the appeal to be decided?')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('How do you want the appeal to be decided?')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Choose one of the following statements')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Choose one of the following statements')).toHaveText(
          'The appellant is not eligible for a fee remission',
        ),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Choose one of the following statements')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Choose one of the following statements')).toBeVisible(),

        expect(exui_pages.startAppealSubmit.$questionLocator('Select a payment method')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Select a payment method')).toHaveText('Pay Now'),
        expect(exui_pages.startAppealSubmit.$questionValueLocator('Select a payment method')).toBeVisible(),
        expect(exui_pages.startAppealSubmit.$changeAnswerToQuestionLocator('Select a payment method')).toBeVisible(),
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
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toHaveText('Edit your appeal'),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph.nth(3)).toBeVisible(),
      ]);
    });

    await test.step('Select submit your appeal from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Submit your appeal' });

      await exui_pages.submitAppealSubmissionOutOfTime.verifyUserIsOnPage();
      await exui_pages.submitAppealSubmissionOutOfTime.verifyAllTextOnPage();
      await exui_pages.submitAppealSubmissionOutOfTime.completePageAndContinue({
        uploadFile: true,
        reasonsAppealLate: 'Test reasons for appeal being late',
      });

      await exui_pages.submitAppealDeclaration.verifyUserIsOnPage();
      await exui_pages.submitAppealDeclaration.verifyAllTextOnPage();
      await exui_pages.submitAppealDeclaration.submitAppeal({ hasFeeToPay: true, feeToPay: 144 });

      await exui_pages.submitAppealConfirm.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.submitAppealConfirm.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.submitAppealConfirm.$static.outOfTimeConfirmation).toBeVisible(),
        expect(exui_pages.submitAppealConfirm.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.submitAppealConfirm.$static.doThisNextParagraph.nth(0)).toHaveText(
          "You must now pay for this appeal. First create a service request, you can do this by selecting 'Create a service request' from the 'Next step' dropdown list. Then select 'Go'.",
        ),
        expect(exui_pages.submitAppealConfirm.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.submitAppealConfirm.$static.doThisNextParagraph.nth(1)).toHaveText(
          'Once you have paid for the appeal, a Tribunal Caseworker will review the reasons your appeal was out of time and you will be notified if it can proceed.',
        ),
        expect(exui_pages.submitAppealConfirm.$static.doThisNextParagraph.nth(1)).toBeVisible(),
      ]);
      await exui_pages.submitAppealConfirm.returnToCaseDetails();
    });

    await test.step('Verify submit your appeal event has successfully been submitted and correct next steps have been shown', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Submit your appeal' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          "You must now pay for this appeal. First create a service request, you can do this by selecting 'Create a service request' from the 'Next step' dropdown list. Then select 'Go'.",
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
      ]);
    });

    await test.step('Select create a service request from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Create a service request' });

      await exui_pages.generateServiceRequestCreateAServiceRequest.verifyUserIsOnPage();
      await exui_pages.generateServiceRequestCreateAServiceRequest.verifyAllTextOnPage({ feeAmount: 144 });
      await exui_pages.generateServiceRequestCreateAServiceRequest.submitCreateServiceRequest();

      await exui_pages.generateServiceRequestConfirm.verifyUserIsOnPage();
      await exui_pages.generateServiceRequestConfirm.verifyAllTextOnPage();
      await exui_pages.generateServiceRequestConfirm.returnToCaseDetails();
    });

    await test.step('Verify create a service request event has successfully been submitted and correct next steps have been shown', async () => {
      await exui_pages.caseOverview.verifyUserIsOnPage({});
      await exui_pages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Create a service request' });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          'You must now pay for this appeal. You can do this via the Service Request tab.',
        ),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
      ]);
    });

    await test.step('Navigate to service request tab and pay for the appeal', async () => {
      await exui_pages.caseOverview.navigateToTab({ tabToSelect: 'Service Request' });

      await exui_pages.serviceRequestTab.verifyUserIsOnPage();
      await exui_pages.serviceRequestTab.verifyServiceRequestStatus({ status: 'Not paid', amount: 144, party: 'John Doe' });

      await exui_pages.serviceRequestTab.selectPayNowLink();
      await exui_pages.serviceRequestTab.paymentOptions({ amountToPay: 144, paymentOption: 'Pay by credit or debit card' });

      await exui_pages.cardPaymentDetails.verifyUserIsOnPage();
      await exui_pages.cardPaymentDetails.autoPopulateAndSubmitPaymentDetailsForm();

      await exui_pages.cardPaymentConfirmDetails.verifyUserIsOnPage();
      await exui_pages.cardPaymentConfirmDetails.confirmPayment();

      await exui_pages.cardPaymentConfirmation.verifyUserIsOnPage();
      await exui_pages.cardPaymentConfirmation.returnToServiceRequest();

      await exui_pages.serviceRequestTab.verifyUserIsOnPage();
      await exui_pages.serviceRequestTab.verifyServiceRequestStatus({ status: 'Paid', amount: 144, party: 'John Doe' });
    });

    await test.step('Verify correct next steps are shown on appeal overview page', async () => {
      await exui_pages.serviceRequestTab.navigateToTab({ tabToSelect: 'Overview' });
      await exui_pages.caseOverview.verifyUserIsOnPage({});

      await exui_pages.caseOverview.refreshPageUntilExpectedTextIsVisible({
        expectedText: 'You have submitted your appeal.',
        timeoutInSeconds: 60,
      });

      await Promise.all([
        expect(exui_pages.caseOverview.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toBeVisible(),
        expect(exui_pages.caseOverview.$static.doThisNextParagraph).toHaveText(
          'You have submitted your appeal. A Tribunal Caseworker will now review your appeal.',
        ),
      ]);
    });
  });
});
