import React, { useState } from 'react';
import '../static/groceryList.css'; 

async function mockAxiosPost(url, data, config) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data: { response: "Mocked food scan response based on prompt: " + data.get("input_prompt") } });
        }, 500);
    });
}

function GroceryListGenerator() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState(""); // Track form validation errors

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

        const formData = new FormData();
        formData.append("uploaded_file", selectedFile);
        formData.append("input_prompt", prompt); // Prompt can be empty, so no validation for it

        try {
            // Simulate the network request with mock data
            const result = await mockAxiosPost("http://127.0.0.1:8000/scan-food/", formData);
            setResponse(result.data.response); // Update the response with the mock result
            // Reset the state so the user can input new data
            setSelectedFile(null); // Clear the file input
            setPrompt(""); // Clear the prompt input
        } catch (error) {
            console.error("Error scanning food:", error);
            setResponse("An error occurred.");
        }
    };

    return (
        <div class="box">
            <div className='groceryListContainer'>
                <h2>Grocery List Generation</h2>
                <br /><br />
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    key={selectedFile ? selectedFile.name : ""}
                />
                <input
                    type="text"
                    placeholder="Enter some instructions if required"
                    value={prompt}
                    onChange={handlePromptChange}
                />
                <button onClick={handleSubmit}>Scan Food</button>

                {/* Display error message if image is missing */}
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

                {response && (
                    <div>
                        <br /><br />
                        <h2>Grocery List</h2>
                        <p>{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GroceryListGenerator;
