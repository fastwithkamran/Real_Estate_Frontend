import { useEffect, useState } from "react";

function PropertyPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState({});
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [images, setImages] = useState({});
  const [isallowWhatsApp, setAllowWhatsApp] = useState(false);
  const [isallowEmail, setAllowEmail] = useState(false);
  const [sellerName, setSellerName] = useState("undefined");
  const [sellerEmail, setSellerEmail] = useState("undefined");
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState("undefined");
  const subject = `PAKLANDS: Customer is Interested in ${title}`;
  const body = `Hey, ${sellerName}\n\nCustomer is Interest for your property ${title} through PakLands... Reply this Email as Soon`;
  const encodedBody = encodeURIComponent(body);
  const message = `Hey, ${sellerName}\n\nCustomer is Interest for your property ${title} through PakLands... Reply them as Soon`;
  const encodedMessage = encodeURIComponent(message);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_PROPERTY_INFO_API, {
          method: "GET",
        });
        const result = await response.json();

        if (response.ok) {
          setTitle(result.title);
          setDescription(result.description);
          setProvince(result.province);
          setCity(result.city);
          setArea(result.area);
          setStreet(result.street);
          setImages(result.propertyImages);
          setAllowWhatsApp(result.allowWhatsApp);
          setAllowEmail(result.allowEmail);
          setSellerName(result.fullName);
          setSellerEmail(result.email);
          setSellerPhoneNumber(result.phone);
        } else {
          alert(`Error: ${result.msg}`);
        }
      } catch (error) {
        alert("Frontend API Call Failed");
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="font-bold text-5xl"> {title} </h1>
      <p className="text-sm">
        {street}, {area}, {city}, {province}, Pakistan
      </p>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full">
        {images.forEach((element) => {
          <img src={element} alt="Image" />;
        })}
      </div>

      <div className="grid grid-cols-2 items-start gap-6 w-full">
        <div className="w-full">
          <h3 className="font-bold text-4xl text-blue-800">Features</h3>
          <ol className="list-decimal mx-4 ">
            {description.forEach((element) => {
              <li>{element}</li>;
            })}
          </ol>
        </div>

        <div className=" flex justify-end">
          <div className="w-1/2 h-1/4 bg-white border-2 rounded-2xl mt-2 p-4 text-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIDHxvLx7p1wY2xK4Xvet4kdrXToHtv1X5dLVDoQ57GQ&s=10"
              alt="Profile Image"
              className="h-20  mx-auto"
            />
            <div className="mt-2 font-bold"> Created By: ${sellerName}</div>
            <h3 className="mt-2 font-bold">Interested in this property?</h3>
            {isallowEmail} ?
            <a
              href={`mailto:${sellerEmail}?subject=${subject}&body=${encodedBody}`}
              className="bg-blue-500 text-white font-bold mt-3 mx-auto px-2 rounded-md hover:bg-gray-600 "
            >
              Email
            </a>
            : <a></a>
            {isallowWhatsApp} ?
            <a
              href={`https://wa.me${sellerPhoneNumber}?text=${encodedMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white font-bold mt-3 mx-auto px-2 rounded-md hover:bg-gray-600 "
            >
              WhatsApp
            </a>
            : <a></a>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyPage;
