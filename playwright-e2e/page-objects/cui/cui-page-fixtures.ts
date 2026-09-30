import { CuiPages } from './cui-pages';
import { PageFixtures } from '../page.fixtures';
import { Page } from '@playwright/test';

export interface CuiPageFixtures {
  cui_pages: CuiPages;
  cui_login: (options: { email: string; password: string; pageContext?: Page }) => Promise<void>;
  cui_signOutAndBackIn: (options: { email: string; password: string; pageContext?: Page }) => Promise<void>;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const cuiPageFixtures = {
  cui_pages: async ({ determinePage }: PageFixtures, use) => {
    const cui_pages = new CuiPages(determinePage);
    await use(cui_pages);
  },
  cui_login: async ({ idam_signInPage, cui_pages }: PageFixtures, use) => {
    let cuiPages: CuiPages;
    await use(async (options: { email: string; password: string; pageContext?: Page }) => {
      cuiPages = options.pageContext ? await cui_pages.newPageContext({ pageContext: options.pageContext }) : cui_pages;

      await cuiPages.startAppeal.goTo();
      await cuiPages.startAppeal.verifyUserIsOnPage();
      await cuiPages.startAppeal.navigationClick(cuiPages.startAppeal.$interactive.signInLink);
      await idam_signInPage.citizenSignIn(options.email, options.password);

      await cuiPages.caseList.verifyUserIsOnPage();
    });
  },
  cui_signOutAndBackIn: async ({ idam_signInPage, cui_pages }: PageFixtures, use) => {
    let cuiPages: CuiPages;
    await use(async (options: { email: string; password: string; pageContext?: Page }) => {
      cuiPages = options.pageContext ? await cui_pages.newPageContext({ pageContext: options.pageContext }) : cui_pages;

      await cuiPages.appealOverview.navigationClick(cuiPages.appealOverview.$headerComponent.signOutLink);
      await cuiPages.startAppeal.verifyUserIsOnPage();
      await cuiPages.startAppeal.navigationClick(cuiPages.startAppeal.$interactive.signInLink);

      await idam_signInPage.citizenSignIn(options.email, options.password);

      await cuiPages.caseList.verifyUserIsOnPage();
    });
  },
};
