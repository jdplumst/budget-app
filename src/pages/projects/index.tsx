import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { api } from "@/constants";
import useSession from "@/hooks/useSession";
import Router from "next/router";
import { useMutation, useQuery } from "react-query";
import { GrUpdate } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";

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

  const updateProject = async () => {
    const response = await fetch(`${api}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // body: JSON.stringify({ username, password }),
      credentials: "include"
    });
    if (!response.ok) {
      const error = await response.text();
      throw Error(error);
    }
    return;
  };

  const { mutate: updateMutation, isLoading: updateLoading } = useMutation(
    updateProject,
    {
      onSuccess(data, variables, context) {
        // Router.push("/projects");
      },
      onError(error, variables, context) {
        // setError((error as Error).message);
        // setDisabled(false);
      }
    }
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
      {/* <div>Hi {user?.username}</div> */}
      <Navbar username={user?.username!} />
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
            <div className="absolute bottom-2 left-5 hover:cursor-pointer">
              <GrUpdate size={20} />
            </div>
            <div className="absolute bottom-2 right-5 hover:cursor-pointer">
              <AiFillDelete size={20} />
            </div>
            <div className="absolute top-10">{p.name}</div>
            <button className="absolute bottom-12 w-40 rounded-lg border-2 border-black bg-green-500 p-2 font-bold hover:bg-green-600">
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
