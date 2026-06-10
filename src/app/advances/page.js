"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

// --- ICONS ---
const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function Advances() {
  const [suppliers, setSuppliers] = useState([]);
  const [advanceList, setAdvanceList] = useState([]);
  
  // Rate States
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., '2026-06'
  const [rateMonth, setRateMonth] = useState(currentMonth);
  const [teaRate, setTeaRate] = useState('');
  const [rateSuccess, setRateSuccess] = useState(false);

  // Advance Form States
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Cash Advance');
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [advanceSuccess, setAdvanceSuccess] = useState(false);

  const fetchData = async () => {
    try {
      const supRes = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(supRes.data);
      
      const advRes = await axios.get('http://localhost:5000/api/advances');
      setAdvanceList(advRes.data);

      // Load active month rate
      const rateRes = await axios.get(`http://localhost:5000/api/rates/${rateMonth}`);
      setTeaRate(rateRes.data.rate_per_kg || '');
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [rateMonth]);

  // Handle Tea Rate Submit
  const handleRateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/rates', { rate_month: rateMonth, rate_per_kg: teaRate });
      setRateSuccess(true);
      setTimeout(() => setRateSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Advance Request Submit
  const handleAdvanceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) return alert("Please select a supplier!");
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/advances', {
        supplier_id: selectedSupplier,
        amount: amount,
        description: description,
        issued_date: issuedDate
      });
      
      setAmount('');
      setAdvanceSuccess(true);
      fetchData();
      setTimeout(() => setAdvanceSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const totalIssuedAdvances = advanceList.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0EBE1; font-family: 'Inter', sans-serif; min-height: 100vh; }
        .app-shell { min-height: 100vh; background: #F0EBE1; }
        
        .hero-strip { background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 50%, #081C15 100%); padding: 3rem 2.5rem 2.5rem; }
        .hero-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #74C69D; margin-bottom: 0.6rem; }
        .hero-title { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 4vw, 3rem); color: #F8F3E8; line-height: 1.1; margin-bottom: 0.5rem; }
        .hero-title em { font-style: italic; color: #C9A84C; }
        .hero-sub { font-size: 0.875rem; color: rgba(248,243,232,0.55); margin-top: 0.5rem; }
        .hero-stats { display: flex; gap: 2.5rem; margin-top: 2rem; }
        .stat-value { font-family: 'DM Serif Display', serif; font-size: 2rem; color: #C9A84C; line-height: 1; }
        .stat-label { font-size: 0.7rem; color: rgba(248,243,232,0.45); text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }

        .layout { display: grid; grid-template-columns: 380px 1fr; gap: 0; }
        .form-panel { background: #1B4332; padding: 2.5rem; border-right: 1px solid rgba(201,168,76,0.15); height: calc(100vh - 64px); overflow-y: auto; position: sticky; top: 64px; }
        .panel-label { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #52B788; margin-bottom: 1.2rem; }
        .panel-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #F8F3E8; }
        .panel-subtitle { font-size: 0.8rem; color: rgba(248,243,232,0.4); margin-bottom: 2rem; }

        .field-group { margin-bottom: 1.25rem; }
        .field-label { display: block; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(248,243,232,0.5); margin-bottom: 0.5rem; font-family: 'JetBrains Mono', monospace; }
        .field-wrap { position: relative; }
        .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #52B788; }
        
        .field-input, .field-select { width: 100%; background: rgba(248,243,232,0.06); border: 1px solid rgba(248,243,232,0.12); color: #F8F3E8; font-size: 0.9rem; padding: 12px 14px 12px 40px; border-radius: 8px; outline: none; }
        .field-select option { background: #1B4332; color: #F8F3E8; }
        .submit-btn { width: 100%; background: #C9A84C; color: #1B4332; border: none; padding: 13px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 0.5rem; }
        .submit-btn:hover { background: #D4B660; }
        .success-toast { background: rgba(82,183,136,0.15); color: #74C69D; padding: 10px; border-radius: 8px; margin-top: 1rem; text-align: center; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; }

        .list-panel { background: #F0EBE1; padding: 2.5rem; }
        .table-container { background: #fff; border: 1.5px solid #E8E0D0; border-radius: 12px; overflow: hidden; margin-top: 1.5rem; }
        .ledger-table { width: 100%; border-collapse: collapse; }
        .ledger-table th { padding: 14px; background: #FAF8F5; border-bottom: 2px solid #E8E0D0; color: #5A7A6A; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; text-transform: uppercase; text-align: left; }
        .ledger-table td { padding: 14px; border-bottom: 1px solid #F0EBE1; font-size: 0.9rem; color: #3D3530; }
        .price-badge { background: #FFF3E0; color: #E65100; font-weight: bold; padding: 4px 8px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; }
        .mono-text { font-family: 'JetBrains Mono', monospace; color: #6B6259; }
      `}</style>

      <div className="app-shell">
        {/* Hero Strip */}
        <div className="hero-strip">
          <p className="hero-eyebrow">Finance Control · මුදල් සහ පොහොර අත්තිකාරම්</p>
          <h1 className="hero-title">Advances & <em>Rates Management</em></h1>
          <p className="hero-sub">Control monthly tea prices and track credit/cash advances issued to suppliers.</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">Rs. {totalIssuedAdvances.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</div>
              <div className="stat-label">Total Monthly Advances</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">Rs. {Number(teaRate || 0).toFixed(2)}</div>
              <div className="stat-label">Active Market Rate (Per Kg)</div>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="layout">
          {/* Left Panel: Advance Form & Rate Set Form */}
          <aside className="form-panel">
            {/* Subsection 1: Tea Rate Management */}
            <p className="panel-label">Market Config</p>
            <h2 className="panel-title">Set Tea Price</h2>
            <p className="panel-subtitle">Configure kilo rate for the month</p>
            
            <form onSubmit={handleRateSubmit} style={{ marginBottom: '2.5rem' }}>
              <div className="field-group">
                <label className="field-label">Target Month</label>
                <input className="field-input" style={{ paddingLeft: '15px' }} type="month" value={rateMonth} onChange={(e) => setRateMonth(e.target.value)} required />
              </div>
              <div className="field-group">
                <label className="field-label">Rate Per Kilo (Rs.)</label>
                <input className="field-input" style={{ paddingLeft: '15px' }} type="number" step="0.01" placeholder="e.g. 240.00" value={teaRate} onChange={(e) => setTeaRate(e.target.value)} required />
              </div>
              <button className="submit-btn" type="submit">Update Monthly Price</button>
              {rateSuccess && <div className="success-toast">✓ Monthly rate configured!</div>}
            </form>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(248,243,232,0.1)', marginBottom: '2rem' }} />

            {/* Subsection 2: Advance Issuing */}
            <p className="panel-label">Transaction Log</p>
            <h2 className="panel-title">Issue Advance</h2>
            <p className="panel-subtitle">Deductible cash or items issue</p>

            <form onSubmit={handleAdvanceSubmit}>
              <div className="field-group">
                <label className="field-label">Supplier</label>
                <div className="field-wrap">
                  <span className="field-icon"><UserIcon /></span>
                  <select className="field-select" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} required>
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Advance Amount (Rs.)</label>
                <div className="field-wrap">
                  <span className="field-icon"><DollarIcon /></span>
                  <input className="field-input" type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Type / Description</label>
                <select className="field-select" style={{ paddingLeft: '15px' }} value={description} onChange={(e) => setDescription(e.target.value)}>
                  <option value="Cash Advance">Cash Advance (මුදල් අත්තිකාරම්)</option>
                  <option value="Fertilizer">Fertilizer Issue (පොහොර නය)</option>
                  <option value="Transport Fee">Transport Fee (ප්‍රවාහන ගාස්තු)</option>
                  <option value="Other">Other Deductions</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Date Issued</label>
                <div className="field-wrap">
                  <span className="field-icon"><CalendarIcon /></span>
                  <input className="field-input" type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} required />
                </div>
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Log Advance Sheet'}
              </button>
              {advanceSuccess && <div className="success-toast">✓ Advance ledger updated!</div>}
            </form>
          </aside>

          {/* Right Panel: History Ledger */}
          <main className="list-panel">
            <h2 style={{ fontFamily: "'DM Serif Display', serif", color: '#1B4332' }}>Debit Ledger History</h2>
            <div className="table-container">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Supplier Name</th>
                    <th>Description</th>
                    <th>Amount Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {advanceList.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#B0A898' }}>No records found for this period.</td>
                    </tr>
                  ) : (
                    advanceList.map((a) => (
                      <tr key={a.id}>
                        <td className="mono-text">{a.issued_date.split('T')[0]}</td>
                        <td style={{ fontWeight: 600, color: '#1B4332' }}>{a.supplier_name}</td>
                        <td><span className="price-badge">{a.description}</span></td>
                        <td className="mono-text" style={{ fontWeight: 'bold', color: '#B71C1C' }}>
                          Rs. {Number(a.amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}