// me
import vtkVolumeViewer from '../vtkVolumeViewer';
// react
import React from 'react';

export default class VolumeViewer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.container  = React.createRef();
    this.volumeViewer = vtkVolumeViewer.newInstance();
    this.volumeViewer.setInputData(this.props.inputData);
    this.volumeViewer.setPreset(this.props.preset);
    this.volumeViewer.getInteractor().setInteractorStyle(this.props.style);
    this.props.style.setViewer(this.volumeViewer);
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(nextProps === null)
    {
      return false;
    }
    this.volumeViewer.setInputData(nextProps.inputData);
    this.volumeViewer.setPreset(nextProps.preset);
    this.volumeViewer.getInteractor().setInteractorStyle(this.props.style);
    nextProps.style.setViewer(this.volumeViewer);
    return true;
  }

  render()
  {
    this.volumeViewer.render();
    return <div ref={this.container}></div>
  }

  componentDidMount()
  {
    this.volumeViewer.setContainer(this.container.current);
    this.volumeViewer.resize();
  }
}