import { api } from "@/constants";
import { useQuery } from "react-query";

export default function useGetProject(
  user: User | undefined,
  id: string | string[] | undefined
) {
  const { isLoading, error, data, refetch } = useQuery<Project>(
    "projects",
    async () => {
      const response = await fetch(`${api}/project/${id}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw Error("Not authorized to fetch this project");
      }
      return response.json();
    },
    { enabled: !!user }
  );

  return { data, isLoading, error, refetch };
}
