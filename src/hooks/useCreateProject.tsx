import { api } from "@/constants";
import { useMutation } from "react-query";

export default function useCreateProject() {
  const { mutate, isLoading } = useMutation(async (p: Project) => {
    const response = await fetch(`${api}/project`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: p.name, budget: p.budget }),
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
