import { useState, useEffect } from "react";
import api from "../../api";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleNumber: "",
    rcBookImage: null,
    vehicleImage: null,
    licenseImage: null,
    passportPhoto: null,
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile-drive");
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          vehicleNumber: response.data.vehicleNumber,
          rcBookImage: response.data.rcBookImage,
          vehicleImage: response.data.vehicleImage,
          licenseImage: response.data.licenseImage,
          passportPhoto: response.data.passportPhoto,
          password: "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const uploadIMG = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "image_preset");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dktaybbnl/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const imageData = await res.json();
      return imageData.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload images to Cloudinary and update formData with the URLs
      const rcBookURL =
        formData.rcBookImage && (await uploadIMG(formData.rcBookImage));
      const vehicleImageURL =
        formData.vehicleImage && (await uploadIMG(formData.vehicleImage));
      const licenseImageURL =
        formData.licenseImage && (await uploadIMG(formData.licenseImage));
      const passportPhotoURL =
        formData.passportPhoto && (await uploadIMG(formData.passportPhoto));

      // Update formData with the image URLs from Cloudinary
      const updatedData = {
        ...formData,
        rcBookImage: rcBookURL || formData.rcBookImage,
        vehicleImage: vehicleImageURL || formData.vehicleImage,
        licenseImage: licenseImageURL || formData.licenseImage,
        passportPhoto: passportPhotoURL || formData.passportPhoto,
      };

      await api.put("/auth/update-drive", updatedData);
      alert("Updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  console.log("FORM DATA: ", formData);

  return (
    <div className="mx-0 my-10 px-8 py-4 md:mx-32 md:px-32 md:py-8 flex flex-col items-center gap-6 text-gray-950">
      {[
        {
          label: "Name",
          type: "text",
          name: "name",
          placeholder: "Name",
          value: formData.name,
        },
        {
          label: "Email",
          type: "email",
          name: "email",
          placeholder: "Email",
          value: formData.email,
        },
        {
          label: "Phone",
          type: "text",
          name: "phone",
          placeholder: "Phone",
          value: formData.phone,
        },
        {
          label: "Vehicle Number",
          type: "text",
          name: "vehicleNumber",
          placeholder: "Vehicle nu..",
          value: formData.vehicleNumber,
        },
        {
          label: "Update Password",
          type: "password",
          name: "password",
          placeholder: "Password",
          value: formData.password,
        },
      ].map((field, index) => (
        <div key={index} className="w-full md:w-3/4 flex flex-col gap-2">
          <p className="px-4 font-semibold">{field.label}</p>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={field.value}
            onChange={handleChange}
            className="bg-gray-100 border outline-none rounded-md p-2 w-full"
          />
        </div>
      ))}

      {/** File input fields with image previews */}
      {[
        {
          label: "RC Book",
          name: "rcBookImage",
          imgSrc: formData.rcBookImage,
        },
        {
          label: "Vehicle",
          name: "vehicleImage",
          imgSrc: formData.vehicleImage,
        },
        {
          label: "License",
          name: "licenseImage",
          imgSrc: formData.licenseImage,
        },
        {
          label: "Photo",
          name: "passportPhoto",
          imgSrc: formData.passportPhoto,
        },
      ].map((field, index) => (
        <div key={index} className="w-ful md:w-3/4 flex flex-col gap-2">
          <p className="px-4 font-semibold">{field.label}</p>
          <div className="flex items-center gap-8">
            <input
              type="file"
              name={field.name}
              onChange={handleFileChange}
              className="bg-gray-100 border outline-none rounded-md p-2 w-full md:w-full"
            />
            <img
              src={field.imgSrc}
              alt="Preview"
              className="size-20 rounded-lg object-fill"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-gray-950 text-white border outline-none rounded-md p-2 w-full md:w-1/2"
      >
        Update
      </button>
    </div>
  );
};
export default UpdateProfile;
