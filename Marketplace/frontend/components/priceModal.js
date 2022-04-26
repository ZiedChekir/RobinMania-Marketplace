import { useState } from "react"

export default () => {

    const [state, setState] = useState(true)

    return (
        state ? (
            <div className="modal-success">
                <div className="modal-cover" onClick={() => setState(false)}></div>
                <div className="modal-container">
                    <div className="modal">
                        <div className="modal-header">
                            <div className="modal-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="modal-details">
                                <h4>
                                    Successfully accepted!
                                </h4>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc eget lorem dolor sed viverra ipsum nunc. Consequat id porta nibh venenatis.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-primary"
                                onClick={() => setState(false)}
                            >
                                Dashboard
                            </button>
                            <button className="btn-secondary"
                                onClick={() => setState(false)}
                            >
                                Undo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : ''
    )
}
