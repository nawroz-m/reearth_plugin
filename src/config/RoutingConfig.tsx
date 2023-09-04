import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { dashboardRoutes } from "../routes/Routes";

const RoutingConfig = () => {
  return (
    <>
      <Router>
        <Routes>
          {dashboardRoutes.map((route, idx) => {
            return (
              <>
                <Route path={route.path} element={route.component} key={idx} />
              </>
            );
          })}
        </Routes>
      </Router>
    </>
  );
};

export default RoutingConfig;
