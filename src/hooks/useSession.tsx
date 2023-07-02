import { api } from "@/constants";
import { useQuery } from "react-query";

export default function useSession() {
  const { data: user, isLoading: userLoading } = useQuery<User>(
    "user",
    async () => {
      const response = await fetch(`${api}/user`, { credentials: "include" });
      if (!response.ok) {
        return null;
      }
      const user = await response.json();
      return user;
    }
  );
  return { user, userLoading };
}
