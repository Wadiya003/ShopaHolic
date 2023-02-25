import "@/styles/globals.css";
import { StoreProvider } from "@/utils/Store";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // console.log(session);
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}
