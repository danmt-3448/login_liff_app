import { Liff } from "@liff/liff-types";
import React, {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";
import { ILiffContext } from "../../types/liff";
import { useLiffLogin } from "../../hooks/use-liff-login";

export const LiffContext = createContext<ILiffContext>({
  error: "",
  isLoggedIn: false,
  isReady: false,
  liff: {} as Liff,
  userLineInfo: null,
  setUserLineInfo: null,
});
export interface ILiffProvider {
  children: any;
}

const ProviderOutlet: FC<{ children?: ReactNode }> = React.memo(
  ({ children }) => {
    return <>{children}</>;
  }
);

export const LiffProvider: FC<ILiffProvider> = ({ children }) => {
  const [userLineInfo, setUserLineInfo] = useState<any>({} as any);
  const [error, setError] = useState<unknown>();
  const [isReady, setIsReady] = useState(false);
  const [originalLiff, setLiff] = useState<Liff>();

  const [isLoggedIn, liff] = useLiffLogin(originalLiff);
  const getFriend = async (liffInitial: Liff) => {
    try {
      const friend = await liffInitial.getFriendship();
      console.log("friend", friend);
    } catch (e: unknown) {
      const { errors } = e as unknown as { errors: { statusCode: number } };
      console.log(errors);
    }
  };
  const getPermission = async (liffInitial: Liff) => {
    try {
      const context = liffInitial.getContext();
      console.log(context);
      const permissionSendMessageStatus = await liffInitial.permission.query(
        "chat_message.write"
      );
      console.log("permissionSendMessageStatus", permissionSendMessageStatus);
      console.log(liffInitial);
      console.log(liffInitial?.permission);

      if (permissionSendMessageStatus.state === "prompt") {
        await liffInitial.permission.requestAll();
      }
      setLiff(liffInitial);
      // if (context?.type === "utou") {
      //   const permissionSendMessageStatus = await liffInitial.permission.query(
      //     "chat_message.write"
      //   );
      //   console.log("permissionSendMessageStatus", permissionSendMessageStatus);
      // }
    } catch (errors: unknown) {
      console.log(errors);
    }
  };
  const verifyUserLine = async (liffInitial: Liff) => {
    try {
      await getPermission(liffInitial);
      await getFriend(liffInitial);
    } catch (error: unknown) {
      console.log(error);
    }
  };
  const liffInit = async () => {
    try {
      const _windown = window as any;
      const liffInitial: Liff =
        _windown.liff ?? ((await import("@line/liff")).default as Liff);
      await liffInitial.init({
        liffId: "2004369681-YpVZQBz9",
        withLoginOnExternalBrowser: true,
      });
      const isLogged = liffInitial.isLoggedIn();
      setLiff(liffInitial);
      console.log("liffInitial", liffInitial);

      if (!isLogged) {
        liffInitial.login({redirectUri:'https://localhost:3000/users'});
      } else {
        verifyUserLine(liffInitial);
        const assetsToken = await liffInitial.getAccessToken();
        console.log("assetsToken", assetsToken);

        const idToken = await liffInitial.getIDToken();
        console.log("idToken", idToken);

        const profile = await liffInitial.getProfile();
        console.log("profile", profile);
        setUserLineInfo(profile);
      }
    } catch (e: unknown) {
      console.log(e);
    } finally {
    }
  };

  useEffect(() => {
    liffInit();
  }, []);
  return (
    <LiffContext.Provider
      value={{
        isLoggedIn,
        isReady,
        setUserLineInfo,
        error,
        userLineInfo,
        liff,
      }}
    >
      <ProviderOutlet>{children}</ProviderOutlet>
    </LiffContext.Provider>
  );
};
