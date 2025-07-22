export interface ParsedArgs {
  allowedAppsOnly: boolean;
  linkedAccountOwnerId: string;
}

export function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);

  // Skip "unified-server" if present (for manifest compatibility)
  if (args[0] === 'unified-server') {
    args.shift();
  }

  const allowedAppsOnly = args.includes('--allowed-apps-only');

  const linkedAccountOwnerIdIndex = args.indexOf('--linked-account-owner-id');
  const linkedAccountOwnerId =
    linkedAccountOwnerIdIndex !== -1 ? args[linkedAccountOwnerIdIndex + 1] : process.env.ACI_LINKED_ACCOUNT_OWNER_ID;

  if (!linkedAccountOwnerId) {
    console.error(
      'Error: --linked-account-owner-id is required or set ACI_LINKED_ACCOUNT_OWNER_ID environment variable'
    );
    process.exit(1);
  }

  return { allowedAppsOnly, linkedAccountOwnerId };
}
