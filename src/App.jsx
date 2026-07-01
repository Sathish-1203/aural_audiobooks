import React, { useState } from 'react';
import './App.css';
import { featuredBooks,featuredBooks2,bannerSlides,bestSellersPageContent, selfDevelopmentPageContent, aboutUsContent, faqContent} from './booksData';
import { Search, Play, Pause, SkipForward, Volume2, Globe } from 'lucide-react';

// 👉 FIXED: Missing Core Swiper Imports added to resolve crash compile state
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';

// Core Swiper base engine styling tracks
import 'swiper/css';
import 'swiper/css/navigation';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBook, setCurrentBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // 👉 ADDED: Controls the visibility of the mandatory Login Alert Popup
  const [showLoginAlert, setShowLoginAlert] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePreviewId, setActivePreviewId] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [audioElement, setAudioElement] = useState(null);
  const [selectedDetailBook, setSelectedDetailBook] = useState(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showTrialPage, setShowTrialPage] = useState(false);
  
  
 // 🌟 UNIFIED AUDIO LIFECYCLE ENGINE: Handles Play, Pause, & Cancel (X) Loops perfectly
  React.useEffect(() => {
    
    // 1. CANCEL/CLOSE TRIGGER CHECK: If user clicked X or no book selected, instantly kill active background stream
    if (!currentBook) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0; // Rewinds stream timeline to zero point
      }
      setIsPlaying(false);
      return;
    }

    // 2. CONTEXT SWITCH RESET: If user directly jumps from one playing book card to another sample track
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    // 3. BEGINNER BACKUP FALLBACK ROUTE: Grabs SoundHelix-Song-1 since you cleared custom data paths
    const finalStreamUrl = currentBook.audioSrc || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    
    // Create the HTML5 Browser Audio stream instance reference tracking node
    const newAudioInstance = new Audio(finalStreamUrl);
    setAudioElement(newAudioInstance);

    // 4. PLAYBACK FLOW CONTROL MANAGER
    if (isPlaying) {
      newAudioInstance.play().catch(err => console.log("Auto-play tracking validation passed:", err));
    }

    // 5. GARBAGE COLLECTION CLEANUP (CRITICAL STAGE):
    // Cleans up system memory when currentBook resets to null or flips conditions
    return () => {
      newAudioInstance.pause();
      newAudioInstance.currentTime = 0;
    };
  }, [currentBook]);


  // 🌟 PLAY/PAUSE DYNAMIC CONTROLLER TRACKER
  React.useEffect(() => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.play().catch(err => console.log("Realtime playback toggle sync log:", err));
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioElement]);

