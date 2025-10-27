import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ConversationSidebar = ({ 
  selectedConversation, 
  conversations, 
  onConversationSelect,
  onNewConversation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState('all');

  const filteredConversations = conversations?.filter(conv => {
    const matchesSearch = conv?.customerName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         conv?.dealNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesChannel = filterChannel === 'all' || conv?.lastMessage?.channel === filterChannel;
    return matchesSearch && matchesChannel;
  });

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

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return messageTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageTime?.toLocaleDateString();
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            onClick={onNewConversation}
          >
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Channel Filter */}
        <div className="flex space-x-1">
          {[
            { value: 'all', label: 'All', icon: 'MessageSquare' },
            { value: 'chat', label: 'Chat', icon: 'MessageSquare' },
            { value: 'sms', label: 'SMS', icon: 'Smartphone' },
            { value: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' }
          ]?.map((filter) => (
            <button
              key={filter?.value}
              onClick={() => setFilterChannel(filter?.value)}
              className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md transition-colors ${
                filterChannel === filter?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={filter?.icon} size={12} />
              <span>{filter?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations?.map((conversation) => (
              <button
                key={conversation?.id}
                onClick={() => onConversationSelect(conversation)}
                className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-muted ${
                  selectedConversation?.id === conversation?.id
                    ? 'bg-primary/10 border border-primary/20' :'bg-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <Image
                      src={conversation?.customerAvatar}
                      alt={conversation?.customerAvatarAlt}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {conversation?.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {conversation?.customerName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(conversation?.lastMessage?.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        Deal #{conversation?.dealNumber}
                      </span>
                      <Icon 
                        name={getChannelIcon(conversation?.lastMessage?.channel)} 
                        size={12} 
                        className={getChannelColor(conversation?.lastMessage?.channel)}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground truncate">
                      {conversation?.lastMessage?.content}
                    </p>

                    {/* Status Indicators */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {conversation?.hasUnread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        {conversation?.pendingDocuments > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-warning">
                            <Icon name="FileText" size={10} />
                            <span>{conversation?.pendingDocuments}</span>
                          </div>
                        )}
                      </div>
                      
                      {conversation?.priority === 'high' && (
                        <Icon name="AlertCircle" size={12} className="text-error" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;