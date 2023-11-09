interface FileManagerOpen {
    title: string;
    okText?: string;
    cancelText?: string;
    onOk: (path: string) => void;
    onCancel?: () => void;
    onClose?: () => void;
}

export default FileManagerOpen;
