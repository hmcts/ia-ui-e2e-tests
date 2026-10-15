import { Locator, Page, expect } from '@playwright/test';
import { DataUtils } from './data.utils';

export class UiDocumentUploadHelper {
  constructor(private readonly page: Page) {}

  private dataUtils = new DataUtils();

  public async uploadExuiDocument(options: {
    fileInputElement: Locator;
    nameOfFileToUpload: string;
    intervals?: number[];
    timeout?: number;
  }): Promise<void> {
    const filePath = await this.dataUtils.fetchDocumentUploadPath(options.nameOfFileToUpload);

    const uploadingText = this.page.locator('span[role="alert"]', {
      hasText: 'Uploading',
    });

    await expect(async () => {
      const currentFiles = await options.fileInputElement.evaluate((input: HTMLInputElement) => input.files?.length ?? 0);

      if (currentFiles > 0) {
        await options.fileInputElement.setInputFiles([]);
      }

      await Promise.all([
        this.interceptNetworkRequestToVerifyExuiUploadDocumentSucceeded({
          timeoutMs: 10_000,
        }),
        options.fileInputElement.setInputFiles(filePath),
      ]);
    }).toPass({
      intervals: options.intervals ?? [5_000],
      timeout: options.timeout ?? 60_000,
    });

    const count = await uploadingText.count();
    await Promise.all(Array.from({ length: count }, (_, i) => expect(uploadingText.nth(i)).not.toBeVisible({ timeout: 10_000 })));

    await expect(options.fileInputElement).toHaveValue(new RegExp(`${options.nameOfFileToUpload.replace('.', '\\.')}$`));
  }

  private async interceptNetworkRequestToVerifyExuiUploadDocumentSucceeded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse((res) => res.request().method() === 'POST' && res.url().includes('documentsv2'), {
      timeout: options.timeoutMs,
    });

    const status = response.status();

    expect(status).toBeLessThan(400);
  }
}
