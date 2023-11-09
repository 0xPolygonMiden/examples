import React, { Fragment, useEffect, useState } from 'react';
import FileType from '../../types/File';
import useFileManager from '../../hooks/useFileManager';
import File from './File';

interface FilesListProps {
    setSelected: (path: string) => void;
}

const FileList: React.FC<FilesListProps> = ({ setSelected }) => {
    const [ path, setPath ] = useState("/");
    const [ orderedFiles, setOrderedFiles ] = useState<FileType[]>([]);
    const [ files, setFiles ] = useState<FileType[]>([]);
    const [ isRoot, setIsRoot ] = useState(true);
    const { list } = useFileManager();
    const [ selectedFilePath, setSelectedFilePath ] = useState<string>("")

    const fetchData = async (path: string) => {
        try {
            const files = await list(path);
            setFiles(files);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        setIsRoot(path === '/');
        fetchData(path);
    }, [path]);

    useEffect(() => {
        const filteredFiles = files.filter((file: FileType) => {
            return file.path == path + file.name;
        });
        const orderedFiles = filteredFiles.sort((a: FileType, b: FileType) => {
            if (a.type === 'dir' && b.type !== 'dir') {
                return -1;
            } else if (a.type !== 'dir' && b.type === 'dir') {
                return 1;
            } else {
                return a.name.localeCompare(b.name);
            }
        });
        setOrderedFiles(orderedFiles);
    }, [files]);

    const handleBackClick = () => {
        const newPath = path.split('/').slice(0, -2).join('/') + "/"
        setPath(newPath);
    };

    const handleClick = (file: FileType) => {
        if (file.type === 'dir') {
            setPath(`${file.path}/`);
        } else {
            setSelected(file.path);
            setSelectedFilePath(file.name)
        }
    }

    return (
        <>
            {!isRoot && <div className="icon go-back" onClick={handleBackClick}><i className="fa fa-arrow-left"  /></div>}
            {orderedFiles.map((file: FileType) => (
                <div className={`card ${selectedFilePath == file.path ? 'selected': ''}`} onClick={e => handleClick(file)} key={file.name}>
                    <File file={file} />
                </div>
            ))}
        </>
    );
};

export default FileList;
