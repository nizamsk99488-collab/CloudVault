import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        CloudVault
      </Link>

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 text-blue-600 font-semibold"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;