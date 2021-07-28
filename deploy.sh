#!/bin/bash

if [[ -z $JOBTRACKER_DEPLOY_PATH ]]; then
  echo "JOBTRACKER_DEPLOY_PATH env variable not set, not deploying"
else
  if [[ -d $JOBTRACKER_DEPLOY_PATH ]]; then
    if [[ -w $JOBTRACKER_DEPLOY_PATH ]]; then
      echo "Deploying app to '$JOBTRACKER_DEPLOY_PATH'..."
      cp -r ./build/* "$JOBTRACKER_DEPLOY_PATH"/
      echo "Deploy done.."
    else
      echo "Error: Deployment directory not writable, aborting."
    fi
  else
    echo "Error: JOBTRACKER_DEPLOY_PATH does not point to a valid directory, aborting."
  fi
fi
