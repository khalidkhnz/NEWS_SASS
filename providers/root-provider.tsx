"use client";

import React from "react";
import TanstackQueryProvider from "./tanstack-query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <NuqsAdapter>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </NuqsAdapter>
    </React.Fragment>
  );
};

export default RootProvider;
