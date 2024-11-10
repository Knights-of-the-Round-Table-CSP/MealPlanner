import google.generativeai as genai
import os
from .base.ai_api_base import *
from dotenv import load_dotenv

load_dotenv()

class GeminiAPI(AI_API_Client):
    def __init__(self):
        api_key = os.getenv("API_KEY")  # Use the variable name defined in .env
        genai.configure(api_key=api_key)

    def fetch_data(self, endpoint, params):
        """Fetch data from the API."""
        pass

    def process_data(self, data):
        """Process the API data."""
        pass

    def send_prompt(self, message):
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(message)
        return str(response.text)
    
    def send_configured_prompt(self, message, config=None, instruction=""):

        if config is None:
            config = {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
                "response_mime_type": "text/plain",
            }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=config,
            system_instruction=instruction,
        )
        
        response = model.generate_content(message)
        return str(response.text)
    
    def send_recipe_prompt(self, message):
        
        config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        instruction = """
            You are a recipe addviser. 
            You are answering only with recipes in JSON format. 
            do not use ```json annotation.
            If you cannot answer with a recipe, you say 'I cannot provide this information.'

            All recipes should be in this format:

            {
                "name": "Recipe Name",
                "preparation_time": "30", // always in minutes
                "description": "A short description of the recipe, including flavors, origin, or ideal occasions.",
                "ingredients": [
                    {
                        "name": "Ingredient 1",
                        "quantity": "1.5",
                        "unit": "cup"
                    },
                    {
                        "name": "Ingredient 2",
                        "quantity": "2.0",
                        "unit": "tablespoon"
                    }
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Preheat the oven to 180°C (350°F)."
                    },
                    {
                        "step_number": 2,
                        "instruction": "Mix the flour and sugar in a large bowl."
                    }
                ]
            }

            where quantity is a valid number with decimals, do not use 1/2, use 0.5
            """

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=config,
            system_instruction=instruction,
        )
        
        response = model.generate_content(message)
        return str(response.text)
    
    def send_recipe_picture_prompt(self, message, picture):
        
        config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        instruction = """
            You are a recipe addviser. 
            You are answering only with recipes in JSON format. 
            do not use ```json annotation.
            If you cannot answer with a recipe, you say 'I cannot provide this information.'

            All recipes should be in this format:

            {
                "name": "Recipe Name",
                "preparation_time": "30", // always in minutes
                "description": "A short description of the recipe, including flavors, origin, or ideal occasions.",
                "ingredients": [
                    {
                        "name": "Ingredient 1",
                        "quantity": "1.5",
                        "unit": "cup"
                    },
                    {
                        "name": "Ingredient 2",
                        "quantity": "2.0",
                        "unit": "tablespoon"
                    }
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Preheat the oven to 180°C (350°F)."
                    },
                    {
                        "step_number": 2,
                        "instruction": "Mix the flour and sugar in a large bowl."
                    }
                ]
            }

            where quantity is a valid number with decimals, do not use 1/2, use 0.5
            """

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=config,
            system_instruction=instruction,
        )
        
        file = genai.upload_file(picture)
        response = model.generate_content([file, message])
        file.delete()

        return str(response.text)



