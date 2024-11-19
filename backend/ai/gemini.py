import google.generativeai as genai
import os
from .base.ai_api_base import *
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-1.5-flash"
RECIPE_MODEL_NAME = "gemini-1.5-flash"
CHAT_MODEL_NAME = "gemini-1.5-flash"

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
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(message)
        return str(response.text)
    
    def send_recipe_prompt(self, message):
        
        config = {
            "temperature": 1.5,
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
            do not use ```json annotation!
            """

        model = genai.GenerativeModel(
            model_name=RECIPE_MODEL_NAME,
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
            Use possible ingredients from the picture.

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
            do not use ```json annotation!
            """

        model = genai.GenerativeModel(
            model_name=RECIPE_MODEL_NAME,
            generation_config=config,
            system_instruction=instruction,
        )
        
        file = genai.upload_file(picture)
        response = model.generate_content([file, message])
        file.delete()

        return str(response.text)

    def send_chat_message(self, message, message_history, recipe):

        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1000,
            "response_mime_type": "text/plain",
        }

        instruction = """
            You are helping with cooking.
            The user has a food recipe and he needs a help with cooking it.
            If user asks something not about cooking, you answer 'I cannot provide this information.'
            Do not use any annotations, like ** for bold.
            Answer with rather short messages, like a chatbot.

            The recipe is:

            """
        instruction += recipe

        model = genai.GenerativeModel(
            model_name=CHAT_MODEL_NAME,
            generation_config=generation_config,
            system_instruction=instruction,
        )

        messages = [{"role": m["role"], "parts": m["message"]} 
                    for m in message_history]

        chat_session = model.start_chat(history=messages)
        response = chat_session.send_message(message)

        return str(response.text)