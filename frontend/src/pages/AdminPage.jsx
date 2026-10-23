import React, { useEffect, useMemo, useState } from 'react';
import {
  createAdminDriver, deleteAdminDriver, fetchAdminDrivers, fetchCities,
  importAdminDrivers, downloadAdminFile, updateAdminDriver
} from '../services/api';

const LOCAL_KEY = 'driver-directory-admin-records';
const EMPTY_FORM = { name: '', phone: '', city: 'Darjeeling', area: 'Mall Road Stand', vehicleMake: 'Toyota', vehicleModel: 'Innova', categories: ['Driver'], rating: 0 };

function readLocalRecords() { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; } }
function writeLocalRecords(records) { localStorage.setItem(LOCAL_KEY, JSON.stringify(records)); }

export default function AdminPage({ onLogout }) {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const loadDrivers = async (query = search) => {
    try {
      const data = await fetchAdminDrivers(query);
      setDrivers(data.drivers || []); setTotalRecords(data.total || data.drivers?.length || 0); writeLocalRecords(data.drivers || []);
    } catch {
      let local = readLocalRecords();
      if (!local.length) { try { const fallback = await (await fetch('/api/drivers')).json(); local = fallback.drivers || []; writeLocalRecords(local); } catch { local = []; } }
      const normalizedQuery = query.trim().toLowerCase();
      setDrivers(normalizedQuery ? local.filter(driver => driver.name.toLowerCase().includes(normalizedQuery)) : local);
    }
  };

  useEffect(() => { fetchCities().then(setCities); loadDrivers(''); }, []);

  const visibleCount = drivers.length;
  const ratedCount = useMemo(() => drivers.filter(driver => driver.rating > 0).length, [drivers]);
  const roleCount = useMemo(() => drivers.filter(driver => driver.categories.includes('Owner')).length, [drivers]);
  const averageRating = useMemo(() => { const rated = drivers.filter(driver => driver.rating > 0); return rated.length ? (rated.reduce((sum, driver) => sum + Number(driver.rating), 0) / rated.length).toFixed(1) : '0.0'; }, [drivers]);
  const updateForm = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const toggleRole = role => setForm(previous => ({ ...previous, categories: previous.categories.includes(role) ? previous.categories.filter(item => item !== role) : [...previous.categories, role] }));

  const beginEdit = driver => {
    setEditingId(driver.id); setIsFormOpen(true);
    setForm({ name: driver.name || '', phone: driver.phone || '', city: driver.cityName || 'Darjeeling', area: driver.areaName || 'Mall Road Stand', vehicleMake: driver.vehicleMake || 'Toyota', vehicleModel: driver.vehicleModel || 'Innova', categories: driver.categories || ['Driver'], rating: driver.rating || 0 });
  };
  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setIsFormOpen(true); };
  const cancelEdit = () => { setEditingId(null); setIsFormOpen(false); setForm(EMPTY_FORM); };

  const handleCreate = async event => {
    event.preventDefault(); if (!form.name.trim()) return; setBusy(true);
    try {
      if (editingId) { const updated = await updateAdminDriver(editingId, form); setStatus(`${updated.name} updated successfully.`); }
      else { const created = await createAdminDriver(form); setStatus(`${created.name} added successfully.`); }
      cancelEdit(); await loadDrivers('');
    } catch {
      const wasEditing = Boolean(editingId); const local = readLocalRecords(); const editedRecord = editingId ? local.find(item => item.id === editingId) : null;
      const created = { ...(editedRecord || {}), ...form, id: editingId || Date.now(), initials: form.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(), cityName: form.city, areaName: form.area, whatsapp: form.phone.replace(/\D/g, '') };
      const next = editingId ? local.map(item => item.id === editingId ? created : item) : [...local, created];
      writeLocalRecords(next); cancelEdit(); setDrivers(next); setStatus(`${created.name} ${wasEditing ? 'updated in' : 'added to'} local demo data.`);
    } finally { setBusy(false); }
  };

  const handleRating = async (driver, rating) => { try { await updateAdminDriver(driver.id, { rating }); } catch { const next = readLocalRecords().map(item => item.id === driver.id ? { ...item, rating } : item); writeLocalRecords(next); } setDrivers(previous => previous.map(item => item.id === driver.id ? { ...item, rating } : item)); };
  const handleVisibility = async driver => {
    const hidden = !driver.hidden;
    try { await updateAdminDriver(driver.id, { hidden }); } catch { const next = readLocalRecords().map(item => item.id === driver.id ? { ...item, hidden } : item); writeLocalRecords(next); }
    setDrivers(previous => previous.map(item => item.id === driver.id ? { ...item, hidden } : item));
    setStatus(`${driver.name} is now ${hidden ? 'hidden from' : 'visible in'} the public directory.`);
  };
  const handleDelete = async driver => { if (!window.confirm(`Delete ${driver.name}'s record?`)) return; try { await deleteAdminDriver(driver.id); } catch { /* local fallback */ } const next = readLocalRecords().filter(item => item.id !== driver.id); writeLocalRecords(next); setDrivers(previous => previous.filter(item => item.id !== driver.id)); setStatus(`${driver.name} deleted.`); };
  const handleImport = async event => { const file = event.target.files?.[0]; if (!file) return; setBusy(true); try { const result = await importAdminDrivers(file); setStatus(`${result.imported} records imported from ${result.format === 'pdf' ? 'PDF' : 'spreadsheet'}. ${result.skipped} rows skipped.`); await loadDrivers(''); } catch (error) { setStatus(error.message || 'Import failed.'); } finally { event.target.value = ''; setBusy(false); } };

  return (
    <main className={`admin-page ${isFullscreen ? 'admin-fullscreen' : ''}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-brand"><i className="fa-solid fa-mountain-sun"></i><span>Travel &amp; Tourism</span></div>
        <nav className="sidebar-nav"><a href="/admin"><i className="fa-solid fa-house"></i>Dashboard</a><a className="active" href="#directory"><i className="fa-solid fa-user"></i>Driver Directory</a><label className="sidebar-action"><i className="fa-solid fa-cloud-arrow-up"></i>Import Data<input type="file" accept=".xlsx,.xls,.csv,.pdf" onChange={handleImport} disabled={busy} /></label><button type="button" onClick={() => downloadAdminFile('csv')}><i className="fa-solid fa-chart-column"></i>Reports</button><button type="button" onClick={onLogout}><i className="fa-solid fa-gear"></i>Settings</button></nav>
        <div className="sidebar-footer"><i className="fa-solid fa-mountain"></i><span>Better Drivers<br />Bigger Journeys</span></div>
      </aside>

      <section className="admin-main-content">
        <header className="admin-header"><div><a className="admin-back-link" href="/">← Directory</a><h1>Driver Directory</h1><p>Manage driver records, ratings, and spreadsheet imports.</p></div><div className="admin-top-actions"><i className="fa-solid fa-bell"></i><span className="admin-user-avatar">A</span><span>Admin</span><i className="fa-solid fa-chevron-down"></i><button className="admin-logout" type="button" onClick={onLogout}>Sign out</button></div></header>
        <section className="admin-summary"><div><i className="fa-solid fa-users"></i><strong>{totalRecords || visibleCount}</strong><span>Total Records</span></div><div><i className="fa-solid fa-star"></i><strong>{ratedCount}</strong><span>Rated Profiles</span></div><div><i className="fa-regular fa-star"></i><strong>{averageRating}</strong><span>Average Rating</span></div><div><i className="fa-solid fa-user"></i><strong>{roleCount}</strong><span>Owner Profiles</span></div></section>
        <section className="admin-toolbar"><div className="admin-toolbar-group"><button className="admin-primary-button" type="button" onClick={openCreate}><i className="fa-solid fa-plus"></i> Add Driver</button><label className="import-button"><i className="fa-solid fa-file-arrow-up"></i> Import<input type="file" accept=".xlsx,.xls,.csv,.pdf" onChange={handleImport} disabled={busy} /></label><button className="admin-outline-button" type="button" onClick={() => downloadAdminFile('xlsx')}><i className="fa-solid fa-file-export"></i> Export</button></div><span className="admin-toolbar-note">Accepted imports: Excel, CSV, PDF</span></section>
        {status && <p className="admin-status" role="status">{status}</p>}

        <section className={`admin-records ${isFullscreen ? 'records-expanded' : ''}`} id="directory">
          <div className="admin-records-toolbar"><div><p className="login-eyebrow">Directory data</p><h2>Manage records</h2></div><div className="records-toolbar-actions"><div className="admin-search"><i className="fa-solid fa-magnifying-glass"></i><input value={search} onChange={event => { setSearch(event.target.value); loadDrivers(event.target.value); }} placeholder="Search driver name..." /></div><button className="admin-fullscreen-button" type="button" onClick={() => setIsFullscreen(value => !value)} title={isFullscreen ? 'Exit full screen' : 'Full screen'}><i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i></button></div></div>
          <div className="admin-record-list">
            {drivers.map(driver => <article className={`admin-record ${driver.hidden ? 'record-hidden' : ''}`} key={driver.id}><div className="admin-record-main"><div className="admin-record-avatar">{driver.initials}</div><div className="record-identity"><h3>{driver.name}</h3><p><i className="fa-solid fa-car"></i> {driver.vehicleMake} {driver.vehicleModel}</p></div></div><div className="record-contact"><a href={`tel:${driver.phone.replace(/\s+/g, '')}`}><i className="fa-solid fa-phone"></i> {driver.phone}</a><a className="admin-wa" href={`https://wa.me/${driver.whatsapp}`} target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i></a></div><div className="record-location"><strong><i className="fa-solid fa-location-dot"></i> {driver.cityName}</strong><span>{driver.areaName}</span></div><div className="record-category"><small>Categories</small><div className="admin-badges">{driver.categories.map(role => <span key={role} className={`role-${role.toLowerCase()}`}>{role}</span>)}</div></div><div className="record-rating"><button type="button" onClick={() => handleRating(driver, Math.min(5, (driver.rating || 0) + 1))}>★</button><span>{driver.rating || '0.0'}</span></div><div className="admin-record-actions"><button type="button" onClick={() => beginEdit(driver)} title="Edit driver"><i className="fa-solid fa-pen"></i></button><button type="button" onClick={() => beginEdit(driver)} title="View driver"><i className="fa-solid fa-eye"></i></button><button type="button" onClick={() => handleVisibility(driver)} title={driver.hidden ? 'Show in public directory' : 'Hide from public directory'}><i className={`fa-solid ${driver.hidden ? 'fa-eye' : 'fa-eye-slash'}`}></i></button><button className="delete-button" type="button" onClick={() => handleDelete(driver)} title="Delete record"><i className="fa-solid fa-ellipsis-vertical"></i></button></div></article>)}
            {!drivers.length && <div className="admin-empty">No records match this search.</div>}
          </div>
          {isFormOpen && <form className="admin-form admin-edit-popover" onSubmit={handleCreate}><div className="admin-section-heading"><h2>{editingId ? 'Edit Driver' : 'Add Driver'}</h2><button type="button" onClick={cancelEdit} aria-label="Close"><i className="fa-solid fa-xmark"></i></button></div><div className="admin-form-grid"><label>Full Name<input value={form.name} onChange={event => updateForm('name', event.target.value)} required /></label><label>Phone Number<input value={form.phone} onChange={event => updateForm('phone', event.target.value)} /></label></div><div className="admin-form-grid"><label>City<select value={form.city} onChange={event => updateForm('city', event.target.value)}>{cities.map(city => <option key={city.id}>{city.name}</option>)}</select></label><label>Area / Stand<input value={form.area} onChange={event => updateForm('area', event.target.value)} /></label></div><div className="admin-form-grid"><label>Vehicle Make<input value={form.vehicleMake} onChange={event => updateForm('vehicleMake', event.target.value)} /></label><label>Vehicle Model<input value={form.vehicleModel} onChange={event => updateForm('vehicleModel', event.target.value)} /></label></div><fieldset className="role-fieldset"><legend>Category</legend>{['Owner', 'Driver', 'Vendor'].map(role => <label key={role}><input type="checkbox" checked={form.categories.includes(role)} onChange={() => toggleRole(role)} /> {role}</label>)}</fieldset><div className="admin-form-actions"><button className="admin-cancel-button" type="button" onClick={cancelEdit}>Cancel</button><button className="admin-primary-button" type="submit" disabled={busy}><i className="fa-solid fa-floppy-disk"></i> Save</button></div></form>}
        </section>
      </section>
    </main>
  );
}
