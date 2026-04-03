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
	mv app/src/app/api app/src/app/_api_disabled
	cd app && STATIC_EXPORT=true npm run build || (mv app/src/app/_api_disabled app/src/app/api && exit 1)
	mv app/src/app/_api_disabled app/src/app/api

push:
	git add -A && git commit -m "Update" && git push