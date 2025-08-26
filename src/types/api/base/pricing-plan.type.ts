/**
 * @interface PricingPlanEntity
 * @description Represents the structure of a subscription pricingPlanEntity.
 */
export interface PricingPlanEntity {
  /**
   * @property {string} id - Unique identifier for the pricingPlanEntity, typically a UUID.
   */
  id: string;
  /**
   * @property {string} name - The name of the pricingPlanEntity (e.g., 'Free', 'Pro', 'Enterprise'). Must be unique.
   */
  name: string;
  /**
   * @property {string} [description] - A brief description of the pricingPlanEntity. This field is optional.
   */
  description?: string; // nullable in entity
  /**
   * @property {number} price - The monthly price of the pricingPlanEntity in USD. Defaults to 0.
   */
  price: number;
  /**
   * @property {number} maxUsers - The maximum number of users allowed under this pricingPlanEntity. Defaults to 1.
   */
  maxUsers: number;
  /**
   * @property {number} maxProducts - The maximum number of products that can be managed under this pricingPlanEntity. Defaults to 100.
   */
  maxProducts: number;
  /**
   * @property {string[]} features - An array of strings listing the features included in the pricingPlanEntity (e.g., ['multi-warehouse', 'api-access']). Defaults to an empty array.
   */
  features: string[];
  /**
   * @property {boolean} isPopular - Indicates whether this pricingPlanEntity is marked as popular. Defaults to true.
   */
  isPopular: boolean;
  /**
   * @property {boolean} customerTrackingSupport - Enables or disables customer tracking features for this pricingPlanEntity. Defaults to true.
   */
  customerTrackingSupport: boolean;
  /**
   * @property {boolean} discountSupport - Enables or disables discount application features for this pricingPlanEntity. Defaults to true.
   */
  discountSupport: boolean;
  /**
   * @property {number} maxWireHouse - total wirehousse that can control.
   */
  maxWireHouse: number;
  /**
   * @property {boolean} creditSupport - Enables or disables credit management features for this pricingPlanEntity. Defaults to false.
   */
  creditSupport: boolean;
  /**
   * @property {Date} createdAt - The timestamp when the pricingPlanEntity was created.
   */
  createdAt: Date;
  /**
   * @property {Date} updatedAt - The timestamp when the pricingPlanEntity was last updated.
   */
  updatedAt: Date;
  // tenants: Tenant[]; // Exclude TypeORM relations from the basic interface if not explicitly needed for data transfer
}
