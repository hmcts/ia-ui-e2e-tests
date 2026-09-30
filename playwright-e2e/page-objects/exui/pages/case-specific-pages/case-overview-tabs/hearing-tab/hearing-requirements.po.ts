import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type hearingRequirementsType =
  | 'Step free / wheelchair access'
  | 'Hearing loop (hearing enhancement system)'
  | 'Sign Language Interpreter'
  | 'Language Interpreter';

export class HearingRequirementsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Hearing requirements', exact: true }),
    anyReasonableAdjustmentsText: this.page.getByText('Any reasonable adjustments on this page will be included in the hearing request.', {
      exact: true,
    }),
    reviewCaseFlagsText: this.page.getByText('Review   case flags and reasonable adjustments (opens in new tab)  if you need to make any changes.', {
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearings/request/hearing-requirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyTextForApplicant(options: { applicantName: string }): Promise<void> {
    await Promise.all([
      expect(this.page.getByText(`Request a hearing for ${options.applicantName}`, { exact: true })).toBeVisible(),
      expect(this.$static.anyReasonableAdjustmentsText).toBeVisible(),
      expect(this.$static.reviewCaseFlagsText).toBeVisible(),
    ]);
  }

  public async verifyTableHeadingsForIndividual(options: { name: string }): Promise<void> {
    const tableLocator = this.page.locator('table', { hasText: options.name });
    await Promise.all([
      expect(tableLocator.locator('th').nth(0)).toBeVisible(),
      expect(tableLocator.locator('th').nth(0)).toHaveText(options.name),
      expect(tableLocator.locator('th').nth(1)).toBeVisible(),
      expect(tableLocator.locator('th').nth(1)).toHaveText('Comments'),
      expect(tableLocator.locator('th').nth(2)).toBeVisible(),
      expect(tableLocator.locator('th').nth(2)).toHaveText('Flag status'),
    ]);
  }

  public async verifyRequirementRequestedByIndividual(options: {
    name: string;
    requirementRequested: hearingRequirementsType;
    comments?: string;
    flagStatus: 'ACTIVE';
  }): Promise<void> {
    const tableLocator = this.page.locator('table', { hasText: options.name });
    const tableRowLocator = tableLocator.locator(`tr:has(:text-is("${options.requirementRequested}"))`);
    await Promise.all([
      /* eslint-disable playwright/missing-playwright-await */
      expect(tableRowLocator.locator('td').nth(0)).toBeVisible(),
      expect(tableRowLocator.locator('td').nth(0)).toHaveText(options.requirementRequested),
      ...(options.comments
        ? [expect(tableRowLocator.locator('td').nth(1)).toBeVisible(), expect(tableRowLocator.locator('td').nth(1)).toHaveText(options.comments)]
        : [expect(tableRowLocator.locator('td').nth(1)).toBeEmpty()]),
      expect(tableRowLocator.locator('td').nth(2)).toBeVisible(),
      expect(tableRowLocator.locator('td').nth(2)).toHaveText(options.flagStatus, { ignoreCase: true }),
    ]);
  }

  public async continueOnToNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
