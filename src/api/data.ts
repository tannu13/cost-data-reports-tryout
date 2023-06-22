import { TCloudResource } from "../types";
import { request } from "../utils";

export const getAllCloudInstances = () => {
  return request<TCloudResource[]>(
    "https://engineering-task.elancoapps.com/api/raw"
  );
};

export const getAllApplications = () => {
  return request<string[]>(
    "https://engineering-task.elancoapps.com/api/applications"
  );
};

export const getCloudInstancesByApplicationName = (name: string) => {
  return request<TCloudResource[]>(
    `https://engineering-task.elancoapps.com/api/applications/${encodeURIComponent(
      name
    )}`
  );
};

export const getAllResources = () => {
  return request<string[]>(
    "https://engineering-task.elancoapps.com/api/resources"
  );
};

export const getCloudInstancesByResourcesName = (name: string) => {
  return request<TCloudResource[]>(
    `https://engineering-task.elancoapps.com/api/resources/${encodeURIComponent(
      name
    )}`
  );
};
