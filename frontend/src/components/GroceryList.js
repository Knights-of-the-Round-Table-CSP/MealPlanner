import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/groceryList.css'; 
import recipeApi from '../utils/recipeApi';

async function mockAxiosPost(url, data, config) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data: { response: "Mocked food scan response based on prompt: " + data.get("input_prompt") } });
        }, 500);
    });
}

function GroceryListGenerator() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedRecipeType, setSelectedRecipeType] = useState('breakfast');
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState(""); // Track form validation errors

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleRecipeTypeChanged = (e) => {
        setSelectedRecipeType(e.target.value);
    }

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

        recipeApi.generateNewRecipeFromPicture(selectedRecipeType, selectedFile)
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
                <select 
                    id = "recipe_type_dropdown"
                    value={selectedRecipeType}
                    onChange={handleRecipeTypeChanged}
                    placeholder={"--Select an option--"}
                >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                </select>
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

export default GroceryListGenerator;
