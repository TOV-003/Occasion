import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
function App() {
  return (
    <>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          className: 'bg-inputbg/90 border border-inputaccent text-sm text-white backdrop-blur-md rounded-xl p-4 shadow-xl max-w-sm',
          style: {
            borderColor: 'rgba(var(--color-inputaccent), 0.3)',
          },
          duration: 4000,
          success: {
            iconTheme: {
              primary: 'var(--color-accent, #6366f1)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Outlet />
    </>
  )
}

export default App
