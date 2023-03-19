import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Profile } from "../type/Profile";
import { SDK } from "../util/naiveSDK";

import { ProfileFullView } from "./ProfileFullView";

describe("ProfileViewFull", () => {
  const client = {
    POST: jest.fn(),
    PUT: jest.fn(),
  } as unknown as SDK;

  afterEach(() => {
    (client.POST as jest.Mock).mockClear();
    (client.PUT as jest.Mock).mockClear();
  });

  test("valid new submit", async () => {
    const rep: Profile = {
      id: "new",
      first_name: "Ted",
      last_name: "Lasso",
      phone: "1238142020",
      email: "ted@lasso.apple.plus",
      address: "1 Nelson Rd",
      city: "Richmond",
      state: "Kansas",
      zip: "54321",
      photo: "",
      notes: "",
    };
    const formSubmit = jest.fn();

    render(<ProfileFullView {...{ formSubmit, rep }} />);

    // // const form = screen.getByRole("form");
    // // fireEvent.submit(form);
    // // screen.debug(form);

    // const input = screen.getByLabelText(/First Name/i);

    // await userEvent.paste("Theodore");
    // await userEvent.type(input, "{enter}");

    // const button = screen.getByText(/Create/i);

    // await userEvent.click(button);

    // expect(formSubmit).toHaveBeenCalled();
    // // expect(update).toHaveBeenCalled();
  });
});
