import { stringifyVariables } from '@urql/core';
import { Resolver } from '@urql/exchange-graphcache';

// https://github.com/benawad/lireddit/blob/master/web/src/utils/createUrqlClient.ts
export const customPagination = (
  seperator?: string
): Resolver<any, any, any> => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    let fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'nodes'
    );

    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    let __typename: string = '';

    // if seperator (eg: roomId), filter fields based on seperator arguments
    if (seperator)
      fieldInfos = fieldInfos.filter(
        (fi) => fi.arguments && fi.arguments[seperator] === fieldArgs[seperator]
      );

    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'nodes') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');

      if (!__typename) __typename = cache.resolve(key, '__typename') as string;
      if (!_hasMore) hasMore = _hasMore as boolean;

      results.push(...data);
    });

    return {
      __typename,
      hasMore,
      nodes: results,
    };
  };
};
