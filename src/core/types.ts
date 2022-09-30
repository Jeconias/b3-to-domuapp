import React from 'react';

export type Comp<T = {}> = T & {
  children?:
    | React.ReactElement
    | React.ReactElement[]
    | null
    | undefined
    | string;
  className?: string;
};

export enum DomuappTransactionType {
  'APORTE' = 'aporte',
  'RETIRADA' = 'retirada',
}

export enum DomuAppColumn {
  'Ticker' = 'Ticker',
  'Data (DD/MM/YYYY)' = 'Data (DD/MM/YYYY)',
  'Tipo da Transação' = 'Tipo da Transação',
  'Quantidade' = 'Quantidade',
  'Preço Unitário' = 'Preço Unitário',
  'Taxas' = 'Taxas',
  'Corretora (Utilizar mesmo nome utilizado na plataforma)' = 'Corretora (Utilizar mesmo nome utilizado na plataforma)',
}

export enum B3TransactionType {
  'COMPRA' = 'compra',
  'VENDA' = 'venda',
}

export enum B3Column {
  'Código de Negociação' = 'Código de Negociação',
  'Data do Negócio' = 'Data do Negócio',
  'Tipo de Movimentação' = 'Tipo de Movimentação',
  'Quantidade' = 'Quantidade',
  'Preço (unidade)' = 'Preço (unidade)',
  'Mercado' = 'Mercado',
  'Instituição' = 'Instituição',
  'Prazo/Vencimento' = 'Prazo/Vencimento',
}

export type B3 = { [k in B3Column]: string | number };

export type DomuApp = { [k in DomuAppColumn]: string | number };
