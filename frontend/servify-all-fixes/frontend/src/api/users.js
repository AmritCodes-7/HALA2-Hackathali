import api from './client'

export const getSelfUser     = ()           => api.get('/get-self')
export const getAllUsers      = ()           => api.get('/users')
export const getUserByName   = (username)   => api.get(`/users/${username}`)
export const getUsersBySkill = (skill)      => api.get(`/${skill}`)
export const getUserSkills   = (username)   => api.get(`/skills/${username}`)

// FIX: addSkill now posts a SkillLevel object with a real skillId (mongo id) and level
export const addSkillToProfile = (skillId, level) => api.post('/addskills', { skillId, level })

export const deleteUser      = ()           => api.delete('/delete')

export const getAllSkills     = ()           => api.get('/skills')
export const addNewSkill     = (skill)      => api.post('/add-skill', skill)

export const sendChatPrompt  = (data)       => api.post('/chatbot', data)
export const validateStaff   = ()           => api.get('/validate')

// ── Problem Posts API ─────────────────────────────────────────────────────────
export const createPost      = (post)       => api.post('/post/save', post)
export const getAllPosts      = ()           => api.get('/post')
export const deletePost      = (post)       => api.delete('/post', { data: post })
export const getPostsBySkill = (skillId)    => api.get(`/post/${skillId}`)

// ── Staff API ─────────────────────────────────────────────────────────────────
export const getStaffBySkill = (skillId)    => api.get(`/find/staff/${skillId}`)

// ── Session API ───────────────────────────────────────────────────────────────
export const heartbeat       = (data)                    => api.post('/session/heartbeat', data)
export const logoutSession   = ()                         => api.post('/session/logout')
export const getOnlineUsers  = ()                         => api.get('/session/online')
export const getNearbyStaff  = (lat, lng, radius, skill)  =>
  api.get('/session/nearby-staff', { params: { lat, lng, radius, skill } })
