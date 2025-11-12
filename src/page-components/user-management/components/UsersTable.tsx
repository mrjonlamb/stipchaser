"use client";

import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: number;
  invitedBy?: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  isManager: boolean;
  onUpdate: (userId: string, updates: any) => void;
  onDelete: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  isManager,
  onUpdate,
  onDelete,
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "DealerManager":
        return "bg-primary/10 text-primary";
      case "DealerStaff":
        return "bg-accent/10 text-accent";
      case "Consumer":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "inactive":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Users" size={48} color="var(--color-muted-foreground)" />
        <h3 className="text-lg font-semibold text-foreground mt-4">
          No users found
        </h3>
        <p className="text-muted-foreground mt-2">
          Start by inviting your first user
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Role
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Invited By
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Created
            </th>
            {isManager && (
              <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="var(--color-primary)" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user.email}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-muted-foreground">
                  {user.invitedBy || "-"}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </span>
              </td>
              {isManager && (
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    {user.status === "inactive" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdate(user.id, { status: "active" })}
                        iconName="Check"
                      >
                        Activate
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdate(user.id, { status: "inactive" })
                        }
                        iconName="X"
                      >
                        Deactivate
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      iconName="Trash"
                    />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
