// frontend/api/statsApi.ts

// Kiểu dữ liệu số chuyến xe theo ngày
export interface ITripData {
  day: string;    // T2, T3, ..., CN
  trips: number;  // số chuyến
}

export const getTripsPerDay = async (): Promise<ITripData[]> => {
  try {
    const response = await fetch("http://localhost:5000/stats/trips-per-day");

    if (!response.ok) {
      console.warn("⚠️ API trips-per-day không tồn tại hoặc lỗi:", response.statusText);
      return []; // Trả về rỗng để Dashboard không sập
    }

    const data: ITripData[] = await response.json();
    return data;
  } catch (err) {
    console.error("⚠️ Không thể fetch trips-per-day:", err);
    return []; // fallback an toàn
  }
};
