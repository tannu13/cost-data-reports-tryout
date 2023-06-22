import { useState } from "react";
import "./App.css";
import { getAllApplications, getAllResources } from "./api/data";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SelectField from "./components/SelectField";
import useDataFetcher from "./hooks/useDataFetcher";
import { TSelectFieldItems } from "./types";

const EXTRA_FILTER_POSSIBLE_VALUES = {
  App: "App",
  Res: "Res",
} as const;

function CloudInstancesReport() {
  type TSelectFieldItemsWithRestrictedExtra = TSelectFieldItems & {
    extra?: keyof typeof EXTRA_FILTER_POSSIBLE_VALUES;
  };
  const [selectedFilter, setSelectedFilter] =
    useState<TSelectFieldItemsWithRestrictedExtra | null>(null);

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

  const filterItems: TSelectFieldItemsWithRestrictedExtra[] = [];
  if (!applicationsAreLoading && !resourcesAreLoading) {
    if (applications.length > 0) {
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
    if (resources.length > 0) {
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

  function handleFilterChange(
    item: TSelectFieldItemsWithRestrictedExtra | null
  ): void {
    if (!item) {
      setSelectedFilter(null);
      return;
    }

    const itemWithExtra = item as TSelectFieldItemsWithRestrictedExtra;
    if (itemWithExtra.extra) {
      setSelectedFilter(itemWithExtra);
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
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Column 1</th>
              <th className="px-4 py-2">Column 2</th>
              <th className="px-4 py-2">Column 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Data 1</td>
              <td className="border px-4 py-2">Data 2</td>
              <td className="border px-4 py-2">Data 3</td>
            </tr>
          </tbody>
        </table>
      </main>

      <Footer />
    </div>
  );
}

export default CloudInstancesReport;
