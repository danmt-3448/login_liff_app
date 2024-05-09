import { useRoutes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "users",
      element: <Users />,
    },
  ]);
  return <>{routes}</>
}

export default App;
