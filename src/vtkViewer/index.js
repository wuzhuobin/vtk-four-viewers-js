import macro from 'vtk.js/Sources/macro';
import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow';
import vtkCursor3D from 'vtk.js/Sources/Filters/Sources/Cursor3D';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';

function notImplementd(method) {
  return () => macro.vtkErrorMacro('vtkViewer::${method} - NOT IMPLEMENTD');
}
// ----------------------------------------------------------------------------
// vtkViewer methods
// ----------------------------------------------------------------------------

function vtkViewer(publicAPI, model) {
  // Set our class name
  model.classHierarchy.push('vtkViewer');

  // Internal objects initialization
  model.cursor3D = vtkCursor3D.newInstance();
  model.cursor3D.setXShadows(false);
  model.cursor3D.setYShadows(false);
  model.cursor3D.setZShadows(false);
  model.cursor3D.setOutline(false);
  model.cursor3DMapper = vtkMapper.newInstance();
  model.cursor3DMapper.setInputConnection(model.cursor3D.getOutputPort());
  model.cursor3DActor = vtkActor.newInstance();
  model.cursor3DActor.setMapper(model.cursor3DMapper);
  model.cursor3DActor.getProperty().setColor(1, 1, 0);
  model.renderer.addActor(model.cursor3DActor);
  model.renderer.setBackground([0, 0, 0]);
  // Public API methods
  publicAPI.render = () => {
    if(model.inputData === null) {
        return;
    }
    if(model.firstRender) {
      model.renderer.resetCamera();
      model.renderer.resetCameraClippingRange();
    }
    model.renderWindow.render();
  };
  publicAPI.setInputData = (imageData) => {
    if(imageData === null)
    {
      return;
    }
    model.inputData = imageData;
    model.cursor3D.setModelBounds(model.inputData.getBounds());
  };
  publicAPI.setCursorPosition = model.cursor3D.setFocalPoint;
  publicAPI.getCursorPosition = model.cursor3D.getFocalPoint;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  inputData: null,
  firstRender: true,
};
  
// ----------------------------------------------------------------------------
  
export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkGenericRenderWindow.extend(publicAPI, model, initialValues);

  macro.get(publicAPI, model, ['inputData']);
  macro.get(publicAPI, model, ['cursor3D']);
  
  // Object specific methods
  vtkViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkViewer');

// ----------------------------------------------------------------------------

export default Object.assign({ newInstance, extend });