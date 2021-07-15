#!/bin/bash
export HOST=qnap-nas
export USER=nobio
export TARGET_DIR=/share/Web/timetracker

ionic build --prod                    
tar cvfz www.tgz www/*
ssh $USER@$HOST "rm -rf $TARGET_DIR/*"
scp www.tgz $USER@$HOST:$TARGET_DIR
ssh $USER@$HOST "tar xvfz $TARGET_DIR/www.tgz --directory $TARGET_DIR/; mv $TARGET_DIR/www/* $TARGET_DIR/; rm -rf $TARGET_DIR/www*"
rm www.tgz