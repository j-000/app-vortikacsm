class Toast extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode: 'open'});
  }

  get observedProperties() {
    return ['message'];
  }

  connectedCallback(){

    this.shadowRoot.innerHTML = `
    <style>
        @import "styles/dependencies/bootstrap.css"
        .toast {
            background-color: rgb(255, 255, 255);
            position: fixed;
            opacity: 1;
        }

        @keyframes showToast{
            0%{
                opacity: 0;
            }
            100%{
                opacity: 1;
            }
        }
    </style>
    <<div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
    <div class="toast-header">
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
        Hello, world! This is a toast message.
    </div>
    </div>>
    `;
  }
}

export default Toast;