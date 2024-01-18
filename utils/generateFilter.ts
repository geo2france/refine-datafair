import { CrudFilters } from "@refinedev/core";
import { mapOperator } from "./mapOperator";

export const generateFilter = (filters?: CrudFilters) => {
  const array_filter: string[] = []

  if (filters) {
    filters.map((filter) => {
      if (filter.operator !== "or" && filter.operator !== "and" && "field" in filter){ // LogicalFilter

        const value = (() => {switch (filter.operator){
          case "contains":
            return filter.value
          case "eq":
            return `"${filter.value}"`
          case "startswith":
            return `${filter.value}*`
          case "endswith":
            return `*${filter.value}`

        }})()

        array_filter.push(`${filter.field}:${value}`)

      }else{ //Conditionnal filter
        throw new Error(
          `[datafair-data-provider]: Condtionnal filter 'OR' not implemented yet `
          ); 
      }
    });


  }

  return array_filter.join(' AND ');
};
