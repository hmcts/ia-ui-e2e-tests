import { Page, Locator, expect } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';
import { CaseOverviewPage } from '../../../index';

type AvailableTasksType = 'Respond to Query' | 'Review the appeal';
type TaskHeadingsType = 'Priority' | 'Due date' | 'Assigned to' | 'Manage' | 'Next steps';
type ManageTaskOptionsType = 'Assign task' | 'Cancel task' | 'Assign to me' | 'Mark as done' | 'Reassign task' | 'Unassign task';
type NextStepsOptionsType = 'Respond to a query';

export class TasksTabPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }
  private readonly caseOverviewPage = new CaseOverviewPage(this.page);

  public $taskRowHeadingLocator(options: { taskName: AvailableTasksType; heading: TaskHeadingsType }): Locator {
    const findTaskLocator = this.page.locator('exui-case-task', { hasText: options.taskName });
    return findTaskLocator.locator('[class="govuk-summary-list__key"]', { hasText: options.heading });
  }

  public $taskRowValueLocator(options: { taskName: AvailableTasksType; rowHeading: TaskHeadingsType }): Locator {
    const findTaskLocator = this.page.locator('exui-case-task', { hasText: options.taskName });
    const findRelevantRow = findTaskLocator.locator('[class*="govuk-summary-list__row"]', { hasText: options.rowHeading });
    return findRelevantRow.locator('[class="govuk-summary-list__value"]');
  }

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 2, name: 'Active tasks' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(options: { timeoutMs?: number }): Promise<void> {
    options.timeoutMs = options.timeoutMs ?? 30_000;

    await this.verifyUserIsOnExpectedPage({
      urlPath: '#Tasks',
      pageHeading: this.$static.pageHeading,
      timeout: options.timeoutMs,
    });

    await expect(this.page.getByRole('tab', { name: 'Tasks', exact: true })).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });
  }

  public async selectOptionToManageTask(options: { taskName: AvailableTasksType; manageTaskOptionToSelect: ManageTaskOptionsType }): Promise<void> {
    const findTaskLocator = this.page.locator('exui-case-task', { hasText: options.taskName });
    const manageCaseOptionToSelect = findTaskLocator.locator('a', { hasText: options.manageTaskOptionToSelect });
    await manageCaseOptionToSelect.click();
  }

  public async selectOptionFromNextSteps(options: { taskName: AvailableTasksType; nextStepsOptionToSelect: NextStepsOptionsType }): Promise<void> {
    const findTaskLocator = this.page.locator('exui-case-task', { hasText: options.taskName });
    const nextStepsOptionToSelect = findTaskLocator.locator('a', { hasText: options.nextStepsOptionToSelect });
    await this.navigationClick(nextStepsOptionToSelect);
  }

  public async refreshPageUntilExpectedTaskIsVisible(options: { taskName: AvailableTasksType; timeoutInSeconds?: number }): Promise<void> {
    const timeout = options.timeoutInSeconds ? options.timeoutInSeconds * 1000 : 45_000;
    const pageUrl = this.page.url();
    expect(pageUrl).toContain('#Tasks');
    const findTaskLocator = this.page.locator('exui-case-task', { hasText: options.taskName });

    await expect(async () => {
      if (await findTaskLocator.isVisible()) {
        return;
      } else {
        await this.navigateToTab({ tabToSelect: 'Overview' });
        await this.caseOverviewPage.verifyUserIsOnPage({ timeoutMs: 10_000 });
        await this.page.goto(pageUrl);
        await this.verifyUserIsOnPage({});

        await expect(findTaskLocator).toBeVisible({ timeout: 5_000 });
      }
    }).toPass({
      timeout,
      intervals: [1_000],
    });
  }
}
