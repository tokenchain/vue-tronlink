#!/bin/sh
# Accepts a version string and prints it incremented by one.
# Usage: increment_version <version> [<position>] [<leftmost>]
increment_version() {
  declare -a part=( ${1//\./ } )
  declare    new
  declare -i carry=1

  for (( CNTR=${#part[@]}-1; CNTR>=0; CNTR-=1 )); do
    len=${#part[CNTR]}
    new=$((part[CNTR]+carry))
    [ ${#new} -gt $len ] && carry=1 || carry=0
    [ $CNTR -gt 0 ] && part[CNTR]=${new: -len} || part[CNTR]=${new}
  done
  new="${part[*]}"
   if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${new// /.}"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "${new// /.}"
    elif [[ "$OSTYPE" == "cygwin" ]]; then
        echo "not correct system - cygwin detected"
        exit
    fi

}
preinstall(){
    npm install -g dts-gen
    npm install typescript --save-dev
    pip3 install git+git://github.com/psf/black
}
auto_install=0
mod_package_json() {
    param_chan=$(echo "$1 = \"$2\"")
    echo "$param_chan"
    cat $NODEPFILE | jq "$param_chan" $NODEPFILE | sponge $NODEPFILE
}
auto_install_nvm(){
    if [[ $auto_install==1 ]]; then
        $CMD_FINAL
    fi
}
npmdeploy(){
    username=$(npm whoami)
    if [[ $username == "jrhess" ]]; then
      echo "You have login the npm platform and it is ready to publish"
      npm publish --dry-run
      npm publish .
    fi
    auto_install_nvm
}
gitpush(){
    git add .
    #git remote add origin https://gitee.com/jjhoc/vue-tronlink.git
    git commit -m "package updates related items. please check in commit details"
    git push
}
#tsc -b
PROJECT_NAME="vue-tronlink"
VERSION=$(cat version)
increment_version $VERSION > version
VERSION=$(cat version)
CMD_FINAL="npm i -g $PROJECT_NAME@$VERSION"
NODEPFILE="package.json"
mod_package_json ".version" $VERSION
mod_package_json ".name" $PROJECT_NAME
mod_package_json ".author" "HeskemoKondax"
mod_package_json ".repository" "git@gitee.com:jjhoc/vue-tronlink.git"
mod_package_json ".homepage" "https://gitee.com/jjhoc/vue-tronlink"
echo "==== done ====="
gitpush
npmdeploy