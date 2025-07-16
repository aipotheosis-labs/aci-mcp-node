import axios from 'axios';
import { z } from 'zod';
import { BaseTool } from './base.js';

export class AciExecuteFunctionTool extends BaseTool {
  name = 'ACI_EXECUTE_FUNCTION';
  description = `
  Execute a specific retrieved function. Provide the executable function name, and the 
  required function parameters for that function based on function definition retrieved.
  `;
  inputSchema = z.object({
    function_name: z.string().describe('The name of the function to execute.'),
    function_arguments: z
      .record(z.string(), z.any())
      .describe(
        'A dictionary containing key-value pairs of input parameters required by the function. specified function. The parameter names and types must match those defined in the function definition. previously retrieved. If the function requires no input parameters, this field should be an empty dictionary.'
      ),
  });

  private readonly LINKED_ACCOUNT_OWNER_ID: string;

  constructor(linkedAccountOwnerId: string) {
    super();
    this.LINKED_ACCOUNT_OWNER_ID = linkedAccountOwnerId;
  }

  async execute(args: z.infer<typeof this.inputSchema>): Promise<{
    content: Array<{ type: 'text'; text: string }>;
  }> {
    try {
      const url = `${this.ACI_SERVER_URL}functions/${args.function_name}/execute`;

      const headers = {
        'X-API-KEY': this.ACI_API_KEY,
        'Content-Type': 'application/json',
      };

      // TODO: wrap_function_arguments_if_not_present?
      const body = {
        function_input: args.function_arguments,
        linked_account_owner_id: this.LINKED_ACCOUNT_OWNER_ID,
      };

      const response = await axios.post(url, body, {
        headers,
        timeout: 30000,
      });

      const result = response.data;

      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result),
          },
        ],
      };
    } catch (err) {
      const error = err as any;
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message;
        throw new Error(
          `Failed to execute function ${args.function_name} (${error.response?.status || 'unknown'}): ${JSON.stringify(errorMessage)}`
        );
      }
      throw error;
    }
  }
}
