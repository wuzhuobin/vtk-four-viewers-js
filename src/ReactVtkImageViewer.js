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
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageMapperSlicingMode from 'vtk.js/Sources/Rendering/Core/ImageMapper/Constants';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
export const SLICE_ORIENTATION = 
{
  YZ: 0,
  XZ: 1,
  XY: 2
};
export default class ReactVtkImageViewer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.container = React.createRef();
    this.firstRender = true;

    this.imageMapper = vtkImageMapper.newInstance();
    this.imageSlice = vtkImageSlice.newInstance();
    this.imageSlice.setMapper(this.imageMapper);

    this.cursor3D = vtkCursor3D.newInstance();
    this.cursor3D.setModelBounds([-150, 150, -150, 150, -150, 150]);
    this.cursorMapper = vtkMapper.newInstance();
    this.cursorMapper.setInputConnection(this.cursor3D.getOutputPort());
    this.cursorActor = vtkActor.newInstance();
    this.cursorActor.setMapper(this.cursorMapper);

    this.renderer = vtkRenderer.newInstance();
    this.renderer.addActor(this.cursorActor);
    this.renderer.addActor(this.imageSlice);
    this.renderer.getActiveCamera().setParallelProjection(true);
    this.renderer.setBackground([0,0,0]);
    this.openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    this.renderWindow = vtkRenderWindow.newInstance();
    this.renderWindow.addRenderer(this.renderer);
    this.interactor = vtkRenderWindowInteractor.newInstance();

    this.setInput(this.props.imageData);
    this.setSliceOrientation(this.props.sliceOrientation);
    this.setInteractorStyle(this.props.interactorStyle);
    this.setCursorPosition(this.props.focalPoints);
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(nextProps.imageData != this.props.imageData)
    {
      this.setInput(nextProps.imageData);
    }
    if(nextProps.orientation != this.props.sliceOrientation)
    {
      this.setSliceOrientation(nextProps.imageData);
    }
    if(nextProps.interactorStyle != this.props.interactorStyle)
    {
      this.setInteractorStyle(nextProps.interactorStyle);
    }
    this.setCursorPosition(this.props.focalPoints)
    return true;
  }

  render()
  {
    if(this.imageMapper.getInputData() != null)
    {
      if (this.firstRender)
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
    return true;
  }

  setInput(imageData)
  {
    if(imageData == null || this.imageMapper.getInputData() == imageData)
    {
      return;
    }
    this.imageMapper.setInputData(imageData);
    const [low, high] = imageData.getPointData().getScalars().getRange();
    this.imageSlice.getProperty().setColorWindow(high - low);
    this.imageSlice.getProperty().setColorLevel((high + low) * 0.5);
  }

  setSliceOrientation(orientation)
  {
    switch (orientation) {
      case SLICE_ORIENTATION.YZ:
      {
        this.imageMapper.setSlicingMode(vtkImageMapperSlicingMode.SlicingMode.X);
        break;
      }
      case SLICE_ORIENTATION.XZ:
      {
        this.imageMapper.setSlicingMode(vtkImageMapperSlicingMode.SlicingMode.Y);
        break;
      }
      case SLICE_ORIENTATION.XY:
      {
        this.imageMapper.setSlicingMode(vtkImageMapperSlicingMode.SlicingMode.Z);
        break;
      }
    }
    this.updateOrientation();
  }

  updateOrientation()
  {
    const camera = this.renderer.getActiveCamera();
    switch(this.imageMapper.getSlicingMode())
    {
      case vtkImageMapperSlicingMode.SlicingMode.Z:
      case vtkImageMapperSlicingMode.SlicingMode.K:
      {
        camera.setFocalPoint(0, 0, 0);
        camera.setPosition(0, 0, 1);
        camera.setViewUp(0, 1, 0);
        break;
      }
      case vtkImageMapperSlicingMode.SlicingMode.Y:
      case vtkImageMapperSlicingMode.SlicingMode.J:
      {
        camera.setFocalPoint(0, 0, 0);
        camera.setPosition(0, -1, 0);
        camera.setViewUp(0, 0, 1);
        break;
      }
      case vtkImageMapperSlicingMode.SlicingMode.X:
      case vtkImageMapperSlicingMode.SlicingMode.I:
      {
        camera.setFocalPoint(0, 0, 0);
        camera.setPosition(1, 0, 0);
        camera.setViewUp(0, 0, 1);
        break;
      }
      default:
        break;
    }
  }

  setInteractorStyle(interactorStyle)
  {
    this.interactor.setInteractorStyle(interactorStyle);
    if(this.interactor.getInteractorStyle().isA('vtkInteractorStyleImage2'))
    {
      this.interactor.getInteractorStyle().setViewer(this);
    }
  }

  setCursorPosition(pos)
  {
    if(pos == null)
    {
      return;
    }
    this.cursor3D.setFocalPoints(pos)
  }
}