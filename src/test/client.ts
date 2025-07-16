import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: '/Users/me/.nvm/versions/node/v24.4.1/bin/node',
  args: ['./dist/index.js', 'unified-server', '--linked-account-owner-id', 'hd', '--allowed-apps-only'],
  cwd: '/Users/me/Code/aipolabs/aci-mcp-node',
  env: {
    ACI_API_KEY: '7cf6ab24196942170e7453f7d55d15decab3e42536c0f4856a0f8b3bbd58d5f3',
  },
});
const client = new Client({
  name: 'example-client',
  version: '1.0.0',
});

await client.connect(transport);

// List prompts
const listToolsResult = await client.listTools();
console.log(listToolsResult['tools']);

// Call a tool
const searchFunctionsResult = await client.callTool({
  name: 'ACI_SEARCH_FUNCTIONS',
  arguments: {
    intent: 'star github repo',
    limit: 10,
    offset: 0,
  },
});

console.log(searchFunctionsResult);
