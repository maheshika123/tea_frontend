"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'; // 👈 1. Palamuvenma Next.js Link component eka import karanna

export default function Dashboard() {
  const [stats, setStats] = useState({
    today_net_weight: 0,
    total_suppliers: 0,
    month_net_weight: 0,
    month_total_advances: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get('https://teaapi.mcdi.online/api/dashboard/summary');
      setStats(res.data);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <>
      <style>{`
        .dashboard-container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .welcome-header { margin-bottom: 2.5rem; }
        .welcome-header h1 { font-family: 'DM Serif Display', serif; font-size: 2.5rem; color: #1B4332; }
        .welcome-header h1 span { color: #C9A84C; }
        .welcome-header p { color: #6B6259; font-size: 0.95rem; margin-top: 4px; }

        .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .analytic-card { background: #fff; border: 1.5px solid #E8E0D0; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(27,67,50,0.02); }
        .card-lbl { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #7A7265; font-family: 'JetBrains Mono', monospace; margin-bottom: 6px; }
        .card-val { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: #1B4332; }
        .card-val span { color: #C9A84C; font-size: 1.2rem; font-family: 'Inter', sans-serif; font-weight: 500; }

        .quick-links { background: #1B4332; padding: 2.5rem; border-radius: 16px; color: #F8F3E8; }
        .links-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #C9A84C; margin-bottom: 1.5rem; }
        .links-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
        
        @media (max-width: 768px) {
          .links-grid { grid-template-columns: 1fr; }
        }

        .link-btn { background: rgba(248,243,232,0.06); border: 1px solid rgba(248,243,232,0.12); border-radius: 10px; padding: 1.5rem; text-align: center; color: #F8F3E8; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.2s; display: block; cursor: pointer; }
        .link-btn:hover { background: #C9A84C; color: #1B4332; border-color: #C9A84C; }
        .link-desc { font-size: 0.75rem; color: rgba(248,243,232,0.4); font-weight: 400; margin-top: 4px; display: block; }
        .link-btn:hover .link-desc { color: rgba(27,67,50,0.6); }
      `}</style>

      <div className="dashboard-container">
        <div className="welcome-header">
          <h1>Ceylon <span>Leaf Desk</span> Dashboard</h1>
          <p>Real-time analytics monitor for your everyday tea distribution network.</p>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'JetBrains Mono', color: '#7A7265' }}>Syncing telemetry data matrices...</p>
        ) : (
          <div className="analytics-grid">
            <div className="analytic-card" style={{ borderLeft: '4px solid #2D6A4F' }}>
              <div className="card-lbl">Today's Harvest Intake</div>
              <div className="card-val">{stats.today_net_weight.toFixed(1)} <span>Kg</span></div>
            </div>
            <div className="analytic-card" style={{ borderLeft: '4px solid #C9A84C' }}>
              <div className="card-lbl">Active Suppliers Base</div>
              <div className="card-val">{stats.total_suppliers} <span>Growers</span></div>
            </div>
            <div className="analytic-card" style={{ borderLeft: '4px solid #52B788' }}>
              <div className="card-lbl">Monthly Collected Volume</div>
              <div className="card-val">{stats.month_net_weight.toFixed(1)} <span>Kg</span></div>
            </div>
            <div className="analytic-card" style={{ borderLeft: '4px solid #E57373' }}>
              <div className="card-lbl">Monthly Advances Outflow</div>
              <div className="card-val"><span>Rs.</span> {stats.month_total_advances.toLocaleString('en-LK', { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
        )}

        <div className="quick-links">
          <h2 className="links-title">⚡ Quick Management Stations</h2>
          <div className="links-grid">
            
            {/* 2. 🌟 Paran <a> tag eka venuvata <Link> component eka dynamic dammā */}
            <Link href="/supplierslat" className="link-btn">
              👥 Suppliers Directory
              <span className="link-desc">Register and manage growers list</span>
            </Link>

            <Link href="/weights" className="link-btn">
              ⚖️ Daily Weight Logger
              <span className="link-desc">Record harvest yields entries</span>
            </Link>

            <Link href="/advances" className="link-btn">
              💰 Advance & Debit Matrix
              <span className="link-desc">Configure loans & fertilizer issue</span>
            </Link>

            <Link href="/factory" className="link-btn">
              🏭 Factory Income & Commissions
              <span className="link-desc">Track sales margins and wastage analysis</span>
            </Link>

            <Link href="/reports" className="link-btn" style={{ gridColumn: 'span 2' }}>
              📋 Accounts & Pay Sheets
              <span className="link-desc">Compute final monthly accounts statement</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}