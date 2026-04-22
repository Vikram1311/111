// ब्याज और EMI कैलकुलेशन यूटिलिटी
// Loan calculation utilities

/**
 * EMI कैलकुलेट करना (Flat Rate / Simple Interest on declining balance)
 * @param {number} principal - मूल राशि
 * @param {number} monthlyRate - मासिक ब्याज दर (decimal, e.g. 0.02 for 2%)
 * @param {number} months - अवधि (महीनों में)
 */
export function calculateEMI(principal, monthlyRate, months) {
  if (monthlyRate === 0) return principal / months;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * कुल ब्याज राशि
 */
export function totalInterest(principal, monthlyRate, months) {
  const emi = calculateEMI(principal, monthlyRate, months);
  return Math.round((emi * months - principal) * 100) / 100;
}

/**
 * EMI शेड्यूल (amortization table)
 */
export function emiSchedule(principal, monthlyRate, months) {
  const emi = calculateEMI(principal, monthlyRate, months);
  let balance = principal;
  const schedule = [];
  for (let i = 1; i <= months; i++) {
    const interest = Math.round(balance * monthlyRate * 100) / 100;
    const principalPaid = Math.round((emi - interest) * 100) / 100;
    balance = Math.round((balance - principalPaid) * 100) / 100;
    schedule.push({
      month: i,
      emi: Math.round(emi * 100) / 100,
      principal: principalPaid,
      interest,
      balance: balance < 0 ? 0 : balance,
    });
  }
  return schedule;
}

/**
 * रुपये फॉर्मेट करना
 */
export function formatRupee(amount) {
  return '₹' + Number(amount).toLocaleString('hi-IN', { maximumFractionDigits: 2 });
}

/**
 * लोन स्टेटस लेबल
 */
export function statusLabel(status) {
  const map = {
    pending: { label: 'लंबित', cls: 'badge-yellow' },
    approved: { label: 'स्वीकृत', cls: 'badge-green' },
    rejected: { label: 'अस्वीकृत', cls: 'badge-red' },
    active: { label: 'सक्रिय', cls: 'badge-blue' },
    closed: { label: 'बंद', cls: 'badge-purple' },
  };
  return map[status] || { label: status, cls: 'badge-purple' };
}

/**
 * आज की तारीख (dd/mm/yyyy)
 */
export function todayStr() {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * अगले N महीनों की EMI due dates
 */
export function dueDates(startDate, months) {
  const dates = [];
  const d = new Date(startDate);
  for (let i = 1; i <= months; i++) {
    const nd = new Date(d);
    nd.setMonth(nd.getMonth() + i);
    dates.push(nd.toLocaleDateString('hi-IN'));
  }
  return dates;
}

export const INTEREST_RATE = 0.02; // 2% प्रति माह
export const MIN_LOAN = 5000;
export const MAX_LOAN = 50000;
export const MIN_MONTHS = 3;
export const MAX_MONTHS = 24;
