import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import apiFetch from "../../services/apiClient"

function AllPosts() {
  const [properties, setProperties] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          import.meta.env.VITE_AUTH_VERIFICATION_API,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          navigate("/");
          toast.error(result.msg);
        }
      } catch (error) {
        navigate("/");
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_PROPERTYINFO_ALLPOSTS_API}/${userId}`,
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
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, []);

  const handlePropertyPage = async (id) => {
    try {
      const response = await apiFetch(import.meta.env.VITE_AUTH_VERIFICATION_API, {
        credentials: "include",
        method: "GET",
      });

      const result = await response.json();

      if (response.ok) {
        navigate(`/user/property-page/${id}`);
      } else {
        toast.error(`Error: ${result.msg}`);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error("Error while Fetching API from Frontend");
    }
  };

  const handlePropertyDelete = async (id) => {
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_PROPERTY_DELETE}/${id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg);
        navigate(`/user/allposts/${userId}`);
      } else {
        toast.error(`Error: ${result.msg}`);
        navigate(`/user/allposts/${userId}`);
      }
    } catch (error) {
      toast.error("Error while Fetching API from Frontend");
    }
  };

  return (
    <>
      <div className="mr-auto ml-2">
        <Link
          to="/"
          className="md:text-2xl bg-amber-50 rounded-2xl border-2 p-2 text-pink-800"
        >
          Back
        </Link>
      </div>
      <div className="mt-2 w-full">
        {!properties || properties.length === 0 ? (
          <div className="flex justify-center font-bold md:text-2xl mt-3 whitespace-nowrap">
            There are no properties at this time
          </div>
        ) : (
          properties?.map((property) => (
            <div
              key={property._id}
              className="flex md:flex-row flex-col border-2 rounded-md bg-blue-300 mt-3 p-2 gap-4"
            >
              <img
                src={property.propertyImages}
                alt="PropertyImage"
                className="object-cover md:w-50 w-full h-50"
              />
              <div className="md:flex md:flex-col flex-1">
                <h3 className="md:text-2xl font-bold p-2">{property.title}</h3>
                <p className="flex md:justify-end pr-2">
                  📍{property.street}, {property.area}, {property.city},{" "}
                  {property.province}
                </p>
                <div className="text-black rounded-2xl p-1 md:text-2xl mt-2">
                  Price: {property.price}
                </div>
                <div className="md:flex md:justify-end">
                  <button
                    className="bg-red-500 p-2 mt-2 rounded-2xl text-white cursor-pointer hover:bg-gray-500"
                    onClick={() => handlePropertyPage(property._id)}
                  >
                    View Details
                  </button>
                </div>
                <div className="md:flex md:justify-end">
                  <button
                    className="bg-red-500 p-2 mt-2 rounded-2xl text-white cursor-pointer hover:bg-gray-500"
                    onClick={() => handlePropertyDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default AllPosts;
