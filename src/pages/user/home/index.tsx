import { useState } from "react";
import { useAuth } from "@/components/context/use-auth";
import { PageHeader } from "@/components/common/page-header";
import { RecipeCollection } from "@/components/features/recipe/recipe-collection";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");

  async function handleLogout() {
    try {
      setError("");
      await logout();
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }

  return (
    <Section>
      <PageHeader eyebrow="Your kitchen companion" title="Recipe Book" description="Browse and manage the recipes you have saved.">
        <div className="flex items-center gap-3">
          <span className="text-sm text-paper/60">{user?.name}</span>
          <Button variant="inverse" onClick={handleLogout}>Sign out</Button>
        </div>
      </PageHeader>

      {error && <Alert tone="error" className="mb-6">{error}</Alert>}

      <RecipeCollection />
    </Section>
  );
}
