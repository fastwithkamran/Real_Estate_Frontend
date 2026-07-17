import { Link } from "react-router";

function Home() {
  return (
    <>
      <div className="my-6 md:my-16 mx-6 sm:mx-12 lg:mx-24 flex flex-col md:flex-row">
        <div className="font-bold lg:text-6xl text-3xl text-black">
          Find your next perfect
          <div className="text-slate-700">place with ease</div>
          <div className="text-sm mt-3 mb-3 md:mt-5 text-slate-500">
            Browse listings for luxury homes, flats,
            <div>and commercial plots with ease and comfortable support</div>
          </div>
          <Link
            to="/search"
            className="inline-block bg-blue-500 rounded-full mt-5 p-3 text-sm md:text-2xl text-amber-50 hover:bg-gray-600"
          >
            Browse Now...
          </Link>
        </div>
        <img
          src="./hero.png"
          alt="hero"
          className="w-100 h-50 object-cover border rounded ml-15 hidden md:block"
        />
      </div>
    </>
  );
}

export default Home;
