.PHONY: dev build db-reset

dev:
	cd app && npm run dev

build:
	cd app && npm run build

db-reset:
	rm -f db/master.db
	mkdir -p db
	sqlite3 db/master.db < schema.sql
	for f in seed/words/*.sql; do sqlite3 db/master.db < "$$f"; done
	for f in seed/relations/*.sql; do sqlite3 db/master.db < "$$f"; done
	for f in seed/reading_comprehension/*.sql; do sqlite3 db/master.db < "$$f"; done
