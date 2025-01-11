import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authRoutes, protectedRoutes } from "./routes";
import Layout from "./routes/Layout";
import ErrorPage from "./components/ErrorPage";

// Create the router
const router = createBrowserRouter([
  ...authRoutes,
  {
    path: "/",
    element: <Layout />,
    children: [
      ...protectedRoutes
    ],
    errorElement: <ErrorPage />
  }
]);

export default router;