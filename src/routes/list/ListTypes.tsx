import { useNavigate } from "react-router-dom";

export function ListTypesRoute() {
  const navigate = useNavigate();

  return navigate("/list/fixed-row-heights");
}
