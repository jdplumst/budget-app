import { api } from "@/constants";
import { useMutation } from "react-query";

export default function useDeleteProject() {
  const { mutate, isLoading } = useMutation(async (p: Project) => {
    const response = await fetch(`${api}/project/${p.id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (!response.ok) {
      const error = await response.json();
      throw Error(error);
    }
    return;
  });

  return { mutate, isLoading };
}
