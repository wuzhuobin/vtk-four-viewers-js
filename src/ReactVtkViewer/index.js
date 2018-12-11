// me 
import vtkCursor3D from 'vtk.js/Sources/Filters/Sources/Cursor3D';
// react 
import React from 'react'
// vtk
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
const allViewers = [];
export default class ReactVtkViewer extends React.Component
{
  static allViewers(){return allViewers;}
  constructor(props)
  {
    super(props);
    ReactVtkViewer.allViewers().push(this);
    this.container = React.createRef();
    this.firstRender = true;
    // cursor
    this.cursor = vtkCursor3D.newInstance();
    this.cursor.setModelBounds([-15, 15, -15, 15, -15, 15]);
    this.cursor.setFocalPoint(this.props.focalPoint);
    this.cursor.setXShadows(false);
    this.cursor.setYShadows(false);
    this.cursor.setZShadows(false);
    this.cursor.setOutline(false);
    this.cursorMapper = vtkMapper.newInstance();
    this.cursorMapper.setInputConnection(this.cursor.getOutputPort());
    this.cursorActor = vtkActor.newInstance();
    this.cursorActor.setMapper(this.cursorMapper);
    this.cursorActor.getProperty().setColor(1, 1, 0);

    this.renderer = vtkRenderer.newInstance();
    this.renderer.addActor(this.cursorActor);
    this.renderer.addVolume(this.volume);
    this.renderer.setBackground([0,0,0]);
    this.openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    this.renderWindow = vtkRenderWindow.newInstance();
    this.renderWindow.addRenderer(this.renderer);
    this.interactor = vtkRenderWindowInteractor.newInstance();
    
    this.setInput(this.props.input);
    this.setInteractorStyle(this.props.interactorStyle);
    this.setCursorPosition(this.props.focalPoints);
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(nextProps == null)
    {
      return false;
    }
    if(nextProps.input != this.props.input)
    {
      this.setInput(nextProps.input);
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
    if(this.props.input != null)
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

  setInput(input)
  {
    return;
  }

  setInteractorStyle(interactorStyle)
  {
    this.interactor.setInteractorStyle(interactorStyle);
    // first render could force reset camera and camera clipping range
    // Without it the viewer will go dark.
    this.firstRender = true;
 }

  setCursorPosition(pos)
  {
    if(!Array.isArray(pos) || pos.length < 3)
    {
      return;
    }
    // this.cursorActor.setPosition(pos[0], pos[1], pos[2]);
    for(let i in ReactVtkViewer.allViewers())
    {
      ReactVtkViewer.allViewers()[i].cursorActor.setPosition(pos[0], pos[1], pos[2]); 
      ReactVtkViewer.allViewers()[i].render();
    }
  }
}
// import ReactVtkVolumeViewer from './ReactVtkVolumeViewer';
// export {ReactVtkVolumeViewer};