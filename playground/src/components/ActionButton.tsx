type ActionButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  fixedWidth?: boolean;
};

/**
 * This component renders a button with the specified label and calls the specified function when clicked.
 * @param label defines the text of the button
 * @param onClick provides a function to be called when the button is clicked
 * @returns a button whose text is the specified label and which calls the specified function when clicked
 */
const ActionButton = ({ label, onClick, disabled, fixedWidth }: ActionButtonProps): JSX.Element => {

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const buttonClasses = `bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded disabled:opacity-25 ${
    fixedWidth ? 'w-72' : 'flex-grow'
  }`;

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ActionButton;
