import { AdminOfficerApiClient } from '../../../api-requests/exui/admin-officer-api-client.js';
import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/config.utils.js';

test.describe('Verify a legal representative can submit an appeal and access it in ExUI', { tag: ['@e2e'] }, () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test(
    'Verify user can submit a new appeal and open its case in ExUI',
    { tag: ['@crossBrowser'] },
    async ({ exui_pages, newBrowserContextAndPage, exui_adminOfficerApiClient, exui_legalRepApiClient, exui_caseOfficerApiClient }) => {
      test.setTimeout(7 * 60 * 1000);

      const caseId = await test.step('Submit a new appeal', async () => {
        return exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
          appealType: 'Deprivation of citizenship',
          isAppellantInUk: 'Yes',
          appellantInUk: {
            isAppellantInDetention: 'No',
          },
          isAppellantStateless: 'No',
          nationality: 'Spanish',
          isApplicationInTime: 'Yes',
          doesApplicantHaveASponsor: 'No',
          hearingType: 'Decision with a hearing',
        });
      });

      await test.step('Add 24 week flag for e2e test and go to case overview page', async () => {
        await exui_caseOfficerApiClient.submitAddStatutoryTimeFrameEvent({
          caseId: caseId,
          reasonForAddingStatutoryTimeFrame: 'Adding 24 week flag for e2e test'
        })
        await exui_pages.caseOverview.goTo({ caseId });
        await exui_pages.caseOverview.verifyUserIsOnPage({});
        await expect(exui_pages.caseOverview.$static.stfFlag).toBeVisible();
      })

      await test.step('Case officer: Select complete case review from next steps dropdown and submit event', async () => {
        const caseOfficerExuiPages = exui_pages;
            await caseOfficerExuiPages.caseOverview.goTo({ caseId: caseId });

            await caseOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Complete case review' });

            await caseOfficerExuiPages.completeCaseReview.verifyUserIsOnPage();
            await caseOfficerExuiPages.completeCaseReview.submitEvent();

            await caseOfficerExuiPages.completeCaseReviewConfirm.verifyUserIsOnPage();
            await caseOfficerExuiPages.completeCaseReviewConfirm.returnToCaseDetails();

            await caseOfficerExuiPages.caseOverview.verifyUserIsOnPage({});
            await caseOfficerExuiPages.caseOverview.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Complete case review' });

            return caseOfficerExuiPages;
      });

      const adminOfficerExuiPages =
        await test.step('Admin user: Lists case using next step dropdown', async () => {
          const adminOfficerNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'adminOfficer' });
          const adminOfficerExuiPages = await exui_pages.newPageContext({ pageContext: adminOfficerNewBrowserContextAndPage });

          await adminOfficerExuiPages.caseOverview.goTo({ caseId:caseId });

          await adminOfficerExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'List the case' })

          await adminOfficerExuiPages.listCase.verifyUserIsOnPage();
          await adminOfficerExuiPages.listCase.completePageAndContinue({
            listingLocation: 'Newport Tribunal Centre - Columbus House',
            remoteHearing: 'Yes',
            listingLengthHours: 0,
            listingLengthMinutes: 30,
            dateToSet: 'tomorrow',
            hourToSet: 13
          });

          await adminOfficerExuiPages.listCaseListCaseRequirements24Week.verifyUserIsOnPage();
          await adminOfficerExuiPages.listCaseListCaseRequirements24Week.verifyAllTextOnPage();
          await adminOfficerExuiPages.listCaseListCaseRequirements24Week.completePageAndContinue();

          await adminOfficerExuiPages.listCaseSubmit.listCase();

          return adminOfficerExuiPages;
        });
    },
  );
});

//https://manage-case.aat.platform.hmcts.net/cases/case-details/IA/Asylum/1794416374150874/trigger/listCase/listCaselistCaseRequirements