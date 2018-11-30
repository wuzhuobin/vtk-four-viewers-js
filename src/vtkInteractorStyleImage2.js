
import macro from 'vtk.js/Sources/macro';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkPicker from 'vtk.js/Sources/Rendering/Core/Picker'
import vtkPointPicker from 'vtk.js/Sources/Rendering/Core/PointPicker';
import { States } from 'vtk.js/Sources/Rendering/Core/InteractorStyle/Constants';
States.IS_NAVIGATION = 1026;
const stateNames =
{
  Navigation: States.IS_NAVIGATION
}
// ----------------------------------------------------------------------------
// vtkInteractorStyleImage2 methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleImage2(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkInteractorStyleImage2');

  // Public API methods
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

  publicAPI.superHandleMouseMove = publicAPI.handleMouseMove;
  publicAPI.handleMouseMove = (callData) => {
    const pos = callData.position;
    const renderer = callData.pokedRenderer;

    switch (model.state) {
      // case States.IS_WINDOW_LEVEL:
      //   publicAPI.windowLevel(renderer, pos);
      //   publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
      //   break;
      case States.IS_NAVIGATION:
        publicAPI.navigation(renderer, pos);
        publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
        break;
      default:
        publicAPI.superHandleMouseMove(callData);
        break;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.superHandleLeftButtonPress = publicAPI.handleLeftButtonPress;
  publicAPI.handleLeftButtonPress = (callData) => {
    publicAPI.startNavigation();
    // publicAPI.superHandleLeftButtonPress(callData);
    
    // const pos = callData.position;
    // if (!callData.shiftKey && !callData.controlKey) {
    //   model.windowLevelStartPosition[0] = pos.x;
    //   model.windowLevelStartPosition[1] = pos.y;
    //   // Get the last (the topmost) image
    //   publicAPI.setCurrentImageNumber(model.currentImageNumber);
    //   const property = model.currentImageProp.getProperty();
    //   if (property) {
    //     model.windowLevelInitial[0] = property.getColorWindow();
    //     model.windowLevelInitial[1] = property.getColorLevel();
    //   }
    //   publicAPI.startWindowLevel();
    // }  else {
    //   // The rest of the button + key combinations remain the same
    //   publicAPI.superHandleLeftButtonPress(callData);
    // }
  };

  //--------------------------------------------------------------------------
  publicAPI.superHandleLeftButtonRelease = publicAPI.handleLeftButtonRelease;
  publicAPI.handleLeftButtonRelease = () => {
    switch (model.state) {
      // case States.IS_WINDOW_LEVEL:
      //   publicAPI.endWindowLevel();
      //   break;
      case States.IS_NAVIGATION:
        publicAPI.endNavigation();
        break;
      default:
        publicAPI.superHandleLeftButtonRelease();
        break;
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.superHandleStartMouseWheel = publicAPI.handleStartMouseWheel;
  publicAPI.handleStartMouseWheel = (callData) => {
    publicAPI.setCurrentImageNumber(model.currentImageNumber);
    publicAPI.startSlice();
  };

  //--------------------------------------------------------------------------
  publicAPI.superHandleEndMouseWheel = publicAPI.handleEndMouseWheel;
  publicAPI.handleEndMouseWheel = () => {
    switch (model.state) {
      case States.IS_SLICE:
        publicAPI.endSlice();
        break;
      default: 
        publicAPI.superEndMouseWheel();
        break;
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.superHandleMouseWheel = publicAPI.handleMouseWheel; 
  publicAPI.handleMouseWheel = (callData) => {
    switch (model.state){
      case States.IS_SLICE:
        publicAPI.slice(callData.spinY);
        break;
      default:
        publicAPI.superHandleMouseWheel(callData);
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.windowLevel = (renderer, position) => {
    model.windowLevelCurrentPosition[0] = position.x;
    model.windowLevelCurrentPosition[1] = position.y;
    const rwi = model.interactor;

    if (model.currentImageProp) {
      const size = rwi.getView().getViewportSize(renderer);

      const mWindow = model.windowLevelInitial[0];
      const level = model.windowLevelInitial[1];

      // Compute normalized delta
      let dx =
        ((model.windowLevelCurrentPosition[0] -
          model.windowLevelStartPosition[0]) *
          4.0) /
        size[0];
      let dy =
        ((model.windowLevelStartPosition[1] -
          model.windowLevelCurrentPosition[1]) *
          4.0) /
        size[1];

      // Scale by current values
      if (Math.abs(mWindow) > 0.01) {
        dx *= mWindow;
      } else {
        dx *= mWindow < 0 ? -0.01 : 0.01;
      }
      if (Math.abs(level) > 0.01) {
        dy *= level;
      } else {
        dy *= level < 0 ? -0.01 : 0.01;
      }

      // Abs so that direction does not flip
      if (mWindow < 0.0) {
        dx *= -1;
      }
      if (level < 0.0) {
        dy *= -1;
      }

      // Compute new mWindow level
      let newWindow = dx + mWindow;
      const newLevel = level - dy;

      if (newWindow < 0.01) {
        newWindow = 0.01;
      }

      model.currentImageProp.getProperty().setColorWindow(newWindow);
      model.currentImageProp.getProperty().setColorLevel(newLevel);
    }
  };

  publicAPI.slice = (step) => {
    if(model.currentImageProp)
    {
      const slice = model.currentImageProp.getMapper().getSlice();
      model.currentImageProp.getMapper().setSlice(slice + step);
    }
    publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
  }

  //----------------------------------------------------------------------------
  publicAPI.navigation = (renderer, pos) => {
    const pointPicker = vtkPointPicker.newInstance();
    if(pointPicker.pick([pos.x, pos.y, pos.z], renderer) != 1)
    {
      const worldPos = pointPicker.getPickedPositions(); 
      model.viewer.setCursorPosition(worldPos[0]);
      return;
    }
  }
  //----------------------------------------------------------------------------
  // This is a way of dealing with images as if they were layers.
  // It looks through the renderer's list of props and sets the
  // interactor ivars from the Nth image that it finds.  You can
  // also use negative numbers, i.e. -1 will return the last image,
  // -2 will return the second-to-last image, etc.
  publicAPI.setCurrentImageNumber = (i) => {
    const renderer = model.interactor.getCurrentRenderer();
    if (!renderer) {
      return;
    }
    model.currentImageNumber = i;

    function propMatch(j, prop, targetIndex) {
      if (
        prop.isA('vtkImageSlice') &&
        j === targetIndex &&
        prop.getPickable()
      ) {
        return true;
      }
      return false;
    }

    const props = renderer.getViewProps();
    let targetIndex = i;
    if (i < 0) {
      targetIndex += props.length;
    }
    let imageProp = null;
    let foundImageProp = false;
    for (let j = 0; j < props.length && !foundImageProp; j++) {
      if (propMatch(j, props[j], targetIndex)) {
        foundImageProp = true;
        imageProp = props[j];
      }
    }

    if (imageProp) {
      model.currentImageProp = imageProp;
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  viewer: null,
  windowLevelStartPosition: [0, 0],
  windowLevelCurrentPosition: [0, 0],
  windowLevelInitial: [1.0, 0.5],
  currentImageProp: null,
  currentImageNumber: -1,
  xViewRightVector: [0, 1, 0],
  xViewUpVector: [0, 0, -1],
  yViewRightVector: [1, 0, 0],
  yViewUpVector: [0, 0, -1],
  zViewRightVector: [1, 0, 0],
  zViewUpVector: [0, 1, 0],
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkInteractorStyleTrackballCamera.extend(publicAPI, model, initialValues);

  // For more macro methods, see "Sources/macro.js"
  macro.setGet(publicAPI, model, ['viewer']);
  
  // Object specific methods
  vtkInteractorStyleImage2(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkInteractorStyleImage2');

// ----------------------------------------------------------------------------

export default Object.assign({ newInstance, extend });