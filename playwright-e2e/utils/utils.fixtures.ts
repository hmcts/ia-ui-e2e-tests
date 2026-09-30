import { AxeUtils, BrowserUtils, IdamUtils, LighthouseUtils, LocaleUtils, ServiceAuthUtils } from '@hmcts/playwright-common';
import os from 'os';
import path from 'path';
import { chromium, Page } from 'playwright/test';
import { CitizenUserUtils } from './citizen-user.utils';
import { config, Config } from './config.utils';
import { DataUtils } from './index';
import { UserInfo } from './citizen-user.utils';
import { SessionUtils } from './session-utils';

export interface UtilsFixtures {
  citizenUser: UserInfo;
  config: Config;
  axeUtils: AxeUtils;
  SessionUtils: typeof SessionUtils;
  browserUtils: BrowserUtils;
  lighthouseUtils: LighthouseUtils;
  lighthousePage: Page;
  idamUtils: IdamUtils;
  citizenUserUtils: CitizenUserUtils;
  localeUtils: LocaleUtils;
  serviceAuthUtils: ServiceAuthUtils;
  dataUtils: DataUtils;
}

export const utilsFixtures = {
  citizenUser: async ({ citizenUserUtils }: UtilsFixtures, use) => {
    const user = await citizenUserUtils.createUser();
    await use(user);
  },
  config: async ({}, use) => {
    await use(config);
  },
  lighthouseUtils: async ({ lighthousePage, lighthousePort }, use) => {
    await use(new LighthouseUtils(lighthousePage, lighthousePort));
  },
  axeUtils: async ({ page }, use, testInfo) => {
    const axeUtils = new AxeUtils(page);
    await use(axeUtils);
    await axeUtils.generateReport(testInfo);
  },
  SessionUtils: async ({}, use) => {
    await use(SessionUtils);
  },
  browserUtils: async ({ browser }, use) => {
    await use(new BrowserUtils(browser));
  },
  idamUtils: async ({ config }, use) => {
    // Set required env vars for IDAM
    process.env.IDAM_WEB_URL = config.urls.idamWebUrl;
    process.env.IDAM_TESTING_SUPPORT_URL = config.urls.idamTestingSupportUrl;

    await use(new IdamUtils());
  },
  citizenUserUtils: async ({ idamUtils }, use) => {
    await use(new CitizenUserUtils(idamUtils));
  },
  localeUtils: async ({ page }, use) => {
    await use(new LocaleUtils(page));
  },
  lighthousePage: async ({ lighthousePort, page, SessionUtils }, use, testInfo) => {
    // Prevent creating performance page if not needed
    if (testInfo.tags.includes('@performance')) {
      // Lighthouse opens a new page and as playwright doesn't share context we need to
      // explicitly create a new browser with shared context
      const userDataDir = path.join(os.tmpdir(), 'pw', String(Math.random()));
      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [`--remote-debugging-port=${lighthousePort}`],
      });
      // Using the cookies from global setup, inject to the new browser
      await context.addCookies(SessionUtils.getCookies(config.exuiUsers.caseOfficer.sessionFile));
      // Provide the page to the test
      await use(context.pages()[0]);
      await context.close();
    } else {
      await use(page);
    }
  },
  serviceAuthUtils: async ({ config }, use) => {
    // Set required env vars for Service auth (S2S_URL)
    process.env.S2S_URL = config.urls.serviceAuthUrl;
    await use(new ServiceAuthUtils());
  },
  dataUtils: async ({}, use) => {
    await use(new DataUtils());
  },
};
