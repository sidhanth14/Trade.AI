# Use an official lightweight Python image.
FROM python:3.10-slim

# Set a working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code.
COPY . .

# Expose the port Cloud Run will use
EXPOSE 8080

# Explicitly set the PORT environment variable (this can be overridden by Cloud Run)
ENV PORT=8080

# Run Uvicorn, reading the PORT variable from the environment.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
