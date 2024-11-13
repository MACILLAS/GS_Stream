FROM python:3.12-slim

WORKDIR /app

# Install system packages and remove cache
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# Copy dependency file first
COPY requirements.txt .

RUN python -m pip install --upgrade pip

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Grant execute permission
RUN chmod +x run.py

# Set environment variables
ENV GS_HOST=0.0.0.0
ENV GS_DEBUG=true

# Run the application
CMD ["python", "run.py"]
