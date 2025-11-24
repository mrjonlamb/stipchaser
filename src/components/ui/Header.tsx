"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Icon from "../AppIcon";
import Button from "./Button";
import { useAuth } from "../../../lib/auth-context";

interface HeaderProps {
  userRole?: "dealer" | "consumer";
  notificationCount?: number;
  onRoleSwitch?: (role: "dealer" | "consumer") => void;
}

const Header: React.FC<HeaderProps> = ({
  userRole = "dealer",
  notificationCount = 0,
  onRoleSwitch,
}) => {
  const router = useRouter();
  const { isManager } = useAuth();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleRoleSwitch = () => {
    const newRole = userRole === "dealer" ? "consumer" : "dealer";
    if (onRoleSwitch) {
      onRoleSwitch(newRole);
    } else {
      // Default navigation if no handler provided
      router.push(
        newRole === "dealer" ? "/dealer-dashboard" : "/consumer-portal"
      );
    }
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Icon name="FileText" size={28} color="var(--color-primary)" />
            <span className="text-xl font-bold text-foreground">
              StipChaser
            </span>
          </div>

          {/* Navigation - Only for Dealer Managers */}
          {isManager && (
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => router.push("/user-management")}
                className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Icon name="Users" size={18} color="var(--color-foreground)" />
                <span>Users</span>
              </button>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              className="relative p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={20} color="var(--color-foreground)" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-error text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRoleSwitch}
              iconName={userRole === "dealer" ? "User" : "Briefcase"}
              iconPosition="left"
            >
              {userRole === "dealer" ? "Consumer View" : "Dealer View"}
            </Button>

            {/* User Menu */}
            <button
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="User menu"
            >
              <Icon name="User" size={20} color="var(--color-foreground)" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
