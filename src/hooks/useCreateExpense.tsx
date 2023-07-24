import { api } from "@/constants";
import { useMutation } from "react-query";

export default function useCreateExpense() {
  const { mutate, isLoading } = useMutation(async (e: Expense) => {
    const response = await fetch(`${api}/expense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(e),
      credentials: "include"
    });
    if (!response.ok) {
      const error = await response.text();
      throw Error(error);
    }
    return;
  });

  return { mutate, isLoading };
}
