import "./styles/App.css";
import "./styles/responsive/App.css";
import Post from "./routes/Post";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import About from "./routes/About";
import Terms from "./routes/Terms";
import NotfoundPage from "./routes/NotfoundPage";
import Search from "./routes/search/Search";
import SearchJobs from "./routes/search/[id]";
import Login from "./routes/auth/Login";
import Signup from "./routes/auth/Signup";
import Verification from "./routes/auth/verification/[id]";
import Status from "./routes/payment-status/[status]";


function App() {
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
      path: "/post-jobs",
      element: <Post />,
    },
    {
      path: "/search-jobs",
      element: <Search />,
    },
    {
      path: "/search-jobs/:id",
      element: <SearchJobs />,
    },
    {
      path: "/about-us",
      element: <About />,
    },
    {
      path: "/terms-of-use",
      element: <Terms />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path:'/verification/:id',
      element:<Verification/>
    },
    {
      path:'/status/:status',
      element:<Status/>
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
