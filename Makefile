.PHONY: help dev-frontend dev-backend dev

help:
	@echo "Available commands:"
	@echo "  make dev-frontend    - Starts the frontend development server (Vite)"
	@echo "  make dev-backend     - Starts the backend development server (Uvicorn with reload)"
	@echo "  make dev             - Starts both frontend and backend development servers"

# 8080
dev-frontend:
	@echo "Starting frontend development server..."
	cd frontend && npm install && npm run dev

# 8000
dev-backend:
	@echo "Starting backend development server..."
	cd backend && uvicorn main:app --reload --port 8000

dev:
	@echo "Starting both frontend and backend development servers..."
	$(MAKE) dev-frontend & $(MAKE) dev-backend
