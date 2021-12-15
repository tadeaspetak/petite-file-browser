import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { ApiBrowseRes } from "../../common/types";
import { useSmartFetch } from "../../hooks";
import { useAuth, useToasts } from "../../providers";
import { Browser } from "./Browser";
import { FilterProvider, SortProvider } from "./providers";

export const Browse: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { smartFetch } = useSmartFetch();
  const { toast } = useToasts();
  const { signOut } = useAuth();

  const path = location.pathname.replace(/^\/browse/, "");

  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<ApiBrowseRes | undefined>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const result = await smartFetch<ApiBrowseRes>(`/api/browse?path=${path}`, {
        method: "GET",
      });

      switch (result.status) {
        case "ok":
          setContents(result.parsed);
          break;
        case "forbidden": {
          toast("You've been signed out, please sign in again.", "error", { id: "sign-in" });
          await signOut();
          break;
        }
        case "network":
          toast(
            "We couldn't connect to the server. Please, check your connection, or try again in a short while.",
            "error",
          );
          break;
        case "unknown":
          if (result.response.status === 404) {
            toast(
              `We couldn't find the place you were trying to browse ('${path}'). We've taken you back to the safety of the harbour ⚓`,
              "error",
              { id: "navigate", hideIn: 0 },
            );
            navigate("/browse");
          } else {
            toast(
              "There has been an unexpected error. Please, try again in a short while.",
              "error",
            );
          }
      }

      if (result.status !== "stale") setIsLoading(false); // note: keep at the end to make sure we have the contents before rendering them
    })();
  }, [navigate, path, signOut, smartFetch, toast]);

  return (
    <FilterProvider>
      <SortProvider>
        <Browser contents={contents} loading={isLoading} path={path} setLoading={setIsLoading} />
      </SortProvider>
    </FilterProvider>
  );
};
