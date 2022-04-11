

export function readFileDataAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (err) => {
            reject(err);
        };

        reader.readAsArrayBuffer(file);
    });
}

export const handleUploadImageThumbnail = async (e, id) => {
    try {
        if (FileReader && e.target.files[0]) {
            var file = e.target.files[0];
            var fr = new FileReader();
            fr.onload = function () {
                document.getElementById(id).src = fr.result;
            }
            fr.readAsText(file);
        }
    } catch (error) { }
};