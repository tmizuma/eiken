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

db-reset:
	rm -f db/master.db
	mkdir -p db
	sqlite3 db/master.db < schema.sql
	for f in seed/words/*.sql; do sqlite3 db/master.db < "$$f"; done
	for f in seed/relations/*.sql; do sqlite3 db/master.db < "$$f"; done
	for f in seed/reading_comprehension/*.sql; do sqlite3 db/master.db < "$$f"; done
