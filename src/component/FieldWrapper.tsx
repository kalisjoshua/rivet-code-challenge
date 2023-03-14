type FieldWrapperProps = {
  children: Array<JSX.Element>;
  error?: boolean;
  field?: string;
};

const FieldWrapper = ({ children, error, field }: FieldWrapperProps) => (
  <div className="formField" data-error={error} data-field={field}>
    {children}
  </div>
);

export { FieldWrapper };
