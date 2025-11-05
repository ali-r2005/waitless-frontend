import { createApi } from "./api";
const serviceB = createApi(process.env.NEXT_PUBLIC_API_B_URL || "https://api-b.example.com");
export default serviceB;