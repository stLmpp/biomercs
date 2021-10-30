import { User } from '@model/user';
import { AuthSteamLoginSocketErrorType } from '@model/enum/auth-steam-login-socket-error-type';

export interface Auth {
  user: User | null;
}

export interface AuthRegister {
  username: string;
  password: string;
  email: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthRegisterVW {
  email: string;
  message: string;
  idUser: number;
}

export interface AuthSteamLoginSocketVW {
  uuid: string;
  token: string;
  error?: string;
  errorType?: AuthSteamLoginSocketErrorType;
  steamid?: string;
  idUser?: number;
}

export enum AuthGatewayEvents {
  loginSteam = 'login-steam',
  userOnline = 'user-online',
  userOffline = 'user-offline',
}

export interface AuthChangePassword {
  key: string;
  oldPassword: string;
  newPassword: string;
  confirmationCode: number;
}

export interface AuthSteamValidateNames {
  steamPersonaName: string;
  newName: boolean;
}
