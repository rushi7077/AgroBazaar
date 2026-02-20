import { jwtDecode } from "jwt-decode";
import { getToken } from "../utils/token";

export default function Profile() {
    const token = getToken();
    if (!token) return <p className="p-6">Not logged in</p>;

    const user = jwtDecode(token);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">My Profile</h1>
            <p><b>Name:</b> {user.sub}</p>
            <p><b>Role:</b> {user.role || user.authorities?.[0]}</p>
        </div>
    );
}
