import { expect, Page } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';
import { DataUtils } from '../../../../../../utils';

type DocumentType = 'Tribunal documents' | 'Appellant documents';

export class DocumentsTabPage extends CaseOverViewBase {
  private dataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedTab({
      urlPath: 'Documents',
      tabName: 'Documents',
    });
  }

  public async verifyDocumentIsVisible(options: {
    documentType: DocumentType;
    documentName: string;
    documentDescription?: string;
    documentIndexNumber: number;
  }): Promise<void> {
    const documentTableRow = this.page.locator('tr', { hasText: options.documentType });
    const scopeDocumentTable = documentTableRow.locator('[class="complex-panel"]', {
      hasText: `${options.documentType} ${options.documentIndexNumber}`,
    });

    const documentTableTitle = scopeDocumentTable.locator('dl[class="complex-panel-title"]');

    const documentNameValue = scopeDocumentTable
      .locator('tr[class*="complex-panel-simple-field"]', { hasText: 'Document' })
      .locator('ccd-read-document-field button');

    const descriptionValue = scopeDocumentTable
      .locator('tr[class*="complex-panel-simple-field"]', { hasText: 'Description' })
      .locator('ccd-read-text-area-field span');

    const dateUploadedValue = scopeDocumentTable
      .locator('tr[class*="complex-panel-simple-field"]', { hasText: 'Date uploaded' })
      .locator('ccd-read-date-field span')
      .locator('visible=true');

    await expect(documentTableTitle).toBeVisible();
    await expect(documentTableTitle).toHaveText(`${options.documentType} ${options.documentIndexNumber}`);

    await expect(documentNameValue).toBeVisible();
    await expect(documentNameValue).toContainText(options.documentName);

    if (options.documentDescription) {
      await expect(descriptionValue).toBeVisible();
      await expect(descriptionValue).toHaveText(options.documentDescription);
    } else {
      await expect(descriptionValue).not.toBeVisible();
    }

    const todaysDate = (await this.dataUtils.getDateFromToday({ formattingOptions: { day: '2-digit', month: 'short', year: 'numeric' } }))
      .formattedDate;
    await expect(dateUploadedValue).toBeVisible();
    await expect(dateUploadedValue).toContainText(todaysDate);
  }
}
