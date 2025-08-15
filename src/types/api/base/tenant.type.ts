import type { PricingPlanEntity } from './pricing-plan.type';

export interface TenantConfigEntity {
  id: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  customerTrackingSupport: boolean;
  discountSupport: boolean;
  currencyMethod: string;
  multiWarehouseSupport: boolean;
  creditSupport: boolean;
  toastTimeoutError: number;
  toastTimeoutWarning: number;
  toastTimeoutSuccess: number;
  created_at: Date;
  updated_at: Date;
}

export interface TenantEntity {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  logoUrl_public_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  pricingPlan: PricingPlanEntity;
  tenantConfig: TenantConfigEntity | null;
}
