/* eslint-disable react/prop-types */
import { ClipLoader } from "react-spinners";
const Spinner = ({ loading }) => {
  const override = {
    display: "block",
    margin: "100px auto",
  };
  return (
    <ClipLoader
      color="030712"
      loading={loading}
      cssOverride={override}
      size={150}
    />
  );
};

export default Spinner;
