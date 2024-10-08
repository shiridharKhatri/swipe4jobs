import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Verification from "./routes/[id]";
import NotfoundPage from "./routes/NotfoundPage";
import Home from "./routes/Home";
export default function App() {
  const router = createBrowserRouter([
    {
      path: "*",
      element: <NotfoundPage />,
    },
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/secure/admin-verification/:id",
      element: <Verification />,
    },
    {
      path: "/home/authorized/:id/:routes",
      element: <Home />,
    },
  ]);
  return <RouterProvider router={router} />;
}
