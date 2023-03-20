import { act, fireEvent, render, screen } from "@testing-library/react";

import { Profile } from "../type/Profile";

import { ProfileFullView } from "./ProfileFullView";

describe("ProfileViewFull", () => {
  const rep: Profile = {
    id: "",
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

  function setup(formSubmit: jest.Mock) {
    const view = render(<ProfileFullView {...{ formSubmit, rep }} />);

    const button = screen.getByText(/(?:create)|(?:save)/i);
    const input = screen.getByLabelText(/First Name/i);

    return { ...view, button, input };
  }

  test("check enable/disable submit button", async () => {
    const formSubmit = jest.fn(() => Promise.resolve());
    const { button, input } = setup(formSubmit);

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: "testing change" } });

    expect(button).not.toBeDisabled();
  });

  test("check call to parent submit on submit of valid form", async () => {
    const formSubmit = jest.fn((e) => {
      e.preventDefault();

      return Promise.resolve();
    });
    const { button, input } = setup(formSubmit);

    expect(formSubmit).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "testing change" } });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(formSubmit).toHaveBeenCalled();
  });
});
