import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const NewDealModal = ({ isOpen, onClose, onCreateDeal }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleVin: '',
    priority: 'medium',
    assignedStaff: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorityOptions = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }];


  const staffOptions = [
  { value: 'sarah-johnson', label: 'Sarah Johnson' },
  { value: 'mike-chen', label: 'Mike Chen' },
  { value: 'lisa-rodriguez', label: 'Lisa Rodriguez' },
  { value: 'david-kim', label: 'David Kim' }];


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customerName?.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData?.customerPhone?.trim()) newErrors.customerPhone = 'Phone number is required';
    if (!formData?.customerEmail?.trim()) newErrors.customerEmail = 'Email is required';
    if (!formData?.vehicleYear?.trim()) newErrors.vehicleYear = 'Vehicle year is required';
    if (!formData?.vehicleMake?.trim()) newErrors.vehicleMake = 'Vehicle make is required';
    if (!formData?.vehicleModel?.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    if (!formData?.vehicleVin?.trim()) newErrors.vehicleVin = 'VIN is required';
    if (!formData?.assignedStaff) newErrors.assignedStaff = 'Please assign a staff member';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newDeal = {
        id: `deal-${Date.now()}`,
        customer: {
          name: formData?.customerName,
          phone: formData?.customerPhone,
          email: formData?.customerEmail,
          avatar: "https://images.unsplash.com/photo-1498200705497-2c9e717e5ab8",
          avatarAlt: "Professional headshot of new customer in business attire"
        },
        vehicle: {
          year: formData?.vehicleYear,
          make: formData?.vehicleMake,
          model: formData?.vehicleModel,
          vin: formData?.vehicleVin
        },
        status: 'pending',
        priority: formData?.priority,
        pendingDocuments: 5,
        lastActivity: new Date(),
        assignedStaff: formData?.assignedStaff
      };

      onCreateDeal(newDeal);
      onClose();

      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleYear: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleVin: '',
        priority: 'medium',
        assignedStaff: ''
      });
    } catch (error) {
      console.error('Error creating deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-prominent w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Deal</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8">

            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                type="text"
                placeholder="Enter full name"
                value={formData?.customerName}
                onChange={(e) => handleInputChange('customerName', e?.target?.value)}
                error={errors?.customerName}
                required />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData?.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e?.target?.value)}
                error={errors?.customerPhone}
                required />

            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="customer@example.com"
              value={formData?.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e?.target?.value)}
              error={errors?.customerEmail}
              required />

          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Year"
                type="number"
                placeholder="2024"
                value={formData?.vehicleYear}
                onChange={(e) => handleInputChange('vehicleYear', e?.target?.value)}
                error={errors?.vehicleYear}
                required />

              <Input
                label="Make"
                type="text"
                placeholder="Toyota"
                value={formData?.vehicleMake}
                onChange={(e) => handleInputChange('vehicleMake', e?.target?.value)}
                error={errors?.vehicleMake}
                required />

              <Input
                label="Model"
                type="text"
                placeholder="Camry"
                value={formData?.vehicleModel}
                onChange={(e) => handleInputChange('vehicleModel', e?.target?.value)}
                error={errors?.vehicleModel}
                required />

            </div>
            <Input
              label="VIN"
              type="text"
              placeholder="1HGBH41JXMN109186"
              value={formData?.vehicleVin}
              onChange={(e) => handleInputChange('vehicleVin', e?.target?.value)}
              error={errors?.vehicleVin}
              required />

          </div>

          {/* Deal Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Deal Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Priority Level"
                options={priorityOptions}
                value={formData?.priority}
                onChange={(value) => handleInputChange('priority', value)}
                required />

              <Select
                label="Assigned Staff"
                options={staffOptions}
                value={formData?.assignedStaff}
                onChange={(value) => handleInputChange('assignedStaff', value)}
                error={errors?.assignedStaff}
                placeholder="Select staff member"
                required />

            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}>

              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left">

              Create Deal
            </Button>
          </div>
        </form>
      </div>
    </div>);

};

export default NewDealModal;