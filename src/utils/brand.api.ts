export const fetchBrandsByCategory = async (category: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/brands/${category}`);
  const text = await res.text();
  console.log("Raw response:", text); 
  if (!res.ok) throw new Error("Failed to fetch brands");
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON:", e);
    throw new Error("Invalid JSON response from server");
  }
};

  
  export const addBrand = async (name: string, logo: string | null, category: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/brands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, logo, category }),
    });
    if (!res.ok) throw new Error("Failed to save brand");
    return res.json();
  };
  