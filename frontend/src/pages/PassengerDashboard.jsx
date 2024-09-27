/* eslint-disable no-undef */
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import Profile from "../components/passenger/Profile";
import History from "../components/passenger/History";
import UpdateProfile from "../components/passenger/UpdateProfile";
import Spinner from "../components/Spinner";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import io from "socket.io-client";
import api from "../api";
import Star from "../components/Star";
import StarRating from "../components/StarRating";

const socket = io("http://localhost:8080");

const center = { lat: 13.0843, lng: 80.2705 };
const libraries = ["places"];

const PassengerDashboard = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_googleMapAPI, // provide the api key
    libraries,
  });
  const navigate = useNavigate();
  // dropdown
  const [activeTab, setActiveTab] = useState("search");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState(false);
  const [rating, setRating] = useState(0); // Initial state for rating
  const [feedback, setFeedback] = useState("");
  const [isPay, setIsPay] = useState("");
  const [loading, setLoading] = useState(false);
  const rupeeSymbol = "\u20B9";
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setDropdownOpen(false);
  };
  // map data
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [fare, setFare] = useState("");
  const originRef = useRef();
  const destinationRef = useRef();
  // passenger driver details for socket
  const [passengerProfile, setPassengerProfile] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("auth/profile");
        setPassengerProfile(response.data);
        console.log("user fetched success: ", response.data);
      } catch (error) {
        console.error("Error fetching passenger profile: ", error);
      }
    };
    fetchProfile();
  }, []);

  // calculate distance, duration, fare, directions
  async function calculateRoute() {
    try {
      if (
        originRef.current.value === "" ||
        destinationRef.current.value === ""
      ) {
        return;
      }

      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      console.log("Calculate route: ", results);
      setDirectionsResponse(results);
      const distance = results.routes[0].legs[0].distance.text;
      const duration = results.routes[0].legs[0].duration.text;
      setDistance(distance);
      setDuration(duration);
      //fare caluculator
      const baseFare = 10;
      const distanceRate = 12;

      const currentHour = new Date().getHours();
      let peakMultiplier = 1;

      if (
        (currentHour >= 7 && currentHour <= 9) ||
        (currentHour >= 17 && currentHour <= 20)
      ) {
        peakMultiplier = 1.8;
      }
      const calculatedFare = (
        baseFare +
        distanceRate * parseFloat(distance) * peakMultiplier
      ).toFixed(0);
      setFare(calculatedFare);
      console.log(
        `The map values [{distance: ${distance}, duration: ${duration}, fare: ${calculatedFare}}]`
      );
    } catch (error) {
      console.error("Error in calculating the route: ", error);
    }
  }
  // send request for drivers
  const requestCab = () => {
    if (directionsResponse && passengerProfile) {
      const { from, to } = {
        from: originRef.current.value,
        to: destinationRef.current.value,
      };
      const fareAmount = fare;
      // ride request data
      const rideRequest = {
        passengerId: passengerProfile.uid,
        passengerName: passengerProfile.name,
        passengerPhone: passengerProfile.phone,
        from,
        to,
        distance,
        duration,
        fare: fareAmount,
        directionsResponse,
      };
      socket.emit("request_cab", rideRequest);
      console.log("Cab request sent: ", rideRequest);
    } else {
      navigate("/login-ride");
      console.error("Directions response or passenger profile is missing");
    }
  };
  // request accepted
  useEffect(() => {
    socket.on("request_accepted", (request) => {
      setDriverDetails(request);
      setLoading(false);
      console.log("From driver: ", request);
    });

    return () => {
      socket.off("request_accepted");
    };
  }, []);
  // Listen for 'show_feedback_form' when the driver ends the ride
  useEffect(() => {
    socket.on("show_feedback_form", () => {
      console.log("Feedback form triggered");
      setPaymentGateway(true);
      setShowFeedback(true); // Show feedback form
    });

    return () => {
      socket.off("show_feedback_form");
    };
  }, []);
  //handle payment
  const handlePayment = () => {
    try {
      let options = {
        key: "rzp_test_SOCSYgPShUS3sR",
        key_secret: "SsxRdDvzmfZtD8DYWIDj7Tym",
        amount: fare * 100,
        currency: "INR",
        name: "Express_Cabs",
        description: "test mode",
        handler: (response) => {
          alert(
            `Confirmation mailed to ${passengerProfile.email} - ${response.razorpay_payment_id}`
          );
          console.log("Payment id", response);
          setIsPay(response.razorpay_payment_id);
        },
        prefill: {
          name: passengerProfile.name,
          email: passengerProfile.email,
          contact: passengerProfile.phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#030712",
        },
      };
      let pay = new window.Razorpay(options);
      pay.open();
      if (isPay) {
        socket.emit("Payment_done", isPay);
        setPaymentGateway(false);
      }
    } catch (error) {
      console.log("Error in payment: ", error);
    }
  };

  //handle feed back
  const handleFeedbackSubmit = () => {
    // Process the rating and feedback submission logic here
    const feedbackData = {
      rating,
      feedback,
    };
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setFare("");
    originRef.current.value = "";
    destinationRef.current.value = "";
    setDriverDetails(null);
    setShowFeedback(false);
    console.log(feedbackData);
    // You can submit this data to a backend or process it as needed
  };

  //clear the fields
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setFare("");
    originRef.current.value = "";
    destinationRef.current.value = "";
    setDriverDetails(null);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <>
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
              onLoad={(map) => setMap(map)}
            >
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
            </GoogleMap>
            <div className="absolute top-0 bg-white bg-opacity-85 p-4 rounded-lg shadow-lg w-96 z-10">
              <Autocomplete>
                <input
                  type="text"
                  placeholder="Origin"
                  ref={originRef}
                  className="outline-none w-full p-2 border rounded mb-4 border-gray-900"
                />
              </Autocomplete>
              <Autocomplete>
                <input
                  type="text"
                  placeholder="Destination"
                  ref={destinationRef}
                  className="outline-none w-full p-2 border rounded mb-4 border-gray-900"
                />
              </Autocomplete>
              <div className="flex gap-2">
                <button
                  className="w-full p-2 bg-yellow-400 text-gray-950 rounded hover:bg-yellow-500 border border-gray-900"
                  onClick={calculateRoute}
                >
                  Search
                </button>
                <button
                  className="text-gray-950 p-2 bg-red-500 rounded hover:bg-red-600 border border-gray-900"
                  onClick={clearRoute}
                >
                  Clear
                </button>
              </div>
              <div className="text-gray-950 mt-4 flex justify-between">
                <div className="flex flex-col items-start">
                  <p>
                    <span className="font-semibold">Distance:</span> {distance}
                  </p>
                  <p>
                    <span className="font-semibold">Duration:</span> {duration}
                  </p>
                  <p>
                    <span className="font-semibold">Fare:</span> {fare}{" "}
                    {rupeeSymbol}
                  </p>
                </div>
                <div className="flex items-end">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 mt-2"
                    onClick={() => {
                      map.panTo(center);
                      map.setZoom(15);
                    }}
                  >
                    center
                  </button>
                </div>
              </div>
              {distance && duration && fare ? (
                <>
                  {driverDetails ? (
                    <div className="driver-details mt-4 p-2 bg-gray-200 rounded">
                      <h3 className="font-semibold text-xl">Driver Details</h3>
                      {loading ? (
                        <Spinner loading={loading} />
                      ) : (
                        <div>
                          <div className="flex justify-center gap-8 my-4">
                            <img
                              src={driverDetails.passportPhoto}
                              alt="profile"
                              className="size-32 rounded-full shadow-2xl"
                            />
                            <div className="relative group">
                              <img
                                src={driverDetails.vehicleImage}
                                alt="Car"
                                className="size-32 rounded-full shadow-2xl"
                              />
                              <div className="rounded-full absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p>Maruti Swift</p>
                                <p>{driverDetails.vehicleNumber}</p>
                              </div>
                            </div>
                          </div>
                          <p>
                            <span className="font-semibold">Name:</span>
                            {" " + driverDetails.name}
                          </p>
                          <div className="flex gap-4">
                            <p>
                              <span className="font-semibold">Contact:</span>
                              {" " + driverDetails.phone}
                            </p>
                            <IoIosCall
                              className="size-6 cursor-pointer text-green-600"
                              onClick={() =>
                                alert(`Calling ${driverDetails.phone}...`)
                              }
                            />
                          </div>
                          <p>
                            <span className="font-semibold">Vehicle Name:</span>
                            {" " + "Maruti Swift"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Vehicle Number:
                            </span>
                            {" " + driverDetails.vehicleNumber}
                          </p>
                          <StarRating />
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="w-full p-2 bg-green-400 text-gray-950 rounded hover:bg-green-500 border border-gray-900 mt-2"
                      onClick={requestCab}
                    >
                      Request Cab
                    </button>
                  )}
                </>
              ) : null}
            </div>
            {paymentGateway && fare && handlePayment()}
            {showFeedback && (
              <div className="absolute border bottom-1/2 left-1/4 right-1/4 bg-gray-950 text-white p-4 rounded-lg shadow-lg z-20">
                <button
                  className="absolute top-0 right-1 text-3xl hover:text-gray-300 text-white mr-3"
                  onClick={() => setShowFeedback(false)}
                >
                  &times;
                </button>
                <h3 className="text-lg font-semibold mb-2">Feedback</h3>

                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      filled={star <= rating} // Filled star if the current index is less than or equal to the rating
                      onClick={() => setRating(star)} // Set the rating on click
                    />
                  ))}
                </div>

                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-950 outline-none"
                  placeholder="Leave your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white w-full py-2 mt-2 rounded-lg hover:bg-blue-700"
                  onClick={handleFeedbackSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          </>
        );
      case "passenger-info":
        return <Profile />;
      case "history":
        return <History />;
      case "update-profile":
        return <UpdateProfile />;
      default:
        return null;
    }
  };

  if (!isLoaded) return <Spinner loading={true} />;

  return (
    <div className="h-screen">
      <nav className="bg-gray-950 text-white h-16 flex items-center justify-between px-4 relative z-20">
        <div className="text-xl hover:text-yellow-400 hover:cursor-pointer">
          Express Cabs
        </div>
        <div className="relative">
          <FaBars
            className="text-2xl cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-950 rounded-lg shadow-lg z-50">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer z-20"
                  onClick={() => handleTabClick("search")}
                >
                  Search
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleTabClick("passenger-info")}
                >
                  Passenger Info
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer z-20"
                  onClick={() => handleTabClick("history")}
                >
                  History
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleTabClick("update-profile")}
                >
                  Update Profile
                </li>
                <Link to="/">
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Logout
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <div className="relative h-[calc(100vh-4rem)]">{renderTabContent()}</div>
    </div>
  );
};

export default PassengerDashboard;
