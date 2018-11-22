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
import vtkHttpDataAccessHelper from 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader'
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageMapperSlicingMode from 'vtk.js/Sources/Rendering/Core/ImageMapper/Constants';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
// itk 
import itkReadImageArrayBuffer from 'itk/readImageArrayBuffer';
vtkITKImageReader.setReadImageArrayBufferFromITK(itkReadImageArrayBuffer);
export default class ReactVtkImageViewer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.container = React.createRef();
    this.itkImageReader = vtkITKImageReader.newInstance();
    this.itkImageReader.setFileName(this.props.fileName);
    this.imageMapper = vtkImageMapper.newInstance();
    this.imageMapper.setSliceAtFocalPoint(true);
    this.imageMapper.setInputConnection(this.itkImageReader.getOutputPort());
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
    if(this.props.style != null)
    {
        this.interactor.setInteractorStyle(this.props.style);
    }
    // update 
    vtkHttpDataAccessHelper.fetchBinary(this.props.fileName).then(
      function(arrayBuffer)
      {
        this.itkImageReader.parseAsArrayBuffer(arrayBuffer).then(
          function()
          {
            this.itkImageReader.update();
            this.itkImageReader.getOutputPort()
            this.renderer.resetCamera();
            this.renderer.resetCameraClippingRange();
            this.renderWindow.render();
          }.bind(this)
        );
      }.bind(this)
    );
  }

  render()
  {
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
}