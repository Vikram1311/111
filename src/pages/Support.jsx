import { useState } from 'react';

const FAQS = [
  {
    q: 'ऋण के लिए कौन आवेदन कर सकती है?',
    a: 'महिला संगठन की कोई भी पंजीकृत सदस्य ऋण के लिए आवेदन कर सकती है। पहले पंजीकरण और KYC पूरा करना होगा।',
  },
  {
    q: 'ब्याज दर क्या है?',
    a: 'ब्याज दर 2% प्रति माह है (घटते मूलधन पर)। यह दर संगठन द्वारा तय की गई है और पारदर्शी है।',
  },
  {
    q: 'ऋण की न्यूनतम और अधिकतम राशि क्या है?',
    a: 'न्यूनतम ₹5,000 और अधिकतम ₹50,000 तक ऋण मिल सकता है।',
  },
  {
    q: 'EMI कैसे जमा करें?',
    a: 'EMI UPI, Netbanking, Wallet या नकद (Cash) के माध्यम से जमा की जा सकती है। भुगतान पेज पर जाकर अपना ऋण चुनें और भुगतान करें।',
  },
  {
    q: 'अनुमोदन में कितना समय लगता है?',
    a: 'आवेदन जमा होने के बाद 1-3 कार्य दिवसों में एडमिन अनुमोदन करते हैं। अनुमोदन पर SMS/ऐप नोटिफिकेशन मिलेगा।',
  },
  {
    q: 'EMI चूक जाने पर क्या होता है?',
    a: 'EMI चूकने पर विलंब शुल्क लग सकता है। कृपया समय पर भुगतान करें या एडमिन से संपर्क करें।',
  },
  {
    q: 'ऋण जल्दी चुकाने पर क्या सुविधा है?',
    a: 'पूर्व-भुगतान (Pre-payment) की सुविधा उपलब्ध है। शेष मूलधन पर ब्याज माफ हो जाती है।',
  },
  {
    q: 'क्या जानकारी सुरक्षित रहती है?',
    a: 'हाँ, आपकी आधार/पैन जानकारी और वित्तीय डेटा पूरी तरह सुरक्षित और गोपनीय है।',
  },
];

const CHATBOT_RESPONSES = {
  ब्याज: 'हमारी ब्याज दर 2% प्रति माह है। यह घटते मूलधन पर लागू होती है।',
  emi: 'EMI कैलकुलेटर पेज पर जाकर अपनी ऋण राशि और अवधि डालें, EMI स्वतः कैलकुलेट हो जाएगी।',
  'ऋण': 'ऋण के लिए पहले पंजीकरण करें, फिर "ऋण आवेदन" पेज पर जाएं। ₹5,000 से ₹50,000 तक मिल सकता है।',
  'पंजीकरण': 'पंजीकरण के लिए आधार नंबर, PAN नंबर और मोबाइल नंबर आवश्यक है।',
  'भुगतान': 'भुगतान UPI, Netbanking, Wallet या Cash के माध्यम से किया जा सकता है।',
  'अनुमोदन': 'ऋण आवेदन के 1-3 कार्य दिवस में अनुमोदन होता है।',
  'default': 'कृपया अपना प्रश्न स्पष्ट करें या नीचे दिए FAQ देखें। आप "ब्याज", "EMI", "ऋण", "पंजीकरण", "भुगतान" जैसे शब्द टाइप कर सकती हैं।',
};

