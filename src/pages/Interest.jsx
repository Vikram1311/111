import { useState } from 'react';
import { calculateEMI, totalInterest, emiSchedule, formatRupee, INTEREST_RATE, MIN_LOAN, MAX_LOAN, MIN_MONTHS, MAX_MONTHS } from '../utils/loanUtils';

export default function Interest() {
  const [principal, setPrincipal] = useState(20000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(2);

  const monthlyRate = rate / 100;
  const emi = calculateEMI(principal, monthlyRate, months);
  const totalInt = totalInterest(principal, monthlyRate, months);
  const totalPayable = principal + totalInt;
  const schedule = emiSchedule(principal, monthlyRate, months);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <h2>🧮 ब्याज कैलकुलेशन इंजन</h2>
        <p>2% ब्याज का ऑटोमेटिक कैलकुलेशन – EMI ब्रेकअप (मूलधन + ब्याज)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Sliders */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>📐 गणना मापदंड</h3>

          <div className="form-group">
            <label>ऋण राशि: <strong style={{ color: '#7c3aed' }}>{formatRupee(principal)}</strong></label>
            <input
              type="range"
              min={MIN_LOAN}
              max={MAX_LOAN}
              step={1000}
              value={principal}
              onChange={e => setPrincipal(Number(e.target.value))}
              style={{ border: 'none', padding: 0 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82em', color: '#7c3aed' }}>
              <span>{formatRupee(MIN_LOAN)}</span><span>{formatRupee(MAX_LOAN)}</span>
            </div>
          </div>

          <div className="form-group">
            <label>अवधि: <strong style={{ color: '#7c3aed' }}>{months} महीने</strong></label>
            <input
              type="range"
              min={MIN_MONTHS}
              max={MAX_MONTHS}
              value={months}
              onChange={e => setMonths(Number(e.target.value))}
              style={{ border: 'none', padding: 0 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82em', color: '#7c3aed' }}>
              <span>{MIN_MONTHS} माह</span><span>{MAX_MONTHS} माह</span>
            </div>
          </div>

          <div className="form-group">
            <label>ब्याज दर: <strong style={{ color: '#db2777' }}>{rate}% प्रति माह</strong></label>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={rate}
              onChange={e => setRate(Number(e.target.value))}
              style={{ border: 'none', padding: 0 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82em', color: '#db2777' }}>
              <span>0.5%</span><span>5%</span>
            </div>
          </div>

          {rate !== 2 && (
            <div className="alert alert-warning">
              ⚠️ संगठन की मानक दर 2% है। कृपया 2% ब्याज दर का उपयोग करें।
            </div>
          )}
        </div>

        {/* Results */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>📊 परिणाम</h3>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {[
              ['मूलधन', formatRupee(principal), '#4c1d95', '#ede9fe'],
              ['ब्याज दर', `${rate}% प्रति माह`, '#1e40af', '#dbeafe'],
              ['अवधि', `${months} महीने`, '#065f46', '#d1fae5'],
              ['मासिक EMI', formatRupee(emi), '#7c3aed', '#faf5ff'],
              ['कुल ब्याज', formatRupee(totalInt), '#92400e', '#fef3c7'],
              ['कुल देय', formatRupee(totalPayable), '#991b1b', '#fee2e2'],
            ].map(([lbl, val, color, bg]) => (
              <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.7rem 1rem', background: bg, borderRadius: 10 }}>
                <span>{lbl}</span>
                <strong style={{ color }}>{val}</strong>
              </div>
            ))}
          </div>

          {/* Pie-like breakdown */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '0.5rem' }}>राशि विभाजन</div>
            <div style={{ background: '#e9d5ff', borderRadius: 999, height: 22, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                background: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
                height: 22,
                width: `${Math.round((principal / totalPayable) * 100)}%`,
                position: 'absolute', left: 0
              }} />
              <div style={{
                position: 'absolute', left: '10%', top: 0, height: '100%',
                display: 'flex', alignItems: 'center',
                fontSize: '0.78em', fontWeight: 700, color: '#fff'
              }}>मूलधन {Math.round((principal / totalPayable) * 100)}%</div>
              <div style={{
                position: 'absolute', right: '5%', top: 0, height: '100%',
                display: 'flex', alignItems: 'center',
                fontSize: '0.78em', fontWeight: 700, color: '#92400e'
              }}>ब्याज {Math.round((totalInt / totalPayable) * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>📅 किस्त विवरण (Amortization Table)</h3>
        <div className="table-wrapper" style={{ maxHeight: 380, overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>माह</th>
                <th>EMI</th>
                <th>मूलधन भाग</th>
                <th>ब्याज भाग</th>
                <th>शेष राशि</th>
                <th>कुल ब्याज (संचित)</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, idx) => {
                const cumulativeInterest = schedule.slice(0, idx + 1).reduce((s, r) => s + r.interest, 0);
                return (
                  <tr key={row.month}>
                    <td><strong>{row.month}</strong></td>
                    <td>{formatRupee(row.emi)}</td>
                    <td style={{ color: '#7c3aed' }}>{formatRupee(row.principal)}</td>
                    <td style={{ color: '#dc2626' }}>{formatRupee(row.interest)}</td>
                    <td>{formatRupee(row.balance)}</td>
                    <td style={{ color: '#92400e' }}>{formatRupee(Math.round(cumulativeInterest * 100) / 100)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-info">
        💡 <strong>फॉर्मूला:</strong> EMI = P × r × (1+r)ⁿ / [(1+r)ⁿ - 1] | जहाँ P = मूलधन, r = मासिक ब्याज दर, n = महीने
      </div>
    </div>
  );
}
