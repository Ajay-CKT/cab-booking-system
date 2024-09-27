/* eslint-disable no-unused-vars */
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const center = { lat: 13.0843, lng: 80.2705 };
const libraries = ["places"];

const Home = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_googleMapAPI,
    libraries,
  });

  const [isLoginActive, setIsLoginActive] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const originRef = useRef();
  const destiantionRef = useRef();

  function clearRoute() {
    setDirectionsResponse(null);
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="h-screen">
      <nav className="bg-gray-950 text-white h-16">
        <div className="mx-0 px-8 py-4 md:mx-16 md:px-16 flex justify-between items-center">
          <div className="text-xl hover:text-yellow-500 hover:cursor-pointer">
            Express Cabs
          </div>
          <div className="flex gap-1">
            <div className="relative">
              <button
                className="w-16 rounded-xl p-1 text-center"
                onClick={() => {
                  setIsLoginActive(!isLoginActive);
                  setIsSignupActive(false);
                }}
              >
                login
              </button>
              {isLoginActive && (
                <div className="absolute right-0  mt-4 w-32 bg-white rounded-lg shadow-lg z-10">
                  <h3 className="text-gray-950 text-center p-2">
                    <span className="hover:border-b-2 border-gray-950">
                      Login to..
                    </span>
                  </h3>
                  <ul>
                    <Link to="/login-ride">
                      <li className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Ride
                      </li>
                    </Link>
                    <Link to="/login-drive">
                      <li className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Drive
                      </li>
                    </Link>
                  </ul>
                </div>
              )}
            </div>
            <button
              className="w-16 rounded-xl p-1 text-center bg-yellow-400 text-gray-950 hover:bg-yellow-500"
              onClick={() => {
                setIsSignupActive(!isSignupActive);
                setIsLoginActive(false);
              }}
            >
              signup
            </button>
            {isSignupActive && (
              <div className="absolute right-8 md:right-32  mt-12 w-32 bg-white rounded-lg shadow-lg z-10">
                <h3 className="text-gray-950 text-center p-2">
                  <span className="hover:border-b-2 border-gray-950">
                    Signup to..
                  </span>
                </h3>
                <ul>
                  <Link to="signup-ride">
                    <li className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer">
                      Ride
                    </li>
                  </Link>

                  <Link to="signup-drive">
                    <li className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer">
                      Drive
                    </li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative h-[calc(100vh-4rem)] bg-emerald-300">
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
        </>
        <div className="absolute h-[calc(100vh-4rem)] top-0 right-0 p-4 rounded-lg w-96 py-44">
          <div>
            <h1 className="text-gray-950 text-xl mb-4 text-center">Search</h1>
            <Autocomplete>
              <input
                type="text"
                placeholder="Origin"
                ref={originRef}
                className="outline-none w-full p-2 border rounded mb-4"
              />
            </Autocomplete>
            <Autocomplete>
              <input
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
                className="outline-none w-full p-2 border rounded mb-4"
              />
            </Autocomplete>
            <div className="flex gap-2">
              <Link to="/login-ride">
                <button className="w-full p-2 bg-yellow-400 text-gray-950 rounded hover:bg-yellow-500">
                  Find Cabs
                </button>
              </Link>
              <button
                className="text-gray-950 p-2 bg-red-500 rounded hover:bg-red-600"
                onClick={clearRoute}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
