"use client";
import { auth } from "@/firebase/config";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { User, sendEmailVerification } from "firebase/auth";
import { useForm } from "react-hook-form";

// Define una interfaz para el formulario
interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>(); // Aplica la interfaz aquí

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = async (data: SignUpFormData) => {
    const { email, password } = data;
    try {
      const res = await createUserWithEmailAndPassword(email, password);

      // Verifica si 'res' no es undefined antes de acceder a 'res.user'
      if (res && res.user) {
        const user: User = res.user;

        await sendEmailVerification(user);

        sessionStorage.setItem("user", "true"); // Asegúrate de que el valor sea un string
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
