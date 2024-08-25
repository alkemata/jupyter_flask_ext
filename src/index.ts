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

import { NotebookPanel } from '@jupyterlab/notebook';
import { NotebookModel } from '@jupyterlab/notebook';

/**
 * Initialization data for the json-message-extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'json-message-extension',
  autoStart: true,
  requires: [IDocumentManager, INotebookTracker],
  activate: (app: JupyterFrontEnd, docManager: IDocumentManager, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension json-message-extension is activated!!!');


    app.restored.then(() => {
      // Wait until JupyterLab UI is ready

      console.log('waiting for message')
      window.addEventListener('message', async (event) => {
        console.log(event)
        if (event.origin !== "https://rr.alkemata.com") return; // Secure check

        const id  = event.data.documentId;
        console.log('==========',id)

        if (id) {
          try {
            // Fetch the JSON document from the server
            const response = await fetch(`https://rr.alkemata.com/api/notebooks/${id}`, {
              method: 'GET',
              // Important: Ensure cookies are included in the request
              credentials: 'include'
            });
            const notebook = await response.json();
            // Create a new file in JupyterLab and add content
            const newFilePath = `Untitled.ipynb`;

            const newNotebook = await docManager.newUntitled({
              path: newFilePath,
              type: 'file',
              ext: 'notebook'
            }) as NotebookModel;
            newNotebook.fromJSON(notebook)
            const notebookWidget = await docManager.openOrReveal(newNotebook.path) as NotebookPanel;

            // Ensure the notebook widget is fully initialized
            await notebookWidget.context.ready;
            //if (notebookWidget.model !== null) {
            //notebookWidget.model.fromJSON(notebook);
            //}
            // Save the notebook after populating it
            await notebookWidget.context.save();

          } catch (error) {
            console.error('Error fetching the JSON document or populating the notebook:', error);
          }
        }
      });
      window.parent.postMessage("ready", "https://rr.alkemata.com");
    });
  }
};

export default extension;

