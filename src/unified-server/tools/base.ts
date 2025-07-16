import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { validateApiKey } from '../../common/validators.js';

export abstract class BaseTool {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: z.ZodObject<any>;

  protected readonly ACI_SERVER_URL: string;
  protected readonly ACI_API_KEY: string;

  constructor() {
    this.ACI_SERVER_URL = process.env.ACI_SERVER_URL || 'https://api.aci.dev/v1/';
    // TODO: move env check somewhere else?
    validateApiKey(process.env.ACI_API_KEY);
    this.ACI_API_KEY = process.env.ACI_API_KEY!;
  }

  register(server: McpServer) {
    // Check if inputSchema is an empty object schema
    const isEmptySchema = Object.keys(this.inputSchema.shape).length === 0;
    // NOTE: some tools requires no input args. Technically, the expected input should be empty object {},
    // some clients (e.g., Windsurf) send undefined instead of empty object. In which case zod validation would
    // fail. To make it work for both cases, we set inputSchema to undefined if the schema requires no input args.
    const inputSchema = isEmptySchema ? undefined : this.inputSchema.shape;

    server.registerTool(
      this.name,
      {
        title: this.name,
        description: this.description,
        inputSchema,
      },
      this.execute.bind(this)
    );
  }

  // TODO: more generic return type instead of just text?
  abstract execute(args?: z.infer<typeof this.inputSchema>): Promise<{
    content: Array<{ type: 'text'; text: string }>;
  }>;
}
