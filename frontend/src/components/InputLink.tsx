import { Link } from "react-router-dom";

type InputLinkProps = {
  text: string;
  to: string;
};

function InputLink({ text, to }: InputLinkProps) {
  return (
    <Link
      className="
        text-white h-10 mt-6 bg-black hover:text-gray-300
        flex items-center justify-center
      "
      to={to}
    >
      {text}
    </Link>
  );
}

export default InputLink;
