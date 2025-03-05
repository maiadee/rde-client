import spinnerGif from "../../assets/spinner.gif";
import styled from "styled-components";

const Icon = styled.img`
  display: block;
  text-align: center;
  margin: 2rem auto;
  width: 20px;
`;

export default function Spinner() {
  return <Icon src={spinnerGif} alt="Spinner to indicate loading" />;
}
