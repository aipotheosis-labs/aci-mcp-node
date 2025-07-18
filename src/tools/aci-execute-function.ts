import axios from 'axios';
import { z } from 'zod';
import { tool } from './registry.js';
import { getConfig } from '../utils/config.js';

export const aciExecuteFunctionTool = tool({
  name: 'ACI_EXECUTE_FUNCTION',
  description: `
  Execute a specific retrieved function. Provide the executable function name, and the 
  required function parameters for that function based on function definition retrieved.
  `,
  inputSchema: z.object({
    function_name: z.string().describe('The name of the function to execute.'),
    function_arguments: z
      .record(z.string(), z.any())
      .describe(
        'A dictionary containing key-value pairs of input parameters required by the function. specified function. The parameter names and types must match those defined in the function definition. previously retrieved. If the function requires no input parameters, this field should be an empty dictionary.'
      ),
  }),
  execute: async args => {
    if (!args) {
      throw new Error('Function name and arguments are required');
    }

    try {
      const config = getConfig();
      const url = `${config.ACI_SERVER_URL}functions/${args.function_name}/execute`;

      const headers = {
        'X-API-KEY': config.ACI_API_KEY,
        'Content-Type': 'application/json',
      };

      const body = {
        function_input: args.function_arguments,
        linked_account_owner_id: config.LINKED_ACCOUNT_OWNER_ID,
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
  },
});
