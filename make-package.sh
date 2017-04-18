#!/bin/bash

mkdir -p dist

cd extension

if [ -f "../dist/extension.zip" ]; then
  rm ../dist/extension.zip
fi

zip -r ../dist/extension.zip *
