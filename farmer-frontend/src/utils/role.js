import { jwtDecode } from "jwt-decode";
import { getToken } from "./token";

export const getRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || decoded.authorities?.[0] || null;
  } catch {
    return null;
  }
};
