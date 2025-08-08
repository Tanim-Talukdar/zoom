import React from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Auth() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0); 
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    try {
      if (formState === 0) {
        let result = await handleLogin(email, password);
        console.log("Login Done");
      } else {
        let result = await handleRegister(name, email, password);
        console.log(result);
        setEmail("");
        setMessage(result);
        setOpen(true);
        setError("");
        setFormState(0);
        setPassword("");
      }
    } catch (err) {
      console.log(err);
      let message = err.response?.data?.message || "Something went wrong";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Sweet Meet</h1>

        <div className="text-center mb-6">
          <button
            onClick={() => setFormState(0)}
            className={`mx-2 px-6 py-1 border ${formState === 0 ? "bg-blue-500 text-white" : "text-black"} rounded-2xl cursor-pointer font-semibold`}
          >
            Login
          </button>
          <button
            onClick={() => setFormState(1)}
            className={`px-6 py-1 border ${formState === 1 ? "bg-blue-500 text-white" : "text-black"} rounded-2xl cursor-pointer font-semibold`}
          >
            Register
          </button>
        </div>

        {formState === 1 && (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-sm">{message}</p>}

        <button
          onClick={handleAuth}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer mb-4"
        >
          {formState === 0 ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}
