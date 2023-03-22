type Errors = "pattern" | "required";

type EditableInputTypes =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

interface ProfileFieldProps {
  errors: { [key in Errors]?: boolean };
  errorText: { [key in Errors]?: string };
  fieldName: string;
  labelText: string;
  maxLength?: number;
  onChange: React.ChangeEventHandler<EditableInputTypes>;
  selectOptions?: Array<[string, string]>;
  pattern?: RegExp;
  required?: boolean;
  type:
    | "email"
    | "password"
    | "phone"
    | "select"
    | "select-one"
    | "text"
    | "textarea"
    | "url";
  value?: string;
}

function ProfileField(props: ProfileFieldProps) {
  const errors = Object.values(props.errors).reduce((a, b) => a || !!b, false);

  return (
    <div className="formField" data-error={errors} data-field={props.fieldName}>
      <label htmlFor={props.fieldName}>{props.labelText}</label>
      {(function () {
        switch (props.type) {
          case "textarea":
            return (
              <textarea
                id={props.fieldName}
                maxLength={props.maxLength}
                name={props.fieldName}
                onChange={props.onChange}
                value={props.value}
              ></textarea>
            );
          case "select-one": // intentional fallthrough
          case "select":
            return (
              <select
                id={props.fieldName}
                name={props.fieldName}
                onChange={props.onChange}
                required
                value={props.value}
              >
                <option value="">Pick one</option>
                {(props.selectOptions as Array<[string, string]>).map(
                  ([abbr, full]) => (
                    <option key={full} value={abbr}>
                      {full}
                    </option>
                  )
                )}
              </select>
            );
          default:
            return (
              <input
                id={props.fieldName}
                maxLength={props.maxLength}
                name={props.fieldName}
                onChange={props.onChange}
                pattern={props.pattern?.toString() || ""}
                required
                type={props.type}
                value={props.value}
              />
            );
        }
      })()}
      {(Object.keys(props.errorText) as Array<Errors>)
        .filter((key) => !!props.errors[key])
        .map((key) => (
          <p
            className="formField--error"
            key={`${props.fieldName}-${key}`}
            role="status"
          >
            {props.errorText[key]}
          </p>
        ))}
    </div>
  );
}

export type { EditableInputTypes, ProfileFieldProps };
export { ProfileField };
