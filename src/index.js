async function activate(app) {

  window.addEventListener("message", (event) => {
    const { documentId } = event.data;

    // Ensure the message comes from the expected origin
    if (event.origin !== 'https://rr.alkemata.com') {
      console.log('Erreor: wrong parent origin');
      return;
    }

    // Fetch the notebook data with the JWT and documentId
    console.log('Message received from parent ', documentId)
    //fetchNotebookData(documentId);
  }, false);
}

const extension = {
  activate,
  autoStart: true,
  id: "jupyter_flask_ext",
  optional: [ILauncher],
  requires: [IMainMenu, IFileBrowserFactory],
};

export default extension;
export {activate as _activate};
