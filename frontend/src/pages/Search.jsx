import { useState } from "react";

function Search() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-2 md:min-h-screen">
      <div className="border-r-2 border-slate-300 text-black p-2">
        <form className="font-semibold">
          <div className="flex flex-col md:flex-row items-center gap-2 whitespace-nowrap">
            <label>Search Term:</label>
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 items-center">
              <label>Type:</label>
              <div>
                <input type="checkbox" className="w-5" />
                <span>Sale</span>
              </div>
              <div>
                <input type="checkbox" className="w-5" />
                <span>Rent</span>
              </div>
              <div>
                <input type="checkbox" className="w-5" />
                <span>Residential</span>
              </div>
              <div>
                <input type="checkbox" className="w-5" />
                <span>Commercial</span>
              </div>
              <div>
                <input type="checkbox" className="w-5" />
                <span>Land/Plot</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              <label>Amenities:</label>
              <div>
                <input type="checkbox" className="w-5" />
                <span>Parking</span>
              </div>
              <div>
                <input type="checkbox" className="w-5" />
                <span>Furnished</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <label>Sort:</label>
              <select
                id="sort_order"
                className="border rounded-lg bg-white px-2"
              >
                <option value="">Price high to low</option>
                <option value="">Price low to high</option>
                <option value="">Latest</option>
                <option value="">Oldest</option>
              </select>
            </div>
          </div>

          <div className="mt-6 mb-3">
            <button
              disable={loading ? "false" : "true"}
              type="submit"
              className="bg-slate-700 disabled:opacity-80 text-white font-bold p-3 w-full rounded-lg hover:opacity-95"
            >
              {loading ? "Loading..." : "SEARCH"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col">
        <h3 className="font-medium text-2xl">Listing Results: </h3>
        <hr className="mt-1 text-slate-300 border-2" />
      </div>
    </div>
  );
}

export default Search;
