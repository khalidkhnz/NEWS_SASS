import { cn } from "@/lib/utils";
import Image from "next/image";

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
}

export default function PostCard({
  className,
  topImage,
  topImageClassName,
  rightImage,
  rightImageClassName,
  leftImage,
  leftImageClassName,
  title = "WORLD NEWS",
  content = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
          sapiente? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Explicabo voluptas incidunt provident veritatis recusandae aperiam
          commodi, alias vel praesentium dicta. Explicabo voluptas incidunt provident veritatis recusandae aperiam
          commodi, alias vel praesentium dicta. Explicabo voluptas incidunt provident veritatis recusandae aperiam
          commodi, alias vel praesentium dicta.`,
  timestamp = "Updated 1 hour ago",
}: IPostCardProps) {
  return (
    <div
      className={cn("flex cursor-pointer flex-col gap-2 leading-4", className)}
    >
      <h4 className="font-bold hover:underline text-[#2ea4d3]">{title}</h4>
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
          className={cn("hover:underline text-[12px] font-[600] line-clamp-3", {
            "line-clamp-4": rightImage || leftImage,
          })}
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
    </div>
  );
}
