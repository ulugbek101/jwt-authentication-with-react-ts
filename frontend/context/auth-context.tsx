import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { baseURL } from "../utils/constants";
import {
	AuthContextProps,
	AuthContextProviderProps,
	AuthTokens,
	User,
} from "../utils/models";

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	authTokens: null,
	loginUser: async () => {},
	updateUser: () => {},
	logoutUser: () => {},
	setUser: () => {},
	setAuthTokens: () => {},
});

function getTokensFromLocalStorage(): AuthTokens | null {
	const storedTokens = localStorage.getItem("authTokens");
	if (storedTokens) {
		try {
			return JSON.parse(storedTokens) as AuthTokens;
		} catch (error) {
			console.log("Error parsing authTokens from localStorage", error);
			return null;
		}
	}
	return null;
}

function getUserFromAuthToken(authTokens: AuthTokens | null): User | null {
	if (authTokens && authTokens.access) {
		try {
			return jwtDecode<User>(authTokens.access);
		} catch (error) {
			console.log("Error decoding access token", error);
			return null;
		}
	}
	return null;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
		getTokensFromLocalStorage()
	);
	const [user, setUser] = useState<User | null>(() =>
		getUserFromAuthToken(authTokens)
	);
	const navigate = useNavigate();

	async function loginUser(email: string, password: string) {
		try {
			const response = await axios.post(`${baseURL}/api/v1/token/`, {
				email,
				password,
			});
			const decodedResponse: AuthTokens = response.data;
			setUser(jwtDecode<User>(decodedResponse.access));
			setAuthTokens(decodedResponse);
			localStorage.setItem("authTokens", JSON.stringify(decodedResponse));
			navigate("/");
		} catch (error) {
			console.log(error);
			console.log("Authentication error");
		}
	}

	function updateUser(newUser: User) {}

	function logoutUser() {
		setUser(null);
		setAuthTokens(null);
		localStorage.removeItem("authTokens")
		navigate("/login");
	}

	const defaultValue: AuthContextProps = {
		user,
		authTokens,
		setUser,
		setAuthTokens,
		loginUser,
		updateUser,
		logoutUser,
	};

	return (
		<AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
	);
}

export default AuthContextProvider;
