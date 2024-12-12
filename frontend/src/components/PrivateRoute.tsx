import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { PrivateRouteProps } from "../../utils/models";

function PrivateRoute({ element }: PrivateRouteProps) {
	const { user } = useContext(AuthContext);

	// If the user is authenticated, render the element, else redirect to login
	return user ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
