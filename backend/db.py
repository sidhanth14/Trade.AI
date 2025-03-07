# db.py
from google.cloud import firestore
from google.api_core.exceptions import GoogleAPICallError

db = firestore.Client()


def get_queries_for_user(user_id: str) -> list:
    """
    Fetch all queries for the given user_id.
    Returns a list of dictionaries.
    """
    try:
        queries_ref = db.collection("queries").where("user_id", "==", user_id)
        results = []
        for doc in queries_ref.stream():
            data = doc.to_dict()
            data["id"] = doc.id
            results.append(data)
        return results
    except GoogleAPICallError as e:
        raise Exception(f"Error fetching queries: {e}")

def create_user(user_data: dict) -> str:
    """
    Create a new user in the 'users' collection.
    Returns the new user's document ID.
    """
    try:
        doc_ref = db.collection("users").document()
        doc_ref.set(user_data)
        return doc_ref.id
    except GoogleAPICallError as e:
        raise Exception(f"Error creating user: {e}")

def get_user_by_email(email: str) -> dict:
    """
    Retrieve a user by email.
    Returns the user document as a dict if found, else None.
    """
    try:
        users_ref = db.collection("users")
        query = users_ref.where("email", "==", email).limit(1).stream()
        for doc in query:
            user_data = doc.to_dict()
            user_data["id"] = doc.id
            return user_data
        return None
    except GoogleAPICallError as e:
        raise Exception(f"Error fetching user: {e}")

def create_query(query_data: dict) -> str:
    """
    Create a new query record.
    Returns the new query document ID.
    """
    try:
        doc_ref = db.collection("queries").document()
        doc_ref.set(query_data)
        return doc_ref.id
    except GoogleAPICallError as e:
        raise Exception(f"Error creating query: {e}")
