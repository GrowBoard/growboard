export type ErrorTextProps = {
  styleClass?: string;
  children: React.ReactNode;
};

export enum InputType {
  EMAIL = 'email',
  PASSWORD = 'password',
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  FILE = 'file',
}

/**
 * The input text props.
 */
export type InputTextProps = {
  labelTitle: string;
  labelStyle?: string;
  type?: InputType;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue: (args: { updateType: string; value: string }) => void;
  updateType: string;
  errorState?: boolean;
};
