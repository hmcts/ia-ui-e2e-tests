import { Page, Locator, expect } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';

export class ServiceRequestTabPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    payNowLink: this.page.getByRole('link', { name: 'Pay now', exact: true }),
    reviewLink: this.page.getByRole('link', { name: 'Review', exact: true }),
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
    pbaAccountNumber: this.page.locator('select[id="pbaAccountNumber"]'),
    pbaAccountRef: this.page.locator('input[id="pbaAccountRef"]'),
    viewServiceRequestLink: this.page.getByRole('link', { name: 'View service requests', exact: true }),
    confirmPaymentButton: this.page.getByRole('button', { name: 'Confirm payment', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    statusHeader: this.page.locator('table.serviceRequest thead td', { hasText: 'Status' }),
    amountHeader: this.page.locator('table.serviceRequest thead td', { hasText: 'Amount' }),
    partyHeader: this.page.locator('table.serviceRequest thead td', { hasText: 'Party' }),
    requestReferenceHeader: this.page.locator('table.serviceRequest thead td', { hasText: 'Request reference' }),
    amountToPayLabel: this.page.locator('label', { hasText: 'Amount to pay' }),
    amountToPayValue: this.page.locator('label', { hasText: 'Amount to pay' }).locator('+ span'),
    pbaAccountLabel: this.page.locator('label[for="pbaAccount"]'),
    cardPaymentLabel: this.page.locator('label[for="cardPayment"]'),
    selectPbaLabel: this.page.locator('label[for="pbaAccountNumber"]').first(),
    pbaAccountRefLabel: this.page.getByText('Enter a reference for your PBA account statements', { exact: true }),
    pbaAccountRefHint: this.page.locator('div[id="event-name-hint"]'),
    pbaPaymentConfirmationPanel: this.page.locator('[class*="pba-payments--confirmation"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '#Service%20Request',
      pageHeading: this.$static.pageHeading,
    });

    await expect(this.page.getByRole('tab', { name: 'Service Request', exact: true })).toHaveAttribute('aria-selected', 'true', { timeout: 60_000 });
  }

  public async verifyServiceRequestStatus(options: {
    status: 'Not paid' | 'Paid';
    amount: number;
    party: string;
    tableRowIndex?: number;
  }): Promise<void> {
    await Promise.all([
      expect(this.$static.statusHeader).toBeVisible(),
      expect(this.$static.amountHeader).toBeVisible(),
      expect(this.$static.partyHeader).toBeVisible(),
      expect(this.$static.requestReferenceHeader).toBeVisible(),
    ]);

    const tableRow = this.page.locator('tbody[class*="govuk-table__body"] tr');

    if ((await tableRow.count()) > 1 && !options.tableRowIndex) {
      throw new Error('Multiple service request rows found. Please provide a tableRowIndex to specify which row to verify.');
    }

    const tableRowToVerify = options.tableRowIndex !== undefined ? tableRow.nth(options.tableRowIndex) : tableRow;
    const statusValue = tableRowToVerify.locator('td').nth(0);
    const amountValue = tableRowToVerify.locator('td').nth(1);
    const partyValue = tableRowToVerify.locator('td').nth(2);
    const requestReferenceValue = tableRowToVerify.locator('td').nth(3);

    const currentYear = new Date().getFullYear();
    const requestReferenceRegex = new RegExp(`^${currentYear}-\\d{13}$`);

    await Promise.all([
      expect(statusValue).toBeVisible(),
      expect(statusValue).toHaveText(options.status),
      expect(amountValue).toBeVisible(),
      expect(amountValue).toHaveText(`£${options.amount.toFixed(2)}`),
      expect(partyValue).toBeVisible(),
      expect(partyValue).toHaveText(options.party),
      expect(requestReferenceValue).toBeVisible(),
      expect(requestReferenceValue).toHaveText(requestReferenceRegex),
    ]);

    if (options.status === 'Not paid') {
      await expect(this.$interactive.payNowLink).toBeVisible();
    } else {
      await expect(this.$interactive.payNowLink).toBeHidden();
    }

    await expect(this.$interactive.reviewLink).toBeVisible();
  }

  public async selectPayNowLink(options?: { linkIndex: number }): Promise<void> {
    const payNowLinkToClick = options?.linkIndex !== undefined ? this.$interactive.payNowLink.nth(options.linkIndex) : this.$interactive.payNowLink;

    await expect(async () => {
      await payNowLinkToClick.click();
      await expect(payNowLinkToClick).toBeHidden({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }

  public async paymentOptions(options: {
    amountToPay: number;
    paymentOption: 'Pay fee using Payment by Account (PBA)' | 'Pay by credit or debit card';
    pbaAccountNumber?: string;
    pbaAccountRef?: string;
  }): Promise<void> {
    await Promise.all([
      expect(this.$static.amountToPayLabel).toBeVisible(),
      expect(this.$static.amountToPayLabel).toHaveText('Amount to pay'),
      expect(this.$static.amountToPayValue).toBeVisible(),
      expect(this.$static.amountToPayValue).toHaveText(`£${options.amountToPay.toFixed(2)}`),
      expect(this.$static.pbaAccountLabel).toBeVisible(),
      expect(this.$static.pbaAccountLabel).toHaveText('Pay fee using Payment by Account (PBA)'),
      expect(this.$static.cardPaymentLabel).toBeVisible(),
      expect(this.$static.cardPaymentLabel).toHaveText('Pay by credit or debit card'),
    ]);

    await expect(this.$interactive.continueButton).toBeDisabled();

    const paymentOptionRadio = this.page.getByRole('radio', { name: options.paymentOption, exact: true });
    await paymentOptionRadio.check();
    await expect(paymentOptionRadio).toBeChecked();

    if (options.paymentOption === 'Pay fee using Payment by Account (PBA)') {
      if (!options.pbaAccountNumber || !options.pbaAccountRef) {
        throw new Error('If paymentOption is "Pay fee using Payment by Account (PBA)", both pbaAccountNumber and pbaAccountRef must be provided.');
      }

      await Promise.all([expect(this.$static.selectPbaLabel).toBeVisible(), expect(this.$static.selectPbaLabel).toHaveText('Select a PBA')]);
      await this.$interactive.pbaAccountNumber.selectOption({ label: options.pbaAccountNumber });
      await expect(this.$interactive.pbaAccountNumber).toHaveValue(options.pbaAccountNumber);

      await Promise.all([
        expect(this.$static.pbaAccountRefLabel).toBeVisible(),
        expect(this.$static.pbaAccountRefLabel).toHaveText('Enter a reference for your PBA account statements'),
        expect(this.$static.pbaAccountRefHint).toBeVisible(),
        expect(this.$static.pbaAccountRefHint).toHaveText(
          'This should be your own unique reference to identify the case. It will appear on your statements.',
        ),
        expect(this.$interactive.pbaAccountRef).toBeVisible(),
        expect(this.$interactive.confirmPaymentButton).toBeVisible(),
      ]);

      await this.$interactive.pbaAccountRef.fill(options.pbaAccountRef);
      await expect(this.$interactive.pbaAccountRef).toHaveValue(options.pbaAccountRef);

      await expect(async () => {
        await this.$static.pbaAccountRefLabel.click({ force: true });
        await expect(this.$interactive.confirmPaymentButton).toBeEnabled({ timeout: 5_000 });
      }).toPass({ intervals: [1_000], timeout: 30_000 });

      await expect(async () => {
        if ((await this.$interactive.confirmPaymentButton.isEnabled()) && (await this.$interactive.confirmPaymentButton.isVisible())) {
          await this.$interactive.confirmPaymentButton.click();
        }
        await expect(this.$interactive.confirmPaymentButton).toBeHidden({ timeout: 5_000 });
      }).toPass({ intervals: [1_000], timeout: 30_000 });
    } else {
      await expect(this.$interactive.continueButton).toBeEnabled();
      await this.navigationClick(this.$interactive.continueButton);
    }
  }

  public async verifyPbaPaymentHasBeenSuccessful(): Promise<void> {
    await expect(this.$static.pbaPaymentConfirmationPanel).toBeVisible();
    await expect(this.$static.pbaPaymentConfirmationPanel).toContainText(
      `Payment successful
      Your payment reference is
      RC-`,
      { useInnerText: true },
    );

    await this.$interactive.viewServiceRequestLink.click();
    await expect(this.$interactive.viewServiceRequestLink).toBeHidden({ timeout: 10_000 });
  }
}
