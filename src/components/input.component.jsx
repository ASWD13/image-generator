import React, { useState } from 'react';
import "./input.component.css";
import FadeLoader from 'react-spinners/FadeLoader'; 


const apiKey = process.env.REACT_APP_API_KEY; 

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Input = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [prompt, setPrompt] = useState("");

    const generateImages = async () => {
        if (prompt.trim() === "") {
            alert("Enter Prompt Before Generating..");
            return;
        }

        setLoading(true);
        setImageUrls([]);

        const newImageUrls = [];
        const maxImages = 6;
        for (let i = 0; i < maxImages; i++) {
            try {
                const randomNumber = getRandomNumber(1, 10000);
                const promptWithRandomNumber = `${prompt} ${randomNumber}`;
                
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({ inputs: promptWithRandomNumber }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to generate image.');
                }

                const blob = await response.blob();
                const imgUrl = URL.createObjectURL(blob);
                newImageUrls.push(imgUrl);

            } catch (error) {
                console.error("Error generating image:", error);
                alert("Failed to generate image. Please try again.");
                setLoading(false);
                return;
            }
        }

        setImageUrls(newImageUrls);
        setLoading(false);
    };

    const handleGenerateClick = () => {
        generateImages();
    };

    return (
        <div className="container">

            <h1 className='text-center'>
                Get Your <br/><b>AI Generated Image</b> <br/>In Seconds
            </h1>

            <form className="gen-form" onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="text" 
                    id="user-prompt" 
                    placeholder="Enter Prompt Here.." 
                    autoComplete="off" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="button" id="generate" onClick={handleGenerateClick} disabled={loading}>
                    {loading ? "Generating.." : "Generate"}
                </button>
            </form>

            <div className="result">
            {loading && (
    <div>
        <p>Generating..</p>
        <FadeLoader color="#39DFEB" loading={loading} size={55} />
    </div>
)}                <div id="image-grid">
                    {imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`art-${index + 1}`}
                            style={{ cursor: 'pointer'}}
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `image-${index + 1}.jpg`;
                                link.click();
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
        
    );
};

export default Input;
