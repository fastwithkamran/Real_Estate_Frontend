function SellerHome() {
  return (
    <main>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-cols-2 w-full mt-2">
        <img
          src="/home_1.png"
          alt="home_1"
          className="w-full object-cover h-full"
        />
        <div className="mx-auto my-auto grid grid-rows-3 gap-4">
          <a className="my-auto font-bold text-blue-900 md:text-3xl text-2xl underline hover:text-red-600 " href="/create-post">
            Create Post
          </a>
          <a className="my-auto font-bold text-blue-900 md:text-3xl text-2xl underline hover:text-red-600 " href="/view-analytics">
            View Analytics
          </a>
          <a className="my-auto font-bold text-blue-900 md:text-3xl text-2xl underline hover:text-red-600 " href="/all-posts">
            View All Posts
          </a>
        </div>
        <img
          src="/home_3.png"
          alt="home_3"
          className="w-full object-cover h-full hidden md:block "
        />
      </div>
    </main>
  );
}

export default SellerHome;
