import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

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
