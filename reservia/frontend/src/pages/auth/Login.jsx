import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('Bienvenue !')
      navigate(from, { replace: true })
    } catch {
      toast.error('Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-4xl text-dark mb-2">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <p className="text-earth">Connectez-vous à votre compte</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Adresse e-mail</label>
              <input type="email" autoComplete="email"
                className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                placeholder="kofi.mensah@email.com"
                {...register('email', { required: 'E-mail requis' })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label">Mot de passe</label>
              <input type="password" autoComplete="current-password"
                className={`form-input ${errors.password ? 'border-red-400' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: 'Mot de passe requis', minLength: { value: 8, message: 'Minimum 8 caractères' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="btn-terracotta w-full justify-center py-4 text-base mt-2">
              {isSubmitting ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-earth text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-terracotta font-medium hover:underline">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
          <div className="mt-4 p-3 bg-sand rounded-xl text-xs text-earth text-center">
            <strong>Démo :</strong> admin@reservia-benin.com / password123
          </div>
        </div>
      </div>
    </div>
  )
}
