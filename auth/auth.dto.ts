export class AuthLoginDto {
  account: string;
  password: string;
}

export class AuthTokenDto {
  access_token: string;
  token_type: string;
}
