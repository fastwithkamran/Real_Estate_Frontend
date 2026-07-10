import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

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
        const response = await fetch(
          import.meta.env.VITE_PROVINCES_LOCATION_API,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setProvinces(jsonResult);
        }
      } catch (error) {
        alert("FrontEnd API Call Error, see console");
        console.log("Error", error);
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
        const response = await fetch(
          `${import.meta.env.VITE_CITIES_LOCATION_API}?provinceName=${encodeURIComponent(selectedProvince)}`,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setCities(jsonResult);
        }
      } catch (error) {
        alert("FrontEnd API Call Error, see console");
        console.log("Error", error);
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
        const response = await fetch(
          `${import.meta.env.VITE_AREAS_LOCATION_API}?cityName=${encodeURIComponent(selectedCity)}`,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setAreas(jsonResult);
        }
      } catch (error) {
        alert("FrontEnd API Call Error, see console");
        console.log("Error", error);
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

      formData.append("title", data.title);
      formData.append("country", data.country);
      formData.append("province", data.province);
      formData.append("city", data.city);
      formData.append("area", data.area);
      formData.append("price", data.price);
      formData.append("description", JSON.stringify(descriptionList));

      if (data.propertyImages && data.propertyImages.length > 0) {
        const files = Array.from(data.propertyImages).slice(0, 5);

        files.forEach((image) => {
          formData.append("propertyImages", image);
        });
      }

      const response = await fetch(
        import.meta.env.VITE_CREATE_POST_API,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      const result = await response.json() 

      if (response.ok) {
        setDescriptionList([]);
        reset();
        navigate("/");
      } else {
        alert(`Error ${result.msg}`);
      }
    } catch (error) {
      alert("Frontend API Call Error to Server, see console");
      console.log("Error", error);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl mb-4">
        Advertise Your Property
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
        <label className="font-bold mt-3">Adjectives</label>
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

        <label className="font-bold mt-3">Location</label>
        <label className="font-bold mt-3">Select Country</label>
        <select {...register("country")}>
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
        <label className="font-bold mt-3">Price</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("price")}
          placeholder="RS 20 Lacs"
        />
        <label className="font-bold mt-3">Property Images</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          {...register("propertyImages")}
        />
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
