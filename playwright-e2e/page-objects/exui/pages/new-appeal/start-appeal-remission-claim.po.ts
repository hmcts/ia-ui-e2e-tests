import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiRemissionClaimType } from '../../../../exui-event-types';

export class StartAppealRemissionClaimPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Select remission type', exact: true }),
    remissionClaimQuestionLabel: this.page.locator('div[id="remissionClaim"] label[for="remissionClaim"] span'),
    remissionClaimOptionLabels: this.page.locator('label[for^="remissionClaim-"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealremissionClaim',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.remissionClaimQuestionLabel).toBeVisible(),
      expect(this.$static.remissionClaimQuestionLabel).toHaveText('Choose one of the following statements'),
      expect(this.$static.remissionClaimOptionLabels.nth(0)).toBeVisible(),
      expect(this.$static.remissionClaimOptionLabels.nth(0)).toHaveText('The appellant receives Asylum Support'),
      expect(this.$static.remissionClaimOptionLabels.nth(1)).toBeVisible(),
      expect(this.$static.remissionClaimOptionLabels.nth(1)).toHaveText('The appellant receives Legal Aid'),
      expect(this.$static.remissionClaimOptionLabels.nth(2)).toBeVisible(),
      expect(this.$static.remissionClaimOptionLabels.nth(2)).toHaveText(
        'The appellant receives (or has parental responsibility for a person who receives) benefit services or accommodation provided by a local authority under section 17 of the Children Act 1989, section 22 of the Children (Scotland) Act 1995, article 18 of the Children (Northern Ireland) Order 1995 or section 37 of the Social Services and Well-being (Wales) Act 2014',
      ),
      expect(this.$static.remissionClaimOptionLabels.nth(3)).toBeVisible(),
      expect(this.$static.remissionClaimOptionLabels.nth(3)).toHaveText(
        "The appellant's accommodation is being provided by a local authority under section 20 of the Children Act 1989, section 25 of the Children (Scotland) Act 1995, article 21 of the Children (Northern Ireland) Order 1995 or section 76 of the Social Services and Well-being (Wales) Act 2014",
      ),
      expect(this.$static.remissionClaimOptionLabels.nth(4)).toBeVisible(),
      expect(this.$static.remissionClaimOptionLabels.nth(4)).toHaveText('The Home Office waived the fee for the application this appeal relates to'),
    ]);
  }

  public async completePageAndContinue(options: { remissionClaim: ExuiRemissionClaimType }): Promise<void> {
    const remissionClaimOption = this.page.getByRole('radio', { name: options.remissionClaim, exact: true });
    await remissionClaimOption.check();
    await expect(remissionClaimOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
