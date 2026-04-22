import { useApp } from '../context/useApp';
import { formatRupee } from '../utils/loanUtils';

export default function Reports() {
  const { members, loans, payments } = useApp();

  const totalDisbursed = loans.filter(l => l.status !== 'rejected').reduce((s, l) => s + l.amount, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalInterest = payments.reduce((s, p) => s + (p.interest || 0), 0);
  const totalPrincipal = payments.reduce((s, p) => s + (p.principal || 0), 0);

  const loansByStatus = {
    active: loans.filter(l => l.status === 'active').length,
    pending: loans.filter(l => l.status === 'pending').length,
    closed: loans.filter(l => l.status === 'closed').length,
    rejected: loans.filter(l => l.status === 'rejected').length,
  };

  // Member-wise summary
  const memberSummary = members.map(m => {
    const memberLoans = loans.filter(l => l.memberId === m.id);
    const memberPayments = payments.filter(p => memberLoans.some(l => l.id === p.loanId));
    const totalBorrowed = memberLoans.reduce((s, l) => s + l.amount, 0);
    const totalPaid = memberPayments.reduce((s, p) => s + p.amount, 0);
    return { ...m, totalLoans: memberLoans.length, totalBorrowed, totalPaid };
  });

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="page-header">
        <h2>📊 रिपोर्ट एवं पारदर्शिता</h2>
        <p>मासिक रिपोर्ट, सदस्यवार हिसाब और संगठन डैशबोर्ड</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: '👩', label: 'कुल सदस्य', value: members.length, bg: '#ede9fe', color: '#5b21b6' },
          { icon: '📋', label: 'कुल ऋण', value: loans.length, bg: '#dbeafe', color: '#1e40af' },
          { icon: '✅', label: 'सक्रिय ऋण', value: loansByStatus.active, bg: '#d1fae5', color: '#065f46' },
          { icon: '⏳', label: 'लंबित', value: loansByStatus.pending, bg: '#fef3c7', color: '#92400e' },
          { icon: '💰', label: 'कुल वितरण', value: formatRupee(totalDisbursed), bg: '#fce7f3', color: '#be185d' },
          { icon: '💳', label: 'कुल वसूली', value: formatRupee(totalCollected), bg: '#d1fae5', color: '#065f46' },
          { icon: '📈', label: 'ब्याज आय', value: formatRupee(totalInterest), bg: '#fef3c7', color: '#92400e' },
          { icon: '🏦', label: 'मूलधन वसूली', value: formatRupee(totalPrincipal), bg: '#ede9fe', color: '#5b21b6' },
        ].map(item => (
          <div key={item.label} className="stat-card">
            <div className="stat-icon" style={{ background: item.bg, fontSize: '1.5rem' }}>{item.icon}</div>
            <div className="stat-info">
              <div className="value" style={{ fontSize: '1.1rem', color: item.color }}>{item.value}</div>
              <div className="label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Loan Status Breakdown */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>📊 ऋण स्थिति विश्लेषण</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            ['active', '✅ सक्रिय', '#d1fae5', '#065f46'],
            ['pending', '⏳ लंबित', '#fef3c7', '#92400e'],
            ['closed', '🏁 बंद', '#ede9fe', '#5b21b6'],
            ['rejected', '❌ अस्वीकृत', '#fee2e2', '#991b1b'],
          ].map(([key, lbl, bg, color]) => (
            <div key={key} style={{ background: bg, borderRadius: 12, padding: '1rem 1.5rem', textAlign: 'center', flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{loansByStatus[key]}</div>
              <div style={{ fontSize: '0.85em', color, fontWeight: 600 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        {loans.length > 0 && (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {[['active', '✅ सक्रिय', '#10b981'], ['pending', '⏳ लंबित', '#f59e0b'], ['closed', '🏁 बंद', '#7c3aed'], ['rejected', '❌ अस्वीकृत', '#ef4444']].map(([key, lbl, color]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ width: 110, fontSize: '0.85em' }}>{lbl}</span>
                <div style={{ flex: 1, background: '#f3f0ff', borderRadius: 999, height: 16 }}>
                  <div style={{ background: color, height: 16, borderRadius: 999, width: `${Math.round((loansByStatus[key] / loans.length) * 100)}%`, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.85em', fontWeight: 700, color }}>{Math.round((loansByStatus[key] / loans.length) * 100)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member-wise Report */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>👩 सदस्यवार हिसाब-किताब</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>सदस्य</th>
                <th>गाँव</th>
                <th>कुल ऋण</th>
                <th>कुल उधार</th>
                <th>कुल जमा</th>
                <th>शेष अनुमानित</th>
              </tr>
            </thead>
            <tbody>
              {memberSummary.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.village}</td>
                  <td><span className="badge badge-purple">{m.totalLoans}</span></td>
                  <td>{formatRupee(m.totalBorrowed)}</td>
                  <td style={{ color: '#065f46' }}>{formatRupee(m.totalPaid)}</td>
                  <td style={{ color: '#991b1b' }}>{formatRupee(Math.max(0, m.totalBorrowed - m.totalPaid))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>💳 संपूर्ण भुगतान इतिहास</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>सदस्य</th><th>माह</th><th>EMI राशि</th><th>मूलधन</th><th>ब्याज</th><th>माध्यम</th><th>तिथि</th></tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999' }}>कोई भुगतान नहीं</td></tr>
              ) : (
                payments.slice().reverse().map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.memberName}</strong></td>
                    <td>{p.month}</td>
                    <td>{formatRupee(p.amount)}</td>
                    <td style={{ color: '#7c3aed' }}>{formatRupee(p.principal)}</td>
                    <td style={{ color: '#dc2626' }}>{formatRupee(p.interest)}</td>
                    <td><span className="badge badge-blue">{p.mode}</span></td>
                    <td>{p.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-success">
        🌸 <strong>संगठन को पारदर्शिता:</strong> यह रिपोर्ट हर महीने एडमिन को उपलब्ध है।
        सभी लेनदेन ऑडिट ट्रेल के साथ सुरक्षित रूप से संग्रहीत हैं।
      </div>
    </div>
  );
}
