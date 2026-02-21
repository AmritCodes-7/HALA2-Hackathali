import { useState, useEffect } from 'react'
import { getAllSkills, addSkillToProfile } from '../api/users'
import { useAuth } from '../context/AuthContext'
import styles from './SkillsPage.module.css'

export default function SkillsPage() {
  const { user } = useAuth()
  const [skills, setSkills]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  // FIX: simplified state — just store selectedSkillId directly instead of full skill object
  // The old pattern (storing full skill object via skills.find()) broke because
  // SkillDto was missing skillId, so skills.find() always returned undefined
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [level, setLevel]           = useState(1)
  const [adding, setAdding]         = useState(false)
  const [msg, setMsg]               = useState('')

  const role    = user?.role || ''
  const isStaff = role.includes('STAFF') || role.includes('ADMIN')

  useEffect(() => {
    getAllSkills()
      .then(r => setSkills(r.data?.message || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = skills.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!selectedSkillId) return
    setAdding(true)
    try {
      // FIX: selectedSkillId is the real MongoDB skillId from the option value
      await addSkillToProfile(selectedSkillId, Number(level))
      setMsg('Skill added to your profile!')
      setSelectedSkillId('')
      setLevel(1)
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add skill')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>◇ Skills Catalog</h1>
          <p className={styles.sub}>{skills.length} service categories available</p>
        </div>
        <input
          className={styles.search}
          placeholder="Search skills…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isStaff && (
        <div className={styles.addCard}>
          <p className={styles.addTitle}>Add a Skill to Your Profile</p>
          <form onSubmit={handleAddSkill} className={styles.addForm}>
            <select
              className={styles.select}
              value={selectedSkillId}
              // FIX: directly set the skillId string — no more skills.find() needed
              onChange={e => setSelectedSkillId(e.target.value)}
              required
            >
              <option value="">— Select a skill —</option>
              {/* FIX: option value is s.skillId (real mongo id) — requires backend SkillDto to include skillId */}
              {skills.map(s => (
                <option key={s.skillId} value={s.skillId}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className={styles.levelRow}>
              <label>Proficiency Level: <strong>{level}</strong></label>
              <input
                type="range"
                min={1} max={10}
                value={level}
                onChange={e => setLevel(Number(e.target.value))}
              />
            </div>
            <button
              type="submit"
              className={styles.addBtn}
              disabled={adding || !selectedSkillId}
            >
              {adding ? 'Adding…' : '+ Add to Profile'}
            </button>
          </form>
          {msg && <p className={styles.msg}>{msg}</p>}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}><span className={styles.spinner} /></div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((s, i) => (
            <div key={s.skillId || i} className={styles.skillCard} style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={styles.skillIcon}>{getIcon(s.name)}</div>
              <div className={styles.skillInfo}>
                <p className={styles.skillName}>{s.name}</p>
                <p className={styles.skillDesc}>{s.description || 'Professional service'}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className={styles.empty}>No skills found for "{search}"</div>
          )}
        </div>
      )}
    </div>
  )
}

function getIcon(name = '') {
  const n = name.toLowerCase()
  if (n.includes('plumb')) return '🔧'
  if (n.includes('electr')) return '⚡'
  if (n.includes('clean')) return '🧹'
  if (n.includes('paint')) return '🎨'
  if (n.includes('garden') || n.includes('lawn')) return '🌿'
  if (n.includes('car') || n.includes('auto')) return '🚗'
  if (n.includes('cook') || n.includes('chef')) return '👨‍🍳'
  if (n.includes('tech') || n.includes('it') || n.includes('comput')) return '💻'
  if (n.includes('teach') || n.includes('tutor')) return '📚'
  if (n.includes('weld')) return '🔩'
  return '🔨'
}
