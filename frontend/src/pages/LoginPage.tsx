import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

function LoginPage() {
	const navigate = useNavigate();
	const { user, loginUser } = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

	function handleUserLogin() {
		console.log("Logging in ...");
		loginUser(email, password);
	}

	return (
		<form>
			<input
				value={email}
				onChange={e => setEmail(e.target.value)}
				type="email"
				name="email"
				id="email"
				placeholder="E-mail"
			/>
			<input
				value={password}
				onChange={e => setPassword(e.target.value)}
				type="password"
				name="password"
				id="password"
			/>
			<button onClick={handleUserLogin} type="button">
				Login
			</button>
		</form>
	);
}

export default LoginPage;
