"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../src/components/ui/Header";
import MetricsPanel from "../../src/pages/dealer-dashboard/components/MetricsPanel";
import FilterControls from "../../src/pages/dealer-dashboard/components/FilterControls";
import DealsTable from "../../src/pages/dealer-dashboard/components/DealsTable";
import NewDealModal from "../../src/pages/dealer-dashboard/components/NewDealModal";

const DealerDashboard = () => {
  const router = useRouter();
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    urgency: "all",
    assignedStaff: "all",
  });
  const [metrics, setMetrics] = useState({
    activeDeals: 0,
    completionRate: 0,
    urgentItems: 0,
    pendingDocuments: 0,
  });
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);

  // Mock deals data
  const mockDeals = [
    {
      id: "deal-001",
      customer: {
        name: "Sarah Mitchell",
        phone: "(555) 123-4567",
        email: "sarah.mitchell@email.com",
        avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
        avatarAlt:
          "Professional headshot of woman with brown hair in white blazer smiling at camera",
      },
      vehicle: {
        year: "2024",
        make: "Toyota",
        model: "Camry",
        vin: "1HGBH41JXMN109186",
      },
      status: "pending",
      priority: "high",
      pendingDocuments: 3,
      lastActivity: new Date(Date.now() - 1800000), // 30 minutes ago
      assignedStaff: "sarah-johnson",
    },
    {
      id: "deal-002",
      customer: {
        name: "Michael Rodriguez",
        phone: "(555) 234-5678",
        email: "m.rodriguez@email.com",
        avatar: "https://images.unsplash.com/photo-1724128195747-dd25cba7860f",
        avatarAlt:
          "Professional headshot of Hispanic man with short black hair in navy suit",
      },
      vehicle: {
        year: "2023",
        make: "Honda",
        model: "Accord",
        vin: "2HGFC2F59NH123456",
      },
      status: "in-progress",
      priority: "medium",
      pendingDocuments: 1,
      lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
      assignedStaff: "mike-chen",
    },
    {
      id: "deal-003",
      customer: {
        name: "Jennifer Chen",
        phone: "(555) 345-6789",
        email: "jennifer.chen@email.com",
        avatar: "https://images.unsplash.com/photo-1668049221564-862149a48e10",
        avatarAlt:
          "Professional headshot of Asian woman with long black hair in business attire",
      },
      vehicle: {
        year: "2024",
        make: "Ford",
        model: "F-150",
        vin: "1FTFW1ET5NFC12345",
      },
      status: "completed",
      priority: "low",
      pendingDocuments: 0,
      lastActivity: new Date(Date.now() - 7200000), // 2 hours ago
      assignedStaff: "lisa-rodriguez",
    },
    {
      id: "deal-004",
      customer: {
        name: "David Thompson",
        phone: "(555) 456-7890",
        email: "d.thompson@email.com",
        avatar: "https://images.unsplash.com/photo-1714974528889-d51109fb6ae9",
        avatarAlt:
          "Professional headshot of man with beard wearing dark suit and tie",
      },
      vehicle: {
        year: "2023",
        make: "Chevrolet",
        model: "Silverado",
        vin: "1GCUYDED5NZ123456",
      },
      status: "urgent",
      priority: "high",
      pendingDocuments: 5,
      lastActivity: new Date(Date.now() - 900000), // 15 minutes ago
      assignedStaff: "david-kim",
    },
    {
      id: "deal-005",
      customer: {
        name: "Lisa Park",
        phone: "(555) 567-8901",
        email: "lisa.park@email.com",
        avatar: "https://images.unsplash.com/photo-1612275857880-57d3b7676179",
        avatarAlt:
          "Professional headshot of woman with blonde hair in gray blazer",
      },
      vehicle: {
        year: "2024",
        make: "BMW",
        model: "X5",
        vin: "5UXCR6C58N0123456",
      },
      status: "in-progress",
      priority: "medium",
      pendingDocuments: 2,
      lastActivity: new Date(Date.now() - 5400000), // 90 minutes ago
      assignedStaff: "sarah-johnson",
    },
  ];

  // Initialize data
  useEffect(() => {
    setDeals(mockDeals);
    setFilteredDeals(mockDeals);

    // Calculate metrics
    const activeDeals = mockDeals?.filter(
      (deal) => deal?.status !== "completed"
    )?.length;
    const completionRate = Math.round(
      (mockDeals?.filter((deal) => deal?.status === "completed")?.length /
        mockDeals?.length) *
        100
    );
    const urgentItems = mockDeals?.filter(
      (deal) => deal?.status === "urgent" || deal?.priority === "high"
    )?.length;
    const pendingDocuments = mockDeals?.reduce(
      (sum, deal) => sum + deal?.pendingDocuments,
      0
    );

    setMetrics({
      activeDeals,
      completionRate,
      urgentItems,
      pendingDocuments,
    });
  }, []);

  // Filter deals based on current filters
  useEffect(() => {
    let filtered = [...deals];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(
        (deal) =>
          deal?.customer?.name?.toLowerCase()?.includes(searchTerm) ||
          deal?.customer?.phone?.includes(searchTerm) ||
          deal?.vehicle?.make?.toLowerCase()?.includes(searchTerm) ||
          deal?.vehicle?.model?.toLowerCase()?.includes(searchTerm) ||
          deal?.vehicle?.vin?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters?.status !== "all") {
      filtered = filtered?.filter((deal) => deal?.status === filters?.status);
    }

    // Urgency filter
    if (filters?.urgency !== "all") {
      filtered = filtered?.filter(
        (deal) => deal?.priority === filters?.urgency
      );
    }

    // Staff filter
    if (filters?.assignedStaff !== "all") {
      filtered = filtered?.filter(
        (deal) => deal?.assignedStaff === filters?.assignedStaff
      );
    }

    setFilteredDeals(filtered);
  }, [deals, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const handleNewDeal = () => {
    setIsNewDealModalOpen(true);
  };

  const handleCreateDeal = (newDeal) => {
    setDeals((prev) => [newDeal, ...prev]);

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      activeDeals: prev?.activeDeals + 1,
      pendingDocuments: prev?.pendingDocuments + newDeal?.pendingDocuments,
    }));
  };

  const handleDealClick = (deal) => {
    router.push(
      `/conversation-interface?dealId=${deal?.id}&customer=${encodeURIComponent(
        JSON.stringify(deal?.customer)
      )}`
    );
  };

  const handleMessageClick = (deal) => {
    router.push(
      `/conversation-interface?dealId=${deal?.id}&customer=${encodeURIComponent(
        JSON.stringify(deal?.customer)
      )}`
    );
  };

  const handleDocumentRequest = (deal) => {
    router.push(
      `/document-management?dealId=${deal?.id}&customer=${encodeURIComponent(
        JSON.stringify(deal?.customer)
      )}`
    );
  };

  const handleRoleSwitch = (newRole) => {
    if (newRole === "consumer") {
      router.push("/consumer-portal");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="dealer"
        notificationCount={3}
        onRoleSwitch={handleRoleSwitch}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Dealer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage active deals and track document collection progress
          </p>
        </div>

        {/* Metrics Panel */}
        <MetricsPanel metrics={metrics} />

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onNewDeal={handleNewDeal}
        />

        {/* Deals Table */}
        <DealsTable
          deals={filteredDeals}
          onDealClick={handleDealClick}
          onMessageClick={handleMessageClick}
          onDocumentRequest={handleDocumentRequest}
        />

        {/* New Deal Modal */}
        <NewDealModal
          isOpen={isNewDealModalOpen}
          onClose={() => setIsNewDealModalOpen(false)}
          onCreateDeal={handleCreateDeal}
        />
      </main>
    </div>
  );
};

export default DealerDashboard;
