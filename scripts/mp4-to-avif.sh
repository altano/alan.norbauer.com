#!/usr/bin/env bash

# https://github.com/tuffstuff9/mp4-to-avif/blob/main/mp4_to_avif.sh

if [ -z "$1" ]; then
  echo "Please provide the input mp4 file name."
  exit 1
fi

if [ -z "$2" ]; then
  echo "Please provide the OUTPUT avif file name."
  exit 1
fi

if [ ! -f "$1" ]; then
  echo "File $1 does not exist."
  exit 1
fi

# max-width: 320
# max-height: -
ffmpeg -i "$1" -vf "scale='min(320,iw)':-1" "$2"
if [ $? -ne 0 ]; then
  echo "Error converting to avif."
  exit 1
fi

echo "Conversion successful. Result saved as $2."
