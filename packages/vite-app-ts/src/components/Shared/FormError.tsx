import { FC } from 'react';
import { errorColor } from '~~/styles/styles';

const FormError: FC<{ text: string }> = (props) => {
  return <span style={{ color: errorColor }}>{props.text}</span>;
};

export default FormError;
