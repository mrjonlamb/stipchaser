import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    dealer: { email: 'dealer@stipchaser.com', password: 'dealer123' },
    staff: { email: 'staff@stipchaser.com', password: 'staff123' },
    consumer: { email: 'consumer@stipchaser.com', password: 'consumer123' }
  };

  const roleOptions = [
    { value: 'dealer', label: 'Dealer Manager' },
    { value: 'staff', label: 'Dealer Staff' },
    { value: 'consumer', label: 'Consumer' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const expectedCredentials = mockCredentials?.[formData?.role];
      
      if (formData?.email === expectedCredentials?.email && formData?.password === expectedCredentials?.password) {
        // Successful login - navigate based on role
        if (formData?.role === 'consumer') {
          navigate('/consumer-portal');
        } else {
          navigate('/dealer-dashboard');
        }
      } else {
        setErrors({
          general: `Invalid credentials. Use ${expectedCredentials?.email} / ${expectedCredentials?.password} for ${formData?.role} access.`
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-moderate p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileCheck" size={24} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your StipChaser account</p>
        </div>

        {errors?.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" className="mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Role"
            placeholder="Select your role"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value)}
            error={errors?.role}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              checked={formData?.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
            />
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            New to StipChaser?{' '}
            <button className="text-primary hover:text-primary/80 font-medium transition-colors">
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;