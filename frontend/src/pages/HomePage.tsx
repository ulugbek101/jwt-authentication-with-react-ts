import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import useAxios from "../../hooks/useAxios";
import { baseURL } from "../../utils/constants";
import { User } from "../../utils/models";

function HomePage() {
	const { logoutUser } = useContext(AuthContext);
	const axiosInstance = useAxios();
	const [users, setUsers] = useState<User[]>([]);

	async function fetchUsers() {
		try {
			const response = await axiosInstance.get(`${baseURL}/api/v1/auth/users/`);
			setUsers(response.data);
		} catch (error) {
			// ...
		}
	}

	return (
		<>
			<h1 className="text-2xl font-bold text-red-500">Hello world!</h1>
			<button onClick={fetchUsers}>Fetch users</button>
			<button onClick={logoutUser}>Logout</button>
			{users && users.map(user => <p key={user.id}>{user.username}</p>)}
		</>
	);
}

export default HomePage;
