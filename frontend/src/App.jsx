import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <h1>Ticket Booking System</h1>
      <p>Welcome to the ticket booking application</p>
      <p>Powered by React + Vite</p>
    </div>
  )
}

export default App
