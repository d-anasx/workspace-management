import { validateInput } from "./support/validation.js";

let workers = [];
let idCounter = 1;
let idToModify ;
let isValidURL = true;
let workerForm = document.querySelector('#workerForm');
let pictureInput = document.querySelector('#worker_photo');
let addExpButton = document.querySelector('#addExp');
let addWorkerButton = document.querySelector('#addWorkerBtn');

workerForm.addEventListener('submit',(e)=>submitWorkerData(e,idToModify));
pictureInput.addEventListener('input',picturePreview);
addExpButton.addEventListener("click",addExperience)
addWorkerButton.addEventListener('click', cleanModal)
document.querySelector("#picture").onerror = () =>{isValidURL = false}
window.fillWorkerForm = fillWorkerForm;
window.openWorkerModal = openWorkerModal;



// function that render workers
function renderWorkers(){
    let workersList = document.querySelector('.workers');
    workersList.innerHTML = '';

    workers.forEach((worker)=>{
        workersList.innerHTML += `
            <div 
            class="workerDiv mt-6 bg-linear-to-r from-zinc-400 to-indigo-200 rounded-xl p-1 px-2 flex items-center shadow gap-4 hover:shadow-md duration-300"
          >
            <img
              src="${worker.url}"
              class="w-10 h-10 rounded-full border object-cover"
            />
            <div class="flex-1">
              <h2 onclick="window.openWorkerModal(${worker.id})" class="font-semibold text-sm hover:scale-110 duration-200 hover:cursor-pointer">${worker.name}</h2>
              <p class="text-gray-500 text-xs">${worker.role}</p>
            </div>
            <button command="show-modal"
                    commandfor="workerModal" class="font-medium"
                    id="modifyButton"
                    onclick="window.fillWorkerForm(${worker.id});">
            <iconify-icon class="text-green-600" icon="solar:pen-bold-duotone" width="24" height="24"></iconify-icon>
            </button>
          </div>
    `;
    
    
    
    })
    workersList.childNodes.forEach((div)=>{
      handleTransition(div , "workerDiv mt-6 bg-linear-to-r from-zinc-400 to-indigo-200 rounded-xl p-1 px-2 flex items-center shadow gap-4 hover:shadow-md duration-300")
    })
    
    
    
}

//function that handle the submit of the form
function submitWorkerData(e,id = null){
  console.log(id)
    e.preventDefault()
    
    let personalInputs = workerForm.querySelectorAll(".personal");
    let experienceBlocks = workerForm.querySelectorAll(".experience");
    let workerObject = {};
    let experiences = [];
    let isValidate = true;


    experienceBlocks.forEach((exp)=>{
        let expInputs = exp.querySelectorAll("input");
        let expObject = {};
        expInputs.forEach((input)=>{
            let validationResult = validateInput(input.value, input.name)
            if (!validationResult.valid){
                input.nextElementSibling.textContent = validationResult.error;
                isValidate = false;
            }else{
                input.nextElementSibling.textContent = "";
                expObject[input.name] = input.value;
                isValidate = true;
            }
            
        });
        if(isValidate) experiences.push(expObject)
    })
    experiences.length == 0 ? isValidate = true : isValidate
    
        personalInputs.forEach((input)=>{
            let validationResult = validateInput(input.value, input.name)
            if (!validationResult.valid){
                input.nextElementSibling.textContent = validationResult.error
                isValidate = false
            }else{
                input.nextElementSibling.textContent = ""
                workerObject[input.name] = input.value
                isValidate = true
            }
    })
    if(isValidate){
      if(id){
        modifyoldWorker(id,workerObject,experiences)
    }
    else{
      
      (!isValidURL) ? workerObject.url = 'assets/avatar.png' : workerObject.url
      addNewWorker(workerObject , experiences)
    }

    //cleanup
    idToModify = null;
    isValidURL = true
    cleanModal()
    document.getElementById("workerModal").close();
    renderWorkers();
    document.querySelector('.experiences-container').innerHTML=''
    
  }
}

function addNewWorker(workerObject, experiences){
        workerObject.id = idCounter++;
        workerObject.experiences = experiences;
        workers.push(workerObject);
}

