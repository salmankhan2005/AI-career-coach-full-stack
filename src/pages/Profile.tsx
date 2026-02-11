import { UserCircle, Mail, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, useDatabase } from "@/hooks/use-database";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { data: user, isLoading } = useUser();
  const { updateProfile } = useDatabase();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(displayName);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>
      <div className="max-w-lg space-y-6 rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
            <UserCircle className="h-10 w-10 text-brand" />
          </div>
          <div>
            <p className="font-semibold">{user?.displayName || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email || ""} className="mt-1" readOnly disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Plan</label>
              <div className="flex items-center gap-2 mt-1 p-2 border rounded-md bg-muted/50">
                <Shield className="h-4 w-4 text-brand" />
                <span className="text-sm font-medium">{user?.subscriptionPlan}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">AI Credits</label>
              <div className="flex items-center gap-2 mt-1 p-2 border rounded-md bg-muted/50">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{user?.credits} remaining</span>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
