export interface UserMethods {
  checkPassword: (password: string) => Promise<boolean>;
  generateRefreshToken: () => string;
  generateAccessToken: () => string;
}
