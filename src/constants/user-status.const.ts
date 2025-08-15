// constants/userStatus.ts
export const USER_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'invited', label: 'Invited' }
] as const;

// Runtime array for comparisons:
export const USER_STATUS_VALUES = USER_STATUSES.map((s) => s.value);

// Type-safe union for variables and comparisons:
export type UserStatusValue = (typeof USER_STATUS_VALUES)[number];
