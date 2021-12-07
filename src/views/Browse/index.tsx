import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { ApiBrowseRes } from "../../common/types";
import { useSmartFetch } from "../../hooks";
import { useToasts } from "../../providers";
import { Browser } from "./Browser";
import { FilterProvider, SortProvider } from "./providers";

export const Browse: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { smartFetch, notifyUnknown } = useSmartFetch();
  const { toast } = useToasts();

  // TODO: is there a better way?
  const path = useMemo(() => location.pathname.replace(/^\/browse/, ""), [location.pathname]);

  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<ApiBrowseRes | undefined>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const result = await smartFetch<ApiBrowseRes>(
        `/api/browse?path=${path}`,
        { method: "GET" },
        { handleUnknown: false },
      );
      if (result.status !== "stale") setIsLoading(false);

      switch (result.status) {
        case "ok":
          setContents(result.parsed);
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
            notifyUnknown();
          }
      }
    })();
  }, [smartFetch, path, toast, notifyUnknown, navigate]);

  return (
    <FilterProvider>
      <SortProvider>
        <Browser contents={contents} loading={isLoading} path={path} />
      </SortProvider>
    </FilterProvider>
  );
};
