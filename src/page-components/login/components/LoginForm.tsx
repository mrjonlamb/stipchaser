"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../lib/auth-context";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import Icon from "../../../components/AppIcon";

const LoginForm = () => {
  const router = useRouter();
  const { signIn, completeNewPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData?.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData?.password) {
      newErrors.password = "Password is required";
    } else if (formData?.password?.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        // Get user info to determine redirect
        // The useAuth hook will have the updated user info
        // For now, redirect to dealer dashboard and let middleware handle it
        router.push("/dealer-dashboard");
      } else if (result.challengeName === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        // User needs to change password
        setRequiresPasswordChange(true);
        setErrors({});
      } else {
        setErrors({
          general: "Invalid email or password. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        general: error.message || "An error occurred during sign in.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();

    // Validate new password
    const newErrors: any = {};
    if (!newPasswordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPasswordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(newPasswordData.newPassword)) {
      newErrors.newPassword = "Password must contain an uppercase letter";
    } else if (!/[a-z]/.test(newPasswordData.newPassword)) {
      newErrors.newPassword = "Password must contain a lowercase letter";
    } else if (!/[0-9]/.test(newPasswordData.newPassword)) {
      newErrors.newPassword = "Password must contain a number";
    } else if (!/[^A-Za-z0-9]/.test(newPasswordData.newPassword)) {
      newErrors.newPassword = "Password must contain a special character";
    }

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const success = await completeNewPassword(newPasswordData.newPassword);

      if (success) {
        router.push("/dealer-dashboard");
      } else {
        setErrors({
          general: "Failed to update password. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      setErrors({
        general: error.message || "An error occurred while changing password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Password reset functionality would be implemented here");
  };

  // Render password change form if required
  if (requiresPasswordChange) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-moderate p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Lock" size={24} color="white" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Change Password
            </h1>
            <p className="text-muted-foreground">
              Please set a new password for your account
            </p>
          </div>

          {errors?.general && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md">
              <div className="flex items-start space-x-2">
                <Icon
                  name="AlertCircle"
                  size={16}
                  color="var(--color-error)"
                  className="mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-error">{errors?.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleNewPasswordSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPasswordData.newPassword}
              onChange={(e) =>
                setNewPasswordData((prev) => ({
                  ...prev,
                  newPassword: e?.target?.value,
                }))
              }
              error={errors?.newPassword}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={newPasswordData.confirmPassword}
              onChange={(e) =>
                setNewPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e?.target?.value,
                }))
              }
              error={errors?.confirmPassword}
              required
            />

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains uppercase letter (A-Z)</li>
                <li>Contains lowercase letter (a-z)</li>
                <li>Contains number (0-9)</li>
                <li>Contains special character (!@#$%^&*)</li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              iconName="Check"
              iconPosition="right"
            >
              Set New Password
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Render normal login form
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-moderate p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileCheck" size={24} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your StipChaser account
          </p>
        </div>

        {errors?.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-start space-x-2">
              <Icon
                name="AlertCircle"
                size={16}
                color="var(--color-error)"
                className="mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={(e) => handleInputChange("email", e?.target?.value)}
            error={errors?.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange("password", e?.target?.value)}
            error={errors?.password}
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              checked={formData?.rememberMe}
              onChange={(e) =>
                handleInputChange("rememberMe", e?.target?.checked)
              }
            />

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            New to StipChaser?{" "}
            <button className="text-primary hover:text-primary/80 font-medium transition-colors">
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
