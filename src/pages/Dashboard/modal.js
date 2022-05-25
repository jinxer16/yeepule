import react, { useState } from "react";

const ModalNew = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => {
    if (show == false) {
      setShow(true);
      console.log("show", show);
    } else {
      setShow(false);
      console.log("show", show);
    }
  };
  return (
    <>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModalCenter"
        onClick={handleClick}
      >
        Launch demo modal
      </button>

      {show && (
        <div
          class="modal fade"
          id="exampleModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header modalHeader d-flex justify-content-center align-items-center">
                <h5 class="modal-title  " id="exampleModalLongTitle">
                  Modal title
                </h5>
                <button
                  type="button"
                  class="close mt-1 btnClose"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div class="modal-body">
                <input type="number"></input>
              </div>
              <div class="modal-footer footerTopBorder d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" class="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ModalNew;
