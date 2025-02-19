import { IUser } from "@/schema/users";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar";
import { User2Icon } from "lucide-react";

export function PrivateHeader({ user }: { user: IUser }) {
  return (
    <div className="row-span-1 col-span-2 gap-2 border-b border-muted-300 dark:border-muted-700 dark:bg-primary-900 bg-gradient-to-t dark:from-primary-950 dark:to-primary-900 from-primary-100 to-primary-50">
      <div className="flex w-full items-center justify-between h-12">
        <div className="px-2 font-mono font-bold">
          <Link href="/">NEWS SASS</Link>
        </div>
        <div className="flex gap-2 items-center px-2">
          <div className="capitalize font-semibold">{user.name}</div>
          <Avatar>
            <AvatarImage src={user.image || "https://github.com/shadcn.png"} />
            <AvatarFallback>
              <User2Icon className="rounded-full bg-primary-200" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
