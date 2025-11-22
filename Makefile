.PHONY: test-engine

test-engine:
	docker run --rm -it \
		-v $(PWD)/engine:/app \
		-v /app/node_modules \
		mihoow/engine