export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires: number;
}

export interface AuthResult {
  user: DirectusUser | null;
  tokens: AuthTokens | null;
}
