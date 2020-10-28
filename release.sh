#!/bin/bash

# error output terminates this script
set -e

# This script creates a SiaPrime-UI release for all 3 platforms: osx (darwin),
# linux, and windows. It takes 5 arguments, the first two arguments are the
# private and public key used to sign the release archives. The last three
# arguments are semver strings, the first of which being the ui version, second
# being the SiaPrime version, and third being the electron version.

if [[ -z $1 || -z $2 ]]; then
	echo "Usage: $0 privatekey publickey uiversion siaPrimeVersion electronversion"
	exit 1
fi

# ensure we have a clean node_modules
rm -rf ./node_modules
npm install

# build the UI's js
rm -rf ./dist
npm run build

uiVersion=${3:-v1.4.0-1}
siaPrimeVersion=${4:-v1.4.0.1}
electronVersion=${5:-v2.0.8}

# fourth argument is the public key file path.
keyFile=`readlink -f $1`
pubkeyFile=`readlink -f $2`


electronOSX="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-darwin-x64.zip"
electronLinux="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-linux-x64.zip"
electronWindows="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-win32-x64.zip"

siaOSX="$HOME/go/src/gitlab.com/SiaPrime/SiaPrime/release/SiaPrime-${siaPrimeVersion}-darwin-amd64.zip"
siaLinux="$HOME/go/src/gitlab.com/SiaPrime/SiaPrime/release/SiaPrime-${siaPrimeVersion}-linux-amd64.zip"
siaWindows="$HOME/go/src/gitlab.com/SiaPrime/SiaPrime/release/SiaPrime-${siaPrimeVersion}-windows-amd64.zip"

rm -rf release/
mkdir -p release/{osx,linux,win32}

# package copies all the required javascript, html, and assets into an electron package.
package() {
	src=$1
	dest=$2
	cp -r ${src}/{plugins,assets,css,dist,app.html,app.js,package.json,js} $dest
}

buildOSX() {
	cd release/osx
	wget $electronOSX 
	unzip ./electron*
	mv Electron.app SiaPrime-UI.app
	mv SiaPrime-UI.app/Contents/MacOS/Electron SiaPrime-UI.app/Contents/MacOS/SiaPrime-UI
	# NOTE: this only works with GNU sed, other platforms (like OSX) may fail here
	sed -i 's/>Electron</>SiaPrime-UI</' SiaPrime-UI.app/Contents/Info.plist
	sed -i 's/>'"${electronVersion:1}"'</>'"${siaPrimeVersion:1}"'</' SiaPrime-UI.app/Contents/Info.plist
	sed -i 's/>com.github.electron\</>com.siaprime.siaprimeui</' SiaPrime-UI.app/Contents/Info.plist
	sed -i 's/>electron.icns</>icon.icns</' SiaPrime-UI.app/Contents/Info.plist
	cp ../../assets/icon.icns SiaPrime-UI.app/Contents/Resources/
	rm -r SiaPrime-UI.app/Contents/Resources/default_app.asar
	mkdir SiaPrime-UI.app/Contents/Resources/app
	(
		cd SiaPrime-UI.app/Contents/Resources/app
		cp $siaOSX .
		unzip ./SiaPrime-*
		rm ./SiaPrime*.zip
		mv ./SiaPrime-* ./SiaPrime
	)
	package "../../" "SiaPrime-UI.app/Contents/Resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

buildLinux() {
	cd release/linux
	wget $electronLinux
	unzip ./electron*
	mv electron SiaPrime-UI
	rm -r resources/default_app.asar
	mkdir resources/app
	(
		cd resources/app
		cp $siaLinux .
		unzip ./SiaPrime-*
		rm ./SiaPrime*.zip
		mv ./SiaPrime-* ./SiaPrime
	)
	package "../../" "resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

buildWindows() {
	cd release/win32
	wget $electronWindows
	unzip ./electron*
	mv electron.exe SiaPrime-UI.exe
	wget https://github.com/electron/rcedit/releases/download/v0.1.0/rcedit.exe
	wine rcedit.exe SiaPrime-UI.exe --set-icon '../../assets/icon.ico'
	rm -f rcedit.exe
	rm resources/default_app.asar
	mkdir resources/app
	(
		cd resources/app
		cp $siaWindows .
		unzip ./SiaPrime-*
		rm ./SiaPrime*.zip
		mv ./SiaPrime-* ./SiaPrime
	)
	package "../../" "resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

# make osx release
( buildOSX )

# make linux release
( buildLinux )

# make windows release
( buildWindows )

# make signed zip archives for each release
for os in win32 linux osx; do 
	(
		cd release/${os}
		zip -r ../SiaPrime-UI-${uiVersion}-${os}-x64.zip .
		cd ..
		openssl dgst -sha256 -sign $keyFile -out SiaPrime-UI-${uiVersion}-${os}-x64.zip.sig SiaPrime-UI-${uiVersion}-${os}-x64.zip
		if [[ -n $pubkeyFile ]]; then
			openssl dgst -sha256 -verify $pubkeyFile -signature SiaPrime-UI-${uiVersion}-${os}-x64.zip.sig SiaPrime-UI-${uiVersion}-${os}-x64.zip
		fi
		rm -rf release/${os}
	)
done

