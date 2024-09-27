import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import api from "../api";

const LoginToRide = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.identifier,
        formData.password
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      await api.post("/auth/login", { uid: userCredential.user.uid });
      alert("login successful");
      navigate("/passenger-dashboard");
    } catch (error) {
      setError("Error during login: ", error.message);
    }
  };
  return (
    <>
      <nav className="bg-gray-950 text-white h-16">
        <div className="mx-0 px-8 py-4 md:mx-16 md:px-16 flex justify-between items-center">
          <div className="text-xl hover:text-yellow-500 hover:cursor-pointer">
            Express Cabs
          </div>
          <div>
            <Link to="/">
              <button className="w-16 rounded-xl p-1 text-center bg-yellow-400 text-gray-950 hover:bg-yellow-500">
                Home
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-0 my-10 px-8 py-4 md:mx-32 md:px-32 md:py-8 flex flex-col items-center gap-2">
        <input
          type="text"
          name="identifier"
          placeholder="Email or Phone"
          onChange={handleChange}
          className="bg-gray-100 border outline-none rounded-md p-2 w-3/4 md:w-1/2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="bg-gray-100 border outline-none rounded-md p-2 w-3/4 md:w-1/2"
        />
        <button
          onClick={handleSubmit}
          className="flex justify-center gap-2 bg-gray-950 text-white border outline-none rounded-md p-2 w-3/4 md:w-1/2"
        >
          Login
        </button>
        {error && <p className="text-red-600 p-2">{error}</p>}
      </div>
    </>
  );
};

export default LoginToRide;
