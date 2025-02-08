export async function fetchScheduleData(year) {
  try {
    const response = await fetch(`http://localhost:8081/schedule/${year}`);
    // console.log("Response:", response);
    if (!response.ok) {
      throw new Error("Failed to fetch schedule data");
    }
    const result = await response.json();
    // console.log("Result:", result);
    return result;
  } catch (err) {
    console.error("Error fetching schedule data", err);
    throw err;
  }
}

// services/authService.js

const API_URL = "http://localhost:8081";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json(); // Повертає дані користувача
  } catch (error) {
    throw new Error(error.message || "An error occurred during login");
  }
};

export const signUp = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sign up failed");
    }

    return await response.json(); // Повертає результат реєстрації
  } catch (error) {
    throw new Error(error.message || "An error occurred during sign up");
  }
};
