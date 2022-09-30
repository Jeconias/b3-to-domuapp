import { lighten } from 'polished';
import styled, { css } from 'styled-components';
import { Comp } from '../core/types';

type BaseModalProps = {
  title: string;
  from: 'left' | 'right' | 'bottom';
  isOpen?: boolean;
  onClose?(): void;
};

const BaseModalComp = ({
  title,
  className,
  children,
  onClose,
}: Comp<BaseModalProps>) => {
  return (
    <section className={className}>
      <header className='header'>
        <button onClick={onClose}>Fechar</button>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
};

const BaseModel = styled(BaseModalComp)(
  ({ theme, isOpen, from }) => css`
    position: absolute;
    right: 0;
    width: calc(100% - 24px);
    height: calc(100vh - 16px);
    background: ${theme.colors.black};
    z-index: 10;
    padding: ${theme.spacing.md};
    transition: transform 0.5s;
    overflow-x: scroll;

    ${from === 'right' &&
    css`
      transform: translateX(100%);

      ${isOpen &&
      css`
        transform: translateX(0%);
      `}
    `}

    ${from === 'left' &&
    css`
      transform: translateX(-100%);

      ${isOpen &&
      css`
        transform: translateX(0%);
      `}
    `}
    
    ${from === 'bottom' &&
    css`
      transform: translateY(100%);

      ${isOpen &&
      css`
        transform: translateX(0%);
      `}
    `}

    .header {
      display: flex;
      justify-content: space-between;
      padding-bottom: ${theme.spacing.md};
      border-bottom: 2px solid ${lighten(0.2, theme.colors.black)};

      button {
        background-color: transparent;
        color: ${theme.text.white};
        border: none;
        border-radius: 3px;
        padding: ${theme.spacing.sm};
        margin: 0 ${theme.spacing.sm};
        cursor: pointer;

        transition: background-color 0.3s;

        :hover {
          background-color: ${lighten(0.2, theme.colors.black)};
        }
      }

      h2 {
        color: ${theme.text.white};
        margin: 0;
        font-size: 1.3rem;
        text-align: center;
      }
    }
  `
);

export default BaseModel;
