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

export interface AuthChangePassword {
  password: string;
  confirmationCode: number;
}

export interface AuthRegisterSteam {
  email: string;
  steamid: string;
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
}
