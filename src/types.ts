type TCloudCostResource = {
  "app-name": string;
  environment: string;
  "business-unit": string;
};

export type TCloudResource = {
  ConsumedQuantity: string;
  Cost: number;
  Date: string;
  InstanceId: string;
  MeterCategory: string;
  ResourceGroup: string;
  Resourcelocation: string;
  Tags: TCloudCostResource;
  UnitOfMeasure: string;
  Location: string;
  ServiceName: string;
};

export type TSelectFieldItems = {
  id: string;
  name: string;
  disabled?: boolean;
  extra?: unknown;
};
