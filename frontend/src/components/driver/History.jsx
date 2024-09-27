import { useEffect, useState } from "react";
import api from "../../api";
const History = () => {
  const [user] = useState(true);
  const [rideHistory, setRideHistory] = useState([]);
  const rupeeSymbol = "\u20B9";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/auth/history-driver");
        if (response) {
          setRideHistory(response.data.rideHistory);
          console.log(
            "history fetched success profile:",
            response.data.rideHistory
          );
        }
      } catch (error) {
        console.error("Error in fetching history: ", error);
      }
    };
    fetchHistory();
  }, []); 
  return (
    <div className="mx-0 my-10 px-8 py-4 md:mx-32 md:px-32 md:py-8">
      {user ? (
        <div>
          <h2 className="text-2xl mb-4 text-center">History</h2>
          <ul className="flex flex-col px-8">
            {rideHistory.map((ride, index) => (
              <li
                key={index}
                className="mb-2 flex justify-between border shadow-md px-8 py-2"
              >
                <div className="flex flex-col items-start mb-2 py-2">
                  <p>
                    <span className="font-semibold">From: </span>
                    {ride.from.slice(0, 70) + "..."}
                  </p>
                  <p>
                    <span className="font-semibold">To: </span>
                    {ride.to.slice(0, 70) + "..."}
                  </p>
                  <p>{ride.distance}</p>
                  <p>{ride.duration}</p>
                </div>
                <div className="flex flex-col items-end mb-2 py-2">
                  <p>
                    {ride.fare} {rupeeSymbol}
                  </p>
                  <p>{ride.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className=" flex flex-col items-center gap-2">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default History;
