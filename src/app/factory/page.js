"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FactoryManagement() {
  const currentMonth = new Date().toISOString().slice(0, 7); // '2026-06'
  const [targetMonth, setTargetMonth] = useState(currentMonth);
  const [salesHistory, setSalesHistory] = useState([]);
  const [profitSummary, setProfitSummary] = useState({
    factory_total_kg: 0,
    supplier_total_kg: 0,
    leaf_wastage_kg: 0,
    total_revenue: 0,
    total_cost: 0,
    net_commission_profit: 0
  });

  // Form States
  const [factoryName, setFactoryName] = useState('');
  const [deliveredKg, setDeliveredKg] = useState('');
  const [factoryRate, setFactoryRate] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [success, setSuccess] = useState(false);

  const fetchFactoryData = async () => {
    try {
      const historyRes = await axios.get('https://teaapi.mcdi.online/api/factory-sales');
      setSalesHistory(historyRes.data);

      const summaryRes = await axios.get(`https://teaapi.mcdi.online/api/reports/commission/${targetMonth}`);
      setProfitSummary(summaryRes.data);
    } catch (err) {
      console.error("Error loading factory data:", err);
    }
  };

  useEffect(() => {
    fetchFactoryData();
  }, [targetMonth]);

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://teaapi.mcdi.online/api/factory-sales', {
        factory_name: factoryName,
        supplied_month: targetMonth,
        total_delivered_kg: deliveredKg,
        factory_rate_per_kg: factoryRate,
        recorded_date: logDate
      });
      setFactoryName('');
      setDeliveredKg('');
      setFactoryRate('');
      setSuccess(true);
      fetchFactoryData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{`
        .factory-container { display: grid; grid-template-columns: 380px 1fr; gap: 0; min-height: 100vh; }
        .side-form { background: #1B4332; padding: 2.5rem 2rem; color: #F8F3E8; border-right: 1px solid rgba(201,168,76,0.15); }
        .panel-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #F8F3E8; margin-bottom: 1.5rem; }
        
        .ctrl-group { margin-bottom: 1.25rem; }
        .ctrl-lbl { display: block; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: rgba(248,243,232,0.5); margin-bottom: 0.4rem; font-family: 'JetBrains Mono', monospace; }
        .ctrl-input { width: 100%; background: rgba(248,243,232,0.06); border: 1px solid rgba(248,243,232,0.12); color: #F8F3E8; padding: 12px; border-radius: 8px; outline: none; font-size: 0.9rem; }
        .save-btn { width: 100%; background: #C9A84C; color: #1B4332; border: none; padding: 13px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 1rem; }

        .main-panel { padding: 2.5rem; background: #F0EBE1; }
        .month-bar { display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 15px 25px; border-radius: 12px; border: 1.5px solid #E8E0D0; margin-bottom: 2rem; }
        
        /* Analytics Grid */
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-bottom: 2.5rem; }
        .profit-card { background: #fff; border: 1.5px solid #E8E0D0; padding: 1.5rem; border-radius: 12px; }
        .profit-card h3 { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: #7A7265; text-transform: uppercase; margin-bottom: 4px; }
        .profit-card p { font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: #1B4332; }

        .table-wrap { background: #fff; border: 1.5px solid #E8E0D0; border-radius: 12px; overflow: hidden; }
        .f-table { width: 100%; border-collapse: collapse; text-align: left; }
        .f-table th { padding: 14px; background: #FAF8F5; border-bottom: 2px solid #E8E0D0; color: #5A7A6A; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; text-transform: uppercase; }
        .f-table td { padding: 14px; border-bottom: 1px solid #F0EBE1; font-size: 0.9rem; }
      `}</style>

      <div className="factory-container">
        {/* Left Form Panel */}
        <aside className="side-form">
          <h2 className="panel-title">🏭 Log Factory Sale</h2>
          <form onSubmit={handleSaleSubmit}>
            <div className="ctrl-group">
              <label className="ctrl-lbl">Factory Name</label>
              <input className="ctrl-input" type="text" placeholder="e.g. Deniyaya Tea Factory" value={factoryName} onChange={(e) => setFactoryName(e.target.value)} required />
            </div>
            <div className="ctrl-group">
              <label className="ctrl-lbl">Delivered Weight (Kg)</label>
              <input className="ctrl-input" type="number" step="0.01" placeholder="0.00" value={deliveredKg} onChange={(e) => setDeliveredKg(e.target.value)} required />
            </div>
            <div className="ctrl-group">
              <label className="ctrl-lbl">Factory Kilo Rate (Rs.)</label>
              <input className="ctrl-input" type="number" step="0.01" placeholder="e.g. 280.00" value={factoryRate} onChange={(e) => setFactoryRate(e.target.value)} required />
            </div>
            <div className="ctrl-group">
              <label className="ctrl-lbl">Date of Delivery</label>
              <input className="ctrl-input" type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} required />
            </div>
            <button className="save-btn" type="submit">Record Factory Sale</button>
            {success && <div style={{ background: 'rgba(82,183,136,0.15)', color: '#74C69D', padding: '10px', borderRadius: '8px', marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem' }}>✓ Factory transaction logged!</div>}
          </form>
        </aside>

        {/* Right Main Analytics Display Panel */}
        <main className="main-panel">
          <div className="month-bar">
            <h2 style={{ fontFamily: "'DM Serif Display', serif", color: '#1B4332' }}>Commission & Margins Desk</h2>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B4332', marginRight: '10px' }}>Select Month:</span>
              <input style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #B0A898', fontFamily: 'JetBrains Mono' }} type="month" value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)} />
            </div>
          </div>

          {/* Live Profit Dashboard */}
          <div className="summary-grid">
            <div className="profit-card" style={{ borderLeft: '4px solid #C9A84C' }}>
              <h3>Total Factory Income</h3>
              <p>Rs. {profitSummary.total_revenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="profit-card" style={{ borderLeft: '4px solid #C62828' }}>
              <h3>Total Suppliers Cost</h3>
              <p>Rs. {profitSummary.total_cost.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="profit-card" style={{ borderLeft: '4px solid #2E7D32' }}>
              <h3>Dealer Net Commission</h3>
              <p style={{ color: profitSummary.net_commission_profit >= 0 ? '#2E7D32' : '#C62828' }}>
                Rs. {profitSummary.net_commission_profit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="summary-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="profit-card">
              <h3>Bought From Growers</h3>
              <p style={{ fontSize: '1.4rem' }}>{profitSummary.supplier_total_kg.toFixed(2)} Kg</p>
            </div>
            <div className="profit-card">
              <h3>Accepted By Factory</h3>
              <p style={{ fontSize: '1.4rem' }}>{profitSummary.factory_total_kg.toFixed(2)} Kg</p>
            </div>
            <div className="profit-card">
              <h3>Transit Leaf Wastage</h3>
              <p style={{ fontSize: '1.4rem', color: '#E65100' }}>{profitSummary.leaf_wastage_kg.toFixed(2)} Kg</p>
            </div>
          </div>

          {/* Sales History Log */}
<h3 style={{ fontFamily: "'DM Serif Display', serif", color: '#1B4332', marginBottom: '1rem' }}>Factory Delivery History</h3>          <div className="table-wrap">
            <table className="f-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Factory Name</th>
                  <th>Delivered Weight</th>
                  <th>Factory Kilo Rate</th>
                  <th>Gross Value</th>
                </tr>
              </thead>
              <tbody>
                {salesHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#B0A898' }}>No factory transactions recorded yet.</td>
                  </tr>
                ) : (
                  salesHistory.map(sale => (
                    <tr key={sale.id}>
                      <td style={{ fontFamily: 'JetBrains Mono', color: '#6B6259' }}>{sale.recorded_date.split('T')[0]}</td>
                      <td style={{ fontWeight: 600, color: '#1B4332' }}>{sale.factory_name}</td>
                      <td>{Number(sale.total_delivered_kg).toFixed(2)} Kg</td>
                      <td>Rs. {Number(sale.factory_rate_per_kg).toFixed(2)}</td>
                      <td style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        Rs. {(sale.total_delivered_kg * sale.factory_rate_per_kg).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}