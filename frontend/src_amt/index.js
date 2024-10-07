// index.js
function uploadFile() {
    const BACK = '5000'
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);

    fetch(`localhost:${BACK}/upload`, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

