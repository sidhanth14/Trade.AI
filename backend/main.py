# # python-backend/main.py

from typing import List
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import datetime
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
import jwt
from passlib.context import CryptContext
from db import create_user, get_user_by_email, create_query, get_queries_for_user
from ai import ai_response

# # Create the FastAPI instance
# app = FastAPI()



# # Enable CORS (so Next.js frontend at localhost:3000 can talk to this API at localhost:8000)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # or specify ["http://localhost:3000"] for tighter security
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Define a request body schema using Pydantic
# class AIRequest(BaseModel):
#     text: str

# @app.get("/")
# def read_root():
#     return {"message": "Hello from Python + FastAPI backend!"}


# main.py

import os
import datetime
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
import jwt
from passlib.context import CryptContext
from db import create_user, get_user_by_email, create_query

# Secret key and settings (ideally, put SECRET_KEY in your .env)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Enable CORS (so Next.js frontend at localhost:3000 can talk to this API at localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://localhost:3000"] for tighter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta if expires_delta else datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

# Pydantic models for authentication
class UserAuth(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# Pydantic model for storing a query (no user_id here because we get that from the token)
class QueryCreateModel(BaseModel):
    request_text: str
    recommendation: str

class QueryResponse(BaseModel):
    id: str
    request_text: str
    recommendation: str
    timestamp: datetime.datetime

class PastQueriesResponse(BaseModel):
    queries: List[QueryResponse]


# SIGN-UP Endpoint
@app.post("/auth/signup", response_model=TokenResponse)
def signup(user: UserAuth):
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user_data = {
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.datetime.utcnow()
    }
    try:
        user_id = create_user(user_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    token_data = {"sub": user_id, "email": user.email}
    token = create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}

# LOGIN Endpoint
@app.post("/auth/login", response_model=TokenResponse)
def login(user: UserAuth):
    existing_user = get_user_by_email(user.email)
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not verify_password(user.password, existing_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token_data = {"sub": existing_user["id"], "email": user.email}
    token = create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}

# Dependency to get current user from token in the Authorization header
def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = get_user_by_email(payload.get("email"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Protected endpoint for storing queries (user must be logged in)
@app.post("/queries/")
def add_query(query: QueryCreateModel, current_user: dict = Depends(get_current_user)):
    query_data = {
        "user_id": current_user["id"],
        "request_text": query.request_text,
        "recommendation": query.recommendation,
        "timestamp": datetime.datetime.utcnow()
    }
    try:
        query_id = create_query(query_data)
        return {"query_id": query_id, "user_id": current_user["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Example AI endpoint (also protected)
class AIRequest(BaseModel):
    text: str

@app.post("/api/ai")
def ai_endpoint(req: AIRequest, current_user: dict = Depends(get_current_user)):
    user_input = req.text
    response = ai_response(user_input)
    user_input = req.text
    response = ai_response(user_input)  # Generate AI response

    # Store query automatically in Firestore
    query_data = {
        "user_id": current_user["id"],
        "request_text": user_input,
        "recommendation": response,
        "timestamp": datetime.datetime.utcnow(),
    }
    try:
        query_id = create_query(query_data)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"response": response}


# GET endpoint to retrieve past queries for the authenticated user
@app.get("/queries/", response_model=PastQueriesResponse)
def get_past_queries(current_user: dict = Depends(get_current_user)):
    try:
        queries = get_queries_for_user(current_user["id"])
        return {"queries": queries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






