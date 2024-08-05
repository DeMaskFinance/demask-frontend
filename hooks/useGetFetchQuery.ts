import { useQueryClient } from "react-query";

export const useGetFetchQuery = (key: any) => {
  const queryClient = useQueryClient();

  return queryClient.getQueryData(key);
};
