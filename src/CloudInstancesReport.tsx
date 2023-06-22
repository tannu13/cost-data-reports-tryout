import { useEffect, useState } from "react";
import "./App.css";
import {
  getAllApplications,
  getAllCloudInstances,
  getAllResources,
  getCloudInstancesByResourceName,
} from "./api/data";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SelectField from "./components/SelectField";
import useDataFetcher from "./hooks/useDataFetcher";
import { TCloudResource, TSelectFieldItems } from "./types";
import { getCloudInstancesByApplicationName } from "./api/data";

const EXTRA_FILTER_POSSIBLE_VALUES = {
  App: "App",
  Res: "Res",
} as const;
const PAGE_SIZES = [5, 10, 25, 50, 100];

function CloudInstancesReport() {
  type TSelectFieldItemsWithRestrictedExtra = TSelectFieldItems & {
    extra?: keyof typeof EXTRA_FILTER_POSSIBLE_VALUES;
  };
  const [selectedFilter, setSelectedFilter] =
    useState<TSelectFieldItemsWithRestrictedExtra | null>(null);

  const [pageSize, setPageSize] = useState(5);

  const [applications, applicationsAreLoading] = useDataFetcher<string[]>({
    queryKey: "applications",
    queryFn: getAllApplications,
    returnPaginated: false,
  });

  const [resources, resourcesAreLoading] = useDataFetcher<string[]>({
    queryKey: "resources",
    queryFn: getAllResources,
    returnPaginated: false,
  });

  // All page data
  const [
    allCloudInstances,
    instancesAreLoading,
    next,
    prev,
    goto,
    refetchInstances,
    paginationString,
  ] = useDataFetcher<TCloudResource[]>({
    queryKey: "all-cloud-instances",
    queryFn: () => {
      if (selectedFilter?.extra === EXTRA_FILTER_POSSIBLE_VALUES.App) {
        return getCloudInstancesByApplicationName(selectedFilter.name);
      } else if (selectedFilter?.extra === EXTRA_FILTER_POSSIBLE_VALUES.Res) {
        return getCloudInstancesByResourceName(selectedFilter.name);
      }
      return getAllCloudInstances();
    },
    returnPaginated: true,
    enabled: false,
    pageSize,
  });
  useEffect(() => {
    refetchInstances();
  }, [selectedFilter]);

  function handleFilterChange(
    item: TSelectFieldItemsWithRestrictedExtra | null
  ): void {
    goto(0);
    if (!item) {
      setSelectedFilter(null);
      return;
    }

    if (item.id) {
      setSelectedFilter(item);
    }
  }

  // merge applications and resources into one array of items
  const filterItems: TSelectFieldItemsWithRestrictedExtra[] = [];
  if (!applicationsAreLoading && !resourcesAreLoading) {
    if (applications && applications.length > 0) {
      // add a disabled Applications heading sorta to the list
      filterItems.push({
        id: "applications",
        name: "Applications",
        disabled: true,
      });
      filterItems.push(
        ...applications.map((application) => ({
          id: application,
          name: application,
          extra: EXTRA_FILTER_POSSIBLE_VALUES.App,
        }))
      );
    }
    if (resources && resources.length > 0) {
      // add a disabled Resources heading sorta to the list
      filterItems.push({
        id: "resources",
        name: "Resources",
        disabled: true,
      });
      filterItems.push(
        ...resources.map((resource) => ({
          id: resource,
          name: resource,
          extra: EXTRA_FILTER_POSSIBLE_VALUES.Res,
        }))
      );
    }
  }

  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-screen">
      <Header />
      <main className="px-6 py-4">
        {/* Search Controls */}
        <div className="flex gap-4 mb-4">
          <div className="basis-1/4">
            <SelectField
              label="Filter by Applications / Resources"
              placeholder="Type something..."
              items={filterItems}
              value={selectedFilter}
              onChange={(item) =>
                handleFilterChange(item as TSelectFieldItemsWithRestrictedExtra)
              }
            />
          </div>
          <div className="basis-1/4 flex items-end">
            <button
              className="border bg-white hover:bg-slate-100 active:ring active:ring-ig-base-primary rounded w-full h-[42px]"
              onClick={() => handleFilterChange(null)}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Data */}
        <table className="border-collapse table-fixed w-full text-sm bg-white">
          <thead>
            <tr>
              <th className="border-b font-medium p-6 pl-4 pb-3 text-slate-800 text-left w-3/12">
                Service Name
              </th>
              <th className="border-b font-medium p-6 pl-4 pb-3 text-slate-800 text-left w-2/12">
                Location
              </th>
              <th className="border-b font-medium p-6 pl-4 pb-3 text-slate-800 text-left w-3/12">
                Resource Group
              </th>
              <th className="border-b font-medium p-6 pl-4 pb-3 text-slate-800 text-left w-1/12">
                Date
              </th>
              <th className="border-b font-medium p-6 pl-4 pb-3 text-slate-800 text-left w-1/12">
                Cost
              </th>
              <th className="border-b font-medium p-6 pl-4 pb-3 text-slate-800 text-left w-2/12">
                Unit Of Measure
              </th>
            </tr>
          </thead>
          {instancesAreLoading ? (
            <tbody>
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {allCloudInstances && allCloudInstances.length > 0 ? (
                allCloudInstances.map((instance, i) => {
                  return (
                    <tr className="h-20" key={`${instance.InstanceId}_${i}`}>
                      <td className="border-b border-slate-100 p-4 text-slate-500">
                        {instance.ServiceName}
                      </td>
                      <td className="border-b border-slate-100 p-4 text-slate-500">
                        {instance.Location}
                      </td>
                      <td className="border-b border-slate-100 p-4 text-slate-500">
                        {instance.ResourceGroup}
                      </td>
                      <td className="border-b border-slate-100 p-4 text-slate-500">
                        {instance.Date}
                      </td>
                      <td className="border-b border-slate-100 p-4 text-slate-500">
                        $ {Math.round(instance.Cost * 100) / 100}
                      </td>
                      <td className="border-b border-slate-100 p-4 text-slate-500">
                        {instance.UnitOfMeasure}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>No data found</td>
                </tr>
              )}
            </tbody>
          )}
        </table>
        <div className="flex bg-white p-6 justify-between">
          <div className="basis-1/6">
            <SelectField
              label="Page Size"
              placeholder="Select..."
              items={PAGE_SIZES.map((size) => ({
                id: size.toString(),
                name: size.toString(),
              }))}
              value={{ id: pageSize.toString(), name: pageSize.toString() }}
              onChange={(item) => setPageSize(Number(item?.id))}
            />
          </div>
          <div className="basis-2/6 flex gap-2 items-center justify-end">
            <div className="basis-3/12 ">{paginationString}</div>
            <button
              className="basis-4/12 border bg-ig-base-primary text-white hover:bg-ig-base-primary/75 active:ring active:ring-ig-base-primary rounded w-full h-[42px]"
              onClick={next}
            >
              Next
            </button>
            <button
              className="basis-4/12 border bg-ig-base-primary text-white hover:bg-ig-base-primary/75 active:ring active:ring-ig-base-primary rounded w-full h-[42px]"
              onClick={prev}
            >
              Prev
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CloudInstancesReport;
