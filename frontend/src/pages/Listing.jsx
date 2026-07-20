import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaBed, FaBath, FaParking, FaCouch } from "react-icons/fa";

function Listing() {
  const [listing, setListing] = useState(undefined);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/property/propertyInfo/${id}`, {
          method: "GET",
        });
        const result = await response.json();

        if (response.ok) {
          setListing(result);
        } else {
          navigate("/search");
          toast.error(result.msg);
        }
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [navigate, id]);

  return !listing ? (
    <div className="text-center text-2xl">Something went wrong.. Refresh</div>
  ) : (
    (() => {
      const descriptions = JSON.parse(listing.description);
      const subject = `PAKLANDS: Customer is Interested in ${listing.title}`;
      const body = `Hey, ${listing.createdBy.fullName}\n\nCustomer is Interest for your property ${listing.title} through PakLands... Reply this Email as Soon`;
      const encodedBody = encodeURIComponent(body);
      const message = `Hey, ${listing.createdBy.fullName}\n\nCustomer is Interest for your property ${listing.title} through PakLands... Reply them as Soon`;
      const encodedMessage = encodeURIComponent(message);

      return (
        <>
          <div className="mr-auto ml-2">
            <button
              navigate="-1"
              className="text-2xl font-medium text-slate-500 hover:text-blue-600"
            >
              Back
            </button>
          </div>
          <Swiper
            modules={[Navigation]}
            navigation={true}
            className="w-full h-96 bg-slate-300"
          >
            {listing.propertyImages.map((url) => (
              <SwiperSlide key={url}>
                <img
                  src={url}
                  alt="Images"
                  className="w-full h-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <h1 className="text-center flex-wrap text-slate-700 font-bold text-3xl mt-3">
            {listing.title}
          </h1>
          <p className="text-sm text-blue-900 flex sm:items-center">
            <FaMapMarkedAlt className="text-green-700 mr-2 hidden sm:block" />
            {listing.street}, {listing.area}, {listing.city}, {listing.province}
          </p>

          {listing.sell ? (
            <button
              type="button"
              className="bg-red-900 px-4 py-1 mt-2 rounded-md text-2xl text-white"
            >
              FOR SALE
            </button>
          ) : (
            <button
              type="button"
              className="bg-red-900 px-4 py-1 mt-2 rounded-md text-2xl text-white"
            >
              FOR RENT
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 w-full p-4 mt-4 gap-5 justify-items-center sm:justify-items-start">
            <div>
              <h3 className="font-bold text-2xl text-slate-800">Features:</h3>
              <ol className="list-decimal mx-4 mt-2 text-md text-blue-800">
                {descriptions?.map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ol>

              <h3 className="font-bold text-2xl text-slate-800 mt-2">Price:</h3>
              <span className="text-blue-800 text-xl md:text-2xl ml-2">
                {listing.price}
              </span>

              <h3 className="font-bold text-2xl text-slate-800 mt-2">
                Amenities:
              </h3>
              <div className="flex flex-wrap gap-6 text-sm text-green-700 mt-2">
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
                <div className="flex items-center gap-2">
                  <FaParking />
                  {listing.parking ? "Parking Spot" : "No Parking"}
                </div>
              </div>
            </div>

            <div className="bg-white border-2 rounded-md sm:ml-auto p-6 text-center w-fit">
              <img
                src={listing.createdBy.avator}
                alt="Profile Image"
                className="h-30 w-30 mx-auto object-cover"
              />
              <div className="mt-2 font-bold">
                Created By: {listing.createdBy.fullName}
              </div>
              <h3 className="mt-2 font-bold mb-2">
                Interested in this property?
              </h3>
              <div className="flex flex-col">
                <a
                  href={`mailto:${listing.createdBy.email}?subject=${encodeURIComponent(subject)}&body=${encodedBody}`}
                  className="bg-blue-500 text-white font-bold mx-auto p-1 rounded-md hover:bg-gray-600 "
                >
                  Email
                </a>

                {listing.phone !== "null" ? (
                  <a
                    href={`https://wa.me/${listing.phone}?text=${encodedMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white font-bold mt-2 mx-auto p-1 rounded-md hover:bg-gray-600 "
                  >
                    WhatsApp
                  </a>
                ) : (
                  <a></a>
                )}
              </div>
            </div>
          </div>
        </>
      );
    })()
  );
}

export default Listing;
