import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../cui-base';

export class CaseListPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    createANewAppealButton: this.page.locator('button[id="create-new-appeal"]'),
    confirmCreateNewAppealButton: this.page.locator('button[id="confirm-create-modal-confirm"]'),
    cancelCreateNewAppealButton: this.page.locator('button[id="confirm-create-modal-cancel"]'),
    confirmDeleteDraftAppealButton: this.page.locator('button[id="delete-draft-modal-confirm"]'),
    cancelDeleteDraftAppealButton: this.page.locator('button[id="delete-draft-modal-cancel"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Appeal list', level: 1, exact: true }),
    noAppealsText: this.page.getByText('You do not have any appeals.', { exact: true }),
    confirmCreateModalHeading: this.page.getByRole('heading', {
      name: 'Are you sure you want to create a new appeal?',
      level: 2,
      exact: true,
    }),
    confirmCreateModalDescription: this.page.locator('p[id="confirm-create-modal-description"]'),
    deleteDraftModalHeading: this.page.getByRole('heading', {
      name: 'Are you sure you want to delete this draft appeal?',
      level: 2,
      exact: true,
    }),
    deleteDraftModalDescription: this.page.locator('p[id="delete-draft-modal-description"]'),
    appealReferenceHeading: this.page.getByText('Appeal reference', { exact: true }),
    caseReferenceHeading: this.page.getByText('Case reference', { exact: true }),
    appellantHeading: this.page.getByText('Appellant', { exact: true }),
    statusHeading: this.page.getByText('Status', { exact: true }),
    optionsHeading: this.page.getByText('Options', { exact: true }),
  } as const satisfies Record<string, Locator>;

  private $appealRow(searchTerm: string): Locator {
    return this.page.locator('tr', { hasText: searchTerm });
  }

  private $viewAppealLink(searchTerm: string): Locator {
    return this.$appealRow(searchTerm).getByRole('link', { name: 'View', exact: true });
  }

  private $deleteDraftAppealButton(searchTerm: string): Locator {
    return this.$appealRow(searchTerm).getByRole('button', { name: 'Delete', exact: true });
  }

  public async verifyUserIsOnPage(options: { timeoutMs?: number } = {}): Promise<void> {
    const timeoutMs = options.timeoutMs ?? 30_000;
    await this.verifyUserIsOnExpectedPage({ urlPath: '/cases-list', pageHeading: this.$static.pageHeading, timeout: timeoutMs });
  }

  public async verifyNoAppealsTextOnPage(): Promise<void> {
    await expect(this.$static.noAppealsText).toBeVisible();
  }

  public async createNewAppeal(): Promise<void> {
    await expect(this.$interactive.createANewAppealButton).toBeVisible();
    await expect(this.$interactive.createANewAppealButton).toBeEnabled();

    await expect(async () => {
      if (await this.$static.confirmCreateModalHeading.isVisible()) {
        return;
      }

      await this.$interactive.createANewAppealButton.click();
      await expect(this.$static.confirmCreateModalHeading).toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });

    await expect(this.$static.confirmCreateModalDescription).toBeVisible();
    await expect(this.$static.confirmCreateModalDescription).toHaveText(
      'You can only have 5 draft appeals at one time. If you have more than this, you will need to submit or delete some first.',
    );

    await this.navigationClick(this.$interactive.confirmCreateNewAppealButton);
  }

  public async viewExistingApplication(options: { searchTerm: string }): Promise<void> {
    await expect(this.$viewAppealLink(options.searchTerm)).toBeVisible();
    await this.navigationClick(this.$viewAppealLink(options.searchTerm));
  }

  public async deleteExistingDraftApplication(options: { searchTerm: string }): Promise<void> {
    await expect(this.$deleteDraftAppealButton(options.searchTerm)).toBeVisible();
    await expect(this.$deleteDraftAppealButton(options.searchTerm)).toBeEnabled();
    await this.$deleteDraftAppealButton(options.searchTerm).click();

    await Promise.all([
      expect(this.$static.deleteDraftModalHeading).toBeVisible(),
      expect(this.$static.deleteDraftModalDescription).toBeVisible(),
      expect(this.$static.deleteDraftModalDescription).toContainText(options.searchTerm),
    ]);

    await this.$interactive.confirmDeleteDraftAppealButton.click();
    await expect(this.$appealRow(options.searchTerm)).not.toBeVisible();
  }

  public async verifyAppealDetails(options: {
    appealReference: string;
    caseReference: string | RegExp;
    applicantName: string;
    appealStatus: 'DRAFT' | 'Payment pending';
  }): Promise<void> {
    const tableRow = this.$appealRow(options.applicantName);

    const appealReferenceValue = tableRow.locator('td').nth(0);
    const caseReferenceValue = tableRow.locator('td').nth(1);
    const appellantNameValue = tableRow.locator('td').nth(2);
    const appealStatusValue = tableRow.locator('td').nth(3);
    const optionsValue = tableRow.locator('td').nth(4);

    await Promise.all([
      expect(this.$static.appealReferenceHeading).toBeVisible(),
      expect(this.$static.caseReferenceHeading).toBeVisible(),
      expect(this.$static.appellantHeading).toBeVisible(),
      expect(this.$static.statusHeading).toBeVisible(),
      expect(this.$static.optionsHeading).toBeVisible(),

      expect(appealReferenceValue).toBeVisible(),
      expect(appealReferenceValue).toHaveText(options.appealReference),

      expect(caseReferenceValue).toBeVisible(),
      expect(caseReferenceValue).toHaveText(options.caseReference),

      expect(appellantNameValue).toBeVisible(),
      expect(appellantNameValue).toHaveText(options.applicantName),

      expect(appealStatusValue).toBeVisible(),
      expect(appealStatusValue).toHaveText(options.appealStatus),

      expect(optionsValue).toBeVisible(),
    ]);

    if (options.appealStatus === 'DRAFT') {
      await expect(optionsValue).toHaveText(
        `View
      Delete`,
        { useInnerText: true },
      );
    } else {
      await expect(optionsValue).toHaveText('View');
    }
  }
}
