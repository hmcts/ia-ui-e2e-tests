import { expect, Locator, Page } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';

export type ExpectedDocument = {
  documentType: `${
    'Tribunal' | 'Appellant' | 'Home Office'
  } documents ${
    '1' | '2' | '3' | '4 ' | '5' | '6' | '7' | '8'
  }`
  documentName: string;
  uploadedDate: string;
};

export class DocumentsTabPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    markEvidenceAsReviewedLink: this.page.getByRole('link', { name: 'Mark evidence as reviewed', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    documentsTab: this.page.getByRole('tab', { name: 'Documents', exact: true }),
    documentsTable: this.page.locator('table.documents'),
  } as const satisfies Record<string, Locator>;

  public $documentSectionLocator(sectionName: ExpectedDocument['documentType']): Locator {
    return this.page.locator('.complex-panel').filter({
      has: this.page.locator('.complex-panel-title').getByText(sectionName, { exact: true }),
    });
  }

  public $documentNameLocator(documentName: string): Locator {
    return this.$static.documentsTable.getByRole('button', { name: documentName, exact: true });
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedTab({
      urlPath: 'Documents',
      tabName: 'Documents'
    });
  }

  public async verifyDocumentIsAvailable(options: ExpectedDocument): Promise<void> {
    const documentSection = this.$documentSectionLocator(options.documentType);

    const escapedDocumentName = options.documentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const documentName = documentSection.getByRole('button', {
      name: new RegExp(`${escapedDocumentName}$`),
    });

    await expect(documentSection).toBeVisible();
    await expect(documentName).toBeVisible();

    const uploadedDate = documentSection
      .locator('tr.complex-panel-simple-field')
      .filter({ has: this.page.getByText('Date uploaded', { exact: true }), visible: true })
      .locator('td');
    await expect(uploadedDate).toBeVisible();
    await expect(uploadedDate).toContainText(options.uploadedDate);
  }
}