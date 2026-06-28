/**
 * CredentialField type definition.
 * Holds name and value fields for a credential attribute.
 */
export interface CredentialField {
  /** The attribute name (e.g. Username, Password) */
  name: string;
  /** The attribute value */
  value: string;
}

/**
 * CredentialItem type definition.
 * Represents a single credential configuration object.
 */
export interface CredentialItem {
  /** The unique title identifying the credential (e.g. AWS Production) */
  credTitle: string;
  /** List of name-value attribute fields associated with the credential */
  credData: CredentialField[];
}

/**
 * CredsState type definition.
 * Holds the state object structure for credentials.
 */
export type CredsState = {
  /** The current list of credentials */
  credsData: CredentialItem[];
};

/**
 * CredsStateActions interface.
 * Defines callback mutation handlers to update store state.
 */
export interface CredsStateActions {
  /** Callback action to update the full credentials list */
  updateCreds: (creds: CredentialItem[]) => void;
  /** Callback action to clear/remove all credentials */
  removeCreds: () => void;
}

/**
 * Combined credentials slice holding both state and actions.
 */
export type CredsStateSlice = CredsState & CredsStateActions;
