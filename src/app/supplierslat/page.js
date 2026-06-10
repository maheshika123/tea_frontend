"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// --- PREMIUM LINED ICONS ---
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .08h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.02z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function SuppliersLatPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('https://teaapi.mcdi.online/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers list:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      await axios.post('https://teaapi.mcdi.online/api/suppliers', { name, phone, joined_date: today });
      setName('');
      setPhone('');
      setSuccess(true);
      fetchSuppliers();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone && s.phone.includes(searchQuery))
  );

  const getInitials = (n) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = ['#2D6A4F', '#1B4332', '#C9A84C', '#8B5E3C', '#457B9D'];
  const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <>
      <style>{`
        .suppliers-wrapper { display: grid; grid-template-columns: 360px 1fr; min-height: 100vh; }
        
        .side-form-panel { background: #1B4332; padding: 2.5rem 2rem; color: #F8F3E8; border-right: 1px solid rgba(201,168,76,0.15); }
        .form-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #F8F3E8; margin-bottom: 0.2rem; }
        .form-sub { font-size: 0.8rem; color: rgba(248,243,232,0.4); margin-bottom: 2rem; }

        .input-group { margin-bottom: 1.25rem; }
        .input-lbl { display: block; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(248,243,232,0.5); margin-bottom: 0.5rem; font-family: 'JetBrains Mono', monospace; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #52B788; }
        .input-ctrl { width: 100%; background: rgba(248,243,232,0.06); border: 1px solid rgba(248,243,232,0.12); color: #F8F3E8; font-size: 0.9rem; padding: 12px 14px 12px 40px; border-radius: 8px; outline: none; }
        
        .save-btn { width: 100%; background: #C9A84C; color: #1B4332; border: none; padding: 13px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 1rem; }
        .toast { background: rgba(82,183,136,0.15); color: #74C69D; padding: 10px; border-radius: 8px; margin-top: 1rem; text-align: center; font-size: 0.8rem; }

        .main-list-panel { padding: 3rem 2.5rem; background: #F0EBE1; }
        .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
        .page-title { font-family: 'DM Serif Display', serif; font-size: 2rem; color: #1B4332; }
        .search-box { width: 280px; background: #fff; border: 1.5px solid #D6CEBC; padding: 10px 14px; border-radius: 8px; outline: none; font-size: 0.85rem; }

        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; }
        .sup-card { background: #fff; border: 1.5px solid #E8E0D0; border-radius: 12px; padding: 1.25rem; transition: all 0.2s; }
        .sup-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,67,50,0.05); border-color: #C9A84C; }
        
        .card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
        .card-avatar { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: #fff; }
        .card-title { font-weight: 600; font-size: 0.95rem; color: #1B4332; }
        .card-code { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: #B0A898; }
        
        .card-body { display: flex; flex-direction: column; gap: 6px; font-size: 0.8rem; color: #6B6259; }
        .card-foot { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #F0EBE1; display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: #40916C; font-weight: 600; }
        .dot { width: 6px; height: 6px; background: #40916C; border-radius: 50%; display: inline-block; margin-right: 4px; }
      `}</style>

      <div className="suppliers-wrapper">
        {/* Left Input Sidepanel Form */}
        <aside className="side-form-panel">
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Network Directory</p>
          <h2 className="form-title">Onboard Growers</h2>
          <p className="form-sub">Register a new profile to network</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-lbl">Grower Full Name</label>
              <div className="input-wrap">
                <span className="input-icon"><UserIcon /></span>
                <input className="input-ctrl" type="text" placeholder="Kamal Perera" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-lbl">Contact Phone Number</label>
              <div className="input-wrap">
                <span className="input-icon"><PhoneIcon /></span>
                <input className="input-ctrl" type="text" placeholder="077 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <button className="save-btn" type="submit" disabled={loading}>
              {loading ? 'Registering…' : 'Add New Supplier'}
            </button>

            {success && <div className="toast">✓ Registered Successfully</div>}
          </form>
        </aside>

        {/* Right Dynamic Card Matrix View */}
        <main className="main-list-panel">
          <div className="top-bar">
            <h1 className="page-title" style={{ fontFamily: "'DM Serif Display', serif" }}>Suppliers Registry Base</h1>
            <input className="search-box" type="text" placeholder="Search by name or number…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="grid-layout">
            {filteredSuppliers.map((s, i) => (
              <div className="sup-card" key={s.id}>
                <div className="card-top">
                  <div className="card-avatar" style={{ background: getColor(s.name) }}>{getInitials(s.name)}</div>
                  <div>
                    <div className="card-title">{s.name}</div>
                    <div className="card-code">ID Code: #{String(s.id).padStart(4, '0')}</div>
                  </div>
                </div>
                <div className="card-body">
                  <div><PhoneIcon /> {s.phone || '—'}</div>
                  <div><CalendarIcon /> {s.joined_date ? new Date(s.joined_date).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</div>
                </div>
                <div className="card-foot">
                  <div><span className="dot" />ACTIVE SUPPLIER</div>
                  <span style={{ color: '#C9B99A', fontFamily: 'JetBrains Mono' }}>#{String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}