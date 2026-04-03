.PHONY: dev build db-reset up word-memory push

dev:
	cd app && npm run dev

build:
	cd app && npm run build

word-memory:
	cd word-memory && node server.js

up:
	cd app && npm run dev & cd word-memory && node server.js & wait

build-amplify:
	cd app && DB_READONLY=true npm run build
	@STANDALONE_APP_DIR=$$(find app/.next/standalone -name "server.js" -not -path "*/node_modules/*" -exec dirname {} \;) && \
		STANDALONE_ROOT=$$(cd "$$STANDALONE_APP_DIR/.." && pwd) && \
		mkdir -p "$$STANDALONE_ROOT/db" && \
		cp db/master.db "$$STANDALONE_ROOT/db/master.db" && \
		cp -r app/.next/static "$$STANDALONE_APP_DIR/.next/static" && \
		(test -d app/public && cp -r app/public "$$STANDALONE_APP_DIR/public" || true)

push:
	git add -A && git commit -m "Update" && git push