#!/usr/bin/env bash

set -u

workspace="$1"
base_sha="${2:-}"
head_sha="${3:-HEAD}"

mark_affected() {
  set-output affected "true"
}

# Manual runs and first pushes do not have a usable comparison commit.
if [[ -z "$base_sha" || "$base_sha" =~ ^0+$ ]]; then
  echo "No usable base SHA; treating $workspace as affected."
  mark_affected
  exit 0
fi

# Turbo needs connected history to find the merge base between both commits.
if [[ "$(git rev-parse --is-shallow-repository)" == "true" ]]; then
  fetch_args=(--no-tags --unshallow origin "$base_sha" "$head_sha")
else
  fetch_args=(--no-tags origin "$base_sha" "$head_sha")
fi

if ! git fetch "${fetch_args[@]}"; then
  echo "Could not fetch connected history; treating $workspace as affected."
  mark_affected
  exit 0
fi

set +e
npx --yes turbo@2.10.12 query affected \
  --base="$base_sha" \
  --head="$head_sha" \
  --packages "$workspace" \
  --exit-code
status=$?
set -e

case "$status" in
  0) set-output affected "false" ;;
  1) mark_affected ;;
  *)
    echo "Turbo affected detection failed with exit code $status; treating $workspace as affected."
    mark_affected
    ;;
esac
