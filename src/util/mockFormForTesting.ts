type TestingObjects = [React.SyntheticEvent<HTMLFormElement>, HTMLInputElement];

function createElement(type: string, name: string, value = "") {
  const el = document.createElement(type);

  el.setAttribute("name", name);

  return el;
}

/**
 * @name mockFormForTesting
 *
 * @desscription
 * Create an HTML form element with an input element included for use in dependency injection.
 *
 * @example
 * const [event, input] = mockFormForTesting();
 */
function mockFormForTesting(): TestingObjects {
  const form = createElement("form", "profile") as HTMLFormElement;
  const event = {
    currentTarget: form,
    preventDefault: jest.fn(),
  } as unknown as React.SyntheticEvent<HTMLFormElement>;
  const input = createElement("input", "repId") as HTMLInputElement;

  form.appendChild(input);

  return [event, input];
}

export { mockFormForTesting };
