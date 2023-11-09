import useFileManager from "../../hooks/useFileManager";
import FileType from "../../types/File";


const File = ({ file }: {file: FileType}) => {
    const { name, type, path } = file;
    

    return <div className="icon">
        {
            type === "dir" 
            ? <img src="/assets/img/plugins/dir.svg" alt="folder" />
            : <img src={`/assets/img/plugins/${type}.svg`} alt="file" />
        }
        <span>{name}</span>
    </div>
}

export default File;