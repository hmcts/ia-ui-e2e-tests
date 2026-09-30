import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify legal rep user is able to raise a query', { tag: ['@functional'] }, () => {
  test.use({ storageState: config.exuiUsers.legalRepUser.sessionFile });
  let caseIdFromBeforeEach: string;

  test.beforeEach(async ({ exui_legalRepApiClient, exui_pages }) => {
    const caseId = await test.step('Legal rep Api: Submit an appeal', async () => {
      const caseId = await exui_legalRepApiClient.createAndSubmitAppealMasterApplication({
        appealType: 'Deprivation of citizenship',
        isAppellantInUk: 'Yes',
        appellantInUk: {
          isAppellantInDetention: 'No',
        },
        doesApplicantHaveASponsor: 'No',
        hearingType: 'Decision with a hearing',
        isAppellantStateless: 'No',
        isApplicationInTime: 'Yes',
        nationality: 'Solomon Islander',
      });
      return caseId;
    });

    await test.step('Legal rep: Navigate to case overview page on exui', async () => {
      await exui_pages.caseOverview.goTo({ caseId: caseId });
    });

    caseIdFromBeforeEach = caseId;
  });

  test('Verify legal rep user is able to raise a query and admin user is able to respond to the query', async ({
    exui_pages,
    dataUtils,
    newBrowserContextAndPage,
  }) => {
    const legalRepExuiPages = await test.step('Legal rep: Select Raise Query from the next steps dropdown and submit event', async () => {
      const legalRepExuiPages = exui_pages;
      await legalRepExuiPages.caseOverview.selectEventFromDropdown({ eventToSelect: 'Raise Query' });

      await legalRepExuiPages.query.verifyUserIsOnPage();
      await legalRepExuiPages.query.verifyAllTextOnPage();
      await legalRepExuiPages.query.completePageAndContinue({ queryOption: 'Raise a new query' });

      await legalRepExuiPages.raiseAQuery.verifyUserIsOnPage();
      await legalRepExuiPages.raiseAQuery.verifyAllTextOnPage();
      const dateOfHearing = await dataUtils.getDateFromToday({ dayOffset: 5 });
      await legalRepExuiPages.raiseAQuery.completePageAndContinue({
        querySubject: 'Test Query Subject',
        queryDetail: 'Test Query Detail',
        isHearingRelated: 'Yes',
        dateOfHearing: {
          day: dateOfHearing.day,
          month: dateOfHearing.month,
          year: dateOfHearing.year,
        },
        optionallyAttachDocument: 'Yes',
      });

      await legalRepExuiPages.raiseQuerySubmit.verifyUserIsOnPage();
      const hearingDate = new Date(dateOfHearing.year, dateOfHearing.month - 1, dateOfHearing.day);
      const formattedHearingDate = hearingDate
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .replace('Sept', 'Sep');
      await Promise.all([
        await expect(legalRepExuiPages.raiseQuerySubmit.$static.reviewQueryDetailsHeading).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$static.caseRecordHeading).toBeVisible(),

        await expect(legalRepExuiPages.raiseQuerySubmit.$questionLocator('Query detail')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Query subject')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Query subject')).toHaveText('Test Query Subject'),
        await expect(legalRepExuiPages.raiseQuerySubmit.$changeAnswerToQuestionLocator('Query subject')).toBeVisible(),

        await expect(legalRepExuiPages.raiseQuerySubmit.$changeAnswerToQuestionLocator('Query detail')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Query detail')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Query detail')).toHaveText('Test Query Detail'),
        await expect(legalRepExuiPages.raiseQuerySubmit.$changeAnswerToQuestionLocator('Query detail')).toBeVisible(),

        await expect(legalRepExuiPages.raiseQuerySubmit.$questionLocator('Is the query hearing related?')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Is the query hearing related?')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Is the query hearing related?')).toHaveText('Yes'),
        await expect(legalRepExuiPages.raiseQuerySubmit.$changeAnswerToQuestionLocator('Is the query hearing related?')).toBeVisible(),

        await expect(legalRepExuiPages.raiseQuerySubmit.$questionLocator('What is the date of the hearing?')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('What is the date of the hearing?')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('What is the date of the hearing?')).toHaveText(formattedHearingDate),
        await expect(legalRepExuiPages.raiseQuerySubmit.$changeAnswerToQuestionLocator('What is the date of the hearing?')).toBeVisible(),

        await expect(legalRepExuiPages.raiseQuerySubmit.$questionLocator('Upload a file to the query')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Upload a file to the query')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$changeAnswerToQuestionLocator('Upload a file to the query')).toBeVisible(),
        await expect(legalRepExuiPages.raiseQuerySubmit.$questionValueLocator('Upload a file to the query')).toHaveText('Raise_A_Query.txt'),
        await expect(legalRepExuiPages.raiseQuerySubmit.$changeAnswerToQuestionLocator('Upload a file to the query')).toBeVisible(),
      ]);

      await legalRepExuiPages.raiseQuerySubmit.submitEvent();

      await legalRepExuiPages.raiseQueryConfirm.verifyUserIsOnPage();
      await legalRepExuiPages.raiseQueryConfirm.verifyAllTextOnPage();
      await legalRepExuiPages.raiseQueryConfirm.goBackToCase();

      await legalRepExuiPages.caseOverview.verifyUserIsOnPage({});

      return legalRepExuiPages;
    });

    await test.step('Legal rep: Verify details of query submitted can be found in query tab', async () => {
      await legalRepExuiPages.caseOverview.navigateToTab({ tabToSelect: 'Queries' });

      const formattedSubmissionDate = new Date()
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        .replace('Sept', 'Sep');

      await legalRepExuiPages.queriesTab.verifyUserIsOnPage();
      await legalRepExuiPages.queriesTab.verifyTableHeadings();
      await legalRepExuiPages.queriesTab.verifyDetailsOfTableRow({
        querySubject: 'Test Query Subject',
        senderName: 'LR Bails Org',
        lastSubmittedBy: 'LR Bails Org',
        lastSubmissionDate: formattedSubmissionDate,
        responseStatus: 'Awaiting Response',
      });
    });

    const adminUserExuiPages = await test.step('Admin user: Navigate to tasks tab and confirm details of query task', async () => {
      const adminUserContextAndPage = await newBrowserContextAndPage({ user: 'adminOfficer' });
      const adminUserExuiPages = await exui_pages.newPageContext({ pageContext: adminUserContextAndPage });

      await adminUserExuiPages.caseOverview.goTo({ caseId: caseIdFromBeforeEach });
      await adminUserExuiPages.caseOverview.navigateToTab({ tabToSelect: 'Tasks' });

      await adminUserExuiPages.tasksTab.verifyUserIsOnPage({});
      await adminUserExuiPages.tasksTab.refreshPageUntilExpectedTaskIsVisible({ taskName: 'Respond to Query', timeoutInSeconds: 60 });

      await Promise.all([
        expect(adminUserExuiPages.tasksTab.$taskRowHeadingLocator({ taskName: 'Respond to Query', heading: 'Priority' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Priority' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Priority' })).toHaveText('high'),

        expect(adminUserExuiPages.tasksTab.$taskRowHeadingLocator({ taskName: 'Respond to Query', heading: 'Due date' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Due date' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Due date' })).toHaveText(
          new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        ),

        expect(adminUserExuiPages.tasksTab.$taskRowHeadingLocator({ taskName: 'Respond to Query', heading: 'Assigned to' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Assigned to' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Assigned to' })).toHaveText(
          'Unassigned',
        ),

        expect(adminUserExuiPages.tasksTab.$taskRowHeadingLocator({ taskName: 'Respond to Query', heading: 'Manage' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toContainText('Assign task'),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toContainText('Cancel task'),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toContainText(
          'Assign to me',
        ),

        expect(adminUserExuiPages.tasksTab.$taskRowHeadingLocator({ taskName: 'Respond to Query', heading: 'Next steps' })).not.toBeVisible(),
      ]);

      return adminUserExuiPages;
    });

    await test.step('Admin user: Assign query task to myself and verify task details have been updated', async () => {
      await adminUserExuiPages.tasksTab.selectOptionToManageTask({
        taskName: 'Respond to Query',
        manageTaskOptionToSelect: 'Assign to me',
      });

      await Promise.all([
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Assigned to' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Assigned to' })).toHaveText(
          'Admin4 Officer',
        ),

        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toContainText('Cancel task'),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toContainText(
          'Mark as done',
        ),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toContainText(
          'Reassign task',
        ),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Manage' })).toContainText(
          'Unassign task',
        ),

        expect(adminUserExuiPages.tasksTab.$taskRowHeadingLocator({ taskName: 'Respond to Query', heading: 'Next steps' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Next steps' })).toBeVisible(),
        expect(adminUserExuiPages.tasksTab.$taskRowValueLocator({ taskName: 'Respond to Query', rowHeading: 'Next steps' })).toHaveText(
          'Respond to a query',
        ),
      ]);
    });

    await test.step('Admin user: Respond to Query', async () => {
      await adminUserExuiPages.tasksTab.selectOptionFromNextSteps({ taskName: 'Respond to Query', nextStepsOptionToSelect: 'Respond to a query' });

      await adminUserExuiPages.respondToAQuery.verifyUserIsOnPage();
      await adminUserExuiPages.respondToAQuery.verifyAllStaticTextOnPage();
      const expectedDateOfHearing = await dataUtils.getDateFromToday({ dayOffset: 5 });
      const formattedExpectedDateOfHearing = new Date(expectedDateOfHearing.year, expectedDateOfHearing.month - 1, expectedDateOfHearing.day)
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .replace('Sept', 'Sep');

      await Promise.all([
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('Sender name')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Sender name')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Sender name')).toHaveText('LR Bails Org'),

        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('Last submitted by')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Last submitted by')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Last submitted by')).toHaveText('LR Bails Org'),

        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('Submission date')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Submission date')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Submission date')).toContainText(
          new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        ),

        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('Query subject')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Query subject')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Query subject')).toHaveText('Test Query Subject'),

        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('Query body')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Query body')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Query body')).toHaveText('Test Query Detail'),

        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('Is the query hearing related?')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Is the query hearing related?')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Is the query hearing related?')).toHaveText('Yes'),

        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('What is the date of the hearing?')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('What is the date of the hearing?')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('What is the date of the hearing?')).toHaveText(
          formattedExpectedDateOfHearing,
        ),

        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableHeadingLocator('Attachments')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Attachments')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuery.$queryDetailsTableValueLocator('Attachments')).toHaveText('Raise_A_Query.txt'),
      ]);

      await adminUserExuiPages.respondToAQuery.completePageAndContinue({
        responseDetail: 'Test Response Detail For Query',
        closeQuery: 'Yes',
        uploadFile: 'Yes',
      });

      await adminUserExuiPages.respondToAQuerySubmit.verifyUserIsOnPage();
      await Promise.all([
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionLocator('Submitted query')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Submitted query')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Submitted query')).toHaveText('Test Query Subject'),
        expect(adminUserExuiPages.respondToAQuerySubmit.$changeAnswerToQuestionLocator('Submitted query')).not.toBeVisible(),

        expect(adminUserExuiPages.respondToAQuerySubmit.$questionLocator('Response detail')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Response detail')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Response detail')).toHaveText('Test Response Detail For Query'),
        expect(adminUserExuiPages.respondToAQuerySubmit.$changeAnswerToQuestionLocator('Response detail')).toBeVisible(),

        expect(adminUserExuiPages.respondToAQuerySubmit.$questionLocator('Document attached')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Document attached')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Document attached')).toHaveText('Respond_To_A_Query.txt'),
        expect(adminUserExuiPages.respondToAQuerySubmit.$changeAnswerToQuestionLocator('Document attached')).toBeVisible(),

        expect(adminUserExuiPages.respondToAQuerySubmit.$questionLocator('Closing the query')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Closing the query')).toBeVisible(),
        expect(adminUserExuiPages.respondToAQuerySubmit.$questionValueLocator('Closing the query')).toHaveText('I want to close this query'),
        expect(adminUserExuiPages.respondToAQuerySubmit.$changeAnswerToQuestionLocator('Closing the query')).toBeVisible(),
      ]);
      await adminUserExuiPages.respondToAQuerySubmit.submitEvent();

      await adminUserExuiPages.respondToAQueryConfirm.verifyUserIsOnPage();
      await adminUserExuiPages.respondToAQueryConfirm.verifyAllTextOnPage();
      await adminUserExuiPages.respondToAQueryConfirm.goBackToCase();

      await adminUserExuiPages.caseOverview.verifyUserIsOnPage({});
    });

    await test.step('Legal rep: Refresh query tab and verify the query status has been updated to Closed', async () => {
      await legalRepExuiPages.queriesTab.page.bringToFront();

      await legalRepExuiPages.queriesTab.verifyUserIsOnPage();
      await legalRepExuiPages.queriesTab.refreshPageUntilQueryStatusHasBeenUpdated({ querySubject: 'Test Query Subject', queryStatus: 'Closed' });
      const formattedTodaysDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');
      await legalRepExuiPages.queriesTab.verifyDetailsOfTableRow({
        querySubject: 'Test Query Subject',
        senderName: 'LR Bails Org',
        lastSubmittedBy: 'Admin4 Officer',
        lastSubmissionDate: formattedTodaysDate,
        lastResponseDate: formattedTodaysDate,
        responseStatus: 'Closed',
      });
    });

    await test.step('Legal rep: Select query and verify details of query and response from admin user', async () => {
      await legalRepExuiPages.queriesTab.selectAQueryToView({ querySubject: 'Test Query Subject' });

      await legalRepExuiPages.queriesTabQueryDetails.verifyUserIsOnPage();
      await legalRepExuiPages.queriesTabQueryDetails.verifyAllStaticTextOnPage();
      const formattedTodaysDate1 = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const dateOfHearing = await dataUtils.getDateFromToday({ dayOffset: 5 });
      const formattedDateOfHearing = new Date(dateOfHearing.year, dateOfHearing.month - 1, dateOfHearing.day)
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .replace('Sept', 'Sep');

      await Promise.all([
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('Sender name')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Sender name')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Sender name')).toHaveText('LR Bails Org'),

        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('Last submitted by')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Last submitted by')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Last submitted by')).toHaveText('Admin4 Officer'),

        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('Submission date')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Submission date')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Submission date')).toContainText(formattedTodaysDate1),

        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('Query subject')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Query subject')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Query subject')).toHaveText('Test Query Subject'),

        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('Query body')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Query body')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Query body')).toHaveText('Test Query Detail'),

        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('Is the query hearing related?')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Is the query hearing related?')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Is the query hearing related?')).toHaveText('Yes'),

        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('What is the date of the hearing?')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('What is the date of the hearing?')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('What is the date of the hearing?')).toHaveText(
          formattedDateOfHearing,
        ),

        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionLocator('Attachments')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Attachments')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$queryDetailsQuestionValueLocator('Attachments')).toHaveText('Raise_A_Query.txt'),

        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionLocator('Last response date')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionValueLocator('Last response date')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionValueLocator('Last response date')).toContainText(formattedTodaysDate1),

        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionLocator('Response detail')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionValueLocator('Response detail')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionValueLocator('Response detail')).toHaveText(
          'Test Response Detail For Query',
        ),

        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionLocator('Attachments')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionValueLocator('Attachments')).toBeVisible(),
        expect(legalRepExuiPages.queriesTabQueryDetails.$responseQuestionValueLocator('Attachments')).toHaveText('Respond_To_A_Query.txt'),

        expect(legalRepExuiPages.queriesTabQueryDetails.$static.theQueryHasBeenClosedText).toBeVisible(),
      ]);
    });
  });
});
