import { useState } from 'react'
import background from "/public/background.mp4";

const Hero= () => {

    const [state, setState] = useState(false)

  
    return (
        <>
            <section className="hero-primary">
            <video autoPlay loop muted
            style={{ position:"absolute",
            width:"100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit:"cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-1"
            }}>
                <source src={background} type="video/mp4" />
            </video>
                <div className="hero-details">
                    <h1>
                        Explore
                         <span> Robin Mania</span>
                    </h1>
                    <p>
                        A world full of adventures and mysteries
                    </p>
                </div>
                <div className="hero-btns">
                    <a href="javascript:void(0)" className="btn-primary">
                        Play now
                    </a>
                    <a href="javascript:void(0)" className="btn-secondary">
                        Discover more
                    </a>
                </div>
            </section>
        </>
    )
}

export default Hero;
