import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingPanelPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    includePanelMembersButton: this.page.locator('data-module="govuk-button"', { hasText: 'Include panel member' }),
    excludePanelMembersButton: this.page.locator('data-module="govuk-button"', { hasText: 'Exclude panel member' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Do you require a panel for this hearing?', level: 1, exact: true }),
    yesLabel: this.page.getByText('Yes', { exact: true }),
    noLabel: this.page.getByText('No', { exact: true }),
    includeSpecificPanelMembersText: this.page.getByText('Include specific panel members (optional)', { exact: true }),
    orSelectAnyOtherRoleHeading: this.page.getByRole('heading', { name: 'Or select any other panel roles required', level: 1, exact: true }),
    tribunalJudgeLabel: this.page.getByText('Tribunal Judge', { exact: true }),
    residentImmigrationJudgeLabel: this.page.getByText('Resident Immigration Judge', { exact: true }),
    excludeSpecificPanelMembersText: this.page.getByText('Exclude specific panel members (optional)', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-panel',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async completePageAndContinue(options: { doYouRequireAPanel: YesOrNoType }): Promise<void> {
    const radioButtonToSelect = this.page.getByRole('radio', { name: options.doYouRequireAPanel, exact: true });
    if (!(await radioButtonToSelect.isChecked())) {
      await radioButtonToSelect.click();
      await expect(radioButtonToSelect).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
