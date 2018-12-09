// me 
import ReactVtkViewer from '.'
// react 
import React from 'react'
// vtk
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
export default class ReactVtkImageViewer extends ReactVtkViewer
{
  constructor(props)
  {
    super(props);

    this.imageMapper = vtkImageMapper.newInstance();
    this.imageSlice = vtkImageSlice.newInstance();
    this.imageSlice.setMapper(this.imageMapper);
    // cursor
    this.renderer.removeActor(this.cursorActor);
    this.renderer.setLayer(0);
    this.renderer.addActor(this.imageSlice);
    this.renderer.getActiveCamera().setParallelProjection(true);
    this.overlayRenderer = vtkRenderer.newInstance();
    this.overlayRenderer.addActor(this.cursorActor);
    this.overlayRenderer.setActiveCamera(this.renderer.getActiveCamera());
    this.overlayRenderer.setLayer(1);
    this.renderWindow.setNumberOfLayers(2);
    this.renderWindow.addRenderer(this.overlayRenderer);

    this.setInput(this.props.input);
    this.setSliceOrientation(this.props.sliceOrientation);
    this.setInteractorStyle(this.props.interactorStyle);
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(!super.shouldComponentUpdate(nextProps, nextState))
    {
      return false;
    }
    if(nextProps.orientation != this.props.sliceOrientation)
    {
      this.setSliceOrientation(nextProps.imageData);
    }
    return true;
  }

  setInput(input)
  {
    if(input == null || this.imageMapper.getInputData() == input)
    {
      return;
    }
    this.imageMapper.setInputData(input);
    const [low, high] = input.getPointData().getScalars().getRange();
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
    if(interactorStyle != null && 
      interactorStyle.isA('vtkInteractorStyleImage2'))
    {
      interactorStyle.setViewer(this);
    }
    super.setInteractorStyle(interactorStyle);
  }

  setCursorPosition(pos)
  {
    if(pos == null || this.imageMapper == null)
    {
      return;
    }
    this.imageMapper.getSlice();
    for(let i in ReactVtkViewer.allViewers())
    {
      const viewer = ReactVtkViewer.allViewers()[i];
      if(viewer == this || viewer.imageMapper == null)
      {
        continue;
      }
      // this slice from vtkITKImageReader is in XYZ world coordinate. 
      // which it do not need to be transformed with origin and spacing. 
      viewer.imageMapper.setSlice(pos[viewer.imageMapper.getSlicingMode() - 3]);
    }
    super.setCursorPosition(pos);
  }
}