import { api } from "@/constants";
import { useQuery } from "react-query";

export default function useGetProject(
  user: User | undefined,
  id: string | string[] | undefined
) {
  const { isLoading, error, data, refetch } = useQuery<Project>(
    "project",
    async () => {
      const response = await fetch(`${api}/project/${id}`, {
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
    { enabled: !!user }
  );

  return { data, isLoading, error, refetch };
}
