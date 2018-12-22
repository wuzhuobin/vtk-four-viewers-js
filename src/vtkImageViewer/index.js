// vtk
import macro from 'vtk.js/Sources/macro';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import { SlicingMode } from 'vtk.js/Sources/Rendering/Core/ImageMapper/Constants';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
// me 
import vtkViewer from '../vtkViewer';
import { SliceOrientation } from './Constants';


// ----------------------------------------------------------------------------
// Private methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkImageViewer methods
// ----------------------------------------------------------------------------

function vtkImageViewer(publicAPI, model) {

  // Set our className
  model.classHierarchy.push('vtkImageViewer');

  // Internal objects initialization
  model.renderer.removeActor(model.cursor3DActor);
  model.renderer.setLayer(0);
  model.renderer.getActiveCamera().setParallelProjection(true);
  model.overlayRenderer = vtkRenderer.newInstance();
  model.overlayRenderer.addActor(model.cursor3DActor);
  model.overlayRenderer.setLayer(1);
  model.overlayRenderer.setActiveCamera(model.renderer.getActiveCamera());
  model.renderWindow.addRenderer(model.overlayRenderer);
  model.renderWindow.setNumberOfLayers(2);
  model.imageMapper = vtkImageMapper.newInstance();
  model.imageSlice = vtkImageSlice.newInstance();
  model.imageSlice.setMapper(model.imageMapper);
  model.renderer.addActor(model.imageSlice);

  const superClass = Object.assign({}, publicAPI);
  // Public API methods
  publicAPI.render = () => {
    superClass.render();
  };
  publicAPI.setInputData = (imageData) => {
    if(imageData === model.inputData) {
        return;
    }
    superClass.setInputData(imageData);
    model.imageMapper.setInputData(model.inputData);
    if(model.inputData !== null) {
      const [low, high] = model.inputData.getPointData().getScalars().getRange();
      model.imageSlice.getProperty().setColorWindow(high - low);
      model.imageSlice.getProperty().setColorLevel((high + low) * 0.5);
      publicAPI.updateDisplayExetent();
    }
  };
  publicAPI.setCursorPosition = (position) => {
    superClass.setCursorPosition(position);
    publicAPI.setSlice(position[model.sliceOrientation]);
  };
  publicAPI.setSliceOrientation = (orientation) => {
    if(model.sliceOrientation === orientation) {
      return;
    }
    if(orientation < SliceOrientation.SLICE_ORIENTATION_YZ ||
      orientation > SliceOrientation.SLICE_ORIENTATION_XY) {
      return;
    }
    model.sliceOrientation = orientation;
    publicAPI.updateOrientation();
    publicAPI.updateDisplayExetent();
    if (model.inputData) {
      const scale = model.renderer.getActiveCamera().getParallelScale();
      model.renderer.resetCamera();
    //   model.renderer.resetCameraClippingRange();
      model.renderer.getActiveCamera().setParallelScale(scale);
    }
    publicAPI.render();
  };
  publicAPI.setSlice = (slice) => {
    const range = publicAPI.getSliceRange();
    slice = slice < range[0] ? range[0] : slice;
    slice = slice > range[1] ? range[1] : slice;
    if(model.slice == slice) {
      return;
    }
    model.slice = slice;
    publicAPI.updateDisplayExetent();
    publicAPI.render();
  };
  publicAPI.updateDisplayExetent = () => {
    if(model.inputData === null) {
      return;
    }
    switch(model.sliceOrientation) {
      case SliceOrientation.SLICE_ORIENTATION_YZ: 
        model.imageMapper.setSlicingMode(SlicingMode.X);
        break;
      case SliceOrientation.SLICE_ORIENTATION_XZ:
        model.imageMapper.setSlicingMode(SlicingMode.Y);
        break;
      case SliceOrientation.SLICE_ORIENTATION_XY:
        model.imageMapper.setSlicingMode(SlicingMode.Z);
        break;
    }
    model.imageMapper.setSlice(model.slice);
  };
  publicAPI.getSliceRange = () => {
    if(model.inputData === null) {
      return [0, 0];
    }
    const extent = model.inputData.getBounds();
    return [extent[2 * model.sliceOrientation], extent[2 * model.sliceOrientation + 1]];
  };
  publicAPI.getSliceMin = () => publicAPI.getSliceRange()[0];
  publicAPI.getSliceMax = () => publicAPI.getSliceRange()[1];
  publicAPI.updateOrientation = () => {
    const camera = model.renderer.getActiveCamera();
    switch(model.sliceOrientation)
    {
      case SliceOrientation.SLICE_ORIENTATION_XY:
      {
        camera.setFocalPoint(0, 0, 0);
        camera.setPosition(0, 0, 1);
        camera.setViewUp(0, 1, 0);
        break;
      }
      case SliceOrientation.SLICE_ORIENTATION_XZ:
      {
        camera.setFocalPoint(0, 0, 0);
        camera.setPosition(0, -1, 0);
        camera.setViewUp(0, 0, 1);
        break;
      }
      case SliceOrientation.SLICE_ORIENTATION_YZ:
      {
        camera.setFocalPoint(0, 0, 0);
        camera.setPosition(1, 0, 0);
        camera.setViewUp(0, 0, 1);
        break;
      }
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  sliceOrientation: SliceOrientation.SLICE_ORIENTATION_XY,
  slice: 0,
}

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);
  // Inheritance
  vtkViewer.extend(publicAPI, model, initialValues);
  // Object methods
  macro.get(publicAPI, model, [
    {name: 'sliceOrientation', enum: SliceOrientation, type: 'enum'},
  ]);
  macro.get(publicAPI, model, ['slice']);

  // Object specific methods
  vtkImageViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkImageViewer');

// ----------------------------------------------------------------------------

export default Object.assign({ newInstance, extend });