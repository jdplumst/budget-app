import { api } from "@/constants";
import { useQuery } from "react-query";

export default function useGetProjects(user: User | undefined) {
  const { isLoading, isError, data, refetch } = useQuery<Project[]>(
    "projects",
    async () => {
      const response = await fetch(`${api}/project`, {
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

  return { data, isLoading, isError, refetch };
}
