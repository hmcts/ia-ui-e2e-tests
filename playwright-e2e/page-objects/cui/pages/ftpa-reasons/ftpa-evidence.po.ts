import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { DataUtils } from '../../../../utils';

export class FtpaEvidencePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private dataUtils = new DataUtils();
  public readonly $interactive = {
    chooseFileToUploadInput: this.page.locator('input[id="file-upload"]'),
    uploadFileButton: this.page.locator('button[name="uploadFile"]'),
    continueButton: this.page.getByRole('button', {
      name: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Provide supporting evidence', level: 1, exact: true }),
    fileUploadedTableRow: this.page.locator('table[id="files-uploaded"] a[class="govuk-link"]').filter({ hasNotText: 'Delete' }),
    adviceOnProvidingEvidenceText: this.page.getByText('Advice on providing supporting evidence', { exact: true }),
    adviceOnprovidingEvidenceBulletPoint: this.page.locator('ul[class*="govuk-list--bullet"] li'),
    uploadAfileLabel: this.page.locator('label[for="file-upload"]'),
    uploadedFileHeader: this.page.locator('table[id="files-uploaded"] [class*="header"]'),
    noFilesUploadedText: this.page.locator('td[class="govuk-table__cell"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ftpa-evidence', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.adviceOnProvidingEvidenceText).toBeVisible(),
      expect(this.$static.adviceOnprovidingEvidenceBulletPoint.nth(0)).toHaveText(
        'It will be helpful to read our information about supporting evidence',
      ),
      expect(this.$static.adviceOnprovidingEvidenceBulletPoint.nth(0)).toBeVisible(),
      expect(this.$static.adviceOnprovidingEvidenceBulletPoint.nth(1)).toHaveText(
        'You can upload evidence to support your appeal such as letters, photos and documents. If you are taking a picture of a letter, place it on a flat surface and take the picture from above',
      ),
      expect(this.$static.adviceOnprovidingEvidenceBulletPoint.nth(1)).toBeVisible(),
      expect(this.$static.adviceOnprovidingEvidenceBulletPoint.nth(2)).toHaveText(
        'If you provide evidence that is not in English, you must also provide an English translation of that evidence',
      ),
      expect(this.$static.adviceOnprovidingEvidenceBulletPoint.nth(2)).toBeVisible(),

      expect(this.$static.uploadAfileLabel).toBeVisible(),
      expect(this.$static.uploadAfileLabel).toHaveText('Select a file'),

      expect(this.$static.uploadedFileHeader).toHaveText('Uploaded file'),
      expect(this.$static.uploadedFileHeader).toBeVisible(),

      expect(this.$static.noFilesUploadedText).toHaveText('No files uploaded'),
      expect(this.$static.noFilesUploadedText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    await this.verifyAllTextOnPage();

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Ftpa_Evidence_Reason.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await expect(async () => {
      await Promise.all([this.interceptNetworkRequestToVerifyFileUploadSucceeded({ timeoutMs: 15_000 }), this.$interactive.uploadFileButton.click()]);
    }).toPass({ intervals: [1_000], timeout: 30_000 });

    await expect(this.$static.fileUploadedTableRow.filter({ hasText: fileToUpload })).toBeVisible();
    await this.navigationClick(this.$interactive.continueButton);
  }

  private async interceptNetworkRequestToVerifyFileUploadSucceeded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse((res) => res.request().method() === 'POST' && res.url().includes('ftpa-evidence/upload'), {
      timeout: options.timeoutMs,
    });

    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  }
}
