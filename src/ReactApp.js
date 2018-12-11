// react 
import React from 'react'
// me 
import ReactVtkImageViewer from './ReactVtkViewer/ReactVtkImageViewer';
import {SLICE_ORIENTATION} from './ReactVtkViewer/ReactVtkImageViewer';
import ReactVtkVolumeViewer from './ReactVtkViewer/ReactVtkVolumeViewer';
import vtkInteractorStyleImage2 from './vtkInteractorStyleImage2';
// vtk 
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkInteractorStyleImage from 'vtk.js/Sources/Interaction/Style/InteractorStyleImage'
import vtkHttpDataAccessHelper from 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader';
import vtkImageMapperSlicingMode from 'vtk.js/Sources/Rendering/Core/ImageMapper/Constants';
// itk 
import itkReadImageArrayBuffer from 'itk/readImageArrayBuffer';
// material-ui
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';

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
          imageData: null,
          styles: [null, null, null, null]
        };
        // this.handleButtonClicked = this.handleButtonClicked.bind(this);
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
        return <div>
          <Toolbar>
            <Button onClick={this.handleButtonClicked.bind(this, 'Navigation')}>Navigation</Button>
            <Button onClick={this.handleButtonClicked.bind(this, 'WindowLevel')}>WindowLevel</Button>
            <Button onClick={this.handleButtonClicked.bind(this, 'TrackballCamera')}>TrackballCamera</Button>
          </Toolbar>
          <Grid container>
            <Grid container item>
              <Grid item style={{width: "40%", height: "40%"}}>
                <ReactVtkImageViewer
                  interactorStyle={this.state.styles[0]}
                  input={this.state.imageData}
                  sliceOrientation={SLICE_ORIENTATION.XZ}
                  focalPoints={this.focalPoints}
                ></ReactVtkImageViewer>
              </Grid>
              <Grid item style={{width: "40%", height: "40%"}}>
                <ReactVtkImageViewer
                  interactorStyle={this.state.styles[1]}
                  input={this.state.imageData}
                  sliceOrientation={SLICE_ORIENTATION.XY}
                  focalPoints={this.focalPoints}
                ></ReactVtkImageViewer>
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item style={{width: "40%", height: "40%"}}>
                <ReactVtkVolumeViewer
                  interactorStyle={this.state.styles[2]}
                  input={this.state.imageData}
                  preset={1}
                  focalPoints={this.focalPoints}
                ></ReactVtkVolumeViewer>
              </Grid>
              <Grid item style={{width: "40%", height: "40%"}}>
                <ReactVtkImageViewer
                  interactorStyle={this.state.styles[3]}
                  input={this.state.imageData}
                  sliceOrientation={SLICE_ORIENTATION.YZ}
                  focalPoints={this.focalPoints}
                ></ReactVtkImageViewer>
              </Grid>
            </Grid>
          </Grid>
        </div>
    }

    handleButtonClicked(event, e)
    {
      const styles = Array(4);
      if(event == 'Navigation')
      {
        for(let i = 0; i < styles.length; ++i)
        {
          styles[i] = vtkInteractorStyleImage2.newInstance();
        }
      }
      else if(event == 'WindowLevel')
      {
        for(let i = 0; i < styles.length; ++i)
        {
          styles[i] = vtkInteractorStyleImage.newInstance();
        }
      }
      else if(event == 'TrackballCamera')
      {
        for(let i = 0; i < styles.length; ++i)
        {
          styles[i] = vtkInteractorStyleTrackballCamera.newInstance();
        }
      }
      this.setState({ styles: styles });
    }
}