import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export interface Tool<TInput extends z.ZodObject<any>> {
  name: string;
  description: string;
  inputSchema: TInput;
  execute: (args?: z.infer<TInput>) => Promise<{
    content: Array<{ type: 'text'; text: string }>;
  }>;
}

export const tool = <TInput extends z.ZodObject<any>>(definition: Tool<TInput>): Tool<TInput> => {
  return {
    name: definition.name,
    description: definition.description,
    inputSchema: definition.inputSchema,
    execute: definition.execute,
  };
};

export const registerTool = <TInput extends z.ZodObject<any>>(server: McpServer, tool: Tool<TInput>) => {
  const isEmptySchema = Object.keys(tool.inputSchema.shape).length === 0;
  const inputSchema = isEmptySchema ? undefined : tool.inputSchema.shape;

  server.registerTool(
    tool.name,
    {
      title: tool.name,
      description: tool.description,
      inputSchema,
    },
    tool.execute
  );
};

export const registerTools = (server: McpServer, tools: Tool<any>[]) => {
  tools.forEach(tool => registerTool(server, tool));
};
