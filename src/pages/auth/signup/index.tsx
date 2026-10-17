import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { SignupForm } from "@/components/features/auth/signup-form";

export default function SignupPage() {
  return (
    <Card className="p-6 sm:p-8">
      <AuthFormHeader title="Create your account" description="A little inspiration for your everyday cooking." />

      <SignupForm />

      <p className="mt-6 border-t border-ink/10 pt-5 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link className="font-medium text-accent underline underline-offset-4 hover:text-ink" to="/auth/login">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
