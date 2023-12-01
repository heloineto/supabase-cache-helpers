import {
  PostgrestError,
  PostgrestMaybeSingleResponse,
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/postgrest-js';
import {
  AnyPostgrestResponse,
  isPostgrestBuilder,
} from '@supabase-cache-helpers/postgrest-core';
import { FetchQueryOptions, QueryClient } from '@tanstack/react-query';

import { encode } from '../lib';

function prefetchQuery<Result>(
  queryClient: QueryClient,
  query: PromiseLike<PostgrestSingleResponse<Result>>,
  config?: Omit<
    FetchQueryOptions<PostgrestSingleResponse<Result>, PostgrestError>,
    'queryKey' | 'queryFn'
  >,
): Promise<void>;
function prefetchQuery<Result>(
  queryClient: QueryClient,
  query: PromiseLike<PostgrestMaybeSingleResponse<Result>>,
  config?: Omit<
    FetchQueryOptions<PostgrestMaybeSingleResponse<Result>, PostgrestError>,
    'queryKey' | 'queryFn'
  >,
): Promise<void>;
function prefetchQuery<Result>(
  queryClient: QueryClient,
  query: PromiseLike<PostgrestResponse<Result>>,
  config?: Omit<
    FetchQueryOptions<PostgrestResponse<Result>, PostgrestError>,
    'queryKey' | 'queryFn'
  >,
): Promise<void>;

async function prefetchQuery<Result>(
  queryClient: QueryClient,
  query: PromiseLike<AnyPostgrestResponse<Result>>,
  config?: Omit<
    FetchQueryOptions<AnyPostgrestResponse<Result>, PostgrestError>,
    'queryKey' | 'queryFn'
  >,
) {
  await queryClient.prefetchQuery<AnyPostgrestResponse<Result>, PostgrestError>(
    {
      queryKey: encode<Result>(query, false),
      queryFn: async () => {
        if (!isPostgrestBuilder<Result>(query)) {
          throw new Error('Query is not a PostgrestBuilder');
        }

        return await query.throwOnError();
      },
      ...config,
    },
  );
}

export { prefetchQuery };
