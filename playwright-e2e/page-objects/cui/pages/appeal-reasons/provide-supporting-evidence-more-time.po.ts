import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { DataUtils } from '../../../../utils';

export class ProvideSupportingEvidenceMoreTimePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private dataUtils = new DataUtils();

  public readonly $interactive = {
    chooseFileToUploadInput: this.page.locator('input[id="file-upload"]'),
    uploadFileButton: this.page.locator('button[name="uploadFile"]'),
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly adviceForSupportingEvidenceText = this.page.getByText('Advice');
  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Provide supporting evidence', exact: true }),
    fileUploadedTableRow: this.page.locator('table[id="files-uploaded"] a[class="govuk-link"]').filter({ hasNotText: 'Delete' }),
    adviceForSupportingEvidenceText: this.adviceForSupportingEvidenceText,
    adviceBulletPoint1: this.adviceForSupportingEvidenceText.locator('+ ul li').nth(0),
    adviceBulletPoint2: this.adviceForSupportingEvidenceText.locator('+ ul li').nth(1),
    adviceBulletPoint3: this.adviceForSupportingEvidenceText.locator('+ ul li').nth(2),
    uploadFileText: this.page.getByText('Select a file', { exact: true }),
    uploadedFileText: this.page.locator('table[id="files-uploaded"] [class="govuk-table__header"]'),
    noFilesUploadedText: this.page.locator('td[class="govuk-table__cell"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'provide-supporting-evidence-more-time', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.adviceForSupportingEvidenceText).toHaveText('Advice on providing supporting evidence'),
      expect(this.$static.adviceForSupportingEvidenceText).toBeVisible(),

      expect(this.$static.adviceBulletPoint1).toHaveText('It will be helpful to read our information about supporting evidence'),
      expect(this.$static.adviceBulletPoint1).toBeVisible(),

      expect(this.$static.adviceBulletPoint2).toHaveText(
        'You can upload evidence to support your appeal such as letters, photos and documents. If you are taking a picture of a letter, place it on a flat surface and take the picture from above',
      ),
      expect(this.$static.adviceBulletPoint2).toBeVisible(),

      expect(this.$static.adviceBulletPoint3).toHaveText(
        'If you provide evidence that is not in English, you must also provide an English translation of that evidence',
      ),
      expect(this.$static.adviceBulletPoint3).toBeVisible(),

      expect(this.$static.uploadFileText).toBeVisible(),

      expect(this.$static.uploadedFileText).toHaveText('Uploaded file'),
      expect(this.$static.uploadedFileText).toBeVisible(),

      expect(this.$static.noFilesUploadedText).toHaveText('No files uploaded'),
      expect(this.$static.noFilesUploadedText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Provide_Supporting_Evidence_For_More_Time.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await expect(async () => {
      await Promise.all([
        this.interceptNetworkRequestToVerifySupportingEvidenceUploaded({ timeoutMs: 15_000 }),
        this.$interactive.uploadFileButton.click(),
      ]);
    }).toPass({ intervals: [1_000], timeout: 30_000 });

    await expect(this.$static.fileUploadedTableRow.filter({ hasText: fileToUpload })).toBeVisible();
    await this.navigationClick(this.$interactive.continueButton);
  }

  private async interceptNetworkRequestToVerifySupportingEvidenceUploaded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('provide-supporting-evidence-more-time'),
      {
        timeout: options.timeoutMs,
      },
    );

    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  }
}
