import { api } from "@/constants";
import { useMutation } from "react-query";

export default function useDeleteExpense() {
  const { mutate, isLoading } = useMutation(async (e: Expense) => {
    const response = await fetch(`${api}/expense/${e.id}`, {
      method: "DELETE",
      headers: {
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
