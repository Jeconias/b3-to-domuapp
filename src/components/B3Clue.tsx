import styled, { css } from 'styled-components';
import { Comp } from '../core/types';
import BaseModel from './BaseModal';

type B3ClueProps = {
  isOpen?: boolean;
  onClose?(): void;
};

const B3Clue = ({ isOpen, onClose }: Comp<B3ClueProps>) => {
  return (
    <BaseModel
      isOpen={isOpen}
      from='left'
      title='B3 Movimentações'
      onClose={onClose}
    >
      <ImgWrapper>
        <img
          src='https://raw.githubusercontent.com/Jeconias/b3-to-domuapp/main/public/b3/movimentations-export.gif'
          alt='GIF mostrando o passo a passo de como exportar suas movimentações na B3'
        />
      </ImgWrapper>
    </BaseModel>
  );
};

const ImgWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.md};

    img {
      width: 100%;
      min-height: 200px;
      object-fit: cover;
      object-position: center;
    }
  `
);

export default B3Clue;
