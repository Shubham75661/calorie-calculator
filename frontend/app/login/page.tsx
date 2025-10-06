"use client"
import { useState } from "react";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Login failed");
            return;
        }

        console.log("Printing login Data :- ",data)

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.user.refresh_token);

        alert("Login successful!");
    }

  return (
    <div className="flex h-screen flex-col justify-center gap-2">
      <blockquote className="text-center text-2xl font-semibold text-gray-900 italic dark:text-white mb-7">
      CALORIE {" "}
        <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-blue-400">
          <span className="relative text-white dark:text-gray-950">CALCULATOR</span>
        </span>
      </blockquote>
      <div className="flex flex-col gap-6 self-center rounded-sm bg-white px-7 pt-7 border-1 rounderd-md">
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
            className="flex-1 font-mono rounded-sm bg-blue-400 p-2"
            onClick={handleLogin}
            >Submit</button>
        </div>
        <div></div>
      </div>
    </div>
  );
}
