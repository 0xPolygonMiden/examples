import { ReactNode } from "react";

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
     * @property {string} icon - The icon of the storage plugin.
     */
    icon: string;


    /**
     * @method
     * @name list
     * @description Lists the content of the specified location, treating it as a directory.
     * @param {string} location - The location representing the directory to list.
     * @returns {Promise<StorageFile>} A promise that resolves to a StorageFile object representing the content of the directory.
     */
    list(location?: string): Promise<StorageFile[]>;

    /**
     * @method
     * @name get
     * @description Retrieves the content stored at the specified location.
     * @param {string} id - The file Id representing the content to retrieve.
     * @returns {Promise<string>} A promise that resolves to a string containing the content stored at the location.
     */
    get(id: string): Promise<string>;

    /**
     * @method
     * @name save
     * @description Creates or updates the content of a location with the provided value.
     * @param {string} location - The location representing the content to create/update.
     * @param {any} value - The value to be stored at the location.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful (true) or not (false).
     */
    save(file: Partial<StorageFile>): Promise<boolean>;

    /**
     * @method
     * @name remove
     * @description Removes the specified location and its associated content.
     * @param {string} id - The file Id representing the content to remove.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful (true) or not (false).
     */
    remove(id: string): Promise<boolean>;
}
