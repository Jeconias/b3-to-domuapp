import { MouseEvent, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Comp } from '../core/types';
import { SideStyle } from './styles/common';
import { FileRejection, useDropzone } from 'react-dropzone';
import { read, WorkBook } from 'xlsx';
import { lighten } from 'polished';

const DOMUAPP_MODEL_FILE_NAME = 'modelo-importacao.xlsx';
const MODEL_FILE = `https://raw.githubusercontent.com/jeconias/b3-to-domuapp/main/public/domuapp/${DOMUAPP_MODEL_FILE_NAME}`;

const ACCEPT = {
  application: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
};

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

type DomuappProps = {
  file?: File;
  fileLoaded?: boolean;
  onNewFile?(wb: WorkBook, file: File): void;
};

const DomuappComp = ({ className, file, onNewFile }: Comp<DomuappProps>) => {
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
          const wb = read(event.target?.result, { type: 'buffer' });
          onNewFile(wb, acceptedFile!);
        };

        reader.readAsArrayBuffer(acceptedFile!);
      }
    },
    [onNewFile]
  );

  const handleDefaultModel = useCallback(
    async (event: MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      const file = await (await fetch(MODEL_FILE)).arrayBuffer();
      const wb = read(file);
      if (onNewFile)
        onNewFile(wb, {
          name: DOMUAPP_MODEL_FILE_NAME,
        } as File);
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
      <h2>Domuapp</h2>
      <div>
        <p>
          {file?.name ??
            'Clique para selecionar ou solte seu arquivo .xlsx aqui'}
        </p>
        <p className='domuapp-xlsx-model'>
          <span
            className='domuapp-select-default-model'
            onClick={handleDefaultModel}
          >
            Clique aqui
          </span>{' '}
          para utilizar{' '}
          <a
            href={MODEL_FILE}
            target='_blank'
            rel='noreferrer'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            esse modelo
          </a>{' '}
          extraído do Domuapp.
        </p>
      </div>
    </section>
  );
};

const Domuapp = styled(DomuappComp)(
  ({ theme, fileLoaded }) => css`
    ${SideStyle};
    display: flex;
    flex-direction: column;
    background-color: ${lighten(0.2, theme.colors.black)};
    cursor: pointer;

    ${fileLoaded &&
    css`
      background-color: ${theme.domuapp.color.primary};
    `}

    div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      p {
        color: ${theme.text.white};
        text-align: center;
        margin: ${theme.spacing.xs};
      }
    }

    .domuapp-xlsx-model {
      margin-top: ${theme.spacing.sm};
      font-size: 0.7rem;

      .domuapp-select-default-model,
      a {
        font-weight: 700;
        color: ${theme.b3.color.primary};
        text-transform: uppercase;
      }
    }
  `
);

export default Domuapp;
