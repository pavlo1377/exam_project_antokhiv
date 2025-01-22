import { useRouteError } from "react-router";
import LinkButton from "../../ui/LinkButton";

function NotFound() {
  const error = useRouteError();

  return (
    <div className="text-2xl">
      <h1>Something went wrong 😢</h1>
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default NotFound;
