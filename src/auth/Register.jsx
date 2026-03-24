// src/page/Register.jsx
import React, { useState } from 'react';
import Waves from '../Components/Wave';
import api from '../Components/API/api.jsx';
import { NavLink, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate=useNavigate();
  

    // handlesubmit
    const handlesubmit=async(e)=>{
      e.preventDefault()
      try {
        const res= await api.post("/api/register",{
          name,
          email,
          password,
          password_confirmation: confirm
        });
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("role",res.data.role);
        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        navigate("/login");


      } catch (error) {
        if(error.response){
          console.log(error.response.data);
          alert(error.response.data.message || "Failed to register");
        } else {
          alert("Failed to register");
        }
      }
    }
  return (
    <div className="fixed inset-0 overflow-hidden bg-blue-700">

      {/* Waves Background */}
      <div className="absolute inset-0 z-0">
        <Waves
          lineColor="#ffffff"
          backgroundColor="rgba(255,255,255,0.15)"
          waveSpeedX={0.0125}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      {/* Register Form */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-15 border border-gray-500">
          <h2 className="text-xl text-start font-bold  text-gray-800">
            Create Account
          </h2>
          <p className='mb-15 text-gray-600 text-shadow-md'>Inter Your Information</p>

          <form onSubmit={handlesubmit} className="space-y-4 mb-40">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <button type='submit' className="w-full font-bold cursor-pointer bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition">
              Register
            </button>
            <button type='' className="w-full relative font-bold cursor-pointer text-black  py-3 rounded-lg border border-gray-300 transition">
            <img src="/Images/g1.png" className='w-15 h-11 top-0 left-8 mt-1  absolute' alt="ok" />
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 font-medium text-sm">
            Already have an account?{' '}
            <NavLink to="/login" className="text-blue-600 underline">
              Sign in
            </NavLink>
            <NavLink to="/attendance" className="hover:underline text-red-600 hover:text-blue-800 ms-2">Back</NavLink>
          </p>
        </div>
      </div>

    </div>
  );

}

export default RegisterPage;