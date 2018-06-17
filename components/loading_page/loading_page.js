export default function createLoadingPage() {
    const loadingPage = {};
    const spinner = new Image();
    const loadingPageText = document.createElement('div');

    let parentElement;

    loadingPageText.innerHTML = 'loading';
    loadingPageText.classList.add('loading-page-text');

    loadingPage.body = document.createElement('div');
    loadingPage.body.classList.add('loading-page');

    spinner.src = './resources/images/loading_page/spinner.gif';
    spinner.classList.add('spinner');

    loadingPage.body.appendChild(loadingPageText);
    loadingPage.body.appendChild(spinner);

    loadingPage.show = (parent) => {
        parentElement = parent;
        parentElement.appendChild(loadingPage.body);
    }

    loadingPage.remove = () => {
        parentElement.removeChild(loadingPage.body);
    }

    return loadingPage;
}