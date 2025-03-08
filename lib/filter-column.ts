import {
    eq,
    inArray,
    isNotNull,
    isNull,
    like,
    not,
    notLike,
    type Column,
    type ColumnBaseConfig,
    type ColumnDataType,
} from "drizzle-orm"

export function filterColumn({
    column,
    value,
    isSelectable,
}: {
    column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>
    value: string
    isSelectable?: boolean
}) {
    if (!value) return;

    // Split the filter value by "~" to get the filter value and operator
    const [filterValue, filterOperator] = value.split("~").filter(Boolean) ?? [];

    if (!filterValue) return;

    if (isSelectable) {
        // Handle selectable filters (faceted filters)
        // Split by "." to handle multiple selected values
        const values = filterValue.split(".");
        console.log('Faceted values for filtering:', values);

        switch (filterOperator) {
            case "eq":
                return inArray(column, values);
            case "notEq":
                return not(inArray(column, values));
            case "isNull":
                return isNull(column);
            case "isNotNull":
                return isNotNull(column);
            default:
                // Default behavior for faceted filters - exact match with one of the selected values
                return inArray(column, values);
        }
    } else {
        // Handle text search filters - case insensitive
        switch (filterOperator) {
            case "ilike":
                return like(column, `%${filterValue}%`);
            case "notIlike":
                return notLike(column, `%${filterValue}%`);
            case "startsWith":
                return like(column, `${filterValue}%`);
            case "endsWith":
                return like(column, `%${filterValue}`);
            case "eq":
                return eq(column, filterValue);
            case "notEq":
                return not(eq(column, filterValue));
            case "isNull":
                return isNull(column);
            case "isNotNull":
                return isNotNull(column);
            default:
                // Default to partial match for text search
                return like(column, `%${filterValue}%`);
        }
    }
}