import LoadingSpinner from "@/components/LoadingSpinner";
import { api } from "@/constants";
import useSession from "@/hooks/useSession";
import Router from "next/router";
import { useQuery } from "react-query";

export default function Projects() {
  const { user, userLoading } = useSession();
  if (!user && !userLoading) {
    Router.push("/");
  }

  const {
    isLoading: projectsLoading,
    isError,
    data: projects
  } = useQuery<Project[]>(
    "projects",
    async () => {
      const response = await fetch(`${api}/project`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw Error("Not authorized to fetch projects");
      }
      return response.json();
    },
    { enabled: !!user }
  );

  if (userLoading || projectsLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
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
        {projects?.map((p) => (
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
