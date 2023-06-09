import { api } from "@/constants";
import Router from "next/router";
import { useState } from "react";
import { useMutation } from "react-query";
import LoadingSpinner from "./LoadingSpinner";

interface INavbar {
  username: string;
}

export default function Navbar({ username }: INavbar) {
  const [disabled, setDisabled] = useState(false);

  const logout = async () => {
    const response = await fetch(`${api}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (!response.ok) {
      const error = await response.text();
      throw Error(error);
    }
    return;
  };

  const { mutate: logoutMutation, isLoading } = useMutation(logout, {
    onSuccess(data, variables, context) {
      Router.push("/");
    },
    onError(error, variables, context) {
      setDisabled(false);
    }
  });

  const handleLogout = () => {
    setDisabled(true);
    logoutMutation();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light relative flex w-full flex-wrap items-center justify-between bg-gray-100 px-14 py-4 shadow-lg">
      <span className="text-3xl font-bold">Hi {username}!</span>
      <button
        onClick={() => handleLogout()}
        disabled={disabled}
        className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
        {isLoading ? <LoadingSpinner /> : "Logout"}
      </button>
    </nav>
  );
}
