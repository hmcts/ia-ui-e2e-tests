import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

const hearingFacilities = [
  "Children's Room",
  'Common Area Restriction',
  'Custody Cell',
  'DVD/CD Player',
  'Evidence Camera',
  'IAC Type-C Conference Equipment',
  'Laptop',
  'Linked Rooms',
  'Linked to Cells',
  'Private Interior Room',
  'Projector',
  'Secure Dock',
  'Video Conference Trolley',
  'Wireless Internet Access',
  'Witness Room',
  'Witness Screen',
] as const;

type HearingFacilitiesType = (typeof hearingFacilities)[number];

type FlagsRequestedByApplicantType = 'Evidence given in private' | 'Audio/Video Evidence';

export class HearingFacilitiesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Do you require any additional facilities?', level: 1, exact: true }),
    anyActiveFlagsText: this.page.getByText('Any active flags on this case may require additional facilities at the hearing.', { exact: true }),
    addtionalSecurityHeading: this.page.getByRole('heading', { name: 'Will additional security be required?', level: 3, exact: true }),
    addtionalSecurityYesLabel: this.page.locator('input[id="additionalSecurityYes"] + label'),
    addtionalSecurityNoLabel: this.page.locator('input[id="additionalSecurityNo"] + label'),
    selectAnyAdditionalFacilitiesHeading: this.page.getByRole('heading', {
      name: 'Select any additional facilities required',
      level: 1,
      exact: true,
    }),
    facilitiesHintText: this.page.locator('[id="facils-name-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-facilities',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyTextForApplicant(options: { applicantName: string }): Promise<void> {
    await Promise.all([
      expect(this.page.getByText(`Request a hearing for ${options.applicantName}`, { exact: true })).toBeVisible(),
      expect(this.$static.anyActiveFlagsText).toBeVisible(),
      expect(this.$static.addtionalSecurityHeading).toBeVisible(),
      expect(this.$static.addtionalSecurityYesLabel).toHaveText('Yes'),
      expect(this.$static.addtionalSecurityYesLabel).toBeVisible(),
      expect(this.$static.addtionalSecurityNoLabel).toHaveText('No'),
      expect(this.$static.addtionalSecurityNoLabel).toBeVisible(),
      expect(this.$static.selectAnyAdditionalFacilitiesHeading).toBeVisible(),
      expect(this.$static.facilitiesHintText).toHaveText(
        'If the facilities you need are not listed here, add them on the final page before you submit the request.',
      ),
      expect(this.$static.facilitiesHintText).toBeVisible(),
      expect(this.page.locator('[id="facilitiesList"] label')).toHaveCount(16),
      ...hearingFacilities.map((facility) => expect(this.page.getByText(facility, { exact: true })).toBeVisible()),
    ]);
  }
  public async verifyTableHeadingsForApplicant(options: { applicantName: string }): Promise<void> {
    const tableLocator = this.page.locator('table', { hasText: options.applicantName });
    await Promise.all([
      expect(tableLocator.locator('th').nth(0)).toBeVisible(),
      expect(tableLocator.locator('th').nth(0)).toHaveText(options.applicantName),
      expect(tableLocator.locator('th').nth(1)).toBeVisible(),
      expect(tableLocator.locator('th').nth(1)).toHaveText('Comments'),
      expect(tableLocator.locator('th').nth(2)).toBeVisible(),
      expect(tableLocator.locator('th').nth(2)).toHaveText('Flag status'),
    ]);
  }

  public async verifyRequirementsRequestedByApplicant(options: {
    applicantName: string;
    requirementRequested: FlagsRequestedByApplicantType;
    comments?: string;
    flagStatus: 'ACTIVE';
  }): Promise<void> {
    const tableLocator = this.page.locator('table', { hasText: options.applicantName });
    const tableRowLocator = tableLocator.locator(`tr:has(:text-is("${options.requirementRequested}"))`);

    await Promise.all([
      /* eslint-disable playwright/missing-playwright-await */
      expect(tableRowLocator.locator('td').nth(0)).toBeVisible(),
      expect(tableRowLocator.locator('td').nth(0)).toHaveText(options.requirementRequested),
      ...(options.comments
        ? [expect(tableRowLocator.locator('td').nth(1)).toBeVisible(), expect(tableRowLocator.locator('td').nth(1)).toHaveText(options.comments)]
        : [expect(tableRowLocator.locator('td').nth(1)).toBeEmpty()]),
      expect(tableRowLocator.locator('td').nth(2)).toBeVisible(),
      expect(tableRowLocator.locator('td').nth(2)).toHaveText(options.flagStatus, { ignoreCase: true }),
    ]);
  }

  public async selectAnyAdditionalFacilities(options: { addtionalFacilitiesToSelect: HearingFacilitiesType[] }): Promise<void> {
    for (const facility of options.addtionalFacilitiesToSelect) {
      const locatorToSelect = this.page.getByRole('checkbox', { name: facility, exact: true });
      await locatorToSelect.click();
      await expect(locatorToSelect).toBeChecked();
    }
  }

  public async continueOnToNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
