import { useEffect, useReducer, useRef, useState } from "react";

import { FieldWrapper } from "./FieldWrapper";
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
 * # Max Notes Size
 * ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
 *
 * Javascript uses UTF-16 for string encoding
 * but isn't always consistent with the code unit sizing
 * we will use 16 as the code unit size
 * we will be conservative on the limit till there is a need to explore beyond it
 *
 * ## V8 (Chrome, Node, Edge, and others)
 * (2**29 - 24) for 64 bit systems = ~1GiB
 * (2**28 - 16) for 32 bit systems = ~512MiB
 *
 * ## Firefox
 * (2**30 - 2) for versions after 64 = ~2GiB
 * (2**28 - 1) for versions before 65 = ~512MiB
 *
 * ## Safari
 * (2**31 - 1) = ~4GiB
 */
const MAX_NOTES_SIZE = Math.floor((2 ** 28 - 16) / 16);

const formIsValid = (form: HTMLFormElement) =>
  Array.from(new FormData(form)).filter(([name]) => !form[name].checkValidity())
    .length === 0;

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
    setEnabled(formIsValid(formRef.current as unknown as HTMLFormElement));
    formChanged(event.currentTarget);
  }

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
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
      <FieldWrapper field="repId">
        <label htmlFor="repId">ID</label>
        <input
          id="repId"
          name="repId"
          onChange={onChange<HTMLInputElement>}
          disabled={true}
          title="Not editable"
          type="text"
          value={/^new$/.test(data.id || "") ? "" : data.id}
        />
      </FieldWrapper>

      <FieldWrapper
        error={errors?.first_name?.pattern || errors?.first_name?.required}
        field="first_name"
      >
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          maxLength={255}
          name="first_name"
          onChange={onChange<HTMLInputElement>}
          required
          type="text"
          value={data.first_name}
        />
        <p className="fieldError" data-visible={errors?.first_name?.required}>
          The "First Name" field is required.
        </p>
      </FieldWrapper>

      <FieldWrapper
        error={errors?.last_name?.pattern || errors?.last_name?.required}
        field="last_name"
      >
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          maxLength={255}
          name="last_name"
          onChange={onChange<HTMLInputElement>}
          required
          type="text"
          value={data.last_name}
        />
        <p className="fieldError" data-visible={errors?.last_name?.required}>
          The "Last Name" field is required.
        </p>
      </FieldWrapper>

      <FieldWrapper
        error={errors?.phone?.pattern || errors?.phone?.required}
        field="phone"
      >
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          maxLength={30}
          name="phone"
          onChange={onChange<HTMLInputElement>}
          pattern="^(?:(?:\d{10,20})|(?:\d{3}-\d{3}-\d{4}))\d*$"
          required
          type="text"
          value={data.phone}
        />
        <p className="fieldError" data-visible={errors?.phone?.required}>
          The "Phone number" field is required.
        </p>
        <p className="fieldError" data-visible={errors?.phone?.pattern}>
          The "Phone number" should be formatted as "##########" or
          "###-###-####".
        </p>
      </FieldWrapper>

      <FieldWrapper
        error={errors?.email?.pattern || errors?.email?.required}
        field="email"
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          maxLength={255}
          name="email"
          onChange={onChange<HTMLInputElement>}
          pattern=".+?@.+?"
          required
          type="email"
          value={data.email}
        />
        <p className="fieldError" data-visible={errors?.email?.required}>
          The "Email" field is required.
        </p>
        <p className="fieldError" data-visible={errors?.email?.pattern}>
          The "Email" should be formatted simlar to "email_address@domain.tld".
        </p>
      </FieldWrapper>

      <FieldWrapper
        error={errors?.address?.pattern || errors?.address?.required}
        field="address"
      >
        <label htmlFor="address">Street Address</label>
        <input
          id="address"
          maxLength={255}
          name="address"
          onChange={onChange<HTMLInputElement>}
          required
          type="text"
          value={data.address}
        />
        <p className="fieldError" data-visible={errors?.address?.required}>
          The "Street Address" field is required.
        </p>
      </FieldWrapper>

      <div className="combined">
        <FieldWrapper
          error={errors?.city?.pattern || errors?.city?.required}
          field="city"
        >
          <label htmlFor="city">City</label>
          <input
            id="city"
            maxLength={255}
            name="city"
            onChange={onChange<HTMLInputElement>}
            required
            type="text"
            value={data.city}
          />
          <p className="fieldError" data-visible={errors?.city?.required}>
            The "City" field is required.
          </p>
        </FieldWrapper>

        <FieldWrapper
          error={errors?.state?.pattern || errors?.state?.required}
          field="state"
        >
          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            onChange={onChange<HTMLSelectElement>}
            required
            value={statesCleanValue(data.state || "")}
          >
            <option value="">Pick one</option>
            {states.map(([abbr, full]) => (
              <option key={full} value={abbr.toUpperCase()}>
                {full}
              </option>
            ))}
          </select>
          <p className="fieldError" data-visible={errors?.state?.required}>
            The "State" field is required.
          </p>
        </FieldWrapper>

        <FieldWrapper
          error={errors?.zip?.pattern || errors?.zip?.required}
          field="zip"
        >
          <label htmlFor="zip">Zip</label>
          <input
            id="zip"
            name="zip"
            onChange={onChange<HTMLInputElement>}
            pattern="^\d{5}(?:-?\d{4})?$"
            required
            type="phone"
            value={data.zip}
          />
          <p className="fieldError" data-visible={errors?.zip?.pattern}>
            The "Zip (Postal code)" field must formatted as "#####" or
            "#####-####".
          </p>
          <p className="fieldError" data-visible={errors?.zip?.required}>
            The "Zip (Postal code)" field is required.
          </p>
        </FieldWrapper>
      </div>

      <FieldWrapper
        error={errors?.photo?.pattern || errors?.photo?.required}
        field="photo"
      >
        <label htmlFor="photo">Photo</label>
        <input
          id="photo"
          maxLength={255}
          name="photo"
          onChange={onChange<HTMLInputElement>}
          pattern="^https?:\/\/.{4,}"
          type="URL"
          value={data.photo || ""}
        />
        <p className="fieldError" data-visible={errors?.photo?.pattern}>
          The "Photo" needs to be a valid URL or be left empty.
        </p>
      </FieldWrapper>

      <FieldWrapper
        error={errors?.notes?.pattern || errors?.notes?.required}
        field="notes"
      >
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          maxLength={MAX_NOTES_SIZE}
          name="notes"
          onChange={onChange<HTMLTextAreaElement>}
          value={data.notes || ""}
        ></textarea>
      </FieldWrapper>

      <button disabled={!buttonEnabled} type="submit">
        {data.id !== "new" ? "Save" : "Create"}
      </button>
    </form>
  );
}

export { ProfileFullView };
