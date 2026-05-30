import React, { useState, useMemo } from 'react';

const APPS_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyoumuFzj0zjMrA1FBmy5ibhN6FQkvEMgeS8JzC_fTijJpQwHQO71QtQW6vxELIryAy/exec";

export default function AdminDashboard({ apartments, sheetData, onRefresh }) {
  const [pin, setPin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Bulk edit state
  const [selectedApt, setSelectedApt] = useState(apartments?.[0]?.key || '');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);

  // Use availability map similarly to App.jsx
  const availability = useMemo(() => {
    const map = {};
    apartments.forEach(a => map[a.key] = {});
    sheetData.forEach(row => {
      if (!row.apartment || !row.date) return;
      const aptKey = String(row.apartment).trim();
      const rowDate = String(row.date).trim();

      if (map[aptKey]) {
        const price = parseFloat(row.price);
        let available = false;
        if (row.available) {
          const val = String(row.available).trim().toUpperCase();
          available = val === 'TRUE';
        }

        map[aptKey][rowDate] = {
          price: isNaN(price) ? null : price,
          available: available
        };
      }
    });
    return map;
  }, [sheetData, apartments]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin.length > 0) setIsLoggedIn(true);
  };

  const handleSave = async () => {
    if (!APPS_SCRIPT_WEBHOOK_URL) {
      setMessage("Error: Webhook URL is not configured.");
      return;
    }
    if (!editStart || !editEnd) {
      setMessage("Please select a date range.");
      return;
    }
    if (editStart > editEnd) {
      setMessage("Start date must be before end date.");
      return;
    }

    setSaving(true);
    setMessage('');

    // Generate dates parsing as local time to avoid UTC offset bugs
    const [sYear, sMonth, sDay] = editStart.split('-').map(Number);
    const start = new Date(sYear, sMonth - 1, sDay);
    const [eYear, eMonth, eDay] = editEnd.split('-').map(Number);
    const end = new Date(eYear, eMonth - 1, eDay);
    const updates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      updates.push({
        date: dateStr,
        apartment: selectedApt,
        price: editPrice === '' ? 0 : parseFloat(editPrice),
        available: editAvailable
      });
    }

    try {
      const response = await fetch(APPS_SCRIPT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Avoid CORS preflight
        },
        body: JSON.stringify({
          pin,
          updates
        }),
        redirect: 'follow'
      });

      const result = await response.json();
      if (result.success) {
        setMessage(`Success! ${updates.length} days updated.`);
        setEditStart('');
        setEditEnd('');
        setEditPrice('');
        // Call parent's onRefresh to refetch CSV data
        if (onRefresh) onRefresh();
      } else {
        setMessage(`Error: ${result.error}`);
        if (result.error === 'Invalid PIN') {
          setIsLoggedIn(false);
          setPin('');
        }
      }
    } catch (err) {
      setMessage("Error sending updates. Check console.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl animate-fade-in border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-center text-xl tracking-widest"
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <button onClick={() => { setIsLoggedIn(false); setPin(''); }} className="text-slate-500 hover:text-slate-800">Logout</button>
      </div>

      {!APPS_SCRIPT_WEBHOOK_URL && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl mb-8">
          <strong>Configuration Needed:</strong> Please set the <code>APPS_SCRIPT_WEBHOOK_URL</code> in <code>AdminDashboard.jsx</code>.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Bulk Edit Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Bulk Edit</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apartment</label>
              <select
                value={selectedApt}
                onChange={(e) => setSelectedApt(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {apartments.map(a => (
                  <option key={a.id} value={a.key}>{a.key}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From</label>
                <input
                  type="date"
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To</label>
                <input
                  type="date"
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price / Night (€)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. 100"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
              <button
                onClick={() => setEditAvailable(true)}
                className={`flex-1 py-2 rounded-lg font-bold text-sm ${editAvailable ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}
              >
                Available
              </button>
              <button
                onClick={() => setEditAvailable(false)}
                className={`flex-1 py-2 rounded-lg font-bold text-sm ${!editAvailable ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}
              >
                Blocked
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-4 mt-4 rounded-xl font-bold text-white shadow-lg transition-all ${saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-semibold ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Current State / Preview */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">Current Status: {selectedApt}</h2>
          <p className="text-sm text-slate-500 mb-4">Click a date to quickly set it in the Bulk Edit form, or view the next 24 months of availability.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(24)].map((_, mOffset) => {
              const baseDate = new Date();
              baseDate.setDate(1); // Set to 1st to avoid skipping months
              baseDate.setMonth(baseDate.getMonth() + mOffset);

              const year = baseDate.getFullYear();
              const month = baseDate.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const firstDay = new Date(year, month, 1).getDay();

              const days = [];
              for (let i = 0; i < firstDay; i++) days.push(null);
              for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

              return (
                <div key={mOffset} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4 text-center">
                    {baseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="font-bold text-slate-400 py-1">{d}</div>)}
                    {days.map((d, i) => {
                      if (!d) return <div key={`empty-${i}`}></div>;
                      const yyyy = d.getFullYear();
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const dd = String(d.getDate()).padStart(2, '0');
                      const key = `${yyyy}-${mm}-${dd}`;
                      const info = availability[selectedApt]?.[key];
                      const isAvail = info?.available;

                      const isSelected = key >= editStart && key <= editEnd && editStart !== '';
                      
                      let bg = 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'; // Blocked
                      if (isAvail) bg = 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100';
                      if (!info) bg = 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'; // No data

                      if (isSelected) {
                        bg += ' ring-2 ring-blue-600 ring-offset-2 z-10';
                      }

                      return (
                        <button
                          key={key}
                          onClick={() => {
                            if (!editStart || editStart !== editEnd) {
                              // Start a new range
                              setEditStart(key);
                              setEditEnd(key);
                            } else {
                              // We already have a single day selected, so this click sets the end date
                              if (key >= editStart) {
                                setEditEnd(key);
                              } else {
                                // Clicked before start date, so start over
                                setEditStart(key);
                                setEditEnd(key);
                              }
                            }
                            setEditPrice(info?.price ?? '');
                            setEditAvailable(!!isAvail);
                          }}
                          className={`p-1 h-10 rounded flex flex-col items-center justify-center transition-all ${bg}`}
                          title={key}
                        >
                          <span className="font-bold">{d.getDate()}</span>
                          {isAvail && <span className="text-[9px] opacity-80">{info.price}€</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
