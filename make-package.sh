#!/bin/bash

mkdir -p dist

cd extension

rm ../dist/extension.zip

zip -r ../dist/extension.zip *
