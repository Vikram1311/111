import { useState } from 'react';
import { useApp } from '../context/useApp';
import { formatRupee, emiSchedule, INTEREST_RATE } from '../utils/loanUtils';

const PAYMENT_MODES = ['UPI', 'Netbanking', 'Wallet', 'Cash'];

export default function Payments() {
  const { loans, payments, addPayment } = useApp();
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [mode, setMode] = useState('UPI');
  const [success, setSuccess] = useState(false);

  const activeLoans = loans.filter(l => l.status === 'active');
  const selectedLoan = activeLoans.find(l => l.id === Number(selectedLoanId));

  // Payments already made for selected loan
  const loanPayments = payments.filter(p => p.loanId === Number(selectedLoanId));
  const nextMonth = loanPayments.length + 1;

  // EMI schedule for selected loan
  const schedule = selectedLoan ? emiSchedule(selectedLoan.amount, INTEREST_RATE, selectedLoan.months) : [];
  const nextEMIRow = schedule[nextMonth - 1];

  function handlePay(e) {
    e.preventDefault();
    if (!selectedLoan || !nextEMIRow) return;
    addPayment({
      loanId: selectedLoan.id,
      memberName: selectedLoan.memberName,
      month: nextMonth,
      amount: nextEMIRow.emi,
      principal: nextEMIRow.principal,
      interest: nextEMIRow.interest,
      mode,
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <h2>💳 EMI भुगतान ट्रैकिंग</h2>
        <p>UPI / Netbanking / Wallet के माध्यम से EMI जमा करें</p>
      </div>

      {success && <div className="alert alert-success">✅ EMI सफलतापूर्वक जमा हो गई!</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Payment Form */}
        <form onSubmit={handlePay} className="card">
          <h3 style={{ marginBottom: '1rem' }}>EMI जमा करें</h3>

          <div className="form-group">
            <label>सक्रिय ऋण चुनें *</label>
            <select value={selectedLoanId} onChange={e => { setSelectedLoanId(e.target.value); setSuccess(false); }} required>
              <option value="">-- ऋण चुनें --</option>
              {activeLoans.map(l => (
                <option key={l.id} value={l.id}>
                  {l.memberName} – {formatRupee(l.amount)} ({l.months} माह)
                </option>
              ))}
            </select>
          </div>

          {selectedLoan && nextEMIRow && (
            <>
              <div style={{ background: '#faf5ff', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>माह संख्या</span>
                    <strong>{nextMonth} / {selectedLoan.months}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>मूलधन</span>
                    <strong>{formatRupee(nextEMIRow.principal)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ब्याज (2%)</span>
                    <strong>{formatRupee(nextEMIRow.interest)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e9d5ff', paddingTop: '0.5rem' }}>
                    <span><strong>देय EMI</strong></span>
                    <strong style={{ color: '#7c3aed', fontSize: '1.2rem' }}>{formatRupee(nextEMIRow.emi)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>शेष राशि (भुगतान के बाद)</span>
                    <strong style={{ color: '#dc2626' }}>{formatRupee(nextEMIRow.balance)}</strong>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>भुगतान माध्यम</label>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {PAYMENT_MODES.map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMode(m)}
                      className={mode === m ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.4em 1em', fontSize: '0.9em' }}
                    >
                      {m === 'UPI' ? '📱' : m === 'Netbanking' ? '🏦' : m === 'Wallet' ? '👛' : '💵'} {m}
                    </button>
                  ))}
                </div>
              </div>

              {nextMonth > selectedLoan.months ? (
                <div className="alert alert-success">🎉 इस ऋण की सभी EMI जमा हो चुकी हैं!</div>
              ) : (
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8em' }}>
                  💳 {formatRupee(nextEMIRow.emi)} जमा करें ({mode})
                </button>
              )}
            </>
          )}

          {selectedLoan && !nextEMIRow && (
            <div className="alert alert-success">🎉 इस ऋण की सभी EMI जमा हो चुकी हैं!</div>
          )}
        </form>

        {/* Payment History */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>📜 भुगतान इतिहास</h3>
          {payments.length === 0 ? (
            <div className="alert alert-info">अभी तक कोई भुगतान नहीं।</div>
          ) : (
            <div className="table-wrapper" style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr><th>सदस्य</th><th>माह</th><th>EMI</th><th>ब्याज</th><th>माध्यम</th><th>तिथि</th></tr>
                </thead>
                <tbody>
                  {payments.slice().reverse().map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.memberName}</strong></td>
                      <td>{p.month}</td>
                      <td>{formatRupee(p.amount)}</td>
                      <td>{formatRupee(p.interest)}</td>
                      <td><span className="badge badge-blue">{p.mode}</span></td>
                      <td>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* EMI Reminders */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>🔔 EMI रिमाइंडर – सक्रिय ऋण</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '0.8rem' }}>
          {activeLoans.map(loan => {
            const paid = payments.filter(p => p.loanId === loan.id).length;
            const remaining = loan.months - paid;
            const pct = Math.round((paid / loan.months) * 100);
            return (
              <div key={loan.id} style={{ background: '#faf5ff', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#4c1d95', marginBottom: '0.3rem' }}>{loan.memberName}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '0.5rem' }}>{formatRupee(loan.amount)} – {loan.months} माह</div>
                <div style={{ background: '#e9d5ff', borderRadius: 999, height: 8, marginBottom: '0.4rem' }}>
                  <div style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', height: 8, borderRadius: 999, width: `${pct}%` }} />
                </div>
                <div style={{ fontSize: '0.82em', display: 'flex', justifyContent: 'space-between' }}>
                  <span>✅ {paid} EMI जमा</span>
                  <span>⏳ {remaining} शेष</span>
                </div>
              </div>
            );
          })}
          {activeLoans.length === 0 && <div className="alert alert-info">कोई सक्रिय ऋण नहीं।</div>}
        </div>
      </div>
    </div>
  );
}
