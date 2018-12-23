// react 
import React from 'react'
// me 
import vtkInteractorStyleNavigation from './InteractorStyle/vtkInteractorStyleNavigation';
import vtkInteractorStyleTrackballCamera2 from './InteractorStyle/vtkInteractorStyleTrackballCamera2';
import ImageViewer from './ReactViewer/ImageViewer';
import {SliceOrientation} from './vtkImageViewer/Constants'
// vtk 
import vtkInteractorStyleImage from 'vtk.js/Sources/Interaction/Style/InteractorStyleImage'
import vtkHttpDataAccessHelper from 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader';
// itk 
import itkReadImageArrayBuffer from 'itk/readImageArrayBuffer';
// material-ui
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
          styles: [
            vtkInteractorStyleTrackballCamera2.newInstance(),
            vtkInteractorStyleTrackballCamera2.newInstance(),
            vtkInteractorStyleTrackballCamera2.newInstance(),
            vtkInteractorStyleTrackballCamera2.newInstance(),
          ]
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
            <Button onClick={this.handleButtonClicked.bind(this, 'TrackballCamera')}>TrackballCamera</Button>
            <Button onClick={this.handleButtonClicked.bind(this, 'Navigation')}>Navigation</Button>
            <Button onClick={this.handleButtonClicked.bind(this, 'WindowLevel')}>WindowLevel</Button>
          </Toolbar>
          <Grid container>
            <Grid container item>
              <Grid item style={{width: "50", height: "50"}}>
                <ImageViewer
                  inputData={this.state.imageData}
                  sliceOrientation={SliceOrientation.SLICE_ORIENTATION_YZ}
                  style={this.state.styles[0]}
                ></ImageViewer>
              </Grid>
              <Grid item style={{width: "50", height: "50"}}>
                <ImageViewer
                  inputData={this.state.imageData}
                  sliceOrientation={SliceOrientation.SLICE_ORIENTATION_XY}
                  style={this.state.styles[1]}
                ></ImageViewer>
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item style={{width: "50", height: "50"}}>
              </Grid>
              <Grid item style={{width: "50", height: "50"}}>
                <ImageViewer
                  inputData={this.state.imageData}
                  sliceOrientation={SliceOrientation.SLICE_ORIENTATION_XZ}
                  style={this.state.styles[3]}
                ></ImageViewer>
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
          styles[i] = vtkInteractorStyleNavigation.newInstance();
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
          styles[i] = vtkInteractorStyleTrackballCamera2.newInstance();
        }
      }
      this.setState({ styles: styles });
    }
}