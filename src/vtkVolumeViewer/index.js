// me
import vtkViewer from '../vtkViewer';
import Preset from './Presets/presets.xml';
// vtk
import macro from 'vtk.js/Sources/macro';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';

// ----------------------------------------------------------------------------
// vtkVolumeViewer methods
// ----------------------------------------------------------------------------

function vtkVolumeViewer(publicAPI, model) {
  
  // Set our className
  model.classHierarchy.push('vtkVolumeViewer');
  
  // Internal objects initialization
  model.volumeMapper = vtkVolumeMapper.newInstance();
  model.volume = vtkVolume.newInstance();
  model.volume.setMapper(model.volumeMapper);
  model.renderer.addVolume(model.volume);

  const superClass = Object.assign({}, publicAPI);
  // Public API methods
  publicAPI.render = () => {
      superClass.render();
  }
  publicAPI.setInputData = (imageData) => {
    if(imageData === model.inputData) {
        return;
    }
    superClass.setInputData(imageData);
    model.volumeMapper.setInputData(model.inputData);
  };
  publicAPI.setPreset = (preset) => {
    if(0 < preset || preset - 1 < Preset.VolumePreset.VolumeProperty.lenght) {
      const presetJson = Preset.VolumePreset.VolumeProperty[preset - 1].$;
      const colorTransferFunction = vtkColorTransferFunction.newInstance();
      const colorTransfer = presetJson.colorTransfer.split(' ').map(Number);
      for (let i = 1; i < colorTransfer.length; i += 4) {
        colorTransferFunction.addRGBPoint(
          colorTransfer[i + 0],
          colorTransfer[i + 1],
          colorTransfer[i + 2],
          colorTransfer[i + 3],
        );
      }
      model.volume.getProperty().setRGBTransferFunction(0, colorTransferFunction);
      const scalarOpacityFunction = vtkPiecewiseFunction.newInstance();
      const scalarOpacity = presetJson.scalarOpacity.split(' ').map(Number);
      for (let i = 1; i < scalarOpacity.length; i += 2) {
        scalarOpacityFunction.addPoint(scalarOpacity[i + 0], scalarOpacity[i + 1]);
      }
      model.volume.getProperty().setScalarOpacity(0, scalarOpacityFunction);
      model.volume.getProperty().setUseGradientOpacity(0, true);
      model.volume.getProperty().setGradientOpacityMinimumOpacity(0, presetJson.gradientOpacity.split(' ')[2]);
      model.volume.getProperty().setGradientOpacityMaximumOpacity(0, presetJson.gradientOpacity.split(' ')[4]);
      model.volume.getProperty().setGradientOpacityMinimumValue(0, presetJson.gradientOpacity.split(' ')[1]);
      model.volume.getProperty().setGradientOpacityMaximumValue(0, presetJson.gradientOpacity.split(' ')[3]);
      model.volume.getProperty().setInterpolationTypeToLinear();
      model.volume.getProperty().setShade(presetJson.shade);
      model.volume.getProperty().setAmbient(presetJson.ambient);
      model.volume.getProperty().setDiffuse(presetJson.diffuse);
      model.volume.getProperty().setSpecular(presetJson.specular);
      model.volume.getProperty().setSpecularPower(presetJson.specularPower);
    }
  }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
  preset: 0,
};

// ----------------------------------------------------------------------------
export function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    // Inheritance
    vtkViewer.extend(publicAPI, model, initialValues);
    // Object methods
    macro.get(publicAPI, model, ['preset']);
  
    // Object specific methods
    vtkVolumeViewer(publicAPI, model);
  }

// ----------------------------------------------------------------------------
export const newInstance = macro.newInstance(extend, 'vtkVolumeViewer');

// ----------------------------------------------------------------------------
export default Object.assign({ newInstance, extend });