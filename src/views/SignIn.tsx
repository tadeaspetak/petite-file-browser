import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { useAuth } from "../providers/Auth";

export const SignIn: React.FC = () => {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("jane@petite.com");
  const [password, setPassword] = useState("a safe one");

  // note: perform the check only on mounting (and **not** on subsequent changes) to avoid race conditions with the router
  useEffect(() => {
    if (isAuthenticated) navigate("/browse");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <form
        className="max-w-sm space-y-3 flex flex-col"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);

          await signIn(email, password);
          navigate(location.state?.from?.pathname || "/browse", { replace: true });
        }}
      >
        <div className="space-y-1">
          <label className="text-gray-700 text-sm font-bold" htmlFor="email">
            Username
          </label>
          <input
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-gray-700 text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            required
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
        </div>
        <Button label="Sign In" type="submit" loading={isSubmitting} kind="primary" />
      </form>
    </div>
  );
};
