import { useState } from "react";

interface ModaProps {
    title: string;
    isOpen: boolean;
    onClose?: () => void;
    onOk?: () => void;
    onCancel?: () => void;
    okText?: string;
    cancelText?: string;
    children: React.ReactNode;
    variant?: string;
}

const Modal = ({ children, title, isOpen, onClose, onOk, onCancel, okText, cancelText, variant}:ModaProps) => {
    const [ _isOpen, setIsOpen ] = useState(isOpen);

    const handleClose = () => {
        setIsOpen(false);
        onClose && onClose();
    }

    const handleOk = () => {
        onOk && onOk();
        handleClose();
    }

    const hangleCancel = () => {
        onCancel && onCancel();
        handleClose();
    }

    return <>
        { isOpen && <>
            <div className="modal-container">
                <div className={`modal ${variant}`}>
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <span className="close" onClick={handleClose}>&times;</span>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        {okText && <button className="btn btn-primary" onClick={handleOk}>{okText}</button> }
                        {cancelText && <button className="btn btn-secondary" onClick={hangleCancel}>{cancelText}</button> }
                    </div>
                </div>
            </div>
        </>}
    </>
};

export default Modal;