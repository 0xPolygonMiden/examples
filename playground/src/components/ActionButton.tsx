type ActionButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

/**
 * This component renders a button with the specified label and calls the specified function when clicked.
 * @param label defines the text of the button
 * @param onClick provides a function to be called when the button is clicked
 * @returns a button whose text is the specified label and which calls the specified function when clicked
 */
const ActionButton = ({ label, onClick, disabled }: ActionButtonProps): JSX.Element => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-25"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ActionButton;
