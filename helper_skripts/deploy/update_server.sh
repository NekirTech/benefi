#!/bin/sh
cd benefi/
git remote update
if git status | grep -q 'Your branch is behind'; then
        echo "Updates found pulling"
        git pull
        quasar build
        rm -rf /var/www/html/*
        cp -r dist/spa/. /var/www/html/
else
        echo "No updates"
        python3 helper_skripts/menu_converter/menu_converter.py
        echo "Script run"
        #git commit -am "pipeline"
        #git push
        #quasar build
        #rm -rf /var/www/html/*
        #cp -r dist/spa/. /var/www/html/
fi
if git status | grep -q 'modified:'; then
        git commit -am "pipeline"
        git push
        quasar build
        rm -rf /var/www/html/*
        cp -r dist/spa/. /var/www/html/
        echo "commited"
fi
cd ~
