'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // fetch("http://localhost:5000/students", {
    //   method: "GET",
    //   credentials: "include"
    // })
    //   .then((res) => {
    //     if (!res.ok) throw new Error("API lỗi hoặc bị chặn CORS");
    //     return res.json();
    //   })
    //   .then((data) => setData(data))
    //   .catch((err) => setError(err.message));
    
     fetch("http://localhost:5000/students", {
      method: "GET",
      credentials: "include"
      // KHÔNG gửi Authorization
    })
      .then((res) => {
        if (!res.ok) throw new Error("API lỗi hoặc bị chặn CORS");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message));
    

  }, []);

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Test CORS từ frontend</h1>

      {error && <p className="text-red-500">❌ Lỗi: {error}</p>}

      {data ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">✅ Dữ liệu từ backend:</h2>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>⏳ Đang gọi API...</p>
      )}

      <div className="mt-10">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </div>
    </div>
  );
}
