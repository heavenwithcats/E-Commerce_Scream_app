import './App.css';
import { useParams, useLocation, useNavigation, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import ghostface from './ghost-face.png';
import knife from './logo.png';
import Pro from './profile.png';
import Banner from './banner.png';
import ClockOfDoom from './COD.png';
import CollegeTerror from './CT.png';
import GhostfaceReturns from './GR.png';
import HollywoodHorror from './HH.png';
import KnifeOfDoom from './KOD.png';
import KnifeOfTheHunter from './KOTH.png';
import OutOfDarkness from './OOD.png';
import StabbedInTheBack from './SITB.png';
import TheWoodsBoroMurders from './TWM.png';
import WronglyAccused from './WA.png';
import React, { createContext, useContext } from 'react';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to view this page!");
        navigate('/login');
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, [navigate]);

  if (loading) return <div className="App-header">Loading...</div>;
  return authenticated ? children : null;
}

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cart and orders from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('stab_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('stab_past_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== bookId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      items: [...cart],
      total: cart
        .reduce((sum, item) => {
          const numericPrice = parseFloat(item.price.replace('$', ''));
          return sum + numericPrice * item.quantity;
        }, 0)
        .toFixed(2),
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        orders,
        setOrders,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

export const books = [
  {
    id: 'out-of-darkness',
    title: 'Out of Darkness',
    author: 'Sidney Prescott',
    price: '$19.99',
    image: OutOfDarkness,
    publisher: 'Sunrise Press',
    year: '2011',
    category: 'Memoir / Survival',
    synopsis: "Sidney Prescott’s deeply personal memoir detailing her journey processing trauma, overcoming victimhood, and surviving the harrowing Woodsboro killing sprees."
  },
  {
    id: 'wrongly-accused',
    title: 'Wrongly Accused',
    author: 'Gale Weathers',
    price: '$18.99',
    image: WronglyAccused,
    publisher: 'Sunrise Press',
    year: '1996',
    category: 'True Crime',
    synopsis: "Gale Weathers' explosive debut true-crime book that challenged the official story of Maureen Prescott’s murder and fought to prove Cotton Weary’s innocence."
  },
  {
    id: 'the-woodsboro-murders',
    title: 'The Woodsboro Murders',
    author: 'Gale Weathers',
    price: '$24.99',
    image: TheWoodsBoroMurders,
    publisher: 'Sunrise Press',
    year: '1997',
    category: 'True Crime',
    synopsis: "The blockbuster bestseller detailing the 1996 high school killing spree in Woodsboro that turned local tragedy into national news and served as the direct basis for the original Stab movie."
  },
  {
    id: 'college-terror',
    title: 'College Terror',
    author: 'Gale Weathers',
    price: '$21.99',
    image: CollegeTerror,
    publisher: 'Sunrise Press',
    year: '1998',
    category: 'True Crime',
    synopsis: "Gale Weathers' harrowing account of the copycat murders at Windsor College, unmasking the vengeance-driven plot behind the horrific campus killing spree."
  },
  {
    id: 'hollywood-horror',
    title: 'Hollywood Horror',
    author: 'Gale Weathers',
    price: '$22.99',
    image: HollywoodHorror,
    publisher: 'Sunrise Press',
    year: '2000',
    category: 'True Crime',
    synopsis: "An explosive insider account covering the murders on the production set of Stab 3 in Los Angeles, exposing the dark secrets of Sunrise Studios and Roman Bridger."
  },
  {
    id: 'stabbed-in-the-back',
    title: 'Stabbed in the Back',
    author: 'Gale Weathers',
    price: '$16.99',
    image: StabbedInTheBack,
    publisher: 'Sunrise Press',
    year: '2003',
    category: 'True Crime',
    synopsis: "A gripping look at the sudden rise and tragic fall of Cotton Weary, examining how media obsession and Hollywood fame set the stage for renewed terror."
  },
  {
    id: 'knife-of-doom',
    title: 'Knife of Doom',
    author: 'Gale Weathers',
    price: '$15.99',
    image: KnifeOfDoom,
    publisher: 'Sunrise Press',
    year: '2005',
    category: 'True Crime',
    synopsis: "Written during the lull following the Hollywood murders, this deep-dive investigates minor copycat incidents and the lingering psychological shadow cast over Woodsboro."
  },
  {
    id: 'clock-of-doom',
    title: 'Clock of Doom',
    author: 'Gale Weathers',
    price: '$16.99',
    image: ClockOfDoom,
    publisher: 'Sunrise Press',
    year: '2007',
    category: 'True Crime',
    synopsis: "A race-against-time investigation examining the complex trauma, caller psychological profiles, and enduring legacy left on the survivors of the Ghostface attacks."
  },
  {
    id: 'ghostface-returns',
    title: 'Ghostface Returns',
    author: 'Gale Weathers',
    price: '$23.99',
    image: GhostfaceReturns,
    publisher: 'Sunrise Press',
    year: '2008',
    category: 'True Crime',
    synopsis: "A chilling examination of how the Ghostface moniker evolved from a local murderer into an enduring urban legend and internet obsession across online horror fandoms."
  },
  {
    id: 'knife-of-the-hunter',
    title: 'Knife of the Hunter',
    author: 'Gale Weathers',
    price: '$17.99',
    image: KnifeOfTheHunter,
    publisher: 'Sunrise Press',
    year: '2010',
    category: 'True Crime',
    synopsis: "Gale Weathers' final pre-reboot work, detailing the dark rise of true-crime forums, live-streaming culture, and the modern obsession with notoriety."
  }
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Error logging in: " + error.message);
    } else {
      alert("Successfully logged in!");
    }
  };

  const handleOAuthLogin = async (providerName) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: {
        // Dynamically uses current domain (localhost in dev, live URL on Render)
        redirectTo: `${window.location.origin}/home`,
      },
    });

    if (error) {
      alert("Error logging in: " + error.message);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="App-header">
      <h3>Hello Sydney, are you ready to log in?</h3>

      <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: '20px auto' }}>
        <input 
          type="email" 
          placeholder="Enter your email..." 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px' }}
        />
        <input 
          type="password" 
          placeholder="Enter your password..." 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px' }}
        />
        <button type="submit" className="btn-horror">
          Log In
        </button>
      </form>

      <p>- OR -</p>

      <div className="oauth-container" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
        <button onClick={() => handleOAuthLogin('google')} className="btn-horror">
          <FontAwesomeIcon icon={faGoogle} style={{ color: "rgb(55, 0, 0)", marginRight: '8px' }} />
          Google
        </button>

        <button onClick={() => handleOAuthLogin('github')} className="btn-horror">
          <FontAwesomeIcon icon={faGithub} style={{ color: "rgb(55, 0, 0)", marginRight: '8px' }} />
          GitHub
        </button>
      </div>

      <div className='btn'>
        <Link to="/" className="btn-horror">Are you lost???</Link>
        <Link to="/create" className="btn-horror">Create an account</Link>
      </div>

      <Disclaimer />
    </div>
  );
}

