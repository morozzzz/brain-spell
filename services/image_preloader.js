export default function preloadImages(sources) {
    
    function uploadImage(source) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = source;
            image.onload = () => {
                resolve();
            }
            image.onerror = () => {
                reject(error);
            }
        });        
    }  

    return Promise.all(sources.map(uploadImage));        
}