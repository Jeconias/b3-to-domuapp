import { B3Column, DomuAppColumn } from './types';

const DOMUAPP_COLUMNS: DomuAppColumn[] = [
  DomuAppColumn.Ticker,
  DomuAppColumn['Data (DD/MM/YYYY)'],
  DomuAppColumn['Tipo da Transação'],
  DomuAppColumn.Quantidade,
  DomuAppColumn['Preço Unitário'],
  DomuAppColumn.Taxas,
  DomuAppColumn['Corretora (Utilizar mesmo nome utilizado na plataforma)'],
];

const B3_COLUMNS: B3Column[] = [
  B3Column['Código de Negociação'],
  B3Column['Data do Negócio'],
  B3Column['Tipo de Movimentação'],
  B3Column.Quantidade,
  B3Column['Preço (unidade)'],
  B3Column.Mercado,
  B3Column['Instituição'],
  B3Column['Prazo/Vencimento'],
];

export const COLUMN_MAPPER = {
  [B3_COLUMNS[0]]: DOMUAPP_COLUMNS[0],
  [B3_COLUMNS[1]]: DOMUAPP_COLUMNS[1],
  [B3_COLUMNS[2]]: DOMUAPP_COLUMNS[2],
  [B3_COLUMNS[3]]: DOMUAPP_COLUMNS[3],
  [B3_COLUMNS[4]]: DOMUAPP_COLUMNS[4],
  __NOT_MAPPED_TAXAS: DOMUAPP_COLUMNS[5],
  [B3_COLUMNS[6]]: DOMUAPP_COLUMNS[6],
  [B3_COLUMNS[7]]: '__NOT_EXISTS_ON_DOMUAPP',
};
