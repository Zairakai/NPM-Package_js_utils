# Default Makefile delegating to the shared core tooling.

NPM_DIRECTORY_TOOLS_PROJECT_NAME := "Helpers"

NPM_DIRECTORY_TOOLS_PROJECT_ROOT := $(shell pwd)

include node_modules/@zairakai/js-dev-tools/tools/make/core.mk
