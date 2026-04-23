import { useState } from 'react';
import AppContext from './AppContextValue';

// Demo initial data
const INITIAL_MEMBERS = [
  { id: 1, name: 'सुनीता देवी', phone: '9876543210', aadhaar: '1234-5678-9012', pan: 'ABCDE1234F', village: 'रामपुर', status: 'active', joinDate: '01/01/2024' },
  { id: 2, name: 'कमला बाई', phone: '9765432109', aadhaar: '2345-6789-0123', pan: 'BCDEF2345G', village: 'श्यामनगर', status: 'active', joinDate: '15/02/2024' },
  { id: 3, name: 'रीना शर्मा', phone: '9654321098', aadhaar: '3456-7890-1234', pan: 'CDEFG3456H', village: 'गोपालपुर', status: 'active', joinDate: '10/03/2024' },
];

const INITIAL_LOANS = [
  { id: 1, memberId: 2, memberName: 'कमला बाई', amount: 20000, months: 12, emi: 1871, status: 'active', appliedDate: '01/03/2024', approvedDate: '05/03/2024', purpose: 'व्यापार' },
  { id: 2, memberId: 3, memberName: 'रीना शर्मा', amount: 10000, months: 6, emi: 1785, status: 'pending', appliedDate: '15/04/2024', approvedDate: null, purpose: 'शिक्षा' },
  { id: 3, memberId: 1, memberName: 'सुनीता देवी', amount: 15000, months: 9, emi: 1818, status: 'closed', appliedDate: '10/01/2024', approvedDate: '12/01/2024', purpose: 'कृषि' },
];

const INITIAL_PAYMENTS = [
  { id: 1, loanId: 1, memberName: 'कमला बाई', month: 1, amount: 1871, principal: 1471, interest: 400, date: '05/04/2024', mode: 'UPI' },
  { id: 2, loanId: 1, memberName: 'कमला बाई', month: 2, amount: 1871, principal: 1501, interest: 370, date: '05/05/2024', mode: 'Cash' },
];

export function AppProvider({ children }) {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);

  function addMember(member) {
    const newMember = { ...member, id: Date.now(), status: 'active', joinDate: new Date().toLocaleDateString('hi-IN') };
    setMembers(prev => [...prev, newMember]);
    return newMember;
  }

  function addLoan(loan) {
    const member = members.find(m => m.id === loan.memberId);
    const newLoan = {
      ...loan,
      id: Date.now(),
      memberName: member ? member.name : '',
      status: 'pending',
      appliedDate: new Date().toLocaleDateString('hi-IN'),
      approvedDate: null,
    };
    setLoans(prev => [...prev, newLoan]);
    return newLoan;
  }

  function approveLoan(loanId) {
    setLoans(prev =>
      prev.map(l =>
        l.id === loanId
          ? { ...l, status: 'active', approvedDate: new Date().toLocaleDateString('hi-IN') }
          : l
      )
    );
  }

  function rejectLoan(loanId) {
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'rejected' } : l))
    );
  }

  function addPayment(payment) {
    const newPayment = { ...payment, id: Date.now(), date: new Date().toLocaleDateString('hi-IN') };
    setPayments(prev => [...prev, newPayment]);
  }

  return (
    <AppContext.Provider value={{ members, loans, payments, addMember, addLoan, approveLoan, rejectLoan, addPayment }}>
      {children}
    </AppContext.Provider>
  );
}
