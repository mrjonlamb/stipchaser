import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'dealer', notificationCount = 0, onRoleSwitch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const dealerNavItems = [
    { label: 'Dashboard', path: '/dealer-dashboard', icon: 'LayoutDashboard' },
    { label: 'Messages', path: '/conversation-interface', icon: 'MessageSquare', badge: notificationCount },
    { label: 'Documents', path: '/document-management', icon: 'FileText' },
  ];

  const consumerNavItems = [
    { label: 'Submit Documents', path: '/consumer-portal', icon: 'Upload' },
    { label: 'Messages', path: '/conversation-interface', icon: 'MessageSquare', badge: notificationCount },
  ];

  const navigationItems = userRole === 'consumer' ? consumerNavItems : dealerNavItems;

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-minimal">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileCheck" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">StipChaser</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 ml-12">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActivePath(item?.path)
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
              {item?.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item?.badge > 99 ? '99+' : item?.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Role Context Switcher (Dealer Only) */}
          {userRole === 'dealer' && onRoleSwitch && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-muted rounded-md">
              <Icon name="Users" size={14} />
              <span className="text-sm text-muted-foreground">Dealer View</span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onRoleSwitch('consumer')}
                className="text-xs"
              >
                Switch to Consumer
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-down">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item?.path)
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
                {item?.badge > 0 && (
                  <span className="ml-auto bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item?.badge > 99 ? '99+' : item?.badge}
                  </span>
                )}
              </button>
            ))}
            
            {/* Mobile Role Switcher */}
            {userRole === 'dealer' && onRoleSwitch && (
              <div className="pt-4 mt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onRoleSwitch('consumer');
                    setIsMobileMenuOpen(false);
                  }}
                  iconName="Users"
                  iconPosition="left"
                  className="w-full"
                >
                  Switch to Consumer View
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;