function modifyoldWorker(id, workerObject, experiences){
  let index = workers.findIndex(w => w.id === id);
            workerObject.id = id;
            workerObject.experiences = experiences;
            workers[index] = workerObject;
      
}

//function that handle the preview of the picture
function picturePreview(e){
    document.querySelector("#picture").src = e.target.value
}


function addExperience(){
    let exp_container = document.querySelector('.experiences-container');
    let div = document.createElement('div')
    div.className = "shadow-xl rounded-lg p-4 experience mb-3 bg-white/80"
    div.innerHTML += `
                        <div class="mb-3">
                          <label class="block text-gray-600 text-sm mb-1">Company:</label>
                          <input type="text" name="company" placeholder="Itaque ab voluptatem" class="worker_company w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3"> <label class="block text-gray-600 text-sm mb-1"> Role: </label>
                          <input type="text" name="expRole" placeholder="Qui laudantium perf" class="worker_expRole w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3">
                          <label class="block text-gray-600 text-sm mb-1"> From: </label>
                          <input type="date" name="from" class="worker_from_date w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3"> <label class="block text-gray-600 text-sm mb-1"> To: </label>
                          <input type="date" name="to" class="worker_to_date w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
    `;
    
  exp_container.appendChild(div);

  handleTransition(div, div.classList)

   
   
}


function fillWorkerForm(workerId) {
    idToModify = parseInt(workerId);
    let worker = workers.find(w => w.id === idToModify);

    workerForm.querySelectorAll(".personal").forEach(input => {
        input.value = worker[input.name] || "";
    });


    if (worker.url) {
        document.querySelector("#picture").src = worker.url;
        pictureInput.value = worker.url;
    }

    let exp_container = document.querySelector('.experiences-container');
    exp_container.innerHTML = "";

    worker.experiences.forEach(exp => {
        addExperience(); 
        let lastBlock = exp_container.lastElementChild;

        lastBlock.querySelector("[name='company']").value = exp.company;
        lastBlock.querySelector("[name='expRole']").value = exp.expRole;
        lastBlock.querySelector("[name='from']").value = exp.from;
        lastBlock.querySelector("[name='to']").value = exp.to;
    });
}

function openWorkerModal(workerId) {
  let worker = workers.find((worker) => worker.id == workerId);
  let detailsContainer = document.getElementById('details-container');


  detailsContainer.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-center">
        <div class="w-32 h-32 rounded-full border-4 border-blue-600 overflow-hidden bg-gray-100">
          <img 
            src="${worker.url}" 
            alt="${worker.name}"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 class="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p class="text-sm text-gray-500">Name</p>
            <p class="font-medium text-gray-800">${worker.name}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-500">Role</p>
            <p class="font-medium text-gray-800">${worker.role}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-medium text-gray-800">${worker.email}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-500">Phone</p>
            <p class="font-medium text-gray-800">${worker.phone}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Experience</h4>
        
        ${worker.experiences && worker.experiences.length > 0 
          ? worker.experiences.map((exp, index) => `
              <div class="mb-4 last:mb-0 p-3 bg-white rounded-lg shadow-sm">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h5 class="font-semibold text-gray-800">${exp.expRole}</h5>
                    <p class="text-sm text-blue-600">${exp.company}</p>
                  </div>
                  <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">#${index + 1}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <iconify-icon icon="mdi:calendar" width="16" height="16"></iconify-icon>
                  <span>${formatDate(exp.from)} - ${formatDate(exp.to)}</span>
                </div>
              </div>
            `).join('')
          : `
            <div class="flex items-center justify-center gap-2 text-gray-400 py-4">
              <iconify-icon icon="mdi:briefcase-off-outline" width="24" height="24"></iconify-icon>
              <p>No experience recorded</p>
            </div>
          `
        }
      </div>
    </div>
  `;

  document.getElementById("openWorkerInfo").click();
}


function formatDate(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString();
}

function handleTransition(div , classes=''){
      div.className = classes + ' ' + 'opacity-0 -translate-y-2 transition-all duration-300';
      setTimeout(() => {
  div.className = classes + ' ' + 'opacity-100 translate-y-0 transition-all duration-300';
}, 10);
}

function cleanModal(){
  workerForm.reset();
  document.getElementById("picture").src='';
}




  
  






