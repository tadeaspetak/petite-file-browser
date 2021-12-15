import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import { createDirItem, createFileItem } from "../../common/testUtils";
import { BrowserItem } from "../../common/types";
import { Browser } from "./Browser";
import { FilterProvider, SortProvider } from "./providers";

const mountWithRouter = (initialEntries?: string[]) =>
  mount(
    <MemoryRouter initialEntries={initialEntries}>
      <FilterProvider>
        <SortProvider>
          <Browser
            path="/testing"
            loading={false}
            contents={{ isRoot: false, path: "/testing", name: "folder", items }}
          />
        </SortProvider>
      </FilterProvider>
    </MemoryRouter>,
  );

const items: BrowserItem[] = [
  createDirItem("my directory"),
  createDirItem("another directory"),
  createFileItem("my file", 12, "12 B"),
  createFileItem("another file", 1024, "1 KB"),
];

describe("test browser", () => {
  it("renders", () => {
    const wrapper = mountWithRouter();
    const table = wrapper.find("table");
    const row = table.find("tr");

    expect(table).toHaveLength(1);
    expect(row).toHaveLength(6);

    const expectedValues = ["another file", "1 KB", "file"];
    const values = row.at(5).find("td");
    values.forEach((v, i) => expect(v.text()).toBe(expectedValues[i]));
  });

  it("filters", () => {
    const wrapper = mountWithRouter(["/testing?name=ano&type=dir"]);
    const table = wrapper.find("table");
    const row = table.find("tr");

    expect(table).toHaveLength(1);
    expect(row).toHaveLength(3);

    const expectedValues = ["another directory", "", "dir"];
    const values = row.at(2).find("td");
    values.forEach((v, i) => expect(v.text()).toBe(expectedValues[i]));
  });

  it("sorts", () => {
    const wrapper = mountWithRouter(["/testing?type=file&sort=size-desc"]);
    const table = wrapper.find("table");
    const row = table.find("tr");

    expect(table).toHaveLength(1);
    expect(row).toHaveLength(4);

    const expectedValues = ["my file", "12 B", "file"];
    const values = row.at(3).find("td");
    values.forEach((v, i) => expect(v.text()).toBe(expectedValues[i]));
  });
});
