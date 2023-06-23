type EditorLabelProps = {
    label: string;
};

export default function EditorLabel(props: EditorLabelProps): JSX.Element {
    return <h3 className="text-base font-semibold leading-6 text-gray-900 text-transform: uppercase">{props.label}</h3>
}