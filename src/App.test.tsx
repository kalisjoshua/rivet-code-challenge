import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { clientFactory } from "./util/naiveSDK";

jest.mock("./util/naiveSDK");

const allProfiles = require("./util/testingData.json");

const includesProfileFullView = (all: Array<HTMLElement>) =>
  all.map((form) => form.getAttribute("name")).includes("ProfileFullView");

test("renders the (default) about view", () => {
  render(<App repId="" root="" token="" />);

  expect(screen.getByText("...developer challenge")).toBeInTheDocument();

  expect(includesProfileFullView(screen.queryAllByRole("form"))).toBe(false);
});

test("handles rejected Promise from API call", () => {
  (clientFactory as jest.Mock).mockImplementation(() => {
    return {
      GET: jest.fn((path: string) => Promise.reject()),
    };
  });

  render(<App repId="" root="ROOT" token="abc123" />);

  expect(screen.getByText("...developer challenge")).toBeInTheDocument();

  expect(includesProfileFullView(screen.queryAllByRole("form"))).toBe(false);
});

test("no Add Rep option", async () => {
  (clientFactory as jest.Mock).mockImplementation(() => {
    return { GET: jest.fn(() => Promise.reject()) };
  });

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    await render(<App repId="" root="ROOT" token="" />);
  });

  const element = screen.queryByText(/Add Rep/i);

  expect(screen.getByText("...developer challenge")).toBeInTheDocument();
  expect(includesProfileFullView(screen.queryAllByRole("form"))).toBe(false);
  expect(element).toBeNull();
});

test("click Add Rep", async () => {
  const pushStateSpy = jest.spyOn(global.history, "pushState");

  (clientFactory as jest.Mock).mockImplementation(() => {
    return { GET: jest.fn(() => Promise.resolve([])) };
  });

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    await render(<App repId="" root="ROOT" token="abc123" />);
  });

  expect(screen.getByText("...developer challenge")).toBeInTheDocument();
  expect(includesProfileFullView(screen.queryAllByRole("form"))).toBe(false);

  const element = screen.getByText(/Add Rep/i);

  expect(element).toBeTruthy();

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    await userEvent.click(element);
  });

  expect(screen.queryByText("...developer challenge")).toBeNull();
  expect(includesProfileFullView(screen.queryAllByRole("form"))).toBe(true);
  expect(pushStateSpy).toHaveBeenCalledWith({}, "", "?id=new");
});

test("navigation between profiles", async () => {
  const pushStateSpy = jest.spyOn(global.history, "pushState");

  (clientFactory as jest.Mock).mockImplementation(() => {
    return {
      GET: jest.fn((path: string) =>
        Promise.resolve(path === "/profiles" ? allProfiles : allProfiles[1])
      ),
    };
  });

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    await render(<App repId="1" root="ROOT" token="abc123" />);
  });

  const profiles = screen.getAllByText(/^View$/i);

  expect(
    screen.getByDisplayValue(allProfiles[0].first_name)
  ).toBeInTheDocument();

  expect(
    screen.queryByDisplayValue(allProfiles[1].first_name)
  ).not.toBeInTheDocument();

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    await userEvent.click(profiles[1]);
  });

  expect(pushStateSpy).toHaveBeenCalledWith({}, "", `?id=${allProfiles[1].id}`);

  expect(
    screen.getByDisplayValue(allProfiles[1].first_name)
  ).toBeInTheDocument();

  expect(
    screen.queryByDisplayValue(allProfiles[0].first_name)
  ).not.toBeInTheDocument();

  // TODO: figure out back navigation test
  // await act(async () => {
  //   await global.history.back();
  // });

  // expect(
  //   screen.getByDisplayValue(allProfiles[0].first_name)
  // ).toBeInTheDocument();

  // expect(
  //   screen.queryByDisplayValue(allProfiles[1].first_name)
  // ).not.toBeInTheDocument();
});
