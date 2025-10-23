import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const AccountSettings = () => {
    return (
        <Card className="rounded-none rounded-b-md border-none shadow-none">
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                    <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive email updates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                    <div>
                        <p className="font-medium">Privacy Settings</p>
                        <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                    <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your password</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                </div>

                <div className="flex items-center justify-between py-3">
                    <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add extra security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountSettings;
