// src/api/statsApi.ts

export interface ITripMonthlyData {
  month: number
  trips: number
  [key: string]: any
}

export const getTripsMonthly = async (year: number): Promise<ITripMonthlyData[]> => {
  const startTime = Date.now()
  console.log("\n=== [getTripsMonthly] START ===", { year, timestamp: new Date().toISOString() })

  try {
    const url = `http://localhost:5000/stats/trips-monthly?year=${year}`
    console.log("1. Calling direct backend:", url)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) 

    const response = await fetch(url, {
      signal: controller.signal,
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
    })

    clearTimeout(timeoutId)

    console.log("2. Response received:", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    })

    // In header để debug (có thể bỏ sau)
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    console.log("   Response headers:", headers)

    if (!response.ok) {
      const text = await response.text()
      console.warn("API returned error status:", response.status, response.statusText)
      console.warn("   Raw error body:", text.substring(0, 1000))
      return []
    }

    const contentType = response.headers.get("content-type")
    console.log("   Content-Type:", contentType)

    if (!contentType?.includes("application/json")) {
      const text = await response.text()
      console.error("Response is NOT JSON!", { contentType, body: text.substring(0, 500) })
      return []
    }

    const rawData = await response.json()
    console.log("3. Parsed JSON success:", rawData)
    console.log("   Type:", typeof rawData)
    console.log("   Is array:", Array.isArray(rawData))
    console.log("   Length:", Array.isArray(rawData) ? rawData.length : "N/A")
    console.log("   First item:", Array.isArray(rawData) ? rawData[0] : null)

    if (Array.isArray(rawData) && rawData.length > 0) {
      console.log("   Sample keys:", Object.keys(rawData[0]))
    }

    const result = Array.isArray(rawData) ? rawData : []
    console.log(`4. Final result: ${result.length} items`)
    console.log("Total time:", Date.now() - startTime, "ms")
    console.log("=== [getTripsMonthly] END ===\n")

    return result

  } catch (err: any) {
    console.error("EXCEPTION in getTripsMonthly:", {
      message: err.message,
      name: err.name,
      stack: err.stack?.split("\n").slice(0, 5).join("\n"),
      aborted: err.name === "AbortError",
    })

    if (err.name === "TypeError" && err.message.includes("fetch")) {
      console.error("   → Có thể backend chưa chạy (localhost:5000)")
    }

    console.log("=== [getTripsMonthly] ERROR END ===\n")
    return []
  }
}