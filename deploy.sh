#!/bin/bash

#rsync -v --exclude-from=rsync_exclude.txt --no-perms -a ./ pi@ssh.wilcomenge.nl:/var/www/servers/budgetplanner.wilcomenge.nl/ -e 'ssh -p 777'
rsync -v --no-perms -a ./ pi@ssh.wilcomenge.nl:/var/www/servers/schaken.wilcomenge.nl/ -e 'ssh -p 777'
