// react 
import React from 'react'
// me 
import ReactVtkImageViewer from './ReactVtkImageViewer'
// vtk 
import vtkInteractorStyleImage2 from './vtkInteractorStyleImage2'
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera'
export default class ReactApp extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        // return React.createElement('div', {ref: this.divRef});
        // return <div ref={this.divRef}></div>
        const style = vtkInteractorStyleImage2.newInstance();
        return React.createElement(ReactVtkImageViewer, {fileName: 'T2.nii', style: style });
        // return React.createElement(ReactVtkImageViewer, {fileName: 'T2.nii', style: vtkInteractorStyleTrackballCamera.newInstance() });
        // return <ReactVtkImageViewer fileName='T2.nii'></ReactVtkImageViewer>;
    }

    componentDidMount()
    {
    }
}