import { useState } from 'react';
import { useApp } from '../context/useApp';
import { calculateEMI, totalInterest, formatRupee, INTEREST_RATE, MIN_LOAN, MAX_LOAN, MIN_MONTHS, MAX_MONTHS, emiSchedule } from '../utils/loanUtils';

const PURPOSES = ['व्यापार', 'कृषि', 'शिक्षा', 'स्वास्थ्य', 'घर की मरम्मत', 'पशुपालन', 'अन्य'];

export default function LoanApply() {
  const { members, addLoan } = useApp();
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState(10000);
  const [months, setMonths] = useState(12);
  const [purpose, setPurpose] = useState('व्यापार');
  const [submitted, setSubmitted] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const emi = calculateEMI(amount, INTEREST_RATE, months);
  const totalInt = totalInterest(amount, INTEREST_RATE, months);
  const totalPayable = amount + totalInt;
  const schedule = emiSchedule(amount, INTEREST_RATE, months);

  function handleSubmit(e) {
    e.preventDefault();
    if (!memberId) { alert('कृपया सदस्य चुनें'); return; }
    addLoan({ memberId: Number(memberId), amount: Number(amount), months: Number(months), emi, purpose });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
        <div className="alert alert-success" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
          <h3>ऋण आवेदन जमा!</h3>
          <p>आपका आवेदन एडमिन के पास समीक्षा के लिए भेज दिया गया है।<br />अनुमोदन पर आपको सूचना दी जाएगी।</p>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSubmitted(false)}>नया आवेदन</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header">
        <h2>📝 ऋण आवेदन</h2>
        <p>₹{MIN_LOAN.toLocaleString('hi-IN')} से ₹{MAX_LOAN.toLocaleString('hi-IN')} तक – 2% मासिक ब्याज दर</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <h3 style={{ marginBottom: '1rem' }}>आवेदन विवरण</h3>

          <div className="form-group">
            <label>सदस्य चुनें *</label>
            <select value={memberId} onChange={e => setMemberId(e.target.value)} required>
              <option value="">-- सदस्य चुनें --</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} – {m.village}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>ऋण राशि: <strong>{formatRupee(amount)}</strong></label>
            <input
              type="range"
              min={MIN_LOAN}
              max={MAX_LOAN}
              step={1000}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              style={{ border: 'none', padding: 0 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82em', color: '#7c3aed' }}>
              <span>{formatRupee(MIN_LOAN)}</span>
              <span>{formatRupee(MAX_LOAN)}</span>
            </div>
          </div>

          <div className="form-group">
            <label>अवधि: <strong>{months} महीने</strong></label>
            <input
              type="range"
              min={MIN_MONTHS}
              max={MAX_MONTHS}
              step={1}
              value={months}
              onChange={e => setMonths(Number(e.target.value))}
              style={{ border: 'none', padding: 0 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82em', color: '#7c3aed' }}>
              <span>{MIN_MONTHS} माह</span>
              <span>{MAX_MONTHS} माह</span>
            </div>
          </div>

          <div className="form-group">
            <label>ऋण का उद्देश्य *</label>
            <select value={purpose} onChange={e => setPurpose(e.target.value)}>
              {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8em' }}>
            📤 आवेदन जमा करें
          </button>
        </form>

        {/* EMI Calculator Summary */}
        <div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>🧮 EMI कैलकुलेशन</h3>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#faf5ff', borderRadius: 8 }}>
                <span>मूल राशि</span>
                <strong style={{ color: '#4c1d95' }}>{formatRupee(amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#faf5ff', borderRadius: 8 }}>
                <span>ब्याज दर</span>
                <strong style={{ color: '#4c1d95' }}>2% प्रति माह</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#faf5ff', borderRadius: 8 }}>
                <span>अवधि</span>
                <strong style={{ color: '#4c1d95' }}>{months} महीने</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'linear-gradient(90deg,#7c3aed15,#db277715)', borderRadius: 8 }}>
                <span><strong>मासिक EMI</strong></span>
                <strong style={{ color: '#7c3aed', fontSize: '1.2rem' }}>{formatRupee(emi)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#fef3c7', borderRadius: 8 }}>
                <span>कुल ब्याज</span>
                <strong style={{ color: '#92400e' }}>{formatRupee(totalInt)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: '#fee2e2', borderRadius: 8 }}>
                <span>कुल देय राशि</span>
                <strong style={{ color: '#991b1b' }}>{formatRupee(totalPayable)}</strong>
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setShowSchedule(!showSchedule)}
            >
              {showSchedule ? '🔼 शेड्यूल छुपाएं' : '🔽 EMI शेड्यूल देखें'}
            </button>
          </div>

          {showSchedule && (
            <div className="card">
              <h4 style={{ marginBottom: '0.8rem' }}>📅 EMI भुगतान शेड्यूल</h4>
              <div className="table-wrapper" style={{ maxHeight: 300, overflowY: 'auto' }}>
                <table>
                  <thead>
                    <tr><th>माह</th><th>EMI</th><th>मूल</th><th>ब्याज</th><th>शेष</th></tr>
                  </thead>
                  <tbody>
                    {schedule.map(row => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{formatRupee(row.emi)}</td>
                        <td>{formatRupee(row.principal)}</td>
                        <td>{formatRupee(row.interest)}</td>
                        <td>{formatRupee(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
