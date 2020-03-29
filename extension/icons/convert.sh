#!/bin/bash

IMAGE_FILE=$(dirname $0)/../images/logo.png
TARGET_DIR=$1

function convert_icon {
  convert $IMAGE_FILE -resize $1x$1 $TARGET_DIR/icon$1.png
}

function convert_icon_disabled {
  convert $IMAGE_FILE -resize $1x$1 -channel a -evaluate subtract 50% $TARGET_DIR/icon$1_disabled.png
}

function convert_icon_chromestore {
  convert $IMAGE_FILE -resize 96x96 -bordercolor none -border 16 $TARGET_DIR/icon128_chromestore.png
}

mkdir -p $TARGET_DIR

convert_icon 16
convert_icon 48
convert_icon 128

convert_icon 19
convert_icon 38
convert_icon_disabled 19
convert_icon_disabled 38

convert_icon_chromestore
