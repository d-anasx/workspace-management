import { validateInput } from "./support/validation.js";

let workers = [];
let idCounter = 0;
let idToModify ;
let workerForm = document.querySelector('#workerForm');
let pictureInput = document.querySelector('#worker_photo');
let addExpButton = document.querySelector('#addExp');
let addWorkerButton = document.querySelector('#addWorkerBtn');
workerForm.addEventListener('submit',(e)=>submitWorkerData(e,2));
pictureInput.addEventListener('input',picturePreview);
addExpButton.addEventListener("click",addExperience)
addWorkerButton.addEventListener("click",fillWorkerForm)



// function that render workers
function renderWorkers(){
    let workersList = document.querySelector('.workers');
    workersList.innerHTML = '';

    workers.forEach((worker)=>{
        workersList.innerHTML += `
            <div
            class="mt-6 bg-linear-to-r from-zinc-400 to-indigo-200 rounded-xl p-1 px-2 flex items-center shadow gap-4 hover:shadow-md duration-300"
          >
            <img
              src="${worker.url ? worker.url : 'assets/avatar.png' }"
              class="w-10 h-10 rounded-full border object-cover"
            />
            <div class="flex-1">
              <h2 class="font-semibold text-sm">${worker.name}</h2>
              <p class="text-gray-500 text-xs">${worker.role}</p>
            </div>
            <button class="font-medium">
            <iconify-icon class="text-green-600" icon="solar:pen-bold-duotone" width="24" height="24"></iconify-icon>
            </button>
          </div>
    `;;
    })
}

//function that handle the submit of the form
function submitWorkerData(e,id = null){
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
        workerObject.id = idCounter++;
        workerObject.experiences = experiences;
        workers.push(workerObject);
        workerForm.reset();
        document.getElementById("workerModal").close();
        renderWorkers();
    }
}

//function that handle the preview of the picture
function picturePreview(e){
    document.querySelector("#picture").src = e.target.value
    console.log(e)
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

    exp_container.appendChild(div)
}


function fillWorkerForm(){
        //filing form if id not null and modifying with submit function
}


