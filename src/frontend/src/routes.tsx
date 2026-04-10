import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import ChatPage from "./pages/ChatPage";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ChatPage,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
