import { test, expect } from '../../../../fixtures.js';

test.describe('Set of tests to verify functionality of case list page on citizen ui', { tag: ['@functional'] }, () => {
  test('Verify correct information is displayed on case list page for a draft application', async ({ citizenUser, cui_login, cui_pages }) => {
    await test.step('Create a draft application', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
      await cui_pages.caseList.verifyNoAppealsTextOnPage();
      await cui_pages.caseList.createNewAppeal();
      await cui_pages.appealOverview.verifyUserIsOnPage();
    });

    await test.step('Navigate to case list page', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.backToYourAppealsButton);
      await cui_pages.caseList.verifyUserIsOnPage();
    });

    await test.step('Verify correct information is displayed', async () => {
      await cui_pages.caseList.verifyAppealDetails({
        appealReference: 'DRAFT',
        caseReference: /^\d{16}$/,
        applicantName: `${citizenUser.forename} ${citizenUser.surname}`,
        appealStatus: 'DRAFT',
      });
    });
  });
});