function Lost() {
  return (  
    <div className="App-header">
      <img src={ghostface} className='gf_1' alt="ghostface by Erik Mclean" />
      <p>
        Hello Sydney, it looks like you are lost, either login or sign up to create a new account, and never pick up the phone.
      </p>
      <div className='btn'>
        <Link to="/login" className="btn-horror">Login, I dare you!</Link>
        <Link to="/create" className="btn-horror">Sign Up</Link>
      </div>
      <Disclaimer />
    </div>
  );
}

function CreateUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert("Error signing up: " + error.message);
    } else {
      alert("Successfully signed up! Please check your email.");
      navigate('/home');
    }
  };

  const handleOAuthLogin = async (providerName) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: {
        // Dynamically uses current domain
        redirectTo: `${window.location.origin}/home`,
      },
    });

    if (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="App-header">
      <h3>Hello Sydney, are you ready to sign up?</h3>

      <form onSubmit={handleEmailSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: '20px auto' }}>
        <input 
          type="email" 
          placeholder="Enter your email..." 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px' }}
        />
        <input 
          type="password" 
          placeholder="Create a password..." 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px' }}
        />
        <button type="submit" className="btn-horror">
          Sign Up
        </button>
      </form>

      <p>- OR -</p>

      <div className="oauth-container" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
        <button onClick={() => handleOAuthLogin('google')} className="btn-horror">
          <FontAwesomeIcon icon={faGoogle} style={{ color: "rgb(55, 0, 0)", marginRight: '8px' }} />
          Google
        </button>

        <button onClick={() => handleOAuthLogin('github')} className="btn-horror">
          <FontAwesomeIcon icon={faGithub} style={{ color: "rgb(55, 0, 0)", marginRight: '8px' }} />
          GitHub
        </button>
      </div>

      <div className='btn'>
        <Link to="/" className="btn-horror">Are you lost???</Link>
        <Link to="/login" className="btn-horror">Already have an account? Log in</Link>
      </div>

      <Disclaimer />
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="App-header">
      <footer>
        <p><strong>Disclaimer & Terms of Service:</strong></p>
        <p>
          This website is a non-commercial, full-stack educational web application built solely for demonstration purposes as part of a Codecademy course portfolio project.
        </p>
        <p>
          <strong>Notice on Intellectual Property:</strong> All character names, book titles, film references, and pop-culture elements (including references to <em>Scream</em>, Paramount Pictures, Spyglass Media Group, and other respective media franchises) are the property of their respective copyright and trademark owners. They are used here strictly as fictional mock data under fair use for educational and testing purposes.
        </p>
        <p>
          <strong>Image Credits & Sources:</strong> All book cover graphics and promotional images featured on this site were sourced from the <em>Scream Fandom Wiki</em> and are used under non-commercial fair use for educational demonstration.
        </p>
        <p>
          <strong>Payments & Transactions:</strong> This site uses a simulated sandbox environment for payment processing (e.g., Stripe Test Mode). No real monetary transactions are processed, and no physical products will be shipped or delivered.
        </p>
      </footer>
    </div>
  );
}

