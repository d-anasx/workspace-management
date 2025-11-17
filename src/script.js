let workers = [];

let workerForm = document.querySelector('#workerForm');
workerForm.addEventListener('submit',submitWorkerData);

function renderWorkers(){
    let workersList = document.querySelector('.workers');
    workersList.innerHTML = '';

    workers.forEach((worker)=>{
        workersList.innerHTML += `
            <div
            class="mt-6 bg-linear-to-r from-zinc-400 to-indigo-200 rounded-xl p-1 px-2 flex items-center gap-4 hover:shadow duration-300"
          >
            <img
              src="assets/avatar.png"
              class="w-12 h-12 rounded-full border object-cover"
            />
            <div class="flex-1">
              <h2 class="font-semibold">${worker.name}</h2>
              <p class="text-gray-500 text-sm">${worker.role}</p>
            </div>
            <button class="text-blue-600 font-medium">Edit</button>
          </div>
    `;;
    })
}

function submitWorkerData(e){
    e.preventDefault()
    document.getElementById("workerModal").close();
    let personalInputs = workerForm.querySelectorAll(".personal");
    let experienceBlocks = workerForm.querySelectorAll(".experience");
    let workerObject = {};
    let experiences = [];


    experienceBlocks.forEach((exp)=>{
        let expInputs = exp.querySelectorAll("input");
        let expObject = {};
        expInputs.forEach((input)=>{
            expObject[input.name] = input.value;
        });
        experiences.push(expObject)
        
    })
    
        personalInputs.forEach((input)=>{
            workerObject[input.name] = input.value
    })
    workerObject.experiences = experiences
    workers.push(workerObject)
    console.log(workers)
    workerForm.reset()
    renderWorkers()
}