export {};

declare global {
  interface User {
    username: string;
  }

  interface Project {
    id: number;
    name: string;
  }
}
