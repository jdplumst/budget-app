import { api } from "@/constants";
import { useMutation } from "react-query";

export default function useUpdateProject() {
  const { mutate, isLoading } = useMutation(async (p: Project) => {
    const response = await fetch(`${api}/project/${p.id}`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: p.id, name: p.name, budget: p.budget }),
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
