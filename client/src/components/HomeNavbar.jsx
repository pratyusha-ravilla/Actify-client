// import { Link } from "react-router-dom";
// import "./HomeNavbar.css";

// export default function HomeNavbar() {
//   return (
//     <nav className="home-navbar">
//       <div className="navbar-container">

//         {/* Logo */}
//         <div className="logo">
//           <Link to="/">Actify</Link>
//         </div>

//         {/* Menu */}
//         <ul className="nav-links">
//           <li><a href="#home">Home</a></li>
//           <li><a href="#features">Features</a></li>
//           <li><a href="#roles">Who Uses</a></li>
//           <li><a href="#contact">Contact</a></li>
//         </ul>

//         {/* Actions */}
//         <div className="nav-actions">
//           <Link to="/login" className="nav-btn outline">Login</Link>
//           <Link to="/register" className="nav-btn primary">Register</Link>
//         </div>

//       </div>
//     </nav>
//   );
// }



import { Link } from "react-router-dom";
import "./HomeNavbar.css";

export default function HomeNavbar() {
  return (
    <nav className="home-navbar">
      <div className="logo">Actify</div>

      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#roles">Roles</a></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
