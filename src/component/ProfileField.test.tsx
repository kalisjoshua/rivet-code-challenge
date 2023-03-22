import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  EditableInputTypes,
  ProfileField,
  ProfileFieldProps,
} from "./ProfileField";

describe("ProfileField", () => {
  let props: ProfileFieldProps;

  const getElement = <T extends EditableInputTypes>(text: string) =>
    screen.getByLabelText(text) as T;

  function runTests<T extends EditableInputTypes>(
    element: T,
    props: ProfileFieldProps,
    match: RegExp,
    num: number
  ) {
    expect(element.nodeName).toMatch(match);
    expect(element.type).toBe(props.type);
    expect(element.value).toBe(props.value);
    expect(screen.queryAllByRole("status").length).toBe(num);
  }

  describe("<input />", () => {
    beforeEach(() => {
      props = {
        errors: {},
        errorText: {},
        fieldName: "first_name",
        labelText: "First Name",
        maxLength: 9,
        // minLength TBD
        // maxValue TBD
        // minValue TBD
        onChange: jest.fn(),
        type: "text",
        value: "Ted",
      } as ProfileFieldProps;
    });

    test("no errors", () => {
      render(<ProfileField {...props} />);

      const element = getElement<HTMLInputElement>(props.labelText);

      runTests<HTMLInputElement>(element, props, /input/i, 0);
    });

    test("disabled", () => {
      props.disabled = true;

      render(<ProfileField {...props} />);

      const element = getElement<HTMLInputElement>(props.labelText);

      runTests<HTMLInputElement>(element, props, /input/i, 0);
      expect(element).toBeDisabled();
    });

    test("required & valid", () => {
      props.errorText.required = "The 'First Name' field is required.";
      props.required = true;

      render(<ProfileField {...props} />);

      const element = getElement<HTMLInputElement>(props.labelText);

      runTests<HTMLInputElement>(element, props, /input/i, 0);
      expect(
        screen.queryByText(props.errorText.required as string)
      ).not.toBeInTheDocument();
    });

    test("required & invalid", () => {
      props.errors.required = true;
      props.errorText.required = "The 'First Name' field is required.";
      props.required = true;
      props.value = "";

      render(<ProfileField {...props} />);

      const element = getElement<HTMLInputElement>(props.labelText);

      runTests<HTMLInputElement>(element, props, /input/i, 1);
      expect(
        screen.getByText(props.errorText.required as string)
      ).toBeInTheDocument();
    });

    test("pattern & valid", () => {
      props.errorText.pattern =
        "The 'First Name' field must follow the pattern WWWWWWWWW.";
      props.pattern = /^TED$/i;

      render(<ProfileField {...props} />);

      const element = getElement<HTMLInputElement>(props.labelText);

      runTests<HTMLInputElement>(element, props, /input/i, 0);
      expect(
        screen.queryByText(props.errorText.pattern as string)
      ).not.toBeInTheDocument();
    });

    test("pattern & invalid", () => {
      props.errorText.pattern =
        "The 'First Name' field must follow the pattern WWWWWWWWW.";
      props.errors.pattern = true;
      props.pattern = /^Coach$/i;

      render(<ProfileField {...props} />);

      const element = getElement<HTMLInputElement>(props.labelText);

      runTests<HTMLInputElement>(element, props, /input/i, 1);
      expect(
        screen.getByText(props.errorText.pattern as string)
      ).toBeInTheDocument();
    });

    test("onChange", async () => {
      render(<ProfileField {...props} />);

      const element = getElement<HTMLInputElement>(props.labelText);

      expect(props.onChange).not.toHaveBeenCalled();

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await userEvent.type(element, "Hello");
      });

      expect((props.onChange as jest.Mock).mock.calls.length).toBe(5);
    });
  });

  describe("<textarea></textarea>", () => {
    beforeEach(() => {
      props = {
        errors: {},
        errorText: {},
        fieldName: "note",
        labelText: "Notes",
        maxLength: 999,
        onChange: jest.fn(),
        type: "textarea",
        value: "Lorem ipsum dolor sit amet.",
      } as ProfileFieldProps;
    });

    test("no errors", () => {
      render(<ProfileField {...props} />);

      const element = getElement<HTMLTextAreaElement>(props.labelText);

      runTests<HTMLTextAreaElement>(element, props, /textarea/i, 0);
    });
  });

  describe("<select></select>", () => {
    beforeEach(() => {
      props = {
        errors: {},
        errorText: {},
        fieldName: "answer",
        labelText: "Answer",
        onChange: jest.fn(),
        selectOptions: [
          ["yes", "Yupper"],
          ["no", "Nope"],
        ],
        type: "select-one",
        value: "yes",
      } as ProfileFieldProps;
    });

    test("no errors", () => {
      render(<ProfileField {...props} />);

      const element = getElement<HTMLTextAreaElement>(props.labelText);

      runTests<HTMLTextAreaElement>(element, props, /select/i, 0);
    });
  });
});
