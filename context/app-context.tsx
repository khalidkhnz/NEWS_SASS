import Debug from "@/components/Debug";
import React, { createContext, useState } from "react";

interface IAppContext {}

const AppContext = createContext<IAppContext | null>(null);

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState({
    auth: null as any,
    isAdmin: false,
  });

  return (
    <AppContext.Provider value={{}}>
      <Debug enable data={authState} />
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
