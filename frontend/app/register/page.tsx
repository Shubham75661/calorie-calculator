"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setfirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    let router = useRouter()

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({first_name, last_name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Login failed");
            return;
        }
        alert("Registration successful!");
        router.push("/login")
    }

  return (
    <div className="flex pt-10 flex-col justify-center">
      {/* <blockquote className="text-center text-2xl font-semibold text-gray-900 italic dark:text-white mb-7">
      CALORIE {" "}
        <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-blue-400">
          <span className="relative text-white dark:text-gray-950">CALCULATOR</span>
        </span>
      </blockquote> */}
      <h3 className="flex-1 pt-2 pb-2 text-md md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-center">MealMind</h3>
      <div className="flex flex-col gap-2 self-center rounded-sm bg-white dark:bg-gray-800 px-7 border-1 rounderd-md shadow-2xl p-3">
        <div className="flex flex-col gap-1">
          <label className="font-mono"> First Name </label>
          <input 
            type="text" 
            id="first_name" 
            name="first_name" 
            placeholder="first name" 
            value={first_name}
            onChange={(e) => setfirst_name(e.target.value)}
            className="rounded-b-md border-2 bg-gray-100 p-2 text-black" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono"> Last Name </label>
          <input 
            type="text" 
            id="last_name" 
            name="last_name" 
            placeholder="last name" 
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
            className="rounded-b-md border-2 bg-gray-100 p-2 text-black" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono"> Username </label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Username" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-b-md border-2 bg-gray-100 p-2 text-black" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono"> Password </label>
          <input 
            id="password" 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-b-md border-2 bg-gray-100 p-2 text-black"
           />
        </div>
        <div className="flex">
          <button 
            className="flex-1 font-mono rounded-sm bg-green-500 p-2"
            onClick={handleRegister}
            >Register</button>
        </div>
        <div></div>
      </div>
    </div>
  );
}
