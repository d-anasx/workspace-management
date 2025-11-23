import { validateInput, validateDateRange } from "./support/validation.js";

const API = "data/workers.json";
let workers = [];
let assignWorkers = {
  conference: { staff: [], max: 6 },
  servers: { staff: [], max: 2 },
  security: { staff: [], max: 2 },
  reception: { staff: [], max: 6 },
  staff: { staff: [], max: 2 },
  vault: { staff: [], max: 2 },
};
let idCounter = 11;
let idToModify;
let isValidURL = false;
let workerForm = document.querySelector("#workerForm");
let pictureInput = document.querySelector("#worker_photo");
let addExpButton = document.querySelector("#addExp");
let addWorkerButton = document.querySelector("#addWorkerBtn");
let assignButtons = document.querySelectorAll(".room-btn");
let searchInput = document.getElementById("search");
let autoAssignBtn = document.getElementById("autoAssignBtn");
let floorPlanGrid = document.querySelector('.floor-plan-grid');

workerForm.addEventListener("submit", (e) => submitWorkerData(e, idToModify));
pictureInput.addEventListener("input", picturePreview);
addExpButton.addEventListener("click", addExperience);
addWorkerButton.addEventListener("click", cleanModal);
assignButtons.forEach((btn) => {
  btn.addEventListener("click", handleAssign);
});
searchInput.addEventListener("input", handleSearchInput);
autoAssignBtn.addEventListener("click", autoAssignWorkers);
floorPlanGrid.addEventListener('dragover', dragoverHandler);
floorPlanGrid.addEventListener('drop', dropHandler);
window.fillWorkerForm = fillWorkerForm;
window.openWorkerModalDetails = openWorkerModalDetails;
window.dragstartHandler = dragstartHandler;

window.addEventListener("beforeunload", (e) => {
  let data = {workersArray : workers , assignedWorkers : assignWorkers}
  localStorage.setItem("data", JSON.stringify(data));
});

// function that render workers
function renderWorkers(filtredWorkers = null) {
  if (!filtredWorkers) {
    filtredWorkers = workers;
  }
  let workersList = document.querySelector(".workers");
  workersList.innerHTML = "";

  if (filtredWorkers.length == 0) {
    workersList.innerHTML = `
      <div class="flex justify-center opacity-40">
          <p>no data found</p>
            <iconify-icon
              icon="lets-icons:sad-light"
              width="24"
              height="24"
            ></iconify-icon>
      </div>    
          `;
  } else {
    filtredWorkers.forEach((worker) => {
      workersList.innerHTML += `
            <div draggable="true" ondragstart="window.dragstartHandler(event,${worker.id})" class="workerDiv w-fit group mt-4 p-2 rounded-2xl bg-linear-to-r from-slate-100 to-indigo-50 shadow-sm 
              hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center">

    <img src="${worker.url}" 
          alt="${worker.name}"
         class="w-12 h-12 rounded-full border border-indigo-200 shadow-sm object-cover hover:cursor-pointer"
         onclick="window.openWorkerModalDetails(${worker.id})"
         width="48" height="48"
          />
        
    <div class="w-[7em]">
      <h2 
        onclick="window.openWorkerModalDetails(${worker.id})"
        class="text-sm font-semibold text-gray-800 cursor-pointer group-hover:text-indigo-600 
               transition-all duration-200">
        ${worker.name}
      </h2>

      <p class="text-xs text-gray-500 mt-0.5">${worker.role}</p>
    </div>

    <button 
      command="show-modal"
      commandfor="workerModal"
      aria-label="Modifier les informations de ${worker.name}"
      onclick="window.fillWorkerForm(${worker.id});"
      class="p-2 rounded-xl flex items-center hover:bg-indigo-100 transition-all duration-200">
      
      <iconify-icon icon="solar:pen-bold-duotone" 
                     
                    class="text-indigo-600 "></iconify-icon>
    </button>
  </div>
    `;
    });
    workersList.childNodes.forEach((div) => {
      handleTransition(
        div,
        "workerDiv mt-6 bg-linear-to-r from-zinc-400 to-indigo-200 rounded-xl p-1 px-2 flex items-center shadow gap-4 hover:shadow-md duration-300"
      );
    });
  }
}

