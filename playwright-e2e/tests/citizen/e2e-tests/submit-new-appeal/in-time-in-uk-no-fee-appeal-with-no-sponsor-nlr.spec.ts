import { test, expect } from '../../../../fixtures.js';

test.describe('Test to verify user is able to submit an appeal via the UI', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ citizenUser, cui_login }) => {
    await cui_login({ email: citizenUser.email, password: citizenUser.password });
  });

  test(
    'Verify user is able to submit an appeal that has no fee, appeal is in time with no sponsor or non-legal rep and appellant is in uk',
    { tag: ['@crossBrowser'] },
    async ({ cui_pages, dataUtils }) => {
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
        await cui_pages.appealType.completePageAndContinue({ appealType: 'Deprivation of Citizenship' });

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
        await cui_pages.applicantNationality.completePageAndContinue({ stateless: true });

        await cui_pages.decisionLetterSent.verifyUserIsOnPage();
        await cui_pages.decisionLetterSent.verifyAllTextOnPage();
        const dateLetterSent = await dataUtils.getDateFromToday({ dayOffset: -10 });
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
        await cui_pages.deportationOrder.completePageAndContinue({ deportationOrderReceived: 'No' });

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
          doesApplicantHaveASponsor: 'No',
          doesApplicantHaveANonLegalRepresentative: 'No',
        });

        await cui_pages.aboutAppeal.verifyUserIsOnPage();
      });

      await test.step('Complete decision with or without a hearing section of joruney', async () => {
        await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.decisionWithOrWithoutHearingLink);

        await cui_pages.decisionType.verifyUserIsOnPage();
        await cui_pages.decisionType.verifyAllTextOnPage();
        await cui_pages.decisionType.completePageAndContinue({ decisionWithOrWithoutHearing: 'decisionWithoutHearing' });

        await cui_pages.equalityAndDiversityStart.verifyUserIsOnPage();
        await cui_pages.equalityAndDiversityStart.verifyAllTextOnPage();
        await cui_pages.equalityAndDiversityStart.completePageAndContinue();

        await cui_pages.aboutAppeal.verifyUserIsOnPage();
      });

      await test.step('Complete check and send section of journey', async () => {
        await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.checkAndSendYourAppealDetailsLink);

        await cui_pages.newAppealCheckAnswers.verifyUserIsOnPage();
        await cui_pages.newAppealCheckAnswers.submitApplication();
      });

      await test.step('Verify application has successfully been submitted', async () => {
        await cui_pages.appealDetailsSent.verifyUserIsOnPage();

        await expect(cui_pages.appealDetailsSent.$static.pageHeading).toHaveText('Your appeal details have been sent');
        await expect(cui_pages.appealDetailsSent.$static.whatHappensNextHeading).toBeVisible();
        await expect(
          cui_pages.appealDetailsSent.page.getByText(
            'A Legal Officer will ask the Home Office to send any documents it has about your case to the Tribunal',
            { exact: true },
          ),
        ).toBeVisible();
        await expect(
          cui_pages.appealDetailsSent.page.getByText(
            'A Legal Officer will check the Home Office documents and then contact you to tell you what to do next',
            { exact: true },
          ),
        ).toBeVisible();

        const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 5 })).full;
        await expect(
          cui_pages.appealDetailsSent.page.getByText(`This should be by ${expectedDate} but it might take longer than that`, { exact: true }),
        ).toBeVisible();

        await expect(cui_pages.appealDetailsSent.$static.thingsYouCanDoNowHeading).toBeVisible();
        await expect(cui_pages.appealDetailsSent.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
        await expect(cui_pages.appealDetailsSent.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
      });
    },
  );
});
