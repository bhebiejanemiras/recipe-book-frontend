import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <Card className="p-6 sm:p-8">
      {/* The page owns its presentation; the feature handles form state and submission. */}
      <AuthFormHeader title="Welcome back" description="Sign in to find your next favourite meal." />

      <LoginForm />

      <p className="mt-6 border-t border-ink/10 pt-5 text-center text-sm text-ink/60">
        New here?{" "}
        <Link className="font-medium text-accent underline underline-offset-4 hover:text-ink" to="/auth/signup">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
