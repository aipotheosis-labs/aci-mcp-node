#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { aciExecuteFunctionTool } from './tools/aci-execute-function.js';
import { aciSearchFunctionsTool } from './tools/aci-search-functions.js';
import { registerTools } from './tools/tool.js';
import { parseArgs } from './utils/args.js';
import { initConfig } from './utils/config.js';

// Parse arguments
const { allowedAppsOnly, linkedAccountOwnerId } = parseArgs();

// Initialize config with parsed arguments
initConfig({ allowedAppsOnly, linkedAccountOwnerId });

const server = new McpServer({
  name: 'aci-unified-mcp-server',
  version: '1.0.0',
});

const tools = [aciSearchFunctionsTool, aciExecuteFunctionTool];
registerTools(server, tools);

async function startServer(): Promise<void> {
  console.error('Starting server...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Server started!');
}

startServer().catch(error => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
