/// <reference path="typings/ue.d.ts">/>

const _ = require('lodash')

function lisp_call(fun, pkg, args) {
    return global.lisp.intern(fun, pkg).func.apply(global.lisp, args);
}

function cl_js(args) {
    return lisp_call("CL->JS", "FFI", args)
}

function js_cl(args) {
    return lisp_call("JS->CL", "FFI", args)
}

// borrowed from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// check how many bytes the array buffer is actually using
function filled_count(buf) {
    var current_char = ' ';
    var i;
    for(i = 0; current_char !== 0 && i < 65536; i++) {
	current_char = buf.charCodeAt(i);
    }
    return i - 1;
}

function connect_websocket() {
    function connect_1() {
	// middleman nodejs websocket that forwards to hunchensocket
	// this way it can force both sides to reconnect if something errors out
	global.ws = JavascriptWebSocket.Connect("127.0.0.1:9090");
	let ws = global.ws;
	let lisp = global.lisp;
	ws.OnReceived = (e) => {
	    let json;
	    // arbitrary size, might need adjusting
	    let ab = new ArrayBuffer(65536);
	    try {
		memory.exec(ab,_ => {
		    ws.CopyBuffer();

		    let buf_str = ab2str(ab);
		    let buf_len = filled_count(buf_str);
		    console.log('received:');
		    console.log(buf_str.slice(0, buf_len));

		    // JSON.parse does not like appended 0 chars
		    let json = JSON.parse(buf_str.slice(0, buf_len));
		    let unbound = new Error();
		    let value = unbound
		    
		    value = lisp.intern('JS-EVAL', 'FFI').func.call(this, js_cl([json.code]))
		    if(json['return'] === true) {
			ws.send(JSON.stringify({ "value": cl_js(lisp_call("PRIN1-TO-STRING", "CL", value)) }))
		    }
		})
	    } catch(err) {
		console.log(err);
	    };
	};
	ws.OnConnected = (args) => {
	    console.log('Connected');
	}
	ws.OnError = (args) => {
	    console.log(args);
	    console.log("Error!");
	    // On nodejs, doing this without nulling the callbacks will cause
	    // a memory leak since we don't clear the handlers themselves
	    // I don't know off-hand if this happens on UnrealJS as well
	    setTimeout(connect_1, 1);
	}
    }
    connect_1();
}

function websocket_tick() {
    if(global.ws !== undefined && global.ws.name !== 'NIL') {
	global.ws.Tick();
    }
    process.nextTick(websocket_tick);
}

function main() {
    "use strict"

    // grant lisp access to unreal context vars and set global.lisp to lisp
    // put a top-level call to main function in lisp if necessary
    require('bootstrap')('./unreal_lisp');
    // websocket for live lisp development, remove this before delivering
    connect_websocket();
    websocket_tick();
}

try {
    process.nextTick(main);
}

catch (e) {
    // most likely we don't have access to process.
    // Run bootstrap with this file in context again just in case
    require('bootstrap')('bootstrap-lisp')
}
