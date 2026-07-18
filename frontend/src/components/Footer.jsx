import { Link } from "react-router";

function Footer() {
  return (
    <>
      <div className="bg-black w-full">
        <div className="grid md:grid-cols-4 grid-cols-1 bg-slate-200 md:p-3 p-1 gap-4">
          <div className="flex flex-col items-center text-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="md:w-48 w-36 h-auto object-cover"
            />
            <h3 className="text-black text-2xl font-bold">PAKLANDS</h3>
            <p className="text-black text-sm">
              Created my first MERN Project. It is a platform for Pakistanis to
              sell their properties online.
            </p>
          </div>

          <div className="flex flex-col text-center">
            <h3 className="font-bold text-black text-2xl">Quick Links</h3>
            <div className="flex flex-col">
              <Link
                to="/"
                className="text-blue-500 cursor-pointer hover:text-red-700"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-blue-500 cursor-pointer hover:text-red-700"
              >
                Login
              </Link>
              <Link
                to="/profile"
                className="text-blue-500 cursor-pointer hover:text-red-700"
              >
                Profile
              </Link>
              <Link
                to="/create-listing"
                className="text-blue-500 cursor-pointer hover:text-red-700"
              >
                CreateListing
              </Link>
            </div>
          </div>

          <div className="flex flex-col text-center">
            <h3 className="font-bold text-black text-2xl">Support</h3>
            <div className="flex flex-col items-center">
              <Link
                to="/"
                className="text-blue-500 flex justify-start cursor-pointer hover:text-red-700"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-blue-500 flex justify-start cursor-pointer hover:text-red-700"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/"
                className="text-blue-500 flex justify-start cursor-pointer hover:text-red-700"
              >
                Developer & Details
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center mb-2">
            <h3 className="font-bold text-black text-2xl">Connect</h3>
            <div className="flex flex-row gap-2 mt-2">
              <a href="https://www.instagram.com">
                <img
                  className="w-10 h-10"
                  src="https://img.freepik.com/premium-vector/instagram-logo_976174-11.jpg?semt=ais_hybrid&w=740&q=80"
                />
              </a>

              <a href="https://www.facebook.com">
                <img
                  className="w-10 h-10"
                  src="https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo"
                />
              </a>
            </div>

            <div className="flex flex-row gap-2 mt-2">
              <a href="https://www.linkedin.com">
                <img
                  className="w-10 h-10 object-cover"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0bGEl9v47XieEtHyj0TqTr1tOXJmib-KHtw&s"
                />
              </a>
              <a href="https://www.twitter.com">
                <img
                  className="w-10 h-10"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/X_%28formerly_Twitter%29_logo_late_2025.svg/250px-X_%28formerly_Twitter%29_logo_late_2025.svg.png"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm border-t border-slate-200 text-center text-slate-700">
        2026 Developed By <span className="font-bold">Kamran</span>
      </div>
    </>
  );
}

export default Footer;
