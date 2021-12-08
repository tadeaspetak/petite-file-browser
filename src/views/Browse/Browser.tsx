import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { ApiBrowseRes } from "../../../src/common/types";
import { Spinner } from "../../components";
import { joinUrl, setOrDeleteParam } from "../../utils";
import { Filters, HeaderCell, Navigation, Preview, Row, RowBack, Sorting } from "./components";
import { useFilter, useSort } from "./providers";

export const Browser: React.FC<{
  contents: ApiBrowseRes | undefined;
  loading: boolean;
  path: string;
}> = ({ contents, loading, path }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const { applyFilters } = useFilter();
  const { applySorting } = useSort();

  const browseAbsolute = useCallback(
    (url: string) => {
      // preseve sorting
      const nextParams = new URLSearchParams();
      setOrDeleteParam(nextParams, "sort", params.get("sort") ?? undefined);
      setOrDeleteParam(nextParams, "dirs", params.get("dirs") ?? undefined);

      navigate(url + `?${nextParams.toString()}`);
    },
    [navigate, params],
  );

  const browseRelative = useCallback(
    (name: string) => browseAbsolute(joinUrl("/", location.pathname, name)),
    [location.pathname, browseAbsolute],
  );

  const preview = useMemo(() => params.get("preview"), [params]);
  const showPreview = useCallback(
    (value: string) => void setParams(setOrDeleteParam(params, "preview", value)),
    [params, setParams],
  );

  const items = useMemo(
    () => applySorting(applyFilters([...(contents?.items ?? [])])),
    [applyFilters, applySorting, contents?.items],
  );

  return (
    <div className="w-full mt-8">
      {preview && <Preview items={items} preview={preview} />}

      <Filters items={contents?.items ?? []} />
      <Sorting />
      <Navigation browseAbsolute={browseAbsolute} path={path} />

      <div className="w-full">
        <table className="w-full mt-2 table-fixed">
          <thead className="text-sm font-semibold text-white bg-gray-700">
            <tr>
              <HeaderCell name="name" className="text-left">
                Name
              </HeaderCell>
              <HeaderCell name="size" className="w-20 text-left">
                Size
              </HeaderCell>
              <HeaderCell name="type" className="w-12 text-right" sortable={false}>
                Type
              </HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={3}>
                  <div className="flex py-6">
                    <Spinner className="w-12 text-white" />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {!contents?.isRoot && <RowBack browseRelative={browseRelative} />}
                {items.map((item) => (
                  <Row
                    key={item.name}
                    browseRelative={browseRelative}
                    item={item}
                    showPreview={showPreview}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
