import { api } from "@/constants";
import { useQuery } from "react-query";

export default function useGetExpenses(project: Project | undefined) {
  const { isLoading, error, data, refetch } = useQuery<Expense[]>(
    "expenses",
    async () => {
      const response = await fetch(`${api}/expense?projectId=${project?.id}`, {
        headers: {
          Accept: "application/json"
        },
        credentials: "include"
      });
      if (!response.ok) {
        const error = await response.json();
        throw Error(error);
      }
      return response.json();
    },
    { enabled: !!project }
  );

  return { data, isLoading, error, refetch };
}
