import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <button onClick={handleLogout} className="">
      Logout
    </button>
  );
};

export default Logout;