//function that handle the submit of the form
function submitWorkerData(e, id = null) {
  e.preventDefault();

  let personalInputs = workerForm.querySelectorAll(".personal");
  let experienceBlocks = workerForm.querySelectorAll(".experience");
  let workerObject = {};
  let experiences = [];
  let isValidate = true;

  //  Validate personal inputs
  personalInputs.forEach((input) => {
    let validationResult = validateInput(input.value, input.name);
    console.log(`input.value: ${input.value},  input.name: ${input.name}`)
    if (!validationResult.valid) {
      input.nextElementSibling.textContent = validationResult.error;
      isValidate = false;
    } else {
      input.nextElementSibling.textContent = "";
      workerObject[input.name] = input.value;
    }
  });

  // Validate experiences inputs
  experienceBlocks.forEach((exp) => {
    let expInputs = exp.querySelectorAll("input");
    let expObject = {};
    let fromDate = "";
    let toDate = "";

    expInputs.forEach((input) => {
      let result = validateInput(input.value, input.name);

      if (!result.valid) {
        input.nextElementSibling.textContent = result.error;
        isValidate = false;
      } else {
        input.nextElementSibling.textContent = "";
        expObject[input.name] = input.value;
      }

      if (input.name === "from") fromDate = input.value;
      if (input.name === "to") toDate = input.value;
    });

    const dateResult = validateDateRange(fromDate, toDate);

    if (!dateResult.valid) {
      const toInput = [...expInputs].find((i) => i.name === "to");
      toInput.nextElementSibling.textContent = dateResult.error;
      isValidate = false;
    } else {
      experiences.push(expObject);
    }
  });

  // submit if is valid
  if (isValidate) {
    console.log(isValidURL);

    if (!isValidURL) workerObject.url = generateImage(workerObject.name);

    if (id) {
      modifyoldWorker(id, workerObject, experiences);
    } else {
      addNewWorker(workerObject, experiences);
    }

    // cleanup
    idToModify = null;
    isValidURL = true;
    cleanModal();
    document.getElementById("workerModal").close();
    renderWorkers();
    document.querySelector(".experiences-container").innerHTML = "";
  }
}

//adding the new worker to array
function addNewWorker(workerObject, experiences) {
  workerObject.id = idCounter++;
  workerObject.position = "unassigned";
  workerObject.experiences = experiences;
  workers.push(workerObject);
}

//changing old worker infos by new onces
function modifyoldWorker(id, workerObject, experiences) {
  let index = workers.findIndex((w) => w.id === id);
  workerObject.id = id;
  workerObject.experiences = experiences;
  workers[index] = workerObject;
}

// image generator function
function generateImage(name){
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

  let svg =  `
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <rect width="120" height="120" fill="#${color}" />
    <text x="50%" y="50%" font-size="48" font-family="Arial, sans-serif"
      fill="white" text-anchor="middle" dominant-baseline="middle">
      ${initials}
    </text>
  </svg>`;
  console.log(btoa(svg))
  return "data:image/svg+xml;base64," + btoa(svg);
}

//function that handle the preview of the picture
function picturePreview(e) {
  let img = document.querySelector("#picture");
  let url = pictureInput.value;

  img.onload = () => {
    isValidURL = true;
  };
  img.onerror = () => {
    isValidURL = false;
    console.log('error');
    
  };

  img.src = url;
}

//adding exp form
function addExperience(exp = null) {
  let exp_container = document.querySelector(".experiences-container");
  let div = document.createElement("div");
  div.className = "shadow-xl rounded-lg p-4 experience mb-3 bg-white/80";
  div.innerHTML += `
                        <div class="mb-3">
                          <label class="block text-gray-600 text-sm mb-1">Company:</label>
                          <input value="${
                            exp.company ? exp.company : ""
                          }" type="text" name="company" placeholder="Itaque ab voluptatem" class="worker_company w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3"> <label class="block text-gray-600 text-sm mb-1"> Role: </label>
                          <input value="${
                            exp.expRole ? exp.expRole : ""
                          }" type="text" name="expRole" placeholder="Qui laudantium perf" class="worker_expRole w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3">
                          <label class="block text-gray-600 text-sm mb-1"> From: </label>
                          <input value="${
                            exp.from ? exp.from : ""
                          }" type="date" name="from" class="worker_from_date w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
                        <div class="mb-3"> <label class="block text-gray-600 text-sm mb-1"> To: </label>
                          <input value="${
                            exp.to ? exp.to : ""
                          }" type="date" name="to" class="worker_to_date w-full px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow shadow-sm"
                          /><span class="text-red-600" ></span>
                        </div>
    `;

  exp_container.appendChild(div);

  handleTransition(div, div.classList);
}

