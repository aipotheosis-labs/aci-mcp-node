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

## Packing

```bash
npm install -g @anthropic-ai/dxt # install dxt
npm install --production # install dependencies
npm ci # reproducible builds
dxt pack . aci-mcp-extension-v0.0.3.dxt # pack the extension
```

see: https://github.com/anthropics/dxt
