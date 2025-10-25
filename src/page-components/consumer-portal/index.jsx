"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/ui/Header";
import DocumentUploadCard from "./components/DocumentUploadCard";
import ProgressTracker from "./components/ProgressTracker";
import MessagePanel from "./components/MessagePanel";
import DocumentGuidance from "./components/DocumentGuidance";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const ConsumerPortal = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dealerInfo, setDealerInfo] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Mock data initialization
  useEffect(() => {
    const mockDocuments = [
      {
        id: 1,
        title: "Pay Stubs",
        description: "Recent pay stubs showing current income",
        requirements: "Last 2-3 pay stubs, must be within 30 days",
        status: "completed",
        uploadedFile: {
          name: "paystub_october_2025.pdf",
          size: "2.4 MB",
          uploadedAt: "Oct 14, 2025 at 2:30 PM",
          url: "https://example.com/documents/paystub.pdf",
        },
      },
      {
        id: 2,
        title: "Bank Statements",
        description: "Recent bank statements for income verification",
        requirements: "Last 2 months, all pages including account summary",
        status: "pending",
        uploadedFile: {
          name: "bank_statement_sept_2025.pdf",
          size: "1.8 MB",
          uploadedAt: "Oct 15, 2025 at 10:15 AM",
          url: "https://example.com/documents/bank_statement.pdf",
        },
      },
      {
        id: 3,
        title: "Utility Bill",
        description: "Proof of residence - electric, gas, or water bill",
        requirements: "Current address, dated within 60 days",
        status: "needs_revision",
        feedback:
          "The address on the utility bill doesn't match the application. Please provide a bill with the correct address or update your application.",
        uploadedFile: {
          name: "electric_bill_september.jpg",
          size: "3.1 MB",
          uploadedAt: "Oct 13, 2025 at 4:45 PM",
          url: "https://images.unsplash.com/photo-1725839556593-465b12a30f91",
        },
      },
      {
        id: 4,
        title: "Driver's License",
        description: "Valid government-issued photo identification",
        requirements: "Front and back, current and not expired",
        status: "not_started",
      },
      {
        id: 5,
        title: "Insurance Declaration",
        description: "Auto insurance declaration page",
        requirements: "Must show full coverage for the vehicle being financed",
        status: "not_started",
      },
    ];

    const mockMessages = [
      {
        id: 1,
        sender: "Sarah Johnson",
        content:
          "Hi Michael! I've received your pay stubs and they look great. Just waiting on a few more documents to complete your file.",
        timestamp: new Date("2025-10-16T09:30:00"),
        isRead: true,
      },
      {
        id: 2,
        sender: "You",
        content:
          "Thanks Sarah! I just uploaded my bank statements. Let me know if you need anything else.",
        timestamp: new Date("2025-10-16T10:15:00"),
        isRead: true,
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        content: `I noticed the address on your utility bill doesn't match your application. Could you please upload a bill with your current address?\n\nAlternatively, you can update your address in the application if it's incorrect.`,
        timestamp: new Date("2025-10-16T14:20:00"),
        isRead: false,
      },
      {
        id: 4,
        sender: "Sarah Johnson",
        content:
          "Once we have the corrected utility bill and your driver's license, we should be able to move forward quickly with your approval!",
        timestamp: new Date("2025-10-16T14:22:00"),
        isRead: false,
      },
    ];

    const mockDealerInfo = {
      name: "Sarah Johnson",
      role: "Finance Specialist",
      avatar: "https://images.unsplash.com/photo-1702089050621-62646a2b748f",
      avatarAlt:
        "Professional headshot of woman with shoulder-length brown hair wearing navy blazer",
      phone: "(555) 123-4567",
      email: "sarah.johnson@dealership.com",
    };

    const mockNotifications = [
      {
        id: 1,
        type: "document_feedback",
        title: "Document needs revision",
        message: "Your utility bill requires attention",
        timestamp: new Date("2025-10-16T14:20:00"),
        isRead: false,
      },
      {
        id: 2,
        type: "new_message",
        title: "New message from Sarah",
        message: "Update on your application status",
        timestamp: new Date("2025-10-16T14:22:00"),
        isRead: false,
      },
    ];

    setDocuments(mockDocuments);
    setMessages(mockMessages);
    setDealerInfo(mockDealerInfo);
    setNotifications(mockNotifications);
  }, []);

  const handleFileUpload = (documentId, file) => {
    const updatedDocuments = documents?.map((doc) => {
      if (doc?.id === documentId) {
        return {
          ...doc,
          status: "pending",
          uploadedFile: {
            name: file?.name,
            size: `${(file?.size / (1024 * 1024))?.toFixed(1)} MB`,
            uploadedAt:
              new Date()?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) +
              " at " +
              new Date()?.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
            url: URL.createObjectURL(file),
          },
          feedback: null,
        };
      }
      return doc;
    });
    setDocuments(updatedDocuments);
  };

  const handleFileRemove = (documentId) => {
    const updatedDocuments = documents?.map((doc) => {
      if (doc?.id === documentId) {
        return {
          ...doc,
          status: "not_started",
          uploadedFile: null,
          feedback: null,
        };
      }
      return doc;
    });
    setDocuments(updatedDocuments);
  };

  const handleFilePreview = (file) => {
    if (file?.url) {
      window.open(file?.url, "_blank");
    }
  };

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      id: messages?.length + 1,
      sender: "You",
      content: messageContent,
      timestamp: new Date(),
      isRead: true,
    };
    setMessages([...messages, newMessage]);
  };

  const completedDocuments = documents?.filter(
    (doc) => doc?.status === "completed"
  )?.length;
  const totalDocuments = documents?.length;
  const unreadMessages = messages?.filter(
    (msg) => !msg?.isRead && msg?.sender !== "You"
  )?.length;
  const estimatedDays = Math.max(
    1,
    7 - Math.floor((completedDocuments / totalDocuments) * 6)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="consumer"
        notificationCount={notifications?.filter((n) => !n?.isRead)?.length}
        onRoleSwitch={() => {}}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Document Portal
              </h1>
              <p className="text-muted-foreground mt-2">
                Submit your required documents to complete your vehicle
                financing
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/conversation-interface")}
              iconName="MessageSquare"
              iconPosition="left"
            >
              View All Messages
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {notifications?.some((n) => !n?.isRead) && (
          <div className="mb-6">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Bell" size={20} color="var(--color-warning)" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-warning mb-2">
                    Action Required
                  </h3>
                  <div className="space-y-1">
                    {notifications
                      ?.filter((n) => !n?.isRead)
                      ?.map((notification) => (
                        <p
                          key={notification?.id}
                          className="text-sm text-warning/80"
                        >
                          • {notification?.message}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker
              completedDocuments={completedDocuments}
              totalDocuments={totalDocuments}
              estimatedDays={estimatedDays}
            />

            {/* Document Upload Cards */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Required Documents
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Info" size={16} />
                  <span>Click on guidance panel for help</span>
                </div>
              </div>

              {documents?.map((document) => (
                <DocumentUploadCard
                  key={document?.id}
                  document={document}
                  onUpload={handleFileUpload}
                  onRemove={handleFileRemove}
                  onPreview={handleFilePreview}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Message Panel */}
            <MessagePanel
              messages={messages}
              onSendMessage={handleSendMessage}
              dealerInfo={dealerInfo}
              unreadCount={unreadMessages}
            />

            {/* Document Guidance */}
            <DocumentGuidance />

            {/* Contact Information */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-minimal">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Need Help?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={16} color="var(--color-primary)" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Call Us
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dealerInfo?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={16} color="var(--color-primary)" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {dealerInfo?.email}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="HelpCircle"
                    iconPosition="left"
                  >
                    FAQ & Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerPortal;
