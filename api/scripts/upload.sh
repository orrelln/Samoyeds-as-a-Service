#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
for filename in $(ls photos)
do
  curl -F photo=@photos/$filename http://localhost:8000/upload
done;