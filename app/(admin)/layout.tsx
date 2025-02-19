import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/schema/users";
import { isAdmin } from "@/lib/authorization";
import { AdminLayout } from "@/components/layouts/admin/admin-layout";
import { AdminHeader } from "@/components/layouts/admin/admin-header";
import { AdminContent } from "@/components/layouts/admin/admin-content";
import { FlashMessage } from "@/components/ui/flash-message";
import CmsSidebar from "@/components/news/CmsSidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin-signin");
  }

  if (!isAdmin(session)) {
    redirect("/admin-signin");
  }

  const userObj = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!userObj) {
    redirect("/admin-signin");
  }

  return (
    <AdminLayout>
      <AdminHeader user={userObj} />
      <AdminContent>
        <FlashMessage />
        <CmsSidebar>{children}</CmsSidebar>
      </AdminContent>
    </AdminLayout>
  );
}

export const dynamic = "force-dynamic";
