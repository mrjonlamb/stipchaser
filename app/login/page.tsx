"use client";

import React from "react";
import LoginHeader from "../../src/page-components/login/components/LoginHeader";
import LoginForm from "../../src/page-components/login/components/LoginForm";
import TrustSignals from "../../src/page-components/login/components/TrustSignals";
import PricingTable from "../../src/page-components/login/components/PricingTable";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <LoginHeader />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Trust Signals (Hidden on mobile) */}
          <div className="hidden lg:block">
            <TrustSignals />
          </div>

          {/* Center Column - Login Form */}
          <div className="lg:col-span-1">
            <LoginForm />
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Mobile Trust Signals */}
            <div className="lg:hidden">
              <TrustSignals />
            </div>

            {/* Feature Highlights */}
            <div className="bg-card rounded-lg shadow-minimal p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Why Choose StipChaser?
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      Faster Deal Closures
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Reduce document collection time from days to hours with
                      streamlined communication
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      Multi-Channel Support
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Connect via web chat, SMS, or WhatsApp - whatever works
                      best for your customers
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      Bank-Grade Security
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      End-to-end encryption ensures customer documents remain
                      secure and compliant
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                Trusted by Industry Leaders
              </h3>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Dealers
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">
                    Documents Processed
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-sm text-muted-foreground">
                    Faster Approvals
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-16 max-w-7xl mx-auto">
          <PricingTable />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date()?.getFullYear()} StipChaser. All rights
              reserved.
            </p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <button className="hover:text-foreground transition-colors">
                Privacy Policy
              </button>
              <span>•</span>
              <button className="hover:text-foreground transition-colors">
                Terms of Service
              </button>
              <span>•</span>
              <button className="hover:text-foreground transition-colors">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
