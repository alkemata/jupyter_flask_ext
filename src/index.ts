import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IDocumentManager
} from '@jupyterlab/docmanager';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

/**
 * Initialization data for the json-message-extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'json-message-extension',
  autoStart: true,
  requires: [IDocumentManager, INotebookTracker],
  activate: (app: JupyterFrontEnd, docManager: IDocumentManager, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension json-message-extension is activated!!');
    window.parent.postMessage("ready", "https://rr.alkemata.com");

    app.restored.then(() => {
      // Wait until JupyterLab UI is ready
      console.log('waiting for message')
      window.addEventListener('message', async (event) => {
        console.log(event)
        if (event.origin !== "https://rr.alkemata.com") return; // Secure check

        const { id } = event.data;
        console.log('==========',id)

        if (id) {
          try {
            // Fetch the JSON document from the server
            const response = await fetch(`http://rr.alkemata.com/api/notebooks/${id}`);
            const json = await response.json();

            console.log(json);            

          } catch (error) {
            console.error('Error fetching the JSON document or populating the notebook:', error);
          }
        }
      });
    });
  }
};

export default extension;

