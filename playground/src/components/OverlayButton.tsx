import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

type OverlayButtonProps = {
  label: string;
  disabled?: boolean;
  proof?: Uint8Array | null;
};

const OverlayButton = ({
  label,
  disabled,
  proof,
}: OverlayButtonProps): JSX.Element => (
  <OverlayTrigger
    trigger="click"
    placement="left"
    rootClose
    overlay={
      <Popover id="popover-basic">
        <Popover.Header as="h1">
          <div className="flex font-bold text-justify text-xl">
            Here is your Proof [size (in kb){" "}
            {proof ? proof.length / 1000 : null}]
          </div>
        </Popover.Header>
        <Popover.Body>
          <div className="flex font-extralight text-gray-900 text-sm">
            {proof
              ? Array.from(proof)
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join("")
                  .slice(0, 3000)
                  .replace(/(.{50})/g, "$&\n") + "..."
              : "No proof available"}
          </div>
        </Popover.Body>
      </Popover>
    }
  >
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-25"
      disabled={disabled}
    >
      {label}
    </button>
  </OverlayTrigger>
);

export default OverlayButton;
