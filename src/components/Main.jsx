import React, { useContext, useState, useEffect } from "react";
import './Main.css';
import { Context } from "../Context/Context";

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const handleGlobalKeyPress = (event) => {
            if (event.key === 'Enter' && !isListening) {
                sendPrompt();
            }
        };

        window.addEventListener('keypress', handleGlobalKeyPress);

        return () => {
            window.removeEventListener('keypress', handleGlobalKeyPress);
        };
    }, [input, isListening]);

    useEffect(() => {
        if (isListening) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();

            return () => {
                recognition.stop();
            };
        }
    }, [isListening, setInput]);

    const handleMicClick = () => {
        setIsListening(true);
    };

    const sendPrompt = () => {
        if (input.trim() !== "") {
            onSent(input);
            setInput("");
        }
    };

    return (
        <div className="main">
            <div className="nav">
                <p>Chatty A.I</p>
                <img src="https://i.ibb.co/4W6Qyvf/logo.jpg" alt="Logo" />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello Boss 👋!</span></p>
                            <p>How Can I Help You Today?</p>
                        </div>
                        <div className="cards">
                            <div className="card">
                                <p>Suggest Beautiful Places To See On An Upcoming Road Trip</p>
                                <img src="https://i.ibb.co/CVctHqx/compass.png" alt="Compass" />
                            </div>
                            <div className="card">
                                <p>Briefly Summarize The Concept of Budget</p>
                                <img src="https://i.ibb.co/WcpyFZ5/money.png" alt="Money" />
                            </div>
                            <div className="card">
                                <p>Brainstorm Team Bonding Activities For Our Work Retreat</p>
                                <img src="https://i.ibb.co/56HHV81/message.png" alt="Message" />
                            </div>
                            <div className="card">
                                <p>Improve The Readability of the Following Code</p>
                                <img src="https://i.ibb.co/hHRF42w/code.png" alt="Code" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="result">
                        <div className="result-title">
                            <img src="https://i.postimg.cc/0QbmR2DK/user.png" alt="User" />
                            <p>{recentPrompt}</p>
                        </div>
                        <hr />
                        <div className="result-data">
                            <img src="https://i.ibb.co/4W6Qyvf/logo.jpg" alt="Logo" />
                            {loading ? (
                                <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search-box">
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder={isListening ? "Please Speak, I am listening" : "Ask Me Anything 😉"} 
                            disabled={isListening}
                        />
                        <div>
                            {isListening ? (
                                <img src="https://i.ibb.co/mDbCKqQ/microphone.png" alt="Microphone" />
                            ) : (
                                <>
                                    <img src="https://i.ibb.co/mDbCKqQ/microphone.png" alt="Microphone" onClick={handleMicClick} />
                                    <img src="https://i.ibb.co/X51xKw9/send.png" alt="Send Button" onClick={sendPrompt} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
