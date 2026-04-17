import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface dark:bg-dark-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden dark:bg-dark-surface dark:text-dark-on-surface">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Login Card */}
      <main className="w-full max-w-md px-6 z-10">
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container rounded-2xl p-10 border border-outline-variant/15 shadow-[0px_12px_32px_rgba(19,27,46,0.06)]">
          {/* App Identity */}
          <div className="flex flex-col items-center mb-10">
            <img src="/logo.svg" alt="ClientHub" className="w-16 h-16 rounded-xl mb-6 shadow-lg shadow-primary/20 dark:hidden" />
            <img src="/logo-dark.svg" alt="ClientHub" className="w-16 h-16 rounded-xl mb-6 shadow-lg shadow-primary/20 hidden dark:block" />
            <h1 className="text-2xl font-extrabold tracking-tight text-on-surface dark:text-dark-on-surface mb-2">
              Client<span className="text-primary">Hub</span>
            </h1>
          </div>

          {/* Login Button */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-surface-container-high dark:bg-dark-surface-container-high hover:bg-surface-container-highest dark:hover:bg-dark-surface-container-highest border border-outline-variant/20 transition-all duration-200 rounded-xl text-on-surface dark:text-dark-on-surface font-bold text-base shadow-sm hover:shadow-md cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </main>
    </div>
  );
}
