import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useDataFetcher<TResponse>({
  queryKey,
  queryFn,
  returnPaginated = false,
}: {
  queryKey: string;
  queryFn: () => Promise<TResponse>;
  returnPaginated: boolean;
}): [TResponse, boolean, () => void, () => void] {
  const [isLoading, setIsLoading] = useState(false);

  const next = () => {
    if (!returnPaginated) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const prev = () => {
    if (!returnPaginated) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const fetchDataQuery = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return [
    fetchDataQuery.data ?? ({} as TResponse),
    fetchDataQuery.isLoading || isLoading,
    next,
    prev,
  ];
}
