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

            // Create a new notebook file in JupyterLab
            const newNotebook = await docManager.newUntitled({
              path: 'Untitled.ipynb',
              type: 'notebook'
            });

            // Open the notebook
            const notebookWidget = await docManager.openOrReveal(newNotebook.path) as NotebookPanel;

            // Ensure the notebook widget is fully initialized
            await notebookWidget.context.ready;

            // Populate the notebook with cells based on the JSON content
            const notebookContent = notebookWidget.content;
            
            // Assuming JSON has an array of cells (e.g., code or markdown)
            // Example: { "cells": [ {"cell_type": "code", "source": "print('Hello World')", "metadata": {}}, ... ] }
            json.cells.forEach((cell: any) => {
              let notebookCell;
              if (cell.cell_type === 'code') {
                notebookCell = notebookContent.model.contentFactory.createCodeCell({});
                notebookCell.value.text = cell.source;
              } else if (cell.cell_type === 'markdown') {
                notebookCell = notebookContent.model.contentFactory.createMarkdownCell({});
                notebookCell.value.text = cell.source;
              }
              // Add the new cell to the notebook
              notebookContent.model.cells.push(notebookCell);
            });

            // Save the notebook after populating it
            await notebookWidget.context.save();

          } catch (error) {
            console.error('Error fetching the JSON document or populating the notebook:', error);
          }
        }
      });
    });
  }
};

export default extension;

