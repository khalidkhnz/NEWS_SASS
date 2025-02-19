import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface IPostCardProps {
  className?: string;
  topImage?: string;
  topImageClassName?: string;
  rightImage?: string;
  rightImageClassName?: string;
  leftImage?: string;
  leftImageClassName?: string;
  title?: string;
  content?: string;
  timestamp?: string;
  href?: string;
}

export default function PostCard({
  href = "#",
  className,
  topImage,
  topImageClassName,
  rightImage,
  rightImageClassName,
  leftImage,
  leftImageClassName,
  title = "",
  content = ``,
  timestamp = "",
}: IPostCardProps) {
  return (
    <Link
      href={href}
      className={cn("flex cursor-pointer flex-col gap-2 leading-4", className)}
    >
      <h4 className="font-bold hover:underline text-[#2ea4d3] line-clamp-1">
        {title}
      </h4>
      {topImage && (
        <div
          className={cn(
            "flex justify-center items-center w-full h-[200px] relative",
            topImageClassName
          )}
        >
          <Image src={topImage} className="object-cover" alt={title} fill />
        </div>
      )}
      <div className="flex justify-center items-center w-full gap-2">
        {leftImage && (
          <div
            className={cn(
              "flex justify-center items-center min-w-[150px] min-h-[110px] relative",
              leftImageClassName
            )}
          >
            <Image
              src={leftImage}
              className="object-contain"
              alt={title}
              fill
            />
          </div>
        )}
        <p
          className={cn(
            "hover:underline text-[12px] w-full font-[600] line-clamp-3",
            {
              "line-clamp-4": rightImage || leftImage,
            }
          )}
        >
          {content}
        </p>
        {rightImage && (
          <div
            className={cn(
              "flex justify-center items-center min-w-[150px] min-h-[110px] relative",
              rightImageClassName
            )}
          >
            <Image
              src={rightImage}
              className="object-contain"
              alt={title}
              fill
            />
          </div>
        )}
      </div>
      <span className="text-neutral-500 text-[13px]">{timestamp}</span>
    </Link>
  );
}
