#!/bin/bash

# `marked` is an npm package
# npm install marked -g

cat readme.md | marked > index.html