// 👉 REPLACED FILTER LOGIC FOR SECTION 1
  const filteredBooks = featuredBooks.filter(book => {
    // 1. Text Search matching இருக்கான்னு பார்க்கும்
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
    // 2. Dropdown Category click matching இருக்கான்னு பார்க்கும்
    const matchesCategory = 
      searchQuery === '' || 
      (book.category && book.category.toLowerCase() === searchQuery.toLowerCase());

    return matchesSearch || matchesCategory;
  });

  // 👉 REPLACED FILTER LOGIC FOR SECTION 2
  const filteredBooks2 = featuredBooks2.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      searchQuery === '' || 
      (book.category && book.category.toLowerCase() === searchQuery.toLowerCase());

    return matchesSearch || matchesCategory;
  });
  return (
    <div className="app-container">
      
      {/* 👉 MANDATORY MIDDLE LOGIN/ALERT POPUP */}
      {showLoginAlert && (
        <div className="mandatory-modal-overlay">
          <div className="mandatory-modal-box">
            
            <h2>Welcome to Aural</h2>
            <p>Please log in with credentials to fully unlock the platform, or continue via Guest access mode below.</p>
            
            {/* On Submit: Sets user role to 'member' and closes modal */}
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                setUserRole('member');
                setShowLoginAlert(false); 
              }} 
              className="modal-login-form"
            >
              <div className="modal-input-group">
                <label>Email or Username</label>
                <input type="email" placeholder="name@domain.com" required />
              </div>
              
              <div className="modal-input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              
              <button type="submit" className="modal-submit-btn">Sign In </button>
            </form>
            
            <div className="modal-secondary-actions">
              {/* On Click Guest: Sets user role to 'guest' and closes modal */}
              <button 
                className="modal-cancel-text-btn" 
                onClick={() => {
                  setUserRole('guest');
                  setShowLoginAlert(false);
                }}
              >
                Guest Browse
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Aural<span className="sub-logo"></span></div>
          {/* 👉 BROWSE MEGA MENU TRIGGER WRAPPER */}
          <div className="browse-menu-container">
            <span className="nav-item browse-trigger">
              <Globe size={16} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} /> 
              Browse
            </span>
            
            {/* The Dropdown Panel Hidden/Shown via CSS Hover Context */}
            <div className="mega-dropdown-panel">
              <div className="dropdown-columns-wrapper">
              
                {/* Left Column: Categories */}
                <div className="dropdown-column">
                  <h4 className="column-heading">Categories</h4>
                  <ul>
                    <li><span className="dropdown-link">View all categories</span></li>
                    <li><span className="dropdown-link" onClick={() => setSearchQuery('Fiction')}>Fiction</span></li>
                    <li><span className="dropdown-link" onClick={() => setSearchQuery('Sci-Fi')}>Sci-Fi & Fantasy</span></li>
                    <li>
                      <span className="dropdown-link" onClick={() => document.getElementById('self-development-section').scrollIntoView({ behavior: 'smooth' })}>
                        Self-Development
                      </span>
                    </li>
                    <li><span className="dropdown-link" onClick={() => setSearchQuery('Mysteries')}>Mysteries & Thrillers</span></li>
                    <li><span className="dropdown-link" onClick={() => setSearchQuery('Biographies')}>Biographies & Memoirs</span></li>
                    <li><span className="dropdown-link" onClick={() => setSearchQuery('Business')}>Business</span></li>
                  </ul>
                </div>

                {/* Right Column: More to Explore */}
                <div className="dropdown-column">
                  <h4 className="column-heading">More to explore</h4>
                  <ul>
                    <li>
                      <span className="dropdown-link" onClick={() => document.getElementById('best-sellers-section').scrollIntoView({ behavior: 'smooth' })}>
                        Best sellers
                      </span>
                    </li>
                    <li><span className="dropdown-link">New releases</span></li>
                    <li><span className="dropdown-link" onClick={() => setSearchQuery('Tamil')}>Tamil audiobooks</span></li>
                    <li><span className="dropdown-link">Podcasts</span></li>
                    <li><span className="dropdown-link">Aural Originals</span></li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
            <span 
              className="nav-item" 
              onClick={() => setShowMembershipModal(true)} 
              style={{ cursor: 'pointer' }}
            >
              Membership Benefits
            </span>
        </div>
        
        <div className="nav-right">
          <div className="search-container">
            <Search size={18} color="#c335e2" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for a great book" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="nav-item">Help</span>
          <span className="nav-item lang-selector"><Globe size={16} /> INR</span>
          <button className="signin-btn" onClick={() => setShowLoginAlert(true)}>
            {userRole === 'guest' ? 'Login' : 'Sign In'}
          </button>
        </div>
      </nav>

      {/* CAROUSEL HERO BANNER */}
      <header className="hero-slider">
        <div className="hero-slide-content">
          <div className="hero-text-panel">
            <h1>{bannerSlides[currentSlide].heading}</h1>
            <p>{bannerSlides[currentSlide].subheading}</p>
            <button className="trial-btn" onClick={() => setShowTrialPage(true)}>
              {bannerSlides[currentSlide].cta}
            </button>
            {/* ======================================================================= */}
      {/* 🌟 30-DAY FREE TRIAL REGISTRATION PORTAL PAGE 🌟 */}
      {/* ======================================================================= */}
      {showTrialPage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          zIndex: 9999999,
          overflowY: 'auto',
          padding: '60px'
        }}>
          {/* Back Trigger */}
          <div style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
            <button 
              onClick={() => setShowTrialPage(false)}
              style={{ background: 'none', border: 'none', color: '#0066c0', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
            >
              &larr; Cancel &amp; Return to Library
            </button>
          </div>

          {/* Secure Setup Box Frame */}
          <div style={{ maxWidth: '550px', margin: '0 auto', background: '#ffffff', border: '1px solid #dcdcdc', padding: '40px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: '#111111', textAlign: 'left' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#111111' }}>Create Your Free Account</h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '25px', lineHeight: '1.4' }}>
              You are activating your <strong>30-Day Risk-Free Trial</strong>. Enjoy 1 free premium credit + full Plus Catalog access instantly.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Trial Activated Successfully! Welcome to Aural Premium Plus.'); setShowTrialPage(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Full Name</label>
                <input type="text" placeholder="Enter your full name" required style={{ padding: '10px 12px', border: '1px solid #bcc8d4', borderRadius: '4px', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Email Address</label>
                <input type="email" placeholder="name@domain.com" required style={{ padding: '10px 12px', border: '1px solid #bcc8d4', borderRadius: '4px', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Choose Password</label>
                <input type="password" placeholder="Minimum 6 characters" required style={{ padding: '10px 12px', border: '1px solid #bcc8d4', borderRadius: '4px', fontSize: '14px' }} />
              </div>

              {/* Summary Terms Card */}
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #edf2f7', fontSize: '12px', color: '#444', lineHeight: '1.5' }}>
                📌 <strong>Trial Plan Summary:</strong><br />
                • Today's Cost: <span style={{ color: '#137333', fontWeight: 'bold' }}>₹0.00 (Free)</span><br />
                • Duration: 30 Full Days access.<br />
                • Renews at ₹199/month after trial ends. Cancel anytime online.
              </div>

              <button 
                type="submit" 
                style={{ background: '#ff9900', border: '1px solid #d48600', color: '#111', padding: '14px', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
              >
                Start Listening Now &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
            <span className="fine-print">{bannerSlides[currentSlide].finePrint}</span>
          </div>
          
          <div className="hero-image-panel">
            <div className="floating-art-collage">
              {bannerSlides[currentSlide].imageGroup.map((imgUrl, idx) => (
                <img key={idx} src={imgUrl} alt="Cover Collage" className={`collage-img img-${idx}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="carousel-indicators">
          {bannerSlides.map((slide) => (
            <button 
              key={slide.id} 
              className={`indicator-dash ${currentSlide === slide.id ? 'active' : ''}`}
              onClick={() => setCurrentSlide(slide.id)}
            />
          ))}
        </div>
      </header>

      {/* GALLERY SECTION */}
      <main className="gallery-container">
        <h2 className="main-headline">We've got what everyone's listening to</h2>
        <p className="sub-headline">Best sellers. New releases. That story you've been waiting for.</p>
        
        {/* SECTION 1: FLAT GRID ROW WITH PREVIEW SYSTEM */}
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card-container-context" style={{ position: 'relative' }}>
              <div 
                className="book-card" 
                onClick={() => setActivePreviewId(activePreviewId === book.id ? null : book.id)}
              >
                <div className="image-wrapper">
                  <img src={book.image} alt={book.title} className="book-cover" />
                </div>
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">Written by: <span className="link-text">{book.author}</span></p>
                </div>
              </div>

              {/* Dynamic PopOver Render Frame */}
              {activePreviewId === book.id && (
                <div className="custom-audible-preview-card">
                  <h4>{book.title}</h4>
                  <p className="pop-subtitle">Narrated by: {book.narrator}</p>
                  <p className="pop-length"><strong>Length:</strong> {book.length}</p>
                  <hr className="pop-divider" />
                  <button 
                    className="popover-play-btn-trigger"
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid state click propagation bug
                      setCurrentBook(book); 
                      setIsPlaying(true); 
                    }}
                  >
                    Play Audio Sample
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SECTION 2: 3D COVERFLOW SLIDER EFFECT AREA */}
        <div className="section-two-wrapper">
          <h2 className="section-title-main">Only from Aural</h2>
          <p className="section-subtitle-main">we offer's Tamil Books Listening tracks.</p>

          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 180, 
              modifier: 1,
              slideShadows: false,
            }}
            navigation={true}
            modules={[EffectCoverflow, Navigation]}
            className="threeD-swiper-container"
          >
            {filteredBooks2.map((book) => (
              <SwiperSlide key={`3d-${book.id}`} className="td-slide-item">
                <div 
                  className="td-card-content"
                  onClick={() => { setCurrentBook(book); setIsPlaying(true); }}
                >
                  <img src={book.image} alt={book.title} className="td-book-cover" />
                  <div className="td-details">
                    <h3>{book.title}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>   
      </main>       

        <div className="dynamic-subpage-wrapper" style={{ backgroundColor: '#ffffff', padding: '5px 20px' }}>
          
          {/* 🌟 PART A: HOW IT WORKS SECTION (3 FEATURE CARDS) */}
          <section className="how-it-works-container" style={{ maxWidth: '1100px', margin: '0 auto 80px auto', padding :'20px',textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '40px', color: '#111' }}>
              An app designed for how you listen
            </h1>
            
            <div className="features-triple-grid" style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
              
              {/* Feature 1: Listen to Sample */}
              <div className="feature-status-card" style={{ flex: '1', minWidth: '280px', maxWidth: '240px', padding: '20px' }}>
                <div className="phone-mockup-frame" style={{ background: '#0e141b', borderRadius: '24px', padding: '25px', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <img src="https://m.media-amazon.com/images/I/7111nFVfgqL._SY342_.jpg" alt="show your work" style={{ width: '200px', height: '150px', borderRadius: '4px', marginBottom: '15px' }} />
                  <button 
                    className="sample-play-trigger-btn"
                    style={{ background: '#ff9900', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#111', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => {
                      if(featuredBooks && featuredBooks.length > 0) {
                        setCurrentBook(featuredBooks[6]); 
                        setIsPlaying(true);
                      }
                    }}
                  >
                    <Play size={14} fill="#111" /> Listen to Sample
                  </button>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Hear the sample playlist</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5'}}>
                  Use embedded platform live audio player widgets to stream quick previews before selection loops.
                </p>
              </div>

              {/* Feature 2: Car Mode */}
              <div className="feature-status-card" style={{ flex: '1', minWidth: '280px', maxWidth: '240px', padding: '20px' }}>
                <div className="phone-mockup-frame" style={{ background: '#0e141b', borderRadius: '24px', padding: '25px', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                  <div style={{ border: '3px solid #ff9900', borderRadius: '50%', padding: '16px', marginBottom: '10px' }}>
                    <SkipForward size={36} color="#ff9900" />
                  </div>
                  <span style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999' }}>Car Mode Active</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Listen with Car Mode</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                  Listen on the go with bigger, simplified tactile controls layout and a high-contrast screen matrix.
                </p>
              </div>

              {/* Feature 3: Download System */}
              <div className="feature-status-card" style={{ flex: '1', minWidth: '280px', maxWidth: '240px', padding: '20px' }}>
                <div className="phone-mockup-frame" style={{ background: '#0e141b', borderRadius: '24px', padding: '25px', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                  <div style={{ background: '#ff9900', borderRadius: '50%', padding: '14px', cursor: 'pointer' }} onClick={() => alert('Download cluster initialized to system cache')}>
                    <Globe size={32} color="#111" />
                  </div>
                  <span style={{ fontSize: '13px', marginTop: '15px', color: '#ff9900', fontWeight: 'bold' }}>Offline Storage Sync</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Listen anytime, anywhere</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                  Download specific digital files partition blocks and enjoy continuous streams completely offline.
                </p>
              </div>

            </div>
          </section>

          {/* ======================================================================= */}
          {/* =======================SCROLLABLE MULTI-PAGE PACK==================== */}
          {/* ======================================================================= */}

          {/* PAGE 1: BEST SELLERS PORTAL SECTION */}
          <section id="best-sellers-section" style={{ maxWidth: '1100px', margin: '80px auto 40px auto', padding: '5px', borderTop: '2px solid #0e0b0b' }}>
            <h1 className="sub-page-title" style={{ fontSize: '32px', fontWeight: '800', color: '#111', marginBottom: '6px' }}>{bestSellersPageContent.title}</h1>
            <p className="sub-page-subtitle" style={{ fontSize: '15px', color: '#000000', marginBottom: '35px' }}>{bestSellersPageContent.subtitle}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bestSellersPageContent.books.map((book) => (
                <div key={book.id || book.title} className="detailed-book-row-card" style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #eaeaea', padding: '25px 0', alignItems: 'flex-start' }}>
                  
                  {/* Book Cover Image */}
                  <img src={book.image} alt="" className="detailed-cover" style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  
                  {/* Middle Info Panel Column */}
                  <div className="detailed-info-panel" style={{ flex: '2' }}>
                    <h3 
                      style={{ fontSize: '18px', color: '#000000', margin: '0 0 8px 0', cursor: 'pointer' }} 
                      onClick={() => { 
                        setSelectedDetailBook({
                          title: book.title || "Premium Audiobook",
                          author: book.author || "Unknown Author",
                          narrator: book.narrator || "Expert Narrator",
                          length: book.length || "Unabridged Production",
                          image: book.image,
                          category: "Audible Best Seller #1 🔥",
                          customSummary: (book.description || "Experience an exceptional world-class performance.") + " This international multi-million copy phenomenon is currently featured in our premier global collection.",
                          bundleDeal: "🎁 BUNDLE SAVINGS PACK: Add this Best Seller to your cart today and unlock 3 FREE Self-Motivation audiobooks (including 'The 5 AM Club' & 'Atomic Habits' summaries) instantly at no extra cost!",
                          priceStructure: {
                            original: "₹899.00",
                            discounted: "FREE with 30-Day Trial",
                            membershipBenefit: "Save 100% instantly with an active Aural Audio membership coupon."
                          }
                        });
                      }}
                    >
                      {book.title}
                    </h3>

                    <div style={{ fontSize: '13px', color: '#444', marginBottom: '4px' }}><strong>By:</strong> {book.author} | <strong>Narrator:</strong> {book.narrator}</div>
                    <div style={{ fontSize: '13px', color: '#777' }}><strong>Runtime Length:</strong> {book.length}</div>
                    <p style={{ fontSize: '13px', color: '#222', marginTop: '10px', lineHeight: '1.4' }}>{book.description}</p>
                  </div>

                  {/* Right Side Action Panel Column */}
                  <div className="action-checkout-panel" style={{ flex: '1', textAlign: 'right' }}>
                    <span style={{ background: '#ff9900', color: '#111', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>{book.rank || "Best Seller"}</span>
                    <br />
                    <button 
                      className="yellow-checkout-btn" 
                      style={{ width: '100%', maxWidth: '180px', background: '#ff9900', border: '1px solid #d48600', padding: '10px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }} 
                      onClick={() => { 
                        setSelectedDetailBook({
                          title: book.title || "Premium Audiobook",
                          author: book.author || "Unknown Author",
                          narrator: book.narrator || "Expert Narrator",
                          length: book.length || "Unabridged Production",
                          image: book.image,
                          category: "Audible Best Seller #1 🔥",
                          customSummary: (book.description || "Experience an exceptional world-class performance.") + " This worldwide masterwork audio release is fully optimized for continuous self-motivation mindset rewiring.",
                          bundleDeal: "🎁 BUNDLE SAVINGS PACK: Add this Best Seller to your cart today and unlock 3 FREE Self-Motivation audiobooks (including 'The 5 AM Club' & 'Atomic Habits' summaries) instantly at no extra cost!",
                          priceStructure: {
                            original: "₹899.00",
                            discounted: "FREE with 30-Day Trial",
                            membershipBenefit: "Save 100% instantly with an active Aural Audio membership coupon."
                          }
                        });
                      }}
                    >
                      Stream Sample
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </section>
           {/* ======================================================================= */}
      {/* 🌟 MEMBERSHIP BENEFITS MODAL OVERLAY LAYOUT BLOCK 🌟 */}
      {/* ======================================================================= */}
      {showMembershipModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          zIndex: 9999999,
          overflowY: 'auto',
          padding: '60px'
        }}>
          {/* Back Navigation Bar */}
          <div style={{ maxWidth: '900px', margin: '0 auto 30px auto' }}>
            <button 
              onClick={() => setShowMembershipModal(false)}
              style={{ background: 'none', border: 'none', color: '#0066c0', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
            >
              &larr; Return to Library Hub
            </button>
          </div>

          {/* Main Content Area */}
          <div style={{ maxWidth: '900px', margin: '0 auto', color: '#111111', textAlign: 'left' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', color: '#ff9900', letterSpacing: '1px' }}>
              Aural Premium Plus
            </span>
            <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0 20px 0', color: '#111111' }}>
              Everything included in your membership plan
            </h1>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '40px', lineHeight: '1.5' }}>
              Explore the exclusive perks that elevate your listening experience. As an active Aural member, you gain access to an unparalleled sound scape designed around your schedule.
            </p>

            {/* Benefits Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '40px' }}>
              
              <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📚</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#111111' }}>1 Credit Every Month</h3>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4', margin: 0 }}>
                  Receive 1 credit per month to buy any book from our entire premium catalog—regardless of its price.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎧</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#111111' }}>The Plus Catalog</h3>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4', margin: 0 }}>
                  Listen all you want to thousands of included audiobooks, exclusive Aural Originals, and popular podcasts with no credits needed.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🏷️</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#111111' }}>Exclusive 30% Discount</h3>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4', margin: 0 }}>
                  Want more than your monthly choice? Members get an extra flat 30% off any additional cash purchases across the entire store.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#111111' }}>Easy Book Exchanges</h3>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4', margin: 0 }}>
                  Didn't like the narrator or the storyline? Swap any title you bought with a credit easily within 365 days, completely free.
                </p>
              </div>

            </div>

            {/* Premium CTA Panel */}
            <div style={{ background: '#fff9e6', border: '1px dashed #ff9900', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold', color: '#111111' }}>Ready to experience true auditory freedom?</h3>
              <p style={{ fontSize: '14px', color: '#444', marginBottom: '20px' }}>Start your risk-free 30-day trial today. Cancel anytime online.</p>
              <button 
                onClick={() => { setShowMembershipModal(false); setShowTrialPage(true); }}
                style={{ background: '#ff9900', border: '1px solid #d48600', color: '#111', padding: '12px 30px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                Claim Your Free 30-Day Trial
              </button>
            </div>

          </div>
        </div>
      )}
          {/* PAGE 2: PREMIUM SELF DEVELOPMENT PORTAL SECTION */}
          <section id="self-development-section" style={{ maxWidth: '1100px', margin: '60px auto 40px auto', padding: '40px 20px', borderTop: '2px solid #0c0c0c' }}>
            <h1 className="sub-page-title" style={{ fontSize: '32px', fontWeight: '800', color: '#111', marginBottom: '6px' }}>{selfDevelopmentPageContent.title}</h1>
            <p className="sub-page-subtitle" style={{ fontSize: '15px', color: '#555', marginBottom: '35px' }}>{selfDevelopmentPageContent.subtitle}</p>
            
            <div className="pills-row" style={{ display: 'flex', gap: '50px',alignItems: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
              {selfDevelopmentPageContent.pills.map((pill, i) => (
                <span key={i} className="pill-item" style={{ border: '1px solid #bcc8d4', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: '#ffffff' }} onClick={() => setSearchQuery(pill)}>{pill}</span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selfDevelopmentPageContent.books.map((book) => (
                <div key={book.id} className="detailed-book-row-card" style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #eaeaea', padding: '25px 0', alignItems: 'flex-start' }}>
                  <img src={book.image} alt="" className="detailed-cover" style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <div className="detailed-info-panel" style={{ flex: '2' }}>
                    <h3 style={{ fontSize: '18px', color: '#0066c0', margin: '0 0 8px 0', cursor: 'pointer' }} onClick={() => { setCurrentBook(book); setIsPlaying(true); }}>{book.title}</h3>
                    <div style={{ fontSize: '13px', color: '#444', marginBottom: '4px' }}><strong>Author Focus:</strong> {book.author}</div>
                    <div style={{ fontSize: '13px', color: '#777' }}><strong>Audio Playback:</strong> {book.length}</div>
                    <p style={{ fontSize: '13px', color: '#222', marginTop: '10px', lineHeight: '1.4' }}>{book.description}</p>
                  </div>
                  <div className="action-checkout-panel" style={{ flex: '1', textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', marginBottom: '12px' }}>{book.price}</div>
                    <button className="yellow-checkout-btn" style={{ width: '100%', maxWidth: '180px' }} onClick={() => { setCurrentBook(book); setIsPlaying(true); }}>Listen Track</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PAGE 3: ABOUT US PLACEMENT SYSTEM */}
          <section id="about-us-section" style={{ maxWidth: '1100px', margin: '60px auto 60px auto', padding: '40px 20px', borderTop: '2px solid #121010' }}>
            <h1 className="sub-page-title" style={{ fontSize: '32px', fontWeight: '800', color: '#111', marginBottom: '20px' }}>{aboutUsContent.title}</h1>
            <p style={{ fontSize: '16px', fontStyle: 'italic', background: '#f7fafc', padding: '20px', borderLeft: '4px solid #ff9900', color: '#2d3748', lineHeight: '1.6', marginBottom: '40px' }}>
              {aboutUsContent.mission}
            </p>
            
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#111' }}>Milestones Grid</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {aboutUsContent.milestones.map((ms, idx) => (
                <div key={idx} style={{ background: '#fff', border: '1px solid #edf2f7', padding: '20px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontWeight: '800', color: '#ff9900', fontSize: '20px', display: 'block', marginBottom: '6px' }}>{ms.year}</span>
                  <p style={{ fontSize: '13px', color: '#444', margin: 0, lineHeight: '1.4' }}>{ms.event}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🌟 PART B: THE FAQ ACCORDION COMPONENT SECTION */}
          <section className="faq-accordion-section" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '40px', color: '#111' }}>
              Frequently Asked Questions
            </h2>

            <div className="faq-html5-accordion-container" style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              {faqContent.map((faq, i) => (
                <details key={i} style={{ background: '#ffffff', padding: '18px 24px', outline: 'none' }} className="faq-native-node-toggle">
                  <summary style={{ display: 'flex', justifyContent: 'left', textAlign: 'left', alignItems: 'left', fontHeading: '16px', fontWeight: '700', color: '#111', cursor: 'pointer', listStyle: 'none' }}>
                    <span style={{ flex: '1' }}>{faq.question}</span>
                    <span style={{ color: '#5f5a5c', fontSize: '18px', fontWeight: 'normal' }}>▼</span>
                  </summary>
                  <div style={{ marginTop: '14px', fontSize: '14px', color: '#4a5568',textAlign:'left', lineHeight: '1.6', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* 🌟 PART C: CLEAN DETAILED PLATFORM FOOTER SECTION */}
          <footer className="audible-exact-footer" style={{ marginTop: '100px', borderTop: '1px solid #e2e8f0', paddingTop: '30px', paddingBottom: '10px', textAlign: 'center' }}>
            <div className="footer-links-inline-row" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: '#0066c0', fontWeight: '600', marginBottom: '20px' }}>
              <span style={{ color: '#31b7ce', fontWeight: 'normal', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</span>
              <span style={{ color: '#31b7ce', fontWeight: 'normal', cursor: 'pointer' }} onClick={() => document.getElementById('about-us-section').scrollIntoView({ behavior: 'smooth' })}>About Us</span>
              <span style={{ color: '#31b7ce', fontWeight: 'normal' }}>Conditions of Use</span>
              <span style={{ color: '#31b7ce', fontWeight: 'normal' }}>Privacy Notice</span>
              <span style={{ color: '#31b7ce', fontWeight: 'normal' }}>Interest-Based Ads</span>
              <span style={{ color: '#31b7ce', fontWeight: 'normal' }}>India (English)</span>
            </div>
            <p style={{ fontSize: '11px', color: '#030303', letterSpacing: '0.3px' }}>
              &copy; Copyright 2026 Aural, Inc | Aural Media Company. All rights reserved.
            </p>
          </footer>
        </div>

      {/* MINI AUDIO PLAYER COMPONENT */}
      {/* ================= STICKY BOTTOM AUDIO PLAYER COMPONENT (WITH DYNAMIC CLOSE CANCEL OPTION) ================= */}
      {currentBook && (
        <div className="mini-player">
          
          {/* Section A: Audio Information Fields Profile Display */}
          <div className="player-info">
            <img src={currentBook.image} alt="" className="player-cover" />
            <div>
              <div className="player-title">{currentBook.title}</div>
              <div className="player-author">{currentBook.author}</div>
            </div>
          </div>
          
          {/* Section B: Standard Action Trigger Navigation Controls Buttons Icons Grid */}
          <div className="player-controls">
            <button className="control-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={26} /> : <Play size={26} />}
            </button>
            <button className="control-btn"><SkipForward size={22} /></button>
          </div>
          
          {/* Section C: System Volume Indicators Layer alongside Dynamic Close Matrix Node */}
          <div className="player-volume" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <Volume2 size={20} style={{ color: '#99aabb' }} />
            
            {/* 🚨 THE NEW CANCEL/CLOSE MUSIC BUTTON MATRIX (❌) */}
            <button 
              className="player-cancel-close-trigger-x"
              onClick={() => {
                setIsPlaying(false);   // Toggles browser HTML5 background sound instance pause operations first
                setCurrentBook(null);  // Flips the layout conditional engine check pointer to null, destroying player tray visibility instantly!
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff4d4d',       /* Vibrant alarm warning red text color highlight */
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                lineHeight: '1',
                padding: '0 5px',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              title="Close Player Tray"
            >
              &times;
            </button>
          </div>
            
        </div>
      )}

      {/* ======================================================================= */}
      {/* 🌟 THE DYNAMIC OVERLAY BOOK DETAILS PAGE MATRIX LAYOUT BLOCK 🌟 */}
      {/* ======================================================================= */}
      {selectedDetailBook && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          zIndex: 9999999, /* High floating scale ensures stack precedence over Swiper components */
          overflowY: 'auto',
          padding: '60px'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto 30px auto' }}>
            <button 
              onClick={() => setSelectedDetailBook(null)}
              style={{ background: 'none', border: 'none', color: '#0066c0', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
            >
              &larr; Return to Library Hub
            </button>
          </div>

          <div style={{ display: 'flex', gap: '50px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1', minWidth: '280px', textAlign: 'center' }}>
              <img src={selectedDetailBook.image} alt="" style={{ width: '100%', maxWidth: '320px', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }} />
              <button 
                onClick={() => { setCurrentBook(selectedDetailBook); setIsPlaying(true); }}
                style={{ background: '#ff9900', border: '1px solid #d48600', color: '#111', padding: '14px 28px', borderRadius: '24px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '25px', width: '100%', maxWidth: '320px' }}
              >
                ▶ Stream Audio Preview Now
              </button>
            </div>

            <div style={{ flex: '2', minWidth: '340px', color: '#111111', textAlign: 'left' }}>
              <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', color: '#ff9900', letterSpacing: '1px' }}>
                {selectedDetailBook.category}
              </span>
              <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0 15px 0', lineHeight: '1.2' }}>{selectedDetailBook.title}</h1>
              <p style={{ fontSize: '18px', color: '#444', margin: '0 0 25px 0' }}>Written by: <strong style={{ color: '#0066c0' }}>{selectedDetailBook.author}</strong></p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px' }}><strong>Narrated by:</strong> {selectedDetailBook.narrator}</div>
                <div style={{ fontSize: '13px' }}><strong>Playback Duration:</strong> {selectedDetailBook.length}</div>
                <div style={{ fontSize: '13px' }}><strong>Audio Quality:</strong> 128kbps High Definition</div>
                <div style={{ fontSize: '13px' }}><strong>Format:</strong> Digital Audio Stream Partition</div>
              </div>

              {selectedDetailBook.priceStructure && (
                <div style={{ background: '#fff9e6', border: '1px dashed #ff9900', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#d48600', fontSize: '15px', fontWeight: '800' }}>⚡ Special Promotional Offer Price</h4>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#111' }}>{selectedDetailBook.priceStructure.discounted}</span>
                    <span style={{ fontSize: '14px', textDecoration: 'line-through', color: '#888' }}>{selectedDetailBook.priceStructure.original}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#555', fontStyle: 'italic' }}>{selectedDetailBook.priceStructure.membershipBenefit}</p>
                </div>
              )}

              {selectedDetailBook.bundleDeal && (
                <div style={{ background: '#e6f4ea', border: '1px solid #34a853', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#137333', fontWeight: '600', lineHeight: '1.5' }}>
                    {selectedDetailBook.bundleDeal}
                  </p>
                </div>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', borderBottom: '2px solid #ff9900', display: 'inline-block', paddingBottom: '4px' }}>Publisher Summary</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#333' }}>
                {selectedDetailBook.customSummary}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;