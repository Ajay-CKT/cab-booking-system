import { useState, useEffect } from "react";
import api from "../../api";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          password: "",
        });

        console.log("user fetched success update-profile");
      } catch (error) {
        console.error("User not fetched update-profile: ", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/update", formData);
      console.log("update success");

      // Handle success, e.g., show success message
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-0 my-10 px-8 py-4 md:mx-32 md:px-32 md:py-8 flex flex-col items-center gap-2">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="bg-gray-100 border outline-none rounded-md p-2 w-3/4 md:w-1/2"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="bg-gray-100 border outline-none rounded-md p-2 w-3/4 md:w-1/2"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="bg-gray-100 border outline-none rounded-md p-2 w-3/4 md:w-1/2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="bg-gray-100 border outline-none rounded-md p-2 w-3/4 md:w-1/2"
      />
      <button
        onClick={handleSubmit}
        className="flex justify-center gap-2 bg-gray-950 text-white border outline-none rounded-md p-2 w-3/4 md:w-1/2"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateProfile;
