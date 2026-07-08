import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function Login() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/");
        reset();
      } else {
        alert(result.msg);
      }
    } catch (error) {
      alert("Frontend API Call Error to Server, see console");
      console.log("Error", error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-200 p-4">
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl mb-4">
          Login
        </h1>

        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md lg:gap-2 gap-1 p-6 rounded-md bg-blue-300 flex flex-col"
        >
          <label className="font-bold mt-3">Email</label>
          <input
            className="border border-gray-300 bg-amber-50 px-3"
            type="text"
            {...register("email")}
            placeholder="Enter your email"
          />
          <label className="font-bold mt-3">Password</label>
          <input
            className="border border-gray-300 bg-amber-50 px-3"
            type="password"
            {...register("password")}
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
          >
            Login
          </button>
        </form>
        <form
          action="/user/signup"
          className="w-full max-w-md p-6 rounded-md bg-blue-800 flex flex-col mt-3"
        >
          <label className="font-bold mt-3 lg:text-2xl text-blue-100 flex justify-center">
            New User:
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
          >
            Let's SignUp
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
