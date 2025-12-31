import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { updateProfile } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Lock, Calendar, Mail, Save, Loader2 } from "lucide-react";

export function ProfilePage() {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();

    const [name, setName] = useState(user?.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleUpdateName = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        try {
            setIsUpdating(true);
            const updatedUser = await updateProfile({ name: name.trim() });
            setUser(updatedUser);
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error("Failed to update profile", {
                description: error.response?.data?.message || "Something went wrong"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword) {
            toast.error("Current password is required");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setIsChangingPassword(true);
            await updateProfile({ currentPassword, newPassword });
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error("Failed to change password", {
                description: error.response?.data?.message || "Incorrect current password"
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (!user) {
        return null;
    }

    const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <div className="space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            My Account
                        </CardTitle>
                        <CardDescription>
                            Manage your profile and account settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Member since {memberSince}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Name */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Display Name</CardTitle>
                        <CardDescription>
                            This is how you'll appear in the app
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>
                        <Button
                            onClick={handleUpdateName}
                            disabled={isUpdating || name === user.name}
                        >
                            {isUpdating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>

                <Separator />

                {/* Change Password */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Change Password
                        </CardTitle>
                        <CardDescription>
                            Update your password to keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 6 characters)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <Button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                            variant="outline"
                        >
                            {isChangingPassword ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Lock className="mr-2 h-4 w-4" />
                            )}
                            Change Password
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
