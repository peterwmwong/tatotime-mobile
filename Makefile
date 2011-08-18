#===================================================================
#--------------------------- Variables -----------------------------
#===================================================================
coffee = node_modules/.bin/coffee
serve= node_modules/.bin/serve
stylus = node_modules/.bin/stylus
uglifyjs = node_modules/.bin/uglifyjs
express = node_modules/express/package.json

#-------------------------------------------------------------------
# BUILD
#------------------------------------------------------------------- 
requirejsBuild = ./vendor/requirejs/r.js

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
cells/bootstrap.js: $(uglifyjs) cells/cell.js cells/cell-pluginBuilder.js
	node $(requirejsBuild) \
		-o \
		paths.requireLib=../vendor/requirejs/require \
		include=requireLib \
		name=cell!App \
		out=cells/bootstrap-tmp.js \
		baseUrl=cells includeRequire=true
	cat vendor/jquery.js \
			vendor/cell-mobile.js \
			vendor/jquery.mobile.js \
			cells/bootstrap-tmp.js | $(uglifyjs) -nc > cells/bootstrap.js
	cat vendor/jquery.mobile.css \
			cells/bootstrap-tmp.css > cells/bootstrap.css
	rm cells/bootstrap-tmp.*

#-------------------------------------------------------------------
# DEV 
#------------------------------------------------------------------- 
dev-server: $(serve)
	$(serve) -D -L -I

dev-stylus: $(stylus)
	find ./cells ./mixins -name '*.styl' -type f | xargs $(stylus) --watch --compress

dev-coffee: $(coffee)
	find . -name '*.coffee' -type f | xargs $(coffee) -c -b --watch

#-------------------------------------------------------------------
# Dependencies 
#------------------------------------------------------------------- 
$(stylus):
	npm install stylus

$(coffee):
	npm install coffee-script

$(express):
	npm install express

$(uglifyjs):
	npm install uglify-js

$(serve):
	npm install serve

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 

clean: 
	@@rm cells/bootstrap.*

