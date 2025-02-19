import Assets from "@/lib/Assets";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Logo = ({
  alternative,
  className,
}: {
  alternative?: boolean;
  className?: string;
}) => {
  if (!alternative)
    return (
      <div
        className={cn("relative", className, {
          "w-[420px] h-[90px]": !className,
        })}
      >
        <Image
          className="object-contain"
          fill
          src={Assets.HEADER_LOGO}
          alt="header-logo"
        />
      </div>
    );

  return (
    <div className="mx-auto text-[52px]">
      {true ? `ανιѕ мє∂ια` : `𝔄𝔳𝔦𝔰 𝔐𝔢𝔡𝔦𝔞`}
    </div>
  );
};

export default Logo;
