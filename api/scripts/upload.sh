#!/bin/bash
for filepath in $(find photos -type f)
do
  curl -F photo=@${filepath} http://localhost:8000/upload
done;