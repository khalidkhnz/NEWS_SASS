"use client";
import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}
const Layout = (props: Props) => {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!isAllowed) {
      if (window) {
        setIsAllowed(true);
      }
    }
  }, [isAllowed]);

  if (isAllowed) return props.children;
  else return <></>;
};

export default Layout;
