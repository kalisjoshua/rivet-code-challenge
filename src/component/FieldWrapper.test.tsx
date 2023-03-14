import { render, screen } from "@testing-library/react";

import { FieldWrapper } from "./FieldWrapper";

test("FieldWrapper", () => {
  render(
    <FieldWrapper>
      <p>Hello</p>
      <p>World</p>
    </FieldWrapper>
  );

  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
