import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const NavBar = () => {
  const navigate = useNavigate();
  const volunteer_obj = JSON.parse(localStorage.getItem("volunteer_token"));
  const volunteer_user_id = volunteer_obj.volunteer_user_id;
  return (
    <ul className="navbar pt-2 pb-6">
      <li className="navbar__item pl-10 mr-12">
        <NavLink className="btn-navbar" to={"/"}>
          Volunteer Connection
        </NavLink>
      </li>
      <li className="navbar__item pl-10">
        <NavLink className="btn-navbar" to={`/Profile/${volunteer_user_id}`}>
          Profile Img
        </NavLink>
      </li>
      {/* <li className="navbar__item">
        <NavLink className="btn-navbar" to={"/myposts"}>
          My Posts
        </NavLink>
      </li>
      <li className="navbar__item">
        <NavLink className="btn-navbar" to={"/createpost"}>
          Create Post
        </NavLink>
      </li>
      <li className="navbar__item">
        <NavLink className="btn-navbar" to={"/categorymanager"}>
          Category Manager
        </NavLink>
      </li>
      <li className="navbar__item">
        <NavLink className="btn-navbar" to={"/tagmanager"}>
          Tag Manager
        </NavLink>
      </li> */}
      {/* <li className="navbar__item">
        <NavLink className="btn-navbar" to={"/users"}>
          User Profiles
        </NavLink>
      </li> */}
      <li className="navbar__item -translate-y-2">
        <button
          className="btn-delete"
          onClick={() => {
            localStorage.removeItem("volunteer_token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </li>
    </ul>
  );
};
