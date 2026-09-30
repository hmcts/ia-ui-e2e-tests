import { test, expect } from '../../../../fixtures.js';

test.describe('Test to verify user is able to submit an appeal via the UI', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ citizenUser, cui_login }) => {
    await cui_login({ email: citizenUser.email, password: citizenUser.password });
  });

  test('Verify user is able to submit an appeal that has a fee remission, appeal is in time with different sponsor and non-legal rep whilst appellant not in uk', async ({
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
      await cui_pages.inTheUk.completePageAndContinue({ isUserInTheUk: 'No' });

      await cui_pages.appealType.verifyUserIsOnPage();
      await cui_pages.appealType.verifyAllTextOnPage();
      await cui_pages.appealType.completePageAndContinue({ appealType: 'Human Rights' });

      await cui_pages.outOfCountryHrEea.verifyUserIsOnPage();
      await cui_pages.outOfCountryHrEea.completePageAndContinue({ outsideUkWhenApplicationMade: 'No' });

      await cui_pages.outOfCountryHrInside.verifyUserIsOnPage();
      await cui_pages.outOfCountryHrInside.verifyAllTextOnPage();
      const dateLeftUk = await dataUtils.getDateFromToday({ yearOffset: -4 });
      await cui_pages.outOfCountryHrInside.completePageAndContinue({
        day: dateLeftUk.day,
        month: dateLeftUk.month,
        year: dateLeftUk.year,
      });

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

      await cui_pages.decisionLetterReceived.verifyUserIsOnPage();
      await cui_pages.decisionLetterReceived.verifyAllTextOnPage();
      const dateLetterReceived = await dataUtils.getDateFromToday({ dayOffset: -4 });
      await cui_pages.decisionLetterReceived.completePageAndContinue({
        day: dateLetterReceived.day,
        month: dateLetterReceived.month,
        year: dateLetterReceived.year,
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

      await cui_pages.outOfCountryAddress.verifyUserIsOnPage();
      await cui_pages.outOfCountryAddress.completePageAndContinue({
        applicantAddress: 'Flat 1, 1 Test Street, Test Town, TE1 1ST, United Kingdom',
      });

      await cui_pages.hasSponsorOrNonLegalRep.verifyUserIsOnPage();
      await cui_pages.hasSponsorOrNonLegalRep.verifyAllTextOnPage();
      await cui_pages.hasSponsorOrNonLegalRep.completePageAndContinue({
        doesApplicantHaveASponsor: 'Yes',
        doesApplicantHaveANonLegalRepresentative: 'Yes',
      });

      await cui_pages.isSamePersonAsSponsor.verifyUserIsOnPage();
      await cui_pages.isSamePersonAsSponsor.verifyAllTextOnPage();
      await cui_pages.isSamePersonAsSponsor.completePageAndContinue({ isSponsorAndNonLegalRepresentativeTheSamePerson: 'No' });

      await cui_pages.sponsorName.verifyUserIsOnPage();
      await cui_pages.sponsorName.verifyAllTextOnPage();
      const sponsorName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.sponsorName.completePageAndContinue({
        givenNames: sponsorName.firstNames[0],
        familyName: sponsorName.lastNames[0],
      });

      await cui_pages.sponsorAddress.verifyUserIsOnPage();
      await cui_pages.sponsorAddress.verifyAllTextOnPage();
      await cui_pages.sponsorAddress.completePageAndContinue({
        addressLine1: '123 Fake Street',
        townOrCity: 'Faketown',
        postCode: 'FK1 1FK',
      });

      await cui_pages.sponsorContactPreferences.verifyUserIsOnPage();
      await cui_pages.sponsorContactPreferences.verifyAllTextOnPage();
      const sponsorContactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.sponsorContactPreferences.completePageAndContinue({
        contactPreference: 'Email and Phone',
        sponsorEmail: sponsorContactDetails.email,
        sponsorPhoneNumber: sponsorContactDetails.phone,
      });

      await cui_pages.sponsorAuthorisation.verifyUserIsOnPage();
      await cui_pages.sponsorAuthorisation.completePageAndContinue({ allowSponsorToSeeAppealInformation: 'Yes' });

      await cui_pages.nonLegalRepName.verifyUserIsOnPage();
      await cui_pages.nonLegalRepName.verifyAllTextOnPage();
      const nonLegalRepName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.nonLegalRepName.completePageAndContinue({
        givenNames: nonLegalRepName.firstNames[0],
        familyName: nonLegalRepName.lastNames[0],
      });

      await cui_pages.nonLegalRepAddress.verifyUserIsOnPage();
      await cui_pages.nonLegalRepAddress.verifyAllTextOnPage({ isSponsorAndNonLegalRepTheSamePerson: 'No' });
      await cui_pages.nonLegalRepAddress.completePageAndContinue({
        isSponsorAndNonLegalRepTheSamePerson: 'No',
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
        whetherApplicantHasToPayAFee: 'I get asylum support from the Home Office',
      });

      await cui_pages.asylumSupport.verifyUserIsOnPage();
      await cui_pages.asylumSupport.verifyAllTextOnPage();
      const asylumSupportRefNumber = await dataUtils.generateRandomNumber({ digitLength: 8 });
      await cui_pages.asylumSupport.completePageAndContinue({ asylumSupportRefNumber: asylumSupportRefNumber });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete check and send section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.checkAndSendYourAppealDetailsLink);

      await cui_pages.newAppealCheckAnswers.verifyUserIsOnPage();
      await cui_pages.newAppealCheckAnswers.submitApplication();
    });

    await test.step('Verify application has successfully been submitted', async () => {
      await cui_pages.appealDetailsSent.verifyUserIsOnPage();

      await expect(cui_pages.appealDetailsSent.$static.pageHeading).toHaveText('You have sent your appeal details');
      await expect(cui_pages.appealDetailsSent.$static.whatHappensNextHeading).toBeVisible();
      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;
      await expect(cui_pages.appealDetailsSent.$static.whatHappensNextBulletPointList).toHaveText(
        `
        The Tribunal will check the information you sent and let you know if you need to pay a fee
        This should be by ${expectedDate} but it might take longer than that
        You have submitted your appeal details with a non-legal representative. If they do not already have an account with MyHMCTS, they will be sent an email to create an account..
        To continue to add your non-legal representative once they have created an account, please click the Add non-legal representative link on the right of your appeal page in order to send them instructions to access your case.
        `,
        { useInnerText: true },
      );

      await expect(cui_pages.appealDetailsSent.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.appealDetailsSent.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.appealDetailsSent.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });
  });
});
