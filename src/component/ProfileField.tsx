type Errors = "pattern" | "required";

type EditableInputTypes =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

interface ProfileFieldProps {
  disabled?: boolean;
  errors: { [key in Errors]?: boolean };
  errorText: { [key in Errors]?: string };
  fieldName: string;
  labelText: string;
  maxLength?: number;
  onChange?: (event: React.SyntheticEvent<EditableInputTypes, Event>) => void;
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
        const commonProps = {
          ...(props.disabled ? { disabled: true } : {}),
          id: props.fieldName,
          ...(props.maxLength ? { maxLength: props.maxLength } : {}),
          name: props.fieldName,
          ...(props.pattern
            ? { pattern: props.pattern?.toString().slice(1, -1) }
            : {}),
          ...(props.required ? { required: true } : {}),
          value: props.value,
        };

        switch (props.type) {
          case "textarea":
            return (
              <textarea
                {...commonProps}
                onChange={
                  props.onChange as React.ChangeEventHandler<HTMLTextAreaElement>
                }
              ></textarea>
            );
          case "select-one": // intentional fallthrough
          case "select":
            return (
              <select
                {...commonProps}
                onChange={
                  props.onChange as React.ChangeEventHandler<HTMLSelectElement>
                }
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
          default: // input
            return (
              <input
                {...commonProps}
                onChange={
                  props.onChange as React.ChangeEventHandler<HTMLInputElement>
                }
                type={props.type}
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
