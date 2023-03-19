import { Profile } from "../type/Profile";
import { clientFactory } from "./naiveSDK";

/**
 * @name
 * formSubmitFactory
 *
 * @description
 * Handle all of the coordination of API requests for a form submission.
 *
 * @returns
 * Event handler function for the ProfileFillView (form)
 */
function formSubmitFactory(
  client: ReturnType<typeof clientFactory>,
  update: Function
) {
  return (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form: HTMLFormElement = event.currentTarget;
    const { repId: field } = form.elements as unknown as {
      repId: HTMLInputElement;
    };

    // FormData ignores `disabled` fields; enable the input for data collection
    field.removeAttribute("disabled");
    const { repId, ...data } = Object.fromEntries(new FormData(form));
    field.setAttribute("disabled", "true");

    const requestData = {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    const request = repId
      ? client.PUT<Profile>(`/profile/${repId}`, requestData)
      : client.POST<Profile>(`/profile`, requestData);

    return request.then(() => {
      update();
    });
  };
}

export { formSubmitFactory };
