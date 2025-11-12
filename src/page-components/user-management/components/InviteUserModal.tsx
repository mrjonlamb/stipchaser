"use client";

import React, { useState } from "react";
import { usersAPI } from "../../../../lib/api-client";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";

interface InviteUserModalProps {
  isManager: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isManager,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Role options based on user permissions
  const roleOptions = isManager
    ? [
        { value: "DealerManager", label: "Dealer Manager" },
        { value: "DealerStaff", label: "Dealer Staff" },
        { value: "Consumer", label: "Consumer" },
      ]
    : [{ value: "Consumer", label: "Consumer" }];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await usersAPI.invite({
        email: formData.email,
        role: formData.role as "DealerManager" | "DealerStaff" | "Consumer",
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      onSuccess();
    } catch (err: any) {
      console.error("Error inviting user:", err);
      setErrors({
        general: err.message || "Failed to invite user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-strong max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Invite User</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-md">
              <div className="flex items-start space-x-2">
                <Icon
                  name="AlertCircle"
                  size={16}
                  color="var(--color-error)"
                  className="mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-error">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />

              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>

            <Select
              label="Role"
              placeholder="Select role"
              options={roleOptions}
              value={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              error={errors.role}
              required
            />

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon
                  name="Info"
                  size={16}
                  color="var(--color-primary)"
                  className="mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-muted-foreground">
                  An invitation email will be sent with temporary credentials.
                  The user must set a new password on first login.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              iconName="Send"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
