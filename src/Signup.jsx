import { useState } from "react";
import { auth } from "./firebase"; // Ensure your Firebase configuration is correctly set up in this file
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setNotice("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("./home"); // Redirect to profile or another page after successful signup
    } catch (error) {
      setNotice("Failed to create an account. " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <FaCircleUser className="user" />
        <form className="col-md-4 mt-3 pt-3 pb-3">
          {notice !== "" && (
            <div className="alert alert-warning" role="alert">
              {notice}
            </div>
          )}
          <div className="contenedor_usuario">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="contenedor_usuario">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="contenedor_usuario">
            <label htmlFor="exampleInputPassword2" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary pt-3 pb-3"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </div>
          <div className="mt-3 text-center">
            <span
              className="login-link"
              onClick={() => navigate("/")}
              style={{
                cursor: "pointer",
                color: "#007bff",
                textDecoration: "underline",
              }}
            >
              Already have an account? Click here to log in.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
