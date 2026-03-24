// src/page/Login.jsx
import React, { useState } from 'react';
import Waves from '../Components/Wave';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../Components/API/api.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  
  const handlesubmit=async(e)=>{
    e.preventDefault();
    try {
        const res = await api.post("/api/login",{
          email,password
        });
        setEmail("");
        setPassword("");
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("role",res.data.user.role);
        const role = res.data.user.role;
        if(role === "teacher"){
          navigate("/dashboard");  // allow teacher to access
        } else {
          alert("Try to login Dashboard"); // deny access
          navigate("/"); // or redirect to attendance page
        }
    } catch (error) {
      if(error.response){
          console.log(error.response.data);
          alert(error.response.data.message || "Failed to Login");
        } else {
          alert("Failed to Login");
      }
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-blue-700">
      
      {/* Waves background (FULL SCREEN) */}
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

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-15">
          <h2 className="text-xl text-start font-bold  text-gray-800">
            Welcome Back
          </h2>
          <p className='mb-15 text-gray-600 text-shadow-md'>Inter Your Information</p>

          <form onSubmit={handlesubmit} className="space-y-4 mb-40">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <div className='flex justify-between'>
              <div className='flex gap-2'>
                <input type="checkbox" className='size-5 border-2' />
                <p className='text-sm font-medium'>Remember me</p>
              </div>
              <p className='text-blue-800 text-sm font-medium'>Forgot password?</p>
            </div>
            <button type='submit' className="w-full cursor-pointer bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition">
              Sign In
            </button>
            <button type='' className="w-full relative font-bold cursor-pointer text-black  py-3 rounded-lg border border-gray-300 transition">
            <img src="/Images/g1.png" className='w-15 h-11 top-0 left-8 mt-1  absolute' alt="ok" />
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 font-medium text-sm">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-blue-600 underline">
              Register
            </NavLink>
          <NavLink to="/attendance" className="hover:underline text-red-600  ms-2">Back</NavLink>
          </p>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;