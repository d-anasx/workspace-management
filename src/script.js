import { validateInput,validateDateRange } from "./support/validation.js";

let workers = [];
let assignWorkers = {conference : {staff : [] , max : 6}, 
                     servers : {staff : [] , max : 2},
                     security : {staff : [] , max : 2},
                     reception :{staff : [] , max : 6},
                     staff :{staff : [] , max : 2},
                     vault :{staff : [] , max : 2}
}
let idCounter = 1;
let idToModify ;
let isValidURL = true;
let workerForm = document.querySelector('#workerForm');
let pictureInput = document.querySelector('#worker_photo');
let addExpButton = document.querySelector('#addExp');
let addWorkerButton = document.querySelector('#addWorkerBtn');
let assignButtons = document.querySelectorAll('.room-btn');

workerForm.addEventListener('submit',(e)=>submitWorkerData(e,idToModify));
pictureInput.addEventListener('input',picturePreview);
addExpButton.addEventListener("click",addExperience)
addWorkerButton.addEventListener('click', cleanModal)
document.querySelector("#picture").onerror = () =>{isValidURL = false}
assignButtons.forEach((btn)=>{
  btn.addEventListener("click",handleAssign);
})
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

    //handling expriences fields
    experienceBlocks.forEach((exp)=>{
        let expInputs = exp.querySelectorAll("input");
        let expObject = {};
        let fromDate = "";
        let toDate = "";
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
            if (input.name === "from") fromDate = input.value;
            if (input.name === "to") toDate = input.value;
            
        });
        const dateResult = validateDateRange(fromDate, toDate);
        console.log(dateResult);
        
        if (!dateResult.valid) {
          isValidate = false;
          const toInput = [...expInputs].find(i => i.name === "to");
          toInput.nextElementSibling.textContent = dateResult.error;
        }else {experiences.push(expObject)}
    })
  
    // experiences.length == 0 ? isValidate = true : isValidate
    
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
      (!isValidURL) ? workerObject.url = 'assets/avatar.png' : workerObject.url
      if(id){
        modifyoldWorker(id,workerObject,experiences)
    }
    else{
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


function addExperience(exp=null){
    let exp_container = document.querySelector('.experiences-container');
    let div = document.createElement('div')
    div.className = "shadow-xl rounded-lg p-4 experience mb-3 bg-white/80"
    div.innerHTML += `
                        <div class="mb-3">
                          <label class="block text-gray-600 text-sm mb-1">Company:</label>
                          <input value="${exp.company ? exp.company : ''}" type="text" name="company" placeholder="Itaque ab voluptatem" class="worker_company w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3"> <label class="block text-gray-600 text-sm mb-1"> Role: </label>
                          <input value="${exp.expRole ? exp.expRole : ''}" type="text" name="expRole" placeholder="Qui laudantium perf" class="worker_expRole w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3">
                          <label class="block text-gray-600 text-sm mb-1"> From: </label>
                          <input value="${exp.from ? exp.from : ''}" type="date" name="from" class="worker_from_date w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3"> <label class="block text-gray-600 text-sm mb-1"> To: </label>
                          <input value="${exp.to ? exp.to : ''}" type="date" name="to" class="worker_to_date w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
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
        addExperience(exp); 
        // let lastBlock = exp_container.lastElementChild;

        // lastBlock.querySelector("[name='company']").value = exp.company;
        // lastBlock.querySelector("[name='expRole']").value = exp.expRole;
        // lastBlock.querySelector("[name='from']").value = exp.from;
        // lastBlock.querySelector("[name='to']").value = exp.to;
    });
}

function openWorkerModal(workerId) {
  let worker = workers.find((worker) => worker.id == workerId);
  let detailsContainer = document.getElementById('details-container');


  detailsContainer.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-center">
        <div class="w-32 h-32 rounded-full border-4 border-blue-600 overflow-hidden ">
          <img 
            src="${worker.url}" 
            alt="${worker.name}"
            class="w-full h-full object-cover bg-blue-400"
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
      div.className = classes + ' ' + 'opacity-0 scale-120  -translate-y-2 transition-all duration-300';
      setTimeout(() => {
  div.className = classes + ' ' + 'opacity-120 scale-100 translate-y-0 transition-all duration-300';
}, 10);

setTimeout(() => {
  div.className = classes + ' ' + 'opacity-100 scale-none translate-y-0 transition-all duration-300';
}, 10);
}

function cleanModal(){
  workerForm.reset();
  document.getElementById("picture").src='';
}


function handleAssign() {
  document.getElementById('openAssignModal').click();
  let roomName = this.dataset.roomName
  let workersToAssignArray = ArrayByRole(roomName);
  
  diplayUnassigned(workersToAssignArray)
  

  // adding event listener for each worker
  document.querySelectorAll('.assign-worker-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const workerId = this.dataset.workerId;
      assignWorkerToRoom(workerId, roomName);
    });
  });
  
  //making cards clickable
  document.querySelectorAll('.worker-card').forEach(card => {
    card.addEventListener('click', function() {
      const workerId = this.querySelector('.assign-worker-btn').dataset.workerId;
      openWorkerModal(workerId);
    });
  });
}

function diplayUnassigned(workersToAssignArray){
    let workersToAssignContainer = document.getElementById('list-to-assign');
  
  
  workersToAssignContainer.innerHTML = '';
  
  
  if (!workersToAssignArray || workersToAssignArray.length === 0) {
    workersToAssignContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-gray-400">
        <iconify-icon icon="mdi:account-off-outline" width="64" height="64"></iconify-icon>
        <p class="mt-4 text-lg font-medium">No workers available</p>
      </div>
    `;
    return;
  }
  
  
  workersToAssignContainer.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      ${workersToAssignArray.map(worker => `
        <div class="worker-card bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400 cursor-pointer group">
          <div class="p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-blue-500 transition-colors shrink-0">
                <img 
                  src="${worker.url}" 
                  alt="${worker.name}"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  ${worker.name}
                </h4>
                <p class="text-sm text-gray-500 flex items-center gap-1">
                  <iconify-icon icon="mdi:badge-account" width="16" height="16"></iconify-icon>
                  ${worker.role}
                </p>
              </div>
            </div>
            
            
            <div class="space-y-2 mb-3">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <iconify-icon icon="mdi:email-outline" width="16" height="16" class="text-blue-500"></iconify-icon>
                <span class="truncate">${worker.email}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <iconify-icon icon="mdi:phone-outline" width="16" height="16" class="text-blue-500"></iconify-icon>
                <span>${worker.phone}</span>
              </div>
            </div>
            
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <iconify-icon icon="mdi:briefcase-outline" width="14" height="14"></iconify-icon>
                <span>${worker.experiences?.length || 0} experience(s)</span>
              </div>
              
              
              <button 
                data-worker-id="${worker.id}"
                class="assign-worker-btn px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1"
              >
                <iconify-icon icon="mdi:account-plus" width="18" height="18"></iconify-icon>
                Assign
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function assignWorkerToRoom(workerId , roomName){
  console.log(workerId , roomName);
  
    let areaContainer = document.getElementById('roomName');
    let worker = workers.find(w => w.id == workerId);

    if (assignWorkers[roomName].staff.length >= assignWorkers[roomName].max) {
    alert(`${roomName} is at maximum capacity (${assignWorkers[roomName].max} workers)`);
    return;
  }
  
  assignWorkers[roomName].staff.push(worker);
  let workerIndex = workers.findIndex(w => w.id == workerId);
  if (workerIndex !== -1) {
    workers.splice(workerIndex, 1);
  }
  renderWorkers()
  renderRoomWorkers(roomName);
  diplayUnassigned(ArrayByRole(roomName))
  document.getElementById('closeAssignModal').click();

  }

function renderRoomWorkers(roomName) {
  
  let roomContainer = document.querySelector(`.${roomName.toLowerCase()}`);
  
  
  let workerDisplay = roomContainer.querySelector('.room-workers');
    workerDisplay.innerHTML = ''
  

  // Add worker badges
  assignWorkers[roomName].staff.forEach(worker => {
    const workerBadge = document.createElement('div');
    workerBadge.className =
       ' relative bg-white/95 backdrop-blur-sm flex items-center flex-nowrap w-fit h-fit rounded-full p-0.5 shadow-lg hover:bg-white transition-all cursor-pointer';

    workerBadge.innerHTML = `
      <img 
        src="${worker.url}" 
        alt="${worker.name}"
        class="w-10 h-10 rounded-full object-cover"
      />
      <button data-id = "${worker.id}"  class="unassignBtn absolute opacity-0 top-0 left-0 w-full h-full flex items-center justify-center hover:bg-red-600/60 hover:opacity-100 duration-300  text-white rounded-full " 
      >
      <iconify-icon icon="lets-icons:back" width="24" height="24"  style="color: #130202"></iconify-icon>
      </button>

    `;

    workerDisplay.appendChild(workerBadge);
    
  });

  let unassignBtns = document.querySelectorAll('.unassignBtn');
    unassignBtns.forEach((btn)=>{
      btn.addEventListener("click", () => unassignWorkerFromRoom(btn.dataset.id , roomName) )
    })
  
  // Update room button
  let roomBtn = roomContainer.querySelector('.room-btn');
  if (assignWorkers[roomName].staff.length > 0) {
    roomBtn.innerHTML = `
      <iconify-icon icon="mdi:account-check" width="20" height="20"></iconify-icon>
      <span class="text-xs font-bold">${assignWorkers[roomName].staff.length}/${assignWorkers[roomName].max}</span>
    `;
    roomBtn.className = roomBtn.className.replace('bg-blue-600', 'bg-green-600').replace('hover:bg-blue-700', 'hover:bg-green-700');
  } else {
    roomBtn.innerHTML = `<iconify-icon icon="zondicons:add-solid" width="20" height="20"></iconify-icon>`;
    roomBtn.className = roomBtn.className.replace('bg-green-600', 'bg-blue-600').replace('hover:bg-green-700', 'hover:bg-blue-700');
  }
}
  


function ArrayByRole(role){
  switch(role){
    case 'reception':
      return workers.filter(worker=> worker.role == 'Receptionist' || 'Cleaning' ); 
    case 'servers':
      return workers.filter(worker=> worker.role == 'IT Guy' || 'Cleaning' );
    case 'security':
      return workers.filter(worker=> worker.role == 'Security' || 'Cleaning' );
    case 'vault':
      return workers.filter(worker=> !(worker.role == 'Cleaning') );
    default :
      return workers; 
  }
  }

  
  function unassignWorkerFromRoom(workerId, roomName) {
  
    console.log(workerId , roomName);
    
  
  const workerIndex = assignWorkers[roomName].staff.findIndex(w => w.id == workerId);
  
  if (workerIndex !== -1) {
    const worker = assignWorkers[roomName].staff[workerIndex];
    
    
    assignWorkers[roomName].staff.splice(workerIndex, 1);
    
   
    workers.push(worker);
    
    
    renderWorkers();
    renderRoomWorkers(roomName);
    
  }
}
  






