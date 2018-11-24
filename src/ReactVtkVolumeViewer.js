// me 
import vtkCursor3D from './vtkCursor3D'
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
    this.setInteractorStyle(this.props.interactorStyle)
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
  }

  setInteractorStyle(interactorStyle)
  {
    this.interactor.setInteractorStyle(interactorStyle);
  }
}