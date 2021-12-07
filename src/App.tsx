import { useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Toaster } from "./components";
import { Header } from "./layout";
import { useAuth } from "./providers";
import { Browse, SignIn } from "./views";

const Protected = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // note: differentiate between intial render (coming to a protected page unauthenticated) and subsequent changes
  const authedOnMount = useRef(isAuthenticated);

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/sign-in" state={{ from: authedOnMount.current ? undefined : location }} />
  );
};

export const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full h-full pb-12 text-white bg-gray-800">
      <Toaster />
      <Header />
      <div className="flex w-full max-w-2xl px-2">
        <Routes>
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route
            path="/browse/*"
            element={
              <Protected>
                <Browse />
              </Protected>
            }
          />
          <Route path="/*" element={<Navigate to="/browse" />} />
        </Routes>
      </div>
    </div>
  );
};
