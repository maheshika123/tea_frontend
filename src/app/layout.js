import Link from 'next/link';

export const metadata = {
  title: "Ceylon Leaf Desk",
  description: "Tea Dealer Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            background: #F0EBE1;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
          }

          /* ── MAIN WORKSPACE CONTAINER ── */
          .workspace-wrapper {
            display: grid;
            grid-template-columns: 280px 1fr; /* Sidebar = 280px, Content = Remaining */
            min-height: 100vh;
          }

          /* ── SIDEBAR STYLE ── */
          .sidebar {
            background: #1B4332;
            color: #F8F3E8;
            padding: 2.5rem 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: sticky;
            top: 0;
            height: 100vh;
            border-right: 1px solid rgba(201,168,76,0.15);
            box-shadow: 4px 0 20px rgba(8,28,21,0.2);
          }

          .sidebar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #C9A84C;
            margin-bottom: 3rem;
            padding-left: 0.5rem;
          }

          .brand-text {
            font-family: 'DM Serif Display', serif;
            font-size: 1.25rem;
            color: #F8F3E8;
            letter-spacing: 0.02em;
          }

          .brand-text span {
            color: #C9A84C;
          }

          .nav-menu {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex-grow: 1;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            color: rgba(248,243,232,0.7);
            text-decoration: none;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.2s;
          }

          .nav-link:hover {
            background: rgba(248,243,232,0.06);
            color: #C9A84C;
            padding-left: 20px; /* Slight push animation */
          }

          /* Footer credits embedded inside sidebar bottom */
          .sidebar-footer {
            border-top: 1px solid rgba(248,243,232,0.08);
            padding-top: 1rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem;
            color: rgba(248,243,232,0.3);
            text-align: center;
          }

          /* ── MAIN CONTENT VIEWPORT ── */
          .main-content {
            height: 100vh;
            overflow-y: auto;
            padding-bottom: 3rem;
          }

          /* Print adjustment to remove sidebar automatically on paper print */
          @media print {
            .sidebar { display: none; }
            .workspace-wrapper { grid-template-columns: 1fr; }
            .main-content { height: auto; overflow: visible; }
          }
        `}</style>

        <div className="workspace-wrapper">
          {/* Permanent Enterprise Sidebar Component */}
          <aside className="sidebar">
            <div>
              <div className="sidebar-brand">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6 2 3 7 3 12c0 4 2.5 7.5 6 9l1-4c-2-1-3.5-3-3.5-5 0-3.5 2.5-6 5.5-7-1 3 0 6 2 8l2-2c-1.5-1.5-2-4-1-6 2 1 3.5 3 3.5 6 0 2.5-1.5 4.5-3.5 5.5l1 4c3.5-1.5 6-5 6-9.5 0-5-3-9-9-9z" fill="currentColor"/>
                </svg>
                <span className="brand-text">Ceylon <span>Leaf</span> Desk</span>
              </div>

              

<nav className="nav-menu">
  <Link href="/" className="nav-link">📊 <span>Control Dashboard</span></Link>
  <Link href="/supplierslat" className="nav-link">👥 <span>Suppliers Directory</span></Link>
  <Link href="/weights" className="nav-link">⚖️ <span>Daily Weights Log</span></Link>
  <Link href="/advances" className="nav-link">💰 <span>Advances & Rates</span></Link>
  <Link href="/factory" className="nav-link">🏭 <span>Factory Sales & Comm.</span></Link>
  <Link href="/reports" className="nav-link">📋 <span>Monthly Pay Sheets</span></Link>
</nav>
            </div>

            <div className="sidebar-footer">
              <p>v1.0 · Stable Cloud</p>
              <p style={{ marginTop: '2px' }}>© {new Date().getFullYear()} Leaf Desk</p>
            </div>
          </aside>

          {/* Dynamic Page Component Render Area */}
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}