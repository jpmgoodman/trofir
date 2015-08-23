#!/usr/bin/env sh
ssh root@trofir.com     'cd /opt/mean/trofir/                           &&
                        echo --------------------------------------     ;
                        echo adding ssh key...                          ;
                        echo --------------------------------------     ;
                        eval "$(ssh-agent)"                             &&
                        ssh-add ~/.ssh/id_rsa                           &&
                        echo --------------------------------------     ;
                        echo successfully added ssh key!                ;
                        echo pulling repo from github...                ;
                        echo --------------------------------------     ;
                        git pull origin master                          &&
                        npm install                                     &&
                        echo --------------------------------------     ;
                        echo successful pull from github!               ;
                        echo restarting server...                       ;
                        echo --------------------------------------     ;
                        forever stop 0                                  &&
                        PORT=80 forever start server.js                 &&
                        echo --------------------------------------     ;
                        echo server successfully restarted. done!       ;
                        echo --------------------------------------     ;
                        exit'
