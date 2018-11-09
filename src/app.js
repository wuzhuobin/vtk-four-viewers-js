// react 
import React from 'react'
// vtk
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource'
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
// image
import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader'
import vtkRTAnalyticSource from 'vtk.js/Sources/Filters/Sources/RTAnalyticSource';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
// itk 
import itkReadImageLocalFile from 'itk/readImageLocalFile'
import itkReadImageFile from 'itk/readImageFile'
// import itkReadImageArrayBuffer from 'itk/readImageArrayBuffer';
// vtkITKImageReader.setReadImageArrayBufferFromITK(itkReadImageArrayBuffer);
export default class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.divRef = React.createRef();
    }

    render()
    {
        return React.createElement('div', {ref: this.divRef});
    }

    componentDidMount()
    {
        // const itkImageReader = vtkITKImageReader.newInstance();
        // itkImageReader.setFileName('C:/Users/jieji/Desktop/T2propeller&MRA/T2/IMG-0001-00001.dcm');
        itkReadImageLocalFile('C:/Users/jieji/Desktop/T2propeller&MRA/T2/IMG-0001-00001.dcm');

        const rtSource = vtkRTAnalyticSource.newInstance();
        rtSource.setWholeExtent(0, 20, 0, 20, 0, 20);
        rtSource.setCenter(100, 100, 100);
        rtSource.setStandardDeviation(0.3);
        const imageMapper = vtkImageMapper.newInstance();
        imageMapper.setInputConnection(rtSource.getOutputPort());
        imageMapper.setSliceAtFocalPoint(true);
        // imageMapper.setSlicingMode(SlicingMode.Z);
        imageMapper.setZSlice(5);
        const imageSlice = vtkImageSlice.newInstance();
        imageSlice.getProperty().setColorWindow(255);
        imageSlice.getProperty().setColorLevel(127);
        // Uncomment this if you want to use a fixed colorwindow/level
        // imageSlice.getProperty().setRGBTransferFunction(rgb);
        // imageSlice.getProperty().setScalarOpacity(ofun);
        imageSlice.setMapper(imageMapper);

        const coneSource = vtkConeSource.newInstance();
        const mapper = vtkMapper.newInstance();
        mapper.setInputConnection(coneSource.getOutputPort());
        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);

        const renderer = vtkRenderer.newInstance();
        renderer.addActor(actor);
        renderer.addActor(imageSlice);
        renderer.setBackground([0,0,0]);
        renderer.resetCamera();
        renderer.resetCameraClippingRange();
        // 
        const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
        openGLRenderWindow.setContainer(this.divRef.current);
        const {width, height} = this.divRef.current.getBoundingClientRect();
        openGLRenderWindow.setSize(width, height);
        const renderWindow = vtkRenderWindow.newInstance();
        renderWindow.addRenderer(renderer);
        renderWindow.addView(openGLRenderWindow);
        const interactorStyle = vtkInteractorStyleTrackballCamera.newInstance();
        const interactor = vtkRenderWindowInteractor.newInstance();
        interactor.setView(openGLRenderWindow);
        interactor.setInteractorStyle(interactorStyle);
        interactor.initialize();
        interactor.bindEvents(this.divRef.current);
        
    }
}