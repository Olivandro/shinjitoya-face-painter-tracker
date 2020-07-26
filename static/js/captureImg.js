let video = document.getElementById('stream-feed');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("capture");
const formData = new FormData();
var togglePosition = document.getElementById('stream-feed');   
var toggle = document.getElementById('face-tracker');


// Draw image
var context = canvas.getContext('2d');

toggle.addEventListener("click", function() {
    toggleMesh();
})

snap.addEventListener("click", function() {
    if (togglePosition.src == 'http://127.0.0.1:5000/mesh_feed') {
        alert('Please toggle face mesh off before capturing image');
    } else {

        context.drawImage(video, -400, 0, 1280, 720);
        let img = canvas.toDataURL("image/png");
        video.hidden = true;

        // Split the base64 string in data and contentType
        var block = img.split(";");
        // Get the content type of the image
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

        // Convert it to a blob to upload
        var blob = b64toBlob(realData, contentType);

        // Create a FormData and append the file with "image" as parameter name
        var filename = Date.now() + '-test-upload.png';
        var canvasLink = 'static/temp-images/' + filename;
        formData.append('file', blob, filename);

        window.localStorage.clear();
        window.localStorage.setItem('canvasPath',  canvasLink);
        console.log(window.localStorage.getItem('canvasPath'));

        // console.log(img);
        // console.log(blob);
        // console.log(formData);

        if (window.localStorage.getItem('canvasPath') != null) {

            console.log("something is wrong");
            
            fetch('http://127.0.0.1:5000/uploader', {
                method: 'POST',
                // Strangely Flask will not work if a header is included.....
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                //   },
                // headers: {
                //     'Access-Control-Allow-Origin':'*'
                //   },
                body: formData
            }).then(function(result) {
                window.location.href ='http://127.0.0.1:5000/canvas';
                return result;
            });
        } else {
            alert("session image not set");
        }

    }
    
});


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function toggleMesh()
{
    
    console.log(togglePosition.src);

    // Stream source has to be hard coded to insure js can toggle between clean and mesh video feeds
    if (togglePosition.src != 'http://127.0.0.1:5000/mesh_feed') {
        console.log('bang-1');
        togglePosition.src = 'http://127.0.0.1:5000/mesh_feed';
            
    } else {
        console.log('bang-2');
        togglePosition.src = 'http://127.0.0.1:5000/clean_feed';
    } 
}