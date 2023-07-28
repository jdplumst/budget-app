import { api } from "@/constants";
import { useMutation } from "react-query";

interface ISignup {
  username: string;
  password: string;
}

export default function useSignup() {
  const { mutate, isLoading, error } = useMutation(
    async ({ username, password }: ISignup) => {
      const response = await fetch(`${api}/auth/signup`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      if (!response.ok) {
        const error = await response.json();
        throw Error(error);
      }
      return;
    }
  );

  return { mutate, isLoading, error };
}
