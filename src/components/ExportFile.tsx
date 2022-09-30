import { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { WorkBook, utils, writeFileXLSX } from 'xlsx';
import { COLUMN_MAPPER } from '../core/constants';
import {
  B3,
  B3Column,
  B3TransactionType,
  Comp,
  DomuApp,
  DomuAppColumn,
  DomuappTransactionType,
} from '../core/types';
import { CustomFile } from '../pages/Home';
import BaseModel from './BaseModal';
import { FormProvider, useForm } from 'react-hook-form';
import { lighten } from 'polished';
import DeParaValue from './DeParaValue';

type ExportFileProps = {
  b3: CustomFile | undefined;
  domuapp: CustomFile | undefined;
  onClose?(): void;
};

const getColumnsFromFile = (wb: WorkBook | undefined) => {
  const output: string[] = [];

  if (!wb) return output;

  const sheets = Object.keys(wb.Sheets);

  sheets.forEach((sheet) => {
    const s = wb.Sheets[sheet];

    Object.keys(s).forEach((column) => {
      const isValidHeader = /^[A-Z]1$/g.test(column);
      const value = s[column].v;
      if (isValidHeader && value && !output.includes(value)) {
        output.push(value);
      }
    });
  });

  return output;
};

const removeParentheses = (str: string | undefined) => {
  if (typeof str !== 'string') return str;
  return str.replace(/ *\([^)]*\) */g, '');
};

const applyTransformers = function <T extends { [s: string]: string | number }>(
  data: T,
  formData: { [s: string]: string | undefined }
): T {
  if (typeof data !== 'object' || Array.isArray(data)) return data;

  const output: { [s: string]: string | number } = {};

  Object.keys(data).forEach((k) => {
    switch (k) {
      case DomuAppColumn.Ticker:
        const ticker = data[k].toString();
        if (ticker.endsWith('F')) {
          output[k] = ticker.slice(0, ticker.length - 1);
        } else {
          output[k] = ticker;
        }

        return;
      case DomuAppColumn[
        'Corretora (Utilizar mesmo nome utilizado na plataforma)'
      ]:
        const removeFalsy = (data: string[]) => data.filter((d) => !!d);

        const de = removeFalsy(formData?.de_corretora?.split(',') ?? []);
        const para = removeFalsy(formData?.para_corretora?.split(',') ?? []);
        const broker = data[k].toString()?.trim();

        if (de.length === 0 || para.length === 0 || de.length !== para.length) {
          output[k] = broker;
        } else {
          const findIndex = de.findIndex(
            (b) => b.toLowerCase() === broker.toLowerCase()
          );

          if (findIndex !== undefined && findIndex !== -1) {
            output[k] = para[findIndex].toLowerCase();
          } else {
            output[k] = broker.toLowerCase();
          }
        }

        return;

      case DomuAppColumn['Tipo da Transação']:
        const b3TransactionType = data[k].toString().toLowerCase();
        if (b3TransactionType === B3TransactionType.COMPRA) {
          output[k] = DomuappTransactionType.APORTE.toUpperCase();
        } else if (b3TransactionType === B3TransactionType.VENDA) {
          output[k] = DomuappTransactionType.RETIRADA.toUpperCase();
        } else {
          output[k] = data[k];
        }
        return;
      case DomuAppColumn['Preço Unitário']:
        output[k] = data[k]
          .toString()
          .trim()
          .replace(/[R$\s]/g, '');

        return;
      default:
        output[k] = data[k].toString().trim();
    }
  });

  output['Taxas'] = 0;

  return output as T;
};