function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, resp] of Object.entries(CHATBOT_RESPONSES)) {
    if (key !== 'default' && lower.includes(key.toLowerCase())) return resp;
  }
  return CHATBOT_RESPONSES.default;
}

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'नमस्ते! 🌸 मैं आपकी सहायता के लिए यहाँ हूँ। आप ऋण, EMI, पंजीकरण या ब्याज के बारे में पूछ सकती हैं।' },
  ]);

  function sendMessage(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { from: 'user', text: chatInput };
    const botMsg = { from: 'bot', text: getBotResponse(chatInput) };
    setChatMessages(prev => [...prev, userMsg, botMsg]);
    setChatInput('');
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <h2>❓ सामुदायिक सहायता</h2>
        <p>FAQ, चैटबॉट सहायता और हिंदी भाषा समर्थन</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* FAQ */}
        <div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>📚 अक्सर पूछे जाने वाले प्रश्न (FAQ)</h3>
            {FAQS.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #f3f0ff', marginBottom: '0.5rem' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', padding: '0.8rem 0',
                    color: '#4c1d95', fontWeight: 600, fontSize: '0.95em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  {faq.q}
                  <span style={{ fontSize: '1.2em' }}>{openFaq === idx ? '▲' : '▼'}</span>
                </button>
                {openFaq === idx && (
                  <div style={{ background: '#faf5ff', borderRadius: 8, padding: '0.8rem', marginBottom: '0.5rem', fontSize: '0.92em', color: '#374151' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Language Support Info */}
          <div className="card">
            <h3 style={{ marginBottom: '0.8rem' }}>🌐 भाषा समर्थन</h3>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['हिंदी ✅', 'English ✅', 'मराठी 🔜', 'भोजपुरी 🔜', 'राजस्थानी 🔜', 'गुजराती 🔜'].map(lang => (
                <span key={lang} className="badge badge-purple" style={{ fontSize: '0.88em', padding: '4px 14px' }}>{lang}</span>
              ))}
            </div>
            <p style={{ marginTop: '0.8rem', fontSize: '0.9em', color: '#666' }}>
              यह ऐप मुख्यतः हिंदी में है। स्थानीय भाषाओं का समर्थन जल्द आएगा।
            </p>
          </div>
        </div>

        {/* Chatbot */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content', minHeight: 500 }}>
          <h3 style={{ marginBottom: '1rem' }}>🤖 चैटबॉट सहायता</h3>
          <div style={{
            flex: 1, overflowY: 'auto', maxHeight: 360, display: 'flex', flexDirection: 'column',
            gap: '0.6rem', marginBottom: '1rem', padding: '0.5rem',
            background: '#faf5ff', borderRadius: 12
          }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                background: msg.from === 'user' ? 'linear-gradient(90deg,#7c3aed,#db2777)' : '#fff',
                color: msg.from === 'user' ? '#fff' : '#1a1a1a',
                borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '0.6rem 1rem',
                maxWidth: '80%',
                fontSize: '0.92em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}>
                {msg.from === 'bot' && <span style={{ marginRight: 6 }}>🌸</span>}
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="अपना प्रश्न टाइप करें..."
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.55em 1.2em' }}>भेजें →</button>
          </form>

          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['ब्याज', 'EMI', 'ऋण', 'पंजीकरण', 'भुगतान'].map(q => (
              <button
                key={q}
                type="button"
                className="btn-secondary"
                style={{ padding: '3px 10px', fontSize: '0.82em' }}
                onClick={() => { setChatInput(q); }}
              >{q}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card">
        <h3 style={{ marginBottom: '0.8rem' }}>📞 संपर्क करें</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
          {[
            { icon: '📱', title: 'हेल्पलाइन', detail: '1800-XXX-XXXX (निःशुल्क)' },
            { icon: '📧', title: 'ईमेल', detail: 'support@mahilaRin.org' },
            { icon: '🏢', title: 'कार्यालय', detail: 'सोम-शनि, सुबह 9 से शाम 6 बजे' },
            { icon: '💬', title: 'WhatsApp', detail: '+91-XXXXX-XXXXX' },
          ].map(c => (
            <div key={c.title} style={{ background: '#faf5ff', borderRadius: 10, padding: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: '#4c1d95', fontSize: '0.9em' }}>{c.title}</div>
                <div style={{ fontSize: '0.85em', color: '#555' }}>{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
