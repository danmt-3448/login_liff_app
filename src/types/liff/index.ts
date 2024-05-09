import { Liff } from "@liff/liff-types";

declare global {
  interface window {
    liff: Liff;
  }
}

export interface ILiffContext {
  error?: unknown;
  isLoggedIn: boolean;
  isReady: boolean;
  liff: Liff;
  userLineInfo: any;
  setUserLineInfo: any;
}
