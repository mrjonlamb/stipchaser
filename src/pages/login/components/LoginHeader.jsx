import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-12">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-moderate">
            <Icon name="FileCheck" size={32} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground">StipChaser</h1>
            <p className="text-sm text-muted-foreground">Automotive Document Portal</p>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Streamline Your Deal Process
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Secure communication and document collection platform for automotive dealers and consumers
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 justify-center md:justify-start">
          <Icon name="Zap" size={16} color="var(--color-success)" />
          <span className="text-sm text-muted-foreground">Faster Approvals</span>
        </div>
        <div className="flex items-center space-x-2 justify-center">
          <Icon name="MessageSquare" size={16} color="var(--color-success)" />
          <span className="text-sm text-muted-foreground">Real-time Chat</span>
        </div>
        <div className="flex items-center space-x-2 justify-center md:justify-end">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="text-sm text-muted-foreground">Secure Platform</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;