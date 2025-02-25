import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormMessage } from "@/components/ui/form";
import { SignInForm } from "@/components/auth/signin-form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-screen justify-center items-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-10">
          <SignInForm />
          <Form
            className="flex flex-col gap-5"
            action={async (formData) => {
              "use server";
              await signIn("nodemailer", {
                email: formData.get("email"),
                redirectTo: "/user/dashboard",
              });
            }}
          >
            <Input type="text" name="email" placeholder="Email" />
            <Button type="submit" className="w-full">
              Sign in with Nodemailer
            </Button>
          </Form>
          <Form
            key={"google"}
            action={async () => {
              "use server";
              try {
                await signIn("google", {
                  redirectTo: "/user/dashboard",
                });
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`/signin/?error=${error.type}`);
                }
                throw error;
              }
            }}
          >
            <Button className="w-full" type="submit">
              Sign in with Google
            </Button>
          </Form>
          {searchParams.error && <FormMessage>Sign In failed</FormMessage>}
        </CardContent>
      </Card>
    </div>
  );
}
