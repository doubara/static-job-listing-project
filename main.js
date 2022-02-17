let checkerArr = []
const Jobs = async function(){
  let Data = await fetch('data.json')
  return Data.json()
}
Jobs().then(data=>{
  globalData = data
  newData = data
  populate(data)
  filterArrFunc(data)
  clearModal()
  removeElement()
})

function populate(data){
  const wrapper = document.querySelector('.wrapper')
  const jobArr = data.map((val, index) => {
    const filterButtons = [...val.languages, ...val.tools].map(btn=>{
      return `<button data_id=${btn} class="job__btn">${btn}</button>`
    })
    const spans = ['new', 'featured'].map(span=>{
      if (val[span]){
        return `<span class="job__custom-btn ${span}--btn">${span}</span>`
      }
      else return ''
    })
    return `
    <div class="job job--${val.id}">
           <figure class="job__figure">
              <img class="job__image" src=${val.logo} alt="" />
            </figure>
            <div class="job__content">
              <p class="job__company">${val.company}</p>
              ${spans.join(' ')}
              <h2 class="job__role">${val.position}</h2>
              <p class="job__status"><span class='job--post'>${val.postedAt}</span> <span class="dot--align">.</span> <span class='job--contract'>${val.contract}</span> <span class="dot--align">.</span> <span class='job--locate'>${val.location}</span></p>
            </div>
            <div class="job__filter">
              <button class="job__btn">${val.role}</button>
              ${filterButtons.join(' ')}
            </div>
          </div>
    `
  })
  wrapper.innerHTML = jobArr.join(' ')
}

function filterArrFunc(data){
  const wrapper = document.querySelector('.wrapper')
  wrapper.addEventListener('click', (e)=>{
    if (e.target.classList.contains('job__btn')){
      if (checkerArr.indexOf(e.target.textContent) === -1){
        checkerArr.push(e.target.textContent)
      }
      filterJobs()
      showModal(true)
      populateModal()
    }else return
    
  })
}

function filterJobs(){
  console.log(checkerArr)
  newData = newData.filter(obj=>{
    if (checkerArr.every(function(element) {
        return [...obj.languages, ...obj.tools, obj.role].includes(element)
      })){
        return obj
      }
  })
  populate(newData)
}

function populateModal(){
  const modal = document.querySelector('.modal__container')
  const buttons = checkerArr.map(val =>{
    return `
          <div class='modal__div'>
            <p class='modal__text'>${val}</p>
            <button class='modal__remove'><i class='fas fa-times'></i></button>
          </div>
          `
  })
  modal.innerHTML = buttons.join(' ')
}
function showModal(isValid){
  const modal = document.querySelector('.modal')
  const main = document.querySelector('.main')
  if (isValid){
    modal.classList.add('show--modal')
    main.classList.add('padding-top')
  }
  else modal.classList.remove('show--modal')
  main.classList.add('margin--top')
}

function clearModal(){
  const clearBtn = document.querySelector('.modal__clear')
  clearBtn.addEventListener('click', ()=>{
    clearModalFunc()
  })
}
function clearModalFunc(){
  const modalContainer = document.querySelector('.modal__container')
  modalContainer.innerHTML = ''
  showModal(false)
  newData = globalData
  checkerArr = []
  populate(globalData)
}
function removeElement(){
  const modalContainer = document.querySelector('.modal__container')
  modalContainer.addEventListener('click', (e)=>{
    let parent = e.target.parentElement
    let parentDiv = parent.parentElement
    if (parent.classList.contains('modal__remove')){
      let value = parent.previousElementSibling.textContent
      if (checkerArr.includes(value)){
        checkerArr.splice(checkerArr.indexOf(value), 1);
        newData = globalData
        removeChild(parentDiv)
        filterJobs()
      }
    }
    else return
  })
}
function removeChild(child){
  const modalContainer = document.querySelector('.modal__container')
  if (checkerArr.length === 0){
    clearModalFunc()
  }
  else {
    modalContainer.removeChild(child)
  }
}