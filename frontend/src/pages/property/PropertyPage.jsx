import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import apiFetch from "../../services/apiClient"

function PropertyPage() {
  const [title, setTitle] = useState("undefined");
  const [price, setPrice] = useState("undefined");
  const [descriptions, setDescription] = useState([]);
  const [province, setProvince] = useState("undefined");
  const [city, setCity] = useState("undefined");
  const [area, setArea] = useState("undefined");
  const [street, setStreet] = useState("undefined");
  const [images, setImages] = useState([]);
  const [isallowWhatsApp, setAllowWhatsApp] = useState(false);
  const [isallowEmail, setAllowEmail] = useState(false);
  const [sellerName, setSellerName] = useState("undefined");
  const [sellerEmail, setSellerEmail] = useState("undefined");
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState("undefined");
  const [sellerProfileImage, setSellerProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNupSKjnCIs8Z8mbmI3Nm1Huhj_wEEm-BQo522KiZjAg&s=10",
  );
  const subject = `PAKLANDS: Customer is Interested in ${title}`;
  const body = `Hey, ${sellerName}\n\nCustomer is Interest for your property ${title} through PakLands... Reply this Email as Soon`;
  const encodedBody = encodeURIComponent(body);
  const message = `Hey, ${sellerName}\n\nCustomer is Interest for your property ${title} through PakLands... Reply them as Soon`;
  const encodedMessage = encodeURIComponent(message);

  const { id } = useParams();
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
          `${import.meta.env.VITE_PROPERTY_INFO_API}/${id}`,
          {
            method: "GET",
          },
        );
        const result = await response.json();

        if (response.ok) {
          setTitle(result.title);
          setPrice(result.price);
          const descriptionArray = JSON.parse(result.description);
          setDescription(descriptionArray);
          setProvince(result.province);
          setCity(result.city);
          setArea(result.area);
          setStreet(result.street);
          setImages(result.propertyImages);
          setAllowWhatsApp(result.allowWhatsApp);
          setAllowEmail(result.allowEmail);
          setSellerName(result?.createdBy?.fullName || "Unknown Seller");
          setSellerEmail(result?.createdBy?.email || "null");
          setSellerPhoneNumber(result?.createdBy?.phone || "null");
          setSellerProfileImage(result?.createdBy?.avator);
        } else {
          toast.error(`Error: ${result.msg}`);
        }
      } catch (error) {
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [id]);

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

      <h1 className="font-bold md:text-5xl text-2xl"> {title} </h1>
      <p className="text-sm">
        📍 {street}, {area}, {city}, {province}, Pakistan
      </p>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full mt-4">
        {images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Image"
            className="object-cover w-full h-full p-2 border-2 border-amber-50 bg-blue-400"
          />
        ))}
      </div>

      <div className="grid grid-cols-2 items-start gap-6 w-full">
        <div className="w-full">
          <h3 className="font-bold text-4xl text-blue-800 mt-4">Features</h3>
          <ol className="list-decimal mx-4 mt-2">
            {descriptions?.map((element, index) => (
              <li key={index}>{element}</li>
            ))}
          </ol>

          <h3 className="font-bold text-4xl text-blue-800 mt-4">
            Price: <span className="text-black text-2xl">{price}</span>
          </h3>
        </div>

        <div className="flex justify-end">
          <div className="bg-white border-2 rounded-2xl mt-2 p-4 text-center">
            <img
              src={sellerProfileImage}
              alt="Profile Image"
              className="h-30 w-30 mx-auto object-cover"
            />
            <div className="mt-2 font-bold"> Created By: {sellerName} </div>
            <h3 className="mt-2 font-bold mb-2">
              Interested in this property?
            </h3>
            <div
              className="flex
             flex-col"
            >
              {isallowEmail ? (
                <a
                  href={`mailto:${sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodedBody}`}
                  className="bg-blue-500 text-white font-bold mx-auto p-1 rounded-md hover:bg-gray-600 "
                >
                  Email
                </a>
              ) : (
                <a></a>
              )}
              {isallowWhatsApp ? (
                <a
                  href={`https://wa.me/${sellerPhoneNumber}?text=${encodedMessage}`}
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
      </div>
    </>
  );
}

export default PropertyPage;
