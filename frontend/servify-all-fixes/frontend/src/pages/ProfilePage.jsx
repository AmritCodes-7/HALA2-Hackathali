import { useEffect, useState } from 'react'
import { getSelfUser, deleteUser, getAllSkills } from '../api/users'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [skillMap, setSkillMap] = useState({}) // FIX: map of skillId -> skill name
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // FIX: fetch both profile and skills catalog in parallel to resolve skill names
    Promise.allSettled([getSelfUser(), getAllSkills()])
      .then(([p, s]) => {
        if (p.status === 'fulfilled') setProfile(p.value.data?.message)
        if (s.status === 'fulfilled') {
          const allSkills = s.value.data?.message || []
          const map = {}
          allSkills.forEach(sk => { map[sk.skillId] = sk.name })
          setSkillMap(map)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    try {
      await deleteUser()
      logout()
      navigate('/login')
    } catch {}
  }

  const role = (profile?.role || '').replace('ROLE_', '')

  if (loading) return (
    <div className={styles.loadingWrap}><span className={styles.spinner} /></div>
  )

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>◉ Profile</h1>

      <div className={styles.heroCard}>
        <div className={styles.avatar}>
          {profile?.username?.charAt(0)?.toUpperCase()}
        </div>
        <div className={styles.heroInfo}>
          <h2 className={styles.username}>{profile?.username}</h2>
          <div className={styles.rolePill}>{role}</div>
          {profile?.phoneNumber && <p className={styles.phone}>📞 {profile.phoneNumber}</p>}
          {profile?.dateOfBirth && <p className={styles.dob}>🎂 {formatDate(profile.dateOfBirth)}</p>}
        </div>
        {profile?.certificateUrl && (
          <div className={styles.certSection}>
            <p className={styles.certLabel}>Certificate</p>
            <a href={profile.certificateUrl} target="_blank" rel="noreferrer" className={styles.certLink}>
              View Document ↗
            </a>
          </div>
        )}
      </div>

      {/* Skills */}
      {profile?.skills?.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Skills ({profile.skills.length})</p>
          <div className={styles.skillGrid}>
            {profile.skills.map((sk, i) => (
              <div key={i} className={styles.skillItem}>
                <div className={styles.skillBar}>
                  <div className={styles.skillFill} style={{ width: `${sk.level * 10}%` }} />
                </div>
                <div className={styles.skillMeta}>
                  {/* FIX: resolve skill name from map, fall back to ID only if map is missing */}
                  <span className={styles.skillId}>
                    {skillMap[sk.skillId] || sk.skillId || `Skill ${i + 1}`}
                  </span>
                  <span className={styles.skillLevel}>Level {sk.level}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className={styles.dangerZone}>
        <p className={styles.dangerTitle}>Danger Zone</p>
        <p className={styles.dangerDesc}>Permanently delete your account. This action cannot be undone.</p>
        {!confirm ? (
          <button className={styles.dangerBtn} onClick={() => setConfirm(true)}>
            Delete Account
          </button>
        ) : (
          <div className={styles.confirmRow}>
            <p className={styles.confirmText}>Are you sure?</p>
            <button className={styles.dangerBtn} onClick={handleDelete}>Yes, delete</button>
            <button className={styles.cancelBtn} onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}
