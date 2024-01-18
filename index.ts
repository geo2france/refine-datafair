import { DataProvider } from "@refinedev/core";
import { axiosInstance, generateSort, generateFilter } from "./utils";
import { AxiosInstance } from "axios";
import { stringify } from "query-string";

type MethodTypes = "get" | "delete" | "head" | "options";

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`; //Ajouter /line par défaut ? (si aucun autre /machin)

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      page?: number;
      size?: number;
      sort?: string;
      qs?: string;
    } = {};

    if (mode === "server") {
      query.page = current;
      query.size = pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      query.sort = generatedSort
    }

    if(queryFilters){
      query.qs = queryFilters
    }

    const { data, headers } = await httpClient[requestMethod](
      `${url}?${stringify(query)}`,
      {
        headers: headersFromMeta,
      }
    );


    return {
      data: data.results,
      total: data.total,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const url = `${apiUrl}/${resource}`; //Ajouter /line par défaut ? (si aucun autre /machin)
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](
      `${url}?${stringify({ qs: ids.map((id) => `_id:"${id}"`).join(' OR ') })}`,
      { headers }
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    throw new Error(
      `[datafair-data-provider]: create operation not supported`
      ); 
  },

  update: async ({ resource, id, variables, meta }) => {
    throw new Error(
      `[datafair-data-provider]: update operation not supported`
      ); 
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}`; //Ajouter /line par défaut ? (si aucun autre /machin)
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](
      `${url}?${stringify({ qs: `_id:"${id}"` })}`,
      { headers }
    );

    return {
      data:data?.results[0]
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    throw new Error(
      `[datafair-data-provider]: delete operation not supported`
      ); 
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    throw new Error(
      `[datafair-data-provider]: custom query operation not supported`
      ); 
  },
});
