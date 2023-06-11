(in-package :unreal-lisp)

(defun get-pc ()
  (ffi:aget (ffi:ref (g-funcall #j:GWorld:GetAllActorsOfClass #j:PlayerController) "OutActors") 0))

(defparameter *player* (get-pc))

(defclass player-controller (js-object) ())

(defmethod initialize-instance :after ((instance player-controller) &rest initargs &key &allow-other-keys)
  (if (not (getf initargs :foreign-ref))
      (let ((new-controller (ffi:new #j:PlayerController)))
        (setf initargs (cons :foreign-ref (cons new-controller initargs))
              (foreign-ref instance) new-controller)))
  (def-foreign-method instance get-player-controller-id ("GetPlayerControllerID"))
  (def-foreign-method instance set-player-controller-id ("SetPlayerControllerID")))

(defparameter player (make-instance 'player-controller :foreign-ref (get-pc)))

(log console (get-player-controller-id player))
