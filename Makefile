#===================================================================
#--------------------------- Variables -----------------------------
#===================================================================
coffee = node_modules/.bin/coffee
stylus = node_modules/.bin/stylus
uglifyjs = node_modules/.bin/uglifyjs
connect = node_modules/connect/package.json

#-------------------------------------------------------------------
# BUILD
#------------------------------------------------------------------- 
requirejsBuild = node_modules/.bin/r.js

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 
ifndef TEST_BROWSER
	TEST_BROWSER := google-chrome
endif

ifndef TESTS
	TESTS := "**"
endif

ifdef TEST_DEBUG
	TEST_DEBUG_ = -d
endif


#===================================================================
#----------------------------- MACROS ------------------------------
#===================================================================


#===================================================================
#­--------------------------- TARGETS ------------------------------
#===================================================================
.PHONY : clean

#-------------------------------------------------------------------
# BUILD
#------------------------------------------------------------------- 
src/bootstrap.js: $(uglifyjs) src/cell.js src/cell-builder-plugin.js
	$(requirejsBuild) \
		-o \
		paths.requireLib=../node_modules/requirejs/require \
		include=requireLib \
		name=cell!framework/App \
		out=src/bootstrap-tmp.js \
		baseUrl=src includeRequire=true
	cat vendor/iscroll-lite.js \
			src/bootstrap-tmp.js | $(uglifyjs) -nc > src/bootstrap.js
	cat src/global.css \
			src/bootstrap-tmp.css > src/bootstrap.css
	rm src/bootstrap-tmp.*

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 
specs:
	find src -name '*Spec.coffee' | xargs coffee -e 'console.log """define([],#{JSON.stringify process.argv[4..].map (e)->"spec!"+/^src\/(.*?)Spec\.coffee/.exec(e)[1]});"""' > spec/allSpecs.js

#-------------------------------------------------------------------
# DEV 
#------------------------------------------------------------------- 
dev-server: $(coffee) $(connect) dev-server.coffee
	$(coffee) ./dev-server.coffee `pwd`

dev-stylus: $(stylus)
	find ./src -name '*.styl' -type f | xargs $(stylus) --include ./src/shared/styles --watch --compress

dev-coffee: $(coffee)
	find ./src ./spec -name '*.coffee' -type f | xargs $(coffee) -c -b --watch

#-------------------------------------------------------------------
# Dependencies 
#------------------------------------------------------------------- 
$(stylus):
	npm install stylus

$(coffee):
	npm install coffee-script

$(connect):
	npm install connect

$(uglifyjs):
	npm install uglify-js

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 

clean: 
	@@rm src/bootstrap.*

