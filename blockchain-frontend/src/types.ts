export type Property = {
  owner: string;
  pricePerDay: bigint;
  isAvailable: boolean;
};

export type Rental = {
  owner: string;
  tenant: string;
  propertyId: bigint;
  startDate: bigint;
  duration: bigint;
  totalPrice: bigint;
  isActive: boolean;
  isWaitingConfirmation: boolean;
};
