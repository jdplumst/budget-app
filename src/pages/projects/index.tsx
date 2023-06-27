import LoadingSpinner from "@/components/LoadingSpinner";
import { api } from "@/constants";
import Router from "next/router";
import { useQuery } from "react-query";

interface User {
  username: string;
}

interface Project {
  id: number;
  name: string;
}

export default function Projects() {
  const { data: user } = useQuery<User>("user", async () => {
    const response = await fetch(`${api}/user`, { credentials: "include" });
    if (!response.ok) {
      Router.push("/");
    }
    const user = await response.json();
    return user;
  });

  const {
    isLoading,
    isError,
    data: projects
  } = useQuery<Project[]>("projects", async () => {
    const response = await fetch(`${api}/project`, { credentials: "include" });
    console.log("project run!");
    if (!response.ok) {
      throw Error("Network response was not ok");
    }
    return response.json();
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error!</div>;

  return (
    <div>
      <div>Hi {user?.username}</div>
      <div className="projects grid justify-center gap-5 pt-5">
        <div className="relative flex h-72 w-72 justify-center border-2 border-solid border-black text-center text-4xl font-bold">
          <div className="absolute top-10">Add A New Project</div>
          <button className="absolute bottom-10 w-40 rounded-lg border-2 border-black bg-blue-500 p-2 font-bold hover:bg-blue-600">
            Add
          </button>
        </div>
        {projects!.map((p) => (
          <div
            key={2}
            className="relative flex h-72 w-72 justify-center border-2 border-solid border-black text-center text-4xl font-bold">
            <div className="absolute top-10">{p.name}</div>
            <button className="absolute bottom-10 w-40 rounded-lg border-2 border-black bg-green-500 p-2 font-bold hover:bg-green-600">
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
