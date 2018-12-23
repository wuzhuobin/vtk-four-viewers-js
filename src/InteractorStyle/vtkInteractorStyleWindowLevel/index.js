// me
import vtkInteractorStyleTrackballCamera2 from '../vtkInteractorStyleTrackballCamera2';
// vtk
import { States } from 'vtk.js/Sources/Rendering/Core/InteractorStyle/Constants';

// ----------------------------------------------------------------------------
//  vtkInteractorStyleWindowLevel methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleWindowLevel(publicAPI, model) {

  // Set our className
  model.classHierarchy.push('vtkInteractorStyleWindowLevel');
  
  model.windowLevelStartPosition = [0, 0];
  model.windowLevelCurrentPosition = [0, 0];
  model.windowLevelInitial = [1.0, 0.5];


  // Capture "parentClass" api for internal use
  const superClass = Object.assign({}, publicAPI);
  // Public API methods
  publicAPI.handleMouseMove = (callData) => {
    const pos = callData.position;
    const renderer = callData.pokedRenderer;
    switch (model.state) {
      case States.IS_WINDOW_LEVEL:
        publicAPI.windowLevel(renderer, pos);
        publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
        break;
      default:
        superClass.handleMouseMove(callData);
        break;
    }
  };
  publicAPI.handleLeftButtonPress = (callData) => {
    if(model.viewer !== null && 
      model.viewer.isA('vtkImageViewer')) {
      const pos = callData.position();
      model.windowLevelStartPosition = [pos.x, pos.y];
      const property = model.viewer.getImageSlice().getProperty();
      model.windowLevelInitial = [property.getColorWindow(), property.getColorLevel()];
      publicAPI.startWindowLevel();
    }
    else {
      superClass.handleLeftButtonPress(callData);
    }
  };
  publicAPI.handleLeftButtonPress = () => {
    switch(model.state) {
      case States.IS_WINDOW_LEVEL:
        publicAPI.endWindowLevel();
        break;
      default:
        superClass.handleLeftButtonPress();
        break;
    }
  };
  publicAPI.windowLevel = (renderer, position) => {
    model.windowLevelCurrentPosition = [position.x, position.y];
    const interactor = model.interactor;
    const size = interactor.getView().getViewportSize(renderer);
    const 
  };
}

// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
};

// ----------------------------------------------------------------------------
export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkInteractorStyleTrackballCamera2.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkInteractorStyleWindowLevel(publicAPI, model);
}

// ----------------------------------------------------------------------------
export const newInstance = macro.newInstance(extend, 'vtkInteractorStyleWindowLevel');

// ----------------------------------------------------------------------------
export default Object.assign({ newInstance, extend });