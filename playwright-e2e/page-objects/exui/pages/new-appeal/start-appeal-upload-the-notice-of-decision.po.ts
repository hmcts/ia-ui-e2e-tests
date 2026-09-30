import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { UiDocumentUploadHelper } from '../../../../utils/ui-document-upload-helper';

export class StartAppealUploadTheNoticeOfDecisionPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $inputs = {
    describeDocumentTextArea: this.page.locator('textarea[id^="uploadTheNoticeOfDecisionDocs_"][id$="_description"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    addNewButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    removeButton: this.page.locator('button', { hasText: 'Remove' }),
    chooseFileButton: this.page.locator('input[id^="uploadTheNoticeOfDecisionDocs_"][id$="_document"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload the Notice of Decision', exact: true }),
    noticeOfDecisionTipsParagraph: this.page.locator('[id="uploadTheNoticeOfDecisionTips"] p'),
    noticeOfDecisionHeading: this.page.getByRole('heading', { level: 2, name: 'Notice of Decision', exact: true }),
    noticeOfDecisionRequiredText: this.page.locator('[id="uploadTheNoticeOfDecisionDocs"] span.error-message'),
    uploadFileLabel: this.page.locator('label[for^="uploadTheNoticeOfDecisionDocs_"][for$="_document"]'),
    describeDocumentLabel: this.page.locator('label[for^="uploadTheNoticeOfDecisionDocs_"][for$="_description"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealuploadTheNoticeOfDecision',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.noticeOfDecisionTipsParagraph).toBeVisible(),
      expect(this.$static.noticeOfDecisionTipsParagraph).toHaveText(
        'You must upload the Notice of Decision. If it is not possible, you must provide a valid reason.',
      ),
      expect(this.$static.noticeOfDecisionHeading).toBeVisible(),
      expect(this.$static.noticeOfDecisionRequiredText).toBeVisible(),
      expect(this.$static.noticeOfDecisionRequiredText).toHaveText('Notice of Decision is required'),
    ]);
  }

  public async completePageAndContinue(options: { description?: string; nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Upload_The_Notice_Of_Decision.txt';

    await this.$interactive.addNewButton.click();

    await Promise.all([
      expect(this.$interactive.removeButton).toBeVisible(),
      expect(this.$static.uploadFileLabel).toBeVisible(),
      expect(this.$static.uploadFileLabel).toHaveText('Document'),
      expect(this.$interactive.chooseFileButton).toBeVisible(),
      expect(this.$interactive.cancelUploadButton).toBeVisible(),
      expect(this.$static.describeDocumentLabel).toBeVisible(),
      expect(this.$static.describeDocumentLabel).toHaveText('Describe the document'),
      expect(this.$inputs.describeDocumentTextArea).toBeVisible(),
    ]);

    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$interactive.chooseFileButton,
      nameOfFileToUpload: fileToUpload,
    });

    if (options.description) {
      await this.$inputs.describeDocumentTextArea.fill(options.description);
      await expect(this.$inputs.describeDocumentTextArea).toHaveValue(options.description);
    } else {
      await expect(this.$inputs.describeDocumentTextArea).toBeEmpty();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
