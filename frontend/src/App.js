
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import './App.css';

function App() {
  return (

    <div className="App">

      <Routes>
        <Route path="/" element={<Lost />} >
        </Route>
        <Route path="/login" element={<Login />} >
        </Route>
        <Route path="/create" element={<CreateUser /> }>
        </Route>
      </Routes>
    </div>
  );
}

function Lost(){
  return (    <div>  <img src="./ghost-face.jpg" alt=""></img>
      <header className="App-header"><p>
         Hello Sydney, it looks like you are lost, either login if you already have an account, or sign up to create a new one, and never pick up the phone.
        </p>
        <a className='btn'>
        <Link to="/login" className="btn-horror">Login, I dare  you!</Link>
        <Link to="/create" className="btn-horror">Sign Up</Link>
        </a>
<Disclaimer  />
      </header>
      </div>)
}

function Login(){
  return (
    <div className="App-header">
    <h3>Hello Sydney, are you ready to log in?</h3>
    <Link to="/" className="btn-horror">Are you lost???</Link>
        
<Disclaimer  />
</div>
  )
}

function CreateUser(){
  return (
    <div className="App-header"> <h3>Hello Sydney, are you ready to sign up?</h3>
   <Link to="/" className="btn-horror">Are you lost???</Link>

<Disclaimer  />
</div>  )
}

function Disclaimer(){
  return (
        <footer >
  <p><strong>Disclaimer & Terms of Service:</strong></p>
  <p>
    This website is a non-commercial, full-stack educational web application built solely for demonstration purposes as part of a Codecademy course portfolio project.
  </p>
  <p>
    <strong>Notice on Intellectual Property:</strong> All character names, book titles, film references, and pop-culture elements (including references to <em>Scream</em>, Paramount Pictures, Spyglass Media Group, and other respective media franchises) are the property of their respective copyright and trademark owners. They are used here strictly as fictional mock data under fair use for educational and testing purposes.
  </p>
  <p>
    <strong>Payments & Transactions:</strong> This site uses a simulated sandbox environment for payment processing (e.g., Stripe Test Mode). No real monetary transactions are processed, and no physical products will be shipped or delivered.
  </p>
</footer>
  )
}

export default App;
