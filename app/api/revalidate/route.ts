import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;
  const tag = searchParams.get("tag");
  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({
      success: true,
      message: `Revalidate Tag: ${tag}`,
    });
  } else {
    return NextResponse.json({
      message: "Tag missing in search params.",
    });
  }
};
