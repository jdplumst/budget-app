export {};

declare global {
  interface User {
    username: string;
  }

  interface Project {
    id?: number;
    name: string;
    budget: number;
    createDate?: string;
    modifyDate?: Date;
  }
}
