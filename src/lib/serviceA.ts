import { createApi } from "./api";
const serviceA = createApi(process.env.NEXT_PUBLIC_API_A_URL || "https://api-a.example.com");
export default serviceA;