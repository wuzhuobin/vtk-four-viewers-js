// me
import vtkInteractorStyleTrackballCamera2 from '../vtkInteractorStyleTrackballCamera2';
// vtk
import macro from 'vtk.js/Sources/macro';
import { States } from 'vtk.js/Sources/Rendering/Core/InteractorStyle/Constants';
import vtkPointPicker from 'vtk.js/Sources/Rendering/Core/PointPicker';
States.IS_NAVIGATION = 1026;
const stateNames =
{
  Navigation: States.IS_NAVIGATION
}
// ----------------------------------------------------------------------------
//  vtkInteractorStyleNavigation methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleNavigation(publicAPI, model) {

  // Set our className
  model.classHierarchy.push('vtkInteractorStyleNavigation');
  
  // Capture "parentClass" api for internal use
  const superClass = Object.assign({}, publicAPI);
  // Publice API methods
  // create bunch of Start/EndState methods
  Object.keys(stateNames).forEach((key) => {
    macro.event(publicAPI, model, `Start${key}Event`);
    publicAPI[`start${key}`] = () => {
      if (model.state !== States.IS_NONE) {
        return;
      }
      model.state = stateNames[key];
      model.interactor.requestAnimation(publicAPI);
      publicAPI.invokeStartInteractionEvent({ type: 'StartInteractionEvent' });
      publicAPI[`invokeStart${key}Event`]({ type: `Start${key}Event` });
    };
    macro.event(publicAPI, model, `End${key}Event`);
    publicAPI[`end${key}`] = () => {
      if (model.state !== stateNames[key]) {
        return;
      }
      model.state = States.IS_NONE;
      model.interactor.cancelAnimation(publicAPI);
      publicAPI.invokeEndInteractionEvent({ type: 'EndInteractionEvent' });
      publicAPI[`invokeEnd${key}Event`]({ type: `End${key}Event` });
      model.interactor.render();
    };
  });
  publicAPI.handleMouseMove = (callData) => {
    const pos = callData.position;
    const renderer = callData.pokedRenderer;
    switch (model.state) {
      case States.IS_NAVIGATION:
        publicAPI.navigation(renderer, pos);
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
      publicAPI.startNavigation();
    }
    else {
      superClass.handleLeftButtonPress(callData);
    }
  };
  publicAPI.handleLeftButtonRelease = () => {
    switch (model.state) {
      case States.IS_NAVIGATION:
        publicAPI.endNavigation();
        break;
      default:
        superClass.handleLeftButtonRelease();
        break;
    }
  };
  publicAPI.navigation = (renderer, pos) => {
    if(model.viewer === null && !model.viewer.isA('vtkImageViewer')) {
      return;
    }
    const pointPicker = vtkPointPicker.newInstance();
    if(pointPicker.pick([pos.x, pos.y, pos.z], renderer) != 1) {
      const worldPos = pointPicker.getPickedPositions();
      model.viewer.setCursorPosition(worldPos[0]);
    }
  };
}


// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------
export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkInteractorStyleTrackballCamera2.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkInteractorStyleNavigation(publicAPI, model);
}

// ----------------------------------------------------------------------------
export const newInstance = macro.newInstance(extend, 'vtkInteractorStyleNavigation');

// ----------------------------------------------------------------------------
export default Object.assign({ newInstance, extend });