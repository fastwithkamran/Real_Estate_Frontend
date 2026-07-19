import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { FaBed, FaBath, FaCouch } from "react-icons/fa";

function UserListings() {
  const [properties, setProperties] = useState([]);
  const [count, setCount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/verify-auth", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          navigate("/");
          toast.error(result.msg);
        }
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
        navigate("/");
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/property/userProperties/${currentUser._id}`,
          {
            method: "GET",
          },
        );
        const result = await response.json();
        if (response.ok) {
          setProperties(result);
        } else {
          toast.error(`Error ${response.msg}`);
        }
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [currentUser._id, count]);

  const handlePropertyDelete = async (id) => {
    try {
      const response = await fetch(`/api/property/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        setCount((prevCount) => prevCount + 1);
        toast.success(result.msg);
      } else {
        toast.error(`Error: ${result.msg}`);
      }
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      toast.error("Error failed to fetch API request");
    }
  };

  return (
    <>
      <div className="mr-auto ml-2">
        <Link
          to="/"
          className="text-2xl font-medium text-slate-500 hover:text-blue-600"
        >
          Back
        </Link>
      </div>

      <h1 className="font-bold text-3xl mb-2">Your Listings</h1>

      {!properties || properties.length === 0 ? (
        <div className="font-bold md:text-2xl mx-auto my-auto whitespace-nowrap">
          There are no properties at this time
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property._id}
              className="border border-gray-300 rounded-lg p-2 shadow-md"
            >
              <img
                src={property.propertyImages}
                alt="Image"
                className="w-100 h-50 object-cover rounded-md "
              />
              <h3 className="text-lg font-medium text-center mt-2">
                {property.title}
              </h3>
              <p className="text-gray-700 flex items-center justify-center">
                <FaLocationDot className="text-red-600" />
                {property.city}, {property.province}
              </p>
              <p className="text-medium text-gray-700 mt-2 text-start">
                Type: {property.type}{" "}
              </p>
              <p className="text-medium text-slate-500 mt-4 text-start">
                {property.price}
              </p>
              <div className="flex gap-6 text-sm text-green-600 mt-2">
                <p className="flex items-center gap-2">
                  <FaBed />
                  {property.bedrooms} beds
                </p>
                <p className="flex items-center gap-2">
                  <FaBath />
                  {property.bathrooms} bathrooms
                </p>
                <div className="flex items-center gap-2">
                  <FaCouch /> {property.furnish ? "Furnished" : "UnFurnished"}
                </div>
              </div>
              <div className="flex flex-col">
                <Link
                  to={`/listing-page/${property._id}`}
                  className="mt-2 bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handlePropertyDelete(property._id)}
                  className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default UserListings;
