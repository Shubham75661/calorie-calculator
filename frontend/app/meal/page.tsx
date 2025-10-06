"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import {motion} from "framer-motion"
import {lazy, Suspense} from "react"
import Loader from "@/components/loader";



const ShowData = lazy(() => import("@/components/showData"))
interface CalorieResponse {
    dish_name: string;
    servings: number;
    calories_per_serving: number;
    total_calories: number;
    source: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem("accessToken");

    const defaultHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
    };

    let res = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
        credentials: "include",
    });
    console.log("status",res.status)
    if (res.status === 401) {
        console.log("Here")
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Not authenticated");

        const refreshRes = await fetch("http://localhost:8000/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!refreshRes.ok) {
            throw new Error("Session expired. Please log in again.");
        }

        const refreshData = await refreshRes.json();
        localStorage.setItem("accessToken", refreshData.accessToken);
        localStorage.setItem("refreshToken", refreshData.refreshToken);

        // Retry original request with new token
        accessToken = refreshData.accessToken;

        res = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                "Authorization": `Bearer ${accessToken}`,
                ...(options.headers || {}),
            },
            credentials: "include",
        });
    }

    return res;
}


export default function Meal(){
    const [dishName, setDishName] = useState("");
    const [servings, setServings] = useState(1);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setisLoading] = useState(false)
    const [calorieData, setCalorieData] = useState<CalorieResponse | null>(null);

    async function fetchCalories(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setResult(null);
        setisLoading(true)
        try {
            const res = await fetchWithAuth("http://localhost:8000/get-calories", {
                method: "POST",
                body: JSON.stringify({
                    dish_name: dishName,
                    servings: servings,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to fetch calories");
            }

            const data: CalorieResponse = await res.json();
            setCalorieData(data);

        } catch (err: any) {
            setError(err.message);
            // router.push("/login")
        }
        setisLoading(false)
    }

    return (
        <div className="max-w-md mx-auto h-max max-h-max mt-10 p-4 shadow-md rounded-lg bg-white dark:bg-gray-700 justify-center items-center border-1">
        {isLoading && (
            <Loader/>
        )}
        <h2 className="text-2xl font-semibold mb-4 text-center">🍽 Get Calories</h2>
        <form onSubmit={fetchCalories} className="flex flex-col gap-4 ">
            <input
                type="text"
                placeholder="Enter dish name (e.g. pizza)"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="border p-2 rounded"
                required
            />
            <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
            Get Calories
            </button>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {calorieData && (
            <div className="pt-4 flex flex-row justify-evenly">
                <ShowData location = "calories" value={calorieData.dish_name} title = "Dish Name"></ShowData>
                <ShowData location = "food" value={calorieData.calories_per_serving} title = "Per Serving"></ShowData>
                <ShowData location = "foodTotal" value={calorieData.total_calories} title = "Total Calories"></ShowData>
            </div>
        )}
        </div>
    );
}