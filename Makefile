install:
	npm ci

build:
	rm -rf dist
	npx webpack --mode production

dev:
	rm -rf dist
	npx webpack --mode development

start:
	npx webpack serve --open

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

.PHONY: test