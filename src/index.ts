import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { NotebookPanel } from '@jupyterlab/notebook';
import { NotebookModel } from '@jupyterlab/notebook/lib/model';
import { Context } from '@jupyterlab/docregistry';
import { SessionContext } from '@jupyterlab/apputils';

    // Listen for messages from the parent window
    window.addEventListener("message", (event) => {
      const { jwt, documentId } = event.data;

      // Ensure that the message comes from the expected origin
      if (event.origin !== 'https://rr.alkemata.com') {
          return;
      }

      // Call the API to fetch the notebook content
      fetchNotebookData(jwt, documentId);
  }, false);

  function fetchNotebookData(jwt: string, documentId: string) {
      // Make an API call using the JWT and document ID
      fetch(`https://rr.alkemata.com/api/notebooks/${documentId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${jwt}`
          }
      })
      .then(response => response.json())
      .then(notebookData => {
          // Render notebook in JupyterLab
          renderNotebook(notebookData);
      })
      .catch(error => {
          console.error("Error fetching notebook data:", error);
      });
  }

// Render notebook with NotebookPanel
function renderNotebook(notebookData: any) {
    const content = { cells: notebookData.cells, metadata: notebookData.metadata };

    const model = new NotebookModel({ content });
    const context = new Context({ model, sessionContext: new SessionContext({ name: 'session' }) });

    const notebookPanel = new NotebookPanel({ context });
    
    // Add notebookPanel to the JupyterLab shell
    app.shell.add(notebookPanel, 'main');
    notebookPanel.context.model.fromJSON(notebookData);
}

/**
 * Initialization data for the jupyter_flask_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter_flask_extension:plugin',
  description: 'A JupyterLab extension.for flask',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyter_flask_extension is activated!');
  }
};

export default plugin;
