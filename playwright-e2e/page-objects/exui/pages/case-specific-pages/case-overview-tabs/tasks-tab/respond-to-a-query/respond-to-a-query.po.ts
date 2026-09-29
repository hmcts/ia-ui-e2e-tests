import { expect, type Locator, type Page } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';
import { UiDocumentUploadHelper } from '../../../../../../../utils/ui-document-upload-helper';
import { YesOrNoType } from '../../../../../../../citizen-types';

type RespondToAQueryPageOptions = {
  responseDetail: string;
  closeQuery?: YesOrNoType;
  uploadFile: YesOrNoType;
  nameOfFileToUpload?: string;
};

type QueryDetailsTableHeadingType =
  | 'Sender name'
  | 'Last submitted by'
  | 'Submission date'
  | 'Query subject'
  | 'Query body'
  | 'Is the query hearing related?'
  | 'What is the date of the hearing?'
  | 'Attachments';

export class RespondToAQueryPage extends ExuiBase {
  private readonly uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    responseDetailTextArea: this.page.locator('textarea[id="body"]'),
    closeQueryCheckBox: this.page.locator('input[id="closeQuery"]'),
    chooseFileToUpload: this.page.locator('input[id="documentCollection_value"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    previousButton: this.$commonElements.previousButton,
    continueButton: this.$commonElements.continueButton,
    addNewDocumentButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    cancelAndReturnToTasksLink: this.page.getByRole('link', { name: 'Cancel and return to tasks' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('div.govuk-caption-l', { hasText: 'Respond to a query' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Query details', exact: true }),
    respondToAQueryHeading: this.page.getByRole('heading', { level: 1, name: 'Respond to a query', exact: true }),
    responseDetailLabel: this.page.locator('label[for="body"]'),
    closingTheQueryHeading: this.page.getByRole('heading', { level: 2, name: 'Closing the query', exact: true }),
    closeQueryLabel: this.page.locator('label[for="closeQuery"]'),
    closingTheQueryWarningMessage: this.page.locator('p.qm-service-message strong'),
    attachDocumentHeading: this.page.getByRole('heading', { level: 2, name: 'Attach a document to this query (Optional)', exact: true }),
    attachDocumentHint: this.page.locator('[id="documentCollection"] span[class="form-hint"]'),
    attachADocumentToQueryHeading: this.page.getByRole('heading', { level: 3, name: 'Attach a document to this query', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/query-management/query/',
      pageHeading: this.$static.pageHeading,
    });
  }

  public $queryDetailsTableHeadingLocator = (queryDetailsTableHeading: QueryDetailsTableHeadingType): Locator =>
    this.page.locator('table[aria-describedby="Details of the query"]').getByText(queryDetailsTableHeading, { exact: true });

  public $queryDetailsTableValueLocator(queryDetailsTableHeading: QueryDetailsTableHeadingType): Locator {
    return this.page
      .locator('table[aria-describedby="Details of the query"] tr[class*="govuk-table__row"]', { hasText: queryDetailsTableHeading })
      .locator('td[class*="govuk-table__cell"]');
  }

  public async verifyAllStaticTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.respondToAQueryHeading).toBeVisible(),
      expect(this.$static.responseDetailLabel).toBeVisible(),
      expect(this.$static.responseDetailLabel).toHaveText('Response detail'),
      expect(this.$static.closingTheQueryHeading).toBeVisible(),
      expect(this.$static.closeQueryLabel).toBeVisible(),
      expect(this.$static.closeQueryLabel).toHaveText('I want to close this query'),
      expect(this.$static.closingTheQueryWarningMessage).toBeVisible(),
      expect(this.$static.closingTheQueryWarningMessage).toHaveText(
        'Closing this query means the parties can no longer send messages in this thread.',
      ),
      expect(this.$static.attachDocumentHeading).toBeVisible(),
      expect(this.$static.attachDocumentHint).toBeVisible(),
      expect(this.$static.attachDocumentHint).toHaveText(
        'Only attach documents related to your query. For all other documents use your case management document upload function.',
      ),
      expect(this.$interactive.previousButton).toBeVisible(),
      expect(this.$interactive.continueButton).toBeVisible(),
      expect(this.$interactive.cancelAndReturnToTasksLink).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: RespondToAQueryPageOptions): Promise<void> {
    await this.$inputs.responseDetailTextArea.fill(options.responseDetail);
    await expect(this.$inputs.responseDetailTextArea).toHaveValue(options.responseDetail);

    if (options.closeQuery === 'Yes') {
      await this.$inputs.closeQueryCheckBox.check();
      await expect(this.$inputs.closeQueryCheckBox).toBeChecked();
    }

    if (options.uploadFile === 'Yes') {
      const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Respond_To_A_Query.txt';
      await this.$interactive.addNewDocumentButton.click();
      await expect(this.$static.attachADocumentToQueryHeading).toBeVisible();

      await this.uiDocumentUploadHelper.uploadExuiDocument({
        fileInputElement: this.$inputs.chooseFileToUpload,
        nameOfFileToUpload: fileToUpload,
      });
    }

    await expect(async () => {
      if (await this.$static.pageHeading.isVisible()) {
        this.$interactive.continueButton.click();
      }
      await expect(this.$static.pageHeading).not.toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
