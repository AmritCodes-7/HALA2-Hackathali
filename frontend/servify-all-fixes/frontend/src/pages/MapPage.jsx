import { useEffect, useRef, useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { getNearbyStaff, getAllSkills, heartbeat } from '../api/users'
import styles from './MapPage.module.css'

export default function MapPage() {
  const mapRef      = useRef(null)
  const mapInstance = useRef(null)
  const markersRef  = useRef([])
  const L           = useRef(null)

  const { location, error, loading, getLocation } = useGeolocation()
  const [skills, setSkills]          = useState([])
  const [selectedSkill, setSelected] = useState('')
  const [problem, setProblem]        = useState('')
  const [staffList, setStaffList]    = useState([])
  const [searching, setSearching]    = useState(false)
  const [address, setAddress]        = useState('')
  const [activeStaff, setActive]     = useState(null)
  const [radius, setRadius]          = useState(10)

  // Init map
  useEffect(() => {
    if (mapInstance.current) return
    L.current = window.L
    if (!L.current) return

    delete L.current.Icon.Default.prototype._getIconUrl
    L.current.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    mapInstance.current = L.current
      .map(mapRef.current, { zoomControl: false })
      .setView([27.7, 85.3], 12)

    L.current.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current)

    L.current.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current)

    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }
    }
  }, [])

  useEffect(() => {
    getAllSkills().then(r => setSkills(r.data?.message || [])).catch(() => {})
  }, [])

  // When location detected — update map + send to backend
  useEffect(() => {
    if (!location || !mapInstance.current || !L.current) return

    mapInstance.current.flyTo([location.lat, location.lng], 14, { duration: 1.4 })

    if (mapInstance.current._userMarker) mapInstance.current._userMarker.remove()
    const userIcon = L.current.divIcon({
      className: '',
      html: `<div style="width:18px;height:18px;background:rgba(200,240,77,0.95);border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(200,240,77,0.25),0 2px 12px rgba(0,0,0,0.5);"></div>`,
      iconSize: [18, 18], iconAnchor: [9, 9],
    })
    mapInstance.current._userMarker = L.current
      .marker([location.lat, location.lng], { icon: userIcon })
      .addTo(mapInstance.current)
      .bindPopup('<b style="font-family:monospace;color:#c8f04d">📍 You are here</b>')

    if (mapInstance.current._accCircle) mapInstance.current._accCircle.remove()
    mapInstance.current._accCircle = L.current.circle([location.lat, location.lng], {
      radius: location.accuracy,
      color: '#c8f04d', fillColor: '#c8f04d', fillOpacity: 0.06, weight: 1,
    }).addTo(mapInstance.current)

    // Send location to backend session
    heartbeat({ latitude: location.lat, longitude: location.lng }).catch(() => {})

    // Reverse geocode
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`)
      .then(r => r.json()).then(d => setAddress(d.display_name || '')).catch(() => {})
  }, [location])

  // Draw staff markers from REAL session data
  useEffect(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    if (!staffList.length || !mapInstance.current || !L.current) return

    const staffIcon = L.current.divIcon({
      className: '',
      html: `<div style="width:18px;height:18px;background:#4dffc3;border:3px solid #fff;border-radius:4px;box-shadow:0 0 0 3px rgba(77,255,195,0.2),0 2px 12px rgba(0,0,0,0.4);transform:rotate(45deg);"></div>`,
      iconSize: [18, 18], iconAnchor: [9, 9],
    })

    staffList.forEach(s => {
      if (s.latitude == null || s.longitude == null) return
      const m = L.current
        .marker([s.latitude, s.longitude], { icon: staffIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family:'DM Sans',sans-serif;min-width:160px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <div style="width:8px;height:8px;border-radius:50%;background:#4dffc3;box-shadow:0 0 6px #4dffc3"></div>
              <b style="color:#4dffc3;font-size:15px">${s.username}</b>
            </div>
            <p style="color:#aaa;font-size:12px">${(s.role||'').replace('ROLE_','') || 'Staff'}</p>
            ${s.skillNames?.length ? `<p style="font-size:11px;color:#888;margin-top:4px">Skills: ${s.skillNames.join(', ')}</p>` : ''}
            <p style="font-size:12px;color:#c8f04d;margin-top:6px;font-weight:600">~${s.distanceKm} km away</p>
          </div>
        `)
        .on('click', () => setActive(s))
      markersRef.current.push(m)
    })
  }, [staffList])

  const handleSearch = async () => {
    if (!location) { alert('Please detect your location first'); return }
    setSearching(true)
    try {
      const res = await getNearbyStaff(location.lat, location.lng, radius, selectedSkill || undefined)
      setStaffList(res.data?.message || [])
    } catch {
      setStaffList([])
    } finally {
      setSearching(false)
    }
  }

  const focusStaff = (staff) => {
    if (staff.latitude == null || !mapInstance.current) return
    mapInstance.current.flyTo([staff.latitude, staff.longitude], 16, { duration: 0.8 })
    setActive(staff)
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h1 className={styles.title}>◎ Find Staff Near You</h1>
          <p className={styles.sub}>Shows only online staff with real-time locations</p>
        </div>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>Your Location</p>
          <button className={styles.locateBtn} onClick={getLocation} disabled={loading}>
            {loading
              ? <><span className={styles.spinner} /> Detecting…</>
              : <><span>⌖</span> {location ? 'Re-detect Location' : 'Detect My Location'}</>}
          </button>
          {error && <p className={styles.errorMsg}>⚠ {error}</p>}
          {location && (
            <div className={styles.locationInfo}>
              <div className={styles.locRow}>
                <span className={styles.locLabel}>Lat</span>
                <span className={styles.locVal}>{location.lat.toFixed(5)}°</span>
              </div>
              <div className={styles.locRow}>
                <span className={styles.locLabel}>Lng</span>
                <span className={styles.locVal}>{location.lng.toFixed(5)}°</span>
              </div>
              <div className={styles.locRow}>
                <span className={styles.locLabel}>Accuracy</span>
                <span className={styles.locVal}>±{Math.round(location.accuracy)}m</span>
              </div>
              {address && <p className={styles.address}>{address}</p>}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>Search Filters</p>
          <textarea
            className={styles.textarea}
            placeholder="Describe your problem (optional)…"
            value={problem}
            onChange={e => setProblem(e.target.value)}
            rows={2}
          />
          <select className={styles.select} value={selectedSkill} onChange={e => setSelected(e.target.value)}>
            <option value="">— Any skill —</option>
            {skills.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <div className={styles.radiusRow}>
            <span className={styles.locLabel}>Search radius</span>
            <span className={styles.locVal}>{radius} km</span>
          </div>
          <input
            type="range" min={1} max={50} value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            className={styles.rangeInput}
          />
          <button className={styles.searchBtn} onClick={handleSearch} disabled={searching || !location}>
            {searching ? <><span className={styles.spinner} /> Searching…</> : '⊕ Find Online Staff Nearby'}
          </button>
        </section>

        {staffList.length > 0 && (
          <section className={styles.section}>
            <p className={styles.sectionLabel}>{staffList.length} Staff Online Nearby</p>
            <div className={styles.staffList}>
              {staffList.map((s, i) => (
                <div
                  key={i}
                  className={[styles.staffCard, activeStaff?.username === s.username ? styles.staffActive : ''].join(' ')}
                  onClick={() => focusStaff(s)}
                >
                  <div className={styles.staffAvatar}>{s.username?.charAt(0)?.toUpperCase()}</div>
                  <div className={styles.staffInfo}>
                    <p className={styles.staffName}>{s.username}</p>
                    <p className={styles.staffRole}>{(s.role || '').replace('ROLE_', '')}</p>
                    {s.skillNames?.length > 0 && (
                      <p className={styles.staffSkills}>{s.skillNames.slice(0,2).join(' · ')}</p>
                    )}
                  </div>
                  <div className={styles.staffDist}>
                    <div className={styles.onlineDot} />
                    {s.distanceKm}km
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {staffList.length === 0 && !searching && location && (
          <div className={styles.noStaff}>
            <p>No online staff found nearby.</p>
            <p style={{fontSize:'11px',marginTop:'4px'}}>Try increasing the search radius or selecting a different skill.</p>
          </div>
        )}
      </div>

      <div className={styles.mapWrap}>
        <div ref={mapRef} className={styles.map} />
        {!location && (
          <div className={styles.mapOverlay}>
            <p className={styles.mapOverlayText}>⌖ Detect your location to get started</p>
          </div>
        )}
        <div className={styles.legend}>
          <div className={styles.legendItem}><div className={styles.legendDotYellow} /><span>You</span></div>
          <div className={styles.legendItem}><div className={styles.legendDotGreen} /><span>Online Staff</span></div>
        </div>
      </div>
    </div>
  )
}
