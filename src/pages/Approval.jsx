import { useState } from 'react';
import { useApp } from '../context/useApp';
import { formatRupee, statusLabel } from '../utils/loanUtils';

export default function Approval() {
  const { loans, approveLoan, rejectLoan } = useApp();
  const [filter, setFilter] = useState('pending');
  const [confirming, setConfirming] = useState(null); // { loanId, action }

  const filtered = loans.filter(l => filter === 'all' ? true : l.status === filter);

  function handleAction(loanId, action) {
    setConfirming({ loanId, action });
  }

  function confirmAction() {
    if (!confirming) return;
    if (confirming.action === 'approve') approveLoan(confirming.loanId);
    else rejectLoan(confirming.loanId);
    setConfirming(null);
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <h2>✅ ऋण अनुमोदन प्रणाली</h2>
        <p>एडमिन द्वारा ऋण आवेदनों की समीक्षा और अनुमोदन</p>
      </div>

      {/* Confirmation Modal */}
      {confirming && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ maxWidth: 400, width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {confirming.action === 'approve' ? '✅' : '❌'}
            </div>
            <h3>{confirming.action === 'approve' ? 'ऋण स्वीकृत करें?' : 'ऋण अस्वीकार करें?'}</h3>
            <p style={{ color: '#666', margin: '0.8rem 0' }}>
              क्या आप वाकई यह ऋण आवेदन {confirming.action === 'approve' ? 'स्वीकृत' : 'अस्वीकार'} करना चाहते हैं?
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setConfirming(null)}>रद्द करें</button>
              <button
                className={confirming.action === 'approve' ? 'btn-primary' : 'btn-danger'}
                onClick={confirmAction}
              >
                {confirming.action === 'approve' ? '✅ स्वीकृत करें' : '❌ अस्वीकार करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[['pending', '⏳ लंबित'], ['active', '✅ स्वीकृत'], ['rejected', '❌ अस्वीकृत'], ['all', '📋 सभी']].map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={filter === val ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45em 1.1em', fontSize: '0.9em' }}
          >
            {lbl} ({loans.filter(l => val === 'all' ? true : l.status === val).length})
          </button>
        ))}
      </div>

      {/* Loans Table */}
      {filtered.length === 0 ? (
        <div className="alert alert-info">इस श्रेणी में कोई ऋण नहीं है।</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>सदस्य</th>
                  <th>राशि</th>
                  <th>EMI</th>
                  <th>अवधि</th>
                  <th>उद्देश्य</th>
                  <th>आवेदन तिथि</th>
                  <th>स्थिति</th>
                  <th>कार्य</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(loan => {
                  const { label, cls } = statusLabel(loan.status);
                  return (
                    <tr key={loan.id}>
                      <td><strong>{loan.memberName}</strong></td>
                      <td>{formatRupee(loan.amount)}</td>
                      <td>{formatRupee(loan.emi)}/माह</td>
                      <td>{loan.months} माह</td>
                      <td>{loan.purpose}</td>
                      <td>{loan.appliedDate}</td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td>
                        {loan.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.82em', padding: '4px 10px', borderRadius: 6 }}
                              onClick={() => handleAction(loan.id, 'approve')}
                            >✅ स्वीकृत</button>
                            <button
                              style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.82em', padding: '4px 10px', borderRadius: 6 }}
                              onClick={() => handleAction(loan.id, 'reject')}
                            >❌ अस्वीकार</button>
                          </div>
                        )}
                        {loan.status === 'active' && (
                          <span style={{ fontSize: '0.82em', color: '#065f46' }}>✅ {loan.approvedDate}</span>
                        )}
                        {loan.status === 'rejected' && (
                          <span style={{ fontSize: '0.82em', color: '#991b1b' }}>❌ अस्वीकृत</span>
                        )}
                        {loan.status === 'closed' && (
                          <span style={{ fontSize: '0.82em', color: '#5b21b6' }}>🏁 बंद</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
        🔏 <strong>डिजिटल हस्ताक्षर:</strong> प्रत्येक अनुमोदन एडमिन के डिजिटल सिग्नेचर के साथ दर्ज होता है।
        सदस्य को स्वीकृति/अस्वीकृति की सूचना SMS/ऐप नोटिफिकेशन से दी जाती है।
      </div>
    </div>
  );
}
