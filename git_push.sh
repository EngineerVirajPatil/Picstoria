#!/bin/bash

# Script to automate git push

# Define default commit message
default_message="Quick commit: $(date)"

# Check if the working directory is clean
if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to commit. Working directory is clean."
  exit 0
fi

# Stage all changes
echo "Staging all changes..."
git add .

# Check if a commit message was passed as an argument
if [ -z "$1" ]; then
  commit_message="$default_message"
else
  commit_message="$1"
fi

# Commit the changes
echo "Committing changes..."
git commit -m "$commit_message"

# Push to the remote repository
echo "Pushing to remote repository..."
git push origin master

# Confirmation
if [ $? -eq 0 ]; then
  echo "Code pushed to remote repository successfully!"
else
  echo "Failed to push code. Please check for errors."
fi