function Rules() {
  const [userData, setUserData] = useState({
    name: 'Ghostface',
    avatar: Pro,
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Ghostface';
        const displayAvatar = meta.avatar_url || meta.picture || Pro;

        setUserData({
          name: displayName,
          avatar: displayAvatar,
        });
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="App-header">
      <header className='navbar'> 
        <img src={knife} alt="Stab Bookstore Logo" className='nav-logo'/>
        <Link className='bleeding-text' to='/home'>Home</Link>
        <Link className='bleeding-text' to='/books'>Books</Link>
        <Link className='bleeding-text' to='/orders'>Past Orders</Link>  
        <Link className='bleeding-text' to='/cart'>Cart</Link>
        <Link className='bleeding-text' to='/rules'>Rules of Horror</Link>

        <div className="nav-user-container">
          <span className="nav-user-name">{userData.name}</span>
          <Link to='/profile'>
            <img src={userData.avatar} alt="Profile" className='nav-profile'/>
          </Link>
        </div>
      </header>

      <h3 className='bleeding-text'>No Sex</h3>
      <h5>Sex equals immediate slaughter; the second you give in to temptation, you're putting a target right on your back.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>No Alcohol or Drugs</h3>
      <h5>Indulging in vices completely wrecks your reaction time and triggers the classic sin factor. You drink, you die.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>Never Say "I'll Be Right Back"</h3>
      <h5>Uttering those four words is an absolute death sentence. You say it, you are never coming back alive.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>Bigger Body Count</h3>
      <h5>The first rule of the sequel is simple: the stakes get jacked up and the body count gets way higher.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>More Elaborate Deaths</h3>
      <h5>Sequels demand total carnage. The kills have to be bloodier, goriest, and way more psychotic than before.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>Never Assume the Killer Is Dead</h3>
      <h5>They always have one final cheap jump-scare left in them. Put another bullet in their head just to be sure.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>The Killer Is Superhuman</h3>
      <h5>In the final chapter of a trilogy, standard stabs and gunshots won't cut it. You have to blow 'em to pieces or tear their head off.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>Anyone Can Die</h3>
      <h5>In the grand finale, plot armor completely vanishes. Main characters, sidekicks, fan favorites—anybody can get axed.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>The Past Will Haunt You</h3>
      <h5>Whatever you think you know about the beginning is a lie. Unburied sins and dirty secrets always drag themselves back up to ruin you.</h5>
      <p>-- Randy Meeks</p>

      <h3 className='bleeding-text'>Never Say "Who's There?"</h3>
      <h5>Answering the phone, opening the door, or asking who's lurking in the dark is practically begging for a blade to the throat.</h5>
      <p>-- Ghostface</p>

      <h3 className='bleeding-text'>Never Check the Closet</h3>
      <h5>Creeping around dark rooms and sticking your nose in pitch-black closets is the fastest way to get ambushed.</h5>
      <p>-- Ghostface</p>

      <h3 className='bleeding-text'>Not in My Movie</h3>
      <h5>You don't just walk away after the speech. Always shoot the killer in the head so there is zero chance of a comeback.</h5>
      <p>-- Sidney Prescott</p>

      <h3 className='bleeding-text'>Sequels Are Superior</h3>
      <h5>Rules can be shattered—sometimes the follow-up ramps up the budget, art, and madness way beyond the original.</h5>
      <p>-- Mickey Altieri</p>

      <h3 className='bleeding-text'>The Original Is Always Sacred</h3>
      <h5>Don't get ahead of yourself; classic original stories hold a raw brilliance that cash-grab sequels can never touch.</h5>
      <p>-- Cici Cooper</p>

      <h3 className='bleeding-text'>Don't Mess with the Original</h3>
      <h5>The golden rule of remakes: if you try to replace a legendary masterpiece without respecting its roots, you're toast.</h5>
      <p>-- Charlie Walker</p>

      <h3 className='bleeding-text'>The Unexpected Is the New Cliché</h3>
      <h5>To outwit modern audiences who know every trick in the book, you have to twist and subvert every expectation.</h5>
      <p>-- Charlie Walker</p>

      <h3 className='bleeding-text'>Extreme Gore Is the New Baseline</h3>
      <h5>Modern audiences are completely desensitized. A reboot demands outrageous, bloody brutality right out of the gate.</h5>
      <p>-- Robbie Mercer</p>

      <h3 className='bleeding-text'>Virginity Is No Longer a Safeguard</h3>
      <h5>The old slasher morality code is dead and buried. Being innocent won't protect you anymore—virgins get gutted too.</h5>
      <p>-- Charlie Walker</p>

      <h3 className='bleeding-text'>Live-Stream Everything</h3>
      <h5>If it isn't recorded, it didn't happen. Film your entire life—or death—because audience footage is king in the digital age.</h5>
      <p>-- Robbie Mercer</p>

      <h3 className='bleeding-text'>You Don't Need Friends, You Need Fans</h3>
      <h5>In the modern remake era, loyalty means nothing. It's all about clout, instant fame, and playing the ultimate victim for the cameras.</h5>
      <p>-- Jill Roberts</p>

      <h3 className='bleeding-text'>It Must Be Part of a Franchise</h3>
      <h5>It is never just a basic sequel anymore—it is a requel. You have to mash up the original legacy crew with fresh blood to keep the machine running.</h5>
      <p>-- Mindy Meeks-Martin</p>

      <h3 className='bleeding-text'>Never Trust the Love Interest</h3>
      <h5>Look at the track record! The romantic partner is almost always the psycho hiding behind the mask.</h5>
      <p>-- Dewey Riley</p>

      <h3 className='bleeding-text'>The Killer Is Connected to the Original</h3>
      <h5>It all loops back to where it started. The killer's obsession is always tied directly to the original massacre.</h5>
      <p>-- Mindy Meeks-Martin</p>

      <h3 className='bleeding-text'>Legacy Characters Are Vulnerable</h3>
      <h5>Original survivors are brought back for nostalgia—right before they get brutally gutted to raise the stakes.</h5>
      <p>-- Mindy Meeks-Martin</p>

      <h3 className='bleeding-text'>Everything Must Be Bigger</h3>
      <h5>Welcome to the franchise era. Bigger budgets, massive new cities, and way higher body counts away from home.</h5>
      <p>-- Mindy Meeks-Martin</p>

      <h3 className='bleeding-text'>No One Is Safe</h3>
      <h5>The core rules are out the window. In a long-running franchise, main characters are completely fair game.</h5>
      <p>-- Mindy Meeks-Martin</p>

      <h3 className='bleeding-text'>Subvert the Established Rules</h3>
      <h5>The second you think you have the formula figured out, the movie flips its own rules upside down just to mess with you.</h5>
      <p>-- Mindy Meeks-Martin</p>

      <h3 className='bleeding-text'>Cut Their Heads Off</h3>
      <h5>When dealing with a Ghostface fanatic, forget playing nice—you take them down viciously and completely finish the job.</h5>
      <p>-- Sam Carpenter</p>

      <Link to="/home" className="btn-horror">Go Home</Link>
      <Disclaimer />
    </div>
  );
}

function Home() {
  const [userData, setUserData] = useState({
    name: 'Ghostface',
    avatar: Pro,
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Ghostface';
        const displayAvatar = meta.avatar_url || meta.picture || Pro;

        setUserData({
          name: displayName,
          avatar: displayAvatar,
        });
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="App-header"> 
      <header className='navbar'> 
        <img src={knife} alt="Stab Bookstore Logo" className='nav-logo'/>
        
        <Link className='bleeding-text' to='/home'>Home</Link>
        <Link className='bleeding-text' to='/books'>Books</Link>
        <Link className='bleeding-text' to='/orders'>Past Orders</Link>  
        <Link className='bleeding-text' to='/cart'>Cart</Link>
        <Link className='bleeding-text' to='/rules'>Rules of Horror</Link>

        <div className="nav-user-container">
          <span className="nav-user-name">{userData.name}</span>
          <Link to='/profile'>
            <img src={userData.avatar} alt="Profile" className='nav-profile'/>
          </Link>
        </div>
      </header>

      <div className='con'>
        <h2> Welcome to the stab bookstore where you can browse books from Gale Weathers to Sidney Prescott, featuring the actual events of the Woodsboro murders, non-Fictional ghostface descriptions, as well as later Gale Weathers fictional writings and stories.</h2>
        <br />
        <img src={Banner} alt="The Woodsboro Murder books"/>
        <Link to='/books' className='btn-horror'>Shop Now!!!</Link>
        <br/>
        <h3>Also browse the Sidney Prescott classic:</h3>
        <br/>
        <img src={OutOfDarkness} alt="Out Of Darkness by Sidney Prescott" className='book'/>
        <br/>
        <Link to='/books' className='bleeding-text'>Out Of Darkness</Link>
      </div>

      <Disclaimer />
    </div>
  );
}

function Books() {
  const [userData, setUserData] = useState({
    name: 'Ghostface',
    avatar: Pro,
  });
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Ghostface';
        const displayAvatar = meta.avatar_url || meta.picture || Pro;

        setUserData({
          name: displayName,
          avatar: displayAvatar,
        });
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="App-header"> 
      <header className='navbar'> 
        <img src={knife} alt="Stab Bookstore Logo" className='nav-logo'/>
        
        <Link className='bleeding-text' to='/home'>Home</Link>
        <Link className='bleeding-text' to='/books'>Books</Link>
        <Link className='bleeding-text' to='/orders'>Past Orders</Link>  
        <Link className='bleeding-text' to='/cart'>Cart</Link>
        <Link className='bleeding-text' to='/rules'>Rules of Horror</Link>

        <div className="nav-user-container">
          <span className="nav-user-name">{userData.name}</span>
          <Link to='/profile'>
            <img src={userData.avatar} alt="Profile" className='nav-profile'/>
          </Link>
        </div>
      </header>

      <div className="books-container">
        <h1 className="bleeding-text books-title">Books Catalog</h1>
        <p className="books-subtitle">Explore real true-crime accounts and Woodsboro history.</p>

        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.image} alt={book.title} className="book-card-img" />
              <div className="book-card-content">
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">By {book.author}</p>
                <p className="book-card-price">{book.price}</p>
              </div>
              <div className="book-card-actions">
                <Link to={`/books/${book.id}`} className="btn-horror">More Info</Link>
                <button className="btn-horror" onClick={() => addToCart(book)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

function BookDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const book = books.find((b) => b.id === id);
  const [userData, setUserData] = useState({
    name: 'Ghostface',
    avatar: Pro,
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Ghostface';
        const displayAvatar = meta.avatar_url || meta.picture || Pro;

        setUserData({
          name: displayName,
          avatar: displayAvatar,
        });
      }
    }
    fetchUser();
  }, []);

  if (!book) {
    return (
      <div className="App-header">
        <header className='navbar'> 
          <img src={knife} alt="Stab Bookstore Logo" className='nav-logo'/>
          <Link className='bleeding-text' to='/home'>Home</Link>
          <Link className='bleeding-text' to='/books'>Books</Link>
          <Link className='bleeding-text' to='/orders'>Past Orders</Link>  
          <Link className='bleeding-text' to='/cart'>Cart</Link>
          <Link className='bleeding-text' to='/rules'>Rules of Horror</Link>

          <div className="nav-user-container">
            <span className="nav-user-name">{userData.name}</span>
            <Link to='/profile'>
              <img src={userData.avatar} alt="Profile" className='nav-profile'/>
            </Link>
          </div>
        </header>

        <div className="books-container" style={{ marginTop: '50px' }}>
          <h2>Book Not Found</h2>
          <p>The book you are looking for does not exist in the Woodsboro archives.</p>
          <br />
          <Link to="/books" className="btn-horror">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="App-header">
      <header className='navbar'> 
        <img src={knife} alt="Stab Bookstore Logo" className='nav-logo'/>
        <Link className='bleeding-text' to='/home'>Home</Link>
        <Link className='bleeding-text' to='/books'>Books</Link>
        <Link className='bleeding-text' to='/orders'>Past Orders</Link>  
        <Link className='bleeding-text' to='/cart'>Cart</Link>
        <Link className='bleeding-text' to='/rules'>Rules of Horror</Link>

        <div className="nav-user-container">
          <span className="nav-user-name">{userData.name}</span>
          <Link to='/profile'>
            <img src={userData.avatar} alt="Profile" className='nav-profile'/>
          </Link>
        </div>
      </header>

      <div className="book-detail-container">
        <Link to="/books" className="btn-horror">Back to Catalog</Link>

        <div className="book-detail-card">
          <img src={book.image} alt={book.title} className="book-detail-img" />

          <div className="book-detail-info">
            <div>
              <h1 className="book-detail-title">{book.title}</h1>
              <p className="book-detail-author">By {book.author}</p>
              <p className="book-detail-price">{book.price}</p>

              <p className="book-detail-synopsis">{book.synopsis}</p>

              <div className="book-detail-meta">
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Published:</strong> {book.year}</p>
                <p><strong>Category:</strong> {book.category}</p>
              </div>
            </div>

            <div className="book-detail-actions">
              <button className="btn-horror" onClick={() => addToCart(book)}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

function Orders() {
  const { orders, setOrders, setCart } = useCart();
  const [userData, setUserData] = useState({ name: 'Ghostface', avatar: Pro });
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Stripe Success Redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isSuccess = queryParams.get('success');

    if (isSuccess === 'true') {
      const savedPending = localStorage.getItem('pending_stripe_order');

      if (savedPending) {
        const orderItems = JSON.parse(savedPending);

        const total = orderItems
          .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 0)
          .toFixed(2);

        const newOrder = {
          id: Math.floor(100000 + Math.random() * 900000),
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          items: orderItems,
          total: total,
        };

        setOrders((prevOrders) => {
          const updated = [newOrder, ...prevOrders];
          localStorage.setItem('stab_past_orders', JSON.stringify(updated));
          return updated;
        });

        setCart([]);
        localStorage.removeItem('pending_stripe_order');
        localStorage.removeItem('stab_cart');

        navigate('/orders', { replace: true });
      }
    }
  }, [location, navigate, setOrders, setCart]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setUserData({
          name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Ghostface',
          avatar: meta.avatar_url || meta.picture || Pro,
        });
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="App-header">
      <header className="navbar">
        <img src={knife} alt="Stab Bookstore Logo" className="nav-logo" />
        <Link className="bleeding-text" to="/home">Home</Link>
        <Link className="bleeding-text" to="/books">Books</Link>
        <Link className="bleeding-text" to="/orders">Past Orders</Link>
        <Link className="bleeding-text" to="/cart">Cart</Link>
        <Link className="bleeding-text" to="/rules">Rules of Horror</Link>

        <div className="nav-user-container">
          <span className="nav-user-name">{userData.name}</span>
          <Link to="/profile">
            <img src={userData.avatar} alt="Profile" className="nav-profile" />
          </Link>
        </div>
      </header>

      <div className="orders-container" style={{ width: '80%', maxWidth: '800px', margin: '40px auto' }}>
        <h1 className="bleeding-text">Order History</h1>
        <p style={{ color: '#8b949e', marginBottom: '30px' }}>
          Review your previous transactions from the Woodsboro archives.
        </p>

        {orders.length === 0 ? (
          <div style={{ margin: '40px 0' }}>
            <p style={{ color: '#8b949e', marginBottom: '20px' }}>No past orders found.</p>
            <Link to="/books" className="btn-horror">Browse Books</Link>
          </div>
        ) : (
          <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: '#111a24',
                  border: '1px solid #1c2b3d',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #1c2b3d',
                    paddingBottom: '12px',
                    marginBottom: '15px',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: '#ba181b' }}>Order #{order.id}</h3>
                    <p style={{ margin: '4px 0 0 0', color: '#8b949e', fontSize: '0.9rem' }}>
                      Placed on {order.date}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: '#8b949e' }}>Total Paid</span>
                    <h3 style={{ margin: 0, color: '#fff' }}>${order.total}</h3>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '8px 0' }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '45px', height: '65px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, color: '#fff' }}>{item.title}</h4>
                        <p style={{ margin: '2px 0 0 0', color: '#8b949e', fontSize: '0.85rem' }}>
                          Qty: {item.quantity} × {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}

