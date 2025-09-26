import withAnimation from '@/components/base/route-animation/with-animation';
import { useActiveManager } from '@/hooks/base/use-active-manager';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PharmacyMapView } from './pharmacy/pharmacy-map-view';

// 1. Define the unique keys for your tabs
const DASHBOARD_TABS = ['overview', 'analytics', 'notifications'] as const;
type DashboardTab = (typeof DASHBOARD_TABS)[number];

export const DashboardPage = () => {
  // 2. Initialize the hook to manage the active tab state
  const { activeKey, actions } = useActiveManager<DashboardTab>(
    DASHBOARD_TABS,
    'overview' // Default active tab
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* This button lives OUTSIDE the Tabs component */}
        <Button variant="outline" onClick={() => actions.set('notifications')}>
          View Notifications
        </Button>
      </div>

      {/* 3. Control the Tabs component */}
      <Tabs
        value={activeKey ?? ''} // Pass the activeKey from our hook
        onValueChange={(value) => actions.set(value as DashboardTab)} // Update our hook's state
        className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p>Welcome to your Overview.</p>
        </TabsContent>
        <TabsContent value="analytics">
          <p>Here are your detailed analytics.</p>
        </TabsContent>
        <TabsContent value="notifications">
          <p>You have 3 new notifications.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const TestPage = withAnimation(() => {
  return (
    <div>
      {/* <PharmacyPortal />;
      <DashboardPage /> */}
      <PharmacyMapView />
    </div>
  );
});
