// me
import vtkImageViewer from '../vtkImageViewer';
// react
import React from 'react';

export default class ImageViewer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.container = React.createRef();
    this.imageViewer = vtkImageViewer.newInstance();
    this.imageViewer.setInputData(this.props.inputData);
    this.imageViewer.setSliceOrientation(this.props.sliceOrientation);
    // this.imageViewer.getInteractor().setInteractorStyle(this.props.style);
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(nextProps === null)
    {
      return false;
    }
    this.imageViewer.setInputData(nextProps.inputData);
    this.imageViewer.setSliceOrientation(nextProps.sliceOrientation);
    return true;
  }

  render()
  {
    this.imageViewer.render();
    return <div ref={this.container}></div>
  }

  componentDidMount()
  {
    this.imageViewer.setContainer(this.container.current);
    this.imageViewer.resize();
  }
}