import { api } from "@/constants";
import { useMutation } from "react-query";

export default function useAddPremium() {
  const { mutate, isLoading, error } = useMutation(async () => {
    const response = await fetch(`${api}/user`, {
      method: "PUT",
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
