// react 
import React from 'react'
// me 
import ReactVtkImageViewer from './ReactVtkImageViewer'
import {SLICE_ORIENTATION} from './ReactVtkImageViewer'
import ReactVtkVolumeViewer from './ReactVtkVolumeViewer'
import vtkInteractorStyleImage2 from './vtkInteractorStyleImage2'
// vtk 
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera'
import vtkHttpDataAccessHelper from 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader'
import vtkImageMapperSlicingMode from 'vtk.js/Sources/Rendering/Core/ImageMapper/Constants';
// itk 
import itkReadImageArrayBuffer from 'itk/readImageArrayBuffer';
vtkITKImageReader.setReadImageArrayBufferFromITK(itkReadImageArrayBuffer);
export default class ReactApp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.focalPoints = [0,0,0];
        this.gridContainter = 
        {
          display: 'grid',
          gridTemplateColumns: '400px 400px',
          gridTemplateRows: '400px 400px',
        };
        this.state = 
        {
          imageData: null
        };
        const fileName = 'T2.nii';
        vtkHttpDataAccessHelper.fetchBinary(fileName).then((arrayBuffer) => 
          {
            const itkImageReader = vtkITKImageReader.newInstance();
            itkImageReader.setFileName(fileName);
            itkImageReader.parseAsArrayBuffer(arrayBuffer).then(() =>
              {
                itkImageReader.update();
                this.setState({imageData: itkImageReader.getOutputData()});
              }
            );
          }
        );

    }

    render()
    {
        return <div style={this.gridContainter}>
          <ReactVtkImageViewer
            interactorStyle={vtkInteractorStyleImage2.newInstance()}
            imageData={this.state.imageData}
            sliceOrientation={SLICE_ORIENTATION.XZ}
            focalPoints={this.focalPoints}
          />
          <ReactVtkImageViewer
            interactorStyle={vtkInteractorStyleImage2.newInstance()}
            imageData={this.state.imageData}
            sliceOrientation={SLICE_ORIENTATION.XY}
            focalPoints={this.focalPoints}
          />
          <ReactVtkVolumeViewer 
            interactorStyle={vtkInteractorStyleTrackballCamera.newInstance()}
            imageData={this.state.imageData}
            preset={1}
            focalPoints={this.focalPoints}
           />
          <ReactVtkImageViewer 
            interactorStyle = {vtkInteractorStyleImage2.newInstance()}
            imageData = {this.state.imageData}
            sliceOrientation = {SLICE_ORIENTATION.YZ}
            focalPoints={this.focalPoints}
           />
        </div>
    }
}