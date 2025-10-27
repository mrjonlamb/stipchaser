import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Bank-grade security'
    },
    {
      icon: 'Lock',
      title: 'NADA Certified',
      description: 'Automotive industry standard'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Compliant',
      description: 'Enterprise security'
    }
  ];

  const industryLogos = [
    {
      name: 'NADA',
      description: 'National Automobile Dealers Association certified platform'
    },
    {
      name: 'AIADA',
      description: 'American International Automobile Dealers Association approved'
    },
    {
      name: 'NIADA',
      description: 'National Independent Automobile Dealers Association member'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="bg-card rounded-lg shadow-minimal p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Trusted by Dealers Nationwide
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={20} color="var(--color-success)" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{feature?.title}</h4>
                <p className="text-sm text-muted-foreground">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Industry Certifications */}
      <div className="bg-card rounded-lg shadow-minimal p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-wide">
          Industry Certifications
        </h3>
        
        <div className="space-y-3">
          {industryLogos?.map((cert, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 p-3 bg-muted/50 rounded-md">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{cert?.name}</span>
              </div>
              <span className="text-xs text-muted-foreground text-center">{cert?.description}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Contact Support */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Need help signing in?</p>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default TrustSignals;