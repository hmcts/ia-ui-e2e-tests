import { test, expect } from '../../../../fixtures.js';

test.describe('Test to verify user can submit an appeal via the UI', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ citizenUser, cui_login }) => {
    await cui_login({ email: citizenUser.email, password: citizenUser.password });
  });

  test('Verify user is able to submit an appeal that has a fee, appeal is out of time where sponsor and non-legal rep are the same and the appellant is in uk', async ({
    cui_pages,
    dataUtils,
  }) => {
    await test.step('Navigate to appeal overview page', async () => {
      await cui_pages.caseList.createNewAppeal();
      await cui_pages.appealOverview.verifyUserIsOnPage();
    });

    await test.step('Navigate to about appeals page', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete appeal type section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.appealTypeLink);

      await cui_pages.inTheUk.verifyUserIsOnPage();
      await cui_pages.inTheUk.completePageAndContinue({ isUserInTheUk: 'Yes' });

      await cui_pages.appealType.verifyUserIsOnPage();
      await cui_pages.appealType.verifyAllTextOnPage();
      await cui_pages.appealType.completePageAndContinue({ appealType: 'Human Rights' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete your home office and details section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.homeOfficeAndPersonalDetailsLink);

      await cui_pages.homeOfficeReferenceNumber.verifyUserIsOnPage();
      await cui_pages.homeOfficeReferenceNumber.verifyAllTextOnPage();
      const homeOfficeReference = await dataUtils.generateRandomNumber({ digitLength: 9 });
      await cui_pages.homeOfficeReferenceNumber.completePageAndContinue({ homeOfficeReference: homeOfficeReference });

      await cui_pages.applicantName.verifyUserIsOnPage();
      await cui_pages.applicantName.verifyAllTextOnPage();
      const applicantName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.applicantName.completePageAndContinue({
        givenNames: applicantName.firstNames[0],
        familyName: applicantName.lastNames[0],
      });

      await cui_pages.applicantDob.verifyUserIsOnPage();
      await cui_pages.applicantDob.verifyAllTextOnPage();
      const applicantDob = await dataUtils.getDateFromToday({ yearOffset: -30 });
      await cui_pages.applicantDob.completePageAndContinue({
        day: applicantDob.day,
        month: applicantDob.month,
        year: applicantDob.year,
      });

      await cui_pages.applicantNationality.verifyUserIsOnPage();
      await cui_pages.applicantNationality.verifyAllTextOnPage();
      await cui_pages.applicantNationality.completePageAndContinue({ nationality: 'Singaporean', stateless: false });

      await cui_pages.decisionLetterSent.verifyUserIsOnPage();
      await cui_pages.decisionLetterSent.verifyAllTextOnPage();
      const dateLetterSent = await dataUtils.getDateFromToday({ monthOffset: -2 });
      await cui_pages.decisionLetterSent.completePageAndContinue({
        day: dateLetterSent.day,
        month: dateLetterSent.month,
        year: dateLetterSent.year,
      });

      await cui_pages.uploadDecisionLetter.verifyUserIsOnPage();
      await cui_pages.uploadDecisionLetter.verifyAllTextOnPage();
      await cui_pages.uploadDecisionLetter.completePageAndContinue({});

      await cui_pages.deportationOrder.verifyUserIsOnPage();
      await cui_pages.deportationOrder.verifyAllTextOnPage();
      await cui_pages.deportationOrder.completePageAndContinue({ deportationOrderReceived: 'Yes' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete your contact details section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.yourContactDetailsLink);

      await cui_pages.contactPreferences.verifyUserIsOnPage();
      await cui_pages.contactPreferences.verifyAllTextOnPage();
      const contactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.contactPreferences.completePageAndContinue({
        contactPreference: 'Email and Phone',
        applicantEmail: contactDetails.email,
        applicantPhoneNumber: contactDetails.phone,
      });

      await cui_pages.applicantAddress.verifyUserIsOnPage();
      await cui_pages.applicantAddress.verifyAllTextOnPage();
      await cui_pages.applicantAddress.completePageAndContinue({
        addressPreference: 'Post Code Search',
        postCode: 'N1 7DA',
      });

      await cui_pages.selectAddress.verifyUserIsOnPage();
      await cui_pages.selectAddress.verifyAllTextOnPage();
      await cui_pages.selectAddress.completePageAndContinue({ preference: 'Select Address At Random' });

      await cui_pages.manualAddress.verifyUserIsOnPage();
      await cui_pages.manualAddress.verifyAllTextOnPage();
      await cui_pages.manualAddress.completePageAndContinue({
        preference: 'Address selected via postcode search',
        postCode: 'N1 7DA',
      });

      await cui_pages.hasSponsorOrNonLegalRep.verifyUserIsOnPage();
      await cui_pages.hasSponsorOrNonLegalRep.verifyAllTextOnPage();
      await cui_pages.hasSponsorOrNonLegalRep.completePageAndContinue({
        doesApplicantHaveASponsor: 'Yes',
        doesApplicantHaveANonLegalRepresentative: 'Yes',
      });

      await cui_pages.isSamePersonAsSponsor.verifyUserIsOnPage();
      await cui_pages.isSamePersonAsSponsor.verifyAllTextOnPage();
      await cui_pages.isSamePersonAsSponsor.completePageAndContinue({ isSponsorAndNonLegalRepresentativeTheSamePerson: 'Yes' });

      await cui_pages.nonLegalRepName.verifyUserIsOnPage();
      await cui_pages.nonLegalRepName.verifyAllTextOnPage();
      const nonLegalRepName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.nonLegalRepName.completePageAndContinue({
        givenNames: nonLegalRepName.firstNames[0],
        familyName: nonLegalRepName.lastNames[0],
      });

      await cui_pages.nonLegalRepAddress.verifyUserIsOnPage();
      await cui_pages.nonLegalRepAddress.verifyAllTextOnPage({ isSponsorAndNonLegalRepTheSamePerson: 'Yes' });
      await cui_pages.nonLegalRepAddress.completePageAndContinue({
        isSponsorAndNonLegalRepTheSamePerson: 'Yes',
        addressLine1: '123 Fake Street',
        townOrCity: 'Faketown',
        postCode: 'FK1 1FK',
      });

      await cui_pages.nonLegalRepContactDetails.verifyUserIsOnPage();
      await cui_pages.nonLegalRepContactDetails.verifyAllTextOnPage();
      const nonLegalRepContactDetails = await dataUtils.generateContactDetails('Email and Phone');
      if (!nonLegalRepContactDetails.email || !nonLegalRepContactDetails.phone) {
        throw new Error('Failed to generate non-legal representative contact details');
      }
      await cui_pages.nonLegalRepContactDetails.completePageAndContinue({
        nlrEmail: nonLegalRepContactDetails.email,
        nlrPhoneNumber: nonLegalRepContactDetails.phone,
      });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete decision with or without a hearing section of joruney', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.decisionWithOrWithoutHearingLink);

      await cui_pages.decisionType.verifyUserIsOnPage();
      await cui_pages.decisionType.verifyAllTextOnPage();
      await cui_pages.decisionType.completePageAndContinue({ decisionWithOrWithoutHearing: 'decisionWithHearing' });

      await cui_pages.equalityAndDiversityStart.verifyUserIsOnPage();
      await cui_pages.equalityAndDiversityStart.verifyAllTextOnPage();
      await cui_pages.equalityAndDiversityStart.completePageAndContinue();

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete fee support section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.supportToPayTheFeeLink);

      await cui_pages.feeSupport.verifyUserIsOnPage();
      await cui_pages.feeSupport.verifyAllTextOnPage();
      await cui_pages.feeSupport.completePageAndContinue({
        whetherApplicantHasToPayAFee: 'None of these statements apply to me',
      });

      await cui_pages.helpWithFees.verifyUserIsOnPage();
      await cui_pages.helpWithFees.completePageAndContinue({ helpWithFees: 'willPayForAppeal' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete check and send section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.checkAndSendYourAppealDetailsLink);

      await cui_pages.lateAppeal.verifyUserIsOnPage();
      await cui_pages.lateAppeal.verifyAllTextOnPage({ isAppellantInTheUk: 'Yes' });
      await cui_pages.lateAppeal.completePageAndContinue({
        reasonForLateAppeal: 'Apologies for the late appeal submission',
      });

      await cui_pages.newAppealCheckAnswers.verifyUserIsOnPage();
      await cui_pages.newAppealCheckAnswers.submitApplication();
    });

    await test.step('Verify application has successfully been submitted', async () => {
      await cui_pages.appealDetailsSent.verifyUserIsOnPage();

      await expect(cui_pages.appealDetailsSent.$static.pageHeading).toHaveText('Your appeal has been submitted');
      await expect(cui_pages.appealDetailsSent.$static.whatHappensNextHeading).toBeVisible();
      await expect(cui_pages.appealDetailsSent.$static.whatHappensNextBulletPointList).toBeVisible();
      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;
      await expect(cui_pages.appealDetailsSent.$static.whatHappensNextBulletPointList).toHaveText(
        `
            You must pay for your appeal by ${expectedDate}.
            Your appeal will not progress until you have paid
            The Tribunal may end the appeal if you do not pay
            `,
        { useInnerText: true },
      );
    });

    await test.step('Pay for appeal', async () => {
      await cui_pages.appealDetailsSent.clickPayForAppealButton();

      await cui_pages.cardPaymentDetails.verifyUserIsOnPage();
      await cui_pages.cardPaymentDetails.autoPopulateAndSubmitPaymentDetailsForm();

      await cui_pages.cardPaymentConfirmDetails.verifyUserIsOnPage();
      await cui_pages.cardPaymentConfirmDetails.navigationClick(cui_pages.cardPaymentConfirmDetails.$interactive.confirmPaymentButton);
    });

    await test.step('Verify application has successfully been paid for', async () => {
      await cui_pages.confirmationOfPayment.verifyUserIsOnPage();

      await expect(cui_pages.confirmationOfPayment.$static.pageHeading).toHaveText('Your late appeal details have been sent');
      await expect(cui_pages.confirmationOfPayment.$static.whatHappensNextHeading).toBeVisible();
      await expect(cui_pages.confirmationOfPayment.$static.whatHappensNextBulletPointList).toBeVisible();
      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 5 })).full;
      await expect(cui_pages.confirmationOfPayment.$static.whatHappensNextBulletPointList).toHaveText(
        `
            A Legal Officer will look at the reasons your appeal was late and decide if your appeal can continue
            You will be sent a notification to tell you what the Tribunal has decided and what you can do next
            This should be by ${expectedDate} but it might be later than that
            You have submitted your appeal details with a non-legal representative. If they do not already have an account with MyHMCTS, they will be sent an email to create an account..
            To continue to add your non-legal representative once they have created an account, please click the Add non-legal representative link on the right of your appeal page in order to send them instructions to access your case.
            `,
        { useInnerText: true },
      );

      await expect(cui_pages.confirmationOfPayment.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.confirmationOfPayment.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.confirmationOfPayment.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });
  });
});
