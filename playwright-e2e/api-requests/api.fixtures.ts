import { CitizenApiClient } from './citizen/citizen-api-client';
import { CaseOfficerApiClient } from './exui/case-officer-api-client';
import { AdminOfficerApiClient } from './exui/admin-officer-api-client';
import { HomeOfficeUserApiClient } from './exui/home-office-user-api.client';
import { JudgeApiClient } from './exui/judge-api-client';
import { LegalRepApiClient } from './exui/legal-rep-api-client';
import { ApiContext } from './api-context';
import { UtilsFixtures } from '../utils';
import { APIRequestContext } from 'playwright-core';
import { ExuiUserRole } from '../utils';

export interface ApiFixtures {
  cui_apiClient: CitizenApiClient;
  exui_apiContext: (userRole: ExuiUserRole) => Promise<APIRequestContext>;
  exui_caseOfficerApiClient: CaseOfficerApiClient;
  exui_adminOfficerApiClient: AdminOfficerApiClient;
  exui_homeOfficeUserApiClient: HomeOfficeUserApiClient;
  exui_judgeApiClient: JudgeApiClient;
  exui_legalRepApiClient: LegalRepApiClient;
}

export const apiFixtures = {
  cui_apiClient: async ({ citizenUser }: UtilsFixtures, use) => {
    const apiClient = new CitizenApiClient(citizenUser.email, citizenUser.password);
    await apiClient.init();
    await use(apiClient);
  },
  exui_apiContext: async ({ config }: UtilsFixtures, use) => {
    const apiContext = new ApiContext();

    await use(async (userRole: ExuiUserRole): Promise<APIRequestContext> => {
      const roleContext = await apiContext.createExuiApiContext({
        userSessionFile: config.exuiUsers[userRole].sessionFile,
      });
      return roleContext;
    });
  },
  exui_caseOfficerApiClient: async ({ exui_apiContext }: ApiFixtures, use) => {
    const apiContext = await exui_apiContext('caseOfficer');
    const apiClient = new CaseOfficerApiClient(apiContext);
    await use(apiClient);
  },
  exui_adminOfficerApiClient: async ({ exui_apiContext }: ApiFixtures, use) => {
    const apiContext = await exui_apiContext('adminOfficer');
    const apiClient = new AdminOfficerApiClient(apiContext);
    await use(apiClient);
  },
  exui_homeOfficeUserApiClient: async ({ exui_apiContext }: ApiFixtures, use) => {
    const apiContext = await exui_apiContext('homeOfficeUser');
    const apiClient = new HomeOfficeUserApiClient(apiContext);
    await use(apiClient);
  },
  exui_judgeApiClient: async ({ exui_apiContext }: ApiFixtures, use) => {
    const apiContext = await exui_apiContext('judgeUser');
    const apiClient = new JudgeApiClient(apiContext);
    await use(apiClient);
  },
  exui_legalRepApiClient: async ({ exui_apiContext }: ApiFixtures, use) => {
    const apiContext = await exui_apiContext('legalRepUser');
    const apiClient = new LegalRepApiClient(apiContext);
    await use(apiClient);
  },
};