//filling worker modal while modifying
function fillWorkerForm(workerId) {
  idToModify = parseInt(workerId);
  let worker = workers.find((w) => w.id === idToModify);

  workerForm.querySelectorAll(".personal").forEach((input) => {
    input.value = worker[input.name] || "";
  });

  if (worker.url) {
    document.querySelector("#picture").src = worker.url;
    pictureInput.value = worker.url;
  }

  let exp_container = document.querySelector(".experiences-container");
  exp_container.innerHTML = "";

  worker.experiences.forEach((exp) => {
    addExperience(exp);
  });
}

//open worker modal infos
function openWorkerModalDetails(workerId, roomName = null) {
  console.log(roomName);
  let worker = roomName
    ? assignWorkers[roomName].staff.find((worker) => worker.id == workerId)
    : workers.find((worker) => worker.id == workerId);

  let detailsContainer = document.getElementById("details-container");

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

          <div>
            <p class="text-sm text-gray-500">Position</p>
            <p class="font-medium text-gray-800">${worker.position}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Experience</h4>
        
        ${
          worker.experiences && worker.experiences.length > 0
            ? worker.experiences
                .map(
                  (exp, index) => `
              <div class="mb-4 last:mb-0 p-3 bg-white rounded-lg shadow-sm">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h5 class="font-semibold text-gray-800">${exp.expRole}</h5>
                    <p class="text-sm text-blue-600">${exp.company}</p>
                  </div>
                  <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">#${
                    index + 1
                  }</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <iconify-icon icon="mdi:calendar" width="16" height="16"></iconify-icon>
                  <span>${formatDate(exp.from)} - ${formatDate(exp.to)}</span>
                </div>
              </div>
            `
                )
                .join("")
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

//function to format date
function formatDate(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString();
}

//creating smooth transition
function handleTransition(div, classes = "") {
  div.className =
    classes +
    " " +
    "opacity-0 scale-120  -translate-y-2 transition-all duration-300";
  setTimeout(() => {
    div.className =
      classes +
      " " +
      "opacity-120 scale-100 translate-y-0 transition-all duration-300";
  }, 10);

  setTimeout(() => {
    div.className =
      classes +
      " " +
      "opacity-100 scale-none translate-y-0 transition-all duration-300";
  }, 10);
}

//cleaning worker modal
function cleanModal() {
  workerForm.reset();
  document.getElementById("picture").src = "";
}

//handling the + icon in each room
function handleAssign() {
  document.getElementById("openAssignModal").click();
  let roomName = this.dataset.roomName;
  let workersToAssignArray = ArrayByRole(roomName);

  diplayUnassigned(workersToAssignArray);

  // adding event listener for each worker
  document.querySelectorAll(".assign-worker-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const workerId = this.dataset.workerId;
      assignWorkerToRoom(workerId, roomName);
    });
  });

  //making cards clickable
  document.querySelectorAll(".worker-card").forEach((card) => {
    card.addEventListener("click", function () {
      const workerId =
        this.querySelector(".assign-worker-btn").dataset.workerId;
      openWorkerModalDetails(workerId);
    });
  });
}

