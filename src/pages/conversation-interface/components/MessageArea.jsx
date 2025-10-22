import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MessageArea = ({ 
  conversation, 
  messages, 
  onSendMessage, 
  onFileUpload,
  isTyping 
}) => {
  const [messageText, setMessageText] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('chat');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageText?.trim()) {
      onSendMessage({
        content: messageText,
        channel: selectedChannel,
        timestamp: new Date()
      });
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      onFileUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    if (files?.length > 0) {
      onFileUpload(files);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'whatsapp': return 'MessageCircle';
      case 'sms': return 'Smartphone';
      case 'chat': return 'MessageSquare';
      default: return 'MessageSquare';
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'whatsapp': return 'text-green-600';
      case 'sms': return 'text-blue-600';
      case 'chat': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message) => {
    const isOwn = message?.sender === 'You';
    
    return (
      <div
        key={message?.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
          {!isOwn && (
            <Image
              src={message?.avatar}
              alt={message?.avatarAlt}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          
          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwn
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {message?.attachment && (
                <div className="mb-2">
                  {message?.attachment?.type === 'image' ? (
                    <Image
                      src={message?.attachment?.url}
                      alt={message?.attachment?.alt}
                      className="max-w-48 rounded-lg"
                    />
                  ) : message?.attachment?.type === 'document' ? (
                    <div className="flex items-center space-x-2 p-2 bg-background/20 rounded-lg">
                      <Icon name="FileText" size={16} />
                      <span className="text-sm">{message?.attachment?.name}</span>
                      <Button variant="ghost" size="xs">
                        <Icon name="Download" size={12} />
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
              
              <p className="text-sm whitespace-pre-wrap">{message?.content}</p>
            </div>
            
            <div className={`flex items-center space-x-2 mt-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span className="text-xs text-muted-foreground">
                {formatMessageTime(message?.timestamp)}
              </span>
              <Icon 
                name={getChannelIcon(message?.channel)} 
                size={12} 
                className={getChannelColor(message?.channel)}
              />
              {isOwn && message?.status && (
                <Icon 
                  name={message?.status === 'delivered' ? 'Check' : message?.status === 'read' ? 'CheckCheck' : 'Clock'} 
                  size={12} 
                  className="text-muted-foreground"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="MessageSquare" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src={conversation?.customerAvatar}
              alt={conversation?.customerAvatarAlt}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-foreground">{conversation?.customerName}</h3>
              <p className="text-sm text-muted-foreground">Deal #{conversation?.dealNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Phone">
              Call
            </Button>
            <Button variant="ghost" size="sm" iconName="Video">
              Video
            </Button>
            <Button variant="ghost" size="sm" iconName="MoreVertical">
            </Button>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div 
        className={`flex-1 overflow-y-auto p-4 ${dragOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {messages?.map(renderMessage)}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-2">
              <Image
                src={conversation?.customerAvatar}
                alt={conversation?.customerAvatarAlt}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="bg-muted px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        {/* Channel Selector */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-muted-foreground">Send via:</span>
          {[
            { value: 'chat', label: 'Chat', icon: 'MessageSquare' },
            { value: 'sms', label: 'SMS', icon: 'Smartphone' },
            { value: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' }
          ]?.map((channel) => (
            <button
              key={channel?.value}
              onClick={() => setSelectedChannel(channel?.value)}
              className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
                selectedChannel === channel?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={channel?.icon} size={14} />
              <span>{channel?.label}</span>
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e?.target?.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 pr-20 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="Smile" size={16} />
              </button>
              
              <button
                onClick={() => fileInputRef?.current?.click()}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="Paperclip" size={16} />
              </button>
            </div>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!messageText?.trim()}
            iconName="Send"
            className="shrink-0"
          >
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  );
};

export default MessageArea;