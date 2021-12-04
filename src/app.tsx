import { faBullseye, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Button } from "./components/Button";
import { Toaster } from "./components/Toaster";
import { useAuth } from "./providers/Auth";
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

const Header: React.FC = ({ children }) => {
  const { isAuthenticated, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <header className="bg-gray-100 mb-8 w-full flex justify-center p-2 border-b border-gray-200 h-10">
      <div className="max-w-md w-full flex justify-between items-center">
        <div>
          <FontAwesomeIcon icon={faBullseye} className="mr-1" />
          <Link to="/browse">Petite</Link>
        </div>
        {isAuthenticated && (
          <Button
            hint="Sign Out"
            icon={faSignOutAlt}
            loading={isSigningOut}
            onClick={async () => {
              setIsSigningOut(true);
              await signOut();
              setIsSigningOut(false);
            }}
            size="sm"
          />
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <div className="flex flex-col items-center">
      <Toaster />
      <Header />
      <div className="max-w-md">
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
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
}

export default App;
