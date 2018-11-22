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
    this.cursor3D.setModelBounds([-15, 15, -15, 15, -15, 15]);
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

  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(nextProps.interactorStyle != null && nextProps.interactorStyle != this.props.interactorStyle)
    {
      console.log(this.props.interactorStyle);
      console.log(nextProps.interactorStyle);
      this.interactor.setInteractorStyle(nextProps.interactorStyle);
    }
    if(nextProps.imageData != null && nextProps.imageData != this.props.imageData)
    {
      this.imageMapper.setInputData(nextProps.imageData);
      const [low, high] = nextProps.imageData.getPointData().getScalars().getRange();
      this.imageSlice.getProperty().setColorWindow(high - low);
      this.imageSlice.getProperty().setColorLevel((high + low) * 0.5);
    }
    if(nextProps.sliceOrientation != this.props.sliceOrientation)
    {
      console.log(nextProps.sliceOrientation)
      const slice = this.imageMapper.getSlice();
      switch (nextProps.sliceOrientation) {
        case SLICE_ORIENTATION.YZ:
          {
            this.imageMapper.setXSlice(slice);
            break;
          }
        case SLICE_ORIENTATION.XZ:
          {
            this.imageMapper.setYSlice(slice);
            break;
          }
        case SLICE_ORIENTATION.XY:
          {
            this.imageMapper.setZSlice(slice);
            break;
          }
      }
    }
    return true;
  }

  render()
  {
    if(this.firstRender)
    {
      this.renderer.resetCamera();
      this.renderer.resetCameraClippingRange();
    }
    if(this.props.imageData != null)
    {
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

  componentDidUpdate(prevProps, prevState, snapshot)
  {
  }
}