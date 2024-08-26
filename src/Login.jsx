import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { getAuth } from "firebase/auth";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const loginWithUsernameAndPassword = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("./home");
    } catch {
      setNotice("You entered a wrong username or password.");
    }
  };

  const auth = getAuth();
  console.log("auth:", auth);
  const user = auth.currentUser;
  if (user !== null) {
    user.providerData.forEach((profile) => {
      console.log("Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);
    });
  }

  // Handler for navigating to the signup page
  const handleSignupNavigation = () => {
    navigate("./signup");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <FaCircleUser className="user" />
        <form className="">
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
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary pt-3 pb-3"
              onClick={(e) => loginWithUsernameAndPassword(e)}
            >
              Submit
            </button>
          </div>
          <div className="mt-3 text-center">
            {/* Replace Link with a span and navigate on click */}
            <span>
              Need to sign up for an account?{" "}
              <span
                className="signup-link"
                onClick={handleSignupNavigation}
                style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
              >
                Click here.
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
