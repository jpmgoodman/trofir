#!/usr/bin/env sh
ssh root@trofir.com 'cd /opt/mean/trofir/; eval "$(ssh-agent)"; ssh-add ~/.ssh/id_rsa; git pull origin master; exit'
