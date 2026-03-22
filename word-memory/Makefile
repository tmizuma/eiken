.PHONY: dev sql

dev:
	npm run dev

sql:
	@sqlite3 app.db "$(filter-out $@,$(MAKECMDGOALS))"

%:
	@:
