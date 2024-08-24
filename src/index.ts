import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { NotebookPanel } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { NotebookModel } from '@jupyterlab/notebook/lib/model';
import { SessionContext } from '@jupyterlab/apputils';

/**
 * Initialization data for the iframe-message-listener extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'iframe-message-listener',
  autoStart: true,
  requires: [IRenderMimeRegistry],
  activate: (app: JupyterFrontEnd, rendermime: IRenderMimeRegistry) => {
    console.log('JupyterLab extension iframe-message-listener is activated!');

    // Add your window message listener here
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

    /**
     * Fetch notebook data from API
     */
   /*  function fetchNotebookData(jwt: string, documentId: string) {
      fetch(`https://rr.alkemata.com/api/notebooks/${documentId}`, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(notebookData => {
        console.log(notebookData)
        // Render notebook in JupyterLab
        renderNotebook(notebookData);
      })
      .catch(error => {
        console.error("Error fetching notebook data:", error);
      });
    }

    /**
     * Render the fetched notebook in JupyterLab
     */
/*     function renderNotebook(notebookData: any) {
      // Create a new notebook model
      const model = new NotebookModel();
      model.fromJSON(notebookData);

      // Create a new context for the notebook
      const context = new DocumentRegistry.Context({
        model,
        sessionContext: new SessionContext({ name: 'iframe-session' }),
      });

      // Create the Notebook panel
      const notebookPanel = new NotebookPanel({
        context,
        rendermime,
      }); */

      // Add the notebook to the JupyterLab main area
     // app.shell.add(notebookPanel, 'main');
    //}
  //} 
};

export default extension;
