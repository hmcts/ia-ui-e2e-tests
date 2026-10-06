import { Page, BrowserContext } from '@playwright/test';
import { IdamSignInPage } from './idam-sign-in-page.po';
import { CuiPageFixtures, cuiPageFixtures } from './cui/cui-page-fixtures';
import { ExuiPageFixtures, exuiPageFixtures } from './exui/exui-page-fixtures';
import { ExuiUserRole } from '../utils';
import { config } from '../utils';

export type PageFixtures = CuiPageFixtures &
  ExuiPageFixtures & {
    determinePage: Page;
    idam_signInPage: IdamSignInPage;
    newBrowserContextAndPage: (options: { user: ExuiUserRole | 'citizen' }) => Promise<Page>;
  };

export const pageFixtures = {
  ...cuiPageFixtures,
  ...exuiPageFixtures,
  // If a performance test is executed, use the lighthouse created page instead
  determinePage: async ({ page, lighthousePage }, use, testInfo) => {
    if (testInfo.tags.includes('@performance')) {
      await use(lighthousePage);
    } else {
      await use(page);
    }
  },
  idam_signInPage: async ({ determinePage }: PageFixtures, use) => {
    const idam_signInPage = new IdamSignInPage(determinePage);
    await use(idam_signInPage);
  },
  newBrowserContextAndPage: async ({ browser }, use) => {
    const contexts: BrowserContext[] = [];

    await use(async (options: { user: ExuiUserRole | 'citizen' }) => {
      let context: BrowserContext;

      if (options.user === 'citizen') {
        context = await browser.newContext();
      } else {
        context = await browser.newContext({
          storageState: config.exuiUsers[options.user].sessionFile,
        });
      }

      contexts.push(context);

      return context.newPage();
    });

    await Promise.all(contexts.map((context) => context.close()));
  },
};
