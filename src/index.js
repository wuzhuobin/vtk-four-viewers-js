// react
import React from 'react'
import ReactDOM from 'react-dom'
// me 
import ReactApp from './ReactApp'
const body = document.createElement('body');
const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);
document.getElementsByTagName('html')[0].appendChild(body);
// // ReactDOM.render(
// //     React.createElement(App),
// //     root
// // );
ReactDOM.render(<ReactApp/>, root);

// import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
// import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
// import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
// import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
// import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
// import vtkHttpDataAccessHelper from 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';
// import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader'
// // itk 
// import itkReadImageArrayBuffer from 'itk/readImageArrayBuffer';
// vtkITKImageReader.setReadImageArrayBufferFromITK(itkReadImageArrayBuffer);
// // ----------------------------------------------------------------------------
// // Standard rendering code setup
// // ----------------------------------------------------------------------------

// const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
//   background: [0, 0, 0],
// });
// const renderer = fullScreenRenderer.getRenderer();
// const renderWindow = fullScreenRenderer.getRenderWindow();

// // ----------------------------------------------------------------------------
// // Example code
// // ----------------------------------------------------------------------------
// // Server is not sending the .gz and whith the compress header
// // Need to fetch the true file name and uncompress it locally
// // ----------------------------------------------------------------------------

// const actor = vtkVolume.newInstance();
// const mapper = vtkVolumeMapper.newInstance();
// mapper.setSampleDistance(0.7);
// actor.setMapper(mapper);

// // create color and opacity transfer functions
// const ctfun = vtkColorTransferFunction.newInstance();
// ctfun.addRGBPoint(200.0, 0.4, 0.2, 0.0);
// ctfun.addRGBPoint(2000.0, 1.0, 1.0, 1.0);
// const ofun = vtkPiecewiseFunction.newInstance();
// ofun.addPoint(200.0, 0.0);
// ofun.addPoint(1200.0, 0.5);
// ofun.addPoint(3000.0, 0.8);
// actor.getProperty().setRGBTransferFunction(0, ctfun);
// actor.getProperty().setScalarOpacity(0, ofun);
// actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
// actor.getProperty().setInterpolationTypeToLinear();
// actor.getProperty().setUseGradientOpacity(0, true);
// actor.getProperty().setGradientOpacityMinimumValue(0, 15);
// actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
// actor.getProperty().setGradientOpacityMaximumValue(0, 100);
// actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
// actor.getProperty().setShade(true);
// actor.getProperty().setAmbient(0.2);
// actor.getProperty().setDiffuse(0.7);
// actor.getProperty().setSpecular(0.3);
// actor.getProperty().setSpecularPower(8.0);

// const reader = vtkITKImageReader.newInstance();

// mapper.setInputConnection(reader.getOutputPort());

// // we first load a small dataset 64x64x91
// const fileName = 'T2.nii';
// vtkHttpDataAccessHelper.fetchBinary(fileName).then((arrayBuffer) => {
//     reader.setFileName(fileName);
//     reader.update();
//     reader.parseAsArrayBuffer(arrayBuffer).then(() => {
//         reader.update();
//         renderer.addVolume(actor);
//         renderer.resetCamera();
//         renderWindow.render();
//     }
//     );
// }
// );

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------