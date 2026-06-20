import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <CartProvider>
       <OrdersProvider>
      <App />
      </OrdersProvider>
     </CartProvider>
    
  </StrictMode>,
)
