export interface IUser {
  email: string;
  displayName: string;
  avatar: string | null;
  password: string;
  role: string;
  googleID: string | null;
  refreshToken: string;
}

export type IUserSave = Omit<IUser, 'role'>;
export type IUserReg = Omit<IUser, 'role' | 'refreshToken' | 'googleID'>;
