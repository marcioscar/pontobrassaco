


function Modal({ children, onClose }) {
  return (
    <div
      // className="position: fixed left-1/2 top-11  w-1/2 h-1/2 bg-red-500"
      className="justify-center   bg-red-300/80  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      onClick={onClose}
    >
      <dialog
        className="relative w-auto my-6 mx-auto max-w-4xl "
        open
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </dialog>
    </div>
  );
}

export default Modal;
