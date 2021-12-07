import { useLocation } from "react-router-dom";

export const Browse: React.FC = () => {
  const location = useLocation();

  return <div>Browsing {location.pathname}.</div>;
};
