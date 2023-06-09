import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Profile } from "../type/Profile";
import { SDK } from "../util/naiveSDK";

import { Nav } from "./Nav";

const testingData: Array<Profile> = require("../util/testingData.json");

describe("Nav", () => {
  const client = {
    GET: jest.fn(),
  } as unknown as SDK;
  const list = [
    {
      first_name: "Josh",
      last_name: "Kalis",
      id: "dev",
    } as Profile,
  ];
  const pushStateSpy = jest.spyOn(global.history, "pushState");
  const selected = "";
  const setSelected = jest.fn();
  const updateList = jest.fn();

  beforeEach(() => {
    setSelected.mockClear();
    pushStateSpy.mockClear();
    updateList.mockClear();
  });

  test("click existing Rep (consistent data)", async () => {
    render(<Nav {...{ client, list, selected, setSelected, updateList }} />);

    (client.GET as jest.Mock).mockImplementation(() => {
      return Promise.resolve(list[0]);
    });

    const element = screen.getByText(/View/i);

    await userEvent.click(element);

    expect(setSelected).toHaveBeenCalledWith(list[0].id);
    expect(client.GET).toHaveBeenCalledWith(`/profile/${list[0].id}`);
    expect(updateList).not.toHaveBeenCalled();
  });

  test("click existing Rep (inconsistent data)", async () => {
    render(<Nav {...{ client, list, selected, setSelected, updateList }} />);

    (client.GET as jest.Mock).mockImplementation(() => {
      const newData = { ...list[0] };

      newData.first_name = "Evie";

      return Promise.resolve(newData);
    });

    const element = screen.getByText(/View/i);

    await userEvent.click(element);

    expect(setSelected).toHaveBeenCalledWith(list[0].id);
    expect(client.GET).toHaveBeenCalledWith(`/profile/${list[0].id}`);
    expect(updateList).toHaveBeenCalledWith(true);
  });

  test("filter nav list", async () => {
    (client.GET as jest.Mock).mockImplementation(() => {
      return Promise.resolve(testingData);
    });

    render(
      <Nav
        {...{ client, list: testingData, selected, setSelected, updateList }}
      />
    );

    let navLinks = screen.getAllByText(/View/i);

    expect(navLinks.length).toBe(testingData.length);

    const element = screen.getByPlaceholderText("Profile Search");

    expect(element).toHaveValue("");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      await userEvent.type(element, "Currier");
    });

    expect(element).toHaveValue("Currier");

    navLinks = screen.getAllByText(/View/i);

    expect(navLinks.length).toBe(2);
  });
});
