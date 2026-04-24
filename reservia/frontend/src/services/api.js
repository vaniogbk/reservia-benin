import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
})

// Injecter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reservia_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Gérer les erreurs globalement
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('reservia_token')
      localStorage.removeItem('reservia_demo_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ──
export const authApi = {
  register: (data)       => api.post('/register', data),
  login:    (data)       => api.post('/login', data),
  logout:   ()           => api.post('/logout'),
  me:       ()           => api.get('/user'),
  update:   (data)       => api.put('/user', data),
}

// ── Hébergements ──
export const hebergementApi = {
  liste:           (params) => api.get('/hebergements', { params }),
  detail:          (id)     => api.get(`/hebergements/${id}`),
  disponibilites:  (id)     => api.get(`/hebergements/${id}/disponibilites`),
  creer:           (data)   => api.post('/hebergements', data),
  modifier:        (id, d)  => api.put(`/hebergements/${id}`, d),
  supprimer:       (id)     => api.delete(`/admin/hebergements/${id}`),
}

// ── Événements ──
export const evenementApi = {
  liste:    (params) => api.get('/evenements', { params }),
  detail:   (id)     => api.get(`/evenements/${id}`),
  creer:    (data)   => api.post('/evenements', data),
  modifier: (id, d)  => api.put(`/evenements/${id}`, d),
  supprimer:(id)     => api.delete(`/admin/evenements/${id}`),
}

// ── Réservations ──
export const reservationApi = {
  mesList:  ()        => api.get('/reservations'),
  detail:   (ref)     => api.get(`/reservations/${ref}`),
  creer:    (data)    => api.post('/reservations', data),
  annuler:  (ref)     => api.patch(`/reservations/${ref}/annuler`),
  recu:     (ref)     => api.get(`/reservations/${ref}/recu`, { responseType: 'blob' }),
}

// ── Paiements ──
export const paiementApi = {
  initier: (data) => api.post('/paiements/initier', data),
  statut:  (id)   => api.get(`/paiements/${id}/statut`),
}

// ── Admin (legacy) ──
export const adminApi = {
  dashboard:    ()         => api.get('/admin/dashboard'),
  reservations: (params)   => api.get('/admin/reservations', { params }),
  utilisateurs: (params)   => api.get('/admin/utilisateurs', { params }),
  updateRole:   (id, role) => api.patch(`/admin/utilisateurs/${id}/role`, { role }),
  statistiques: ()         => api.get('/admin/statistiques'),
}

// ── Super Admin ──
export const superAdminApi = {
  dashboard:       ()              => api.get('/super-admin/dashboard'),
  statistiques:    ()              => api.get('/super-admin/statistiques'),
  reservations:    (params)        => api.get('/super-admin/reservations', { params }),
  paiements:       (params)        => api.get('/super-admin/paiements', { params }),
  utilisateurs:    (params)        => api.get('/super-admin/utilisateurs', { params }),
  updateRole:      (id, data)      => api.patch(`/super-admin/utilisateurs/${id}/role`, data),
  companies:       (params)        => api.get('/super-admin/companies', { params }),
  createCompany:   (data)          => api.post('/super-admin/companies', data),
  updateCompany:   (id, data)      => api.put(`/super-admin/companies/${id}`, data),
  deleteCompany:   (id)            => api.delete(`/super-admin/companies/${id}`),
}

// ── Company Admin ──
export const companyAdminApi = {
  dashboard:    ()       => api.get('/company-admin/dashboard'),
  statistiques: ()       => api.get('/company-admin/statistiques'),
  reservations: (params) => api.get('/company-admin/reservations', { params }),
  hebergements: (params) => api.get('/company-admin/hebergements', { params }),
  evenements:   (params) => api.get('/company-admin/evenements', { params }),
  utilisateurs: (params) => api.get('/company-admin/utilisateurs', { params }),
}

export default api
