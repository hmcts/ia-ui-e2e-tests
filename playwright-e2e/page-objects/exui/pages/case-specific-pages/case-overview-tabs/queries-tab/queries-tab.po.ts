import { Page, Locator, expect } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';

export class QueriesTabPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly firstTableRowLocator = this.page.locator('tr[class*="govuk-table__row query-list"]').first();
  public readonly $interactive = {
    querySubjectButton: this.firstTableRowLocator.getByRole('button', { name: 'Query subject' }),
    senderNameButton: this.firstTableRowLocator.getByRole('button', { name: 'Sender Name' }),
    lastSubmittedByButton: this.firstTableRowLocator.getByRole('button', { name: 'Last submitted by' }),
    lastSubmissionDateButton: this.firstTableRowLocator.getByRole('button', { name: 'Last submission date' }),
    lastResponseDateButton: this.firstTableRowLocator.getByRole('button', { name: 'Last response date' }),
    responseStatusButton: this.firstTableRowLocator.getByRole('button', { name: 'Response status' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.$commonElements.caseRecordHeading,
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '#Queries',
      pageHeading: this.$static.pageHeading,
    });

    await expect(this.page.getByRole('tab', { name: 'Queries', exact: true })).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });
  }

  public async verifyTableHeadings(): Promise<void> {
    await Promise.all([
      expect(this.$interactive.querySubjectButton).toBeVisible(),
      expect(this.$interactive.senderNameButton).toBeVisible(),
      expect(this.$interactive.lastSubmittedByButton).toBeVisible(),
      expect(this.$interactive.lastSubmissionDateButton).toBeVisible(),
      expect(this.$interactive.lastResponseDateButton).toBeVisible(),
      expect(this.$interactive.responseStatusButton).toBeVisible(),
    ]);
  }

  public async verifyDetailsOfTableRow(options: {
    querySubject: string;
    senderName: string;
    lastSubmittedBy: string;
    lastSubmissionDate: string;
    lastResponseDate?: string;
    responseStatus: 'Awaiting Response' | 'Responded' | 'Closed';
  }): Promise<void> {
    const tableRowLocator = this.page.locator('tr[class*="govuk-table__row query-list"]', {
      hasText: options.querySubject,
    });
    const querySubjectValue = tableRowLocator.locator('td[class*="govuk-table__cell query-list"]').nth(0);
    const senderNameValue = tableRowLocator.locator('td[class*="govuk-table__cell query-list"]').nth(1);
    const lastSubmittedByValue = tableRowLocator.locator('td[class*="govuk-table__cell query-list"]').nth(2);
    const lastSubmissionDateValue = tableRowLocator.locator('td[class*="govuk-table__cell query-list"]').nth(3);
    const lastResponseDateValue = tableRowLocator.locator('td[class*="govuk-table__cell query-list"]').nth(4);
    const responseStatusValue = tableRowLocator.locator('td[class*="govuk-table__cell query-list"]').nth(5);

    await Promise.all([
      expect(querySubjectValue).toBeVisible(),
      expect(querySubjectValue).toHaveText(options.querySubject),
      expect(senderNameValue).toBeVisible(),
      expect(senderNameValue).toHaveText(options.senderName),
      expect(lastSubmittedByValue).toBeVisible(),
      expect(lastSubmittedByValue).toHaveText(options.lastSubmittedBy),
      expect(lastSubmissionDateValue).toBeVisible(),
      expect(lastSubmissionDateValue).toContainText(options.lastSubmissionDate),
      expect(lastResponseDateValue).toBeVisible(),
      expect(lastResponseDateValue).toContainText(options.lastResponseDate ? options.lastResponseDate : ''),
      expect(responseStatusValue).toBeVisible(),
      expect(responseStatusValue).toHaveText(options.responseStatus),
    ]);
  }

  public async refreshPageUntilQueryStatusHasBeenUpdated(options: {
    querySubject: string;
    queryStatus: 'Responded' | 'Closed';
    timeoutInSeconds?: number;
  }): Promise<void> {
    const timeout = options.timeoutInSeconds ? options.timeoutInSeconds * 1000 : 45_000;
    const pageUrl = this.page.url();
    expect(pageUrl).toContain('#Queries');

    const tableRowLocator = this.page.locator('tr[class*="govuk-table__row query-list"]', {
      hasText: options.querySubject,
    });
    const responseStatusValue = tableRowLocator.locator('td[class*="govuk-table__cell query-list"]').nth(5);

    await expect(async () => {
      if (!this.page.url().includes('#Queries')) {
        await this.page.goto(pageUrl);
        await this.verifyUserIsOnPage();
      } else {
        await this.page.reload();
        await this.verifyUserIsOnPage();
      }

      await expect(responseStatusValue).toHaveText(options.queryStatus, { timeout: 5_000 });
    }).toPass({
      timeout,
      intervals: [1_000],
    });
  }

  public async selectAQueryToView(options: { querySubject: string }): Promise<void> {
    const queryLocatory = this.page.locator('tr[class*="govuk-table__row query-list"]').getByText(options.querySubject);

    await expect(async () => {
      if (await queryLocatory.isVisible()) {
        queryLocatory.click();
      }
      await expect(queryLocatory).not.toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
