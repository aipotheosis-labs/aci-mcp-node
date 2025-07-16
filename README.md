# aci-mcp-node

Node version of https://github.com/aipotheosis-labs/aci-mcp

## Development

start the unified server:

```bash
npx tsx src/index.ts unified-server --linked-account-owner-id <linked-account-owner-id> --allowed-apps-only
```

## MCP Server Config

```json
{
  "mcpServers": {
    "aci-mcp-unified-node": {
      "command": "npx",
      "args": [
        "@aci-sdk/mcp@latest",
        "unified-server",
        "--linked-account-owner-id",
        "<linked-account-owner-id>",
        "--allowed-apps-only"
      ],
      "env": {
        "ACI_API_KEY": "<aci-api-key>"
      }
    }
  }
}
```
