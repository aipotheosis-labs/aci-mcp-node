import axios from 'axios';
import { z } from 'zod';
import { tool } from './registry.js';
import { getConfig } from '../utils/config.js';

export const aciSearchFunctionsTool = tool({
  name: 'ACI_SEARCH_FUNCTIONS',
  description: `
  This function allows you to find relevant executable functions and their schemas that can help complete your tasks.
  `,
  inputSchema: z.object({
    intent: z
      .string()
      .optional()
      .describe(
        'Use this to find relevant functions you might need. Returned results of this function will be sorted by relevance to the intent.'
      ),
    limit: z.number().optional().describe('The maximum number of functions to return from the search per response.'),
    offset: z.number().optional().describe('Pagination offset.'),
  }),
  execute: async args => {
    try {
      const config = getConfig();
      const url = `${config.ACI_SERVER_URL}functions/search`;

      const queryParams = {
        intent: args?.intent,
        limit: args?.limit,
        offset: args?.offset,
        allowed_apps_only: config.ALLOWED_APPS_ONLY,
        format: config.FUNCTION_DEFINITION_FORMAT,
      };

      const headers = {
        'X-API-KEY': config.ACI_API_KEY,
        'Content-Type': 'application/json',
      };

      const response = await axios.get(url, {
        headers,
        params: queryParams,
        timeout: 30000,
      });

      const functions = response.data;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(functions, null, 2),
          },
        ],
      };
    } catch (err) {
      const error = err as any;
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message;
        throw new Error(
          `Failed to search functions (${error.response?.status || 'unknown'}): ${JSON.stringify(errorMessage)}`
        );
      }
      throw error;
    }
  },
});
