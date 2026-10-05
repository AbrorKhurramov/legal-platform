import type { AxiosRequestConfig } from "axios";

import type { UserRecord } from "./mock-db.types";

export interface MockRequest {
  params: Record<string, string>;
  query: Record<string, string | undefined>;
  body: Record<string, unknown>;
  user: UserRecord | null;
  language: "uz" | "ru";
  config: AxiosRequestConfig;
}

export interface MockResult {
  status?: number;
  message?: string;
  data?: unknown;
}

export type MockHandler = (request: MockRequest) => MockResult;

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface MockRoute {
  method: HttpMethod;
  pattern: RegExp;
  keys: string[];
  isPublic: boolean;
  handler: MockHandler;
}

const routes: MockRoute[] = [];

const compile = (path: string) => {
  const keys: string[] = [];
  const source = path.replace(/:(\w+)/g, (_, key: string) => {
    keys.push(key);
    return "([^/]+)";
  });
  return { pattern: new RegExp(`^${source}$`), keys };
};

export const mockRoute = (method: HttpMethod, path: string, handler: MockHandler, isPublic = false) => {
  routes.push({ method, ...compile(path), isPublic, handler });
};

export const matchRoute = (method: string, path: string) => {
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(path);
    if (match) {
      const params = Object.fromEntries(route.keys.map((key, index) => [key, decodeURIComponent(match[index + 1])]));
      return { route, params };
    }
  }
  return null;
};
