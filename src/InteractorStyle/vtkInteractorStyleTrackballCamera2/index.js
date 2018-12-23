// vtk
import macro from 'vtk.js/Sources/macro';
import {States} from 'vtk.js/Sources/Rendering/Core/InteractorStyle/Constants';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';

// ----------------------------------------------------------------------------
//  vtkInteractorStyleTrackballCamera2 methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleTrackballCamera2(publicAPI, model){
  // Set our className
  model.classHierarchy.push('vtkInteractorStyleTrackballCamera2');

  // Capture "parentClass" api for internal use
  const superClass = Object.assign({}, publicAPI);

  // Public API methods
  publicAPI.handleKeyPress = (callData) => {
    switch (callData.key){
      case 'r':
      case 'R':
        if (model.viewer === null) {
          superClass.handleKeyPress(callData);
        }
        else if (model.viewer.isA('vtkImageViewer')) {
          model.viewer.updateDisplayExtent();
          model.viewer.updateOrientation();
          model.viewer.getRenderer().resetCamera();
          model.viewer.getRenderer().resetCameraClippingRange();
          model.viewer.getRenderWindow().render();
        }
        break;
      default:
        superClass.handleKeyPress(callData);
        break;
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleStartMouseWheel = (callData) => {
    if(model.viewer === null ) {
      superClass.handleStartMouseWheel();
    }
    else if (model.viewer.isA('vtkImageViewer')){
      publicAPI.startSlice();
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleEndMouseWheel = () => {
    switch (model.state) {
      case States.IS_SLICE:
        publicAPI.endSlice();
        break;
      default: 
        superClass.handleEndMouseWheel();
        break;
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleMouseWheel = (callData) => {
    switch (model.state){
      case States.IS_SLICE:
        publicAPI.slice(callData.spinY);
        break;
      default:
        publicAPI.superHandleMouseWheel(callData);
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.slice = (step) => {
    if(model.viewer !== null && model.viewer.isA('vtkImageViewer')) {
      const slice = model.viewer.getSlice();
      model.viewer.setSlice(slice + step);
      publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
    }
  }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  viewer: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkInteractorStyleTrackballCamera.extend(publicAPI, model, initialValues);

  // Create get-set macros
  macro.setGet(publicAPI, model, ['viewer']);

  // Object specific methods
  vtkInteractorStyleTrackballCamera2(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkInteractorStyleTrackballCamera2');

// ----------------------------------------------------------------------------

export default Object.assign({ newInstance, extend });