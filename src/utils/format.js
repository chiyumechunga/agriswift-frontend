const zmwFmt = new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 2 });
const intFmt = new Intl.NumberFormat('en-ZM', { maximumFractionDigits: 0 });
const num = (v) => (v == null || v === '' || Number.isNaN(Number(v)) ? 0 : Number(v));

export const zmw = (v) => zmwFmt.format(num(v));
export const int = (v) => intFmt.format(num(v));
export const kgFmt = (v) => `${intFmt.format(num(v))} kg`;
export const mt = (v) => `${(num(v) / 1000).toLocaleString('en-ZM', { maximumFractionDigits: 2 })} MT`;
export const todayISO = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lusaka' });

export const deviceId = () => {
  let id = localStorage.getItem('agri.deviceId');
  if (!id) {
    id = `WEB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    localStorage.setItem('agri.deviceId', id);
  }
  return id;
};

export const problemMessage = (e) => {
  const d = e?.response?.data;
  if (d?.errors && typeof d.errors === 'object') return Object.values(d.errors).join(' ');
  return d?.detail || d?.message || d?.title
    || (e?.response ? `Request failed (${e.response.status}).` : 'Cannot reach AgriSwift right now.');
};