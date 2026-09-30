import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify functionality of application overview page on citizen ui', { tag: ['@functional'] }, () => {
  test('Verify application overview page displays correct information for a paid application that has not received any payment', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_pages,
    dataUtils,
  }) => {
    const appealDetails = await test.step('Submit an appeal via api', async () => {
      return await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        isUserInTheUk: 'Yes',
        appealType: 'Human Rights',
        isApplicantStateless: false,
        isApplicationInTime: true,
        nationality: 'Sudanese',
        hasApplicantReceivedADeportationOrder: 'No',
        sponsorDetails: {
          doesApplicantHaveASponsor: 'No',
          doesApplicantHaveANonLegalRepSponsor: 'No',
        },
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        whetherApplicantHasToPayAFee: 'I got a fee waiver from the Home Office for my application to stay in the UK',
        appealSubmissionType: 'Non-Pay Appeal',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Verify applicant no longer has anything remaining to fulfil on their application', async () => {
      const applicantName = `${appealDetails.applicantDetails.givenNames.join(' ')} ${appealDetails.applicantDetails.familyName}`;
      await cui_pages.caseList.viewExistingApplication({ searchTerm: applicantName });

      await cui_pages.appealOverview.verifyUserIsOnPage();
      await expect(cui_pages.appealOverview.$static.nothingToDoNextHeading).toBeVisible();
    });

    await test.step('Verify text on application overview page has been updated to reflect details have been sent', async () => {
      const formattedExpectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;

      await expect(cui_pages.appealOverview.$static.applicantInstructionsWindow).toBeVisible();
      await expect(cui_pages.appealOverview.$static.applicantInstructionsWindow).toHaveText(
        `Your appeal details have been sent to the Tribunal.
        There is a fee for this appeal. You told the Tribunal that you believe you do not have to pay some or all of the fee.
        The Tribunal will check the information you sent and let you know if you need to pay a fee.
        This should be by ${formattedExpectedDate} but it might take longer than that.`,
        { useInnerText: true },
      );
    });

    await test.step('Verify appeal details section of appeal overview page', async () => {
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(cui_pages.appealOverview.$static.completedHeading).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsHeading).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsTimeLine).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsTimeLine).toHaveText(
        `${formattedTodaysDate} - You sent your appeal details to the Tribunal.
        What you sent
        Your appeal details
        Helpful information
        What is a Tribunal Caseworker?`,
        { useInnerText: true },
      );
    });
  });

  test('Verify application overview page displays correct information for a paid application', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_pages,
    dataUtils,
  }) => {
    const appealDetails = await test.step('Submit an appeal via api', async () => {
      return await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        isUserInTheUk: 'Yes',
        appealType: 'Protection',
        isApplicantStateless: false,
        isApplicationInTime: true,
        nationality: 'Sri Lankan',
        payForAppealNowOrLater: 'payNow',
        hasApplicantReceivedADeportationOrder: 'No',
        sponsorDetails: {
          doesApplicantHaveASponsor: 'No',
          doesApplicantHaveANonLegalRepSponsor: 'No',
        },
        decisionWithOrWithoutHearing: 'decisionWithoutHearing',
        whetherApplicantHasToPayAFee: 'None of these statements apply to me',
        appealSubmissionType: 'Pay Appeal',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Verify applicant no longer has anything remaining to fulfil on their application', async () => {
      const applicantName = `${appealDetails.applicantDetails.givenNames.join(' ')} ${appealDetails.applicantDetails.familyName}`;
      await cui_pages.caseList.viewExistingApplication({ searchTerm: applicantName });

      await cui_pages.appealOverview.verifyUserIsOnPage();
      await expect(cui_pages.appealOverview.$static.nothingToDoNextHeading).toBeVisible();
    });

    await test.step('Verify text on application overview page has been updated to reflect details have been sent', async () => {
      const formattedExpectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;
      await expect(cui_pages.appealOverview.$static.applicantInstructionsWindow).toBeVisible();
      await expect(cui_pages.appealOverview.$static.applicantInstructionsWindow).toHaveText(
        `Your appeal details have been sent to the Tribunal.
        A Tribunal Caseworker will contact you to tell you what happens next.
        This should be by ${formattedExpectedDate} but it might take longer than that.
        Helpful Information
        What is a Tribunal Caseworker?`,
        { useInnerText: true },
      );
    });

    await test.step('Verify appeal argument section of appeal overview page', async () => {
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(cui_pages.appealOverview.$static.completedHeading).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealArgumentHeading).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealArgumentTimeLine).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealArgumentTimeLine).toHaveText(
        `${formattedTodaysDate} - You paid for your appeal
        What you sent
        Your appeal details`,
        { useInnerText: true },
      );
    });

    await test.step('Verify appeal details section of appeal overview page', async () => {
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsHeading).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsTimeLine).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsTimeLine).toHaveText(
        `${formattedTodaysDate} - You sent your appeal details to the Tribunal.
        What you sent
        Your appeal details
        Helpful information
        What is a Tribunal Caseworker?`,
        { useInnerText: true },
      );
    });
  });

  test('Verify application overview page displays correct information for an application that does not require any payment', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_pages,
    dataUtils,
  }) => {
    const appealDetails = await test.step('Submit an appeal via api', async () => {
      return await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        isUserInTheUk: 'Yes',
        appealType: 'Deprivation of Citizenship',
        isApplicantStateless: false,
        isApplicationInTime: true,
        nationality: 'Surinamese',
        hasApplicantReceivedADeportationOrder: 'No',
        sponsorDetails: {
          doesApplicantHaveASponsor: 'No',
          doesApplicantHaveANonLegalRepSponsor: 'No',
        },
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        appealSubmissionType: 'Non-Pay Appeal',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Verify applicant no longer has anything remaining to fulfil on their application', async () => {
      const applicantName = `${appealDetails.applicantDetails.givenNames.join(' ')} ${appealDetails.applicantDetails.familyName}`;
      await cui_pages.caseList.viewExistingApplication({ searchTerm: applicantName });

      await cui_pages.appealOverview.verifyUserIsOnPage();
      await expect(cui_pages.appealOverview.$static.nothingToDoNextHeading).toBeVisible();
    });

    await test.step('Verify text on application overview page has been updated to reflect details have been sent', async () => {
      const formattedExpectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;
      await expect(cui_pages.appealOverview.$static.applicantInstructionsWindow).toBeVisible();
      await expect(cui_pages.appealOverview.$static.applicantInstructionsWindow).toHaveText(
        `Your appeal details have been sent to the Tribunal.
        A Tribunal Caseworker will contact you to tell you what happens next.
        This should be by ${formattedExpectedDate} but it might take longer than that.
        Helpful Information
        What is a Tribunal Caseworker?`,
        { useInnerText: true },
      );
    });

    await test.step('Verify appeal details section of appeal overview page', async () => {
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(cui_pages.appealOverview.$static.completedHeading).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsHeading).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsTimeLine).toBeVisible();
      await expect(cui_pages.appealOverview.$static.yourAppealDetailsTimeLine).toHaveText(
        `${formattedTodaysDate} - You sent your appeal details to the Tribunal.
        What you sent
        Your appeal details
        Helpful information
        What is a Tribunal Caseworker?`,
        { useInnerText: true },
      );
    });
  });
});
