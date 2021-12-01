class Devotees {
    constructor(name, address, danaTime) {
        this.name = name;
        this.address = address;
        this.danaTime = danaTime;
    }
}
class UI {
    //add devotees info
    addInfoToDatabase(dev) {
        const devList = document.getElementById('dev-list');
        const row = document.createElement('tr');
        row.className = 'devInfo';
        row.innerHTML = `
            <td >${dev.name}</td>
            <td >${dev.address}</td>
            <td >${dev.danaTime}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        devList.appendChild(row);
    }
    //Clear Fields
    clearFields() {
        document.getElementById('devName').value = '';
        document.getElementById('devAddress').value = '';
        document.getElementById('danaTime').value = '';
    }
    //Delete devotee info
    deleteDevInfo(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
            // console.log(target.parentElement.parentElement)
         }
    }
    //show alert message
    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#dev-form');
        container.insertBefore(div, form);
        setTimeout(function () {
            document.querySelector('.alert').remove();
        },3000);
    }
}
class Store {
    //get info from local storage
    static getInfo() {
        let devotees;
        if (localStorage.getItem('devotees') === null) {
            devotees = [];
        } else {
            devotees = JSON.parse(localStorage.getItem('devotees'));
        }
        return devotees;
    }
    //display infos from localstorage
    static displayInfo() {
        const devotees = Store.getInfo();
        devotees.forEach(devotee => {
            const ui = new UI;
            ui.addInfoToDatabase(devotee);
        });
    }

    static addInfoToLocalStorage(devo) {
        const devotees = Store.getInfo();
        devotees.push(devo);
        localStorage.setItem('devotees', JSON.stringify(devotees));
    }
    //remove info from local storage
    static removeInfoFromLocalStorage(danaTimee) {
        const devotees = Store.getInfo();
        devotees.forEach(function (devotee, index) {
            if (devotee.danaTime == danaTimee) {
                devotees.splice(index, 1);
            }
        });
        localStorage.setItem('devotees', JSON.stringify(devotees));
    }
}
//call display info func once DOM contents are loaded
document.addEventListener('DOMContentLoaded', Store.displayInfo);

//Add Dev Info
document.getElementById('dev-form').addEventListener('submit', function (e) {
    const name = document.getElementById('devName').value;
    const address = document.getElementById('devAddress').value;
    const danaTime = document.getElementById('danaTime').value;

    const devotee = new Devotees(name, address, danaTime);
    const ui = new UI()
    if (name === '' || address === '' || danaTime === '') {
        ui.showAlert('You must fill all fields', 'alert-danger');
    } else {
        //add details to the list
        ui.addInfoToDatabase(devotee);
        //Add details to the local storage no need to instantiate because of static method
        Store.addInfoToLocalStorage(devotee);
        //clear fiels
        ui.clearFields()
        //show success
        ui.showAlert('Devotee name was successfully added', 'alert-success');
    }
    
    e.preventDefault();
});

//delete data from 
document.getElementById('dev-list').addEventListener('click', function (e) {
    const ui = new UI;
    ui.deleteDevInfo(e.target);
    //remove from local storage 
    Store.removeInfoFromLocalStorage(e.target.parentElement.previousElementSibling.textContent)
    ui.showAlert('Successfully Deleted!', 'alert-success');
    e.preventDefault();
});

//filter tasks
document.getElementById('filterDev').addEventListener('keyup', function (e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('.devInfo').forEach(function (dev) {
        const item = dev.firstElementChild.firstChild.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            dev.style.display = 'block';
        } else {
            dev.style.display = 'none';
        }
    });

});