function Cart() {
  const { cart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Ghostface',
    avatar: Pro,
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Ghostface';
        const displayAvatar = meta.avatar_url || meta.picture || Pro;

        setUserData({ name: displayName, avatar: displayAvatar });
      }
    }
    fetchUser();
  }, []);

  const total = cart
    .reduce((sum, item) => {
      const priceNum = parseFloat(item.price.replace('$', ''));
      return sum + priceNum * item.quantity;
    }, 0)
    .toFixed(2);

  const handleCheckout = async () => {
  if (cart.length === 0) return;
  setLoading(true);

  try {

    // 🟢 WITH YOUR ACTUAL RENDER BACKEND URL:
    const API_URL = 'https://e-commerce-scream-app.onrender.com';

    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

      const data = await response.json();

      if (data.url) {
        localStorage.setItem('pending_stripe_order', JSON.stringify(cart));
        window.location.href = data.url;
      } else {
        alert('Checkout error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Unable to initiate checkout session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App-header">
      <header className="navbar">
        <img src={knife} alt="Stab Bookstore Logo" className="nav-logo" />
        <Link className="bleeding-text" to="/home">Home</Link>
        <Link className="bleeding-text" to="/books">Books</Link>
        <Link className="bleeding-text" to="/orders">Past Orders</Link>
        <Link className="bleeding-text" to="/cart">Cart ({cart.length})</Link>
        <Link className="bleeding-text" to="/rules">Rules of Horror</Link>

        <div className="nav-user-container">
          <span className="nav-user-name">{userData.name}</span>
          <Link to="/profile">
            <img src={userData.avatar} alt="Profile" className="nav-profile" />
          </Link>
        </div>
      </header>

      <div className="cart-container" style={{ width: '80%', maxWidth: '800px', margin: '40px auto' }}>
        <h1 className="bleeding-text">Your Cart</h1>

        {cart.length === 0 ? (
          <div style={{ margin: '30px 0' }}>
            <p style={{ color: '#8b949e', marginBottom: '20px' }}>Your cart is empty.</p>
            <Link to="/books" className="btn-horror">Browse Books</Link>
          </div>
        ) : (
          <div>
            <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#111a24',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #1c2b3d',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '4px' }}
                  />

                  <div style={{ flex: 1, marginLeft: '20px', textAlign: 'left' }}>
                    <h3 style={{ color: '#fff', margin: 0 }}>{item.title}</h3>
                    <p style={{ color: '#8b949e', margin: '5px 0' }}>Qty: {item.quantity}</p>
                    <p style={{ color: '#ba181b', fontWeight: 'bold', margin: 0 }}>{item.price}</p>
                  </div>

                  <button
                    className="btn-horror"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '1px solid #1c2b3d', paddingTop: '20px' }}>
              <h2 style={{ color: '#fff' }}>Total: ${total}</h2>
              <button
                className="btn-horror"
                style={{ marginTop: '10px' }}
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Redirecting to Stripe...' : 'Checkout with Stripe'}
              </button>
            </div>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}

function Profile() {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setName(meta.full_name || meta.name || user.email?.split('@')[0] || '');
        setAvatarUrl(meta.avatar_url || meta.picture || Pro);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        avatar_url: avatarUrl,
      },
    });

    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      alert('Profile updated successfully!');
      window.location.reload();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Error logging out: ' + error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="App-header">
      <header className="navbar">
        <img src={knife} alt="Stab Bookstore Logo" className="nav-logo" />
        <Link className="bleeding-text" to="/home">Home</Link>
        <Link className="bleeding-text" to="/books">Books</Link>
        <Link className="bleeding-text" to="/orders">Past Orders</Link>
        <Link className="bleeding-text" to="/cart">Cart</Link>
        <Link className="bleeding-text" to="/rules">Rules of Horror</Link>

        <div className="nav-user-container">
          <span className="nav-user-name">{name || 'Ghostface'}</span>
          <Link to="/profile">
            <img src={avatarUrl || Pro} alt="Profile" className="nav-profile" />
          </Link>
        </div>
      </header>

      <div style={{ width: '80%', maxWidth: '500px', margin: '40px auto', background: '#111a24', padding: '30px', borderRadius: '8px', border: '1px solid #1c2b3d' }}>
        <h1 className="bleeding-text" style={{ marginBottom: '20px' }}>Edit Profile</h1>

        <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={avatarUrl || Pro}
            alt="Profile Preview"
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ba181b' }}
          />
        </div>

        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#8b949e' }}>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              required
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #1c2b3d', background: '#0a0f14', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#8b949e' }}>Profile Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/your-image.png"
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #1c2b3d', background: '#0a0f14', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" className="btn-horror" disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>

        <hr style={{ border: '0', borderTop: '1px solid #1c2b3d', margin: '30px 0' }} />

        <button 
          onClick={handleLogout} 
          className="btn-horror" 
          style={{ width: '100%', backgroundColor: '#ba181b', color: '#fff' }}
        >
          Log Out
        </button>
      </div>

      <Disclaimer />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <CartProvider>
        <Routes>
          <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
          <Route path="/" element={<Lost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateUser />} />
        </Routes>
      </CartProvider>
    </div>
  );
}

export default App;