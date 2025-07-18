#!/bin/bash

find packages -name 'package.json' -execdir npx npm-check-updates -u --dep prod,peer \;