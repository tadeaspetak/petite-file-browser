import React, { useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { ApiBrowseRes, BrowserItem } from "../../../src/common/types";
import { Spinner } from "../../components";
import { useDeferredParams } from "../../hooks";
import { joinUrl, setOrDeleteParam } from "../../utils";
import { Filters, HeaderCell, Navigation, Preview, Row, RowBack, Sorting } from "./components";
import { useFilter, useSort } from "./providers";

interface BrowserProps {
  contents: ApiBrowseRes | undefined;
  loading: boolean;
  path: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

type FilterOrSort = (items: BrowserItem[]) => BrowserItem[];

const MemoizedBrowser: React.FC<
  BrowserProps & { applyFilters: FilterOrSort; applySorting: FilterOrSort }
> = React.memo(({ contents, loading, path, applyFilters, applySorting, setLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getParams, setParams } = useDeferredParams();
  const [params] = useSearchParams();

  // note: keep `useCallback` to be able to keep `browseRelative` stable
  const browse = useCallback(
    (url: string) => {
      const nextParams = new URLSearchParams();
      setOrDeleteParam(nextParams, "sort", getParams().get("sort") ?? undefined);
      setOrDeleteParam(nextParams, "dirs", getParams().get("dirs") ?? undefined);

      setLoading(true); // note: prevent from rerendering rows in the time between the `navigate` call below and the fetching hook in the parent kicks in
      navigate(`${url}?${nextParams.toString()}`);
    },
    [getParams, navigate, setLoading],
  );

  // note: keep `useCallback` to not re-render rows (memoized)
  const browseRelative = useCallback(
    (value: string) => browse(joinUrl("/", location.pathname, value)),
    [browse, location.pathname],
  );

  // note: keep `useCallback` to not re-render rows (memoized)
  const showPreview = useCallback(
    (value: string) => void setParams(setOrDeleteParam(getParams(), "preview", value)),
    [getParams, setParams],
  );
  const preview = params.get("preview");

  const items = loading ? [] : applySorting(applyFilters([...(contents?.items ?? [])]));

  return (
    <div className="w-full mt-8">
      {preview && <Preview items={items} preview={preview} />}

      <Filters items={contents?.items ?? []} />
      <Sorting />
      <Navigation browse={browse} path={path} />

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
                {!contents?.isRoot && <RowBack browse={browse} />}
                {items.map((item) => (
                  <Row
                    key={item.name}
                    browseRelative={browseRelative}
                    item={item}
                    preview={showPreview}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export const Browser: React.FC<BrowserProps> = (props) => {
  // note: keep outside to make sure the browser only rerenders relevant deps from its contexts change
  const { applySorting } = useSort();
  const { applyFilters } = useFilter();

  return (
    <MemoizedBrowser
      {...props}
      applyFilters={applyFilters}
      applySorting={applySorting}
    ></MemoizedBrowser>
  );
};