const ExportFile = ({ b3, domuapp, onClose }: Comp<ExportFileProps>) => {
  const [deParaValue, setDeParaValue] = useState<'corretora'>();
  const { register, handleSubmit, ...methods } = useForm({});

  const domuappColumns = getColumnsFromFile(domuapp?.wb);
  const b3Columns = getColumnsFromFile(b3?.wb);

  const isLoaded = useMemo(() => !!(b3?.wb && domuapp?.wb), [b3, domuapp]);

  const handleExportFile = (data: { [s: string]: string | undefined }) => {
    const mappedKeys = Object.keys(data);

    const removeUnnecessaryFields = (item: DomuApp): DomuApp => {
      Object.keys(item).forEach((k) => {
        if (!domuappColumns.includes(k)) {
          delete (item as any)[k];
        }
      });

      return item;
    };

    Object.keys(b3!.wb.Sheets).forEach((sheet) => {
      const b3JSON = utils.sheet_to_json<B3>(b3!.wb.Sheets[sheet]);

      const domuappJSON = b3JSON.reduce((acc: DomuApp[], curr): DomuApp[] => {
        let item = JSON.stringify(curr);

        mappedKeys.forEach((key) => {
          if (data[key]) {
            item = item.replace(key, data[key]!);
          }
        });

        const domuItem = applyTransformers(JSON.parse(item) as DomuApp, data);

        return [...acc, removeUnnecessaryFields(domuItem)];
      }, []);

      const book = utils.book_new();
      utils.book_append_sheet(
        book,
        utils.json_to_sheet(domuappJSON, { header: domuappColumns })
      );

      writeFileXLSX(
        book,
        `${b3?.file.name.slice(
          0,
          b3?.file.name.indexOf('.')
        )}_b3-to-domuapp.xlsx`
      );
    });
  };

  const brokersMemorized = useMemo(() => {
    const output: string[] = [];
    Object.keys(b3?.wb.Sheets ?? {}).forEach((s) => {
      const sheets = b3?.wb.Sheets!;
      const columns = Object.keys(sheets[s]);

      const findBrokerColumn = columns.find(
        (c) => sheets[s][c].v === B3Column['Instituição']
      );

      if (!findBrokerColumn) return;

      const findBrokerColumnWithoutNumber = findBrokerColumn.replace(
        /[0-9]/g,
        ''
      );

      columns.forEach((column) => {
        const columnValue = sheets[s][column].v;
        if (
          column.startsWith(findBrokerColumnWithoutNumber) &&
          columnValue !== B3Column['Instituição'] &&
          !output.includes(columnValue)
        ) {
          // Broker Column
          output.push(columnValue);
        }
      });
    });

    return output.join(',');
  }, [b3]);

  const handleOnClose = useCallback(() => {
    setDeParaValue(undefined);
    if (onClose) onClose();
  }, [onClose]);

  return (
    <BaseModel
      isOpen={isLoaded}
      title='Configurações'
      from='bottom'
      onClose={handleOnClose}
    >
      <Wrapper>
        <div className='depara depara-sheet'>
          <h3>De {'>'} Para</h3>
          <form onSubmit={handleSubmit(handleExportFile)}>
            {new Array(isLoaded ? b3Columns.length : 0)
              .fill(null)
              .map((_, k) => {
                const domuColumn = COLUMN_MAPPER[b3Columns[k]];
                const isValidDomuColumn =
                  domuappColumns.includes(domuColumn) &&
                  !domuColumn?.startsWith('_');

                return (
                  <div key={k} className='form-row'>
                    <label>
                      De
                      <select defaultValue={b3Columns[k]} disabled>
                        {b3Columns.map((c) => (
                          <option key={`${c}-${k}`} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Para
                      <select
                        {...(domuColumn ? register(b3Columns[k]) : {})}
                        disabled={!isValidDomuColumn}
                        defaultValue={isValidDomuColumn ? domuColumn : ''}
                      >
                        <option value=''>Ignorado</option>
                        {domuappColumns.map((c) => (
                          <option key={`${c}-${k}`} value={c}>
                            {removeParentheses(c)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <span
                      className={`more ${
                        b3Columns[k] !== B3Column['Instituição']
                          ? 'no-event'
                          : ''
                      }`}
                      onClick={() => {
                        setDeParaValue((prev) =>
                          prev ? undefined : 'corretora'
                        );
                      }}
                    >
                      {b3Columns[k] === B3Column['Instituição'] ? '+' : ''}
                    </span>
                  </div>
                );
              })}
            <div className='button-wrapper'>
              <button type='submit'>Baixar arquivo</button>
            </div>
          </form>
        </div>
        <div className='depara'>
          <FormProvider
            {...methods}
            handleSubmit={handleSubmit}
            register={register}
          >
            {deParaValue && (
              <>
                <h3>De {'>'} Para | Value</h3>{' '}
                <DeParaValue name={deParaValue} deInitial={brokersMemorized} />
              </>
            )}
          </FormProvider>
        </div>
      </Wrapper>
    </BaseModel>
  );
};

const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;

    & > div {
      flex: 1;
    }

    .depara {
      color: ${theme.text.white};

      h3 {
        text-align: center;
        font-size: 1.1rem;
      }
    }

    .depara-sheet {
      form {
        padding: 0;
        margin: 0;
      }

      .form-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .more {
          flex: 1;
          padding: ${theme.spacing.xs};
          border-radius: 3px;
          text-align: center;
          cursor: pointer;

          transition: background-color 0.3s;

          &.no-event {
            pointer-events: none;
          }

          :hover {
            background-color: ${lighten(0.1, theme.colors.black)};
          }
        }

        label {
          flex: 12;
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
          margin: 0 ${theme.spacing.md} ${theme.spacing.md};

          select {
            margin-top: ${theme.spacing.xs};
            padding: ${theme.spacing.xs};

            :disabled {
              opacity: 0.7;
              color: black;
            }
          }
        }
      }

      .button-wrapper {
        display: flex;
        justify-content: flex-end;
        padding: ${theme.spacing.md};

        button {
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          border-radius: 3px;
          border: none;
          cursor: pointer;

          transition: color, background-color 0.3s;

          :hover {
            color: ${theme.text.white};
            background-color: ${lighten(0.1, theme.colors.black)};
          }
        }
      }
    }
  `
);

export default ExportFile;
