import { OrderDefinition } from './query-types';

/**
 * Parses orderByKey back to OrderDefinition
 * @param key generated by PostgrestParser
 * @returns The parsed OrderDefinition
 */
export const parseOrderByKey = (v: string): OrderDefinition[] => {
  return v.split('|').map((orderBy) => {
    const [tableDef, orderDef] = orderBy.split(':');
    const [foreignTableOrCol, maybeCol] = tableDef.split('.');
    const [dir, nulls] = orderDef.split('.');
    return {
      ascending: dir === 'asc',
      nullsFirst: nulls === 'nullsFirst',
      foreignTable: maybeCol ? foreignTableOrCol : undefined,
      column: maybeCol ? maybeCol : foreignTableOrCol,
    };
  });
};
