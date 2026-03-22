.PHONY: dev build db-reset up word-memory push

dev:
	cd app && npm run dev

build:
	cd app && npm run build

word-memory:
	cd word-memory && node server.js

up:
	cd app && npm run dev & cd word-memory && node server.js & wait

push:
	git add -A && git commit -m "Update" && git push