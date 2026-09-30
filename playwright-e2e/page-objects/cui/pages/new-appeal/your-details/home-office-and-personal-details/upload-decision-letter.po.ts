import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { DataUtils } from '../../../../../../utils';

export class UploadDecisionLetterPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private dataUtils = new DataUtils();

  public readonly $interactive = {
    chooseFileToUploadInput: this.page.locator('input[id="file-upload"]'),
    uploadFileButton: this.page.locator('button[name="uploadFile"]'),
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Upload your Home Office decision letter',
    }),
    fileUploadedTableRow: this.page.locator('table[id="files-uploaded"] a[class="govuk-link"]').filter({ hasNotText: 'Delete' }),
    decisionByEmailHeading: this.page.getByRole('heading', { level: 2 }).filter({ hasText: 'email' }),
    decisionByEmailText: this.page.locator('p', { hasText: 'attached to the email.' }),
    decisionByPostHeading: this.page.getByRole('heading', { level: 2 }).filter({ hasText: 'post' }),
    decisionByPostText: this.page.locator('p', { hasText: 'If you have a smartphone' }),
    uploadFileText: this.page.getByText('Select a file', { exact: true }),
    uploadedFileText: this.page.locator('table[id="files-uploaded"] [class="govuk-table__header"]'),
    noFilesUploadedText: this.page.locator('td[class="govuk-table__cell"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'home-office-upload-decision-letter', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.decisionByEmailHeading).toHaveText('If you got your decision by email'),
      expect(this.$static.decisionByEmailHeading).toBeVisible(),

      expect(this.$static.decisionByEmailText).toHaveText('Upload the decision letter attached to the email.'),
      expect(this.$static.decisionByEmailText).toBeVisible(),

      expect(this.$static.decisionByPostHeading).toHaveText('If you got your decision by post'),
      expect(this.$static.decisionByPostHeading).toBeVisible(),

      expect(this.$static.decisionByPostText).toHaveText(
        'If you have a smartphone, you can use a scanner app to create a single document to upload. Or you can scan or take a photo of each page and upload each file individually.',
      ),
      expect(this.$static.decisionByPostText).toBeVisible(),

      expect(this.$static.uploadFileText).toBeVisible(),

      expect(this.$static.uploadedFileText).toHaveText('Uploaded file'),
      expect(this.$static.uploadedFileText).toBeVisible(),

      expect(this.$static.noFilesUploadedText).toHaveText('No files uploaded'),
      expect(this.$static.noFilesUploadedText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Decision_Letter.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await expect(async () => {
      await Promise.all([
        this.interceptNetworkRequestToVerifyUploadDecisionLetterSucceeded({ timeoutMs: 15_000 }),
        this.$interactive.uploadFileButton.click(),
      ]);
    }).toPass({ intervals: [1_000], timeout: 30_000 });

    await expect(this.$static.fileUploadedTableRow.filter({ hasText: fileToUpload })).toBeVisible();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }

  private async interceptNetworkRequestToVerifyUploadDecisionLetterSucceeded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('home-office-upload-decision-letter/upload'),
      { timeout: options.timeoutMs },
    );

    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  }
}
