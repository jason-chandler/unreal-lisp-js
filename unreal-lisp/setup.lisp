(in-package :unreal-lisp)

(defun run-js-file (file-name)
  (funcall (ffi:ref #j:Context "RunFile") (ffi:cl->js file-name)))

;; (run-polyfills)

(defun run-polyfills ()
  (run-js-file "../../../aliases.js")
  (run-js-file "../../../polyfill/unrealengine.js")
  (run-js-file "../../../polyfill/timers.js"))

(defparameter *g-world* (ffi:ref #j:GWorld))
