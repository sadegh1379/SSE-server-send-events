"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:5000/api/users/users-stream"
    );

    eventSource.onmessage = (event) => {
      const user = JSON.parse(event.data);
      setUsers((prev) => [...prev, user]);
    };

    eventSource.addEventListener("end", () => {
      console.log("Stream ended");
      eventSource.close();
    });

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 text-center pt-5 bg-gray-800">
      <h1 className="text-3xl font-bold text-white">SSE</h1>
      <div className="flex flex-col gap-4 p-4">
        {users.map((user, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-2 shadow-md">
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-gray-300">ID: {user.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
