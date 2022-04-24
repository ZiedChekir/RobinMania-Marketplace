import { useState } from 'react'

export default () => {

  const [state, setState] = useState(false)

  // Replace javascript:void(0) path with your path
  const navigation = [
      { title: "Home", path: "/" },
      { title: "Collection", path: "/collection" },
      { title: "Guides", path: "javascript:void(0)" },
      { title: "Partners", path: "javascript:void(0)" }
  ]

  return (
      <nav className="nav-primary">
          <div className="nav-container">
              <div className="brand">
                    <a href="javascript:void(0)">
                        <img
                            src="https://www.floatui.com/logo.svg" 
                            width={120} 
                            height={50}
                            alt="Float UI logo"
                        />
                    </a>
                  <div className="menu-btn">
                      <button
                          onClick={() => setState(!state)}
                      >
                          {
                              state ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                              ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                  </svg>
                              )
                          }
                      </button>
                  </div>
              </div>
              <div className={`nav-items ${ state ? '' : 'hide-nav'}`}>
                  <ul>
                      {
                          navigation.map((item, idx) => {
                              return (
                                <li key={idx} className="nav-item">
                                    <a href={item.path}>
                                        { item.title }
                                    </a>
                                </li>
                              )
                          })
                      }
                  </ul>
              </div>
              <div className="get-started-link">
                <a>
                    Get Started
                </a>
              </div>
          </div>
      </nav>
  )
}
