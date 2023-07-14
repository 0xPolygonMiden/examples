/**
 * @interface StoragePlugin
 * @description Represents a generic File System and provides methods for interacting with the file system.
 */
interface StoragePlugin {
    /**
     * @property {string} name - The name of the storage plugin.
     */
    name: string;

    /**
     * @method
     * @name list
     * @description Lists the content of the specified key, treating it as a directory.
     * @param {string} key - The key representing the directory to list.
     * @returns {Promise<StorageFile>} A promise that resolves to a StorageFile object representing the content of the directory.
     */
    list(key?: string): Promise<StorageFile[]>;

    /**
     * @method
     * @name get
     * @description Retrieves the content stored at the specified key.
     * @param {string} key - The key representing the content to retrieve.
     * @returns {Promise<string>} A promise that resolves to a string containing the content stored at the key.
     */
    get(key: string): Promise<string>;

    /**
     * @method
     * @name save
     * @description Creates or updates the content of a key with the provided value.
     * @param {string} key - The key representing the content to create/update.
     * @param {any} value - The value to be stored at the key.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful (true) or not (false).
     */
    save(key: string, value: any): Promise<boolean>;

    /**
     * @method
     * @name remove
     * @description Removes the specified key and its associated content.
     * @param {string} key - The key representing the content to remove.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful (true) or not (false).
     */
    remove(key: string): Promise<boolean>;
}
