import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { FaXmark } from "react-icons/fa6";
import { useSelector } from "react-redux";

function CreateListing() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [descriptionList, setDescriptionList] = useState([]);
  const [currentDescription, setCurrentDescription] = useState("");

  const [sell, setSell] = useState(false);
  const [rent, setRent] = useState(false);
  const [furnish, setFurnish] = useState(false);
  const [parking, setParking] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const selectedProvince = watch("province");
  const selectedCity = watch("city");

  const [loading, setLoading] = useState(false);

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
        const response = await fetch("/api/location/get-provinces");

        if (response.ok) {
          const jsonResult = await response.json();
          setProvinces(jsonResult);
        }
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/location/get-cities?provinceName=${encodeURIComponent(selectedProvince)}`,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setCities(jsonResult);
        }
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
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
        const response = await fetch(
          `/api/location/get-areas?cityName=${encodeURIComponent(selectedCity)}`,
        );

        if (response.ok) {
          const jsonResult = await response.json();
          setAreas(jsonResult);
        }
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [selectedCity]);

  const AddDescription = () => {
    if (currentDescription.trim() === "") return;

    if (!descriptionList.includes(currentDescription.trim())) {
      setDescriptionList([...descriptionList, currentDescription.trim()]);
    }
    setCurrentDescription("");
  };

  const DeleteDescription = (index) => {
    setDescriptionList(
      descriptionList.filter((_, indexDelete) => index !== indexDelete),
    );
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (!data.title) {
        toast.error("title is undefined");
        return;
      }

      if (!descriptionList || descriptionList.length === 0) {
        toast.error("features are undefined");
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

      if (!data.bathrooms) {
        toast.error("number of bathrooms?");
      }

      if (!data.bedrooms) {
        toast.error("number of bedrooms?");
      }

      if (!sell && !rent) {
        toast.error("is property for sell or rent?");
        return;
      }

      if (!data.phone) {
        data.phone = null;
      }

      if (data.propertyImages.length > 5) {
        toast.error("You can only upload 5 images");
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
      formData.append("bedrooms", data.bedrooms);
      formData.append("bathrooms", data.bathrooms);
      formData.append("phone", data.phone);
      formData.append("sell", sell);
      formData.append("rent", rent);
      formData.append("furnish", furnish);
      formData.append("parking", parking);
      formData.append("type", data.type);

      if (data.propertyImages && data.propertyImages.length > 0) {
        const files = Array.from(data.propertyImages).slice(0, 5);

        files.forEach((image) => {
          formData.append("propertyImages", image);
        });
      }

      setLoading(true);

      const response = await fetch("/api/property/createProperty", {
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
      setLoading(false);
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      toast.error("Error failed to fetch API request");
      setLoading(false);
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

      <h1 className="text-3xl font-semibold my-7">Sell Your Property</h1>

      <div className="p-4">
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-full grid md:grid-cols-2 gap-8"
        >
          <div className="border-none">
            <h3 className="font-bold md:text-2xl">Property Information</h3>
            <hr />

            <div className="grid xl:grid-cols-2 grid-cols-1 m-3">
              <div>
                <label className="font-bold text-gray-600">Listing Type</label>
                <div className="flex gap-1">
                  <input type="checkbox" onChange={() => setSell(!sell)} />
                  <span>Sell</span>
                  <input type="checkbox" onChange={() => setRent(!rent)} />
                  <span>Rent</span>
                  <input
                    type="checkbox"
                    onChange={() => setFurnish(!furnish)}
                  />
                  <span>Furnished</span>
                  <input
                    type="checkbox"
                    onChange={() => setParking(!parking)}
                  />
                  <span>Parking</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-600">Property Type</label>
                <select
                  {...register("type")}
                  className="border-none bg-amber-50 p-1 w-full font-medium rounded-lg"
                >
                  <option key={"residential"} value={"residential"}>
                    Residential (houses, flats)
                  </option>
                  <option key={"commercial"} value={"commercial"}>
                    Commercial (offices, shops)
                  </option>
                  <option key={"land"} value={"land"}>
                    Land/Plots
                  </option>
                </select>
              </div>
            </div>

            <div className="mx-3">
              <label htmlFor="title" className="font-bold text-gray-600">
                Property Title
              </label>
              <input
                className="border-none bg-amber-50 p-3 font-medium w-full rounded-lg text-slate-700 mt-1"
                type="text"
                id="title"
                {...register("title")}
                maxLength="62"
                minLength="12"
                placeholder="e.g: Luxury Bungalow"
              />
            </div>

            <div className="mx-3 my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="price" className="font-bold text-gray-600">
                  Price
                </label>
                <input
                  className="border-none bg-amber-50 p-3 flex-1 mr-2 font-medium rounded-lg"
                  type="text"
                  id="price"
                  {...register("price")}
                  placeholder="Rs 20 Crore"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="images"
                  className="font-bold text-gray-600 mt-2 sm:mt-0"
                >
                  <span>Property Images</span>
                  <span className="text-sm"> ( Max 5 )</span>
                </label>

                <input
                  id="images"
                  className="border-none bg-amber-50 p-3 flex-1 font-medium rounded-lg"
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("propertyImages")}
                />
              </div>
            </div>

            <div className="mx-3 my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="bedrooms" className="font-bold text-gray-600">
                  BedRooms
                </label>

                <input
                  className="border-none bg-amber-50 p-3 flex-1 sm:mr-2 font-medium rounded-lg ml-3 sm:ml-0"
                  type="number"
                  min={0}
                  id="bedrooms"
                  {...register("bedrooms")}
                  placeholder="3"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="bathrooms" className="font-bold text-gray-600">
                  BathRooms
                </label>

                <input
                  className="border-none bg-amber-50 p-3 flex-1 sm:mr-2 font-medium rounded-lg ml-3 sm:ml-0"
                  type="number"
                  min={0}
                  id="bathrooms"
                  {...register("bathrooms")}
                  placeholder="3"
                />
              </div>
            </div>

            <div className="mx-3">
              <label htmlFor="features" className="font-bold text-gray-600">
                Features
              </label>
              <div className="flex gap-3">
                <input
                  id="features"
                  className="border-none bg-amber-50 p-3 flex-1 font-medium rounded-lg"
                  type="text"
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  placeholder="Sui Gas Available, Zero Loadsheding"
                />
                <button
                  type="button"
                  onClick={AddDescription}
                  className="bg-blue-500 text-white px-4 rounded-lg hover:bg-slate-600"
                >
                  Add
                </button>
              </div>

              <ol className="flex gap-2 flex-wrap">
                {descriptionList.map((des, index) => (
                  <li
                    key={index}
                    className="border-none bg-slate-400 p-3 w-fit font-medium rounded-lg mt-1 flex gap-2"
                  >
                    {des}
                    <button
                      type="button"
                      className="w-fit font-medium rounded-lg"
                      onClick={() => DeleteDescription(index)}
                    >
                      <FaXmark className="bg-red-400 text-white hover:bg-red-800" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-none">
            <div>
              <h3 className="font-bold md:text-2xl">Location</h3>
              <hr />

              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <div className="m-3">
                  <label className="font-bold text-gray-600">
                    Select Country
                  </label>
                  <select
                    {...register("country")}
                    className="border-none bg-amber-50 p-1 sm:w-full w-full font-medium rounded-lg"
                  >
                    <option key={"Pakistan"} value={"Pakistan"}>
                      Pakistan
                    </option>
                  </select>
                </div>

                <div className="m-3">
                  <label className="font-bold text-gray-600">
                    Select Province
                  </label>
                  <select
                    {...register("province")}
                    className="border-none bg-amber-50 p-1 w-full font-medium rounded-lg"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mx-3">
                  <label className="font-bold text-gray-600">Select City</label>
                  <select
                    {...register("city")}
                    className="border-none bg-amber-50 p-1 w-full font-medium rounded-lg"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mx-3">
                  <label className="font-bold text-gray-600">Select Area</label>
                  <select
                    {...register("area")}
                    className="border-none bg-amber-50 p-1 w-full font-medium rounded-lg"
                  >
                    <option value="">Select Area</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="m-3 flex flex-col">
                <label className="font-bold text-gray-600">
                  Street Address
                </label>
                <input
                  className="border-none bg-amber-50 p-3 w-full font-medium rounded-lg"
                  type="text"
                  {...register("street")}
                  placeholder="Kashmir Road, House No R31"
                />
              </div>
            </div>

            <div className="container flex flex-col">
              <h3 className="font-bold mt-3 md:text-2xl">
                Contact Information
              </h3>
              <hr />
              <label
                htmlFor="phone"
                className="font-bold text-gray-600 mt-3 mx-3"
              >
                WhatsApp Number <span className="text-sm"> ( Optional ) </span>
                <input
                  className="border-none bg-amber-50 p-3 w-full font-medium rounded-lg"
                  type="tel"
                  id="phone"
                  {...register("phone", {
                    pattern: {
                      value: /^923\d{9}$/,
                      message:
                        "Please provide a valid Pakistani mobile number in 923123456789 format",
                    },
                  })}
                  placeholder="923123456789"
                />
              </label>
              {errors?.phone && toast.error(errors.phone.message)}
              <label
                htmlFor="email"
                className="font-bold text-gray-600 mt-3 mx-3"
              >
                Email
                <div className="border-none bg-amber-50 p-3 w-full font-medium rounded-lg">
                  {currentUser.email}
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disable={loading ? "false" : "true"}
            className="bg-blue-500 text-white font-bold mt-3 mx-auto w-full rounded-lg hover:bg-red-600 sm:col-span-2 p-3"
          >
            {loading ? "Loading..." : "Create Advertisement"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateListing;
