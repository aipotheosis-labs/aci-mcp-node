#!/usr/bin/env node

import { Command } from 'commander';
import * as process from 'process';

interface UnifiedServerOptions {
  linkedAccountOwnerId: string;
  allowedAppsOnly: boolean;
}

const program = new Command();

program.name('aci-mcp').description('ACI MCP servers, built by ACI.dev').version('0.0.1');

/**
 * Unified MCP Server
 */
program
  .command('unified-server')
  .description('Start the unified MCP server with unlimited tool access.')
  .requiredOption('--linked-account-owner-id <id>', 'the owner id of the linked account to use for the tool calls')
  .option(
    '--allowed-apps-only',
    'Optional flag, limit the functions (tools) search to only the allowed apps that are accessible to this agent. (identified by ACI_API_KEY)',
    false
  )
  .action(async (options: UnifiedServerOptions) => {
    try {
      // Dynamic import and start the server
      const { startServer } = await import('./unified-server/server.js');
      await startServer(options.allowedAppsOnly, options.linkedAccountOwnerId);
    } catch (error) {
      console.error('Error starting unified server:', error);
      process.exit(1);
    }
  });

// TODO: apps-server

program.parse();
