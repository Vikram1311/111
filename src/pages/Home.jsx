import { useApp } from '../context/useApp';
import { formatRupee, statusLabel } from '../utils/loanUtils';
import { Link } from 'react-router-dom';

export default function Home() {
  const { members, loans, payments } = useApp();

  const activeLoans = loans.filter(l => l.status === 'active');
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const totalDisbursed = loans.filter(l => l.status !== 'rejected').reduce((s, l) => s + l.amount, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalInterestCollected = payments.reduce((s, p) => s + (p.interest || 0), 0);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="page-header">
        <h2>🌸 महिला ऋण सेवा – डैशबोर्ड</h2>
        <p>महिला संगठन के लिए 2% ब्याज पर ऋण प्रबंधन प्रणाली</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ede9fe' }}>👩</div>
          <div className="stat-info">
            <div className="value">{members.length}</div>
            <div className="label">कुल सदस्य</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
          <div className="stat-info">
            <div className="value">{activeLoans.length}</div>
            <div className="label">सक्रिय ऋण</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
          <div className="stat-info">
            <div className="value">{pendingLoans.length}</div>
            <div className="label">लंबित आवेदन</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>💰</div>
          <div className="stat-info">
            <div className="value">{formatRupee(totalDisbursed)}</div>
            <div className="label">कुल ऋण वितरण</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce7f3' }}>💳</div>
          <div className="stat-info">
            <div className="value">{formatRupee(totalCollected)}</div>
            <div className="label">कुल वसूली</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>📈</div>
          <div className="stat-info">
            <div className="value">{formatRupee(totalInterestCollected)}</div>
            <div className="label">ब्याज आय</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>⚡ त्वरित कार्य</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link to="/register"><button className="btn-primary">👤 नया सदस्य जोड़ें</button></Link>
          <Link to="/loan-apply"><button className="btn-primary">📝 ऋण आवेदन</button></Link>
          <Link to="/approval"><button className="btn-secondary">✅ अनुमोदन करें</button></Link>
          <Link to="/payments"><button className="btn-secondary">💳 EMI जमा करें</button></Link>
          <Link to="/reports"><button className="btn-secondary">📊 रिपोर्ट देखें</button></Link>
        </div>
      </div>

      {/* Recent Loans */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>📋 हालिया ऋण</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>सदस्य</th>
                <th>राशि</th>
                <th>EMI</th>
                <th>अवधि</th>
                <th>स्थिति</th>
                <th>दिनांक</th>
              </tr>
            </thead>
            <tbody>
              {loans.slice().reverse().map(loan => {
                const { label, cls } = statusLabel(loan.status);
                return (
                  <tr key={loan.id}>
                    <td><strong>{loan.memberName}</strong></td>
                    <td>{formatRupee(loan.amount)}</td>
                    <td>{formatRupee(loan.emi)}/माह</td>
                    <td>{loan.months} माह</td>
                    <td><span className={`badge ${cls}`}>{label}</span></td>
                    <td>{loan.appliedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="alert alert-info">
        <strong>ℹ️ जानकारी:</strong> यह ऐप महिला संगठन की सदस्यों को <strong>2% प्रति माह</strong> की दर पर ₹5,000 से ₹50,000 तक का ऋण प्रदान करता है। सभी लेनदेन डिजिटल और पारदर्शी हैं।
      </div>
    </div>
  );
}
