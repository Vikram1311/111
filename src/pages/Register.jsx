import { useState } from 'react';
import { useApp } from '../context/useApp';

const INITIAL_FORM = {
  name: '',
  phone: '',
  aadhaar: '',
  pan: '',
  dob: '',
  village: '',
  address: '',
  membershipId: '',
  photo: '',
};

export default function Register() {
  const { addMember, members } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'नाम आवश्यक है';
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'सही मोबाइल नंबर दर्ज करें (10 अंक)';
    if (!/^\d{4}-\d{4}-\d{4}$/.test(form.aadhaar)) e.aadhaar = 'आधार नंबर गलत है (XXXX-XXXX-XXXX)';
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(form.pan)) e.pan = 'PAN नंबर गलत है (ABCDE1234F)';
    if (!form.village.trim()) e.village = 'गाँव/शहर आवश्यक है';
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: '' }));
  }

  function handleNext() {
    if (step === 1) {
      const e = validate();
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    setStep(s => s + 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    addMember(form);
    setSubmitted(true);
    setForm(INITIAL_FORM);
    setStep(1);
  }

  if (submitted) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
        <div className="alert alert-success" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h3>पंजीकरण सफल!</h3>
          <p>सदस्य का पंजीकरण हो गया है। अब वे ऋण के लिए आवेदन कर सकती हैं।</p>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSubmitted(false)}>नया पंजीकरण</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <h2>👤 सदस्य पंजीकरण एवं KYC</h2>
        <p>आधार/पैन कार्ड वेरिफिकेशन और संगठन की सदस्यता सत्यापन</p>
      </div>

      <div className="steps">
        <div className={`step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>1️⃣ व्यक्तिगत जानकारी</div>
        <div className={`step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>2️⃣ KYC दस्तावेज़</div>
        <div className={`step ${step === 3 ? 'active' : ''}`}>3️⃣ पुष्टि करें</div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>व्यक्तिगत जानकारी</h3>
            <div className="form-row">
              <div className="form-group">
                <label>पूरा नाम *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="जैसे: सुनीता देवी" />
                {errors.name && <span style={{ color: 'red', fontSize: '0.82em' }}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>मोबाइल नंबर *</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="10 अंक का नंबर" maxLength={10} />
                {errors.phone && <span style={{ color: 'red', fontSize: '0.82em' }}>{errors.phone}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>जन्म तिथि</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>गाँव / शहर *</label>
                <input name="village" value={form.village} onChange={handleChange} placeholder="जैसे: रामपुर" />
                {errors.village && <span style={{ color: 'red', fontSize: '0.82em' }}>{errors.village}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>पता</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="पूरा पता लिखें..." />
            </div>
            <button type="button" className="btn-primary" onClick={handleNext}>अगला →</button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>KYC दस्तावेज़ वेरिफिकेशन</h3>
            <div className="alert alert-info">🔐 आपकी जानकारी सुरक्षित है। यह केवल पहचान सत्यापन के लिए उपयोग होगी।</div>
            <div className="form-row">
              <div className="form-group">
                <label>आधार नंबर * (XXXX-XXXX-XXXX)</label>
                <input name="aadhaar" value={form.aadhaar} onChange={handleChange} placeholder="1234-5678-9012" maxLength={14} />
                {errors.aadhaar && <span style={{ color: 'red', fontSize: '0.82em' }}>{errors.aadhaar}</span>}
              </div>
              <div className="form-group">
                <label>PAN नंबर * (ABCDE1234F)</label>
                <input name="pan" value={form.pan} onChange={handleChange} placeholder="ABCDE1234F" maxLength={10} style={{ textTransform: 'uppercase' }} />
                {errors.pan && <span style={{ color: 'red', fontSize: '0.82em' }}>{errors.pan}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>संगठन सदस्यता ID</label>
              <input name="membershipId" value={form.membershipId} onChange={handleChange} placeholder="जैसे: MHS-2024-001" />
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>← वापस</button>
              <button type="button" className="btn-primary" onClick={handleNext}>अगला →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>पुष्टि करें</h3>
            <div style={{ background: '#faf5ff', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
              <div className="form-row">
                <div><strong>नाम:</strong> {form.name}</div>
                <div><strong>मोबाइल:</strong> {form.phone}</div>
                <div><strong>आधार:</strong> {form.aadhaar}</div>
                <div><strong>PAN:</strong> {form.pan}</div>
                <div><strong>गाँव:</strong> {form.village}</div>
                <div><strong>सदस्यता ID:</strong> {form.membershipId || 'N/A'}</div>
              </div>
            </div>
            <div className="alert alert-warning">📋 कृपया जानकारी जाँच लें। सबमिट करने के बाद बदलाव के लिए एडमिन से संपर्क करें।</div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>← वापस</button>
              <button type="submit" className="btn-primary">✅ पंजीकरण करें</button>
            </div>
          </div>
        )}
      </form>

      {/* Existing Members */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>👥 पंजीकृत सदस्य ({members.length})</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>नाम</th><th>मोबाइल</th><th>गाँव</th><th>पंजीकरण</th><th>स्थिति</th></tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.phone}</td>
                  <td>{m.village}</td>
                  <td>{m.joinDate}</td>
                  <td><span className="badge badge-green">सक्रिय</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
