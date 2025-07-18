import dotenv from 'dotenv';
import { FunctionDefinitionFormat } from './enum.js';

// Only load .env in non-test environments
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

export interface AciMCPConfig {
  readonly ACI_API_KEY: string;
  readonly ACI_SERVER_URL: string;
  readonly LINKED_ACCOUNT_OWNER_ID?: string;
  readonly ALLOWED_APPS_ONLY: boolean;
  readonly FUNCTION_DEFINITION_FORMAT: string;
}

export const createAciMCPConfig = (options?: {
  allowedAppsOnly?: boolean;
  linkedAccountOwnerId?: string;
}): AciMCPConfig => {
  const ACI_SERVER_URL = process.env.ACI_SERVER_URL || 'https://api.aci.dev/v1/';
  const FUNCTION_DEFINITION_FORMAT = process.env.FUNCTION_DEFINITION_FORMAT || FunctionDefinitionFormat.ANTHROPIC;
  const ALLOWED_APPS_ONLY = options?.allowedAppsOnly ?? process.env.ACI_ALLOWED_APPS_ONLY === 'true';
  const LINKED_ACCOUNT_OWNER_ID = options?.linkedAccountOwnerId ?? process.env.ACI_LINKED_ACCOUNT_OWNER_ID;

  if (!process.env.ACI_API_KEY) {
    console.error('ACI_API_KEY not found in environment variables');
    throw new Error('ACI_API_KEY not found in environment variables');
  }

  return {
    ACI_API_KEY: process.env.ACI_API_KEY,
    ACI_SERVER_URL,
    LINKED_ACCOUNT_OWNER_ID,
    ALLOWED_APPS_ONLY,
    FUNCTION_DEFINITION_FORMAT,
  };
};

let config: AciMCPConfig;

export const initConfig = (options?: { allowedAppsOnly?: boolean; linkedAccountOwnerId?: string }): void => {
  config = createAciMCPConfig(options);
};

export const getConfig = (): AciMCPConfig => {
  if (!config) {
    throw new Error('Config not initialized. Call initConfig() first.');
  }
  return config;
};
