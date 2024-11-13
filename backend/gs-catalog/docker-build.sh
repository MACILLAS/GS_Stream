#!/bin/bash

# Set variables
IMAGE_NAME="webinspector-gs-catalog"
USERNAME=$GITHUB_USERNAME  # GitHub Username
TAG="latest"

# Enable buildx for multi-platform builds (not needed if already enabled)
docker buildx create --use

# Single-architecture image build (e.g., for the local environment)
docker build -t ghcr.io/$USERNAME/$IMAGE_NAME:$TAG .