import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HasSponsorOrNonLegalRepPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.locator('button[name="saveAndContinue"]', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Do you have a sponsor or a non-legal representative?',
    }),
    whoTheyMightBeHeading: this.page.locator('h2', {
      hasText: 'Who they might be',
    }),
    whoTheyMightBeBullet: this.page.locator('main li'),
    sponsorQuestionText: this.page.getByText('Do you have a sponsor?', { exact: true }),
    nonLegalRepQuestionText: this.page.getByText('Do you have a non-legal representative?', { exact: true }),
    sponsorYesLabel: this.page.locator('label[for="hasSponsor"]'),
    sponsorNoLabel: this.page.locator('label[for="hasSponsor-2"]'),
    nonLegalRepYesLabel: this.page.locator('label[for="hasNonLegalRep"]'),
    nonLegalRepNoLabel: this.page.locator('label[for="hasNonLegalRep-2"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'has-sponsor-or-non-legal-rep', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.whoTheyMightBeHeading).toBeVisible(),

      expect(this.$static.whoTheyMightBeBullet.nth(0)).toHaveText(
        `A sponsor is usually someone whose support the appellant needs for their visa, such as a parent supporting a child’s application or someone supporting their partner’s application. They can have information about the appeal if the appellant agrees, and may attend a hearing to give evidence in support of the appeal, particularly if the appellant is unable because they are outside the country.`,
      ),
      expect(this.$static.whoTheyMightBeBullet.nth(0)).toBeVisible(),

      expect(this.$static.whoTheyMightBeBullet.nth(1)).toHaveText(
        `A non-legal representative is someone acting on the appellant’s behalf who is not acting in the course of a business. They can play an active role in the appeal, including representing the appellant at a hearing, and will be sent all information relating to the appeal.`,
      ),
      expect(this.$static.whoTheyMightBeBullet.nth(1)).toBeVisible(),

      expect(this.$static.whoTheyMightBeBullet.nth(2)).toHaveText('These can be the same people, or they may be different people.'),
      expect(this.$static.whoTheyMightBeBullet.nth(2)).toBeVisible(),

      expect(this.$static.sponsorQuestionText).toBeVisible(),
      expect(this.$static.nonLegalRepQuestionText).toBeVisible(),

      expect(this.$static.sponsorYesLabel).toHaveText('Yes'),
      expect(this.$static.sponsorYesLabel).toBeVisible(),

      expect(this.$static.sponsorNoLabel).toHaveText('No'),
      expect(this.$static.sponsorNoLabel).toBeVisible(),

      expect(this.$static.nonLegalRepYesLabel).toHaveText('Yes'),
      expect(this.$static.nonLegalRepYesLabel).toBeVisible(),

      expect(this.$static.nonLegalRepNoLabel).toHaveText('No'),
      expect(this.$static.nonLegalRepNoLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    doesApplicantHaveASponsor: YesOrNoType;
    doesApplicantHaveANonLegalRepresentative: YesOrNoType;
  }): Promise<void> {
    const sponsorElement = this.page.locator(`input[name="hasSponsor"][value="${options.doesApplicantHaveASponsor}"]`);
    await sponsorElement.check();
    await expect(sponsorElement).toBeChecked();

    const nonLegalRepElement = this.page.locator(`input[name="hasNonLegalRep"][value="${options.doesApplicantHaveANonLegalRepresentative}"]`);
    await nonLegalRepElement.check();
    await expect(nonLegalRepElement).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
