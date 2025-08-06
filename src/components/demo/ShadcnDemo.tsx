import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";

// Demo component menggunakan shadcn/ui
const ShadcnDemo: React.FC = () => {
    return (
        <div className="space-y-6 p-6">
            {/* Header dengan shadcn/ui Button */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>
                                Kelola pengguna sistem dan role mereka
                            </CardDescription>
                        </div>
                        <Button>
                            <Plus className="w-4 h-4" />
                            Tambah User
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Button Variants Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Button Variants</CardTitle>
                    <CardDescription>
                        Berbagai variant button yang tersedia
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="default">Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon">
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Form Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Form Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Enter name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="guest">Guest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button>Save</Button>
                        <Button variant="outline">Cancel</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Tabs Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="users">Users</TabsTrigger>
                            <TabsTrigger value="roles">Roles</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="users" className="mt-4">
                            <p>User management content here...</p>
                        </TabsContent>
                        <TabsContent value="roles" className="mt-4">
                            <p>Role management content here...</p>
                        </TabsContent>
                        <TabsContent value="settings" className="mt-4">
                            <p>Settings content here...</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShadcnDemo;
