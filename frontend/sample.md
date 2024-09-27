import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setDropdownOpen(false);
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <>
            <div>google map here</div>

            <div className="absolute top-0 left-0 bg-white bg-opacity-70 p-4 rounded-lg shadow-lg w-80 z-10">
              <h1 className="text-gray-950 text-xl mb-4">Ride Request</h1>
            </div>
            <div className="absolute bottom-2 right-2">
              <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 mt-2">
                Center Map
              </button>
            </div>
          </>
        );
      case "driver-info":
        return <Profile />;
      case "history":
        return <History />;
      case "update-profile":
        return <UpdateProfile />;
      case "logout":
        return <Logout />;
      default:
        return null;
    }
  };
  return (
    <div className="h-screen">
      <nav className="bg-gray-950 text-white h-16 flex items-center justify-between px-4">
        <div className="text-xl">Driver Dashboard</div>
        <div className="relative">
          <FaBars
            className="text-2xl cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-950 rounded-lg shadow-lg z-50">
              <ul className="py-2">
                {["search", "driver-info", "history", "update-profile"].map(
                  (tab) => (
                    <li
                      key={tab}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab.charAt(0).toUpperCase() +
                        tab.slice(1).replace("-", " ")}
                    </li>
                  )
                )}
                <Link to="/">
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleTabClick("logout")}
                  >
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

export default DriverDashboard;
