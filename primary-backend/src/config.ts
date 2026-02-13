
export const JWT_PASSWORD = process.env.JWT_PASSWORD || "";
if (!JWT_PASSWORD) {
  console.error("JWT_PASSWORD is not set in environment variables");
}
