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

import { NotebookPanel,INotebookModel } from '@jupyterlab/notebook';

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

      console.log('waiting for message');
      window.addEventListener('message', async (event) => {
        console.log(event)
        if (event.origin !== "https://rr.alkemata.com") return; // Secure check

        const id  = event.data.documentId;
        console.log('==========',id)

        if (id) {
          try {
            // Fetch the JSON document from the server
            const response = await fetch(`https://rr.alkemata.com/api/notebooks/query/${id}`, {
              method: 'GET',
              // Important: Ensure cookies are included in the request
              credentials: 'include'
            });
            const data= await response.json();
            const notebook=data.notebook;

            const notebookWidget: NotebookPanel = await app.commands.execute(
              'notebook:create-new',
              { kernelName: 'python3', activate: true });
            console.log('populate notebook');
            // Ensure the notebook widget is fully initialized
            await notebookWidget.context.ready;
            if (notebookWidget.model !== null) {
            notebookWidget.model.fromJSON(notebook);
            }
            // Save the notebook after populating it
            await notebookWidget.context.save();

          } catch (error) {
            console.error('Error fetching the JSON document or populating the notebook:', error);
          }
        }
      });
      window.parent.postMessage("ready", "https://rr.alkemata.com");

 //===================================================
      window.addEventListener('publishNotebook', async (event) => {
        console.log(event)
        if (event.origin !== "https://rr.alkemata.com") return; // Secure check
          const currentWidget = app.shell.currentWidget;
          if (!currentWidget) {
            console.warn('No current widget found.');
            return;
          }
                  // Check if the widget is a NotebookPanel
        if (currentWidget instanceof NotebookPanel) {
          const notebookPanel = currentWidget as NotebookPanel;
          await notebookPanel.context.ready;

          // Get the notebook content as JSON
          const notebookModel = notebookPanel.content.model as INotebookModel;
          if (!notebookModel) {
            console.warn('No notebook model found.');
            return;
          }

          // Serialize the notebook content to JSON format
          const notebookJSON = notebookModel.toJSON();
          console.log(notebookJSON);
        }
      });
    });
  }
};

export default extension;

