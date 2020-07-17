// THIS FILE HANDLES UPLOADING AND RESIZING OF P5 CANVAS

// we need to fist grab the file input and all the canvases in the program
// then we can set the new size for the p5 canvas and hopefully just use resetSketch() so that p5 handles resizing of graphics elements

var p5canvas;

// this function needs to be an async callback!
setTimeout(function(){
    var fileInput = document.querySelector('#fileInput');
    p5canvas = document.querySelector('#myP5canvas1');
}, 3000)

fileInput.onchange = function (e) {
    onFileChange(e, fileInput.files);
};

function onFileChange(e, files) {
    console.log("onFileChange...");
    console.log("fileInput.files: ", files);

    var ctx = p5canvas.getContext("2d");
    var img = new Image();
    img.onload = function() { 
        resizeCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);

    };

    img.src = './img/' + files[0].name;

    // the following lines are never executed but the max width and height should be implemented above
    var reader = new FileReader(files[0]);
    reader.onload = function (event) {
        console.log("reader.onLoad running...")
        img = new Image();
        img.onload = function () {
            if (img.width < 2500 && img.height < 2500) {
                canvasScale = 1;
            } else {
                canvasScale = Math.min(2500 / img.width, 2500 / img.height);
            }

            p5canvas.width = img.width * canvasScale;
            p5canvas.height = img.height * canvasScale;

            face = loadImage(img);
            resetSketch();

        };
        img.src = event.target.result;
    };

}