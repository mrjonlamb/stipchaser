import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ConversationSidebar from './components/ConversationSidebar';
import MessageArea from './components/MessageArea';
import ConversationDetails from './components/ConversationDetails';

import Button from '../../components/ui/Button';

const ConversationInterface = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userRole, setUserRole] = useState('dealer');
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Mock conversations data
  const conversations = [
  {
    id: 1,
    customerName: 'Sarah Johnson',
    customerAvatar: "https://images.unsplash.com/photo-1700560970703-82fd3150d5ac",
    customerAvatarAlt: 'Professional headshot of woman with shoulder-length brown hair in white blazer',
    dealNumber: 'D2024-1001',
    isOnline: true,
    hasUnread: true,
    pendingDocuments: 2,
    priority: 'high',
    lastMessage: {
      content: 'I just uploaded my pay stub. Can you please review it?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      channel: 'chat'
    }
  },
  {
    id: 2,
    customerName: 'Michael Rodriguez',
    customerAvatar: "https://images.unsplash.com/photo-1724128195747-dd25cba7860f",
    customerAvatarAlt: 'Professional headshot of Hispanic man with short black hair in navy suit',
    dealNumber: 'D2024-1002',
    isOnline: false,
    hasUnread: false,
    pendingDocuments: 1,
    priority: 'normal',
    lastMessage: {
      content: 'Thanks for the quick response! I\'ll get those documents to you by tomorrow.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      channel: 'sms'
    }
  },
  {
    id: 3,
    customerName: 'Emily Chen',
    customerAvatar: "https://images.unsplash.com/photo-1668049221564-862149a48e10",
    customerAvatarAlt: 'Professional headshot of Asian woman with long black hair in business attire',
    dealNumber: 'D2024-1003',
    isOnline: true,
    hasUnread: true,
    pendingDocuments: 0,
    priority: 'normal',
    lastMessage: {
      content: 'Hi! I have a question about the insurance requirements.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      channel: 'whatsapp'
    }
  },
  {
    id: 4,
    customerName: 'David Thompson',
    customerAvatar: "https://images.unsplash.com/photo-1585066047759-3438c34cf676",
    customerAvatarAlt: 'Professional headshot of Caucasian man with beard wearing dark suit',
    dealNumber: 'D2024-1004',
    isOnline: false,
    hasUnread: false,
    pendingDocuments: 3,
    priority: 'high',
    lastMessage: {
      content: 'I\'m having trouble with the document upload. Can someone help?',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      channel: 'chat'
    }
  }];


  // Mock messages for selected conversation
  const mockMessages = [
  {
    id: 1,
    sender: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1700560970703-82fd3150d5ac",
    avatarAlt: 'Professional headshot of woman with shoulder-length brown hair in white blazer',
    content: 'Hi! I\'m ready to submit my documents for the car loan. What do I need to provide?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    channel: 'chat',
    status: 'read'
  },
  {
    id: 2,
    sender: 'You',
    content: 'Hello Sarah! Great to hear from you. For your loan application, we\'ll need:\n\n• Recent pay stub (last 30 days)\n• Bank statements (last 3 months)\n• Proof of residence (utility bill)\n• Valid driver\'s license\n\nYou can upload these directly through our portal or send them via this chat.',
    timestamp: new Date(Date.now() - 110 * 60 * 1000),
    channel: 'chat',
    status: 'read'
  },
  {
    id: 3,
    sender: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1700560970703-82fd3150d5ac",
    avatarAlt: 'Professional headshot of woman with shoulder-length brown hair in white blazer',
    content: 'Perfect! I have most of these ready. Let me start with my pay stub.',
    timestamp: new Date(Date.now() - 100 * 60 * 1000),
    channel: 'chat',
    status: 'read'
  },
  {
    id: 4,
    sender: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1700560970703-82fd3150d5ac",
    avatarAlt: 'Professional headshot of woman with shoulder-length brown hair in white blazer',
    content: 'Document uploaded successfully.',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    channel: 'chat',
    status: 'read',
    attachment: {
      type: 'document',
      name: 'PayStub_October_2024.pdf',
      url: '#',
      size: '245 KB'
    }
  },
  {
    id: 5,
    sender: 'You',
    content: 'Thank you! I\'ve received your pay stub and it looks good. The amount and employer information are clear. Next, could you please upload your bank statements from the last 3 months?',
    timestamp: new Date(Date.now() - 80 * 60 * 1000),
    channel: 'chat',
    status: 'read'
  },
  {
    id: 6,
    sender: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1700560970703-82fd3150d5ac",
    avatarAlt: 'Professional headshot of woman with shoulder-length brown hair in white blazer',
    content: 'I just uploaded my pay stub. Can you please review it?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    channel: 'chat',
    status: 'delivered'
  }];


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages);

      // Simulate typing indicator
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 1000);

      return () => clearTimeout(typingTimer);
    }
  }, [selectedConversation]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleSendMessage = (messageData) => {
    const newMessage = {
      id: messages?.length + 1,
      sender: 'You',
      content: messageData?.content,
      timestamp: messageData?.timestamp,
      channel: messageData?.channel,
      status: 'sent'
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
      prev?.map((msg) =>
      msg?.id === newMessage?.id ?
      { ...msg, status: 'delivered' } :
      msg
      )
      );
    }, 1000);

    // Simulate read receipt
    setTimeout(() => {
      setMessages((prev) =>
      prev?.map((msg) =>
      msg?.id === newMessage?.id ?
      { ...msg, status: 'read' } :
      msg
      )
      );
    }, 3000);
  };

  const handleFileUpload = (files) => {
    files?.forEach((file, index) => {
      const newMessage = {
        id: messages?.length + index + 1,
        sender: 'You',
        content: `Uploaded: ${file?.name}`,
        timestamp: new Date(),
        channel: 'chat',
        status: 'sent',
        attachment: {
          type: file?.type?.startsWith('image/') ? 'image' : 'document',
          name: file?.name,
          url: URL.createObjectURL(file),
          alt: file?.type?.startsWith('image/') ? `Uploaded image: ${file?.name}` : undefined,
          size: `${(file?.size / 1024)?.toFixed(1)} KB`
        }
      };

      setMessages((prev) => [...prev, newMessage]);
    });
  };

  const handleRequestDocument = (template) => {
    const requestMessage = {
      id: messages?.length + 1,
      sender: 'You',
      content: `Hi! Could you please upload your ${template?.name?.toLowerCase()}? ${template?.description}`,
      timestamp: new Date(),
      channel: 'chat',
      status: 'sent'
    };

    setMessages((prev) => [...prev, requestMessage]);
  };

  const handleNewConversation = () => {
    // In a real app, this would open a modal or navigate to a new conversation form
    console.log('Creating new conversation...');
  };

  const handleViewDocuments = () => {
    navigate('/document-management');
  };

  const handleRoleSwitch = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'consumer') {
      navigate('/consumer-portal');
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        notificationCount={3}
        onRoleSwitch={handleRoleSwitch} />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Mobile Sidebar Overlay */}
        {isMobile && showSidebar &&
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSidebar(false)} />

        }

        {/* Sidebar */}
        <div className={`${
        isMobile ?
        `fixed left-0 top-16 h-[calc(100vh-4rem)] z-50 transform transition-transform ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'}` :

        showSidebar ? 'relative' : 'hidden'}`
        }>
          <ConversationSidebar
            selectedConversation={selectedConversation}
            conversations={conversations}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation} />

        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Mobile Header */}
          {isMobile &&
          <div className="absolute top-0 left-0 right-0 h-12 bg-card border-b border-border flex items-center justify-between px-4 z-30">
              <Button
              variant="ghost"
              size="sm"
              iconName="Menu"
              onClick={toggleSidebar} />

              {selectedConversation &&
            <h2 className="font-medium text-foreground truncate">
                  {selectedConversation?.customerName}
                </h2>
            }
              <Button
              variant="ghost"
              size="sm"
              iconName="Info"
              onClick={toggleDetails} />

            </div>
          }

          {/* Message Area */}
          <div className={`flex-1 ${isMobile ? 'mt-12' : ''}`}>
            <MessageArea
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              isTyping={isTyping} />

          </div>

          {/* Details Panel Toggle (Desktop) */}
          {!isMobile && selectedConversation &&
          <div className="flex items-center">
              <Button
              variant="ghost"
              size="sm"
              iconName={showDetails ? "ChevronRight" : "Info"}
              onClick={toggleDetails}
              className="h-full rounded-none border-l border-border" />

            </div>
          }

          {/* Details Panel */}
          <ConversationDetails
            conversation={selectedConversation}
            onRequestDocument={handleRequestDocument}
            onViewDocuments={handleViewDocuments}
            isVisible={showDetails}
            onToggle={toggleDetails} />

        </div>
      </div>
    </div>);

};

export default ConversationInterface;