import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
	return (
		<Routes>
			{/* Wrapping HomePage with PrivateRoute */}
			<Route path="/" element={<PrivateRoute element={<HomePage />} />} />
			<Route path="/login" element={<LoginPage />} />
		</Routes>
	);
}

export default App;
