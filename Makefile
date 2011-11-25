#===================================================================
#--------------------------- Variables -----------------------------
#===================================================================
coffee = node_modules/.bin/coffee
stylus = node_modules/.bin/stylus
connect = node_modules/connect/package.json
closure = vendor/closure-compiler/compiler.jar
requirejsBuild = node_modules/.bin/r.js


#===================================================================
#­--------------------------- TARGETS ------------------------------
#===================================================================
.PHONY : clean update-closure

#-------------------------------------------------------------------
# BUILD
#------------------------------------------------------------------- 
src/bootstrap.js: deps $(closure) src/cell.js src/cell-builder-plugin.js
	$(coffee) -c -b src/
	$(requirejsBuild) \
		-o \
		paths.requireLib=../node_modules/requirejs/require \
		include=requireLib \
		name=cell!framework/App \
		out=src/bootstrap-tmp.js \
		optimize=none \
		baseUrl=src includeRequire=true
	cat vendor/iscroll-lite.js \
			src/bootstrap-tmp.js > src/bootstrap-tmp.unmin.js
	java -jar $(closure) --compilation_level SIMPLE_OPTIMIZATIONS --js src/bootstrap-tmp.unmin.js --js_output_file src/bootstrap.js
	cat src/global.css \
			src/bootstrap-tmp.css > src/bootstrap.css
	rm src/bootstrap-tmp.*

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 
specs: deps
	find src -name '*Spec.coffee' | xargs coffee -e 'console.log """define([],#{JSON.stringify process.argv[4..].map (e)->"spec!"+/^src\/(.*?)Spec\.coffee/.exec(e)[1]});"""' > spec/allSpecs.js

#-------------------------------------------------------------------
# DEV 
#------------------------------------------------------------------- 
dev-server: deps dev-server.coffee
	$(coffee) ./dev-server.coffee `pwd`

dev-stylus: deps
	find ./src -name '*.styl' -type f | xargs $(stylus) --include ./src/shared/styles --watch --compress

dev-coffee: deps
	find ./src ./spec -name '*.coffee' -type f | xargs $(coffee) -c -b --watch

#-------------------------------------------------------------------
# Dependencies 
#------------------------------------------------------------------- 
remove-closure:
	rm -rf vendor/closure-compiler

update-closure: remove-closure $(closure)

$(closure):
	mkdir -p vendor/closure-compiler
	wget -O vendor/closure-compiler/closure-compiler.zip http://closure-compiler.googlecode.com/files/compiler-latest.zip
	unzip -d vendor/closure-compiler vendor/closure-compiler/closure-compiler.zip
	rm vendor/closure-compiler/closure-compiler.zip

deps:
	npm install

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 

clean: 
	@@rm src/bootstrap.*

