import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Home() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const handlePropertyPage = async (id) => {
    try {
      const response = await fetch(import.meta.env.VITE_AUTH_VERIFICATION_API, {
        credentials: "include",
        method: "GET",
      });

      const result = await response.json();

      if (response.ok) {
        navigate(`/user/property-page/${id}`);
      } else {
        alert(`Error: ${result.msg}`);
        navigate("/auth/login");
      }
    } catch (error) {
      console.log("Error", error);
      alert("Error while Fetching API from Frontend");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_PROPERTYINFO_HOME_API,
          {
            method: "GET",
          },
        );
        console.log(response);
        const result = await response.json();

        if (response.ok) {
          setProperties(result);
        } else {
          alert(`Error ${response.msg}`);
        }
      } catch (error) {
        console.log(error);
        alert("FrontEnd API Call Error, see console");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="grid md:grid-cols-3 grid-cols-2 w-full">
        <img
          src="/home_1.png"
          alt="home_1"
          className="w-full object-cover h-full"
        />
        <img
          src="/home_2.png"
          alt="home_2"
          className="w-full object-cover h-full"
        />
        <img
          src="/home_3.png"
          alt="home_3"
          className="w-full object-cover h-full hidden md:block"
        />
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
              className="flex flex-row border-2 rounded-md bg-blue-300 mt-3 p-2 gap-4"
            >
              <img
                src={property.propertyImages}
                alt="PropertyImage"
                className="object-cover w-50 h-45"
              />
              <div className="flex flex-col flex-1 justify-between">
                <h3 className="text-2xl font-bold p-2">{property.title}</h3>
                <p className="whitespace-nowrap flex justify-end pr-2">
                  📍{property.street}, {property.area}, {property.city},{" "}
                  {property.province}
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-red-500 p-2 w-1/7 rounded-3xl text-white cursor-pointer hover:bg-gray-500"
                    onClick= {() => handlePropertyPage(property._id)}
                  >
                    View Details
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
export default Home;
