import { useContext } from "react";

import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../context/auth-context";
import { baseURL } from "../utils/constants";
import { AuthTokens, User } from "../utils/models";

function useAxios() {
	const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

	const axiosInstance = axios.create({
		baseURL,
		headers: { Authorization: `Bearer ${authTokens?.access}` },
	});

	axiosInstance.interceptors.request.use(async req => {
		if (!authTokens?.refresh) return req;

		const user = authTokens?.access ? jwtDecode<User>(authTokens.access) : null;

		const isExpired = user?.exp
			? dayjs.unix(user.exp).isBefore(dayjs())
			: false;

		if (!isExpired) return req;

		try {
			const response = await axios.post(`${baseURL}/api/v1/token/refresh/`, {
				refresh: authTokens.refresh,
			});

			const newAuthTokens: AuthTokens = response.data;

			// Update local storage and state with new tokens
			localStorage.setItem("authTokens", JSON.stringify(newAuthTokens));
			setAuthTokens(newAuthTokens);
			setUser(jwtDecode<User>(newAuthTokens.access));

			req.headers.Authorization = `Bearer ${newAuthTokens.access}`;
		} catch (error) {
			console.error("Token refresh failed:", error);

			// Clear state and local storage if refresh fails
			setAuthTokens(null);
			setUser(null);
			localStorage.removeItem("authTokens");

			// Optionally throw the error to handle it elsewhere
			throw error;
		}

		return req;
	});

	return axiosInstance;
}

export default useAxios;
