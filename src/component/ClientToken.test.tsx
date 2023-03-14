import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ClientToken, getToken } from "./ClientToken";

test("no token yet", () => {
  expect(getToken()).toBe("");
});

test("change the value", async () => {
  let token = "";
  const setToken = (t: string) => {
    token = t;
  };

  render(<ClientToken {...{ setToken, token }} />);

  await userEvent.click(screen.getByPlaceholderText(/API Client Token/i));
  await userEvent.paste("xyz987");

  expect(token).toBe("xyz987");
  expect(getToken()).toBe("xyz987");
});
