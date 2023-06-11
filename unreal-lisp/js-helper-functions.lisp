(in-package :unreal-lisp)

(defun console-log (&rest logged-objects)
  (apply (ffi:ref #j:console "log") logged-objects))

(defun print-methods (obj)
  (console-log #j"-----")
  (console-log ((ffi:ref #j:Object:getOwnPropertyNames "call") obj obj))
  (console-log #j"-----"))

(defun g-funcall (fun arg)
  ((ffi:ref fun "call") #j:GWorld arg))
