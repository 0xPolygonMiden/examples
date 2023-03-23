type LinkProps = {
  label: string;
  address: string;
};

/**
 * This component renders a button with the specified label and calls the specified function when clicked.
 * @param label defines the text of the button
 * @param onClick provides a function to be called when the button is clicked
 * @returns a button whose text is the specified label and which calls the specified function when clicked
 */
const Link = ({ label, address }: LinkProps): JSX.Element => {
  return (
    <a
      target="_blank"
      href={address}
      className="block mt-4 lg:inline-block lg:mt-0 text-white hover:underline mr-4"
    >
      {label}
    </a>
  );
};

export default Link;
