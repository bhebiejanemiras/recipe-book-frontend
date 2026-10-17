import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { AuthHeader } from "@/components/features/auth/auth-header";

export default function AuthLayout() {
  const { user, ready } = useAuth();

  if (ready && user) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />;

  return (
    <main className="min-h-svh bg-paper text-ink lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Marketing panel: desktop only. */}
      <aside className="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex xl:p-16">
        <AuthHeader tone="dark" />
        <ul className="mt-16 space-y-3 border-t border-paper/15 pt-8 text-sm text-paper/55">
          <li>Save every favourite recipe in one place.</li>
          <li>Organise by cuisine, meal type and difficulty.</li>
          <li>Open your collection from any device.</li>
        </ul>
      </aside>

      {/* Form panel. */}
      <div className="flex min-h-svh items-center justify-center px-4 py-12 sm:px-8 lg:min-h-0">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <AuthHeader />
          </div>
          {ready && <Outlet />}
        </div>
      </div>
    </main>
  );
}
