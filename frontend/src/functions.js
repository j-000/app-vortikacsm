import moment from 'moment';

// Global toast function
export default function (message) {
    document.querySelector('#toastTime').textContent = moment(Date.now()).fromNow();
    document.querySelector('.toast-body').innerHTML = message;
    bootstrap.Toast.getOrCreateInstance(document.querySelector('#liveToast')).show();
}

