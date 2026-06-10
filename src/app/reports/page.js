"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reports() {
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., '2026-06'
  const [targetMonth, setTargetMonth] = useState(currentMonth);
  const [reportData, setReportData] = useState([]);
  const [marketRate, setMarketRate] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMonthlyReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/monthly/${targetMonth}`);
      setReportData(res.data.data);
      setMarketRate(res.data.rate_per_kg);
    } catch (err) {
      console.error("Error generating report:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, [targetMonth]);

  // Aggregate totals for final summary row
  const overallWeight = reportData.reduce((acc, curr) => acc + curr.total_weight_kg, 0);
  const overallGross = reportData.reduce((acc, curr) => acc + curr.gross_earnings, 0);
  const overallAdvances = reportData.reduce((acc, curr) => acc + curr.total_advances, 0);
  const overallNetPay = reportData.reduce((acc, curr) => acc + curr.net_payable, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0EBE1; font-family: 'Inter', sans-serif; min-height: 100vh; padding: 2.5rem; }
        
        .report-wrapper { max-width: 1200px; margin: 0 auto; background: #fff; border: 1.5px solid #E8E0D0; border-radius: 16px; padding: 2.5rem; box-shadow: 0 4px 30px rgba(27,67,50,0.05); }
        .report-header { display: flex; justify-content: space-between; align-items: flex-start; border-b: 2px solid #F0EBE1; padding-bottom: 1.5rem; margin-bottom: 2rem; }
        .brand-title { font-family: 'DM Serif Display', serif; font-size: 2rem; color: #1B4332; }
        .brand-title span { color: #C9A84C; font-style: italic; }
        
        .control-bar { display: flex; align-items: center; gap: 12px; background: #FAF8F5; padding: 12px 20px; border-radius: 8px; border: 1px solid #E8E0D0; }
        .month-select { padding: 8px 12px; border-radius: 6px; border: 1px solid #B0A898; background: #fff; font-size: 0.9rem; outline: none; font-family: 'JetBrains Mono', monospace; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-card { background: #FAF8F5; border: 1px solid #E8E0D0; padding: 1.5rem; border-radius: 10px; }
        .stat-lbl { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: #7A7265; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
        .stat-val { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #1B4332; }

        .report-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .report-table th { padding: 14px; background: #1B4332; color: #F8F3E8; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
        .report-table th:nth-child(n+3), .report-table td:nth-child(n+3) { text-align: right; }
        .report-table td { padding: 14px; border-bottom: 1px solid #F0EBE1; font-size: 0.9rem; color: #3D3530; }
        .report-table tr:hover { background: #FAF9F6; }
        
        .total-row { background: #FAF8F5; font-weight: 700; border-top: 2px solid #1B4332; border-bottom: 2px solid #1B4332; }
        .total-row td { color: #1B4332 !important; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        .pay-positive { color: #2E7D32; font-weight: bold; }
        .pay-negative { color: #C62828; font-weight: bold; }
        .print-btn { background: #1B4332; color: #fff; padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .print-btn:hover { background: #2D6A4F; }

        @media print {
          body { background: white; padding: 0; }
          .report-wrapper { border: none; box-shadow: none; padding: 0; }
          .control-bar, .print-btn { display: none; }
        }
      `}</style>

      <div className="report-wrapper">
        {/* Top Shell */}
        <div className="report-header">
          <div>
            <h1 className="brand-title">Monthly <span>Pay Sheet Ledger</span></h1>
            <p style={{ fontSize: '0.85rem', color: '#7A7265', marginTop: '4px' }}>Generated Statement of Accounts for Tea Smallholders</p>
          </div>
          
          <div className="control-bar">
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B4332' }}>Statement Period:</span>
            <input 
              className="month-select" 
              type="month" 
              value={targetMonth} 
              onChange={(e) => setTargetMonth(e.target.value)} 
            />
            <button className="print-btn" onClick={() => window.print()}>🖨️ Print Statement</button>
          </div>
        </div>

        {/* Global Overview Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-lbl">Active Market Price</div>
            <div className="stat-val" style={{ color: '#C9A84C' }}>Rs. {marketRate.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">Total Leaves Bought</div>
            <div className="stat-val">{overallWeight.toFixed(2)} Kg</div>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">Total Deductions (Advances)</div>
            <div className="stat-val" style={{ color: '#C62828' }}>Rs. {overallAdvances.toLocaleString('en-LK', {minimumFractionDigits: 2})}</div>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">Net Total Payout</div>
            <div className="stat-val" style={{ color: '#2E7D32' }}>Rs. {overallNetPay.toLocaleString('en-LK', {minimumFractionDigits: 2})}</div>
          </div>
        </div>

        {/* Core Sheet Table */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'JetBrains Mono' }}>Computing accounts matrix...</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier Name</th>
                <th>Net Yield (Kg)</th>
                <th>Rate (Rs.)</th>
                <th>Gross Earnings</th>
                <th>Advances / Deductions</th>
                <th>Net Payable Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#B0A898' }}>No active transactions found for this season month.</td>
                </tr>
              ) : (
                reportData.map((row) => (
                  <tr key={row.supplier_id}>
                    <td className="mono">#{String(row.supplier_id).padStart(3, '0')}</td>
                    <td style={{ fontWeight: 600 }}>{row.supplier_name}</td>
                    <td className="mono">{row.total_weight_kg.toFixed(2)} Kg</td>
                    <td className="mono">Rs. {row.rate_used.toFixed(2)}</td>
                    <td className="mono">Rs. {row.gross_earnings.toLocaleString('en-LK', {minimumFractionDigits: 2})}</td>
                    <td className="mono" style={{ color: row.total_advances > 0 ? '#C62828' : '#3D3530' }}>
                      {row.total_advances > 0 ? `-Rs. ${row.total_advances.toLocaleString('en-LK', {minimumFractionDigits: 2})}` : 'Rs. 0.00'}
                    </td>
                    <td>
                      <span className={row.net_payable >= 0 ? 'pay-positive mono' : 'pay-negative mono'}>
                        Rs. {row.net_payable.toLocaleString('en-LK', {minimumFractionDigits: 2})}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              
              {/* Total Aggregate Row */}
              {reportData.length > 0 && (
                <tr className="total-row">
                  <td colSpan="2">TOTAL SUMMARY SUMMARY</td>
                  <td className="mono">{overallWeight.toFixed(2)} Kg</td>
                  <td className="mono">—</td>
                  <td className="mono">Rs. {overallGross.toLocaleString('en-LK', {minimumFractionDigits: 2})}</td>
                  <td className="mono" style={{ color: '#C62828' }}>-Rs. {overallAdvances.toLocaleString('en-LK', {minimumFractionDigits: 2})}</td>
                  <td className="mono">Rs. {overallNetPay.toLocaleString('en-LK', {minimumFractionDigits: 2})}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}