import LoadingSpinner from "@/components/LoadingSpinner";
import { api } from "@/constants";
import { InferGetServerSidePropsType } from "next";
import Router from "next/router";
import { useEffect } from "react";
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

  // useEffect(() => {
  //   const test = async () => {
  //     const response = await fetch(`${api}/project`, {
  //       credentials: "include"
  //     });
  //     if (!response.ok) {
  //       throw Error("Network response was not ok");
  //     }
  //     const user = await response.json();
  //     console.log("useeffect: " + user);
  //     return user;
  //   };

  //   test();
  // }, []);

  return (
    <div>
      <div>Hi {user?.username}</div>
      {projects?.length! > 0 ? (
        projects!.map((p) => (
          <div key={2}>
            {p.id} {p.name}
          </div>
        ))
      ) : (
        <span>You currently have no projects!</span>
      )}
    </div>
  );
}
