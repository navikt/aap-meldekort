import { TextField } from '@navikt/ds-react';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

export interface TextFieldProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  label?: string;
  hideLabel?: boolean;
  control: Control<FormFieldValues>;
  rules?: RegisterOptions<FormFieldValues>;
  className?: string;
}

export const TextFieldWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  rules,
  className,
}: TextFieldProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { name, value, onChange } }) => (
      <TextField
        id={name}
        name={name}
        size={'medium'}
        label={label}
        type={'text'}
        hideLabel={true}
        value={value || ''}
        onChange={onChange}
        className={className}
        autoComplete={'on'}
      />
    )}
  />
);
