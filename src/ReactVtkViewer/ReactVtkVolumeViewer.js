// me 
import ReactVtkViewer from '.'
import Preset from './presets/presets.xml'
// vtk
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper'
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume'
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction'
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction'
export default class ReactVtkVolumeViewer extends ReactVtkViewer
{
  constructor(props)
  {
    super(props);
    this.firstRender = true;
    this.volumeMapper = vtkVolumeMapper.newInstance();
    this.volume = vtkVolume.newInstance();
    this.volume.setMapper(this.volumeMapper);
    this.renderer.addVolume(this.volume);
    this.setInput(this.props.input);
    this.setPreset(this.props.preset);
  }

  setInput(input)
  {
    if(input == null || this.volumeMapper.getInputData() == input)
    {
      return;
    }
    this.volumeMapper.setInputData(input);
    this.renderWindow.render();
  }

  setPreset(preset) {
    if (0 < preset - 1 || preset - 1 < Preset.VolumePreset.VolumeProperty.length) {
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
      this.volume.getProperty().setRGBTransferFunction(0, colorTransferFunction);
      const scalarOpacityFunction = vtkPiecewiseFunction.newInstance();
      const scalarOpacity = presetJson.scalarOpacity.split(' ').map(Number);
      for (let i = 1; i < scalarOpacity.length; i += 2) {
        scalarOpacityFunction.addPoint(scalarOpacity[i + 0], scalarOpacity[i + 1]);
      }
      this.volume.getProperty().setScalarOpacity(0, scalarOpacityFunction);
      this.volume.getProperty().setUseGradientOpacity(0, true);
      this.volume.getProperty().setGradientOpacityMinimumOpacity(0, presetJson.gradientOpacity.split(' ')[2]);
      this.volume.getProperty().setGradientOpacityMaximumOpacity(0, presetJson.gradientOpacity.split(' ')[4]);
      this.volume.getProperty().setGradientOpacityMinimumValue(0, presetJson.gradientOpacity.split(' ')[1]);
      this.volume.getProperty().setGradientOpacityMaximumValue(0, presetJson.gradientOpacity.split(' ')[3]);
      this.volume.getProperty().setInterpolationTypeToLinear();
      this.volume.getProperty().setShade(presetJson.shade);
      this.volume.getProperty().setAmbient(presetJson.ambient);
      this.volume.getProperty().setDiffuse(presetJson.diffuse);
      this.volume.getProperty().setSpecular(presetJson.specular);
      this.volume.getProperty().setSpecularPower(presetJson.specularPower);
    }
  }
}