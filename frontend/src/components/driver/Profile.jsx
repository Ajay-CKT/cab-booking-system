import { useEffect, useState } from "react";
import api from "../../api";
import Spinner from "../Spinner";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile-drive");
        setUser(response.data);
        setLoading(false);
        console.log("user fetched success profile");
      } catch (error) {
        setLoading(false);
        console.error("user not fetched profile: ", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="mx-0 my-10 px-8 py-4 md:mx-32 md:px-32 md:py-8">
      {user ? (
        <div className=" flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <img src={user.passportPhoto} alt="" className="size-32 rounded-full shadow-2xl"/>
          <p>
            <span className="font-semibold">Name :</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email :</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Phone :</span> {user.phone}
          </p>
        </div>
      ) : (
        <div className=" flex flex-col items-center gap-2">
          <Spinner loading={loading} />
        </div>
      )}
    </div>
  );
};

export default Profile;
