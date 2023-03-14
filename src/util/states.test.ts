import { statesCleanValue } from "./states";

test("statesCleanValue", () => {
  expect(statesCleanValue("MI")).toBe("MI");
  expect(statesCleanValue("Mi")).toBe("MI");
  expect(statesCleanValue("Michigan")).toBe("MI");

  expect(statesCleanValue("Not found")).toBe("");
});
