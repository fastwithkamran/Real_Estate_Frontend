import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import apiFetch from "../services/apiClient"

function Home() {
  const { register, watch } = useForm();
  const [properties, setProperties] = useState([]);
  const allPropertiesRef = useRef([]);

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const selectedProvince = watch("province");
  const selectedCity = watch("city");
  const selectedArea = watch("area");

  const navigate = useNavigate();

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
      toast.error("Error failed to fetch API request");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          import.meta.env.VITE_PROPERTYINFO_HOME_API,
          {
            method: "GET",
          },
        );
        const result = await response.json();

        if (response.ok) {
          setProperties(result);
          allPropertiesRef.current = result;
        } else {
          toast.error(`Error ${response.msg}`);
        }
      } catch (error) {
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          import.meta.env.VITE_PROVINCES_LOCATION_API,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setProvinces(jsonResult);
        }
      } catch (error) {
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_CITIES_LOCATION_API}?provinceName=${encodeURIComponent(selectedProvince)}`,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setCities(jsonResult);
        }
      } catch (error) {
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedCity) {
      setAreas([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_AREAS_LOCATION_API}?cityName=${encodeURIComponent(selectedCity)}`,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setAreas(jsonResult);
        }
      } catch (error) {
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedProvince && !selectedCity && !selectedArea) {
      setProperties(allPropertiesRef.current);
      return;
    }

    const queryParams = new URLSearchParams();
    if (selectedProvince) queryParams.set("province", selectedProvince);
    if (selectedCity) queryParams.set("city", selectedCity);
    if (selectedArea) queryParams.set("area", selectedArea);

    const fetchData = async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_FILTER_API}?${queryParams.toString()}`,
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
  }, [selectedProvince, selectedCity, selectedArea]);

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

      <form className="w-full bg-gray-400 mt-4 flex flex-col md:flex-row md:justify-center gap-5">
        <label className="font-bold text-2xl text-center">Filter:</label>

        <select {...register("province")} className="bg-amber-50">
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>

        <select {...register("city")} className="bg-amber-50">
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select {...register("area")} className="bg-amber-50">
          <option value="">Select Area</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </form>

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
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
export default Home;
