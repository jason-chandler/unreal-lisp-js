(in-package :unreal-lisp)

(defun main ()
  (console-log #j"end-of-main"))

(print-methods #j:PlayerController)

(console-log ((ffi:ref (get-pc) "GetPlayerControllerID")))

(console-log (g-funcall #j:GWorld:GetAllActorsOfClass #j:PlayerController))
(console-log (get-pc))
(console-log #j:PlayerController)
(console-log (ffi:ref #j:GWorld))

(ffi:set #j:global:lisp #j:lisp)
