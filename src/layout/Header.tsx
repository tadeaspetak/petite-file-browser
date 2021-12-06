import { faBullseye, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components";
import { useAuth } from "../providers";

export const Header: React.FC = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <header className="flex justify-center w-full h-10 p-2 mb-8 bg-gray-900 shadow-lg">
      <div className="flex items-center justify-between w-full max-w-2xl px-2">
        <div onClick={() => navigate("/browse")} className="cursor-pointer ">
          <FontAwesomeIcon icon={faBullseye} className="mr-1" />
          <span>Petite</span>
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
