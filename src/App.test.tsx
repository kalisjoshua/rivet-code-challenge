import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { Profile } from "./type/Profile";
import { clientFactory } from "./util/naiveSDK";

jest.mock("./util/naiveSDK");

const allProfiles: Array<Profile> = require("./util/testingData.json");

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
      GET: jest.fn((_path: string) => Promise.reject()),
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
  expect(pushStateSpy).toHaveBeenCalledWith({ id: "new" }, "", "?id=new");
});

test("navigation between profiles", async () => {
  const addEventListenerSpy = jest.spyOn(global, "addEventListener");
  const pushStateSpy = jest.spyOn(global.history, "pushState");
  let rerender: (s: string) => void;

  let addEventListenerHandler: EventListener;
  addEventListenerSpy.mockImplementation(
    (_eventName: string, fn: EventListenerOrEventListenerObject) => {
      addEventListenerHandler = fn as EventListener;
    }
  );

  (clientFactory as jest.Mock).mockImplementation(() => {
    return {
      GET: jest.fn((path: string) =>
        Promise.resolve(path === "/profiles" ? allProfiles : allProfiles[1])
      ),
    };
  });

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    const { rerender: renderRerender } = await render(
      <App repId="1" root="ROOT" token="abc123" />
    );

    rerender = (id: string) => {
      renderRerender(<App repId={id} root="ROOT" token="abc123" />);
    };
  });

  const profiles = screen.getAllByText(/^View$/i);

  const testProfiles: Array<Profile> = profiles.map((el) => {
    const id =
      (el as unknown as { href: string }).href.match(/\d+$/)?.[0] || "";

    return allProfiles.find((record) => record.id.toString() === id);
  }) as Array<Profile>;

  // console.log(screen.getByDisplayValue(testProfiles[0].first_name).value);
  expect(
    screen.getByDisplayValue(testProfiles[0].first_name)
  ).toBeInTheDocument();

  expect(
    screen.queryByDisplayValue(testProfiles[1].first_name)
  ).not.toBeInTheDocument();

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    await userEvent.click(profiles[1]);
  });

  expect(pushStateSpy).toHaveBeenCalledWith(
    { id: testProfiles[1].id },
    "",
    `?id=${testProfiles[1].id}`
  );

  // console.log(screen.getByDisplayValue(testProfiles[1].first_name).value);
  expect(
    screen.getByDisplayValue(testProfiles[1].first_name)
  ).toBeInTheDocument();

  expect(
    screen.queryByDisplayValue(testProfiles[0].first_name)
  ).not.toBeInTheDocument();

  // // TODO: figure out back navigation test
  // await act(async () => {
  //   // await global.history.back();
  //   await addEventListenerHandler({} as Event);
  //   await rerender(testProfiles[0].id);
  // });

  // // screen.debug();

  // // console.log(screen.getByText("...developer challenge"));
  // console.log(screen.getByAltText("first_name").value);

  // // expect(
  // //   screen.getByDisplayValue(testProfiles[0].first_name)
  // // ).toBeInTheDocument();

  // // expect(
  // //   screen.queryByDisplayValue(testProfiles[1].first_name)
  // // ).not.toBeInTheDocument();
});
