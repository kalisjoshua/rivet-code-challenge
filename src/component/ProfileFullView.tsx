import { useEffect, useReducer, useRef, useState } from "react";

import { ProfileField } from "./ProfileField";
import { Profile } from "../type/Profile";
import { updateReducer, UpdatePayload } from "../util/profileEdit";
import { formSubmitFactory } from "../util/profileSubmit";
import { states, statesCleanValue } from "../util/states";

import "./ProfileFullView.css";

type ProfileFullViewProps = {
  formSubmit: ReturnType<typeof formSubmitFactory>;
  rep: Profile;
};

/**
 * @name MAX_NOTES_SIZE
 *
 * @description
 * Javascript uses UTF-16 for string encoding
 * but isn't always consistent with the code unit sizing
 * we will use 16 as the code unit size
 * we will be conservative on the limit till there is a need to explore beyond it
 *
 *   * __V8 (Chrome, Node, Edge, and others)__
 *       - (2**29 - 24) for 64 bit systems = ~1GiB
 *       - (2**28 - 16) for 32 bit systems = ~512MiB
 *   * __Firefox__
 *       - (2**30 - 2) for versions after 64 = ~2GiB
 *       - (2**28 - 1) for versions before 65 = ~512MiB
 *   * __Safari__
 *       - (2**31 - 1) = ~4GiB
 *
 * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
 */
const MAX_NOTES_SIZE = Math.floor((2 ** 28 - 16) / 16);

type FormInput = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function formIsValid(form: HTMLFormElement) {
  return Array.from(form.elements).every((el) =>
    (el as FormInput).checkValidity()
  );
}

/**
 * @name ProfileFullView
 *
 * @description
 * Renders an HTML form for editing and creating new entries for employees.
 */
function ProfileFullView({ formSubmit, rep }: ProfileFullViewProps) {
  const formRef = useRef(null);
  const [buttonEnabled, setEnabled] = useState(false);
  const [{ data, errors }, formChanged] = useReducer(updateReducer, {
    data: rep,
  });

  function onChange<T extends UpdatePayload>(event: React.SyntheticEvent<T>) {
    // istanbul ignore else
    if (formRef.current) {
      setEnabled(formIsValid(formRef.current));
      formChanged(event.currentTarget);
    }
  }

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    // istanbul ignore else
    if (formIsValid(event.currentTarget)) {
      formSubmit(event)
        // on success of submitting the form disable the submit button
        // untill more edits are made
        .then(() => setEnabled(false));
    }
  };

  useEffect(() => {
    // not the solution I was hoping for
    // TODO: figure this problem out and remove the hack workaround
    if (data.id !== rep.id) {
      formChanged({ name: "", override: rep, value: "" });
    }
  });

  // noValidate
  return (
    <form
      className="ProfileFullView"
      name="ProfileFullView"
      onSubmit={onSubmit}
      ref={formRef}
    >
      <ProfileField /* id */
        {...{
          disabled: true,
          errors: {},
          errorText: {},
          fieldName: "repId",
          labelText: "ID",
          type: "text",
          value: /^new$/.test(data.id || "") ? "" : data.id,
        }}
      />

      <ProfileField /* first_name */
        {...{
          errors: errors?.first_name || {},
          errorText: {
            required: "The 'First Name' field is required.",
          },
          fieldName: "first_name",
          labelText: "First Name",
          maxLength: 255,
          onChange,
          required: true,
          type: "text",
          value: data.first_name,
        }}
      />

      <ProfileField /* last_name */
        {...{
          errors: errors?.last_name || {},
          errorText: {
            required: "The 'Last Name' field is required.",
          },
          fieldName: "last_name",
          labelText: "Last Name",
          maxLength: 255,
          onChange,
          required: true,
          type: "text",
          value: data.last_name,
        }}
      />

      <ProfileField /* phone */
        {...{
          errors: errors?.phone || {},
          errorText: {
            pattern: `The "Phone" number should be formatted as "##########" or "###-###-####".`,
            required: "The 'Phone' field is required.",
          },
          fieldName: "phone",
          labelText: "Phone",
          maxLength: 30,
          onChange,
          pattern: /^(?:(?:\d{10,20})|(?:\d{3}-\d{3}-\d{4}))\d*$/,
          required: true,
          type: "phone",
          value: data.phone,
        }}
      />

      <ProfileField /* email */
        {...{
          errors: errors?.email || {},
          errorText: {
            pattern: `The "Email" should be formatted simlar to "email_address@domain.tld".`,
            required: "The 'Email' field is required.",
          },
          fieldName: "email",
          labelText: "Email",
          maxLength: 255,
          onChange,
          pattern: /^.+?@.+?$/,
          required: true,
          type: "email",
          value: data.email,
        }}
      />

      <ProfileField /* address */
        {...{
          errors: errors?.address || {},
          errorText: {
            required: "The 'Street Address' field is required.",
          },
          fieldName: "address",
          labelText: "Street Address",
          maxLength: 255,
          onChange,
          required: true,
          type: "text",
          value: data.address,
        }}
      />

      <div className="combined">
        <ProfileField /* city */
          {...{
            errors: errors?.city || {},
            errorText: {
              required: "The 'City' field is required.",
            },
            fieldName: "city",
            labelText: "City",
            maxLength: 255,
            onChange,
            required: true,
            type: "text",
            value: data.city,
          }}
        />

        <ProfileField /* state */
          {...{
            errors: errors?.state || {},
            errorText: {
              required: "The 'State' field is required.",
            },
            fieldName: "state",
            labelText: "State",
            onChange,
            required: true,
            selectOptions: states.map(([abbr, full]) => [
              abbr.toUpperCase(),
              full,
            ]),
            type: "select",
            value: statesCleanValue(data.state || ""),
          }}
        />

        <ProfileField /* zip */
          {...{
            errors: errors?.zip || {},
            errorText: {
              pattern: `The "Zip (Postal code)" field must formatted as "#####" or "#####-####".`,
              required: "The 'Zip' (Postal Code) field is required.",
            },
            fieldName: "zip",
            labelText: "Zip",
            maxLength: 255,
            onChange,
            pattern: /^\d{5}(?:-?\d{4})?$/,
            required: true,
            type: "phone",
            value: data.zip,
          }}
        />
      </div>

      <ProfileField /* photo */
        {...{
          errors: errors?.photo || {},
          errorText: {
            pattern: `The "Photo" needs to be a valid URL or be left empty.`,
          },
          fieldName: "photo",
          labelText: "Photo",
          maxLength: 255,
          onChange,
          type: "url",
          value: data.photo || "",
        }}
      />

      <ProfileField /* notes */
        {...{
          errors: errors?.notes || {},
          errorText: {},
          fieldName: "notes",
          labelText: "Notes",
          maxLength: MAX_NOTES_SIZE,
          onChange,
          type: "textarea",
          value: data.notes || "",
        }}
      />

      <button {...(!buttonEnabled ? { disabled: true } : {})} type="submit">
        {data.id !== "new" ? "Save" : "Create"}
      </button>
    </form>
  );
}

export { ProfileFullView };
