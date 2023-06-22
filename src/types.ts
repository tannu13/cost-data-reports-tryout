type TCloudCostResource = {
  "app-name": string;
  environment: string;
  "business-unit": string;
};

export type TCloudResource = {
  consumedQuantity: string;
  cost: string;
  date: string;
  instanceId: string;
  meterCategory: string;
  resourceGroup: string;
  resourcelocation: string;
  tags: TCloudCostResource;
  unitOfMeasure: string;
  location: string;
  serviceName: string;
};

export type TSelectFieldItems = {
  id: string;
  name: string;
  disabled?: boolean;
  extra?: unknown;
};
