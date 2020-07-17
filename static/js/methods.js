////////////////////////
// oneline for changing the global composite operation
function changeGlobalComposite(operation) { p5.instance.drawingContext.globalCompositeOperation = operation; }

///////////////////////
// function for shuffling and introduces randomness to the painting
function shuffleVar() {
    let val = floor(random(0, 255) + 1);
    document.getElementById("shuffleNo").innerHTML = "random " + val; 
}

function switchSmlBrush() { 
    brushSize = 15; 
    document.querySelector('#brushMed').classList.toggle('toggled');
    document.querySelector('#brushSml').classList.toggle('toggled');
}

function switchMedBrush() { 
    brushSize = 38; 
    document.querySelector('#brushMed').classList.toggle('toggled');
    document.querySelector('#brushSml').classList.toggle('toggled');
}

function switchBrushSize(size) { brushSize = size; }

function switchBrushType(type) {
    brushType = type;
    document.querySelector('#brushType1').classList.toggle('toggled');
    document.querySelector('#brushType2').classList.toggle('toggled');
    // brushType needs to be incremented with 1 to convert the array number to regular number
    // document.querySelector('#paintType').innerHTML = "Brushtype: " + (brushType + 1);    
}