import IndiaWeather from "../components/IndiaWeather";
import SketchOnMap from "../components/SketchOnMap";

const dashboardRoutes = [
  {
    path: "/",
    component: <IndiaWeather />,
  },
  {
    path: "/sketch",
    component: <SketchOnMap />,
  },
];

export { dashboardRoutes };
