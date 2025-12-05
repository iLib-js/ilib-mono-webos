#!/bin/bash

: <<'END'
DIR = /home/goun/Source/swp/localization-data
CONFIG = /home/goun/Source/swp/lintScript/ilib-lint-config.json
LINTPATH = /home/goun/Source/ilib-samples/lint-webos/node_modules/ilib-lint
OUTPUTPATH = /home/goun/Source/swp/lintResult-swp

./execute.sh ~/Source/swp/localization-data/ /home/goun/Source/ilib-mono-webos2/packages/samples-lint/ilib-lint-config.json /home/goun/Source/ilib-mono-webos2/packages/samples-lint/node_modules/ilib-lint/src/index.js /home/goun/Source/ilib-mono-webos2/packages/samples-lint/lintResult-swp-json
END

SAVEIFS=$IFS
IFS=$(echo -en "\n\b")

DIR=${1?param missing - Specify the localization-data path }
CONFIG=${2?param missing - Specify the ilib-llint-config.json file path }
LINTPATH=${3?param missing - Specify the path where the lint tool is intalled }
OUTPUTPATH=${4?param missing - Specify the path where the output results will be located }

cd $DIR
echo $PWD
appCnt=0
invalidCnt=0
START_TIME=$(date +%s)
arrInvalidDir=()

if [ ! -d "$OUTPUTPATH" ]; then
  mkdir -p "$OUTPUTPATH"
fi

for appDir in $(find . -type d); do
  if [ "$appDir" == "." ]; then
    arrInvalidDir+=("$appDir")
  elif [[ "$appDir" == *"/.git"* ]]; then
    # Skip the .git directory and all of its subfolders.
    arrInvalidDir+=("$appDir")
    continue
  else
    cd "$appDir" || continue
    appCnt=$((appCnt + 1))
    echo "<<< ($appCnt) $appDir >>>"
    node "$LINTPATH" -c "$CONFIG" -i -f webos-json-formatter -o "$OUTPUTPATH/$appDir-result.json" -n "$appDir"
    cd - >/dev/null || exit
    echo "==========================================================================="
  fi
done

echo "---------------------------------------------------------------------------"
echo "[[ "Number of invalid Directory":" ${#arrInvalidDir[@]} " ]]"
for value in "${arrInvalidDir[@]}"
do
  echo "[" $value "] "
done

END_TIME=$(date +%s)
echo "[[ "Number of valid Directory":" $appCnt " ]]"
echo "<<< It took $(($END_TIME - $START_TIME)) seconds to check xliff files of all app ... >>>"
echo "---------------------------------- Done ----------------------------------"

#restore $IFS(Internal Field Separator)
IFS=$SAVEIFS