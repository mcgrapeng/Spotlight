.PHONY: help install dev build up down logs clean

help:
	@echo "k8s-viewer — Teleport-aware K8s pod viewer"
	@echo ""
	@echo "  make install    安装后端 + 前端依赖"
	@echo "  make dev        本地启动 (后端 8000 / 前端 5173)"
	@echo "  make build      生产构建"
	@echo "  make up         Docker Compose 启动"
	@echo "  make down       Docker Compose 停止"
	@echo "  make logs       查看容器日志"

install:
	cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

dev:
	@echo "启动后端: cd backend && uvicorn app.main:app --reload --port 8000"
	@echo "启动前端: cd frontend && npm run dev"
	@echo "前置: tsh login + tsh kube login (tsh 会写入 kubeconfig)"

build:
	cd frontend && npm run build
	cd backend && pip install --target ./build .

up:
	docker compose up -d --build
	@echo "等待启动..."
	@sleep 3
	@curl -fsS http://localhost:8000/healthz && echo " ✓ backend ok" || echo " ✗ backend failed"
	@echo "UI: http://localhost:5173"

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	rm -rf backend/.venv backend/build backend/data backend/__pycache__
	rm -rf frontend/node_modules frontend/dist
	find . -type d -name __pycache__ -exec rm -rf {} +
