import path from 'path';

export type ExuiUserRole = keyof Config['exuiUsers'];

export interface UserCredentials {
  username: string;
  password: string;
  sessionFile: string;
  sessionExpiryRef?: string;
}

interface Urls {
  exuiDefaultUrl: string;
  citizenUrl: string;
  idamWebUrl: string;
  idamTestingSupportUrl: string;
  serviceAuthUrl: string;
}

export interface Config {
  exuiUsers: {
    caseOfficer: UserCredentials;
    adminOfficer: UserCredentials;
    homeOfficeUser: UserCredentials;
    judgeUser: UserCredentials;
    legalRepUser: UserCredentials;
  };
  urls: Urls;
}

export const config: Config = {
  exuiUsers: {
    caseOfficer: {
      username: getEnvVar('CASE_OFFICER_USERNAME'),
      password: getEnvVar('CASE_OFFICER_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('CASE_OFFICER_USERNAME')}.json`),
      sessionExpiryRef: 'ng2Idle.idleSession.expiry',
    },
    adminOfficer: {
      username: getEnvVar('ADMIN_OFFICER_USERNAME'),
      password: getEnvVar('ADMIN_OFFICER_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('ADMIN_OFFICER_USERNAME')}.json`),
      sessionExpiryRef: 'ng2Idle.idleSession.expiry',
    },
    homeOfficeUser: {
      username: getEnvVar('HOME_OFFICE_USERNAME'),
      password: getEnvVar('HOME_OFFICE_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('HOME_OFFICE_USERNAME')}.json`),
      sessionExpiryRef: 'ng2Idle.idleSession.expiry',
    },
    judgeUser: {
      username: getEnvVar('JUDGE_USERNAME'),
      password: getEnvVar('JUDGE_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('JUDGE_USERNAME')}.json`),
      sessionExpiryRef: 'ng2Idle.idleSession.expiry',
    },
    legalRepUser: {
      username: getEnvVar('LEGAL_REP_USERNAME'),
      password: getEnvVar('LEGAL_REP_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('LEGAL_REP_USERNAME')}.json`),
      sessionExpiryRef: 'ng2Idle.idleSession.expiry',
    },
  },
  urls: {
    exuiDefaultUrl: 'https://manage-case.aat.platform.hmcts.net/',
    citizenUrl: getEnvVar('CITIZEN_FRONTEND_BASE_URL'),
    idamWebUrl: getEnvVar('IDAM_WEB_URL'),
    idamTestingSupportUrl: getEnvVar('IDAM_TESTING_SUPPORT_URL'),
    serviceAuthUrl: getEnvVar('S2S_URL'),
  },
};

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Error: ${name} environment variable is not set`);
  }
  return value;
}

function pathToFile(expectedPath: string, nameOfFile: string): string {
  if (!expectedPath || !nameOfFile) {
    throw new Error('Folder path or name of file is not set');
  }

  const projectRoot = process.cwd();
  return path.join(projectRoot, './playwright-e2e/', expectedPath, nameOfFile);
}
