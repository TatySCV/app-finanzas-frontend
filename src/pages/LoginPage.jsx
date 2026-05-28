import {
  signInWithPopup,
} from "firebase/auth"

import {
  auth,
  googleProvider,
} from "../services/firebase"

import { useNavigate } from "react-router-dom"

function LoginPage() {

  const navigate = useNavigate()

  const handleGoogleLogin = async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        )

      console.log(result.user)

      navigate("/dashboard")

    } catch (error) {

      console.log(error)

    }
  }

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-slate-800 text-center">
          App Finanzas
        </h1>

        <p className="text-slate-500 text-center mt-3">
          Controla tus ingresos, gastos, ahorros y créditos.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-8 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Iniciar sesión con Google
        </button>

      </div>

    </div>

  )
}

export default LoginPage