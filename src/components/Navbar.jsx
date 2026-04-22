import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navItems = [
  { to: '/', label: '🏠 होम', exact: true },
  { to: '/register', label: '👤 पंजीकरण' },
  { to: '/loan-apply', label: '📝 ऋण आवेदन' },
  { to: '/approval', label: '✅ अनुमोदन' },
  { to: '/payments', label: '💳 भुगतान' },
  { to: '/interest', label: '🧮 ब्याज कैलकुलेटर' },
  { to: '/reports', label: '📊 रिपोर्ट' },
  { to: '/support', label: '❓ सहायता' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🌸</span>
        <div>
          <div className="brand-title">महिला ऋण सेवा</div>
          <div className="brand-sub">2% ब्याज दर</div>
        </div>
      </div>
      <ul className="navbar-links">
        {navItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.exact}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
