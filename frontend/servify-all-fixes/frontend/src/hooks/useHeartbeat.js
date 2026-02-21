import { useEffect, useRef } from 'react'
import { heartbeat } from '../api/users'

const INTERVAL_MS = 60_000 // 60 seconds

export function useHeartbeat(isAuthenticated) {
  const intervalRef = useRef(null)

  const sendHeartbeat = (lat, lng) => {
    heartbeat({ latitude: lat, longitude: lng }).catch(() => {})
  }

  useEffect(() => {
    if (!isAuthenticated) return

    // Send first heartbeat immediately (no location yet)
    heartbeat({ latitude: null, longitude: null }).catch(() => {})

    // Then try to get location and send periodically
    const tick = () => {
      if (!navigator.geolocation) {
        heartbeat({ latitude: null, longitude: null }).catch(() => {})
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => sendHeartbeat(pos.coords.latitude, pos.coords.longitude),
        ()    => heartbeat({ latitude: null, longitude: null }).catch(() => {})
      )
    }

    // Wait a moment for user to settle then start ticking
    const timeout = setTimeout(() => {
      tick()
      intervalRef.current = setInterval(tick, INTERVAL_MS)
    }, 3000)

    return () => {
      clearTimeout(timeout)
      clearInterval(intervalRef.current)
    }
  }, [isAuthenticated])
}
