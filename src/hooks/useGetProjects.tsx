import { api } from "@/constants";
import { useQuery } from "react-query";

export default function useGetProjects(user: User | undefined) {
  const { isLoading, isError, data, refetch } = useQuery<Project[]>(
    "projects",
    async () => {
      const response = await fetch(`${api}/project`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw Error("Not authorized to fetch projects");
      }
      return response.json();
    },
    { enabled: !!user }
  );

  return { data, isLoading, isError, refetch };
}
