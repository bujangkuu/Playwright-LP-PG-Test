import { Page, request, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const credentials = {
  internalAdmin: {
    username: process.env.QA_INTERNALADMIN_USER || 'internaladmin',
    password: process.env.QA_INTERNALADMIN_PASS || 'password123',
  },
  orgAdmin: {
    username: process.env.QA_ORG_ADMIN_USER || 'qaadminorg',
    password: process.env.QA_ORG_ADMIN_PASS || 'Pass1234',
  },
  merchantAdmin: {
    username: process.env.QA_MERCHANT_ADMIN_USER || 'qaadminmerch',
    password: process.env.QA_MERCHANT_ADMIN_PASS || 'Pass1234',
  },
};

export const BASE_URL = process.env.BASE_URL || 'https://pg-dashboard-dev.lintaspay.com';
export const API_BASE_URL = process.env.API_BASE_URL || 'https://pg-api-dev.lintaspay.com';

export async function loginAsInternalAdmin(page: Page): Promise<LoginPage> {
  const loginPage = new LoginPage(page);
  await loginPage.login(credentials.internalAdmin.username, credentials.internalAdmin.password, BASE_URL);
  return loginPage;
}

export async function loginAsOrgAdmin(page: Page): Promise<LoginPage> {
  const loginPage = new LoginPage(page);
  await loginPage.login(credentials.orgAdmin.username, credentials.orgAdmin.password, BASE_URL);
  return loginPage;
}

export async function loginAsMerchantAdmin(page: Page): Promise<LoginPage> {
  const loginPage = new LoginPage(page);
  await loginPage.login(credentials.merchantAdmin.username, credentials.merchantAdmin.password, BASE_URL);
  return loginPage;
}

export async function getApiToken(username: string, password: string): Promise<string> {
  const apiContext = await request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: {
      'Origin': BASE_URL,
    },
  });

  const res = await apiContext.post('/api/v1/auth/login', {
    data: { username, password },
  });

  const setCookie = res.headers()['set-cookie'] || '';
  let token = '';
  const match = setCookie.match(/access_token=([^;]+)/);
  if (match && match[1]) {
    token = match[1];
  } else {
    const json = await res.json().catch(() => ({}));
    token = json?.data?.access_token || json?.access_token || '';
  }

  await apiContext.dispose();
  return token;
}
