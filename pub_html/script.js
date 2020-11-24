const slideDown = element => element.style.height = `${element.scrollHeight}px`;
const slideUp = element => element.style.height = `0px`;
function main(){
  let request = new XMLHttpRequest();
  let rec_area = document.getElementsByTagName('main')[0];
  request.open('GET', 'showRectangles', true);
  request.onload = function(){
    let data = JSON.parse(this.response);
    data.forEach((rec) => {
      makeCard(rec_area, rec);
     });
  }
  request.send();
}

function makeCard(area, rec){
  let cardWrapper = document.createElement('section');
  cardWrapper.className='card';
  let card = document.createElement('section');
  card.id='rectangle' + rec.id;

  let button = document.createElement('button');
  button.className ='del';
  button.appendChild(document.createTextNode('x'));
  button.addEventListener('click', () => {
    deleteRec(rec.id);
  });
  card.appendChild(button);

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.fillStyle = rec.color;
  ctx.fillRect(10, 10, rec.width, rec.height);
  ctx.stroke();
  card.appendChild(canvas);

  let edit = document.createElement('button');
  edit.className ='edit';
  edit.addEventListener('click', () => {
    editRectangle(rec);
  });
  edit.appendChild(document.createTextNode('edit'));
  card.appendChild(edit);

  let info = document.createElement('article');
  info.innerHTML = '<p> Width &#x2012; ' + rec.width + '<br> Height &#x2012; ' + rec.height + '<br> Area &#x2012; ' + rec.area + '<br> Diagonal &#x2012; ' + rec.diagonal;
  card.appendChild(info);


  cardWrapper.appendChild(card);

  let editBar = document.createElement('section')
  editBar.className="wrapper";
  editBar.id="wrapper"+rec.id;
  editBar.innerHTML = slidePanel(rec.id);
  cardWrapper.appendChild(editBar);
  area.appendChild(cardWrapper);
}

function deleteRec(rec){
  //console.log("Delete rectangle ", id);
  let request = new XMLHttpRequest();
  request.open('POST', 'deleteRectangle', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onreadystatechange = function(){
    if(request.status === 200){
      console.log(request.responseText);
      location = location; // reload the page
    } else {
      console.log("Yikes!")
    }
  };
  let data = JSON.stringify({id: rec});
  request.send(data);
}

function editRectangle(rec){
  let element = document.getElementById('wrapper'+rec.id);
  if(element.classList.contains('open')){
    slideUp(element);
    element.className = 'wrapper'
  }else{
    slideDown(element);
    element.className += ' open'; 
  }

  let widthElement = document.getElementById('widthEdit'+rec.id);
  widthElement.value = rec.width;
  let heightElement = document.getElementById('heightEdit'+rec.id);
  heightElement.value = rec.height;
  let colorElement = document.getElementById('colorEdit'+rec.id);
  colorElement.value = rec.color;

  document.getElementById('submitButton'+rec.id).addEventListener("click", () => {
    let request = new XMLHttpRequest();
    request.open('POST', 'editRectangle', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = function(){
    if(request.status === 200){
      console.log(request.responseText);
      location = location; // reload the page
    } else {
      console.log("Yikes!")
    }
  };
  let data = JSON.stringify({id: rec.id, width: widthElement.value, height: heightElement.value, color: colorElement.value});
  request.send(data);
  })
}

function slidePanel(rec){
  return `
  <section class='slideBar'>
    <h3>Edit rectangle</h3>
    <form class='editForm' id='edit${rec}'>
        <label for="width${rec}">Width</label>
        <input type="number" id="widthEdit${rec}" name="width${rec}" min="1" value="1" required>
        <br>
        <label for="height${rec}">Height</label>
        <input type="number" name="height${rec}" id="heightEdit${rec}" min="1" value="1" required>
        <br>
        <label for="color${rec}">Colour</label>
        <input type="color" name="color${rec}" id="colorEdit${rec}" value="#000000"> <br><br>
        <button id="submitButton${rec}">submit changes</button>
    </form>
  </section>`
}





