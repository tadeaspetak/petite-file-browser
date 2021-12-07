import { useMemo } from "react";

import { joinUrl } from "../../../utils";

interface PathPart {
  name: string;
  link: string;
}

export const Navigation: React.FC<{ browseAbsolute: (url: string) => void; path: string }> = ({
  browseAbsolute,
  path,
}) => {
  // const { toast } = useToasts();

  // const bookmark = useCallback(() => {
  //   toast(`Press ${isMac() ? "Cmd" : "Ctrl"} + D to bookmark this page.`, "info", {
  //     id: "bookmark-me",
  //   });
  // }, [toast]);

  const parts: PathPart[] = useMemo(() => {
    const parts = path
      .split("/")
      .filter((part) => !!part)
      .reduce(
        (acc, part) => {
          acc.push({ name: part, link: joinUrl(acc[acc.length - 1].link, part) });
          return acc;
        },
        [{ name: "~", link: joinUrl("/browse", "") }] as PathPart[],
      );
    return parts;
  }, [path]);

  return (
    <div className="flex justify-between w-full">
      <div>
        {parts.map((part, i) => (
          <span key={part.link}>
            {i >= parts.length - 1 ? (
              part.name
            ) : (
              <>
                <span
                  className="text-blue-500 underline cursor-pointer hover:no-underline"
                  onClick={() => browseAbsolute(part.link)}
                >
                  {part.name}
                </span>
                <span className="inline-block mx-1">/</span>
              </>
            )}
          </span>
        ))}
      </div>
      {/* <Button icon={faBookmark} onClick={bookmark} size="sm" className="ml-auto" /> */}
    </div>
  );
};
