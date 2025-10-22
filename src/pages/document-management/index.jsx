import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import DocumentCategory from './components/DocumentCategory';
import DocumentPreview from './components/DocumentPreview';
import UploadZone from './components/UploadZone';
import FilterControls from './components/FilterControls';
import BulkActions from './components/BulkActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

const DocumentManagement = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showUploadZone, setShowUploadZone] = useState(false);

  // Mock data for document categories
  const documentCategories = [
  {
    id: 'pay-stubs',
    name: 'Pay Stubs',
    icon: 'Receipt',
    requiredCount: 3,
    uploadedCount: 2,
    status: 'pending',
    documents: [
    {
      id: 'ps1',
      name: 'Pay_Stub_October_2024.pdf',
      type: 'pdf',
      size: '245 KB',
      uploadDate: 'Oct 15, 2024',
      status: 'approved',
      category: 'Pay Stubs',
      url: "https://images.unsplash.com/photo-1715318503679-a0cbfc159f6f",
      alt: 'PDF document showing October 2024 pay stub with salary details and deductions',
      thumbnail: "https://images.unsplash.com/photo-1711700696810-c9e11068c264",
      thumbnailAlt: 'Thumbnail of pay stub document with financial data'
    },
    {
      id: 'ps2',
      name: 'Pay_Stub_September_2024.pdf',
      type: 'pdf',
      size: '238 KB',
      uploadDate: 'Oct 14, 2024',
      status: 'pending',
      category: 'Pay Stubs',
      url: "https://images.unsplash.com/photo-1715318503679-a0cbfc159f6f",
      alt: 'PDF document showing September 2024 pay stub with employment verification',
      thumbnail: "https://images.unsplash.com/photo-1505830623932-d9d4d8089283",
      thumbnailAlt: 'Thumbnail of September pay stub document'
    }]

  },
  {
    id: 'bank-statements',
    name: 'Bank Statements',
    icon: 'CreditCard',
    requiredCount: 2,
    uploadedCount: 1,
    status: 'pending',
    documents: [
    {
      id: 'bs1',
      name: 'Bank_Statement_October_2024.pdf',
      type: 'pdf',
      size: '512 KB',
      uploadDate: 'Oct 16, 2024',
      status: 'pending',
      category: 'Bank Statements',
      url: "https://images.unsplash.com/photo-1727696647453-8fc8bf620432",
      alt: 'Bank statement document showing October 2024 account transactions and balance',
      thumbnail: "https://images.unsplash.com/photo-1647365363162-54f983245cf1",
      thumbnailAlt: 'Thumbnail of bank statement with financial transaction data'
    }]

  },
  {
    id: 'electric-bills',
    name: 'Electric Bills',
    icon: 'Zap',
    requiredCount: 1,
    uploadedCount: 1,
    status: 'approved',
    documents: [
    {
      id: 'eb1',
      name: 'Electric_Bill_October_2024.jpg',
      type: 'image',
      size: '1.2 MB',
      uploadDate: 'Oct 15, 2024',
      status: 'approved',
      category: 'Electric Bills',
      url: "https://images.unsplash.com/photo-1727696647453-8fc8bf620432",
      alt: 'Electric utility bill for October 2024 showing residential address and payment details',
      thumbnail: "https://images.unsplash.com/photo-1664277072557-cfc1f7108f56",
      thumbnailAlt: 'Thumbnail of electric bill document with utility company logo'
    }]

  },
  {
    id: 'identification',
    name: 'Identification',
    icon: 'IdCard',
    requiredCount: 2,
    uploadedCount: 0,
    status: 'missing',
    documents: []
  }];


  // Get all documents for filtering and bulk operations
  const allDocuments = documentCategories?.flatMap((category) =>
  category?.documents?.map((doc) => ({ ...doc, categoryId: category?.id }))
  );

  // Filter documents based on current filters
  const filteredDocuments = allDocuments?.filter((doc) => {
    const matchesSearch = !searchTerm ||
    doc?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    doc?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase());

    const matchesStatus = statusFilter === 'all' || doc?.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || doc?.categoryId === categoryFilter;

    // Simple date filtering (in real app, would use proper date comparison)
    const matchesDate = dateFilter === 'all' ||
    dateFilter === 'today' && doc?.uploadDate?.includes('Oct 16') ||
    dateFilter === 'week' && doc?.uploadDate?.includes('Oct') ||
    dateFilter === 'month' && doc?.uploadDate?.includes('Oct');

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  // Filter categories based on current filters
  const filteredCategories = documentCategories?.map((category) => ({
    ...category,
    documents: category?.documents?.filter((doc) => {
      const docWithCategory = { ...doc, categoryId: category?.id };
      return filteredDocuments?.some((filteredDoc) => filteredDoc?.id === docWithCategory?.id);
    })
  }))?.filter((category) =>
  categoryFilter === 'all' || category?.id === categoryFilter
  );

  const handleUpload = (categoryId) => {
    setShowUploadZone(true);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
  };

  const handleApprove = (documentId) => {
    console.log('Approving document:', documentId);
    // In real app, would update document status via API
  };

  const handleReject = (documentId, reason) => {
    console.log('Rejecting document:', documentId, 'Reason:', reason);
    // In real app, would update document status via API
  };

  const handleShare = (documentId) => {
    console.log('Sharing document:', documentId);
    // In real app, would implement sharing functionality
  };

  const handleFileUpload = (file) => {
    console.log('File uploaded:', file?.name);
    // In real app, would upload file to server
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
  };

  const handleSelectDocument = (documentId, isSelected) => {
    if (isSelected) {
      setSelectedDocuments((prev) => [...prev, documentId]);
    } else {
      setSelectedDocuments((prev) => prev?.filter((id) => id !== documentId));
    }
  };

  const handleSelectAll = () => {
    setSelectedDocuments(filteredDocuments?.map((doc) => doc?.id));
  };

  const handleDeselectAll = () => {
    setSelectedDocuments([]);
  };

  const handleBulkApprove = (documentIds) => {
    console.log('Bulk approving documents:', documentIds);
    setSelectedDocuments([]);
  };

  const handleBulkReject = (documentIds, reason) => {
    console.log('Bulk rejecting documents:', documentIds, 'Reason:', reason);
    setSelectedDocuments([]);
  };

  const handleBulkDownload = (documentIds) => {
    console.log('Bulk downloading documents:', documentIds);
  };

  const handleBulkShare = (documentIds) => {
    console.log('Bulk sharing documents:', documentIds);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="dealer"
        notificationCount={3}
        onRoleSwitch={() => {}} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Document Management</h1>
            <p className="text-muted-foreground">
              Manage and review stipulation documents for deal processing
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowUploadZone(!showUploadZone)}
              iconName="Upload"
              iconPosition="left">

              {showUploadZone ? 'Hide Upload' : 'Upload Documents'}
            </Button>
            <Button
              variant="default"
              iconName="MessageSquare"
              iconPosition="left"
              onClick={() => window.location.href = '/conversation-interface'}>

              Message Customer
            </Button>
          </div>
        </div>

        {/* Upload Zone */}
        {showUploadZone &&
        <div className="mb-8">
            <UploadZone onFileUpload={handleFileUpload} />
          </div>
        }

        {/* Filter Controls */}
        <div className="mb-6">
          <FilterControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            onClearFilters={handleClearFilters} />

        </div>

        {/* Bulk Actions */}
        {selectedDocuments?.length > 0 &&
        <div className="mb-6">
            <BulkActions
            selectedDocuments={selectedDocuments}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkDownload={handleBulkDownload}
            onBulkShare={handleBulkShare}
            totalDocuments={filteredDocuments?.length} />

          </div>
        }

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Document Categories */}
          <div className="xl:col-span-2 space-y-6">
            {filteredCategories?.length > 0 ?
            filteredCategories?.map((category) =>
            <div key={category?.id} className="relative">
                  {/* Category Selection Checkbox */}
                  {category?.documents?.length > 0 &&
              <div className="absolute top-4 right-4 z-10">
                      <Checkbox
                  checked={category?.documents?.every((doc) => selectedDocuments?.includes(doc?.id))}
                  indeterminate={
                  category?.documents?.some((doc) => selectedDocuments?.includes(doc?.id)) &&
                  !category?.documents?.every((doc) => selectedDocuments?.includes(doc?.id))
                  }
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      const categoryDocIds = category?.documents?.map((doc) => doc?.id);
                      setSelectedDocuments((prev) => [...new Set([...prev, ...categoryDocIds])]);
                    } else {
                      const categoryDocIds = category?.documents?.map((doc) => doc?.id);
                      setSelectedDocuments((prev) => prev?.filter((id) => !categoryDocIds?.includes(id)));
                    }
                  }} />

                    </div>
              }
                  
                  <DocumentCategory
                category={category}
                onUpload={handleUpload}
                onViewDocument={handleViewDocument}
                onApprove={handleApprove}
                onReject={handleReject} />

                </div>
            ) :

            <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Documents Found</h3>
                <p className="text-muted-foreground mb-4">
                  No documents match your current filters. Try adjusting your search criteria.
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            }
          </div>

          {/* Document Preview */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <DocumentPreview
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
                onApprove={handleApprove}
                onReject={handleReject}
                onShare={handleShare} />

            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="CheckCircle" size={24} color="var(--color-success)" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {allDocuments?.filter((doc) => doc?.status === 'approved')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Approved Documents</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Clock" size={24} color="var(--color-warning)" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {allDocuments?.filter((doc) => doc?.status === 'pending')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="XCircle" size={24} color="var(--color-error)" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {allDocuments?.filter((doc) => doc?.status === 'rejected')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Rejected Documents</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="FileText" size={24} color="var(--color-primary)" />
            </div>
            <p className="text-2xl font-bold text-foreground">{allDocuments?.length}</p>
            <p className="text-sm text-muted-foreground">Total Documents</p>
          </div>
        </div>
      </div>
    </div>);

};

export default DocumentManagement;