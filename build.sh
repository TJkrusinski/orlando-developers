#!/bin/bash

# Welcome to the orlando devs build script
# I don't write much bash so bear with me

# install npm deps if need be
# default assumes that the deps are installed

checkInstall() {
  if [ -e node_modules/.bin/metalsmith ]; then
    build;
  else
    installDeps;
  fi
}

# Do the build

build() {

  # This should probs go away?
  echo -e "---\ntemplate: index.html\n---\n" > src/index.md
  cat readme.md >> src/index.md

  ./node_modules/.bin/metalsmith
}

# ask the user to install the npm deps if the terminal is a tty
# else just bail

installDeps() {
  # -t being 1 means stdout is a tty
  if [ -t 1 ]; then
    
    echo "looks like you need to npm install"
    echo "would you like us to do that for you? (y,n)"

    read doinstall

    # do pattern matching cause people may use 'yes' or 'y'
    if [[ $doinstall == y* ]]; then
      printf "great, installing npm deps for you, this may take a moment\n"
      npm install

      build;
      exit 0;
    else
      echo "bailing since you chose not to install the deps"
      exit 0;
    fi
     
  else
    echo "you are not a tty, peace"
    exit 1;
  fi
}

# start things off
checkInstall
