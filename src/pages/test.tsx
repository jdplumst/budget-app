import { useEffect, useState } from "react";

export default function Test() {
  const api =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_SERVER_DEV_URL
      : process.env.NEXT_PUBLIC_SERVER_PROD_URL;

  const [x, setX] = useState("");

  useEffect(() => {
    const get = async () => {
      const response = await fetch(`${api}/test`);
      const data = await response.text();
      setX(data);
    };
    get();
  }, []);

  return (
    <main>
      <div>test</div>
      <div>{x}</div>
    </main>
  );
}
