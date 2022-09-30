import { useFormContext } from 'react-hook-form';
import styled, { css } from 'styled-components';
import { Comp } from '../core/types';

type DeParaValueProps = {
  name: 'corretora';
  deInitial?: string;
};

const DeParaValue = ({ name, deInitial }: Comp<DeParaValueProps>) => {
  const { register } = useFormContext();

  return (
    <>
      <Description>
        Sequência de valores para serem substituídos. <br />
        <br />
        Exemplo: <br />
        De: Corretora 1, Corretora 2 <br /> Para: Correta A, Corretora B
        <br />
        <br />A sequência importa e os valores devem ser separados por vírgula.
      </Description>
      <TextareaWrapper>
        <div>
          <label>De</label>
          <textarea
            rows={15}
            {...register(`de_${name}`, { value: deInitial })}
          />
        </div>
        <div>
          <label>Para</label>
          <textarea rows={15} {...register(`para_${name}`)} />
        </div>
      </TextareaWrapper>
    </>
  );
};

const Description = styled.p`
  font-size: 0.8rem;
`;

const TextareaWrapper = styled.div(
  ({ theme }) => css`
    display: flex;

    div {
      flex: 1;
      display: flex;
      flex-direction: column;

      label,
      textarea {
        margin: ${theme.spacing.sm};
      }

      textarea {
        flex: 1;
        resize: none;
      }
    }
  `
);

export default DeParaValue;
