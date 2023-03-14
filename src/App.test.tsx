import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders learn react link", () => {
  render(<App repId="1" root="" token="" />);

  expect(screen.getByText("Rivet Rep Roster Review")).toBeInTheDocument();
});
