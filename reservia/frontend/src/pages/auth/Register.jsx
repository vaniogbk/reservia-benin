import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      toast.success('Compte créé avec succès !')
      navigate('/')
    } catch (e) {
      const msg = e.response?.data?.message || 'Erreur lors de la création du compte'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-4xl text-dark mb-2">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <p className="text-earth">Créez votre compte gratuitement</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Prénom *</label>
                <input className={`form-input ${errors.prenom ? 'border-red-400' : ''}`}
                  placeholder="Kofi"
                  {...register('prenom', { required: 'Requis' })} />
                {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
              </div>
              <div>
                <label className="form-label">Nom *</label>
                <input className={`form-input ${errors.nom ? 'border-red-400' : ''}`}
                  placeholder="Mensah"
                  {...register('nom', { required: 'Requis' })} />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
              </div>
            </div>
            <div>
              <label className="form-label">Adresse e-mail *</label>
              <input type="email"
                className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                placeholder="kofi.mensah@email.com"
                {...register('email', { required: 'E-mail requis', pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail invalide' } })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label">Téléphone</label>
              <input type="tel" className="form-input" placeholder="+229 96 00 00 00"
                {...register('telephone')} />
            </div>
            <div>
              <label className="form-label">Mot de passe *</label>
              <input type="password" className={`form-input ${errors.password ? 'border-red-400' : ''}`}
                placeholder="Minimum 8 caractères"
                {...register('password', { required: 'Requis', minLength: { value: 8, message: '8 caractères minimum' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="form-label">Confirmer le mot de passe *</label>
              <input type="password" className={`form-input ${errors.password_confirmation ? 'border-red-400' : ''}`}
                placeholder="Retapez votre mot de passe"
                {...register('password_confirmation', {
                  required: 'Requis',
                  validate: v => v === watch('password') || 'Les mots de passe ne correspondent pas'
                })} />
              {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="btn-terracotta w-full justify-center py-4 text-base mt-2">
              {isSubmitting ? 'Création...' : 'Créer mon compte →'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-earth text-sm">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-terracotta font-medium hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
