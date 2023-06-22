import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function useDataFetcher<TResponse>({
  queryKey,
  queryFn,
  returnPaginated = false,
  enabled = true,
  pageSize = 5,
  sortFunc,
}: {
  queryKey: string;
  queryFn: () => Promise<TResponse>;
  returnPaginated: boolean;
  enabled?: boolean;
  pageSize?: number;
  sortFunc?: (a: TResponse, b: TResponse) => number;
}): [
  TResponse | null,
  boolean,
  () => void,
  () => void,
  (index: number) => void,
  () => void,
  string
] {
  const [startFrom, setStartFrom] = useState(0);
  useEffect(() => {
    if (typeof pageSize === "number") {
      setStartFrom(0);
    }
  }, [pageSize]);

  const goto = (index: number) => {
    if (!returnPaginated) return;
    if (index < 0) return;
    if (
      Array.isArray(fetchDataQuery.data) &&
      index * pageSize >= fetchDataQuery.data.length
    ) {
      return;
    }
    setStartFrom(index * pageSize);
  };
  const next = () => {
    if (!returnPaginated) return;

    if (
      Array.isArray(fetchDataQuery.data) &&
      startFrom + pageSize >= fetchDataQuery.data.length
    ) {
      return;
    }
    setStartFrom(startFrom + pageSize);
  };
  const prev = () => {
    if (!returnPaginated) return;
    if (startFrom <= 0) {
      return;
    }
    setStartFrom(startFrom - pageSize);
  };

  const fetchDataQuery = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
  });

  // Paginate data, if needed
  const paginatedData = [];
  if (returnPaginated && pageSize) {
    if (Array.isArray(fetchDataQuery.data)) {
      sortFunc && fetchDataQuery.data.sort(sortFunc);
      for (let i = 0; i < pageSize; i++) {
        fetchDataQuery.data[i + startFrom] &&
          paginatedData.push(fetchDataQuery.data[i + startFrom]);
      }
    }
  } else if (Array.isArray(fetchDataQuery.data)) {
    paginatedData.push(...fetchDataQuery.data);
  } else {
    paginatedData.push(fetchDataQuery.data);
  }

  // Generate pagination string
  let paginationString = "";
  if (Array.isArray(fetchDataQuery.data)) {
    paginationString = ` Page ${startFrom / pageSize + 1} of ${Math.ceil(
      fetchDataQuery.data?.length / pageSize
    )}`;
  }

  return [
    (paginatedData as TResponse) || null,
    fetchDataQuery.isLoading,
    next,
    prev,
    goto,
    fetchDataQuery.refetch,
    paginationString,
  ];
}
