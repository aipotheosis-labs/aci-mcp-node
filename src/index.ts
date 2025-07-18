#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools/registry.js';
import { aciExecuteFunctionTool } from './tools/aci-execute-function.js';
import { aciSearchFunctionsTool } from './tools/aci-search-functions.js';
import { initConfig } from './utils/config.js';

function parseArgs() {
  const args = process.argv.slice(2);

  // Skip "unified-server" if present (for manifest compatibility)
  if (args[0] === 'unified-server') {
    args.shift();
  }

  const allowedAppsOnly = args.includes('--allowed-apps-only');

  const linkedAccountOwnerIdIndex = args.indexOf('--linked-account-owner-id');
  const linkedAccountOwnerId =
    linkedAccountOwnerIdIndex !== -1 ? args[linkedAccountOwnerIdIndex + 1] : process.env.ACI_LINKED_ACCOUNT_OWNER_ID;

  if (!linkedAccountOwnerId) {
    console.error(
      'Error: --linked-account-owner-id is required or set ACI_LINKED_ACCOUNT_OWNER_ID environment variable'
    );
    process.exit(1);
  }

  return { allowedAppsOnly, linkedAccountOwnerId };
}

const { allowedAppsOnly, linkedAccountOwnerId } = parseArgs();

// Initialize config with parsed arguments
initConfig({ allowedAppsOnly, linkedAccountOwnerId });

const server = new McpServer({
  name: 'aci-mcp-server',
  version: '1.0.0',
});

const tools = [aciSearchFunctionsTool, aciExecuteFunctionTool];
registerTools(server, tools);

async function startServer(): Promise<void> {
  console.error('Starting server...');
  console.error(`Allowed Apps Only: ${allowedAppsOnly}`);
  console.error(`Linked Account Owner ID: ${linkedAccountOwnerId}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Server started!');
}

startServer().catch(error => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
