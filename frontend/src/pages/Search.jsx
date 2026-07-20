import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaLocationDot } from "react-icons/fa6";
import { FaBed, FaBath, FaCouch } from "react-icons/fa";

function Search() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const { register, watch } = useForm();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const selectedProvince = watch("province");
  const selectedCity = watch("city");
  const selectedArea = watch("area");

  const [sidebarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    rent: false,
    sell: false,
    parking: false,
    furnish: false,
    sort: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/property/allProperties");
        setLoading(true);
        setShowMore(false);
        const result = await response.json();
        if (response.ok) {
          if (result.length < 9) {
            setShowMore(false);
          } else setShowMore(true);
          setListings(result);
        } else {
          setShowMore(true);
          toast.error(result.msg);
        }
        setLoading(false);
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
        setLoading(false);
        setShowMore(false);
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, []);

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
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setAreas([]);
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

  const handleChange = async (e) => {
    if (
      e.target.id === "Residential (houses, flats)" ||
      e.target.id === "Commercial (offices, shops)" ||
      e.target.id === "Land/Plots"
    ) {
      setSideBarData({ ...sidebarData, type: e.target.id });
    }

    if (
      e.target.id === "sell" ||
      e.target.id === "rent" ||
      e.target.id === "parking" ||
      e.target.id === "furnish"
    )
      setSideBarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });

    if (e.target.id === "searchTerm")
      setSideBarData({ ...sidebarData, searchTerm: e.target.value });

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowMore(false);
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnish", sidebarData.furnish);
    urlParams.set("sell", sidebarData.sell);
    urlParams.set("rent", sidebarData.rent);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    urlParams.set("province", selectedProvince);
    urlParams.set("city", selectedCity);
    urlParams.set("area", selectedArea);
    const searchQuery = urlParams.toString();

    try {
      const response = await fetch(
        `/api/property/allProperties?${searchQuery}`,
      );
      const result = await response.json();

      if (response.ok) {
        navigate(`/search?${searchQuery}`);
        if (result.length < 9) {
          setShowMore(false);
        } else setShowMore(true);
        setListings(result);
      } else {
        setShowMore(false);
        toast.error(result.msg);
      }
      setLoading(false);
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      setLoading(false);
      setShowMore(false);
      toast.error("Error failed to fetch API request");
    }
  };

  const onShowMoreClick = async () => {
    const numberofListings = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", numberofListings);
    const searchQuery = urlParams.toString();
    setLoading(true);
    setShowMore(false);
    try {
      const response = await fetch(
        `/api/property/allProperties?${searchQuery}`,
      );
      const result = await response.json();

      if (response.ok) {
        if (result.length < 9) {
          setShowMore(false);
        } else setShowMore(true);
        setListings(...listings, ...result);
      } else {
        setShowMore(false);
        toast.error(result.msg);
      }
      setLoading(false);
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      setLoading(false);
      setShowMore(false);
      toast.error("Error failed to fetch API request");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-2 md:min-h-screen">
      <div className="border-r-2 border-slate-300 text-black p-2">
        <form onSubmit={handleSubmit} className="font-semibold">
          <div className="flex flex-col md:flex-row items-center gap-2 whitespace-nowrap">
            <label>Search Term:</label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 items-center">
              <label>Type:</label>
              <div>
                <input
                  type="checkbox"
                  className="w-5"
                  id="sell"
                  checked={sidebarData.sell === true}
                  onChange={handleChange}
                />
                <span>Sale</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  checked={sidebarData.rent === true}
                  onChange={handleChange}
                />
                <span>Rent</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Residential (houses, flats)"
                  className="w-5"
                  checked={sidebarData.type === "Residential (houses, flats)"}
                  onChange={handleChange}
                />
                <span>Residential</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Commercial (offices, shops)"
                  className="w-5"
                  checked={sidebarData.type === "Commercial (offices, shops)"}
                  onChange={handleChange}
                />
                <span>Commercial</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  className="w-5"
                  id="Land/Plots"
                  checked={sidebarData.type === "Land/Plots"}
                  onChange={handleChange}
                />
                <span>Land/Plots</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              <label>Amenities:</label>
              <div>
                <input
                  type="checkbox"
                  className="w-5"
                  id="parking"
                  checked={sidebarData.parking === true}
                  onChange={handleChange}
                />
                <span>Parking</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  className="w-5"
                  id="furnish"
                  checked={sidebarData.furnish === true}
                  onChange={handleChange}
                />
                <span>Furnished</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <label>Sort:</label>
              <select
                onChange={handleChange}
                defaultValue={"created_at_desc"}
                id="sort_order"
                className="border rounded-lg bg-white px-2"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <div>
              <label className="font-bold text-gray-600">Select Province</label>
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

            <div>
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

            <div>
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

          <div className="mt-6 mb-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-700 disabled:opacity-80 text-white font-bold p-3 w-full rounded-lg hover:opacity-95"
            >
              {loading ? "Loading..." : "SEARCH"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col col-span-1 lg:col-span-2">
        <h3 className="font-medium text-2xl">Listing Results: </h3>
        <hr className="mt-1 text-slate-300 border-2" />

        {!listings || listings.length === 0 ? (
          <div className="font-bold md:text-2xl mx-auto my-auto whitespace-nowrap">
            There are no properties at this time
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 w-full">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="border border-gray-300 rounded-lg p-2 shadow-md w-fit"
              >
                <img
                  src={listing.propertyImages}
                  alt="Image"
                  className="w-100 h-50 object-cover rounded-md "
                />
                <h3 className="text-lg font-medium text-center mt-2">
                  {listing.title}
                </h3>
                <p className="text-gray-700 flex items-center justify-center">
                  <FaLocationDot className="text-red-600" />
                  {listing.city}, {listing.province}
                </p>
                <p className="text-medium text-gray-700 mt-2 text-start">
                  Type: {listing.type}{" "}
                </p>
                <p className="text-medium text-slate-500 mt-4 text-start">
                  {listing.price}
                </p>
                <div className="flex gap-6 text-sm text-green-600 mt-2">
                  <p className="flex items-center gap-2">
                    <FaBed />
                    {listing.bedrooms} beds
                  </p>
                  <p className="flex items-center gap-2">
                    <FaBath />
                    {listing.bathrooms} bathrooms
                  </p>
                  <div className="flex items-center gap-2">
                    <FaCouch /> {listing.furnish ? "Furnished" : "UnFurnished"}
                  </div>
                </div>
                <Link
                  to={`/listing-page/${listing._id}`}
                  className="mt-2 bg-blue-500 text-white flex justify-center py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {showMore && (
          <div className="text-center">
            <button
              className="text-green-700 cursor-pointer mt-3"
              onClick={onShowMoreClick}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
