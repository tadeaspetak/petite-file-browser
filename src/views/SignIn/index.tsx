import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../../components";
import { AuthResult, useAuth, useToasts } from "../../providers";
import { ForgottenPassword } from "./ForgottenPassword";

export const SignIn: React.FC = () => {
  const { toast, untoast } = useToasts();
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // note: perform the check only on mounting (and **not** on subsequent changes) to avoid race conditions with the router
  useEffect(() => {
    if (isAuthenticated) navigate("/browse");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Routes>
        <Route
          path="forgotten"
          element={
            <ForgottenPassword
              prefill={() => {
                setEmail("jane@petite.com");
                setPassword("supersafe");
              }}
            />
          }
        />
      </Routes>

      <form
        className="flex flex-col items-center max-w-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);

          const response = await signIn(email, password);
          setIsSubmitting(false);
          switch (response) {
            case AuthResult.INVALID_DOUBLE_SUBMIT:
              toast(
                "You must have had this window open for a loooong time. Please trying signing in once more.",
                "error",
                { id: "sign-in-error" },
              );
              break;
            case AuthResult.INVALID_CREDENTIALS:
              toast("Invalid credentials.", "error", { id: "sign-in-error" });
              break;
            case AuthResult.SUCCESS:
              untoast("sign-in-error");
              navigate(location.state?.from?.pathname || "/browse", { replace: true });
              break;
            case AuthResult.NETWORK_ERROR:
              toast(
                "We couldn't connect to the server. Please, check your connection, or try again in a short while.",
                "error",
                { id: "sign-in-error" },
              );
              break;
            case AuthResult.UNKNOWN_ERROR:
              toast(
                "Something unexpected has gone out of whack, please try again in a few moments.",
                "error",
                { id: "sign-in-error" },
              );
              break;
          }
        }}
      >
        <div className="mb-2 space-y-1">
          <label className="text-sm font-bold" htmlFor="email">
            Username
          </label>
          <input
            required
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none"
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
          <label className="text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            required
            className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <Button
          label="Sign In"
          type="submit"
          loading={isSubmitting}
          kind="primary"
          className="mt-6"
        />
        <Link
          to="forgotten"
          className="mt-8 text-xs text-green-500 underline"
          state={location.state}
        >
          Forgot your password?
        </Link>
      </form>
    </>
  );
};
