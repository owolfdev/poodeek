// forgot-password/page.tsx
import { forgotPasswordAction } from "@/app/actions/auth-actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ message?: Message | null } | null>;
};

export default async function ForgotPassword({ searchParams }: PageProps) {
  const params = await searchParams;
  const message = params?.message;

  return (
    <div className="flex flex-col items-center max-w-3xl gap-8 pt-12">
      <form className="flex-1 flex flex-col sm:w-[500px] w-[300px] gap-4">
        <h1 className="text-6xl font-black">Reset Password</h1>
        <p className="text-sm text-secondary-foreground">
          Already have an account?{" "}
          <Link className="text-primary underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="text-lg"
          />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          {message && <FormMessage message={message} />}
        </div>
      </form>
    </div>
  );
}
