import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../static/recipeGenerator.css'; 
import recipeApi from '../utils/recipeApi';

async function mockAxiosPost(url, data, config) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data: { response: "Mocked food scan response based on prompt: " + data.get("input_prompt") } });
        }, 500);
    });
}

function RecipeGenerator() {
    const { type } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState(""); // Track form validation errors

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleSubmit = async () => {
        // Clear previous errors
        setError("");

        if (!selectedFile) {
            setError("Please provide an image.");
            return; // Do not proceed if no image is provided
        }

        recipeApi.generateNewRecipeFromPicture(type, selectedFile, prompt)
            .then(response => {
                if(!response){
                    console.error("Error scanning food, no response");
                    setResponse("Error scanning food, no response");
                }

                let {id} = response.data

                if (id)
                    navigate(`/recipe/${id}`)
                else{
                    console.error("Error scanning food, no id in response");
                    setResponse("Error scanning food, no id in response");
                }
            })
            .catch(error => {
                console.error("Error scanning food:", error);
                setResponse("An error occurred.");
            })
            .finally(() => {
                setSelectedFile(null);
                setPrompt("");
            });
    };

    return (
        <div className="box">
            <div className='groceryListContainer'>
                <h2>Grocery List Generation</h2>
                <br /><br />
                { selectedFile === null 
                ?
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        key={"files_to_scan"}
                    />
                :
                    <p> Selected {selectedFile.name} </p>
                }
                <input
                    type="text"
                    placeholder="Enter some instructions if required"
                    value={prompt}
                    onChange={handlePromptChange}
                />
                <button onClick={handleSubmit}>Generate recipe</button>

                {/* Display error message if image is missing */}
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

                {response && (
                    <div>
                        <br /><br />
                        <h2>Recipe</h2>
                        <p>{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeGenerator;
