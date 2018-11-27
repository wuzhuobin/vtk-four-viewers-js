// me 
import vtkCursor3D from './vtkCursor3D'
import Preset from './presets/presets.xml'
// react
import React from 'react'
// vtk
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper'
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume'
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction'
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction'
export default class ReactVtkVolumeViewer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.container = React.createRef();
    this.firstRender = true;

    this.volumeMapper = vtkVolumeMapper.newInstance();
    this.volume = vtkVolume.newInstance();
    this.volume.setMapper(this.volumeMapper);

    this.cursor3D = vtkCursor3D.newInstance();
    this.cursor3D.setModelBounds([-15, 15, -15, 15, -15, 15]);
    this.cursorMapper = vtkMapper.newInstance();
    this.cursorMapper.setInputConnection(this.cursor3D.getOutputPort());
    this.cursorActor = vtkActor.newInstance();
    this.cursorActor.setMapper(this.cursorMapper);

    this.renderer = vtkRenderer.newInstance();
    this.renderer.addActor(this.cursorActor);
    this.renderer.addActor(this.volume);
    this.renderer.getActiveCamera().setParallelProjection(true);
    this.renderer.setBackground([0,0,0]);
    this.openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    this.renderWindow = vtkRenderWindow.newInstance();
    this.renderWindow.addRenderer(this.renderer);
    this.interactor = vtkRenderWindowInteractor.newInstance();

    this.setInput(this.props.imageData);
    this.setInteractorStyle(this.props.interactorStyle);
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(nextProps.imageData != this.props.imageData)
    {
      this.setInput(nextProps.imageData);
    }
    if(nextProps.interactorStyle != this.props.interactorStyle)
    {
      this.setInteractorStyle(nextProps.interactorStyle);
    }
    // this.setCursorPosition(this.props.cursorPosition)
    return true;
  }

  render()
  { 
    if(this.volumeMapper.getInputData() != null)
    {
      if(this.firstRender)
      {
        this.renderer.resetCamera();
        this.renderer.resetCameraClippingRange();
        this.firstRender = false;
      }
      this.renderWindow.render();
    }
    return <div ref={this.container}></div>
  }

  componentDidMount()
  {
    this.openGLRenderWindow.setContainer(this.container.current);
    const {width, height} = this.container.current.getBoundingClientRect();
    // must set container first, then get Rect. Otherwise, height would become zero.
    this.openGLRenderWindow.setSize(width, height);
    // add view should be set after the size of openGLRenderWindow is confirm, otherwise a very
    // strange size is defined.  
    this.renderWindow.addView(this.openGLRenderWindow);
    // set view should be set after the size of openGLRenderWindow is confirm, otherwise a very
    // strange size is defined.  
    this.interactor.setView(this.openGLRenderWindow);
    this.interactor.bindEvents(this.container.current);
    this.interactor.initialize();
  }

  setInput(imageData)
  {
    if(imageData == null || this.volumeMapper.getInputData() == imageData)
    {
      return;
    }
    this.volumeMapper.setInputData(imageData);
    this.setPresets(22);
    this.renderWindow.render();
  }

  setInteractorStyle(interactorStyle)
  {
    this.interactor.setInteractorStyle(interactorStyle);
  }

  setPresets(preset)
  {
    if(preset < 0 || Preset.VolumePreset.VolumeProperty.length < preset)
    {
      return;
    }
    const presetJson = Preset.VolumePreset.VolumeProperty[preset].$;
    this.volume.getProperty().setInterpolationTypeToLinear();
    // this.volume.getProperty().setShade(presetJson.shade);
    this.volume.getProperty().setAmbient(presetJson.ambient);
    this.volume.getProperty().setDiffuse(presetJson.diffuse);
    this.volume.getProperty().setSpecular(presetJson.specular);
    this.volume.getProperty().setSpecularPower(presetJson.specularPower);
    const colorTransferFunction = vtkColorTransferFunction.newInstance();
    const colorTransfer = presetJson.colorTransfer.split(' ').map(Number);
    for(let i = 1; i < colorTransfer.length; i+=4)
    {
      colorTransferFunction.addRGBPoint(
        colorTransfer[i + 0],
        colorTransfer[i + 1],
        colorTransfer[i + 2],
        colorTransfer[i + 3],
      );
      // console.log(
      //   colorTransfer[i + 0],
      //   colorTransfer[i + 1],
      //   colorTransfer[i + 2],
      //   colorTransfer[i + 3],
      // );
    }
    this.volume.getProperty().setRGBTransferFunction(0, colorTransferFunction); 
    const scalarOpacityFunction = vtkPiecewiseFunction.newInstance();
    const scalarOpacity = presetJson.scalarOpacity.split(' ').map(Number);
    for(let i = 1; i < scalarOpacity.length; i+=2)
    {
      scalarOpacityFunction.addPoint(scalarOpacity[i + 0], scalarOpacity[i + 1]);
      // console.log(
      //   scalarOpacity[i + 0],
      //   scalarOpacity[i + 1]
      // );
    }
    this.volume.getProperty().setScalarOpacity(0, scalarOpacityFunction);
    this.interactor.requestAnimation('lighting');
    this.volumeMapper.onLightingActivated(() => {
      this.interactor.cancelAnimation('lighting');
    });
  }
}