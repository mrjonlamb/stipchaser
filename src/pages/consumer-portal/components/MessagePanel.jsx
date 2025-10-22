import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MessagePanel = ({ 
  messages, 
  onSendMessage, 
  dealerInfo,
  unreadCount = 0 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = () => {
    if (newMessage?.trim()) {
      onSendMessage(newMessage?.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-minimal">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-border cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={dealerInfo?.avatar}
              alt={dealerInfo?.avatarAlt}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{dealerInfo?.name}</h3>
            <p className="text-xs text-muted-foreground">{dealerInfo?.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            color="var(--color-muted-foreground)" 
          />
        </div>
      </div>
      {/* Messages */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
            {messages?.map((message, index) => {
              const showDate = index === 0 || 
                formatDate(message?.timestamp) !== formatDate(messages?.[index - 1]?.timestamp);
              
              return (
                <div key={message?.id}>
                  {showDate && (
                    <div className="text-center mb-2">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {formatDate(message?.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${message?.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${
                      message?.sender === 'You' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
                    } rounded-lg px-3 py-2`}>
                      <p className="text-sm">{message?.content}</p>
                      <p className={`text-xs mt-1 ${
                        message?.sender === 'You' ?'text-primary-foreground/70' :'text-muted-foreground'
                      }`}>
                        {formatTime(message?.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e?.target?.value)}
                onKeyPress={handleKeyPress}
                className="resize-none"
              />
            </div>
            <Button
              variant="default"
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage?.trim()}
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="xs"
              iconName="Phone"
              iconPosition="left"
            >
              Call
            </Button>
            <Button
              variant="outline"
              size="xs"
              iconName="MessageSquare"
              iconPosition="left"
            >
              SMS
            </Button>
            <Button
              variant="outline"
              size="xs"
              iconName="MessageCircle"
              iconPosition="left"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePanel;