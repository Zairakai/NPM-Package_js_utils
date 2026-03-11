#!/usr/bin/env bats
#
# Unit Tests — Package Structure
# Verifies required files are present and package is correctly configured.
#

load '../helpers/test_helper'

setup() {
    setup_test_env
}

teardown() {
    teardown_test_env
}

# ============================================================================
# Root config files
# ============================================================================

@test ".gitlab-ci.yml exists" {
    assert_file_exists "${PROJECT_ROOT}/.gitlab-ci.yml"
}

@test "Makefile exists" {
    assert_file_exists "${PROJECT_ROOT}/Makefile"
}

@test ".editorconfig exists" {
    assert_file_exists "${PROJECT_ROOT}/.editorconfig"
}

@test "tsconfig.json exists (root bridge)" {
    assert_file_exists "${PROJECT_ROOT}/tsconfig.json"
}

# ============================================================================
# Shared config files (config/dev-tools/)
# ============================================================================

@test "config/dev-tools/tsconfig.json exists" {
    assert_file_exists "${PROJECT_ROOT}/config/dev-tools/tsconfig.json"
}

@test "config/dev-tools/tsup.config.js exists" {
    assert_file_exists "${PROJECT_ROOT}/config/dev-tools/tsup.config.js"
}

@test "config/dev-tools/vitest.config.js exists" {
    assert_file_exists "${PROJECT_ROOT}/config/dev-tools/vitest.config.js"
}

@test "config/dev-tools/eslint.config.js exists" {
    assert_file_exists "${PROJECT_ROOT}/config/dev-tools/eslint.config.js"
}

@test "config/dev-tools/prettier.config.js exists" {
    assert_file_exists "${PROJECT_ROOT}/config/dev-tools/prettier.config.js"
}

# ============================================================================
# npm — no yarn
# ============================================================================

@test "yarn.lock does not exist" {
    run test -f "${PROJECT_ROOT}/yarn.lock"
    [ "$status" -ne 0 ]
}

# ============================================================================
# src/ entry points
# ============================================================================

@test "src/index.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/index.ts"
}

@test "src/validators.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/validators.ts"
}

@test "src/formatters.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/formatters.ts"
}

@test "src/datetime.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/datetime.ts"
}

@test "src/arrays.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/arrays.ts"
}

@test "src/collections.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/collections.ts"
}

@test "src/php-arrays.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/php-arrays.ts"
}

@test "src/schemas.ts exists" {
    assert_file_exists "${PROJECT_ROOT}/src/schemas.ts"
}

# ============================================================================
# package.json
# ============================================================================

@test "package.json includes dist/ in files[]" {
    run grep -q '"dist"' "${PROJECT_ROOT}/package.json"
    [ "$status" -eq 0 ]
}

@test "package.json includes src/ in files[]" {
    run grep -q '"src"' "${PROJECT_ROOT}/package.json"
    [ "$status" -eq 0 ]
}

@test "package.json has publishConfig access public" {
    run grep -q '"access": "public"' "${PROJECT_ROOT}/package.json"
    [ "$status" -eq 0 ]
}

@test "package.json uses @zairakai/js-utils" {
    run grep -q '"@zairakai/js-utils"' "${PROJECT_ROOT}/package.json"
    [ "$status" -eq 0 ]
}

# ============================================================================
# .gitlab-ci.yml
# ============================================================================

@test ".gitlab-ci.yml includes pipeline-js-package.yml" {
    run grep -q 'pipeline-js-package.yml' "${PROJECT_ROOT}/.gitlab-ci.yml"
    [ "$status" -eq 0 ]
}

@test ".gitlab-ci.yml does not use ref: main" {
    run grep -q 'ref: main' "${PROJECT_ROOT}/.gitlab-ci.yml"
    [ "$status" -ne 0 ]
}

@test ".gitlab-ci.yml sets NPM_PACKAGE_NAME" {
    run grep -q 'NPM_PACKAGE_NAME' "${PROJECT_ROOT}/.gitlab-ci.yml"
    [ "$status" -eq 0 ]
}
