"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth-context";
import { usersAPI } from "../../../lib/api-client";
import { useRouter } from "next/navigation";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import UsersTable from "./components/UsersTable";
import InviteUserModal from "./components/InviteUserModal";

const UserManagement: React.FC = () => {
  const { user, loading: authLoading, isManager, isStaff } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or not staff/manager
    if (!authLoading && (!user || (!isStaff && !isManager))) {
      router.push("/login");
      return;
    }

    if (user && (isStaff || isManager)) {
      fetchUsers();
    }
  }, [user, authLoading, isStaff, isManager, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.list();
      setUsers(data.users || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSuccess = () => {
    setShowInviteModal(false);
    fetchUsers(); // Refresh the users list
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      await usersAPI.update(userId, updates);
      fetchUsers(); // Refresh the users list
    } catch (err: any) {
      console.error("Error updating user:", err);
      alert(err.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      fetchUsers(); // Refresh the users list
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert(err.message || "Failed to delete user");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl text-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage users and permissions for your dealership
            </p>
          </div>
          {isStaff && (
            <Button
              variant="default"
              onClick={() => setShowInviteModal(true)}
              iconName="UserPlus"
            >
              Invite User
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <p className="text-error">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-card rounded-lg shadow-moderate p-6">
          <UsersTable
            users={users}
            loading={loading}
            isManager={isManager}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <InviteUserModal
          isManager={isManager}
          onClose={() => setShowInviteModal(false)}
          onSuccess={handleInviteSuccess}
        />
      )}
    </div>
  );
};

export default UserManagement;
