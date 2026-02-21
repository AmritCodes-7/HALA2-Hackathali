export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch {
    return null
  }
}

export function getRoleLabel(role) {
  if (!role) return 'User'
  return role.replace('ROLE_', '').charAt(0) + role.replace('ROLE_', '').slice(1).toLowerCase()
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

// Generate a pseudo-random lat/lng offset near a base location
// Used to simulate staff locations near a user
export function randomNearby(lat, lng, radiusKm = 5) {
  const r = radiusKm / 111
  const angle = Math.random() * 2 * Math.PI
  const dist  = Math.random() * r
  return {
    lat: lat + dist * Math.cos(angle),
    lng: lng + dist * Math.sin(angle)
  }
}
