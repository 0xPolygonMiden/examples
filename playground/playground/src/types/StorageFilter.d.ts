/**
 * @interface Filter
 * @description Represents a filter used for searching or narrowing down results.
 */
interface StorageFilter {
    /**
     * @property {string} name - The name to filter by.
     */
    name?: string;

    /**
     * @property {string} type - The type to filter by.
     */
    type?: string;
}
