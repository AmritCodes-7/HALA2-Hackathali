import { useState, useEffect } from 'react'
import { getAllSkills, addSkillToProfile } from '../api/users'
import { useAuth } from '../context/AuthContext'
import styles from './SkillsPage.module.css'

export default function SkillsPage() {
  const { user } = useAuth()
  const [skills, setSkills]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  // FIX: store the full skill object so we can use skill.skillId (the real mongo id)
  const [addForm, setAddForm]   = useState({ skill: null, level: 1 })
  const [adding, setAdding]     = useState(false)
  const [msg, setMsg]           = useState('')

  const role = user?.role || ''
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
    if (!addForm.skill) return
    setAdding(true)
    try {
      // FIX: use addForm.skill.skillId (the real MongoDB ObjectId), not the name
      await addSkillToProfile(addForm.skill.skillId, Number(addForm.level))
      setMsg('Skill added to your profile!')
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
              value={addForm.skill?.skillId || ''}
              onChange={e => {
                // FIX: store the full skill object by finding it from the list
                const selected = skills.find(s => s.skillId === e.target.value)
                setAddForm(p => ({ ...p, skill: selected || null }))
              }}
              required
            >
              <option value="">— Select a skill —</option>
              {/* FIX: use s.skillId as value so we send the real id to backend */}
              {skills.map(s => <option key={s.skillId} value={s.skillId}>{s.name}</option>)}
            </select>
            <div className={styles.levelRow}>
              <label>Proficiency Level: <strong>{addForm.level}</strong></label>
              <input
                type="range"
                min={1} max={10}
                value={addForm.level}
                onChange={e => setAddForm(p => ({ ...p, level: e.target.value }))}
              />
            </div>
            <button type="submit" className={styles.addBtn} disabled={adding}>
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
            <div key={i} className={styles.skillCard} style={{ animationDelay: `${i * 0.04}s` }}>
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
