#!/usr/bin/env bash
set -o errexit

CI_NAME=elif [ "$GITHUB_ACTIONS" != "" ];


echo "#########################################"
echo "Starting ${GITHUB_WORKFLOW}:${GITHUB_ACTION}" 

echo "$GITHUB_RUN_ID"

if [ "$TEST" = "integration" ]; then

  npm test

elif [ "$TEST" = "geth" ]; then

  npx geth-dev-assistant \
    --launch \
    --tag 'latest' \
    --accounts 4 \
    --balance 100 \
    --gasLimit 8000000

  npm test
  docker stop geth-client

elif [ "$TEST" = "colony" ]; then

  npm install -g yarn
  git clone https://github.com/JoinColony/colonyNetwork.git
  cd colonyNetwork || exit
  yarn
  yarn remove -W eth-gas-reporter --dev

  env

  SLUG="$GITHUB_REPOSITORY"
  BRANCH="$GITHUB_REF"

  if [ -n "$GITHUB_HEAD_REF" ]; then
    SLUG="$GITHUB_HEAD_REF"
  fi

  if [ -n "$GITHUB_BASE_REF" ]; then
    BRANCH="$GITHUB_BASE_REF"
  fi

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
  echo "TESTING BRANCH: https://github.com/$SLUG.git#$BRANCH"
  echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

  yarn add -W https://github.com/"$SLUG".git#"$BRANCH"
  git submodule update --init
  yarn run provision:token:contracts
  DEBUG_CODECHECKS_TABLE=true yarn run test:contracts:gasCosts

fi

echo "#########################################"
echo "Completed ${GITHUB_WORKFLOW}:${GITHUB_ACTION}"
#EOF
