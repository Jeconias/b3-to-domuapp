import { MouseEvent, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Comp } from '../core/types';
import { SideStyle } from './styles/common';
import { FileRejection, useDropzone } from 'react-dropzone';
import { read, WorkBook } from 'xlsx';
import { lighten } from 'polished';
import { stopPropagation } from '../core/helpers';

const ACCEPT = { text: ['text/csv'] };

const isValidFile = (type: string) => {
  for (const key of Object.keys(ACCEPT)) {
    const acceptKey = key as keyof typeof ACCEPT;

    for (const value of ACCEPT[acceptKey]) {
      if (value.includes(type)) {
        return true;
      }
    }
  }

  return false;
};

type B3Props = {
  file?: File;
  fileLoaded?: boolean;
  clue?(event: MouseEvent<HTMLParagraphElement>): void;
  onNewFile?(wb: WorkBook, file: File): void;
};

const B3Comp = ({ className, file, onNewFile, clue }: Comp<B3Props>) => {
  const onDropFile = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // const rejected = [
      //   ...fileRejections,
      //   ...acceptedFiles.filter((f) => !isValidFile(f.type)),
      // ];
      const accepted = acceptedFiles.filter((f) => isValidFile(f.type));
      const acceptedFile = accepted.pop();

      if (onNewFile) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const wb = read(event.target?.result, {
            type: 'string',
            raw: true,
          });
          onNewFile(wb, acceptedFile!);
        };

        reader.readAsText(acceptedFile!);
      }
    },
    [onNewFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: ACCEPT,
    onDrop: onDropFile,
  });

  return (
    <section {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      <h2>
        <a
          href='https://www.investidor.b3.com.br'
          target='_blank'
          rel='noreferrer'
          onClick={stopPropagation}
        >
          B3
        </a>
      </h2>
      <div>
        <p>
          {file?.name ??
            'Clique para selecionar ou solte seu arquivo .csv aqui'}
        </p>
        <p className='clue' onClick={clue}>
          Como exportar o meu histórico de movimentações da B3?
        </p>
      </div>
    </section>
  );
};

const B3 = styled(B3Comp)(
  ({ theme, fileLoaded }) => css`
    ${SideStyle};
    display: flex;
    flex-direction: column;
    background-color: ${lighten(0.1, theme.colors.black)};
    cursor: pointer;

    ${fileLoaded &&
    css`
      background-color: ${theme.b3.color.primary};
    `}
    div {
      flex: 1;
      .clue,
      p {
        color: ${theme.text.white};
        text-align: center;
        margin: ${theme.spacing.xs};
      }

      .clue {
        margin-top: ${theme.spacing.sm};
        font-size: 0.7rem;

        :hover {
          text-decoration: underline;
        }
      }
    }
  `
);

export default B3;
