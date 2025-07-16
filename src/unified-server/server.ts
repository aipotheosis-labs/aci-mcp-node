import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AciExecuteFunctionTool } from './tools/aci-execute-function.js';
import { AciSearchFunctionsTool } from './tools/aci-search-functions.js';

const server = new McpServer({
  name: 'aci-mcp-server',
  version: '0.0.1',
});

export async function startServer(allowedAppsOnly: boolean, linkedAccountOwnerId: string): Promise<void> {
  console.error('Starting Unified Server...');
  console.error(`Allowed Apps Only: ${allowedAppsOnly}`);
  console.error(`Linked Account Owner ID: ${linkedAccountOwnerId}`);
  console.error('registering tools...');

  const tools = [new AciSearchFunctionsTool(allowedAppsOnly), new AciExecuteFunctionTool(linkedAccountOwnerId)];
  tools.forEach(tool => {
    tool.register(server);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Server started!');
}