//ui for workers to assign diplayed
function diplayUnassigned(workersToAssignArray) {
  let workersToAssignContainer = document.getElementById("list-to-assign");

  workersToAssignContainer.innerHTML = "";

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
      ${workersToAssignArray
        .map(
          (worker) => `
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
      `
        )
        .join("")}
    </div>
  `;
}

//function that change worker from the array to assignedWorkers
function assignWorkerToRoom(workerId, roomName) {
  console.log(workerId, roomName);

  let worker = workers.find((w) => w.id == workerId);
  console.log(assignWorkers);
  

  if (assignWorkers[roomName].staff.length >= assignWorkers[roomName].max) {
    alert(
      `${roomName} is at maximum capacity (${assignWorkers[roomName].max} workers)`
    );
    return;
  }

  //changing worker position
  worker.position = roomName;
  assignWorkers[roomName].staff.push(worker);
  let workerIndex = workers.findIndex((w) => w.id == workerId);
  if (workerIndex !== -1) {
    workers.splice(workerIndex, 1);
  }
  renderWorkers();
  renderRoomWorkers(roomName);
  document.getElementById("closeAssignModal").click();
}


// function that render ui of assigned workers 
function renderRoomWorkers(roomName) {
  let roomContainer = document.querySelector(`.${roomName.toLowerCase()}`);

  let workerDisplay = roomContainer.querySelector(".room-workers");
  workerDisplay.innerHTML = "";

  // Add worker badges
  assignWorkers[roomName].staff.forEach((worker) => {
    const workerBadge = document.createElement("div");
    workerBadge.className =
      " relative bg-white/95 backdrop-blur-sm flex items-center flex-nowrap w-fit h-fit rounded-full  shadow-lg hover:bg-white transition-all cursor-pointer";

    workerBadge.innerHTML = `
      
      <iconify-icon onclick="openWorkerModalDetails(${worker.id},'${roomName}')" 
      class="absolute -right-4 -top-2 p-0.5 rounded-full flex items-center justify-center hover:bg-blue-400/60 duration-300" icon="material-symbols:info-outline-rounded" width="24" height="24"  style="color: #0b5d93"></iconify-icon>
      
      <img 
        src="${worker.url}" 
        alt="${worker.name}"
        class="w-10 h-10 rounded-full object-cover"
        width="48" height="48"
      />
      <button data-id = "${worker.id}" aria-label="Retirer ${worker.name} de ${roomName}"
        class="unassignBtn absolute opacity-0 top-0 left-0 w-full h-full flex items-center justify-center hover:bg-red-600/60 hover:opacity-100 duration-300  text-white rounded-full " 
      >
      <iconify-icon icon="lets-icons:back" width="24" height="24"  style="color: #130202"></iconify-icon>
      </button>

    `;

    workerDisplay.appendChild(workerBadge);
  });

  //adding event listener to each button so we can unassign a worker
  let unassignBtns = document.querySelectorAll(".unassignBtn");
  unassignBtns.forEach((btn) => {
    btn.addEventListener("click", () =>
      unassignWorkerFromRoom(btn.dataset.id, roomName)
    );
  });

  // Update UI - room button and red overlay
  updateUiAfterAssign(roomName, roomContainer)
}

//function that update room ui (room button, overlay..) after assign
function updateUiAfterAssign(roomName, roomContainer){
  let roomBtn = roomContainer.querySelector(".room-btn");
  if (assignWorkers[roomName].staff.length > 0) {
    roomContainer.querySelector(".overlay").hidden = true;
    roomBtn.innerHTML = `
      <iconify-icon icon="mdi:account-check" width="20" height="20"></iconify-icon>
      <span class="text-xs font-extrabold drop-shadow-sm">${assignWorkers[roomName].staff.length}/${assignWorkers[roomName].max}</span>
    `;
    roomBtn.className = roomBtn.className
      .replace("bg-blue-600", "bg-green-600")
      .replace("hover:bg-blue-700", "hover:bg-green-700");
  } else {
    roomContainer.querySelector(".overlay").hidden = false;
    roomBtn.innerHTML = `<iconify-icon icon="zondicons:add-solid" width="20" height="20"></iconify-icon>`;
    roomBtn.className = roomBtn.className
      .replace("bg-green-600", "bg-blue-600")
      .replace("hover:bg-green-700", "hover:bg-blue-700");
  }
  if (assignWorkers[roomName].staff.length == assignWorkers[roomName].max){
    roomBtn.className = roomBtn.className.replace("bg-green-600", "bg-red-600")
                                          .replace("hover:bg-green-700", "hover:bg-red-700");
      roomBtn.disabled = true;
  }else{
    roomBtn.className = roomBtn.className.replace("bg-red-600", "bg-green-600")
                                          .replace("hover:bg-red-700", "hover:bg-green-700");
    roomBtn.disabled = false;
  }
}

// returns array of possible workers that can enter a room
function ArrayByRole(room) {
  switch (room) {
    case "reception":
      return workers.filter(
        (worker) =>
          worker.role === "Receptionist" ||
          worker.role === "Cleaning" ||
          worker.role === "Manager"
      );
    case "servers":
      return workers.filter(
        (worker) =>
          worker.role === "IT Guy" ||
          worker.role === "Cleaning" ||
          worker.role === "Manager"
      );
    case "security":
      return workers.filter(
        (worker) =>
          worker.role === "Security" ||
          worker.role == "Cleaning" ||
          worker.role === "Manager"
      );
    case "vault":
      return workers.filter((worker) => !(worker.role === "Cleaning"));
    default:
      return workers;
  }
}

// returns worker from his work room to unassigned
function unassignWorkerFromRoom(workerId, roomName) {

  const workerIndex = assignWorkers[roomName].staff.findIndex(
    (w) => w.id == workerId
  );

  if (workerIndex !== -1) {
    let worker = assignWorkers[roomName].staff[workerIndex];

    assignWorkers[roomName].staff.splice(workerIndex, 1);

    //changing worker position to unassigned
    worker.position = "unassigned";
    workers.push(worker);

    renderWorkers();
    renderRoomWorkers(roomName);
  }
}

//function that handle search input for filtring the workers by role and name
function handleSearchInput(e) {
  let searchTerm = e.target.value.toLowerCase();
  let filtred = workers.filter(
    (worker) =>
      worker.role.toLowerCase().includes(searchTerm) ||
      worker.name.toLowerCase().includes(searchTerm)
  );
  console.log(workers);
  renderWorkers(filtred);
}

//auto assigning workers by zones priority
function autoAssignWorkers() {
  let priorityZones = ["reception", "security", "servers"];
  let allZones = ["conference", "servers", "security", "reception", "staff", "vault"];



  while(workers.length > 0){
       workers.forEach((worker) => {
    
      let possibleRooms = priorityZones.filter(room => canAssign(worker.id , room))
      if(possibleRooms.length === 0 ) return;

      let randomRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]
      if (assignWorkers[randomRoom].staff.length >= assignWorkers[randomRoom].max)
        return;
         

      // Assign worker
      worker.position = randomRoom;
      assignWorkers[randomRoom].staff.push(worker);

      // Remove from workers array
      let idToRemove = workers.findIndex((w) => w.id == worker.id);
      if (idToRemove !== -1) workers.splice(idToRemove, 1);

   
    
  });

  //assign remaining workers to any other room
  
  
  workers.forEach((worker) => {
    let possibleRooms = allZones.filter(room => canAssign(worker.id, room));
    
    if (possibleRooms.length === 0) return;

    let randomRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)];

    if (assignWorkers[randomRoom].staff.length >= assignWorkers[randomRoom].max)
      return;

    // Assign worker
    worker.position = randomRoom;
    assignWorkers[randomRoom].staff.push(worker);

    // Remove from workers array
    let idx = workers.findIndex((w) => w.id == worker.id);
    if (idx !== -1) workers.splice(idx, 1);
  });

  }
  // assign to priority zones
 
  renderWorkers();
  allZones.forEach(r => renderRoomWorkers(r));
}

//function returns true or false if can a worker enter a specific room
function canAssign(workerId, room) {
  let possibleWorkers = ArrayByRole(room);
return possibleWorkers.some((w) => w.id === workerId);

}


//-----------drag and drop functions-----------

function dragstartHandler(ev,workerId) {
  ev.dataTransfer.setData("worker-id", workerId);
  console.log('start');
  
}


function dragoverHandler(ev) {
  ev.preventDefault();
  let roomDiv = ev.target.closest('[data-room-name]');
  roomDiv.style.opacity = '0.8'; 
  
}

function dropHandler(ev) {
  ev.preventDefault();
  let workerId = ev.dataTransfer.getData("worker-id");
  let roomDiv = ev.target.closest('[data-room-name]');
  let roomName = roomDiv.dataset.roomName;
  
  console.log(roomName);
  assignWorkerToRoom(workerId, roomName);
  
  document.querySelectorAll('[data-room-name]').forEach(room => {
    room.style.opacity = '1';
  });
}
//----------------------------------------------

// getting data from localstorage if exists or fetching it
async function getData() {
  if (localStorage.getItem("data")) {
    let data = JSON.parse(localStorage.getItem("data"));
    workers = data.workersArray;
    assignWorkers =  data.assignedWorkers;
    renderWorkers();
    for(let room in assignWorkers){
      renderRoomWorkers(room)
    }
    return;
  }

  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    let data = await response.json();
    console.log(data)
    localStorage.setItem("data", JSON.stringify(data));
    workers = data.workersArray;
    assignWorkers =  data.assignedWorkers;
    renderWorkers();
  } catch (error) {
    console.error(error.message);
  }
}

getData();
