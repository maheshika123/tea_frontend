"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

// --- ICONS ---
const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6 2 3 7 3 12c0 4 2.5 7.5 6 9l1-4c-2-1-3.5-3-3.5-5 0-3.5 2.5-6 5.5-7-1 3 0 6 2 8l2-2c-1.5-1.5-2-4-1-6 2 1 3.5 3 3.5 6 0 2.5-1.5 4.5-3.5 5.5l1 4c3.5-1.5 6-5 6-9.5 0-5-3-9-9-9z" fill="currentColor"/>
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

const ScaleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M12 3v18M12 21H9m3 0h3M6 12l-3 5h6l-3-5zm12 0l-3 5h6l-3-5z" />
  </svg>
);

export default function Weights() {
  const [suppliers, setSuppliers] = useState([]);
  const [weightsList, setWeightsList] = useState([]);
  
  // Form States
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [deduction, setDeduction] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Total Summary Computations
  const totalGross = weightsList.reduce((acc, curr) => acc + Number(curr.weight_kg), 0);
  const totalDeduct = weightsList.reduce((acc, curr) => acc + Number(curr.deduction_kg), 0);
  const totalNet = totalGross - totalDeduct;

  const fetchData = async () => {
    try {
      const supRes = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(supRes.data);
      
      const weightRes = await axios.get('http://localhost:5000/api/weights');
      setWeightsList(weightRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) return alert("Please select a supplier!");
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/weights', {
        supplier_id: selectedSupplier,
        weight_kg: grossWeight,
        deduction_kg: deduction || 0,
        collected_date: logDate
      });
      
      setGrossWeight('');
      setDeduction('');
      setSuccess(true);
      fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Filter weights by searching supplier name
  const filteredWeights = weightsList.filter(w =>
    w.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #F0EBE1;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }

        .app-shell {
          min-height: 100vh;
          background: #F0EBE1;
        }

        /* ── HERO STRIP ── */
        .hero-strip {
          background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 50%, #081C15 100%);
          padding: 3rem 2.5rem 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .hero-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          box-shadow: none;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #74C69D;
          margin-bottom: 0.6rem;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #F8F3E8;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .hero-title em { font-style: italic; color: #C9A84C; }
        .hero-sub { font-size: 0.875rem; color: rgba(248,243,232,0.55); margin-top: 0.5rem; font-weight: 300; }

        .hero-stats { display: flex; gap: 2.5rem; margin-top: 2rem; }
        .stat-item { text-align: left; }
        .stat-value { font-family: 'DM Serif Display', serif; font-size: 2rem; color: #C9A84C; line-height: 1; }
        .stat-label { font-size: 0.7rem; color: rgba(248,243,232,0.45); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; font-family: 'JetBrains Mono', monospace; }

        /* ── LAYOUT ── */
        .layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 0;
          min-height: calc(100vh - 64px - 160px);
        }

        /* ── FORM PANEL (LEFT) ── */
        .form-panel {
          background: #1B4332;
          padding: 2.5rem;
          position: sticky;
          top: 64px;
          height: calc(100vh - 64px);
          overflow-y: auto;
          border-right: 1px solid rgba(201,168,76,0.15);
        }

        .panel-label { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #52B788; margin-bottom: 1.2rem; }
        .panel-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #F8F3E8; margin-bottom: 0.3rem; }
        .panel-subtitle { font-size: 0.8rem; color: rgba(248,243,232,0.4); margin-bottom: 2rem; font-weight: 300; }

        .field-group { margin-bottom: 1.25rem; }
        .field-label { display: block; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(248,243,232,0.5); margin-bottom: 0.5rem; font-family: 'JetBrains Mono', monospace; }
        
        .field-wrap { position: relative; }
        .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #52B788; pointer-events: none; }
        
        .field-input, .field-select {
          width: 100%;
          background: rgba(248,243,232,0.06);
          border: 1px solid rgba(248,243,232,0.12);
          color: #F8F3E8;
          font-size: 0.9rem;
          padding: 12px 14px 12px 40px;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .field-select option { background: #1B4332; color: #F8F3E8; }
        .field-input:focus, .field-select:focus { border-color: #C9A84C; background: rgba(248,243,232,0.09); }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .submit-btn {
          width: 100%; background: #C9A84C; color: #1B4332; border: none; padding: 13px; border-radius: 8px;
          font-size: 0.875rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; margin-top: 0.5rem;
          transition: background 0.2s, transform 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover { background: #D4B660; }
        .submit-btn:active { transform: scale(0.98); }

        .success-toast { background: rgba(82,183,136,0.15); border: 1px solid rgba(82,183,136,0.3); color: #74C69D; padding: 10px 14px; border-radius: 8px; font-size: 0.8rem; margin-top: 1rem; text-align: center; font-family: 'JetBrains Mono', monospace; }

        /* ── LEDGER PANEL (RIGHT) ── */
        .list-panel { background: #F0EBE1; padding: 2.5rem; }
        .list-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; }
        .list-heading { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #1B4332; }
        
        .search-wrap { position: relative; flex: 1; max-width: 300px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #40916C; pointer-events: none; }
        .search-input { width: 100%; background: #fff; border: 1.5px solid #D6CEBC; color: #2D2D2D; font-size: 0.85rem; padding: 9px 14px 9px 36px; border-radius: 8px; outline: none; }
        .search-input:focus { border-color: #2D6A4F; }

        /* ── TABLE STYLES ── */
        .table-container { background: #fff; border: 1.5px solid #E8E0D0; border-radius: 12px; overflow: hidden; }
        .ledger-table { width: 100%; border-collapse: collapse; text-align: left; }
        .ledger-table th { padding: 14px; background: #FAF8F5; border-bottom: 2px solid #E8E0D0; color: #5A7A6A; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; text-transform: uppercase; font-weight: 600; }
        .ledger-table td { padding: 14px; border-bottom: 1px solid #F0EBE1; font-size: 0.9rem; color: #3D3530; }
        .ledger-table tr:hover { background: #FAF9F6; }

        .net-badge { background: #E8F5E9; color: #2E7D32; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; }
        .deduct-text { color: #C62828; font-weight: 500; font-family: 'JetBrains Mono', monospace; }
        .mono-text { font-family: 'JetBrains Mono', monospace; color: #6B6259; }

        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr; }
          .form-panel { position: static; height: auto; }
          .list-toolbar { flex-wrap: wrap; }
        }
      `}</style>

      <div className="app-shell">
        {/* Hero Strip */}
        <div className="hero-strip">
          <p className="hero-eyebrow">Harvest Tracking · දෛනික දළු බර</p>
          <h1 className="hero-title">Daily Leaves <em>Ledger</em></h1>
          <p className="hero-sub">Log daily green leaf weights and compute net yields instantly.</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{totalGross.toFixed(1)} Kg</div>
              <div className="stat-label">Total Gross</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: '#E57373' }}>-{totalDeduct.toFixed(1)} Kg</div>
              <div className="stat-label">Total Deductions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: '#81C784' }}>{totalNet.toFixed(1)} Kg</div>
              <div className="stat-label">Total Net Yield</div>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="layout">
          {/* Left Form Sidepanel */}
          <aside className="form-panel">
            <p className="panel-label">Weight Logging</p>
            <h2 className="panel-title">Record Weight</h2>
            <p className="panel-subtitle">Enter daily tea leaf metrics for calculation</p>

            <form onSubmit={handleWeightSubmit}>
              <div className="field-group">
                <label className="field-label">Select Supplier</label>
                <div className="field-wrap">
                  <span className="field-icon"><UserIcon /></span>
                  <select 
                    className="field-select" 
                    value={selectedSupplier} 
                    onChange={(e) => setSelectedSupplier(e.target.value)} 
                    required
                  >
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (ID: #{String(s.id).padStart(3, '0')})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="field-group">
                  <label className="field-label">Gross Wt. (Kg)</label>
                  <div className="field-wrap">
                    <span className="field-icon"><ScaleIcon /></span>
                    <input className="field-input" type="number" step="0.01" placeholder="0.00" value={grossWeight} onChange={(e) => setGrossWeight(e.target.value)} required />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Deduction (Kg)</label>
                  <div className="field-wrap">
                    <span className="field-icon"><ScaleIcon /></span>
                    <input className="field-input" type="number" step="0.01" placeholder="0.00" value={deduction} onChange={(e) => setDeduction(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Collection Date</label>
                <div className="field-wrap">
                  <span className="field-icon"><CalendarIcon /></span>
                  <input className="field-input" type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} required />
                </div>
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Saving Entry...' : 'Save Weight Entry'}
              </button>

              {success && (
                <div className="success-toast">✓ Weight entry logged successfully</div>
              )}
            </form>
          </aside>

          {/* Right Ledger View */}
          <main className="list-panel">
            <div className="list-toolbar">
              <h2 className="list-heading">Daily Logs Directory</h2>
              <div className="search-wrap">
                <span className="search-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Filter by supplier name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Supplier Name</th>
                    <th>Gross Weight</th>
                    <th>Water/Leaf Deduct.</th>
                    <th>Net Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWeights.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#B0A898' }}>
                        No harvest weight records found for today.
                      </td>
                    </tr>
                  ) : (
                    filteredWeights.map((w) => (
                      <tr key={w.id}>
                        <td className="mono-text">{w.collected_date.split('T')[0]}</td>
                        <td style={{ fontWeight: 600, color: '#1B4332' }}>{w.supplier_name}</td>
                        <td className="mono-text">{Number(w.weight_kg).toFixed(2)} Kg</td>
                        <td className="deduct-text">-{Number(w.deduction_kg).toFixed(2)} Kg</td>
                        <td>
                          <span className="net-badge">{Number(w.net_weight).toFixed(2)} Kg</span>
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