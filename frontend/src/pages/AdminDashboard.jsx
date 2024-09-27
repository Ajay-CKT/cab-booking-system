import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState(""); // To differentiate between passenger and driver
  const rupeeSymbol = "\u20B9";

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const driverResponse = await axios.get(
          "YOUR_BACKEND_URL_" // provide the url where the response is stored 
        );
        const passengerResponse = await axios.get(
          "YOUR_BACKEND_URL_" // provide the url where the response is stored 
        );
        setDrivers(driverResponse.data);
        setPassengers(passengerResponse.data);
        console.log(driverResponse.data);
        console.log(passengerResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Delete a user (driver or passenger)
  const deleteUser = async (id, type) => {
    try {
      await axios.delete(`YOUR_BACKEND_URL_${type}/${id}`); // provide the url where the response is stored 
      if (type === "drivers") {
        setDrivers(drivers.filter((driver) => driver._id !== id));
      } else {
        setPassengers(passengers.filter((passenger) => passenger._id !== id));
      }
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // View more details
  const viewMoreDetails = (user, type) => {
    setSelectedUser(user);
    setViewMode(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <h1 className="bg-gray-950 text-white text-xl font-semibold h-16 flex items-center justify-between px-4 relative">
        Admin Dashboard
      </h1>
      <div className="container mx-auto p-4">
        {/* Drivers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Drivers</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id} className="border-b">
                    <td className="px-4 py-2">{driver.name}</td>
                    <td className="px-4 py-2">{driver.email}</td>
                    <td className="px-4 py-2">{driver.phone}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700  mr-2"
                        onClick={() => viewMoreDetails(driver, "Driver")}
                      >
                        View More
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => deleteUser(driver._id, "drivers")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Passengers Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Passengers</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((passenger) => (
                  <tr key={passenger._id} className="border-b">
                    <td className="px-4 py-2">{passenger.name}</td>
                    <td className="px-4 py-2">{passenger.email}</td>
                    <td className="px-4 py-2">{passenger.phone}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700  mr-2"
                        onClick={() => viewMoreDetails(passenger, "Passenger")}
                      >
                        View More
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => deleteUser(passenger._id, "passengers")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Viewing Details */}
        {selectedUser && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
                <h3 className="text-xl font-bold mb-4 text-center">
                  {viewMode} Details
                </h3>
                <div className="flex items-center mb-4">
                  <p className="mr-4">
                    <strong>Name:</strong> {selectedUser.name}
                  </p>
                  <img
                    src={selectedUser.passportPhoto}
                    alt="Passport Photo"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                </div>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone}
                </p>

                {viewMode === "Driver" && (
                  <>
                    <div className="flex items-center mb-4">
                      <p className="mr-4">
                        <strong>Vehicle Number:</strong>{" "}
                        {selectedUser.vehicleNumber}
                      </p>
                      <img
                        src={selectedUser.vehicleImage}
                        alt="Vehicle Image"
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      />
                    </div>
                    <h4 className="font-bold mt-4">
                      Recent Ride History (Last 3):
                    </h4>
                    <ul className="flex flex-col space-y-4 px-2">
                      {selectedUser.rideHistory.length > 0 ? (
                        selectedUser.rideHistory
                          .slice(-3)
                          .reverse()
                          .map((ride, index) => (
                            <li
                              key={index}
                              className="p-3 bg-white rounded-lg shadow-lg border border-gray-200"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <strong>From:</strong> {ride.from}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>To:</strong> {ride.to}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Distance:</strong> {ride.distance}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Duration:</strong> {ride.duration}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <strong>Fare:</strong> {ride.fare}{" "}
                                    {rupeeSymbol}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Passenger Name:</strong>{" "}
                                    {ride.passengerName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Passenger Phone:</strong>{" "}
                                    {ride.passengerPhone}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Time:</strong>{" "}
                                    {new Date(ride.time).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                      ) : (
                        <p className="text-gray-500">
                          No ride history available
                        </p>
                      )}
                    </ul>
                  </>
                )}

                {viewMode === "Passenger" && (
                  <>
                    <h4 className="font-bold mt-4">
                      Recent Ride History (Last 3):
                    </h4>
                    <ul className="flex flex-col space-y-4 px-4">
                      {selectedUser.rideHistory.length > 0 ? (
                        selectedUser.rideHistory
                          .slice(-3)
                          .reverse()
                          .map((ride, index) => (
                            <li
                              key={index}
                              className="p-3 bg-white rounded-lg shadow-lg border border-gray-200"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <strong>From:</strong> {ride.from}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>To:</strong> {ride.to}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Distance:</strong> {ride.distance}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Duration:</strong> {ride.duration}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <strong>Fare:</strong> {ride.fare}{" "}
                                    {rupeeSymbol}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Driver Name:</strong>{" "}
                                    {ride.driverName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Driver Phone:</strong>{" "}
                                    {ride.driverPhone}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <strong>Time:</strong>{" "}
                                    {new Date(ride.time).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                      ) : (
                        <p className="text-gray-500">
                          No ride history available
                        </p>
                      )}
                    </ul>
                  </>
                )}

                <div className="mt-4 flex justify-center">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
