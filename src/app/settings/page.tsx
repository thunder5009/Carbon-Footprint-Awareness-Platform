import { auth } from "@/lib/auth/config";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null; // Middleware handles redirect
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold glass-text">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, profile, and data preferences.</p>
      </div>

      <SettingsClient user={session.user} />
    </div>
  );
}
