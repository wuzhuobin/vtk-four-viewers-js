import macro from 'vtk.js/Sources/macro';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';

function vtkInteractorStyleTrackballCamera2(publicAPI, model){
  // Set our className
  model.classHierarchy.push('vtkInteractorStyleTrackballCamera2');

  // Capture "parentClass" api for internal use
  const superClass = Object.assign({}, publicAPI);

  // Public API methods

  publicAPI.handleKeyPress = (callData) =>{
    const interactor = model.interactor;
    switch (callData.key){
      case 'r':
      case 'R':
        if (model.reactVtkViewer === null) {
          superClass.handleKeyPress(callData);
        }
        else {
          model.reactVtkViewer.renderer.resetCamera();
          // model.reactVtkVie 
        }

        break;

      default:
        superClass.handleKeyPress(callData);
        break;
    }
  }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  reactVtkViewer: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkInteractorStyleTrackballCamera.extend(publicAPI, model, initialValues);

  // Create get-set macros
  macro.setGet(publicAPI, model, ['reactVtkViewer']);

  // Object specific methods
  vtkInteractorStyleTrackballCamera2(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkInteractorStyleTrackballCamera'
)

// ----------------------------------------------------------------------------

export default Object.assign({ newInstance, extend });