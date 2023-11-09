/**
    * @interface StorageFile
    * @description Represents a file in the storage system.
    * @property {string} id - The unique identifier of the file.
    * @property {string} location - The location of the file.
    * @property {string} name - The name of the file.
    * @property {string} type - The type of the file.
    * @property {number} size - The size of the file in bytes.
    * @property {number} lastModified - The timestamp when the file was last modified.
    * @property {string} value - The content of the file.
*/
interface StorageFile {
    id: string;
    location: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
    value: string;
}
