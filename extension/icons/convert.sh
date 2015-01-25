#!/bin/bash

function convert_icon {
  convert ../images/logo.png -resize $1x$1 icon$1.png
}

function convert_icon_disabled {
  convert ../images/logo.png -resize $1x$1 -channel a -evaluate subtract 50% icon$1_disabled.png
}

convert_icon 16
convert_icon 48
convert_icon 128

convert_icon 19
convert_icon 38
convert_icon_disabled 19
convert_icon_disabled 38
