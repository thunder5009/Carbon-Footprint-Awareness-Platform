"use client";

import { useState } from "react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { LiquidButton } from "@/components/ui/liquid-button";
import { toast } from "sonner";
import { Download, Trash2, AlertTriangle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface User {
  id?: string | null;
  email?: string | null;
  role?: string | null;
}

export function SettingsClient({ user }: { user: User }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = () => {
    // Navigate to export endpoint which triggers download
    window.location.href = "/api/user/export";
    toast.success("Export started.");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete your account and all footprint data? This cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted.");
        // Sign out to clear session cookies
        await signOut({ callbackUrl: "/" });
      } else {
        toast.error("Failed to delete account.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <LiquidGlass className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Profile Details</h2>
          <p className="text-sm text-muted-foreground">Logged in as {user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account ID</label>
            <p className="font-mono text-sm">{user.id || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
            <p className="capitalize text-sm">{user.role || "User"}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <LiquidButton variant="clear" onClick={() => signOut()} className="hover:bg-white/5 w-full md:w-auto">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </LiquidButton>
        </div>
      </LiquidGlass>

      <LiquidGlass className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Data Management</h2>
          <p className="text-sm text-muted-foreground">Export your history or permanently delete your account.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all your footprint records as JSON.</p>
            </div>
            <LiquidButton onClick={handleExport} className="shrink-0 w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" /> Export JSON
            </LiquidButton>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div>
              <p className="font-medium text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Danger Zone
              </p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
            </div>
            <LiquidButton 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="shrink-0 w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" /> {isDeleting ? "Deleting..." : "Delete Account"}
            </LiquidButton>
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
}
