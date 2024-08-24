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

/**
 * Initialization data for the json-message-extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'json-message-extension',
  autoStart: true,
  requires: [IDocumentManager, INotebookTracker],
  activate: (app: JupyterFrontEnd, docManager: IDocumentManager, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension json-message-extension is activated!');

    app.restored.then(() => {
      // Wait until JupyterLab UI is ready

      window.addEventListener('message', async (event) => {
        if (event.origin !== window.origin) return; // Secure check

        const { id } = event.data;

        if (id) {
          try {
            // Fetch the JSON document from the server
            const response = await fetch(`http://your-server.com/api/data/${id}`);
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

