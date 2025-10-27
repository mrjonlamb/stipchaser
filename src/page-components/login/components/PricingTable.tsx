import React from 'react';
import { Check } from 'lucide-react';

const PricingTable = () => {
  const pricingPlans = [
    {
      name: "Essentials",
      subtitle: "Stip Chaser",
      price: 199,
      period: "month",
      description: "Perfect for small dealerships getting started with document management",
      features: [
        "Document collection & tracking",
        "Basic customer communication",
        "Email notifications",
        "Standard support",
        "Up to 50 deals/month",
        "Mobile app access"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90"
    },
    {
      name: "Essentials Plus",
      subtitle: "Managed Services",
      price: 599,
      period: "month",
      description: "Comprehensive solution with dedicated support for growing dealerships",
      features: [
        "Everything in Essentials",
        "Multi-channel communication (SMS, WhatsApp)",
        "Dedicated account manager",
        "Custom document templates",
        "Up to 200 deals/month",
        "Priority support",
        "Advanced analytics",
        "Integration support"
      ],
      popular: true,
      buttonText: "Most Popular",
      buttonClass: "bg-accent text-accent-foreground hover:bg-accent/90"
    },
    {
      name: "Complete",
      subtitle: "All and Virtual F&I",
      price: 999,
      period: "month",
      description: "Full-service solution with virtual F&I capabilities for enterprise dealerships",
      features: [
        "Everything in Essentials Plus",
        "Virtual F&I menu presentation",
        "Digital contract execution",
        "Unlimited deals",
        "White-label options",
        "API access",
        "Custom integrations",
        "24/7 premium support",
        "Training & onboarding"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonClass: "bg-secondary text-secondary-foreground hover:bg-secondary/90"
    }
  ];

  return (
    <div className="bg-card rounded-lg shadow-minimal p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose Your Plan
        </h2>
        <p className="text-muted-foreground">
          Streamline your dealership operations with our comprehensive solutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans?.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-background rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
              plan?.popular 
                ? 'border-accent shadow-md scale-105' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            {plan?.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-1">
                {plan?.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {plan?.subtitle}
              </p>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">
                  ${plan?.price}
                </span>
                <span className="text-muted-foreground">/{plan?.period}</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {plan?.description}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {plan?.features?.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${plan?.buttonClass}`}
            >
              {plan?.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          All plans include a 14-day free trial. No setup fees.
        </p>
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Check className="w-4 h-4 text-accent" />
            <span>Cancel anytime</span>
          </span>
          <span className="flex items-center space-x-1">
            <Check className="w-4 h-4 text-accent" />
            <span>24/7 support</span>
          </span>
          <span className="flex items-center space-x-1">
            <Check className="w-4 h-4 text-accent" />
            <span>Secure & compliant</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;