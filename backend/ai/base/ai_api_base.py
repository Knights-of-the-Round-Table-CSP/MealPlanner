from abc import ABC, abstractmethod

class AI_API_Client(ABC):
    @abstractmethod
    def fetch_data(self, endpoint, params):
        """Fetch data from the API."""
        pass

    @abstractmethod
    def process_data(self, data):
        """Process the API data."""
        pass