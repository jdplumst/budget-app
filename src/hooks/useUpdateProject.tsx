import { api } from "@/constants";
import { useMutation } from "react-query";

interface IUpdateMutation {
  id: number;
  name: string;
}

export default function useUpdateProject() {
  const { mutate, isLoading } = useMutation(
    async ({ id, name }: IUpdateMutation) => {
      const response = await fetch(`${api}/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, name: name }),
        credentials: "include"
      });
      if (!response.ok) {
        const error = await response.text();
        throw Error(error);
      }
      return;
    }
  );

  return { mutate, isLoading };
}
