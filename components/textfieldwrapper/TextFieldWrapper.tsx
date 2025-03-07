import { TextField } from '@navikt/ds-react';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

export interface TextFieldProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  id: string;
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
  id,
}: TextFieldProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { name, value, onChange } }) => (
      <TextField
        id={id}
        name={name}
        size={'medium'}
        label={label}
        inputMode={'decimal'}
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
