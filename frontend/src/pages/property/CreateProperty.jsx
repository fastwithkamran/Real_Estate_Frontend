import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import apiFetch from "../../services/apiClient"

function CreateProperty() {
  const { register, handleSubmit, reset, watch } = useForm();
  const navigate = useNavigate();
  const [descriptionList, setDescriptionList] = useState([]);
  const [currentDescription, setCurrentDescription] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const selectedProvince = watch("province");
  const selectedCity = watch("city");

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

  const AddDescription = (e) => {
    e.preventDefault();

    if (currentDescription.trim() === "") return;

    if (!descriptionList.includes(currentDescription.trim())) {
      setDescriptionList([...descriptionList, currentDescription.trim()]);
    }
    setCurrentDescription("");
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (!data.title) {
        toast.error("title is undefined");
        return;
      }

      if (!descriptionList || descriptionList.length === 0) {
        toast.error("descriptionList is undefined");
        return;
      }

      if (!data.country) {
        toast.error("country is undefined");
        return;
      }

      if (!data.province) {
        toast.error("province is undefined");
        return;
      }

      if (!data.area) {
        toast.error("area is undefined");
        return;
      }

      if (!data.street) {
        toast.error("street is undefined");
        return;
      }

      if (!data.price) {
        toast.error("price is undefined");
        return;
      }

      if (!data.allowEmail && !data.allowWhatsApp) {
        toast.error("One is require to check either Email or WhatsApp");
        return;
      }

      formData.append("title", data.title);
      formData.append("country", data.country);
      formData.append("province", data.province);
      formData.append("city", data.city);
      formData.append("area", data.area);
      formData.append("street", data.street);
      formData.append("price", data.price);
      formData.append("description", JSON.stringify(descriptionList));
      formData.append("allowWhatsApp", data.allowWhatsApp);
      formData.append("allowEmail", data.allowEmail);

      if (data.propertyImages && data.propertyImages.length > 0) {
        const files = Array.from(data.propertyImages).slice(0, 5);

        files.forEach((image) => {
          formData.append("propertyImages", image);
        });
      }

      const response = await apiFetch(import.meta.env.VITE_CREATE_POST_API, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setDescriptionList([]);
        reset();
        navigate("/");
      } else {
        toast.error(`Error ${result.msg}`);
      }
    } catch (error) {
      toast.error("Error failed to fetch API request");
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

      <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl mb-4">
        Sell Your Property
      </h1>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md lg:gap-2 gap-1 p-6 rounded-md bg-blue-300 flex flex-col"
      >
        <label className="font-bold">Title</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("title")}
          placeholder="e.g: BUNGALOW ON SELL | RENT NEAR XYZ PLACE"
        />
        <label className="font-bold mt-3">Features</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          placeholder="6 rooms, 1000 YARDS, IDEAL FOR OFFICES"
        />
        <button
          type="button"
          onClick={AddDescription}
          className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
        >
          Add
        </button>

        <ol>
          {descriptionList.map((des, index) => (
            <li
              key={index}
              className="border rounded-4xl border-blue-600 bg-blue-800 px-3 mt-1 font-bold text-white"
            >
              {des}
            </li>
          ))}
        </ol>

        <label className="font-bold mt-3">Price</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("price")}
          placeholder="RS 20 Lacs"
        />
        <label>
          <span className="font-bold mt-3">Property Images</span>
          <span className="text-sm"> ( Can choose upto 5 ) </span>
        </label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          {...register("propertyImages")}
        />

        <div>
          <h3 className="font-bold mt-3 md:text-2xl">Location</h3>
        </div>
        <label className="font-bold mt-3">Select Country</label>
        <select {...register("country")} className="bg-gray-500">
          <option key={"Pakistan"} value={"Pakistan"}>
            Pakistan
          </option>
        </select>
        <label className="font-bold mt-3">Select Province</label>
        <select {...register("province")} className="bg-amber-50">
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
        <label className="font-bold mt-3">Select City</label>
        <select {...register("city")} className="bg-amber-50">
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <label className="font-bold mt-3">Select Area</label>
        <select {...register("area")} className="bg-amber-50">
          <option value="">Select Area</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        <label className="font-bold mt-3">Street</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("street")}
          placeholder="Kashmir Road, House No R31"
        />

        <div>
          <h3 className="font-bold mt-3 md:text-2xl">
            How Should Buyer Contact You
          </h3>
        </div>

        <label className="font-bold mt-3">
          Through WhatsApp
          <input
            type="checkbox"
            className="ml-3"
            {...register("allowWhatsApp")}
          />
        </label>
        <label className="font-bold mt-3">
          Through Email
          <input type="checkbox" className="ml-3" {...register("allowEmail")} />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
        >
          Post Ad
        </button>
      </form>
    </>
  );
}

export default CreateProperty;
