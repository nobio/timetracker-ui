#!/bin/bash
export HOST=qnap-nas
export USER=nobio
export TARGET_DIR=/share/Web/timetracker

echo ========= build project ========
ionic build --prod
tar cvfz www.tgz www/*

echo ========= deploy project to qnap ========
ssh $USER@$HOST "rm -rf $TARGET_DIR/*"
scp www.tgz $USER@$HOST:$TARGET_DIR
ssh $USER@$HOST "tar xvfz $TARGET_DIR/www.tgz --directory $TARGET_DIR/; mv $TARGET_DIR/www/* $TARGET_DIR/; rm -rf $TARGET_DIR/www*"
rm www.tgz

echo ========= deploy project to firebase ========
firebase deploy

echo ========= deploy on iPhone, opens XCode ============
ionic capacitor build ios --prod